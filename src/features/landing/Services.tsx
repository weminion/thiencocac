const SERVICES = [
  { id: 'tuvi', glyph: '紫', title: 'Tử vi trọn đời', sub: 'An bài 12 cung', desc: 'Lá số tử vi chi tiết — cung Mệnh, Thân, Tài, Phúc, Di, Quan. Luận giải vận hạn từng năm, tháng lớn nhỏ.', tags: ['12 cung', 'Đại vận', 'Tiểu hạn'], price: 'Từ 299k', featured: true },
  { id: 'phongthuy', glyph: '風', title: 'Phong thủy nhà ở', sub: 'Địa lý bát trạch', desc: 'Khảo sát hướng nhà, bố trí nội thất theo mệnh chủ. Hóa giải sát khí, kích hoạt tài vị, cát phương.', tags: ['Bát trạch', 'Huyền không', 'Khai quang'], price: 'Từ 2tr5' },
  { id: 'ngaytot', glyph: '吉', title: 'Xem ngày tốt', sub: 'Chọn ngày cát', desc: 'Ngày đẹp khai trương, cưới hỏi, động thổ, nhập trạch, ký hợp đồng. Tránh sát chủ, tam nương, nguyệt kỵ.', tags: ['Khai trương', 'Hôn sự', 'Nhập trạch'], price: 'Từ 99k' },
  { id: 'kinhdoanh', glyph: '財', title: 'Vận kinh doanh', sub: 'Thiên thời địa lợi', desc: 'Xem ngày xuất hành, ký hợp đồng, gặp đối tác. Phân tích năm 2026 theo mệnh: nên mở rộng hay thủ.', tags: ['Hợp tác', 'Đầu tư', 'Ra mắt'], price: 'Từ 499k' },
  { id: 'hoptuoi', glyph: '合', title: 'Hợp tuổi — hợp mệnh', sub: 'Tương sinh tương khắc', desc: 'Luận tuổi vợ chồng, đối tác làm ăn, cha mẹ — con cái. Ngũ hành sinh khắc, thiên can địa chi xung hợp.', tags: ['Vợ chồng', 'Đối tác', 'Con cái'], price: 'Từ 199k' },
  { id: 'tuvan', glyph: '師', title: 'Tư vấn 1-1 với Thầy', sub: 'Riêng tư · tận tâm', desc: 'Trò chuyện riêng với chuyên gia qua video call 60 phút. Giải đáp mọi khúc mắc đời sống, sự nghiệp, tình duyên.', tags: ['60 phút', 'Video call', 'Bảo mật'], price: 'Từ 1tr2' },
];

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-[120px] px-5 md:px-10 bg-ink relative bg-[radial-gradient(ellipse_at_top,rgba(212,162,75,0.06),transparent_50%)]">
      <div className="max-w-[820px] mx-auto mb-10 md:mb-16 text-center">
        <div className="inline-block text-[10px] md:text-[12px] tracking-[0.3em] md:tracking-[0.35em] uppercase text-gold font-medium mb-4 md:mb-5 px-3 md:px-3.5 py-1.5 border border-gold/40 rounded-full">
          Lục Pháp
        </div>
        <h2 className="font-serif text-[32px] sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.1] font-medium tracking-tight text-cream mb-4 md:mb-5">
          Sáu cửa <span className="italic font-medium bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">thiên cơ</span> — mở ra một cuộc đời tỏ tường
        </h2>
        <p className="text-[15px] md:text-[17px] text-cream-dim leading-[1.65]">
          Mỗi dịch vụ được xây trên nền tảng cổ pháp truyền thống kết hợp với chuyên môn hiện đại — để bạn không chỉ biết, mà còn hiểu và hành động đúng lúc.
        </p>
      </div>

      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/20 border border-gold/20">
        {SERVICES.map(s => (
          <article key={s.id} className={`bg-ink p-6 md:p-10 md:px-8 flex flex-col gap-4 md:gap-5 relative cursor-pointer transition-colors hover:bg-ink-2 ${s.featured ? 'bg-gradient-to-br from-ink-2 to-ink' : ''}`}>
            {s.featured && <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent pointer-events-none" />}
            <div className="flex items-start justify-between relative gap-2">
              <span className="inline-flex items-center justify-center w-14 h-14 md:w-[68px] md:h-[68px] font-brush text-[32px] md:text-[42px] text-gold-bright bg-gradient-to-br from-ink-3 to-ink-2 border border-gold/40 shadow-[inset_0_0_20px_rgba(212,162,75,0.1)]">
                {s.glyph}
              </span>
              {s.featured && (
                <span className="text-[10px] md:text-[11px] tracking-widest uppercase text-ink bg-gold px-2 md:px-2.5 py-1 md:py-[5px] font-semibold">
                  Được chọn nhiều
                </span>
              )}
            </div>
            <div className="flex-1 relative">
              <div className="font-serif italic text-gold text-[13px] md:text-sm mb-1.5">{s.sub}</div>
              <h3 className="font-serif text-[22px] md:text-[28px] font-medium text-cream mb-2 md:mb-3 tracking-tight">{s.title}</h3>
              <p className="text-cream-dim text-[14px] md:text-[14.5px] leading-[1.65] mb-4">{s.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map(t => (
                  <span key={t} className="text-[11px] tracking-wide text-cream-dim border border-gold/20 px-2.5 py-1">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center pt-5 border-t border-gold/20 relative">
              <span className="font-serif text-xl text-gold-bright font-medium">{s.price}</span>
              <button className="text-cream text-[13px] tracking-wider uppercase font-medium cursor-pointer hover:text-gold-bright transition-colors">
                Thỉnh giáo →
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
