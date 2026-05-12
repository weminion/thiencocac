'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tier = 'thuong' | 'thuongtrung' | 'trungcat' | 'trungbinh' | 'trunghanp' | 'ha';
type Category = 'all' | 'tinhduyên' | 'sunghiep' | 'tailoc' | 'suckhoe' | 'giadao';

interface XamCard {
  so: number;
  tier: Tier;
  title: string;
  ke: string;
  luan: string;
  categories: Category[];
}

interface DrawRecord {
  so: number;
  title: string;
  tier: Tier;
  drawnAt: number;
  question?: string;
}

// ─── Card database ───────────────────────────────────────────────────────────

const XAM_CARDS: XamCard[] = [
  {
    so: 1,
    tier: 'thuong',
    title: 'Hoa khai kiến Phật',
    ke: 'Hoa sen nở rộ giữa ao trong,\nPhật hiện từ bi độ chúng sinh.\nMột niệm chân thành vang khắp cõi,\nPhúc lành đến mãi chẳng dời ngưng.',
    luan: 'Thẻ thượng cát. Mọi việc đang tiến triển thuận lợi như hoa sen nở rộ. Tâm thành kính Phật sẽ đem lại kết quả tốt đẹp. Hãy tiếp tục giữ vững thiện tâm và kiên nhẫn chờ thời.',
    categories: ['all', 'tinhduyên', 'sunghiep', 'tailoc'],
  },
  {
    so: 7,
    tier: 'thuongtrung',
    title: 'Nguyệt minh phong thuận',
    ke: 'Trăng sáng soi đường gió thuận chiều,\nThuận duyên hội tụ đón buổi triều.\nVạn sự hanh thông theo ý nguyện,\nPhúc đức dồi dào mãi không tiêu.',
    luan: 'Thẻ thượng trung. Vận thế đang chuyển sang hướng tích cực. Công việc và tình cảm đều có nhiều thuận duyên. Cần tiếp tục tu dưỡng đức hạnh để phúc lành bền vững.',
    categories: ['all', 'sunghiep', 'tailoc', 'tinhduyên'],
  },
  {
    so: 14,
    tier: 'trungcat',
    title: 'Trúc báo xuân lai',
    ke: 'Trúc xanh vươn thẳng đón xuân sang,\nMầm mới nhú lên giữa lạnh băng.\nKiên nhẫn chịu đựng qua giông bão,\nRồi sẽ thành công rực rỡ vàng.',
    luan: 'Thẻ trung cát. Hiện tại có thể còn khó khăn nhưng hãy kiên trì như cây trúc. Sau gian khó sẽ đến thành công. Không nên nản lòng, hãy tiếp tục nỗ lực.',
    categories: ['all', 'sunghiep', 'suckhoe'],
  },
  {
    so: 23,
    tier: 'trungcat',
    title: 'Long mã tinh thần',
    ke: 'Long mã tung hoành vượt sóng khơi,\nHào khí ngất trời chí chẳng rời.\nGian nan không nản tâm vẫn vững,\nThành công rực rỡ đón tương lai.',
    luan: 'Thẻ trung cát. Tinh thần mạnh mẽ là chìa khóa thành công. Hãy phát huy nội lực, không sợ thử thách. Tình duyên và sự nghiệp đều cần sự chủ động, quyết đoán.',
    categories: ['all', 'sunghiep', 'tinhduyên'],
  },
  {
    so: 35,
    tier: 'trungbinh',
    title: 'Thủy lưu ngàn dặm',
    ke: 'Nước chảy ngàn dặm chẳng dừng trôi,\nVòng quanh núi đá tìm lối mới.\nKhó khăn trước mắt chưa vượt được,\nThời cơ chưa đến hãy kiên thời.',
    luan: 'Thẻ trung bình. Mọi việc đang ở giai đoạn bình ổn, chưa có nhiều chuyển biến rõ rệt. Hãy nhẫn nại chờ thời cơ, không nên hành động vội vàng. Cần tĩnh tâm quan sát.',
    categories: ['all', 'tailoc', 'sunghiep', 'giadao'],
  },
  {
    so: 42,
    tier: 'trungbinh',
    title: 'Mây che trăng sáng',
    ke: 'Mây che khuất trăng giữa đêm thu,\nÁnh sáng tạm mờ chẳng biến đi đâu.\nChờ gió thổi mây tan vầng sáng rõ,\nSự tình ắt sẽ hiện ra mau.',
    luan: 'Thẻ trung bình. Hiện tại còn nhiều điều chưa rõ ràng, chân lý chưa được sáng tỏ. Hãy kiên nhẫn chờ đợi, đừng quyết định gấp. Mọi chuyện rồi sẽ sáng tỏ đúng lúc.',
    categories: ['all', 'tinhduyên', 'giadao'],
  },
  {
    so: 58,
    tier: 'trunghanp',
    title: 'Phong ba bất định',
    ke: 'Phong ba nổi dậy giữa đại dương,\nThuyền nhỏ chòng chành bốn phía vương.\nTâm vững mới qua cơn hoạn nạn,\nNiệm Phật cầu gia hộ bình thường.',
    luan: 'Thẻ trung hạn. Sắp tới có thể gặp khó khăn, trở ngại hoặc bất ổn. Cần tăng cường tu tập, niệm Phật để tâm thần vững vàng. Tránh các quyết định lớn trong thời điểm này.',
    categories: ['all', 'sunghiep', 'tailoc', 'suckhoe'],
  },
  {
    so: 67,
    tier: 'trunghanp',
    title: 'Sương mù che lối',
    ke: 'Sương mù dày đặc che lối đi,\nPhương hướng lạc mất chẳng biết chi.\nDừng bước tĩnh tâm cầu Bồ Tát,\nÁnh sáng từ bi sẽ dẫn về.',
    luan: 'Thẻ trung hạn. Đang ở giai đoạn khó định hướng, dễ bị nhầm lẫn. Tránh hành động bốc đồng. Hãy cầu nguyện, tìm lời khuyên từ người có kinh nghiệm trước khi quyết định.',
    categories: ['all', 'tinhduyên', 'giadao', 'sunghiep'],
  },
  {
    so: 79,
    tier: 'ha',
    title: 'Gai nhọn phủ đường',
    ke: 'Gai nhọn trải đầy khắp nẻo đường,\nBước chân vấp ngã khó an khương.\nTu thân tích đức giải nghiệp chướng,\nCầu Bồ Tát từ bi che chở thường.',
    luan: 'Thẻ hạ. Vận hạn đang gặp nhiều trắc trở, cần đặc biệt cẩn thận. Nên tăng cường bố thí, phóng sinh, niệm Phật để hóa giải nghiệp chướng. Không nên làm việc lớn trong thời điểm này.',
    categories: ['all', 'tailoc', 'sunghiep', 'giadao'],
  },
  {
    so: 88,
    tier: 'ha',
    title: 'Thuyền trôi vô bến',
    ke: 'Thuyền trôi mênh mang giữa biển khơi,\nKhông bến không bờ mất phương trời.\nCẩn thận từng bước đừng liều lĩnh,\nSám hối cầu gia hộ đổi mới.',
    luan: 'Thẻ hạ. Tình trạng hiện tại còn lênh đênh, chưa định hướng được. Cần sám hối những lỗi lầm đã qua và tích cực tu tập để thay đổi vận mệnh. Tránh xa tranh chấp, thị phi.',
    categories: ['all', 'tinhduyên', 'suckhoe', 'giadao'],
  },
  {
    so: 95,
    tier: 'thuong',
    title: 'Phượng hoàng hoàn nguyên',
    ke: 'Phượng hoàng vươn cánh giữa tầng mây,\nHuy hoàng rực rỡ sáng đêm ngày.\nVận hội đến rồi đừng bỏ lỡ,\nPhước lành tụ hội chẳng hao phai.',
    luan: 'Thẻ thượng cát. Vận hội tốt đẹp đang đến, đây là thời điểm thuận lợi để hành động. Mọi nỗ lực trước đây sẽ được đền đáp xứng đáng. Hãy tự tin tiến bước.',
    categories: ['all', 'sunghiep', 'tailoc', 'tinhduyên', 'giadao'],
  },
  {
    so: 52,
    tier: 'thuongtrung',
    title: 'Mưa lành đất phì',
    ke: 'Mưa xuân rưới xuống đất đai phì,\nHạt giống vun trồng đợi thời kỳ.\nGieo nhân lành thì gặt quả thiện,\nTâm thành cần mẫn đúng thời nghi.',
    luan: 'Thẻ thượng trung. Đây là giai đoạn gieo nhân tốt để sau gặt quả lành. Hãy chăm chỉ vun đắp các mối quan hệ, công việc và tâm linh. Kết quả sẽ đến đúng thời điểm.',
    categories: ['all', 'suckhoe', 'giadao', 'tinhduyên'],
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'tcc-xam-v1';
const COST_PER_DRAW = 30;

const TIER_CONFIG: Record<Tier, { label: string; textClass: string; borderStyle: string; badgeBg: string }> = {
  thuong:      { label: 'Thượng cát', textClass: 'text-emerald-300',  borderStyle: '1px solid rgba(52,211,153,0.5)',  badgeBg: 'rgba(52,211,153,0.15)' },
  thuongtrung: { label: 'Thượng trung', textClass: 'text-green-300',  borderStyle: '1px solid rgba(134,239,172,0.5)', badgeBg: 'rgba(134,239,172,0.15)' },
  trungcat:    { label: 'Trung cát',  textClass: 'text-yellow-300',   borderStyle: '1px solid rgba(212,162,75,0.5)',  badgeBg: 'rgba(212,162,75,0.15)' },
  trungbinh:   { label: 'Trung bình', textClass: 'text-cream',        borderStyle: '1px solid rgba(212,198,160,0.4)', badgeBg: 'rgba(212,198,160,0.1)' },
  trunghanp:   { label: 'Trung hạn',  textClass: 'text-orange-300',   borderStyle: '1px solid rgba(200,122,90,0.5)',  badgeBg: 'rgba(200,122,90,0.15)' },
  ha:          { label: 'Hạ',         textClass: 'text-red-400',      borderStyle: '1px solid rgba(220,38,38,0.5)',   badgeBg: 'rgba(220,38,38,0.1)' },
};

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all',       label: 'Tất cả' },
  { id: 'tinhduyên', label: 'Tình duyên' },
  { id: 'sunghiep',  label: 'Sự nghiệp' },
  { id: 'tailoc',    label: 'Tài lộc' },
  { id: 'suckhoe',   label: 'Sức khỏe' },
  { id: 'giadao',    label: 'Gia đạo' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SealCorners({ color = '#d4a24b' }: { color?: string }) {
  return (
    <>
      <span className="absolute -top-px -left-px w-4 h-4 border-t border-l pointer-events-none" style={{ borderColor: color }} />
      <span className="absolute -top-px -right-px w-4 h-4 border-t border-r pointer-events-none" style={{ borderColor: color }} />
      <span className="absolute -bottom-px -left-px w-4 h-4 border-b border-l pointer-events-none" style={{ borderColor: color }} />
      <span className="absolute -bottom-px -right-px w-4 h-4 border-b border-r pointer-events-none" style={{ borderColor: color }} />
    </>
  );
}

function TierBadge({ tier }: { tier: Tier }) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase rounded-sm ${cfg.textClass}`}
      style={{ background: cfg.badgeBg, border: cfg.borderStyle }}
    >
      {cfg.label}
    </span>
  );
}

interface XamTubeProps {
  shaking: boolean;
  loading: boolean;
  onDraw: () => void;
}

function XamTube({ shaking, loading, onDraw }: XamTubeProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Tube */}
      <button
        onClick={onDraw}
        disabled={loading}
        className="relative group focus:outline-none"
        aria-label="Rút xăm"
      >
        <div
          className={`relative flex flex-col items-center transition-transform duration-75 select-none ${
            shaking ? 'animate-bounce' : 'hover:scale-105'
          }`}
        >
          {/* Tube body */}
          <div
            className="relative w-20 h-48 flex flex-col items-center justify-end pb-3"
            style={{
              background: 'linear-gradient(160deg, #8B4513 0%, #6B3010 40%, #5a2800 100%)',
              border: '2px solid rgba(212,162,75,0.6)',
              borderRadius: '8px 8px 4px 4px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,162,75,0.3)',
            }}
          >
            {/* Gold band top */}
            <div
              className="absolute top-0 left-0 right-0 h-4"
              style={{
                background: 'linear-gradient(90deg, var(--color-gold-deep), var(--color-gold-bright), var(--color-gold-deep))',
                borderRadius: '6px 6px 0 0',
              }}
            />
            {/* Bamboo lines */}
            {[60, 100, 140].map((top) => (
              <div
                key={top}
                className="absolute left-2 right-2 h-px"
                style={{ top, background: 'rgba(212,162,75,0.25)' }}
              />
            ))}
            {/* Sticks peeking out */}
            <div className="absolute top-1 flex gap-1">
              {[-6, -2, 2, 6].map((offset, i) => (
                <div
                  key={i}
                  className="w-1 rounded-t"
                  style={{
                    height: `${28 + i * 4}px`,
                    background: `linear-gradient(180deg, #d4c090 0%, #b8954e 100%)`,
                    transform: `rotate(${offset}deg)`,
                    boxShadow: '0 -2px 4px rgba(0,0,0,0.3)',
                  }}
                />
              ))}
            </div>
            {/* Label */}
            <div
              className="text-center font-brush text-base leading-tight"
              style={{ color: 'var(--color-gold)', writingMode: 'vertical-rl' }}
            >
              Quan Am
            </div>
          </div>
          {/* Tube base */}
          <div
            className="w-24 h-3"
            style={{
              background: 'linear-gradient(90deg, #4a1800, #6B3010, #4a1800)',
              border: '1px solid rgba(212,162,75,0.4)',
              borderRadius: '0 0 4px 4px',
            }}
          />
        </div>

        {/* Glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: '0 0 30px rgba(212,162,75,0.2)', borderRadius: 8 }}
        />
      </button>

      {/* CTA text */}
      <div className="text-center">
        <div
          className="text-[11px] tracking-[0.25em] uppercase font-medium mb-1"
          style={{ color: 'var(--color-gold)' }}
        >
          Tốn {COST_PER_DRAW} công đức
        </div>
        <button
          onClick={onDraw}
          disabled={loading}
          className="px-8 py-3 font-semibold tracking-wider text-sm uppercase transition-all hover:opacity-80 active:scale-95 disabled:opacity-40"
          style={{
            background: 'linear-gradient(135deg, var(--color-gold-bright), var(--color-gold))',
            color: 'var(--color-ink)',
          }}
        >
          {loading ? 'Đang rút...' : 'Rút xăm'}
        </button>
      </div>
    </div>
  );
}

