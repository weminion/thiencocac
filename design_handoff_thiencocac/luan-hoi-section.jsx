// Luan Hoi (Lục Đạo Luân Hồi · Nhân Quả) — quán chiếu nghiệp quả
// Use AI to reflect on actions through the lens of cause and effect.
const { useState: useStateLH, useEffect: useEffectLH, useRef: useRefLH, useMemo: useMemoLH } = React;

// Sáu cõi luân hồi
const LUC_DAO = [
  {
    id: 'thien', han: 'Thiên', name: 'Cõi Trời',
    cause: 'Tu thập thiện · bố thí lớn · thiền định sâu',
    fruit: 'Sống lâu, an vui, đầy đủ phước báo',
    warn: 'Phước hết lại đọa — vẫn trong luân hồi',
    color: '#e6b85a', angle: 90
  },
  {
    id: 'atula', han: '', name: 'Cõi A-tu-la',
    cause: 'Có phước nhưng kiêu ngạo · sân hận · ganh tỵ',
    fruit: 'Quyền lực, hùng mạnh nhưng luôn tranh đấu',
    warn: 'Tâm sân lớn — không thấy đạo',
    color: '#c87a5a', angle: 30
  },
  {
    id: 'nhan', han: '', name: 'Cõi Người',
    cause: 'Giữ ngũ giới · hành thiện vừa phải · có hiếu',
    fruit: 'Thân người quý báu — dễ tu hành nhất',
    warn: 'Khó được — đừng phí hoài kiếp này',
    color: '#d4a04a', angle: -30
  },
  {
    id: 'sucsinh', han: '', name: 'Cõi Súc Sinh',
    cause: 'Si mê · tham dục · vô minh · tà kiến',
    fruit: 'Bị nuôi dưỡng để giết, làm việc nặng nhọc',
    warn: 'Không có khả năng tu — luân hồi rất lâu',
    color: '#8a6a4a', angle: -90
  },
  {
    id: 'ngaquy', han: '', name: 'Cõi Ngạ Quỷ',
    cause: 'Tham lam · keo kiệt · trộm cắp · không bố thí',
    fruit: 'Đói khát triền miên — thấy nước hóa lửa',
    warn: 'Khổ vì lòng tham không đáy',
    color: '#a85838', angle: -150
  },
  {
    id: 'diaguc', han: '', name: 'Cõi Địa Ngục',
    cause: 'Sát sinh · vọng ngữ nặng · ngũ nghịch · phỉ báng Tam Bảo',
    fruit: 'Thọ khổ cực hình — thời gian rất dài',
    warn: 'Một niệm sân ác đủ tạo nhân địa ngục',
    color: '#6a1818', angle: 150
  }
];

const THAP_THIEN = [
  { type: 'than', han: '', name: 'Thân',  items: ['Không sát sinh', 'Không trộm cắp', 'Không tà dâm'] },
  { type: 'khau', han: '', name: 'Khẩu',  items: ['Không vọng ngữ', 'Không lưỡng thiệt', 'Không ác khẩu', 'Không ỷ ngữ'] },
  { type: 'y',    han: '', name: 'Ý',     items: ['Không tham', 'Không sân', 'Không si'] }
];

// Lưu nhật ký quán chiếu
const LH_KEY = 'tcc-luan-hoi-v1';
function loadLHLog() {
  try { return JSON.parse(localStorage.getItem(LH_KEY) || '[]'); } catch { return []; }
}
function saveLHLog(log) {
  try { localStorage.setItem(LH_KEY, JSON.stringify(log.slice(-30))); } catch {}
}

