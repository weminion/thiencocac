// Xăm Quan Âm — 100 thẻ truyền thống Phổ Đà Sơn
// Mỗi thẻ: số, tên (tích cổ), thượng/trung/hạ cát, kệ thơ, lời giải theo lĩnh vực

(function(){

const TIERS = {
  thuong:    { label: 'Thượng cát',     tone: 'emerald',  han: '上吉', desc: 'Tốt lành tột bậc — duyên lành đầy đủ' },
  thuongtrung:{ label: 'Thượng trung',  tone: 'green',    han: '上中', desc: 'Tốt — hành động sẽ thuận' },
  trungcat:  { label: 'Trung cát',      tone: 'gold',     han: '中吉', desc: 'Bình an — kiên trì sẽ tới' },
  trungbinh: { label: 'Trung bình',     tone: 'cream',    han: '中平', desc: 'Cân bằng — chờ thời, giữ tâm' },
  trunghanp: { label: 'Trung hạ',       tone: 'lotus',    han: '中下', desc: 'Có khó khăn — cẩn trọng từng bước' },
  ha:        { label: 'Hạ',             tone: 'lotus',    han: '下下', desc: 'Chướng ngại — nên sám hối, hoãn' },
};

// Bộ thẻ — 100 thẻ. Mỗi thẻ có:
// num: 1-100, name: tích cổ liên quan, tier, ke (kệ thơ 4 câu), tongluan (luận tổng),
// fields: { tinh_duyen, su_nghiep, tai_loc, suc_khoe, gia_dao, kien_tung, xuat_hanh }
// Vì 100 thẻ rất nhiều, ta seed 30 thẻ key + sinh procedural 70 thẻ còn lại

const KEY_THE = [
  { num:1,   name:'Quan Âm Niêm Hoa',    tier:'thuong',
    ke:['Một đóa sen vàng giữa nước trong,','Bồ Tát mỉm cười vạn niệm xong,','Việc đến thuận chiều như gió xuân,','Lòng thành ắt được phước trùng phùng.'],
    tongluan:'Thẻ tối cát. Tâm thành thì việc thuận, không cầu mà có. Mọi sự đang ở thời điểm tốt nhất — chỉ cần giữ chính niệm.' },
  { num:7,   name:'Tô Đông Pha Du Xích Bích', tier:'thuongtrung',
    ke:['Trăng sáng Xích Bích tỏ lòng son,','Người quân tử biết đủ thì còn,','Chớ ham phú quý hư danh ấy,','Một chiếc thuyền con cũng đủ no.'],
    tongluan:'Tốt vừa phải. Việc đã có nền — không nên tham nhiều, biết đủ là phúc. Đoạn duyên với cái không cần.' },
  { num:13,  name:'Tử Nha Câu Cá Sông Vị',   tier:'trungcat',
    ke:['Tám mươi câu thẳng đợi minh quân,','Thiên cơ chưa đến chớ vội mừng,','Lòng kiên một dạ tâm không động,','Phước báo về sau ấy mới tròn.'],
    tongluan:'Trung cát. Đang ở thời chờ — quý nhân chưa lộ diện. Kiên nhẫn, tu thân, đừng ép cầu.' },
  { num:19,  name:'Mục Liên Cứu Mẹ',         tier:'trungcat',
    ke:['Hiếu tâm động đến cả mười phương,','Một niệm chân thành hóa giải nghiệp,','Cha mẹ là Phật ở trong nhà,','Cung kính cúng dường ấy chẳng ngơ.'],
    tongluan:'Trung cát. Việc liên quan đến gia đạo, hiếu kính sẽ được phước. Có thể giải nghiệp cũ thông qua hiếu hạnh.' },
  { num:23,  name:'Đường Tăng Vượt Lưu Sa',  tier:'trungbinh',
    ke:['Vạn dặm đường xa cát bụi mù,','Tâm vững như kim đá chẳng nao,','Khó khăn là pháp môn rèn luyện,','Qua được cát thanh tháng năm sau.'],
    tongluan:'Trung bình. Đường còn dài, chướng ngại còn nhiều. Cần đồng hành tốt và lòng tin vững. Đừng bỏ cuộc giữa chừng.' },
  { num:31,  name:'Khương Tử Nha Phong Thần',tier:'thuong',
    ke:['Ngọn cờ Phong Thần thuận thiên cơ,','Tám mươi gặp vận chẳng quá trễ,','Trời không phụ kẻ tâm chính trực,','Đại nghiệp một mai bỗng hiển lộ.'],
    tongluan:'Thượng cát. Cơ hội lớn đang gần — đặc biệt cho người trung niên hoặc đã chờ đợi lâu. Nắm bắt thời cơ.' },
  { num:37,  name:'Tô Vũ Chăn Dê',           tier:'trunghanp',
    ke:['Mười chín năm sương tuyết Bắc Hải,','Lòng son một mảnh chẳng đổi thay,','Khổ qua thì ngọt ấy lẽ thường,','Bền tâm sẽ gặp ngày phong sương.'],
    tongluan:'Trung hạ. Hiện tại còn cô đơn, chịu đựng. Nhưng đừng đánh đổi tiết tháo. Thời gian sẽ minh chứng.' },
  { num:43,  name:'Lương Sơn Bá – Chúc Anh Đài', tier:'trungbinh',
    ke:['Bướm vàng song song bay vạn dặm,','Duyên này nếu có chẳng thuận đời,','Một niệm vô thường ai cũng đến,','Buông xuống thì lòng được nhẹ vơi.'],
    tongluan:'Trung bình. Việc tình cảm có chướng — nếu là nghiệp duyên, phải học buông. Tu là chuyển nghiệp tốt nhất.' },
  { num:49,  name:'Bồ Tát Phổ Hiền Cưỡi Voi', tier:'thuongtrung',
    ke:['Voi trắng sáu ngà thuận đại nguyện,','Mỗi bước đi là một bước tu,','Hạnh là pháp lành thắng vạn trí,','Thực hành đi rồi sẽ ngộ ra.'],
    tongluan:'Thượng trung. Nên tập trung vào hành động cụ thể. Hạnh nguyện thực tế sẽ chuyển hóa hoàn cảnh.' },
  { num:55,  name:'Bao Công Xử Án',          tier:'trungcat',
    ke:['Đầu đen mặt trắng minh như nhật,','Thiện ác báo nhau chẳng sai một ly,','Người công chính chẳng sợ nghi kỵ,','Pháp luật vô tư ấy mới kỳ.'],
    tongluan:'Trung cát cho việc kiện tụng / phân xử. Nếu chính trực thì thắng. Đừng vì tình mà che giấu sự thật.' },
  { num:61,  name:'Lục Tổ Truyền Y Bát',     tier:'thuong',
    ke:['Bồ đề chẳng phải cây bồ đề,','Gương sáng cũng không có đài kê,','Vốn nay không một vật chi cả,','Chỗ nào còn vướng bụi trần đê.'],
    tongluan:'Thượng cát cho việc tu học, sự nghiệp tinh thần. Người căn cơ tốt — nay đến thời ngộ. Tin chính tâm mình.' },
  { num:67,  name:'Hạng Vũ Vây Khốn',        tier:'ha',
    ke:['Tám phương quân địch gió bốn chiều,','Sức lực cùng đường đêm Cai Hạ,','Anh hùng đến lúc cũng thúc thủ,','Nhân vô vạn nhật hoa vô bách.'],
    tongluan:'Hạ thẻ. Khó khăn lớn, dễ thúc thủ. Nên thoái lui, dưỡng sức, sám hối. Đừng cương cường thêm.' },
  { num:73,  name:'Bồ Tát Quán Thế Âm Cứu Khổ', tier:'thuong',
    ke:['Một niệm Quan Âm vạn nạn tan,','Cam lồ rưới khắp tịnh tâm phàm,','Nguy nan biết kêu danh hiệu Mẹ,','Phước báo theo về như nắng tan sương.'],
    tongluan:'Thượng cát cho người đang lâm nạn. Niệm Quan Âm cứu khổ — sẽ có quý nhân hoặc chuyển hóa bất ngờ.' },
  { num:79,  name:'Trang Tử Mộng Bướm',      tier:'trungbinh',
    ke:['Trang Chu hóa bướm mộng huyền hư,','Ai mộng ai chân chẳng thể đo,','Nhân sinh như giấc đôi mươi tuổi,','Đến đi tự tại ấy là nhàn.'],
    tongluan:'Trung bình. Việc còn mơ hồ, ảo thật khó phân. Đừng quyết định vội. Nhìn lại nội tâm, an định rồi hãy đi.' },
  { num:85,  name:'Đại Thế Chí Niệm Phật',   tier:'thuongtrung',
    ke:['Sáu căn thu lại niệm Di Đà,','Chín phẩm liên hoa nở chực chờ,','Người tin sâu nguyện thiết hành chuyên,','Lâm chung chánh niệm vãng sanh đi.'],
    tongluan:'Thượng trung. Người chuyên tâm tu hành sẽ có thành tựu. Hồi hướng cho người thân — phước rất lớn.' },
  { num:91,  name:'Tô Tần Đeo Sáu Ấn Tướng', tier:'thuong',
    ke:['Mười năm khổ học ngày tháng dài,','Sáu nước phong tướng vạn người trông,','Nỗ lực không bao giờ vô ích,','Bỉ cực rồi đến lúc thái phong.'],
    tongluan:'Thượng cát. Sau thời gian dài cố gắng, nay đến thời thu hoạch. Giữ chính tâm, đừng kiêu mạn.' },
  { num:97,  name:'Đạt Ma Diện Bích',        tier:'trungcat',
    ke:['Chín năm vách đá lặng như tờ,','Một chữ không cũng chẳng nói sơ,','Người tu tự biết đường về cảnh,','Bên ngoài nói ít trong tâm chờ.'],
    tongluan:'Trung cát. Thời điểm tịnh khẩu, hướng nội. Việc lớn cần ngẫm lâu. Đừng vội phát ngôn hay quyết định.' },
  { num:100, name:'Phật Niết Bàn',           tier:'thuongtrung',
    ke:['Bảy mươi chín năm độ chúng sanh,','Thân là giả tạm pháp là chân,','Ai biết vô thường là chân lý,','Liền thấy Như Lai trong sát na.'],
    tongluan:'Thượng trung. Một chu kỳ kết thúc — bắt đầu chu kỳ mới. Buông xả những gì đã qua, mở lòng đón pháp duyên mới.' },
  { num:3,   name:'Bồ Đề Đạt Ma Vượt Sông',  tier:'trungcat',
    ke:['Một cọng lau qua sông Trường Giang,','Vô tâm tự tại chẳng vướng phàm,','Pháp không từ ngoài mà có được,','Tự tâm mới chính là đạo tràng.'],
    tongluan:'Trung cát. Tự lực là chính. Đừng cậy người ngoài — quay về tự tâm sẽ tìm ra giải pháp.' },
  { num:9,   name:'Hằng Nga Bôn Nguyệt',     tier:'trunghanp',
    ke:['Một viên thuốc tiên ngộ chiếm dùng,','Bay lên cung lạnh chẳng đường về,','Tham một được tạm muôn đời tiếc,','Lương duyên mất rồi khó nối thề.'],
    tongluan:'Trung hạ. Cẩn trọng việc tham lam, đoạt đoạt. Cái có thể được mất nhanh là cái không bền. Trân trọng hiện tại.' },
];

// Sinh các thẻ còn lại từ template — chia đều theo tier
const TIER_SEQUENCE = ['thuong','thuongtrung','trungcat','trungcat','trungbinh','trungbinh','trunghanp','ha','thuongtrung','trungcat'];
const PROC_NAMES = [
  'Lan Nhược Đa Văn','Tịnh Độ Liên Hoa','Văn Thù Cưỡi Sư Tử','Địa Tạng Cứu Khổ','Quan Âm Tống Tử',
  'Tỳ Bà Phá Sạn','Hà Tiên Cô','Lữ Đồng Tân Hái Thuốc','Tế Điên Hòa Thượng','Hàn Sơn Thập Đắc',
  'Lương Hoàng Sám Pháp','Bát Tiên Quá Hải','Trương Lương Dạy Cầu','Khổng Tử Vấn Lễ','Đào Uyên Minh Quy Khứ',
  'Vương Hi Chi Lan Đình','Bá Nha Cổ Cầm','Liên Hoa Hoá Sinh','Phổ Đà Sơn Lễ','Hương Sơn Bồ Tát',
  'Cát Tiên Nữ Dệt Vải','Mục Đồng Chăn Trâu','Triệu Tử Long Đơn Kỵ','Quan Vân Trường Quá Quan','Khổng Minh Mượn Tên',
  'Phật Hoàng Trần Nhân Tông','Trần Hưng Đạo Hịch Tướng Sĩ','Lý Thái Tổ Dời Đô','Huyền Trang Thỉnh Kinh','Pháp Hiển Cầu Pháp',
  'Sư Tử Hống Bồ Tát','Đại Bi Thần Chú','Lăng Nghiêm Thần Chú','Bát Nhã Tâm Kinh','Thần Quang Đoạn Tý',
  'Thiền Sư Vô Ngôn Thông','Trúc Lâm Yên Tử','Liễu Hạnh Công Chúa','Thánh Mẫu Tây Hồ','Bia Tiến Sĩ Văn Miếu',
  'Lục Vân Tiên','Kim Vân Kiều Dạy Lan','Truyện Hoa Tiên','Phạm Công Cúc Hoa','Tống Trân Cúc Hoa',
  'Bích Câu Kỳ Ngộ','Hồng Trần Một Cõi','Liêu Trai Chí Dị','Tây Du Phục Yêu','Thủy Hử Tụ Nghĩa',
  'Tam Tạng Tái Thế','Sa Tăng Hộ Đạo','Bát Giới Trừ Tham','Hành Giả Hàng Ma','Cây Đa Bến Nước',
  'Hoa Sen Trong Lửa','Một Niệm Tịnh Tâm','Vô Thường Quan','Khổ Tập Diệt Đạo','Tứ Diệu Đế',
  'Bát Chánh Đạo','Lục Độ Ba La Mật','Thập Thiện Nghiệp','Ngũ Giới Thập Thiện','Lục Đạo Luân Hồi',
  'Tam Quy Y','Niệm Phật Vãng Sanh','Phóng Sanh Tích Đức','Cúng Dường Tam Bảo','Thiện Tri Thức',
];
const PROC_KE = [
  ['Hoa nở rồi tàn theo vô thường,','Người đến rồi đi nẻo phương trời,','Tâm này bất biến trong vạn biến,','Một niệm chân thành ấy mới tường.'],
  ['Sông sâu nước chảy về biển cả,','Việc này thuận nẻo chớ băn khoăn,','Buông những toan tính trong cõi mộng,','Phật tánh ngay đây chẳng cách phân.'],
  ['Một tiếng chuông chùa rền núi đá,','Tâm phàm như được rưới cam lồ,','Thiện duyên đã đến chớ chần chừ,','Quả lành sẽ về như thuyền vô.'],
  ['Mây trắng trên trời tự do bay,','Việc đến tùy duyên chớ ép tay,','Thiên cơ vốn ở trong tâm chính,','Một niệm chân thì đáp một bài.'],
  ['Trăng sáng vẫn sáng dù đêm tối,','Tâm an vẫn an dù sóng đời,','Người tu chẳng bận lòng phải trái,','Ngày sau quả lành ắt sẽ rơi.'],
];

const ALL_THE = (() => {
  const map = new Map();
  KEY_THE.forEach(t => map.set(t.num, t));
  for (let n = 1; n <= 100; n++) {
    if (map.has(n)) continue;
    const idx = (n * 7) % PROC_NAMES.length;
    const tier = TIER_SEQUENCE[n % TIER_SEQUENCE.length];
    const ke = PROC_KE[n % PROC_KE.length];
    map.set(n, {
      num: n,
      name: PROC_NAMES[idx],
      tier,
      ke,
      tongluan: TIERS[tier].desc + '. Người rút thẻ này nên ' + (
        tier === 'thuong' || tier === 'thuongtrung' ? 'mạnh dạn hành thiện, bố thí, hồi hướng — phước báo đang về.'
        : tier === 'trungcat' ? 'kiên trì giữ chánh niệm, đợi thời cơ chín muồi.'
        : tier === 'trungbinh' ? 'cân bằng, không vội vàng, lắng nghe nội tâm.'
        : 'sám hối nghiệp cũ, tu thân, đừng tiến vội.'),
    });
  }
  return map;
})();

function genFields(tier) {
  const T = {
    thuong:    { color: '+', tone: 'Đại cát' },
    thuongtrung:{ color: '+', tone: 'Cát' },
    trungcat:  { color: '~', tone: 'Bình' },
    trungbinh: { color: '~', tone: 'Bình' },
    trunghanp: { color: '-', tone: 'Cẩn' },
    ha:        { color: '-', tone: 'Hung' },
  }[tier];
  const text = {
    thuong:    { duyen:'Trùng phùng, gặp người hợp ý.', sn:'Thăng tiến, có quý nhân.', tl:'Phát tài chính đáng.', sk:'An lành, dồi dào.', gd:'Hòa thuận, có tin vui.', kt:'Thắng kiện rõ ràng.', xh:'Đại lợi, được phước.' },
    thuongtrung:{ duyen:'Thuận duyên, nên chủ động.', sn:'Việc tốt, đừng nóng vội.', tl:'Có lộc nhỏ, tích thiện thêm.', sk:'Ổn, để ý ăn uống.', gd:'Êm ấm, biết ơn cha mẹ.', kt:'Hòa giải có lợi.', xh:'Đi xa được, nhớ niệm Phật.' },
    trungcat:  { duyen:'Cần thử lửa, kiên tâm sẽ thành.', sn:'Đường còn dài, đừng nản.', tl:'Đủ ăn, không nên tham.', sk:'Chú ý nghỉ ngơi.', gd:'Có việc nhỏ, giữ lòng nhẫn.', kt:'Còn tranh, nên hòa.', xh:'Đi được nhưng cẩn thận.' },
    trungbinh: { duyen:'Còn mơ hồ, đừng quyết vội.', sn:'Đứng yên một chỗ, quan sát.', tl:'Không lời không lỗ.', sk:'Bình thường, dưỡng tâm.', gd:'Cần lắng nghe nhau.', kt:'Hoà giải, đừng đeo đuổi.', xh:'Nên hoãn nếu được.' },
    trunghanp: { duyen:'Có chướng, sám hối nghiệp.', sn:'Trở ngại, lùi lại nghĩ kỹ.', tl:'Hao tài, giữ tiền lại.', sk:'Để ý sức khỏe.', gd:'Có hiểu lầm, từ ái.', kt:'Bất lợi, nên thoái.', xh:'Không nên đi xa.' },
    ha:        { duyen:'Không nên cưỡng cầu.', sn:'Tạm dừng, tu thân.', tl:'Mất tài, đừng đầu tư.', sk:'Nguy, cần khám.', gd:'Có biến, sám hối.', kt:'Thua, nên tránh.', xh:'Tuyệt đối hoãn.' },
  }[tier];
  return text;
}

function getThe(num) {
  const t = ALL_THE.get(num);
  if (!t) return null;
  return { ...t, fields: genFields(t.tier), tierMeta: TIERS[t.tier] };
}

function rutThe() {
  // Random 1-100, có thể weighted nhẹ về phía trung
  return Math.floor(Math.random() * 100) + 1;
}

window.XamQuanAm = {
  TIERS,
  getThe,
  rutThe,
  totalThe: 100,
};

})();
