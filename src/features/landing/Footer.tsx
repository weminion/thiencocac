import Image from 'next/image';

const COLS = [
  { t: 'Dịch vụ', items: ['Tử vi trọn đời', 'Phong thủy nhà ở', 'Xem ngày tốt', 'Hợp tuổi', 'Tư vấn 1-1'] },
  { t: 'Thư phòng', items: ['Tử vi 2026', 'Cổ pháp', 'Phong thủy', 'Chọn ngày'] },
  { t: 'Liên hệ', items: ['Hotline: 1900 86 86', 'Email: thinhgiao@thiencoca.vn', 'Zalo: @thiencoca', 'Phòng thỉnh giáo — Q.1, TP.HCM'] },
];

export default function Footer() {
  return (
    <footer className="bg-ink-2 border-t border-gold/40 px-5 md:px-10 pt-12 md:pt-20 pb-7 mt-16 md:mt-20">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 md:gap-20 pb-10 md:pb-14 border-b border-gold/20">
        <div className="flex gap-4 items-start">
          <Image src="/logo.jpg" alt="Thiên Cơ Các" width={56} height={56} className="w-14 h-14 rounded-full object-cover border border-gold" />
          <div>
            <div className="font-serif text-2xl font-medium text-cream mb-1">Thiên Cơ Các</div>
            <div className="font-serif italic text-gold text-sm">天機閣 · Nơi thiên cơ gặp nhân duyên</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
          {COLS.map(col => (
            <div key={col.t}>
              <div className="text-xs tracking-[0.2em] uppercase text-gold font-medium mb-4">{col.t}</div>
              {col.items.map(x => (
                <a key={x} className="block text-cream-dim text-sm py-1.5 cursor-pointer hover:text-gold-bright transition-colors">{x}</a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto mt-7 flex justify-between text-xs text-cream-dim tracking-wide flex-wrap gap-3">
        <div>© 2026 Thiên Cơ Các · 天機閣</div>
        <div className="flex gap-6">
          {['Điều khoản', 'Bảo mật', 'Chính sách hoàn phí'].map(x => (
            <a key={x} className="cursor-pointer hover:text-gold-bright transition-colors">{x}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