// =================== VÒNG LUÂN HỒI SVG ===================
function VongLuanHoi({ size = 360, highlightId, onPick }) {
  const cx = size / 2, cy = size / 2;
  const rOuter = size * 0.46;
  const rInner = size * 0.20;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none">
      <defs>
        <radialGradient id="lh-center">
          <stop offset="0%" stopColor="#d4a04a" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#0a0806" stopOpacity="0"/>
        </radialGradient>
        {LUC_DAO.map(d => (
          <radialGradient key={d.id} id={`lh-${d.id}`} cx="30%" cy="30%">
            <stop offset="0%" stopColor={d.color} stopOpacity="0.5"/>
            <stop offset="100%" stopColor={d.color} stopOpacity="0.05"/>
          </radialGradient>
        ))}
      </defs>

      {/* Aura */}
      <circle cx={cx} cy={cy} r={rOuter + 14} fill="url(#lh-center)"/>

      {/* 6 wedges */}
      {LUC_DAO.map((d, i) => {
        const a0 = (d.angle - 30) * Math.PI / 180;
        const a1 = (d.angle + 30) * Math.PI / 180;
        const x0 = cx + Math.cos(a0) * rOuter;
        const y0 = cy - Math.sin(a0) * rOuter;
        const x1 = cx + Math.cos(a1) * rOuter;
        const y1 = cy - Math.sin(a1) * rOuter;
        const xi0 = cx + Math.cos(a0) * rInner;
        const yi0 = cy - Math.sin(a0) * rInner;
        const xi1 = cx + Math.cos(a1) * rInner;
        const yi1 = cy - Math.sin(a1) * rInner;
        const path = `M ${xi0} ${yi0} L ${x0} ${y0} A ${rOuter} ${rOuter} 0 0 0 ${x1} ${y1} L ${xi1} ${yi1} A ${rInner} ${rInner} 0 0 1 ${xi0} ${yi0} Z`;
        const isHi = highlightId === d.id;
        const lx = cx + Math.cos(d.angle * Math.PI / 180) * (rInner + (rOuter - rInner) * 0.58);
        const ly = cy - Math.sin(d.angle * Math.PI / 180) * (rInner + (rOuter - rInner) * 0.58);
        return (
          <g key={d.id} onClick={() => onPick && onPick(d)} style={{ cursor: onPick ? 'pointer' : 'default' }}>
            <path d={path} fill={`url(#lh-${d.id})`}
              stroke={isHi ? d.color : 'rgba(212,160,74,0.3)'}
              strokeWidth={isHi ? 2 : 1}
              style={{ transition: 'all 300ms', filter: isHi ? `drop-shadow(0 0 12px ${d.color})` : 'none' }}/>
            <text x={lx} y={ly - 4} textAnchor="middle" dominantBaseline="middle"
              fontSize={size * 0.07} fontFamily="'Dancing Script', serif"
              fill={d.color} style={{ filter: `drop-shadow(0 0 6px ${d.color}aa)` }}>{d.han}</text>
            <text x={lx} y={ly + size * 0.05} textAnchor="middle" dominantBaseline="middle"
              fontSize={size * 0.030} fontFamily="'Cormorant Garamond', serif"
              fill="#f0e4cc" opacity="0.85">{d.name}</text>
          </g>
        );
      })}

      {/* Center: Tham Sân Si */}
      <circle cx={cx} cy={cy} r={rInner} fill="#1c160e" stroke="rgba(212,160,74,0.5)" strokeWidth="1"/>
      <circle cx={cx} cy={cy} r={rInner - 6} fill="none" stroke="rgba(212,160,74,0.2)" strokeDasharray="2 4"/>
      {[
        { han: '', label: 'Tham', a: 90 },
        { han: '', label: 'Sân', a: -30 },
        { han: '', label: 'Si',  a: -150 }
      ].map((s, i) => {
        const x = cx + Math.cos(s.a * Math.PI / 180) * rInner * 0.5;
        const y = cy - Math.sin(s.a * Math.PI / 180) * rInner * 0.5;
        return (
          <g key={s.label}>
            <text x={x} y={y - 2} textAnchor="middle" dominantBaseline="middle"
              fontSize={size * 0.045} fontFamily="'Dancing Script', serif" fill="#a85838">{s.han}</text>
          </g>
        );
      })}
      <text x={cx} y={cy + rInner - 14} textAnchor="middle" fontSize={size * 0.024}
        fill="#c9b896" fontFamily="'Cormorant Garamond', serif" fontStyle="italic">Tam độc · </text>
    </svg>
  );
}

