const POSTS = [
  { tag: 'Tử vi 2026', title: 'Mười hai con giáp năm Bính Ngọ: ai hanh thông, ai cần thủ?', excerpt: 'Năm 2026 Bính Ngọ — hành Thiên Thượng Hỏa. Luận vận từng tuổi theo thiên can địa chi, thái tuế, tam tai.', date: '18 · 04 · 2026', read: '12 phút', glyph: '運', big: true },
  { tag: 'Phong thủy', title: 'Bố trí bàn làm việc hút tài lộc theo mệnh', excerpt: 'Vị trí, hướng, vật phẩm phong thủy phù hợp với 5 mệnh Kim Mộc Thủy Hỏa Thổ.', date: '12 · 04 · 2026', read: '8 phút', glyph: '風' },
  { tag: 'Cổ pháp', title: 'Lục Thập Hoa Giáp: vì sao 60 năm một vòng?', excerpt: 'Giải mã nguyên lý phối hợp 10 thiên can và 12 địa chi tạo nên chu kỳ nạp âm huyền diệu.', date: '05 · 04 · 2026', read: '10 phút', glyph: '甲' },
  { tag: 'Chọn ngày', title: 'Tam nương sát là gì? Vì sao tránh cưới hỏi ngày này?', excerpt: 'Nguồn gốc tích cổ, cách tính ngày tam nương trong tháng, và khi nào có thể hóa giải.', date: '28 · 03 · 2026', read: '6 phút', glyph: '吉' },
];

export default function Blog() {
  return (
    <section id="blog" className="py-16 md:py-[120px] px-5 md:px-10 max-w-[1280px] mx-auto">
      <div className="flex items-end justify-between gap-6 md:gap-8 mb-10 md:mb-14 flex-wrap">
        <div>
          <div className="inline-block text-[10px] md:text-[12px] tracking-[0.3em] md:tracking-[0.35em] uppercase text-gold font-medium mb-4 md:mb-5 px-3 md:px-3.5 py-1.5 border border-gold/40 rounded-full">
            Thư Phòng
          </div>
          <h2 className="font-serif text-[30px] sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.1] font-medium tracking-tight text-cream">
            Luận <span className="italic bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">cổ pháp</span>,<br />
            bàn chuyện <span className="italic bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">đương thời</span>
          </h2>
        </div>
        <button className="inline-flex items-center gap-2.5 font-sans font-medium tracking-wide rounded-sm text-cream border border-gold/40 hover:border-gold hover:text-gold-bright px-[22px] py-3 text-sm transition-all">
          Đọc thêm bài viết →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {POSTS.map((p, i) => (
          <article key={i} className={`bg-ink-2 border border-gold/20 flex flex-col cursor-pointer transition-colors hover:border-gold/40 overflow-hidden ${p.big ? 'md:row-span-2 md:col-span-1' : ''}`}>
            <div className={`relative overflow-hidden flex items-center justify-center ${p.big ? 'aspect-[16/11]' : 'aspect-[16/9]'} bg-gradient-to-br from-ink-3 to-ink`}>
              <span className={`font-brush text-gold/80 ${p.big ? 'text-[240px]' : 'text-[140px]'}`} style={{ textShadow: '0 0 40px rgba(212,162,75,0.6)' }}>
                {p.glyph}
              </span>
              <span className="absolute top-[18px] left-[18px] bg-ink/80 backdrop-blur border border-gold/40 text-gold px-2.5 py-1.5 text-[11px] tracking-wider uppercase font-medium">
                {p.tag}
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className={`font-serif leading-tight font-medium text-cream mb-2.5 ${p.big ? 'text-[34px]' : 'text-[22px]'}`}>{p.title}</h3>
              <p className="text-cream-dim text-[14.5px] leading-[1.6] mb-4 flex-1">{p.excerpt}</p>
              <div className="flex gap-2 items-center text-xs text-cream-dim tracking-wide">
                <span>{p.date}</span><span>·</span><span>{p.read}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
