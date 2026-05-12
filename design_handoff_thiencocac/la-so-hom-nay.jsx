// Lịch Tu Hôm Nay — replaces "Lá số hôm nay"
// Thuần Phật pháp: Câu kệ ngày · Việc nên/tránh · Giờ tu · Lịch âm · Chia sẻ thiệp

const { useState: useLSS } = React;

const LS_USER = { name: 'Nguyễn Minh', practice: 'Tịnh độ' };

// Mỗi ngày 1 câu kệ — chọn theo dayOfYear
const LS_VERSES = [
  { glyph: 'An', label: 'An lạc',
    quote: 'Hơi thở vào, biết hơi thở vào. Hơi thở ra, mỉm cười.',
    source: '— Thiền sư Thích Nhất Hạnh', color: '#e6b85a' },
  { glyph: 'Từ', label: 'Từ bi',
    quote: 'Nguyện cho mọi loài được an vui. Nguyện cho mọi loài thoát khổ.',
    source: '— Kinh Từ Bi', color: '#c89a5a' },
  { glyph: 'Tâm', label: 'Tỉnh thức',
    quote: 'Tâm bình thì thế giới bình. Không gì là thường, không gì là chắc.',
    source: '— Kinh Kim Cang', color: '#7ca85a' },
  { glyph: 'Vô', label: 'Vô thường',
    quote: 'Hôm nay đã trôi qua, mạng sống cũng giảm theo. Hãy sống cho tỉnh thức.',
    source: '— Kệ chiều', color: '#5aa3c8' },
  { glyph: 'Buông', label: 'Buông xả',
    quote: 'Cái gì sinh ra ắt sẽ diệt. Buông được, lòng nhẹ tựa mây.',
    source: '— Kinh Pháp Cú', color: '#c87a5a' }
];

function pickToday() {
  const now = new Date();
  const seed = (now.getFullYear() * 366 + now.getMonth() * 31 + now.getDate()) % LS_VERSES.length;
  return LS_VERSES[seed];
}

const LS_TODAY_FULL = {
  date: 'Thứ Ba, 12/05/2026',
  short: '12.05.2026',
  lunar: 'Mồng 26 tháng 3 nhuận âm · Ngày Phật Đản sắp tới',
  good: ['Niệm Phật 108 hạt', 'Phóng sinh', 'Đọc kinh Pháp Cú', 'Hồi hướng cho cha mẹ'],
  bad: ['Sát sinh', 'Vọng ngữ', 'Sân hận'],
  goodHours: [
    { label: 'Sáng sớm', range: '4–6h', why: 'Khí thanh, định tâm dễ' },
    { label: 'Trưa', range: '11–13h', why: 'Hợp tụng kinh' },
    { label: 'Tối', range: '20–22h', why: 'Hợp thiền & hồi hướng' }
  ],
  upcoming: { label: 'Rằm tháng 4 · Phật Đản', daysLeft: 8 }
};

