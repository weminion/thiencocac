// Công Đức — Section chính (hero + rituals + shop + log) và Page view

const { useState: useStateSec, useEffect: useEffectSec } = React;

// ─────────────────────────────────────────────────────────
// HERO — Hoa sen + balance + streak
// ─────────────────────────────────────────────────────────

function CongDucHero() {
  const { state } = useCongDuc();
  const streakDisplay = Math.min(state.streak, 7);

  return (
    <div className="relative bg-gradient-to-br from-ink-2 via-ink-3 to-ink-2 border border-gold/30 overflow-hidden">
      <span className="absolute -top-px -left-px w-6 h-6 border-t border-l border-gold"></span>
      <span className="absolute -top-px -right-px w-6 h-6 border-t border-r border-gold"></span>
      <span className="absolute -bottom-px -left-px w-6 h-6 border-b border-l border-gold"></span>
      <span className="absolute -bottom-px -right-px w-6 h-6 border-b border-r border-gold"></span>

      {/* background glyph */}
      <div className="absolute -right-8 -bottom-10 font-brush text-[220px] text-gold/[0.04] select-none pointer-events-none">功德</div>
      <div className="absolute -left-4 top-4 font-brush text-[80px] text-gold/[0.05] select-none pointer-events-none">蓮</div>

      <div className="relative grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 p-6 md:p-10 items-center">
        {/* LOTUS */}
        <div className="flex justify-center">
          <div className="relative">
            <LotusStreak streak={streakDisplay} size={220}/>
            {/* vòng tròn xoay chậm */}
            <div className="absolute inset-[-20px] border border-gold/15 rounded-full pointer-events-none"
                 style={{ animation: 'rotate 120s linear infinite' }}>
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold/60 font-brush text-xs">卯</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-gold/60 font-brush text-xs">酉</span>
              <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 text-gold/60 font-brush text-xs">子</span>
              <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-gold/60 font-brush text-xs">午</span>
            </div>
          </div>
        </div>

        {/* TEXT */}
        <div>
          <div className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-gold font-medium mb-2">Thiện tâm · Tu dưỡng</div>
          <h2 className="font-serif text-[28px] md:text-[40px] text-cream font-medium leading-tight mb-3">
            Công Đức của <span className="italic bg-gradient-to-br from-gold-bright to-gold-deep bg-clip-text text-transparent">Minh</span>
          </h2>
          <p className="text-sm md:text-[15px] text-cream-dim leading-relaxed max-w-xl mb-6 italic">
            "Tích thiện chi gia, tất hữu dư khánh" — mỗi ngày thêm một phần tâm an, hoa sen nở thêm một cánh.
          </p>

          <div className="flex flex-wrap gap-6 md:gap-10">
            <div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-cream-dim mb-1">Số dư</div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-4xl md:text-5xl font-medium bg-gradient-to-br from-gold-bright to-gold bg-clip-text text-transparent">
                  {state.balance.toLocaleString('vi-VN')}
                </span>
                <span className="font-brush text-gold text-xl">功</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-cream-dim mb-1">Chuỗi hiện tại</div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-4xl md:text-5xl text-cream font-medium">{state.streak}</span>
                <span className="text-sm text-cream-dim">ngày</span>
              </div>
              <div className="text-[11px] text-gold-bright/80 mt-0.5">Kỷ lục: {state.longestStreak}</div>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-cream-dim mb-1">Tổng đã tích</div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-4xl md:text-5xl text-cream font-medium">{state.totalEarned.toLocaleString('vi-VN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// DAILY RITUALS
// ─────────────────────────────────────────────────────────

function DailyRituals({ onOpenIncense, onOpenMeditation }) {
  const { state, completeRitual } = useCongDuc();
  const today = new Date();
  const lunarRamMung1 = today.getDate() === 1 || today.getDate() === 15; // giả lập

  const handleCheckin = () => {
    if (state.rituals.checkin) return;
    completeRitual('checkin', 10, 'Điểm danh hàng ngày');
  };
  const handleFasting = () => {
    if (state.rituals.fasting === 'done') return;
    completeRitual('fasting', 25, 'Ăn chay ngày Rằm/Mùng 1');
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-4 gap-4">
        <div>
          <div className="text-[11px] tracking-[0.25em] uppercase text-gold font-medium mb-1">Nghi thức hàng ngày</div>
          <h3 className="font-serif text-2xl text-cream font-medium">Bốn việc tu tâm</h3>
        </div>
        <div className="text-[11px] text-cream-dim italic">
          {['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'][today.getDay()]}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <RitualCard
          glyph="到"
          title="Điểm danh sáng sớm"
          subtitle="Chạm một cái để khởi ngày mới an lành"
          reward={10}
          done={state.rituals.checkin}
          onClick={handleCheckin}
        />
        <RitualCard
          glyph="香"
          title="Đốt nén hương"
          subtitle="Thắp hương, tịnh tâm trong 8 giây"
          reward={15}
          done={state.rituals.incense}
          onClick={onOpenIncense}
        />
        <RitualCard
          glyph="禪"
          title="Thiền niệm"
          subtitle="Ngồi tĩnh lặng 5-15 phút trọn vẹn"
          reward={20}
          done={state.rituals.meditation}
          onClick={onOpenMeditation}
        />
        <RitualCard
          glyph="齋"
          title="Ăn chay ngày Rằm, Mùng 1"
          subtitle="Hôm nay không phải Rằm/Mùng 1 âm lịch"
          reward={25}
          done={state.rituals.fasting === 'done'}
          disabled={!lunarRamMung1 && state.rituals.fasting !== 'done'}
          disabledReason="Chỉ khả dụng vào Rằm hoặc Mùng 1 âm lịch"
          onClick={handleFasting}
        />
      </div>

      {/* streak bonus indicator */}
      <div className="mt-4 flex items-center gap-3 px-4 py-3 border border-gold/15 bg-ink-2/50">
        <span className="font-brush text-gold text-xl">續</span>
        <div className="flex-1">
          <div className="text-[11px] tracking-[0.2em] uppercase text-gold font-medium">Thưởng chuỗi</div>
          <div className="text-[13px] text-cream-dim">
            Hoàn tất 7 ngày liên tiếp được <span className="text-gold-bright font-medium">+50 công đức</span> và mở hoa sen viên mãn.
          </div>
        </div>
        <div className="text-xs text-cream-dim tabular-nums">{state.streak}/7</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SHOP — Mở khóa tính năng
// ─────────────────────────────────────────────────────────

const SHOP_ITEMS = [
  { key:'deepLuanGiai',   glyph:'運', name:'Luận giải vận niên sâu',      desc:'AI bình giải chi tiết 12 tháng vận niên, có hành động khuyên dùng cho từng giai đoạn.', price:80 },
  { key:'detailedHours',  glyph:'時', name:'Giờ cát hung chi tiết',        desc:'Xem lý do từng giờ tốt/xấu, việc nên làm trong từng khung 2 tiếng.', price:50 },
  { key:'weddingDate',    glyph:'婚', name:'Ngày tốt cho sự kiện lớn',     desc:'Tra ngày cưới hỏi, khai trương, động thổ — tổng hợp 30 ngày cát nhất.', price:120 },
  { key:'extraChart',     glyph:'命', name:'Thêm lá số thứ 6',            desc:'Vượt quota 5 lá số miễn phí, thêm người thân hoặc đối tác.', price:150 },
  { key:'consultVoucher', glyph:'師', name:'Voucher tư vấn 1-1',          desc:'Giảm 30% phiên tư vấn 60 phút với thầy Minh Châu.', price:200 },
];

function ShopGrid() {
  const { state, spend } = useCongDuc();
  return (
    <div>
      <div className="flex items-end justify-between mb-4 gap-4">
        <div>
          <div className="text-[11px] tracking-[0.25em] uppercase text-gold font-medium mb-1">Hồi hướng công đức</div>
          <h3 className="font-serif text-2xl text-cream font-medium">Dùng công đức mở tính năng</h3>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {SHOP_ITEMS.map(item => {
          const owned = state.unlocked[item.key];
          const affordable = state.balance >= item.price;
          return (
            <div key={item.key}
              className={`relative bg-ink-2 border p-5 transition-all ${
                owned ? 'border-emerald-500/30' : 'border-gold/20'
              }`}>
              <div className="flex items-start gap-4">
                <div className={`font-brush text-4xl w-14 h-14 flex items-center justify-center border flex-shrink-0 ${
                  owned ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/5'
                        : 'text-gold border-gold/30 bg-ink'
                }`}>{owned ? '✓' : item.glyph}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-serif text-lg text-cream font-medium leading-tight">{item.name}</h4>
                    {owned && <span className="text-[9px] tracking-[0.18em] uppercase text-emerald-400 border border-emerald-500/30 px-1.5 py-px">Đã mở</span>}
                  </div>
                  <p className="text-[12.5px] text-cream-dim leading-snug mb-3">{item.desc}</p>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-brush text-gold text-sm">功</span>
                      <span className={`text-sm font-medium tabular-nums ${owned ? 'text-cream-dim line-through' : 'text-gold-bright'}`}>
                        {item.price}
                      </span>
                    </div>
                    {!owned && (
                      <button
                        disabled={!affordable}
                        onClick={() => affordable && spend(item.price, item.key)}
                        className={`px-4 py-1.5 text-[11px] tracking-[0.18em] uppercase font-medium transition-colors ${
                          affordable
                            ? 'bg-gradient-to-br from-gold-bright to-gold text-ink hover:from-gold hover:to-gold-deep'
                            : 'bg-ink-3 text-cream-dim/60 border border-gold/15 cursor-not-allowed'
                        }`}>
                        {affordable ? 'Hồi hướng' : `Cần thêm ${item.price - state.balance}`}
                      </button>
                    )}
                    {owned && (
                      <button className="px-4 py-1.5 text-[11px] tracking-[0.18em] uppercase text-gold-bright border border-gold/30 hover:border-gold">Sử dụng →</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// LOG + CÚNG DƯỜNG
// ─────────────────────────────────────────────────────────

function CongDucLog() {
  const { state } = useCongDuc();
  return (
    <div className="bg-ink-2 border border-gold/20 p-6">
      <div className="text-[11px] tracking-[0.25em] uppercase text-gold font-medium mb-1">Sổ công đức</div>
      <h4 className="font-serif text-xl text-cream font-medium mb-4">Những việc gần đây</h4>
      <ul className="divide-y divide-gold/10 max-h-[320px] overflow-y-auto pr-1">
        {state.log.slice(0, 15).map((l, i) => (
          <li key={i} className="flex items-center gap-3 py-2.5">
            <div className="text-[11px] text-cream-dim w-10 shrink-0 tabular-nums">{l.date}</div>
            <div className="flex-1 text-[13px] text-cream leading-snug">{l.action}</div>
            <div className={`text-[13px] font-medium tabular-nums shrink-0 ${l.amount > 0 ? 'text-gold-bright' : 'text-red-300/90'}`}>
              {l.amount > 0 ? `+${l.amount}` : l.amount}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CungDuongQuiet({ onClick }) {
  return (
    <button onClick={onClick}
      className="group flex items-center gap-3 text-cream-dim hover:text-gold-bright transition-colors text-left py-3">
      <span className="font-brush text-2xl text-gold/70 group-hover:text-gold">香</span>
      <div>
        <div className="text-[11px] tracking-[0.22em] uppercase">Cúng dường</div>
        <div className="text-[13px] italic">để nhận thêm công đức, hộ trì trang tri thức này</div>
      </div>
      <span className="text-gold/50 group-hover:text-gold ml-1">→</span>
    </button>
  );
}

function CungDuongModal({ open, onClose }) {
  if (!open) return null;
  const tiers = [
    { amount: 50000,  duc: 300,  label: 'Tiểu cúng dường' },
    { amount: 100000, duc: 650,  label: 'Trung cúng dường', popular: true },
    { amount: 200000, duc: 1500, label: 'Đại cúng dường' },
  ];
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/85 backdrop-blur-md animate-fade-up"
         onClick={onClose}>
      <div className="relative bg-gradient-to-b from-ink-2 to-ink-3 border border-gold/40 max-w-lg w-full p-8"
           onClick={e => e.stopPropagation()}>
        <span className="absolute -top-px -left-px w-5 h-5 border-t border-l border-gold"></span>
        <span className="absolute -bottom-px -right-px w-5 h-5 border-b border-r border-gold"></span>

        <div className="text-center mb-6">
          <div className="font-brush text-gold text-3xl mb-1">香 · 供</div>
          <h3 className="font-serif text-2xl text-cream font-medium mb-1">Cúng dường</h3>
          <p className="text-[13px] text-cream-dim italic max-w-sm mx-auto">
            Chút tâm thành giúp duy trì Thiên Cơ Các — và nhận lại công đức để dùng vào tính năng.
          </p>
        </div>

        <div className="space-y-2.5">
          {tiers.map(t => (
            <button key={t.amount}
              className={`w-full flex items-center justify-between gap-4 p-4 border transition-all group ${
                t.popular ? 'border-gold bg-gold/5 hover:bg-gold/10' : 'border-gold/25 hover:border-gold/60'
              }`}>
              <div className="flex items-center gap-3">
                <span className="font-brush text-gold text-2xl">願</span>
                <div className="text-left">
                  <div className="font-serif text-lg text-cream">{t.label}</div>
                  <div className="text-[12px] text-gold-bright">+{t.duc.toLocaleString('vi-VN')} công đức</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-serif text-xl text-cream-dim group-hover:text-gold-bright tabular-nums">
                  {t.amount.toLocaleString('vi-VN')}đ
                </div>
                {t.popular && <div className="text-[9px] tracking-[0.2em] uppercase text-gold">Phổ biến</div>}
              </div>
            </button>
          ))}
        </div>

        <p className="text-[11px] text-cream-dim/70 italic text-center mt-5 leading-snug">
          Cúng dường không thay thế nghi thức hàng ngày — công đức thật nhất vẫn đến từ tâm an và thiện hạnh.
        </p>

        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-cream-dim hover:text-gold-bright">✕</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// CONG DUC PAGE (main view)
// ─────────────────────────────────────────────────────────

function CongDucPage() {
  const [incenseOpen, setIncenseOpen] = useStateSec(false);
  const [medOpen, setMedOpen] = useStateSec(false);
  const [cungOpen, setCungOpen] = useStateSec(false);
  const { completeRitual } = useCongDuc();

  return (
    <div className="p-5 md:p-10 md:pt-8 space-y-6 md:space-y-8">
      <CongDucHero/>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 md:gap-8">
        <div className="space-y-6 md:space-y-8 min-w-0">
          <DailyRituals
            onOpenIncense={() => setIncenseOpen(true)}
            onOpenMeditation={() => setMedOpen(true)}
          />
          <ShopGrid/>
        </div>
        <div className="space-y-6">
          <CongDucLog/>
          <div className="border-t border-gold/15 pt-2">
            <CungDuongQuiet onClick={() => setCungOpen(true)}/>
          </div>
        </div>
      </div>

      <IncenseRitual
        open={incenseOpen}
        onClose={() => setIncenseOpen(false)}
        onComplete={() => {
          completeRitual('incense', 15, 'Đốt nhang buổi sáng');
          setTimeout(() => setIncenseOpen(false), 200);
        }}
      />
      <MeditationTimer
        open={medOpen}
        onClose={() => setMedOpen(false)}
        onComplete={() => {
          completeRitual('meditation', 20, 'Thiền niệm trọn vẹn');
          setTimeout(() => setMedOpen(false), 200);
        }}
      />
      <CungDuongModal open={cungOpen} onClose={() => setCungOpen(false)}/>
    </div>
  );
}

Object.assign(window, { CongDucPage, CungDuongQuiet, CungDuongModal });