function CardReveal({ card }: { card: XamCard }) {
  const cfg = TIER_CONFIG[card.tier];
  return (
    <div
      className="relative p-6 animate-fade-up"
      style={{
        background: 'var(--color-ink-2)',
        border: cfg.borderStyle,
      }}
    >
      <SealCorners color={card.tier === 'thuong' ? '#34d399' : card.tier === 'ha' ? '#ef4444' : '#d4a24b'} />

      {/* Card number */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div
            className="font-brush text-5xl leading-none mb-1"
            style={{ color: 'var(--color-gold)' }}
          >
            {card.so}
          </div>
          <div className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--color-cream-dim)' }}>
            The so
          </div>
        </div>
        <TierBadge tier={card.tier} />
      </div>

      {/* Title */}
      <div className="font-serif text-xl font-medium mb-4" style={{ color: 'var(--color-cream)' }}>
        {card.title}
      </div>

      {/* Verse */}
      <div
        className="relative p-4 mb-4"
        style={{
          background: 'rgba(0,0,0,0.2)',
          borderLeft: '3px solid',
          borderColor: 'var(--color-gold)',
        }}
      >
        <div
          className="absolute -top-3 left-3 font-brush text-2xl leading-none"
          style={{ color: 'var(--color-gold)', opacity: 0.5 }}
        >
          &ldquo;
        </div>
        <p
          className="font-serif text-sm leading-7 italic whitespace-pre-line"
          style={{ color: 'var(--color-cream)' }}
        >
          {card.ke}
        </p>
      </div>

      {/* Interpretation */}
      <div>
        <div
          className="text-[10px] tracking-[0.2em] uppercase font-medium mb-2"
          style={{ color: 'var(--color-gold)' }}
        >
          Luan giai
        </div>
        <p className="text-sm leading-6" style={{ color: 'var(--color-cream-dim)' }}>
          {card.luan}
        </p>
      </div>
    </div>
  );
}