// =================== QUÁN CHIẾU NHÂN QUẢ ===================
function QuanChieuNhanQua() {
  const [scenario, setScenario] = useStateLH('');
  const [intent, setIntent] = useStateLH('thien'); // thien · trung · ac
  const [analyzing, setAnalyzing] = useStateLH(false);
  const [result, setResult] = useStateLH(null);
  const [log, setLog] = useStateLH(loadLHLog);

  const examples = [
    'Nói dối với cha mẹ về điểm số',
    'Bố thí 100k cho người ăn xin nhưng nghi ngờ họ giả',
    'Tức giận và mắng đồng nghiệp trước mặt cả phòng',
    'Thấy con kiến trên bàn cơm, vô tình giết nó',
    'Đem rác vứt ra đường vì không có thùng rác',
    'Hứa giúp bạn nhưng cuối cùng quên mất'
  ];

  const analyze = async () => {
    if (!scenario.trim() || analyzing) return;
    setAnalyzing(true);
    setResult(null);

    const intentLabel = intent === 'thien' ? 'thiện ý' : intent === 'ac' ? 'ác ý' : 'không có ý xấu (vô tâm)';
    const prompt = `Bạn là một bậc tu Phật giáo Đại thừa, thấu rõ giáo lý nhân quả và lục đạo luân hồi. Hãy phân tích hành động sau theo Phật pháp một cách CHẶT CHẼ và TỪ BI.

Hành động: "${scenario.trim()}"
Tâm ý: ${intentLabel}

Hãy trả lời dưới dạng JSON THUẦN (không có markdown, không có \`\`\`):
{
  "thapThien": "Vi phạm/giữ giới gì trong Thập Thiện? (ví dụ: Sát sinh, Vọng ngữ, Tham, Sân... — hoặc 'Hành thiện' nếu là việc tốt). Ngắn gọn 1-2 từ.",
  "loaiNghiep": "thiện" | "ác" | "vô ký",
  "muc": "nhẹ" | "trung" | "nặng",
  "huongCoi": "id của 1 trong 6 cõi nó dẫn tới (thien|atula|nhan|sucsinh|ngaquy|diaguc)",
  "luanGiai": "2-3 câu giải thích nhân-duyên-quả theo Phật pháp, giọng trầm tĩnh từ bi.",
  "qua": "Quả báo có thể gặp trong đời này hoặc đời sau (1-2 câu cụ thể)",
  "samHoi": "Cách sám hối/chuyển hóa thiết thực (1-2 câu, ngắn gọn — niệm Phật, tụng kinh gì, hành động gì)",
  "ke": "Một câu kệ ngắn 4-8 chữ, mang tính nhắc nhở (tiếng Việt, có thể có Hán Việt)"
}`;

    try {
      const text = await window.claude.complete(prompt);
      let cleaned = text.trim();
      const m = cleaned.match(/\{[\s\S]*\}/);
      if (m) cleaned = m[0];
      const parsed = JSON.parse(cleaned);
      const entry = { ts: Date.now(), scenario: scenario.trim(), intent, ...parsed };
      setResult(entry);
      const newLog = [...log, entry];
      setLog(newLog);
      saveLHLog(newLog);
    } catch (e) {
      setResult({
        error: true,
        luanGiai: 'Không kết nối được với Pháp sư. Thầy nói: "Khi có nghi ngại, hãy quay về với hơi thở và niệm Phật. Mọi nghiệp đều khởi từ tâm — gìn giữ tâm thanh tịnh là căn bản."'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const highlightDao = result?.huongCoi ? LUC_DAO.find(d => d.id === result.huongCoi) : null;
  const nghiepColor = result?.loaiNghiep === 'thiện' ? 'text-emerald-300'
    : result?.loaiNghiep === 'ác' ? 'text-red-300' : 'text-cream-dim';

  return (
    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
      {/* Left: input */}
      <div className="bg-gradient-to-br from-ink-2 to-ink-3 border border-gold/40 p-6 md:p-7 relative">
        <span className="absolute -top-px -left-px w-5 h-5 border-t border-l border-gold"></span>
        <span className="absolute -bottom-px -right-px w-5 h-5 border-b border-r border-gold"></span>

        <div className="flex items-center gap-3 mb-5">
          <span className="font-brush text-gold text-3xl w-12 h-12 inline-flex items-center justify-center border border-gold/40">Nghiệp</span>
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase text-gold font-medium">Quán Chiếu Nghiệp</div>
            <div className="font-serif text-xl text-cream font-medium leading-tight">Một hành động — soi vào nhân quả</div>
          </div>
        </div>

        <p className="text-[14px] text-cream-dim leading-[1.7] mb-5 font-serif italic">
          "Muốn biết nhân kiếp trước — xem quả kiếp này.<br/>
          Muốn biết quả kiếp sau — xem nhân kiếp này."
        </p>

        <label className="block text-[10px] tracking-[0.18em] uppercase text-gold mb-2 font-medium">Việc bạn đã làm hoặc đang nghĩ</label>
        <textarea value={scenario} onChange={e => setScenario(e.target.value)}
          rows={3} maxLength={300}
          placeholder="VD: Hôm nay tôi nói dối với mẹ rằng đã đi học, thực ra ở nhà chơi game..."
          className="w-full bg-ink border border-gold/40 text-cream font-sans text-[14px] p-3 mb-1 rounded-sm focus:outline-none focus:border-gold resize-none"/>
        <div className="text-[11px] text-cream-dim/70 mb-4 text-right">{scenario.length}/300</div>

        <label className="block text-[10px] tracking-[0.18em] uppercase text-gold mb-2 font-medium">Tâm khi làm việc đó</label>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { id:'thien', han:'', label:'Thiện ý' },
            { id:'trung', han:'', label:'Vô tâm' },
            { id:'ac',    han:'', label:'Ác ý' }
          ].map(t => (
            <button key={t.id} onClick={() => setIntent(t.id)}
              className={`py-2.5 border text-center transition-all ${intent === t.id
                ? 'bg-gradient-to-br from-gold-bright/20 to-transparent border-gold text-gold-bright'
                : 'border-gold/30 text-cream-dim hover:border-gold/60'}`}>
              <div className="font-brush text-lg leading-none mb-0.5">{t.han}</div>
              <div className="text-[11px] tracking-wide">{t.label}</div>
            </button>
          ))}
        </div>

        <button onClick={analyze} disabled={!scenario.trim() || analyzing}
          className="w-full py-3 bg-gradient-to-br from-gold-bright to-gold-deep text-ink text-sm font-semibold tracking-[0.1em] uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {analyzing ? <><span className="font-brush text-base animate-pulse">Thiền</span> Pháp sư đang quán chiếu...</> : <><span className="font-brush text-base">Hỏi</span> Thỉnh giáo Pháp sư</>}
        </button>

        <div className="mt-5 pt-5 border-t border-gold/15">
          <div className="text-[10px] tracking-[0.18em] uppercase text-cream-dim mb-2.5">Một vài tình huống thường gặp</div>
          <div className="flex flex-wrap gap-1.5">
            {examples.map(ex => (
              <button key={ex} onClick={() => setScenario(ex)}
                className="text-[11.5px] text-cream-dim hover:text-gold-bright border border-gold/20 hover:border-gold/50 px-2.5 py-1 rounded-sm leading-snug text-left">
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: result + wheel */}
      <div className="flex flex-col gap-5">
        {!result && !analyzing && (
          <div className="bg-ink-2 border border-gold/20 p-6 md:p-7 flex-1 flex flex-col items-center justify-center text-center">
            <VongLuanHoi size={300}/>
            <div className="text-[11px] tracking-[0.25em] uppercase text-gold font-medium mt-3 mb-1">Lục Đạo · </div>
            <div className="font-serif text-cream-dim text-[14px] italic max-w-[380px] leading-[1.6]">
              Mỗi niệm khởi, mỗi lời nói, mỗi việc làm — đều là hạt giống gieo vào một trong sáu cõi này.
            </div>
          </div>
        )}

        {analyzing && (
          <div className="bg-ink-2 border border-gold/20 p-8 flex-1 flex flex-col items-center justify-center gap-3">
            <div className="font-brush text-gold text-5xl animate-pulse">Thiền</div>
            <div className="text-cream font-serif text-lg italic">Pháp sư đang quán chiếu...</div>
            <div className="text-[12px] text-cream-dim text-center max-w-xs">Đem hành động của bạn soi vào ánh sáng của Tam Bảo và luật nhân quả.</div>
          </div>
        )}

        {result && !result.error && (
          <>
            {/* Wheel + dao */}
            <div className="bg-gradient-to-br from-ink-2 to-ink-3 border p-6 relative overflow-hidden animate-fade-up"
              style={{ borderColor: highlightDao ? `${highlightDao.color}80` : 'rgba(212,160,74,0.4)' }}>
              <div className="absolute -top-20 -right-20 w-72 h-72 blur-3xl pointer-events-none"
                style={{ background: highlightDao ? `radial-gradient(circle, ${highlightDao.color}30, transparent 70%)` : '' }}></div>
              <div className="relative grid sm:grid-cols-[180px_1fr] gap-5 items-center">
                <VongLuanHoi size={180} highlightId={result.huongCoi}/>
                <div>
                  <div className="text-[10px] tracking-[0.22em] uppercase font-medium mb-1" style={{ color: highlightDao?.color || '#d4a04a' }}>
                    Hành động này dẫn về
                  </div>
                  <div className="font-serif text-2xl text-cream font-medium mb-1 flex items-center gap-2">
                    <span className="font-brush text-3xl" style={{ color: highlightDao?.color }}>{highlightDao?.han}</span>
                    {highlightDao?.name}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-ink/50 border border-gold/20 px-2.5 py-1.5">
                      <div className="text-[9px] tracking-widest uppercase text-cream-dim mb-0.5">Vi phạm</div>
                      <div className="font-serif text-[14px] text-gold-bright italic">{result.thapThien}</div>
                    </div>
                    <div className="bg-ink/50 border border-gold/20 px-2.5 py-1.5">
                      <div className="text-[9px] tracking-widest uppercase text-cream-dim mb-0.5">Nghiệp</div>
                      <div className={`font-serif text-[14px] italic ${nghiepColor}`}>{result.loaiNghiep} · {result.muc}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Luận giải */}
            <div className="bg-ink-2 border border-gold/30 p-6 animate-fade-up">
              <div className="text-[10px] tracking-[0.22em] uppercase text-gold mb-2 font-medium flex items-center gap-2">
                <span className="font-brush text-base">Ngộ</span> Luận giải nhân-duyên-quả
              </div>
              <p className="text-cream text-[15px] leading-[1.7] font-serif italic mb-4">"{result.luanGiai}"</p>

              <div className="grid sm:grid-cols-2 gap-3 pt-3 border-t border-gold/15">
                <div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-red-300/80 mb-1.5 font-medium flex items-center gap-1.5">
                    <span className="font-brush text-base">Quả</span> Quả có thể gặp
                  </div>
                  <p className="text-[13.5px] text-cream-dim leading-[1.6]">{result.qua}</p>
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-emerald-300 mb-1.5 font-medium flex items-center gap-1.5">
                    <span className="font-brush text-base">Sám</span> Cách chuyển hóa
                  </div>
                  <p className="text-[13.5px] text-cream-dim leading-[1.6]">{result.samHoi}</p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gold/15 flex items-center gap-3">
                <span className="font-brush text-gold text-2xl flex-shrink-0">Kệ</span>
                <div className="font-serif italic text-gold-bright text-[17px] leading-snug">"{result.ke}"</div>
              </div>
            </div>
          </>
        )}

        {result?.error && (
          <div className="bg-ink-2 border border-lotus/40 p-6">
            <div className="text-lotus font-brush text-2xl mb-2">Thiền</div>
            <p className="text-cream text-sm font-serif italic leading-[1.6]">{result.luanGiai}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// =================== THẬP THIỆN GIỚI - REFERENCE ===================
function ThapThienCard() {
  return (
    <div className="bg-gradient-to-br from-ink-2 to-ink-3 border border-gold/30 p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="font-brush text-gold text-2xl w-10 h-10 inline-flex items-center justify-center border border-gold/40">Thập</span>
        <div>
          <div className="text-[11px] tracking-[0.22em] uppercase text-gold font-medium">Thập Thiện Nghiệp</div>
          <div className="font-serif text-lg text-cream font-medium">Mười điều thiện — gốc của thiện đạo</div>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        {THAP_THIEN.map(group => (
          <div key={group.type} className="bg-ink/50 border border-gold/15 p-3.5">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gold/15">
              <span className="font-brush text-gold-bright text-xl">{group.han}</span>
              <span className="font-serif text-cream font-medium">{group.name}</span>
              <span className="text-[10px] text-cream-dim ml-auto tracking-widest">{group.items.length} GIỚI</span>
            </div>
            <ul className="space-y-1">
              {group.items.map(it => (
                <li key={it} className="text-[12.5px] text-cream-dim flex items-start gap-1.5">
                  <span className="text-emerald-400/70 text-[9px] mt-1.5">◆</span>{it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// =================== LỊCH SỬ QUÁN CHIẾU ===================
function LichSuQuanChieu() {
  const [log, setLog] = useStateLH(loadLHLog);
  const [expand, setExpand] = useStateLH(false);

  if (!log.length) return null;
  const items = expand ? log.slice().reverse() : log.slice().reverse().slice(0, 3);

  const clearAll = () => {
    if (confirm('Xóa toàn bộ nhật ký quán chiếu?')) {
      setLog([]);
      saveLHLog([]);
    }
  };

  return (
    <div className="bg-ink-2 border border-gold/20 p-6">
      <div className="flex items-center justify-between mb-3 gap-3">
        <div className="flex items-center gap-3">
          <span className="font-brush text-gold text-2xl w-10 h-10 inline-flex items-center justify-center border border-gold/40">Ký</span>
          <div>
            <div className="text-[11px] tracking-[0.22em] uppercase text-gold font-medium">Nhật Ký Quán Chiếu</div>
            <div className="font-serif text-lg text-cream font-medium">{log.length} lần soi nghiệp</div>
          </div>
        </div>
        {log.length > 0 && (
          <button onClick={clearAll} className="text-[11px] text-cream-dim/70 hover:text-red tracking-wider uppercase">Xóa</button>
        )}
      </div>
      <ul className="divide-y divide-gold/10">
        {items.map((e, i) => {
          const dao = LUC_DAO.find(d => d.id === e.huongCoi);
          const date = new Date(e.ts);
          const dStr = date.toLocaleDateString('vi-VN');
          return (
            <li key={i} className="py-3 flex items-start gap-3">
              <div className="font-brush text-2xl flex-shrink-0 w-9 text-center" style={{ color: dao?.color || '#d4a04a' }}>{dao?.han || '?'}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] text-cream truncate font-medium">"{e.scenario}"</div>
                <div className="text-[12px] text-cream-dim mt-0.5">
                  {dStr} · {e.thapThien} · <span className={e.loaiNghiep === 'thiện' ? 'text-emerald-300' : e.loaiNghiep === 'ác' ? 'text-red-300' : ''}>{e.loaiNghiep} {e.muc}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {log.length > 3 && (
        <button onClick={() => setExpand(!expand)} className="mt-3 w-full text-center text-[12px] text-cream-dim hover:text-gold-bright tracking-wider uppercase pt-3 border-t border-gold/10">
          {expand ? 'Thu gọn ↑' : `Xem cả ${log.length} mục →`}
        </button>
      )}
    </div>
  );
}

// =================== PAGE ===================
function LuanHoiPage() {
  return (
    <div className="p-5 md:p-10 md:pt-8 max-w-[1280px]">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2.5 text-[10px] md:text-[12px] tracking-[0.3em] uppercase text-gold font-medium mb-3">
          <span className="w-6 md:w-10 h-px bg-gold"></span>
           · Lục Đạo Luân Hồi
          <span className="w-6 md:w-10 h-px bg-gold"></span>
        </div>
        <h1 className="font-serif text-[32px] md:text-[44px] leading-[1.1] font-medium text-cream mb-3 max-w-[820px]">
          Soi một việc, <span className="italic bg-gradient-to-br from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent">thấy cả nhân quả</span>
        </h1>
        <p className="text-cream-dim text-[15px] md:text-[16px] leading-[1.65] max-w-[760px] font-serif italic">
          "Nhân quả không phải mê tín — đó là quy luật của vũ trụ. Một niệm thiện hé mở cõi trời, một niệm ác mở cửa địa ngục. Tất cả đều khởi từ tâm." — Pháp sư Tịnh Không
        </p>
      </div>

      <QuanChieuNhanQua/>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5 mt-8">
        <ThapThienCard/>
        <LichSuQuanChieu/>
      </div>
    </div>
  );
}

// =================== WIDGET (compact for sidebar/dashboard) ===================
function LuanHoiWidget({ onOpen }) {
  const log = loadLHLog();
  const last = log.length ? log[log.length - 1] : null;
  const lastDao = last ? LUC_DAO.find(d => d.id === last.huongCoi) : null;

  return (
    <button onClick={onOpen} className="w-full text-left bg-gradient-to-br from-ink-2 to-ink-3 border border-gold/20 hover:border-gold/50 p-5 transition-all group relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none"
        style={{ background: lastDao ? `radial-gradient(circle, ${lastDao.color}, transparent 70%)` : 'radial-gradient(circle, #d4a04a, transparent 70%)' }}></div>
      <div className="relative flex items-start gap-4">
        <div className="w-14 h-14 flex-shrink-0">
          <VongLuanHoi size={56} highlightId={lastDao?.id}/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] tracking-[0.22em] uppercase text-gold font-medium mb-0.5">Lục Đạo · Nhân Quả</div>
          <div className="font-serif text-cream text-[16px] font-medium leading-snug mb-1">
            {last ? <>Lần gần nhất: <span className="italic text-gold-bright">{lastDao?.name}</span></> : 'Quán chiếu một việc đã làm'}
          </div>
          <div className="text-[12px] text-cream-dim leading-snug">
            {last ? `"${last.scenario.slice(0, 60)}${last.scenario.length > 60 ? '...' : ''}"` : 'Pháp sư AI sẽ luận nhân-quả theo Phật pháp.'}
          </div>
        </div>
        <span className="text-cream-dim group-hover:text-gold-bright text-lg flex-shrink-0">→</span>
      </div>
    </button>
  );
}