function LSShareCardPreview({ user, verse, today, code }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-ink-3 via-ink-2 to-ink border border-gold/40 aspect-[4/5]"
         style={{ boxShadow: '0 20px 60px -20px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(212,160,74,0.1)' }}>
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(circle at 25% 20%, #d4a04a 0px, transparent 55%), radial-gradient(circle at 80% 85%, #c87a5a 0px, transparent 50%)' }}></div>
      <div className="absolute -top-4 -right-4 font-brush leading-none select-none pointer-events-none"
           style={{ fontSize: '180px', color: 'rgba(212,160,74,0.06)' }}>{verse.glyph}</div>

      <span className="absolute -top-px -left-px w-4 h-4 border-t border-l border-gold pointer-events-none"></span>
      <span className="absolute -top-px -right-px w-4 h-4 border-t border-r border-gold pointer-events-none"></span>
      <span className="absolute -bottom-px -left-px w-4 h-4 border-b border-l border-gold pointer-events-none"></span>
      <span className="absolute -bottom-px -right-px w-4 h-4 border-b border-r border-gold pointer-events-none"></span>

      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-bright to-gold-deep flex items-center justify-center text-ink font-brush text-[10px]">An</div>
          <div className="text-[9px] tracking-[0.25em] uppercase text-gold font-medium">Thiên Cơ Các</div>
        </div>
        <div className="text-[9px] tracking-[0.2em] text-cream-dim">{today.short}</div>
      </div>

      <div className="absolute inset-x-0 top-12 bottom-12 px-5 flex flex-col">
        <div className="text-[8px] tracking-[0.3em] uppercase text-gold font-medium">Lịch tu hôm nay</div>
        <div className="font-serif text-[18px] text-cream font-semibold mt-1 leading-tight">{user.name}</div>
        <div className="text-[10px] text-cream-dim mt-0.5">{today.lunar}</div>

        <div className="my-3 border-t border-gold/20"></div>

        <div className="text-center">
          <div className="font-brush leading-none drop-shadow-[0_0_24px_rgba(230,184,90,0.5)]"
               style={{ fontSize: '60px', color: verse.color }}>{verse.glyph}</div>
          <div className="font-serif text-[20px] text-cream font-semibold mt-2 italic">{verse.label}</div>
          <div className="text-[11px] text-cream leading-relaxed mt-2 px-2 text-balance italic">"{verse.quote}"</div>
          <div className="text-[9px] text-gold/80 mt-2 tracking-wider">{verse.source}</div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-1.5 text-[9px]">
          <div className="bg-ink/50 border border-gold/15 p-2">
            <div className="text-emerald-300/80 mb-1 tracking-widest text-[7px] uppercase">Nên</div>
            <div className="text-cream leading-snug">{today.good.slice(0, 2).join(' · ')}</div>
          </div>
          <div className="bg-ink/50 border border-gold/15 p-2">
            <div className="text-red/80 mb-1 tracking-widest text-[7px] uppercase">Tránh</div>
            <div className="text-cream leading-snug">{today.bad.slice(0, 2).join(' · ')}</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[7px] text-cream-dim/70 tracking-wider">
        <span>thienco.cac</span>
        <span>Mã: {code}</span>
      </div>
    </div>
  );
}