function HistoryList({ records }: { records: DrawRecord[] }) {
  if (records.length === 0) {
    return (
      <div
        className="p-4 text-center text-sm"
        style={{ color: 'var(--color-cream-dim)', background: 'var(--color-ink-2)', border: '1px solid rgba(212,162,75,0.15)' }}
      >
        Chua co lich su rut xam
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {records.slice(0, 20).map((rec, i) => {
        const cfg = TIER_CONFIG[rec.tier];
        return (
          <li
            key={i}
            className="flex items-center gap-3 px-3 py-2.5"
            style={{ background: 'var(--color-ink-2)', border: '1px solid rgba(212,162,75,0.12)' }}
          >
            <span
              className="font-brush text-lg w-8 text-center shrink-0"
              style={{ color: 'var(--color-gold)' }}
            >
              {rec.so}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm truncate" style={{ color: 'var(--color-cream)' }}>
                {rec.title}
              </div>
              <div className={`text-[11px] ${cfg.textClass}`}>{cfg.label}</div>
            </div>
            <div className="text-[10px] shrink-0" style={{ color: 'var(--color-cream-dim)' }}>
              {new Date(rec.drawnAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function QueDichPage() {
  const [category, setCategory] = useState<Category>('all');
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drawnCard, setDrawnCard] = useState<XamCard | null>(null);
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState<DrawRecord[]>([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw) as DrawRecord[]);
    } catch {
      // ignore
    }
  }, []);

  const saveHistory = useCallback((records: DrawRecord[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      // ignore
    }
  }, []);

  const handleDraw = useCallback(() => {
    if (loading) return;

    // Filter by category
    const pool =
      category === 'all'
        ? XAM_CARDS
        : XAM_CARDS.filter((c) => c.categories.includes(category));

    if (pool.length === 0) return;

    setDrawnCard(null);
    setShaking(true);
    setLoading(true);

    // Shake for 800ms then reveal
    setTimeout(() => {
      setShaking(false);
      const picked = pool[Math.floor(Math.random() * pool.length)];
      setDrawnCard(picked);
      setLoading(false);

      const record: DrawRecord = {
        so: picked.so,
        title: picked.title,
        tier: picked.tier,
        drawnAt: Date.now(),
        question: question || undefined,
      };
      const updated = [record, ...history].slice(0, 50);
      setHistory(updated);
      saveHistory(updated);
    }, 900);
  }, [loading, category, question, history, saveHistory]);

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-6 md:py-8 space-y-6">

      {/* Header */}
      <div
        className="relative overflow-hidden p-5"
        style={{
          background: 'linear-gradient(135deg, var(--color-ink-2), var(--color-ink-3))',
          border: '1px solid rgba(212,162,75,0.35)',
        }}
      >
        <SealCorners />
        <div
          className="absolute -right-4 -bottom-6 font-brush select-none pointer-events-none text-[100px] leading-none"
          style={{ color: 'rgba(212,162,75,0.05)' }}
        >
          Xam
        </div>
        <div className="relative">
          <div className="text-[11px] tracking-[0.25em] uppercase font-medium mb-1" style={{ color: 'var(--color-gold)' }}>
            Xam Quan Am · 100 the
          </div>
          <h1 className="font-serif text-2xl font-medium" style={{ color: 'var(--color-cream)' }}>
            Xam Quan Am
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-cream-dim)' }}>
            Thanh tam niem danh hieu Bo Tat, dat cau hoi va rut the — 100 the ung tu Pho Da Son.
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className="px-3 py-1.5 text-xs tracking-wider uppercase transition-all"
            style={
              category === cat.id
                ? {
                    background: 'var(--color-gold)',
                    color: 'var(--color-ink)',
                    fontWeight: 600,
                  }
                : {
                    background: 'var(--color-ink-2)',
                    color: 'var(--color-cream-dim)',
                    border: '1px solid rgba(212,162,75,0.2)',
                  }
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Question input */}
      <div>
        <label
          className="block text-[11px] tracking-[0.2em] uppercase font-medium mb-2"
          style={{ color: 'var(--color-gold)' }}
          htmlFor="xam-question"
        >
          Cau hoi cua ban (tuy chon)
        </label>
        <input
          id="xam-question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Vd: Duyen phan nay co tot khong?"
          maxLength={120}
          className="w-full px-4 py-2.5 text-sm bg-transparent outline-none"
          style={{
            background: 'var(--color-ink-2)',
            border: '1px solid rgba(212,162,75,0.25)',
            color: 'var(--color-cream)',
          }}
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Tube + draw */}
        <div className="md:col-span-1 flex flex-col items-center justify-start pt-4">
          <XamTube shaking={shaking} loading={loading} onDraw={handleDraw} />
        </div>

        {/* Card reveal */}
        <div className="md:col-span-2">
          {drawnCard ? (
            <CardReveal card={drawnCard} />
          ) : (
            <div
              className="h-full min-h-[280px] flex flex-col items-center justify-center text-center p-8"
              style={{
                background: 'var(--color-ink-2)',
                border: '1px dashed rgba(212,162,75,0.2)',
              }}
            >
              <div className="font-brush text-4xl mb-3" style={{ color: 'rgba(212,162,75,0.3)' }}>
                ?
              </div>
              <div className="text-sm" style={{ color: 'var(--color-cream-dim)' }}>
                Thanh tam niem Bo Tat Quan The Am roi nhan nut Rut xam
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div>
        <div
          className="text-[11px] tracking-[0.25em] uppercase font-medium mb-3"
          style={{ color: 'var(--color-gold)' }}
        >
          Lich su rut xam
        </div>
        <HistoryList records={history} />
      </div>

    </div>
  );
}
