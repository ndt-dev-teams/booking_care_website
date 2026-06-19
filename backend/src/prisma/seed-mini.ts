/**
 * prisma/seed.minimal.ts
 * Chạy: npx ts-node prisma/seed.minimal.ts
 *       hoặc thay entry trong package.json prisma.seed
 *
 * Seed tối giản để test: specialties, hospitals, doctors, 1 admin.
 * Không tạo patients, appointments, payments hay reviews.
 */

import {
  AuthProvider,
  type Doctor,
  HospitalType,
  PrismaClient,
  UserRole,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 12;
const ADMIN_PASSWORD = 'Admin@123456';
const DOCTOR_PASSWORD = 'Doctor@123456';

// ─── Dữ liệu ──────────────────────────────────────

const specialties = [
  {
    name: 'Đa khoa',
    slug: 'da-khoa',
    description:
      'Khám tổng quát, sàng lọc ban đầu và định hướng chuyên khoa phù hợp khi chưa xác định rõ nguyên nhân bệnh lý.',
    imgURL: '',
    diseases: [
      'Sốt chưa rõ nguyên nhân, sốt kéo dài trên 3 ngày',
      'Mệt mỏi, suy nhược cơ thể kéo dài',
      'Đau nhức toàn thân không rõ nguyên nhân',
      'Cảm cúm, cảm lạnh, sổ mũi, hắt hơi',
      'Đau đầu thông thường',
      'Chóng mặt, hoa mắt nhẹ',
      'Sụt cân không chủ ý',
      'Mất ngủ, khó ngủ nhẹ',
      'Rối loạn tiêu hóa nhẹ: đầy bụng, khó tiêu, buồn nôn',
      'Khám sức khỏe định kỳ, khám tổng quát trước khi đi làm/du học',
      'Chưa biết bệnh thuộc chuyên khoa nào, cần được tư vấn và định hướng',
    ],
    information: [
      'Khám tổng quát, đo các chỉ số sinh tồn: huyết áp, nhịp tim, nhiệt độ, SpO2, BMI',
      'Khai thác bệnh sử, tiền sử bệnh và tiền sử dùng thuốc',
      'Chỉ định xét nghiệm cơ bản: công thức máu, đường huyết, chức năng gan thận',
      'Đánh giá triệu chứng, chẩn đoán sơ bộ và tư vấn chuyển chuyên khoa phù hợp',
      'Khám sức khỏe định kỳ, lập hồ sơ sức khỏe cá nhân',
    ],
  },
  {
    name: 'Tim mạch',
    slug: 'tim-mach',
    description:
      'Chẩn đoán và điều trị các bệnh lý tim và hệ mạch máu, từ tăng huyết áp, rối loạn nhịp tim đến suy tim và bệnh mạch vành.',
    imgURL: '',
    diseases: [
      'Tăng huyết áp (huyết áp cao)',
      'Đau ngực, nặng tức ngực, khó thở khi gắng sức',
      'Hồi hộp, đánh trống ngực, tim đập nhanh hoặc không đều',
      'Ngất xỉu, choáng váng đột ngột',
      'Phù chân, mắt cá chân, khó thở khi nằm',
      'Suy tim',
      'Rối loạn nhịp tim: rung nhĩ, nhịp nhanh, ngoại tâm thu',
      'Bệnh mạch vành, thiếu máu cơ tim, đau thắt ngực',
      'Nhồi máu cơ tim (cấp cứu hoặc theo dõi sau điều trị)',
      'Bệnh van tim: hẹp/hở van hai lá, van động mạch chủ',
      'Rối loạn lipid máu (mỡ máu cao)',
      'Bệnh cơ tim, viêm màng ngoài tim',
      'Tăng áp động mạch phổi',
      'Bệnh tim bẩm sinh ở người lớn',
    ],
    information: [
      'Đo điện tâm đồ (ECG) đánh giá nhịp và hoạt động điện của tim',
      'Siêu âm tim Doppler đánh giá cấu trúc và chức năng tim',
      'Holter điện tâm đồ 24 giờ theo dõi rối loạn nhịp',
      'Nghiệm pháp gắng sức (Treadmill test) đánh giá thiếu máu cơ tim',
      'Xét nghiệm men tim, mỡ máu, đường huyết liên quan tim mạch',
      'Điều chỉnh phác đồ thuốc huyết áp, suy tim, rối loạn nhịp',
      'Tư vấn phòng ngừa biến cố tim mạch: chế độ ăn, vận động, kiểm soát yếu tố nguy cơ',
    ],
  },
  {
    name: 'Nội tiết – Đái tháo đường',
    slug: 'noi-tiet',
    description:
      'Chẩn đoán và quản lý các bệnh lý tuyến nội tiết và chuyển hóa: đái tháo đường, tuyến giáp, béo phì và rối loạn nội tiết khác.',
    imgURL: '',
    diseases: [
      'Đái tháo đường tuýp 1 và tuýp 2: khát nhiều, tiểu nhiều, mệt mỏi, sụt cân',
      'Đái tháo đường thai kỳ',
      'Hạ đường huyết: run tay, vã mồ hôi, tim đập nhanh, chóng mặt',
      'Biến chứng đái tháo đường: tê bì chân tay, giảm thị lực, suy thận',
      'Cường giáp: sụt cân, hồi hộp, ra nhiều mồ hôi, run tay, lồi mắt',
      'Suy giáp: tăng cân, mệt mỏi, táo bón, da khô, chịu lạnh kém',
      'Bướu cổ, nhân tuyến giáp, tuyến giáp to',
      'Béo phì, thừa cân không kiểm soát được bằng ăn kiêng và tập luyện',
      'Rối loạn lipid máu (mỡ máu cao)',
      'Hội chứng chuyển hóa: béo bụng, tăng huyết áp, mỡ máu cao',
      'Loãng xương do nguyên nhân nội tiết (mãn kinh, suy thượng thận)',
      'Rối loạn hormone tuyến yên, suy thượng thận',
      'Hội chứng buồng trứng đa nang (PCOS) – khía cạnh nội tiết',
    ],
    information: [
      'Xét nghiệm đường huyết, HbA1c đánh giá và theo dõi kiểm soát đái tháo đường',
      'Xét nghiệm hormone tuyến giáp (TSH, FT3, FT4) chẩn đoán bệnh tuyến giáp',
      'Siêu âm tuyến giáp tầm soát nhân giáp, bướu cổ',
      'Tư vấn chế độ ăn, vận động phù hợp cho người bệnh đái tháo đường, béo phì',
      'Điều chỉnh phác đồ thuốc điều trị đái tháo đường, rối loạn tuyến giáp định kỳ',
      'Tầm soát và theo dõi các biến chứng mạn tính của đái tháo đường',
      'Tư vấn quản lý rối loạn lipid máu và hội chứng chuyển hóa',
    ],
  },
  {
    name: 'Thần kinh',
    slug: 'than-kinh',
    description:
      'Chẩn đoán và điều trị các bệnh lý hệ thần kinh trung ương và ngoại biên: đau đầu, đột quỵ, động kinh, Parkinson và các bệnh thoái hóa thần kinh.',
    imgURL: '',
    diseases: [
      'Đau nửa đầu (migraine): đau dữ dội một bên, buồn nôn, sợ ánh sáng, tiếng ồn',
      'Đau đầu căng cơ mạn tính: đau âm ỉ hai bên, cảm giác bị siết chặt',
      'Chóng mặt, mất thăng bằng do rối loạn tiền đình thần kinh trung ương',
      'Mất ngủ, rối loạn giấc ngủ nặng',
      'Tê bì, yếu liệt tay chân một bên hoặc hai bên',
      'Đột quỵ (tai biến mạch máu não): méo miệng, liệt nửa người, nói khó đột ngột',
      'Động kinh, co giật',
      'Bệnh Parkinson: run tay khi nghỉ, cứng cơ, chậm chạp vận động',
      'Suy giảm trí nhớ, hay quên, sa sút trí tuệ',
      'Liệt mặt ngoại biên (liệt Bell)',
      'Đau dây thần kinh: đau thần kinh tọa, đau dây thần kinh liên sườn, đau sau zona',
      'Hội chứng ống cổ tay: tê ngón tay, đau cổ tay về đêm',
      'Nhức đầu sau chấn thương đầu',
      'Rối loạn lo âu biểu hiện qua triệu chứng thần kinh (tê, run, hồi hộp)',
    ],
    information: [
      'Khám thần kinh đánh giá phản xạ, vận động, cảm giác, thần kinh sọ não',
      'Chỉ định chụp CT/MRI sọ não chẩn đoán đột quỵ, u não, tổn thương cấu trúc',
      'Điện não đồ (EEG) chẩn đoán động kinh và các rối loạn điện não',
      'Đánh giá và tư vấn điều trị các rối loạn giấc ngủ',
      'Theo dõi điều trị dài hạn các bệnh thần kinh mạn tính (Parkinson, động kinh)',
      'Tư vấn phòng ngừa và xử trí cơn đau đầu mạn tính, đau nửa đầu',
      'Đánh giá nguy cơ và tư vấn phòng ngừa đột quỵ',
    ],
  },
  {
    name: 'Tiêu hóa – Gan mật',
    slug: 'tieu-hoa',
    description:
      'Chẩn đoán và điều trị các bệnh lý đường tiêu hóa (dạ dày, ruột, đại tràng) và các cơ quan phụ trợ (gan, mật, tụy). Tầm soát ung thư đường tiêu hóa.',
    imgURL: '',
    diseases: [
      'Đau thượng vị, đau dạ dày, nóng rát vùng thượng vị sau ăn',
      'Ợ hơi, ợ chua, trào ngược dạ dày thực quản (GERD)',
      'Buồn nôn, nôn kéo dài',
      'Tiêu chảy cấp hoặc mạn tính',
      'Táo bón mạn tính, khó đại tiện',
      'Phân có máu, phân đen',
      'Đầy bụng, chướng hơi, khó tiêu sau bữa ăn',
      'Hội chứng ruột kích thích: đau bụng, thay đổi thói quen đại tiện',
      'Nhiễm vi khuẩn Helicobacter pylori (HP)',
      'Vàng da, vàng mắt',
      'Đau hạ sườn phải, đau lan vai phải sau bữa ăn nhiều dầu mỡ (sỏi mật)',
      'Viêm gan virus B, C: mệt mỏi, chán ăn, vàng da',
      'Gan nhiễm mỡ, xơ gan',
      'Viêm tụy cấp: đau thượng vị dữ dội lan ra sau lưng',
      'Polyp đại tràng, polyp dạ dày (tầm soát)',
      'Xuất huyết tiêu hóa: nôn máu, tiêu phân đen',
    ],
    information: [
      'Nội soi dạ dày – thực quản chẩn đoán viêm loét, trào ngược, nhiễm HP',
      'Nội soi đại tràng tầm soát polyp và ung thư đại trực tràng',
      'Xét nghiệm chức năng gan, men gan, viêm gan virus B, C',
      'Siêu âm bụng tổng quát đánh giá gan, mật, tụy, lách',
      'Test thở chẩn đoán vi khuẩn HP (C13 Urea Breath Test)',
      'Tư vấn dinh dưỡng cho người bệnh tiêu hóa, gan mật',
      'Theo dõi và điều trị các bệnh lý gan mạn tính (viêm gan, gan nhiễm mỡ, xơ gan)',
    ],
  },
  {
    name: 'Cơ xương khớp',
    slug: 'co-xuong-khop',
    description:
      'Chẩn đoán và điều trị các bệnh lý và chấn thương hệ vận động: xương, khớp, cơ, gân, dây chằng. Điều trị bảo tồn và tư vấn can thiệp ngoại khoa khi cần.',
    imgURL: '',
    diseases: [
      'Đau khớp gối, sưng khớp gối, khớp gối lạo xạo khi đi',
      'Đau lưng dưới cấp và mạn tính',
      'Đau thần kinh tọa: đau lan từ lưng xuống mông và chân',
      'Đau cổ, đau vai gáy, cứng cổ buổi sáng',
      'Thoát vị đĩa đệm cột sống cổ, cột sống thắt lưng',
      'Thoái hóa khớp gối, khớp háng, cột sống',
      'Viêm khớp dạng thấp: sưng đau nhiều khớp nhỏ đối xứng, cứng khớp buổi sáng',
      'Gout: đau dữ dội, sưng nóng đỏ khớp ngón chân cái hoặc các khớp khác',
      'Loãng xương, đau xương, nguy cơ gãy xương',
      'Viêm gân, viêm bao hoạt dịch: đau khi cử động khớp vai, khuỷu, gót chân',
      'Chấn thương dây chằng, bong gân cổ chân, đầu gối',
      'Gãy xương sau chấn thương',
      'Hội chứng ống cổ tay: tê ngón tay, đau cổ tay',
      'Viêm cột sống dính khớp: đau lưng sáng sớm, giảm khi vận động',
      'Đau gót chân, viêm cân gan bàn chân',
      'Đau cơ xơ hóa: đau mỏi toàn thân lan rộng',
    ],
    information: [
      'Khám lâm sàng đánh giá tầm vận động khớp, mức độ đau và chức năng',
      'Chỉ định X-quang, MRI, siêu âm khớp đánh giá tổn thương xương khớp, mô mềm',
      'Tiêm khớp (corticosteroid, acid hyaluronic) điều trị thoái hóa và viêm khớp',
      'Vật lý trị liệu – phục hồi chức năng sau chấn thương hoặc phẫu thuật',
      'Tư vấn điều trị nội khoa các bệnh khớp mạn tính (gout, viêm khớp dạng thấp)',
      'Đo mật độ xương (DXA) tầm soát và điều trị loãng xương',
      'Tư vấn chỉ định phẫu thuật chấn thương chỉnh hình khi cần thiết',
    ],
  },
  {
    name: 'Tai mũi họng',
    slug: 'tai-mui-hong',
    description:
      'Khám và điều trị các bệnh lý vùng tai, mũi, họng, xoang và thanh quản. Điều trị nội khoa và tư vấn can thiệp phẫu thuật.',
    imgURL: '',
    diseases: [
      'Viêm xoang cấp và mạn: đau vùng mặt, nghẹt mũi, chảy dịch mũi sau họng',
      'Viêm mũi dị ứng: hắt hơi liên tục, ngứa mũi, chảy nước mũi trong',
      'Viêm họng cấp và mạn: đau họng, rát họng, nuốt đau',
      'Viêm amidan tái phát: đau họng, sốt cao, nuốt khó',
      'Viêm thanh quản, khàn tiếng, mất giọng',
      'Ù tai, nghe kém, điếc một bên hoặc hai bên',
      'Viêm tai giữa: đau tai, chảy tai, nghe kém ở trẻ em',
      'Viêm tai ngoài: đau tai khi kéo vành tai',
      'Chóng mặt do rối loạn tiền đình tai trong (BPPV, Meniere)',
      'Polyp mũi, lệch vách ngăn mũi gây nghẹt mũi mạn tính',
      'Dị vật tai mũi họng (đặc biệt ở trẻ em)',
      'Ngủ ngáy, ngưng thở khi ngủ',
      'Chảy máu cam tái phát',
      'Rối loạn giọng nói, khàn tiếng kéo dài trên 2 tuần',
    ],
    information: [
      'Nội soi tai mũi họng đánh giá niêm mạc, dịch tiết, tổn thương',
      'Đo thính lực, đánh giá chức năng nghe',
      'Nội soi thanh quản đánh giá dây thanh và chức năng phát âm',
      'Hút rửa mũi, xoang; lấy dị vật tai mũi họng',
      'Tư vấn điều trị nội khoa hoặc chỉ định phẫu thuật (cắt amidan, nạo VA, mổ xoang)',
      'Điều trị viêm mũi dị ứng theo mùa và mạn tính',
    ],
  },
  {
    name: 'Da liễu',
    slug: 'da-lieu',
    description:
      'Chẩn đoán và điều trị các bệnh lý da, tóc, móng và niêm mạc. Điều trị nội – ngoại khoa và tư vấn chăm sóc da.',
    imgURL: '',
    diseases: [
      'Mụn trứng cá: mụn viêm, mụn bọc, mụn đầu đen/trắng',
      'Viêm da cơ địa (chàm): ngứa, da khô, nứt nẻ, nổi mảng đỏ',
      'Viêm da tiếp xúc: phát ban, nổi đỏ, ngứa sau tiếp xúc hóa chất hoặc mỹ phẩm',
      'Mề đay, mẩn ngứa dị ứng: nổi ban đỏ, ngứa toàn thân',
      'Nấm da, lác đồng tiền, nấm móng, hắc lào',
      'Vảy nến: mảng da đỏ, bong tróc vảy trắng',
      'Rụng tóc, hói đầu, tóc thưa dần',
      'Nám da, tàn nhang, đốm sắc tố, da không đều màu',
      'Zona thần kinh (giời leo): đau dữ dội kèm mụn nước thành dải',
      'Viêm nang lông, nhọt, chốc lở',
      'Ghẻ ngứa: ngứa dữ dội về đêm, lan sang người khác trong nhà',
      'Mụn cóc, mụn cơm (u nhú virus)',
      'Sẹo lồi, sẹo rỗ, sẹo thâm sau mụn',
      'Da liễu thẩm mỹ: điều trị nám, tàn nhang, sẹo bằng laser hoặc peel',
      'Ung thư da (tầm soát tổn thương nghi ngờ: nốt ruồi thay đổi, vết loét không lành)',
    ],
    information: [
      'Soi da (dermoscopy) đánh giá tổn thương da, nốt ruồi, sắc tố',
      'Điều trị mụn trứng cá: thuốc bôi, thuốc uống, lấy nhân mụn y khoa',
      'Test áp bì (patch test) xác định nguyên nhân dị ứng tiếp xúc',
      'Sinh thiết da khi nghi ngờ bệnh lý ác tính hoặc cần chẩn đoán mô bệnh học',
      'Điều trị bằng laser, áp lạnh, đốt điện cho các tổn thương da lành tính',
      'Tư vấn liệu trình điều trị nám, tàn nhang, sẹo theo từng cơ địa',
    ],
  },
  {
    name: 'Mắt',
    slug: 'mat',
    description:
      'Khám và điều trị các bệnh lý thị lực và cấu trúc mắt: tật khúc xạ, bệnh đáy mắt, tăng nhãn áp và đục thủy tinh thể.',
    imgURL: '',
    diseases: [
      'Cận thị, viễn thị, loạn thị: nhìn mờ xa hoặc gần, mỏi mắt khi đọc',
      'Khô mắt: cảm giác cộm, rát, đỏ mắt, chảy nước mắt nhiều',
      'Viêm kết mạc (đau mắt đỏ): đỏ mắt, tiết ghèn, ngứa mắt',
      'Viêm giác mạc: đau mắt dữ dội, sợ ánh sáng, nhìn mờ',
      'Đục thủy tinh thể: nhìn mờ dần, nhìn đôi, lóa mắt ban đêm',
      'Tăng nhãn áp (glôcôm): đau nhức mắt, nhức đầu, nhìn hào quang quanh đèn',
      'Thoái hóa điểm vàng: nhìn mờ trung tâm, đường thẳng bị méo',
      'Bệnh võng mạc đái tháo đường (biến chứng mắt của bệnh tiểu đường)',
      'Lác mắt, nhược thị ở trẻ em',
      'Viêm bờ mi: ngứa, đỏ, bong tróc vùng bờ mi',
      'Tật khúc xạ ở trẻ em, mắt lười',
      'Dị vật giác mạc/kết mạc, cảm giác cộm trong mắt',
      'Mắt đỏ, chảy nước mắt sau chấn thương',
    ],
    information: [
      'Đo khúc xạ xác định độ cận/viễn/loạn thị và kê đơn kính phù hợp',
      'Đo nhãn áp tầm soát bệnh glôcôm',
      'Soi đáy mắt đánh giá tình trạng võng mạc, dây thần kinh thị giác',
      'Khám và điều trị các bệnh viêm nhiễm mắt',
      'Tư vấn và theo dõi điều trị đục thủy tinh thể, chỉ định phẫu thuật phaco khi cần',
      'Tầm soát biến chứng mắt ở người bệnh đái tháo đường, tăng huyết áp',
      'Tư vấn kính thuốc, kính áp tròng và chăm sóc mắt hàng ngày',
    ],
  },
  {
    name: 'Sản phụ khoa',
    slug: 'san-phu-khoa',
    description:
      'Chăm sóc sức khỏe sinh sản và phụ khoa toàn diện: khám phụ khoa định kỳ, quản lý thai kỳ, tầm soát ung thư và tư vấn nội tiết sinh sản.',
    imgURL: '',
    diseases: [
      'Rối loạn kinh nguyệt: kinh không đều, kinh ít, rong kinh, đau bụng kinh dữ dội',
      'Khí hư bất thường: màu lạ, mùi hôi, ngứa vùng kín',
      'Viêm âm đạo, viêm cổ tử cung',
      'Theo dõi thai kỳ theo từng tam cá nguyệt (siêu âm thai)',
      'Buồn nôn, nôn nặng trong thai kỳ',
      'Đau bụng, ra máu bất thường khi mang thai',
      'U xơ tử cung: đau bụng dưới, kinh nhiều, tiểu nhiều lần',
      'U nang buồng trứng: đau bụng dưới một bên, đau khi quan hệ',
      'Lạc nội mạc tử cung: đau bụng kinh dữ dội, đau khi quan hệ, khó mang thai',
      'Hội chứng buồng trứng đa nang (PCOS): kinh không đều, mụn trứng cá, rậm lông',
      'Vô sinh, hiếm muộn: không mang thai sau 1 năm quan hệ không tránh thai',
      'Mãn kinh: bốc hỏa, đổ mồ hôi đêm, khô âm đạo, mất ngủ',
      'Tầm soát ung thư cổ tử cung (Pap smear, xét nghiệm HPV)',
      'Tư vấn tiêm vaccine HPV phòng ung thư cổ tử cung',
      'Tư vấn kế hoạch hóa gia đình, lựa chọn biện pháp tránh thai',
    ],
    information: [
      'Khám phụ khoa định kỳ và tầm soát các bệnh lý phụ khoa',
      'Siêu âm thai theo dõi sự phát triển của thai nhi qua từng giai đoạn',
      'Xét nghiệm Pap smear, HPV tầm soát ung thư cổ tử cung',
      'Soi cổ tử cung khi phát hiện bất thường tế bào học',
      'Tư vấn tiền sản, dinh dưỡng và chăm sóc thai kỳ',
      'Tư vấn kế hoạch hóa gia đình và các biện pháp tránh thai',
      'Khám và điều trị các bệnh viêm nhiễm phụ khoa thường gặp',
    ],
  },
  {
    name: 'Nhi khoa',
    slug: 'nhi-khoa',
    description:
      'Chăm sóc sức khỏe toàn diện cho trẻ từ sơ sinh đến 16 tuổi: điều trị bệnh nhiễm trùng, theo dõi tăng trưởng, tiêm chủng và tư vấn dinh dưỡng.',
    imgURL: '',
    diseases: [
      'Sốt cao ở trẻ (trên 38.5°C), sốt kéo dài',
      'Sốt phát ban, sốt virus',
      'Ho, viêm phế quản, viêm tiểu phế quản ở trẻ',
      'Viêm phổi ở trẻ: sốt, ho nhiều, thở nhanh, khó thở',
      'Tiêu chảy cấp, nôn nhiều, nguy cơ mất nước ở trẻ',
      'Tay chân miệng: loét miệng, mụn nước lòng bàn tay, bàn chân',
      'Sốt xuất huyết ở trẻ: sốt cao, đau bụng, xuất huyết dưới da',
      'Viêm họng, viêm amidan ở trẻ: đau họng, sốt, bỏ ăn',
      'Hen suyễn ở trẻ: thở khò khè, ho nhiều về đêm',
      'Dị ứng, mề đay ở trẻ: nổi ban đỏ, ngứa sau ăn hoặc tiếp xúc',
      'Suy dinh dưỡng, chậm tăng cân, thấp còi',
      'Thiếu máu do thiếu sắt ở trẻ',
      'Quấy khóc, rối loạn giấc ngủ ở trẻ sơ sinh',
      'Chậm phát triển tâm thần vận động: chậm nói, chậm đi',
      'Khám sức khỏe định kỳ và tiêm chủng theo lịch',
    ],
    information: [
      'Khám tổng quát và theo dõi tăng trưởng theo biểu đồ chuẩn WHO',
      'Tư vấn và thực hiện tiêm chủng theo lịch tiêm chủng quốc gia và mở rộng',
      'Hướng dẫn dinh dưỡng: bú mẹ, ăn dặm, ăn cơm theo từng giai đoạn',
      'Chẩn đoán và điều trị bệnh nhiễm trùng đường hô hấp, tiêu hóa',
      'Tư vấn xử trí sốt, ho, tiêu chảy tại nhà và dấu hiệu cần nhập viện',
      'Đánh giá phát triển tâm thần – vận động theo độ tuổi',
    ],
  },
  {
    name: 'Hô hấp',
    slug: 'ho-hap',
    description:
      'Chẩn đoán và điều trị các bệnh lý đường hô hấp: phổi, phế quản và màng phổi. Điều trị bảo tồn và tư vấn can thiệp khi cần.',
    imgURL: '',
    diseases: [
      'Ho kéo dài trên 3 tuần không rõ nguyên nhân',
      'Khó thở khi gắng sức hoặc khi nghỉ',
      'Thở khò khè, thở rít',
      'Hen suyễn: lên cơn khó thở, khò khè tái phát',
      'Bệnh phổi tắc nghẽn mạn tính (COPD): khó thở dần, ho có đờm mạn tính',
      'Viêm phổi: sốt, ho có đờm, đau ngực',
      'Viêm phế quản cấp và mạn tính',
      'Giãn phế quản: ho ra nhiều đờm đặc, ho máu',
      'Tràn dịch màng phổi, tràn khí màng phổi',
      'Lao phổi: ho kéo dài, sốt về chiều, sụt cân, ra mồ hôi đêm',
      'Ngủ ngáy, ngưng thở khi ngủ (phối hợp với Tai Mũi Họng)',
      'Ho ra máu',
      'Tầm soát ung thư phổi ở người hút thuốc lá',
    ],
    information: [
      'Đo chức năng hô hấp (spirometry) đánh giá tắc nghẽn và hạn chế thông khí',
      'Chụp X-quang phổi, CT ngực chẩn đoán viêm phổi, u phổi, lao',
      'Nội soi phế quản khảo sát tổn thương đường thở',
      'Test lao (Mantoux, IGRA) và điều trị lao phổi theo phác đồ',
      'Quản lý hen suyễn, COPD dài hạn và điều chỉnh phác đồ thuốc',
      'Tư vấn cai thuốc lá và phòng ngừa bệnh phổi nghề nghiệp',
    ],
  },
  {
    name: 'Thận – Tiết niệu',
    slug: 'than-tiet-nieu',
    description:
      'Chẩn đoán và điều trị các bệnh lý thận và đường tiết niệu: sỏi thận, viêm thận, suy thận và các bệnh lý tuyến tiền liệt.',
    imgURL: '',
    diseases: [
      'Tiểu buốt, tiểu rắt, tiểu đau',
      'Tiểu máu: nước tiểu màu hồng, đỏ hoặc nâu',
      'Đau quặn hông lưng, đau lan xuống bẹn (sỏi thận, sỏi niệu quản)',
      'Tiểu đục, tiểu có mủ, tiểu mùi hôi',
      'Tiểu nhiều lần về đêm, tiểu không tự chủ',
      'Phù chân, phù mặt buổi sáng (liên quan thận)',
      'Viêm bàng quang cấp, viêm đường tiết niệu tái phát',
      'Viêm thận – bể thận cấp: sốt cao, đau hông lưng, tiểu buốt',
      'Sỏi thận, sỏi niệu quản, sỏi bàng quang',
      'Suy thận mạn: mệt mỏi, phù, thiếu máu, tăng huyết áp',
      'Hội chứng thận hư: phù nhiều, tiểu đạm nặng',
      'Phì đại tuyến tiền liệt (ở nam giới): tiểu yếu, tiểu ngắt quãng, tiểu không hết',
      'Tầm soát ung thư thận, ung thư bàng quang, ung thư tuyến tiền liệt',
    ],
    information: [
      'Xét nghiệm nước tiểu tổng quát, cấy nước tiểu chẩn đoán nhiễm trùng đường tiết niệu',
      'Xét nghiệm chức năng thận: creatinine, eGFR, điện giải đồ',
      'Siêu âm thận – tiết niệu phát hiện sỏi, u, giãn đài bể thận',
      'Xét nghiệm PSA tầm soát ung thư tuyến tiền liệt',
      'Nội soi bàng quang chẩn đoán và can thiệp tổn thương đường tiết niệu dưới',
      'Quản lý suy thận mạn và tư vấn chế độ ăn – theo dõi định kỳ',
    ],
  },
  {
    name: 'Nam học',
    slug: 'nam-hoc',
    description:
      'Chăm sóc sức khỏe sinh sản và tình dục ở nam giới: rối loạn cương dương, vô sinh nam và các bệnh lý sinh dục.',
    imgURL: '',
    diseases: [
      'Rối loạn cương dương: không đạt hoặc không duy trì được cương cứng',
      'Xuất tinh sớm',
      'Giảm ham muốn tình dục, suy giảm testosterone',
      'Vô sinh nam: tinh trùng ít, tinh trùng yếu, không có tinh trùng',
      'Viêm tinh hoàn, viêm mào tinh hoàn: đau sưng vùng tinh hoàn',
      'Giãn tĩnh mạch thừng tinh: đau tức tinh hoàn, có thể gây vô sinh',
      'Viêm tuyến tiền liệt: đau vùng chậu, tiểu buốt, tiểu rắt',
      'Phì đại tuyến tiền liệt (BPH): tiểu yếu, tiểu không hết, tiểu đêm nhiều',
      'Lây nhiễm qua đường tình dục (STI): sùi mào gà, giang mai, lậu, chlamydia',
      'Ung thư tinh hoàn: tinh hoàn to, cứng, không đau (cần tầm soát sớm)',
      'Dương vật cong (bệnh Peyronie), hẹp bao quy đầu',
    ],
    information: [
      'Xét nghiệm tinh dịch đồ đánh giá số lượng và chất lượng tinh trùng',
      'Xét nghiệm hormone sinh dục nam (testosterone, FSH, LH)',
      'Siêu âm Doppler tinh hoàn, tuyến tiền liệt',
      'Xét nghiệm PSA tầm soát ung thư tuyến tiền liệt',
      'Chẩn đoán và điều trị các bệnh lây truyền qua đường tình dục',
      'Tư vấn điều trị rối loạn cương dương, xuất tinh sớm',
    ],
  },
  {
    name: 'Tâm thần – Sức khỏe tâm thần',
    slug: 'tam-than',
    description:
      'Chẩn đoán và điều trị các rối loạn tâm thần: trầm cảm, lo âu, rối loạn giấc ngủ và các bệnh lý tâm thần nặng. Tư vấn và trị liệu tâm lý.',
    imgURL: '',
    diseases: [
      'Trầm cảm: buồn bã kéo dài, mất hứng thú, kiệt sức, không muốn giao tiếp',
      'Lo âu lan tỏa: lo lắng quá mức về nhiều vấn đề, căng thẳng, khó thư giãn',
      'Rối loạn hoảng loạn (panic attack): tim đập nhanh, khó thở, sợ chết đột ngột',
      'Ám ảnh sợ hãi: sợ nơi đông người, sợ độ cao, sợ một số đối tượng cụ thể',
      'Rối loạn giấc ngủ nặng: mất ngủ kéo dài, thức giấc nhiều lần, ngủ ngày nhiều',
      'Căng thẳng mạn tính (stress) ảnh hưởng sức khỏe thể chất',
      'Rối loạn lưỡng cực: xen kẽ giai đoạn hưng phấn quá mức và trầm cảm',
      'Rối loạn ám ảnh cưỡng chế (OCD): suy nghĩ xâm nhập, hành vi lặp lại không kiểm soát',
      'Rối loạn stress sau sang chấn (PTSD)',
      'Tâm thần phân liệt: ảo giác, hoang tưởng, tư duy rối loạn',
      'Nghiện rượu, nghiện chất gây nghiện',
      'Rối loạn ăn uống: chán ăn tâm thần, ăn uống vô độ',
      'Tự làm hại bản thân, ý tưởng tự tử (cần can thiệp khẩn)',
    ],
    information: [
      'Đánh giá tâm thần toàn diện, thang đo trầm cảm (PHQ-9), lo âu (GAD-7)',
      'Tư vấn tâm lý cá nhân và liệu pháp nhận thức hành vi (CBT)',
      'Kê đơn và theo dõi thuốc hướng thần (chống trầm cảm, chống lo âu, chống loạn thần)',
      'Hỗ trợ điều trị nghiện rượu, cai nghiện chất',
      'Tư vấn cho người nhà chăm sóc bệnh nhân tâm thần',
    ],
  },
  {
    name: 'Ung bướu',
    slug: 'ung-buou',
    description:
      'Tầm soát, chẩn đoán và điều trị các bệnh ung thư. Theo dõi và quản lý điều trị hóa trị, xạ trị và liệu pháp nhắm trúng đích.',
    imgURL: '',
    diseases: [
      'Sụt cân không rõ nguyên nhân, mệt mỏi kéo dài nghi ngờ ung thư',
      'Khối u hoặc hạch nổi bất thường ở cổ, nách, bẹn',
      'Ung thư gan: đau hạ sườn phải, vàng da, mệt mỏi',
      'Ung thư phổi: ho máu, đau ngực, khó thở, khàn tiếng kéo dài',
      'Ung thư dạ dày: đau thượng vị kéo dài, nôn máu, sụt cân',
      'Ung thư đại trực tràng: máu trong phân, thay đổi thói quen đại tiện',
      'Ung thư vú: khối u ở vú, tiết dịch núm vú, da vú thay đổi',
      'Ung thư cổ tử cung: ra máu âm đạo bất thường sau quan hệ',
      'Ung thư tuyến giáp: nhân tuyến giáp, khàn tiếng, khó nuốt',
      'Ung thư tuyến tiền liệt: PSA tăng cao, tiểu khó',
      'Ung thư da: nốt ruồi thay đổi màu sắc, hình dạng, loét không lành',
      'Ung thư máu, u lympho: sốt kéo dài, hạch to, thiếu máu nặng',
      'Theo dõi sau điều trị ung thư',
    ],
    information: [
      'Tầm soát ung thư định kỳ theo nhóm nguy cơ (tuổi, tiền sử gia đình)',
      'Sinh thiết, mô bệnh học chẩn đoán xác định loại ung thư',
      'Chỉ định và theo dõi hóa trị, xạ trị, điều trị nhắm trúng đích, miễn dịch',
      'Chăm sóc giảm nhẹ cho người bệnh ung thư giai đoạn cuối',
      'Tư vấn dinh dưỡng và hỗ trợ tâm lý cho bệnh nhân và gia đình',
    ],
  },
  {
    name: 'Nha khoa',
    slug: 'nha-khoa',
    description:
      'Khám và điều trị toàn diện các bệnh lý răng, nướu và hàm mặt: điều trị tủy, nhổ răng, phục hình và niềng răng.',
    imgURL: '',
    diseases: [
      'Đau răng cấp: đau nhói, đau liên tục, đau khi nhai hoặc uống nóng lạnh',
      'Sâu răng, mẻ răng, vỡ răng',
      'Viêm nướu: nướu đỏ, sưng, chảy máu khi đánh răng',
      'Viêm nha chu (viêm quanh răng): nướu tụt, răng lung lay, hôi miệng',
      'Hôi miệng kéo dài',
      'Răng khôn mọc lệch, sưng đau vùng hàm sau',
      'Mất răng một hoặc nhiều chiếc',
      'Răng ố vàng, mất màu',
      'Nhổ răng sữa ở trẻ, trẻ mọc răng sữa bất thường',
      'Khớp cắn lệch, răng chen chúc, hô, móm (niềng răng)',
      'Tầm soát ung thư khoang miệng: vết loét miệng không lành, mảng trắng',
      'Đau khớp thái dương hàm: tiếng lạo xạo khi há miệng, đau khi nhai',
    ],
    information: [
      'Khám răng định kỳ, lấy cao răng, phòng ngừa bệnh nha chu',
      'Điều trị tủy răng (chữa tủy) khi sâu răng sâu hoặc viêm tủy',
      'Nhổ răng thường và nhổ răng khôn mọc lệch',
      'Phục hình răng: trồng răng implant, làm cầu răng, răng giả tháo lắp',
      'Bọc răng sứ thẩm mỹ, làm trắng răng',
      'Niềng răng chỉnh nha (mắc cài kim loại, mắc cài sứ, niềng trong suốt)',
      'Nha khoa trẻ em: trám răng sữa, trám bít hố rãnh phòng sâu răng',
    ],
  },
  {
    name: 'Truyền nhiễm',
    slug: 'truyen-nhiem',
    description:
      'Chẩn đoán và điều trị các bệnh truyền nhiễm do vi khuẩn, virus, ký sinh trùng và nấm. Quản lý các bệnh lây theo đường hô hấp, tiêu hóa và tình dục.',
    imgURL: '',
    diseases: [
      'Sốt xuất huyết: sốt cao đột ngột, đau đầu, đau cơ, phát ban, xuất huyết dưới da',
      'COVID-19 và các bệnh hô hấp cấp: sốt, ho, khó thở, đau họng',
      'Cúm mùa: sốt cao, đau cơ toàn thân, ho, mệt lả',
      'Lao phổi và lao ngoài phổi',
      'Viêm gan virus A, B, C, E: vàng da, mệt mỏi, chán ăn',
      'HIV/AIDS: quản lý và điều trị ARV',
      'Bệnh lây truyền qua đường tình dục: giang mai, lậu, chlamydia',
      'Sốt rét: sốt theo chu kỳ, rét run, đổ mồ hôi',
      'Thương hàn: sốt kéo dài, đau bụng, tiêu chảy',
      'Tả, lỵ amíp, ngộ độc thực phẩm',
      'Nhiễm trùng da do vi khuẩn: nhọt, viêm mô tế bào',
      'Nhiễm trùng huyết (sepsis): sốt cao hoặc hạ thân nhiệt, mạch nhanh, tụt huyết áp',
      'Tư vấn và tiêm vaccine phòng bệnh truyền nhiễm',
    ],
    information: [
      'Chẩn đoán nhanh sốt xuất huyết, cúm, COVID-19 bằng test kháng nguyên',
      'Xét nghiệm huyết học, cấy máu, cấy dịch chẩn đoán nhiễm trùng',
      'Điều trị và theo dõi HIV/AIDS theo phác đồ ARV quốc gia',
      'Điều trị lao đúng phác đồ và theo dõi kháng thuốc',
      'Tư vấn phòng ngừa bệnh truyền nhiễm và tiêm phòng trước khi đi du lịch',
    ],
  },
]

const hospitals = [
  { name: 'Bệnh viện Chợ Rẫy', slug: 'benh-vien-cho-ray', address: '201B Nguyễn Chí Thanh, Phường 12, Quận 5', city: 'TP. Hồ Chí Minh', type: HospitalType.public, imgURL: '', description: 'Bệnh viện đa khoa tuyến cuối tại khu vực phía Nam.' },
  { name: 'Bệnh viện Bạch Mai', slug: 'benh-vien-bach-mai', address: '78 Giải Phóng, Phương Mai, Đống Đa', city: 'Hà Nội', type: HospitalType.public, imgURL: '', description: 'Bệnh viện đa khoa hạng đặc biệt tại Hà Nội.' },
  { name: 'Bệnh viện Vinmec Central Park', slug: 'benh-vien-vinmec-central-park', address: '208 Nguyễn Hữu Cảnh, Bình Thạnh', city: 'TP. Hồ Chí Minh', type: HospitalType.private, imgURL: '', description: 'Bệnh viện đa khoa quốc tế với nhiều chuyên khoa sâu.' },
  { name: 'Bệnh viện Đại học Y Dược TP.HCM', slug: 'benh-vien-dai-hoc-y-duoc-tphcm', address: '215 Hồng Bàng, Phường 11, Quận 5', city: 'TP. Hồ Chí Minh', type: HospitalType.public, imgURL: '', description: 'Cơ sở khám chữa bệnh kết hợp đào tạo và nghiên cứu.' },
  { name: 'Bệnh viện Trung ương Huế', slug: 'benh-vien-trung-uong-hue', address: '16 Lê Lợi, Vĩnh Ninh', city: 'Huế', type: HospitalType.public, imgURL: '', description: 'Bệnh viện trung ương phục vụ khu vực miền Trung.' },
  { name: 'Bệnh viện Đà Nẵng', slug: 'benh-vien-da-nang', address: '124 Hải Phòng, Thạch Thang', city: 'Đà Nẵng', type: HospitalType.public, imgURL: '', description: 'Bệnh viện đa khoa lớn tại thành phố Đà Nẵng.' },
  { name: 'Phòng khám Quốc tế Victoria', slug: 'phong-kham-quoc-te-victoria', address: '135A Nguyễn Văn Trỗi, Phú Nhuận', city: 'TP. Hồ Chí Minh', type: HospitalType.private, imgURL: '', description: 'Phòng khám tư nhân theo mô hình chăm sóc gia đình.' },
  { name: 'Bệnh viện Nhi Đồng 1', slug: 'benh-vien-nhi-dong-1', address: '341 Sư Vạn Hạnh, Phường 10, Quận 10', city: 'TP. Hồ Chí Minh', type: HospitalType.public, imgURL: '', description: 'Bệnh viện chuyên khoa nhi lâu đời tại TP. Hồ Chí Minh.' },
  { name: 'Bệnh viện Mắt Sài Gòn', slug: 'benh-vien-mat-sai-gon', address: '473 Cách Mạng Tháng 8, Phường 13, Quận 10', city: 'TP. Hồ Chí Minh', type: HospitalType.private, imgURL: '', description: 'Hệ thống bệnh viện chuyên khoa mắt.' },
  { name: 'Bệnh viện Hữu nghị Việt Đức', slug: 'benh-vien-huu-nghi-viet-duc', address: '40 Tràng Thi, Hoàn Kiếm', city: 'Hà Nội', type: HospitalType.public, imgURL: '', description: 'Bệnh viện ngoại khoa và chấn thương chỉnh hình hàng đầu.' },
  { name: 'Bệnh viện Nhân dân 115', slug: 'benh-vien-nhan-dan-115', address: '527 Sư Vạn Hạnh, Phường 12, Quận 10', city: 'TP. Hồ Chí Minh', type: HospitalType.public, imgURL: '', description: 'Bệnh viện đa khoa hạng I, thế mạnh về đột quỵ và tim mạch.' },
  { name: 'Bệnh viện Từ Dũ', slug: 'benh-vien-tu-du', address: '284 Cống Quỳnh, Phường Phạm Ngũ Lão, Quận 1', city: 'TP. Hồ Chí Minh', type: HospitalType.public, imgURL: '', description: 'Bệnh viện chuyên khoa sản phụ khoa lớn nhất khu vực phía Nam.' },
  { name: 'Bệnh viện Ung Bướu TP.HCM', slug: 'benh-vien-ung-buou-tphcm', address: '3 Nơ Trang Long, Phường 7, Bình Thạnh', city: 'TP. Hồ Chí Minh', type: HospitalType.public, imgURL: '', description: 'Bệnh viện chuyên khoa ung bướu hàng đầu tại phía Nam.' },
  { name: 'Bệnh viện Vinmec Times City', slug: 'benh-vien-vinmec-times-city', address: '458 Minh Khai, Hai Bà Trưng', city: 'Hà Nội', type: HospitalType.private, imgURL: '', description: 'Bệnh viện đa khoa quốc tế tiêu chuẩn JCI tại Hà Nội.' },
  { name: 'Bệnh viện Đa khoa tỉnh Bình Dương', slug: 'benh-vien-da-khoa-binh-duong', address: '12 Lê Hồng Phong, Phú Cường', city: 'Bình Dương', type: HospitalType.public, imgURL: '', description: 'Bệnh viện đa khoa hạng I tại tỉnh Bình Dương.' },
  { name: 'Bệnh viện Đa khoa Đồng Nai', slug: 'benh-vien-da-khoa-dong-nai', address: '1 Phan Chu Trinh, Quyết Thắng, Biên Hòa', city: 'Đồng Nai', type: HospitalType.public, imgURL: '', description: 'Bệnh viện đa khoa lớn nhất tỉnh Đồng Nai.' },
  { name: 'Bệnh viện Đa khoa Cần Thơ', slug: 'benh-vien-da-khoa-can-tho', address: '4 Châu Văn Liêm, An Hòa, Ninh Kiều', city: 'Cần Thơ', type: HospitalType.public, imgURL: '', description: 'Bệnh viện tuyến cuối khu vực đồng bằng sông Cửu Long.' },
  { name: 'Bệnh viện Medlatec', slug: 'benh-vien-medlatec', address: '42-44 Nghĩa Dũng, Phúc Xá, Ba Đình', city: 'Hà Nội', type: HospitalType.private, imgURL: '', description: 'Hệ thống phòng khám và xét nghiệm chất lượng cao tại Hà Nội.' },
];

const doctorSeeds = [
  ['bs.nguyen.thi.lan@tktbookingcare.vn', 'Lan', 'Nguyễn Thị', 'bs-nguyen-thi-lan', 'BS-HCM-001', 15, 350000],
  ['bs.le.van.hung@tktbookingcare.vn', 'Hùng', 'Lê Văn', 'bs-le-van-hung', 'BS-HN-002', 10, 280000],
  ['bs.tran.thuy.linh@tktbookingcare.vn', 'Linh', 'Trần Thúy', 'bs-tran-thuy-linh', 'BS-HCM-003', 8, 300000],
  ['bs.pham.minh.quan@tktbookingcare.vn', 'Quân', 'Phạm Minh', 'bs-pham-minh-quan', 'BS-DN-004', 12, 320000],
  ['bs.vo.thanh.tam@tktbookingcare.vn', 'Tâm', 'Võ Thanh', 'bs-vo-thanh-tam', 'BS-HUE-005', 18, 420000],
  ['bs.dang.hoai.an@tktbookingcare.vn', 'An', 'Đặng Hoài', 'bs-dang-hoai-an', 'BS-HCM-006', 9, 310000],
  ['bs.bui.khanh.ngoc@tktbookingcare.vn', 'Ngọc', 'Bùi Khánh', 'bs-bui-khanh-ngoc', 'BS-HN-007', 14, 390000],
  ['bs.hoang.gia.bao@tktbookingcare.vn', 'Bảo', 'Hoàng Gia', 'bs-hoang-gia-bao', 'BS-HCM-008', 7, 260000],
  ['bs.do.thu.ha@tktbookingcare.vn', 'Hà', 'Đỗ Thu', 'bs-do-thu-ha', 'BS-HCM-009', 11, 340000],
  ['bs.ngo.quoc.viet@tktbookingcare.vn', 'Việt', 'Ngô Quốc', 'bs-ngo-quoc-viet', 'BS-HN-010', 16, 450000],
  ['bs.nguyen.van.duc@tktbookingcare.vn', 'Đức', 'Nguyễn Văn', 'bs-nguyen-van-duc', 'BS-HCM-011', 13, 370000],
  ['bs.phan.thi.mai@tktbookingcare.vn', 'Mai', 'Phan Thị', 'bs-phan-thi-mai', 'BS-HN-012', 20, 480000],
  ['bs.le.quang-khai@tktbookingcare.vn', 'Khải', 'Lê Quang', 'bs-le-quang-khai', 'BS-DN-013', 11, 330000],
  ['bs.tran.ngoc.tuyen@tktbookingcare.vn', 'Tuyền', 'Trần Ngọc', 'bs-tran-ngoc-tuyen', 'BS-HCM-014', 6, 250000],
  ['bs.vo.minh.khoa@tktbookingcare.vn', 'Khoa', 'Võ Minh', 'bs-vo-minh-khoa', 'BS-CT-015', 17, 430000],
  ['bs.dinh.thanh.huong@tktbookingcare.vn', 'Hương', 'Đinh Thanh', 'bs-dinh-thanh-huong', 'BS-HCM-016', 9, 295000],
  ['bs.ly.hoang-nam@tktbookingcare.vn', 'Nam', 'Lý Hoàng', 'bs-ly-hoang-nam', 'BS-BD-017', 14, 360000],
  ['bs.truong.bich.van@tktbookingcare.vn', 'Vân', 'Trương Bích', 'bs-truong-bich-van', 'BS-HN-018', 8, 275000],
] as const;

// ─── Identifiers để clear ────────────────────────────────────────────────────

const adminEmail = 'admin@tktbookingcare.vn';
const doctorEmails = doctorSeeds.map(([email]) => email);
const doctorSlugs = doctorSeeds.map(([, , , slug]) => slug);
const licenseNumbers = doctorSeeds.map(([, , , , licenseNumber]) => licenseNumber);
const specialtySlugs = specialties.map((s) => s.slug);
const primarySpecialties = specialties.filter((s) => s.slug !== 'da-khoa');
const hospitalSlugs = hospitals.map((h) => h.slug);

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function hash(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// ─── Clear ───────────────────────────────────────────────────────────────────

async function clearData() {
  const allEmails = [adminEmail, ...doctorEmails];

  const users = await prisma.user.findMany({
    where: { email: { in: allEmails } },
    select: { id: true },
  });
  const userIds = users.map((u) => u.id);

  const doctors = await prisma.doctor.findMany({
    where: {
      OR: [
        { userId: { in: userIds } },
        { slug: { in: [...doctorSlugs] } },
        { licenseNumber: { in: [...licenseNumbers] } },
      ],
    },
    select: { id: true },
  });
  const doctorIds = doctors.map((d) => d.id);

  const hospitalRecords = await prisma.hospital.findMany({
    where: { slug: { in: [...hospitalSlugs] } },
    select: { id: true },
  });
  const hospitalIds = hospitalRecords.map((h) => h.id);

  const specialtyRecords = await prisma.specialty.findMany({
    where: { slug: { in: [...specialtySlugs] } },
    select: { id: true },
  });
  const specialtyIds = specialtyRecords.map((s) => s.id);

  // Xóa theo thứ tự quan hệ
  await prisma.doctorHospital.deleteMany({
    where: { OR: [{ doctorId: { in: doctorIds } }, { hospitalId: { in: hospitalIds } }] },
  });
  await prisma.doctorSpecialty.deleteMany({
    where: { OR: [{ doctorId: { in: doctorIds } }, { specialtyId: { in: specialtyIds } }] },
  });
  await prisma.refreshToken.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.doctor.deleteMany({ where: { id: { in: doctorIds } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.hospital.deleteMany({ where: { id: { in: hospitalIds } } });
  await prisma.specialty.deleteMany({ where: { id: { in: specialtyIds } } });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Bắt đầu seed tối giản...');

  await clearData();
  console.log('Đã xóa dữ liệu cũ.');

  const [adminHash, doctorHash] = await Promise.all([hash(ADMIN_PASSWORD), hash(DOCTOR_PASSWORD)]);

  // Specialties
  await prisma.specialty.createMany({
    data: specialties.map((s) => ({ ...s, isActive: true })),
  });
  const createdSpecialties = await prisma.specialty.findMany({
    where: { slug: { in: [...specialtySlugs] } },
  });
  const specialtyBySlug = new Map(createdSpecialties.map((s) => [s.slug, s]));

  // Hospitals
  await prisma.hospital.createMany({
    data: hospitals.map((h) => ({ ...h, isActive: true })),
  });
  const createdHospitals = await prisma.hospital.findMany({
    where: { slug: { in: [...hospitalSlugs] } },
  });
  const hospitalBySlug = new Map(createdHospitals.map((h) => [h.slug, h]));

  // Admin
  await prisma.user.create({
    data: {
      email: adminEmail,
      password: adminHash,
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.admin,
      provider: AuthProvider.local,
      isActive: true,
      isEmailVerified: true,
    },
  });

  // Doctors
  const doctors: Doctor[] = [];
  for (let i = 0; i < doctorSeeds.length; i++) {
    const [email, firstName, lastName, slug, licenseNumber, experience, consultationFee] = doctorSeeds[i];
    const specialty = primarySpecialties[i % primarySpecialties.length];

    const user = await prisma.user.create({
      data: {
        email,
        password: doctorHash,
        firstName,
        lastName,
        role: UserRole.doctor,
        provider: AuthProvider.local,
        isActive: true,
        isEmailVerified: true,
      },
    });

    doctors.push(
      await prisma.doctor.create({
        data: {
          userId: user.id,
          slug,
          imgURL: '',
          information: [
            `${lastName} ${firstName} có ${experience} năm kinh nghiệm trong lĩnh vực ${specialty.name}.`,
            'Tư vấn rõ ràng, ưu tiên phác đồ điều trị phù hợp với từng bệnh nhân.',
          ],
          treatment: specialty.diseases,
          experience,
          licenseNumber,
          consultationFee,
          rating: 0,
          totalReviews: 0,
          isVerified: true,
          isActive: true,
        },
      }),
    );
  }

  // DoctorSpecialty + DoctorHospital
  for (let i = 0; i < doctors.length; i++) {
    const primarySpecialty = primarySpecialties[i % primarySpecialties.length];
    const specialty = primarySpecialty
      ? specialtyBySlug.get(primarySpecialty.slug)
      : undefined;
    const hospital = hospitalBySlug.get(hospitalSlugs[i]);

    if (!specialty || !hospital) {
      throw new Error(`Không tìm thấy specialty/hospital tại index ${i}`);
    }

    await prisma.doctorSpecialty.create({
      data: { doctorId: doctors[i].id, specialtyId: specialty.id, isPrimary: true },
    });

    await prisma.doctorHospital.create({
      data: {
        doctorId: doctors[i].id,
        hospitalId: hospital.id,
        workingDays: i % 2 === 0 ? 'MON,WED,FRI' : 'TUE,THU,SAT',
        startTime: i % 3 === 0 ? '07:30' : '08:00',
        endTime: i % 3 === 0 ? '16:30' : '17:00',
        isActive: true,
      },
    });
  }

  const generalSpecialty = specialtyBySlug.get('da-khoa');
  if (generalSpecialty && doctors[0]) {
    await prisma.doctorSpecialty.create({
      data: {
        doctorId: doctors[0].id,
        specialtyId: generalSpecialty.id,
        isPrimary: false,
      },
    });
  }

  // Summary
  const [uCount, spCount, hCount, dCount] = await Promise.all([
    prisma.user.count({ where: { email: { in: [adminEmail, ...doctorEmails] } } }),
    prisma.specialty.count({ where: { slug: { in: [...specialtySlugs] } } }),
    prisma.hospital.count({ where: { slug: { in: [...hospitalSlugs] } } }),
    prisma.doctor.count({ where: { slug: { in: [...doctorSlugs] } } }),
  ]);

  console.log('\nSeed tối giản hoàn tất.');
  console.table({ User: uCount, Specialty: spCount, Hospital: hCount, Doctor: dCount });

  console.log('\nTài khoản demo:');
  console.log(`Admin  : ${adminEmail} / ${ADMIN_PASSWORD}`);
  console.log(`Doctor : ${doctorSeeds[0][0]} / ${DOCTOR_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error('Seed thất bại:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
