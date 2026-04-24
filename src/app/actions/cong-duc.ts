'use server';

import { prisma } from '@/lib/prisma';
import { isFastingDay } from '@/lib/lunar';
import type { CongDucState, RitualKind, UnlockedFeatures } from '@/types/cong-duc';
import { UNLOCK_LABEL, UNLOCK_COST } from '@/types/cong-duc';
import type { RitualKind as PrismaRitualKind } from '@/lib/generated/prisma/client';

// ─── Helpers ─────────────────────────────────────────────

function todayVN(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function dateLabel(d: Date = new Date()): string {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

async function getOrCreate(userId: string) {
  return prisma.point.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

// ─── getCongDucState ──────────────────────────────────────

export async function getCongDucState(userId: string): Promise<CongDucState> {
  const [record, todayRituals, recentLog] = await Promise.all([
    getOrCreate(userId),
    prisma.dailyRitual.findMany({
      where: { userId, date: todayVN() },
    }),
    prisma.pointLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    }),
  ]);

  const doneKinds = new Set(todayRituals.map(r => r.kind));
  const fastingAvailable = isFastingDay();
  const fastingRecord = todayRituals.find(r => r.kind === 'fasting');

  return {
    balance: record.balance,
    totalEarned: record.totalEarned,
    streak: record.streak,
    longestStreak: record.longestStreak,
    lastCheckIn: record.lastCheckIn?.toISOString().split('T')[0] ?? null,
    rituals: {
      checkin: doneKinds.has('checkin'),
      incense: doneKinds.has('incense'),
      meditation: doneKinds.has('meditation'),
      fasting: fastingAvailable
        ? fastingRecord ? 'done' : null
        : null,
    },
    log: recentLog.map(l => ({
      date: l.dateLabel,
      action: l.action,
      amount: l.amount,
    })),
    unlocked: {
      extraChart: record.extraChart,
      deepLuanGiai: record.deepLuanGiai,
      detailedHours: record.detailedHours,
      weddingDate: record.weddingDate,
      consultVoucher: record.consultVoucher,
    },
  };
}

// ─── earnCongDuc ─────────────────────────────────────────

export async function earnCongDuc(
  userId: string,
  amount: number,
  action: string,
): Promise<void> {
  await prisma.$transaction([
    prisma.point.upsert({
      where: { userId },
      create: { userId, balance: amount, totalEarned: amount },
      update: { balance: { increment: amount }, totalEarned: { increment: amount } },
    }),
    prisma.pointLog.create({
      data: { userId, dateLabel: dateLabel(), action, amount },
    }),
  ]);
}

// ─── checkIn ─────────────────────────────────────────────

export async function checkIn(userId: string): Promise<{ streak: number; bonus: number }> {
  const record = await getOrCreate(userId);
  const today = todayVN();

  const existing = await prisma.dailyRitual.findUnique({
    where: { userId_date_kind: { userId, date: today, kind: 'checkin' } },
  });
  if (existing) return { streak: record.streak, bonus: 0 };

  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  const lastDate = record.lastCheckIn
    ? new Date(record.lastCheckIn.toISOString().split('T')[0])
    : null;
  const isConsecutive =
    lastDate?.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0];

  const newStreak = isConsecutive ? record.streak + 1 : 1;
  const newLongest = Math.max(record.longestStreak, newStreak);

  const streakBonus = newStreak % 7 === 0 ? 30 : 0;
  const baseReward = 10;
  const total = baseReward + streakBonus;
  const label = streakBonus > 0 ? `Điểm danh + thưởng chuỗi ${newStreak} ngày` : 'Điểm danh';

  await prisma.$transaction([
    prisma.dailyRitual.create({
      data: { userId, date: today, kind: 'checkin', reward: total, label },
    }),
    prisma.point.update({
      where: { userId },
      data: {
        balance: { increment: total },
        totalEarned: { increment: total },
        streak: newStreak,
        longestStreak: newLongest,
        lastCheckIn: today,
      },
    }),
    prisma.pointLog.create({
      data: { userId, dateLabel: dateLabel(), action: label, amount: total },
    }),
  ]);

  return { streak: newStreak, bonus: streakBonus };
}

// ─── completeRitual ───────────────────────────────────────

export async function completeRitual(
  userId: string,
  kind: RitualKind,
  reward: number,
  label: string,
): Promise<boolean> {
  const today = todayVN();

  const existing = await prisma.dailyRitual.findUnique({
    where: { userId_date_kind: { userId, date: today, kind: kind as PrismaRitualKind } },
  });
  if (existing) return false;

  await prisma.$transaction([
    prisma.dailyRitual.create({
      data: { userId, date: today, kind: kind as PrismaRitualKind, reward, label },
    }),
    prisma.point.upsert({
      where: { userId },
      create: { userId, balance: reward, totalEarned: reward },
      update: { balance: { increment: reward }, totalEarned: { increment: reward } },
    }),
    prisma.pointLog.create({
      data: { userId, dateLabel: dateLabel(), action: label, amount: reward },
    }),
  ]);

  return true;
}

// ─── spendCongDuc ─────────────────────────────────────────

export async function spendCongDuc(
  userId: string,
  featureKey: keyof UnlockedFeatures,
): Promise<{ success: boolean; message?: string }> {
  const record = await getOrCreate(userId);

  if (record[featureKey]) return { success: false, message: 'Đã mở khóa rồi' };

  const cost = UNLOCK_COST[featureKey];
  if (record.balance < cost) {
    return { success: false, message: `Không đủ công đức (cần ${cost}, còn ${record.balance})` };
  }

  const label = `Mở khóa: ${UNLOCK_LABEL[featureKey]}`;

  await prisma.$transaction([
    prisma.point.update({
      where: { userId },
      data: {
        balance: { decrement: cost },
        [featureKey]: true,
      },
    }),
    prisma.pointLog.create({
      data: { userId, dateLabel: dateLabel(), action: label, amount: -cost },
    }),
  ]);

  return { success: true };
}