function LSShareModal({ open, onClose, user, verse, today, code, onShare }) {
  if (!open) return null;
  const shares = [
    { id: 'save', icon: '⤓', label: 'Lưu ảnh', desc: '+5 công đức · Tải PNG' },
    { id: 'zalo', icon: 'Z', label: 'Zalo', desc: '+5 công đức · Gửi cho bạn' },
    { id: 'facebook', icon: 'f', label: 'Facebook', desc: '+5 công đức · Đăng feed' },
    { id: 'messenger', icon: 'M', label: 'Messenger', desc: '+5 công đức · Chat riêng' },
    { id: 'copy', icon: '⎘', label: 'Sao chép link', desc: '+3 công đức · Dán bất kỳ đâu' }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-ink/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-fade-up overflow-y-auto" onClick={onClose}>
      <div className="relative bg-ink-2 border border-gold/30 max-w-[820px] w-full grid md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] gap-0" onClick={e => e.stopPropagation()}>
        <span className="absolute -top-px -left-px w-5 h-5 border-t border-l border-gold pointer-events-none"></span>
        <span className="absolute -top-px -right-px w-5 h-5 border-t border-r border-gold pointer-events-none"></span>
        <span className="absolute -bottom-px -left-px w-5 h-5 border-b border-l border-gold pointer-events-none"></span>
        <span className="absolute -bottom-px -right-px w-5 h-5 border-b border-r border-gold pointer-events-none"></span>

        <button onClick={onClose} className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center text-cream-dim hover:text-gold-bright text-xl z-10">✕</button>

        <div className="p-6 md:p-8 bg-gradient-to-br from-ink-3/50 to-ink border-b md:border-b-0 md:border-r border-gold/15">
          <div className="text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-3 text-center">Xem trước thiệp</div>
          <LSShareCardPreview user={user} verse={verse} today={today} code={code}/>
        </div>

        <div className="p-6 md:p-8">
          <div className="text-[11px] tracking-[0.3em] uppercase text-gold font-medium">Chia sẻ với bạn</div>
          <div className="font-serif text-[22px] text-cream font-semibold mt-1 leading-tight">
            Gieo <span className="italic bg-gradient-to-br from-gold-bright to-gold-deep bg-clip-text text-transparent">an lạc</span> đến mọi người
          </div>
          <div className="text-[12px] text-cream-dim mt-1.5 leading-relaxed">
            Mỗi lượt chia sẻ giúp một người bạn — và bồi cho chính bạn 5 công đức.
          </div>

          <div className="mt-5 space-y-2">
            {shares.map(s => (
              <button key={s.id} onClick={() => onShare(s)}
                className="w-full flex items-center gap-3 bg-ink-3/50 hover:bg-ink-3 border border-gold/20 hover:border-gold/50 p-3 transition-all group text-left">
                <span className="w-10 h-10 shrink-0 rounded-full border border-gold/40 flex items-center justify-center font-serif text-lg text-gold-bright group-hover:bg-gold/10">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] text-cream font-medium leading-tight">{s.label}</div>
                  <div className="text-[11px] text-cream-dim leading-tight mt-0.5">{s.desc}</div>
                </div>
                <span className="text-cream-dim group-hover:text-gold-bright text-lg">→</span>
              </button>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-gold/15 flex items-center gap-3 bg-gold/[0.04] -mx-2 px-3 py-2.5">
            <span className="font-brush text-2xl text-gold leading-none">Duyên</span>
            <div className="text-[11px] text-cream-dim leading-snug flex-1">
              <span className="text-cream">Bạn của bạn</span> sẽ nhận câu kệ riêng — và một lời mời nhẹ vào Thiên Cơ Các.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LaSoHomNayCard() {
  const user = LS_USER;
  const verse = pickToday();
  const today = LS_TODAY_FULL;
  const code = `TCC·26·0512`;
  const [shareOpen, setShareOpen] = useLSS(false);
  const [shared, setShared] = useLSS(false);
  const cd = window.useCongDuc ? window.useCongDuc() : null;

  const handleShare = (option) => {
    setShareOpen(false);
    setShared(true);
    if (cd && cd.earn) cd.earn(option.id === 'copy' ? 3 : 5, `Chia sẻ câu kệ · ${option.label}`);
    setTimeout(() => setShared(false), 3000);
  };

  return (
    <div className="relative bg-gradient-to-br from-ink-2 to-ink-3 border border-gold/40 overflow-hidden">
      <span className="absolute -top-px -left-px w-5 h-5 border-t border-l border-gold pointer-events-none"></span>
      <span className="absolute -top-px -right-px w-5 h-5 border-t border-r border-gold pointer-events-none"></span>
      <span className="absolute -bottom-px -left-px w-5 h-5 border-b border-l border-gold pointer-events-none"></span>
      <span className="absolute -bottom-px -right-px w-5 h-5 border-b border-r border-gold pointer-events-none"></span>

      <div className="absolute -top-8 -right-6 font-brush leading-none select-none pointer-events-none"
           style={{ fontSize: '200px', color: `${verse.color}10` }}>{verse.glyph}</div>

      <div className="relative grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-0">
        <div className="p-5 md:p-7 border-b md:border-b-0 md:border-r border-gold/15">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-gold font-medium">Lịch Tu Hôm Nay</div>
              <div className="font-serif text-[22px] md:text-[26px] text-cream font-semibold mt-1 leading-tight">{today.date}</div>
              <div className="font-serif italic text-gold-bright text-[14px] mt-1">{today.lunar}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[9px] tracking-widest uppercase text-cream-dim mb-1">Cho</div>
              <div className="font-serif text-[15px] text-cream font-medium leading-tight">{user.name}</div>
              <div className="text-[10px] text-gold mt-0.5">Pháp môn {user.practice}</div>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-ink-3/80 to-ink/60 border border-gold/25 p-5 mb-4 flex items-center gap-5">
            <div className="shrink-0 text-center">
              <div className="font-brush leading-none drop-shadow-[0_0_20px_rgba(230,184,90,0.4)]"
                   style={{ fontSize: '64px', color: verse.color }}>{verse.glyph}</div>
              <div className="font-serif text-[16px] text-cream font-semibold mt-1.5 italic">{verse.label}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] tracking-[0.25em] uppercase text-gold font-medium">Câu kệ hôm nay</div>
              <div className="font-serif text-[16px] md:text-[18px] text-cream mt-2 leading-snug italic text-balance">"{verse.quote}"</div>
              <div className="text-[11px] text-gold/80 mt-2 tracking-wider">{verse.source}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-emerald-400/90 mb-2 font-medium flex items-center gap-1.5">
                <span className="font-brush text-base text-emerald-400">Nên</span> Việc lành nên làm
              </div>
              <ul className="space-y-1.5">
                {today.good.map(g => (
                  <li key={g} className="text-[13px] text-cream flex items-start gap-2">
                    <span className="text-emerald-400 text-[10px] mt-1.5">◆</span>{g}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-red/90 mb-2 font-medium flex items-center gap-1.5">
                <span className="font-brush text-base text-red">Kỵ</span> Nên tránh
              </div>
              <ul className="space-y-1.5">
                {today.bad.map(b => (
                  <li key={b} className="text-[13px] text-cream flex items-start gap-2">
                    <span className="text-red text-[10px] mt-1.5">✕</span>{b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-3 border-t border-gold/15">
            <div className="text-[10px] tracking-[0.2em] uppercase text-gold mb-2 font-medium">Giờ tu tốt trong ngày</div>
            <div className="grid grid-cols-3 gap-2">
              {today.goodHours.map(h => (
                <div key={h.label} className="bg-emerald-500/[0.06] border border-emerald-500/30 px-2.5 py-2">
                  <div className="text-[12px] text-emerald-300 font-medium">{h.label} <span className="text-cream-dim font-normal">({h.range})</span></div>
                  <div className="text-[10px] text-cream-dim mt-0.5">{h.why}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming holiday */}
          <div className="mt-4 pt-3 border-t border-gold/15 flex items-center gap-3 bg-gold/[0.04] px-3 py-2.5">
            <span className="font-brush text-2xl text-gold-bright">Lễ</span>
            <div className="flex-1 text-[12px]">
              <div className="text-cream font-medium">{today.upcoming.label}</div>
              <div className="text-cream-dim text-[11px]">Còn {today.upcoming.daysLeft} ngày — chuẩn bị tâm thanh tịnh</div>
            </div>
          </div>
        </div>

        <div className="p-5 md:p-6 bg-gradient-to-br from-ink/30 to-ink-3/30 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] tracking-[0.3em] uppercase text-gold font-medium">Thiệp chia sẻ</div>
            <div className="text-[10px] text-cream-dim/70 italic">{code}</div>
          </div>

          <div className="flex-1 max-w-[280px] mx-auto w-full">
            <LSShareCardPreview user={user} verse={verse} today={today} code={code}/>
          </div>

          <div className="mt-4">
            <button onClick={() => setShareOpen(true)}
              className="w-full py-3 bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-ink font-semibold text-[13px] tracking-wide rounded-sm shadow-[0_8px_24px_-8px_rgba(212,160,74,0.5)] hover:-translate-y-px transition-all flex items-center justify-center gap-2.5">
              <span className="font-brush text-lg">Duyên</span>
              <span>Chia sẻ câu kệ · +5 công đức</span>
            </button>

            <div className="grid grid-cols-3 gap-1.5 mt-2">
              {[{ icon: '⤓', label: 'Lưu ảnh' }, { icon: 'Z', label: 'Zalo' }, { icon: 'f', label: 'Facebook' }].map(({ icon, label }) => (
                <button key={label} onClick={() => setShareOpen(true)}
                  className="flex items-center justify-center gap-1.5 py-2 bg-ink-3/50 border border-gold/20 hover:border-gold/60 hover:bg-ink-3 transition-all group">
                  <span className="w-5 h-5 rounded-full border border-gold/40 flex items-center justify-center font-serif text-[10px] text-gold-bright group-hover:bg-gold/10">{icon}</span>
                  <span className="text-[10px] text-cream-dim group-hover:text-cream">{label}</span>
                </button>
              ))}
            </div>

            {shared && (
              <div className="mt-2 text-[11px] text-emerald-300 text-center animate-fade-up">
                ✦ Đã chia sẻ — +5 công đức ghi vào sổ
              </div>
            )}
          </div>
        </div>
      </div>

      <LSShareModal open={shareOpen} onClose={() => setShareOpen(false)}
                    user={user} verse={verse} today={today} code={code}
                    onShare={handleShare}/>
    </div>
  );
}

window.LaSoHomNayCard = LaSoHomNayCard;
