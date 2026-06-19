import { Link } from "react-router-dom";
import {
  BsArrowRight,
  BsCalendar2Check,
  BsCheckCircleFill,
  BsClipboard2Pulse,
  BsShieldCheck,
} from "react-icons/bs";
import {
  FaHeartPulse,
  FaHospital,
  FaStethoscope,
  FaUserDoctor,
} from "react-icons/fa6";
import "./AboutPage.scss";

const member = [
  {
    name: "Nguyễn Đức Thuận",
    id: "N23DCCN196",
    role: "Leader, Backend Developer",
    img: "https://res.cloudinary.com/dnnweuaz9/image/upload/q_auto/f_auto/v1781819033/mssi_a8wgpc.jpg",
  },
  {
    name: "Phạm Khánh Duy",
    id: "N23DCCN152",
    role: "Frontend Developer",
    img: "https://res.cloudinary.com/dnnweuaz9/image/upload/q_auto/f_auto/v1781819033/Ronaldo-10_qf6zcd.jpg",
  },
  {
    name: "Phạm Minh Tuấn",
    id: "N23DCCN202",
    role: "Frontend Developer",
    img: "https://res.cloudinary.com/dnnweuaz9/image/upload/q_auto/f_auto/v1781819033/Neymarrr-1715-1626688010_rehgv4.webp",
  },
];

const AboutPage = () => {
  return (
    <div className="about-page">
      <section className="about-hero" aria-labelledby="about-hero-title">
        <div className="about-hero__glow about-hero__glow--one" />
        <div className="about-hero__glow about-hero__glow--two" />

        <div className="about-container about-hero__inner">
          <div className="about-hero__content">
            <div className="about-kicker">
              <FaHeartPulse aria-hidden="true" />
              <span>Đề tài công nghệ y tế</span>
            </div>

            <h1 id="about-hero-title">
              Kết nối chăm sóc sức khỏe,
              <span> bắt đầu từ một lịch hẹn</span>
            </h1>

            <p>
              TKT BookingCare là đề tài xây dựng nền tảng đặt lịch khám bệnh
              trực tuyến, giúp người dùng chủ động tìm kiếm bác sĩ, cơ sở y tế
              và khung giờ phù hợp trên một hệ thống thống nhất.
            </p>

            <div className="about-hero__actions">
              <Link
                className="about-button about-button--primary"
                to="/doctors"
              >
                Khám phá bác sĩ
                <BsArrowRight aria-hidden="true" />
              </Link>
              <Link
                className="about-button about-button--secondary"
                to="/specialties"
              >
                Xem chuyên khoa
              </Link>
            </div>

            <div className="about-hero__trust">
              <span>
                <BsCheckCircleFill /> Thao tác đơn giản
              </span>
              <span>
                <BsCheckCircleFill /> Thông tin tập trung
              </span>
              <span>
                <BsCheckCircleFill /> Hỗ trợ đa thiết bị
              </span>
            </div>
          </div>

          <div
            className="about-hero__visual"
            aria-label="Mô phỏng quy trình đặt lịch khám"
          >
            <div className="about-visual__orbit about-visual__orbit--one" />
            <div className="about-visual__orbit about-visual__orbit--two" />

            <div className="about-appointment-card">
              <div className="about-appointment-card__top">
                <span className="about-appointment-card__icon">
                  <FaUserDoctor />
                </span>
                <div>
                  <small>Lịch khám sắp tới</small>
                  <strong>Bác sĩ chuyên khoa</strong>
                </div>
                <span className="about-status-dot" />
              </div>

              <div className="about-appointment-card__date">
                <BsCalendar2Check />
                <div>
                  <small>Thời gian đã chọn</small>
                  <strong>08:30 · Thứ Hai, 22/06</strong>
                </div>
              </div>

              <div className="about-appointment-card__place">
                <FaHospital />
                <span>Cơ sở y tế phù hợp với nhu cầu của bạn</span>
              </div>

              <div className="about-appointment-card__confirm">
                <BsCheckCircleFill />
                Lịch hẹn đã được xác nhận
              </div>
            </div>

            <div className="about-float-card about-float-card--doctor">
              <FaStethoscope />
              <div>
                <strong>Dễ dàng lựa chọn</strong>
                <span>Bác sĩ & chuyên khoa</span>
              </div>
            </div>
            <div className="about-float-card about-float-card--secure">
              <BsShieldCheck />
              <div>
                <strong>An tâm sử dụng</strong>
                <span>Thông tin được bảo vệ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="about-story about-section"
        aria-labelledby="about-story-title"
      >
        <div className="about-container about-story__grid">
          <div className="about-story__intro">
            <div className="about-section-tag">Câu chuyện đề tài</div>
            <h2 id="about-story-title">
              Để việc đi khám không còn bắt đầu bằng sự chờ đợi
            </h2>
            <p>
              Việc tìm đúng bác sĩ, đúng chuyên khoa và sắp xếp thời gian khám
              vẫn là một hành trình tốn nhiều công sức. Đề tài được xây dựng với
              mong muốn số hóa hành trình đó thành một trải nghiệm rõ ràng và
              thuận tiện hơn.
            </p>
            <div className="about-story__quote">
              <FaHeartPulse aria-hidden="true" />
              <p>
                “Công nghệ tốt nhất là công nghệ giúp con người tiếp cận dịch vụ
                y tế dễ dàng hơn.”
              </p>
            </div>
          </div>

          <div className="about-story__comparison">
            <article className="about-story-card about-story-card--problem">
              <span className="about-story-card__number">01</span>
              <div className="about-story-card__icon">
                <BsClipboard2Pulse />
              </div>
              <h3>Vấn đề đặt ra</h3>
              <p>
                Thông tin phân tán, khó so sánh lựa chọn và mất thời gian liên
                hệ đặt lịch thủ công.
              </p>
            </article>
            <article className="about-story-card about-story-card--solution">
              <span className="about-story-card__number">02</span>
              <div className="about-story-card__icon">
                <FaStethoscope />
              </div>
              <h3>Giải pháp hướng tới</h3>
              <p>
                Một nền tảng thống nhất để tìm kiếm, đặt khám, thanh toán và
                quản lý lịch hẹn trực tuyến.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        className="about-team about-section"
        aria-labelledby="about-team-title"
      >
        <div className="about-container">
          <div className="about-section-heading">
            <div className="about-section-tag">Đội ngũ thực hiện</div>
            <h2 id="about-team-title">Những thành viên đứng sau dự án</h2>
            <p>
              Mỗi thành viên đóng góp một góc nhìn và thế mạnh riêng để cùng
              hoàn thiện sản phẩm.
            </p>
          </div>

          <div className="about-team__grid">
            {member.map((item, index) => (
              <article className="about-member-card" key={item.id}>
                <div className="about-member-card__photo">
                  <img src={item.img} alt={`Ảnh thành viên ${item.name}`} />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="about-member-card__body">
                  <div className="about-member-card__meta">
                    <span>{item.id}</span>
                    <span>{item.role}</span>
                  </div>
                  <h3 className="text-center">{item.name}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="about-journey about-section"
        aria-labelledby="about-journey-title"
      >
        <div className="about-container">
          <div className="about-section-heading">
            <div className="about-section-tag">Hành trình phát triển</div>
            <h2 id="about-journey-title">
              Từ ý tưởng đến một sản phẩm hoàn chỉnh
            </h2>
          </div>

          <div className="about-journey__timeline">
            {[
              ["01/2026", "Khởi tạo", "Xác định bài toán và phạm vi đề tài"],
              [
                "02/2026",
                "Phân tích",
                "Thiết kế nghiệp vụ và kiến trúc hệ thống",
              ],
              ["03/2026", "Phát triển", "Xây dựng các chức năng cốt lõi"],
              [
                "04/2026",
                "Hoàn thiện",
                "Tối ưu giao diện và kiểm thử sản phẩm",
              ],
              ["05/2026", "Ra mắt", "Hoàn thành và triển khai dự án"],
            ].map(([date, title], index) => (
              <article className="about-journey__item" key={date}>
                <div className="about-journey__marker">
                  <span>{index + 1}</span>
                </div>
                <time>{date}</time>
                <h3>{title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
