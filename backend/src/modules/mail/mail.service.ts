import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

type MailPurpose = 'email_verification' | 'password_reset';

interface AccountEmailPayload {
  to: string;
  name?: string;
  link: string;
  expiresIn: string;
}

interface AppointmentConfirmedPayload {
  to: string;
  patientName: string;
  doctorName: string;
  hospitalName: string;
  hospitalAddress?: string;
  appointmentDate: Date;
  startTime: string;
  endTime: string;
  totalAmount: number;
  paymentStatus: string;
  appointmentLink?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend | null;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = apiKey ? new Resend(apiKey) : null;
  }

  async sendEmailVerification(payload: AccountEmailPayload): Promise<void> {
    await this.sendAccountEmail('email_verification', payload);
  }

  async sendPasswordReset(payload: AccountEmailPayload): Promise<void> {
    await this.sendAccountEmail('password_reset', payload);
  }

  async sendAppointmentConfirmed(
    payload: AppointmentConfirmedPayload,
  ): Promise<void> {
    const from = this.configService.get<string>('MAIL_FROM');
    const appName = this.configService.get<string>('MAIL_APP_NAME', 'BookingCare');
    const subject = `Lịch hẹn của bạn đã được xác nhận - ${appName}`;

    if (!this.resend || !from) {
      this.handleMissingConfigForSubject(subject);
      return;
    }

    try {
      await this.resend.emails.send({
        from,
        to: payload.to,
        subject,
        html: this.renderAppointmentConfirmedEmail(payload, appName),
        text: this.renderAppointmentConfirmedText(payload, appName),
      });
    } catch (error) {
      this.logger.error(
        `Không thể gửi email xác nhận lịch hẹn tới ${payload.to}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new ServiceUnavailableException(
        'Không thể gửi email lúc này. Vui lòng thử lại sau.',
      );
    }
  }

  private async sendAccountEmail(
    purpose: MailPurpose,
    payload: AccountEmailPayload,
  ): Promise<void> {
    const from = this.configService.get<string>('MAIL_FROM');
    const appName = this.configService.get<string>('MAIL_APP_NAME', 'BookingCare');
    const subject =
      purpose === 'email_verification'
        ? `Xác thực email ${appName}`
        : `Đặt lại mật khẩu ${appName}`;

    if (!this.resend || !from) {
      this.handleMissingConfig(payload, subject);
      return;
    }

    const html = this.renderAccountEmail(purpose, payload, appName);
    const text = this.renderAccountEmailText(purpose, payload, appName);

    try {
      await this.resend.emails.send({
        from,
        to: payload.to,
        subject,
        html,
        text,
      });
    } catch (error) {
      this.logger.error(
        `Không thể gửi email ${purpose} tới ${payload.to}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new ServiceUnavailableException(
        'Không thể gửi email lúc này. Vui lòng thử lại sau.',
      );
    }
  }

  private handleMissingConfig(payload: AccountEmailPayload, subject: string) {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    if (isProduction) {
      throw new ServiceUnavailableException(
        'Dịch vụ email chưa được cấu hình.',
      );
    }

    this.logger.warn(
      `Bỏ qua gửi email "${subject}" vì thiếu RESEND_API_KEY hoặc MAIL_FROM. Link dev: ${payload.link}`,
    );
  }

  private handleMissingConfigForSubject(subject: string) {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    if (isProduction) {
      throw new ServiceUnavailableException(
        'Dịch vụ email chưa được cấu hình.',
      );
    }

    this.logger.warn(
      `Bỏ qua gửi email "${subject}" vì thiếu RESEND_API_KEY hoặc MAIL_FROM.`,
    );
  }

  private renderAccountEmail(
    purpose: MailPurpose,
    payload: AccountEmailPayload,
    appName: string,
  ) {
    const title =
      purpose === 'email_verification'
        ? 'Xác thực email của bạn'
        : 'Đặt lại mật khẩu';
    const intro =
      purpose === 'email_verification'
        ? 'Bạn vừa yêu cầu xác thực email cho tài khoản.'
        : 'Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản.';
    const action =
      purpose === 'email_verification' ? 'Xác thực email' : 'Đặt lại mật khẩu';
    const safeName = payload.name ? ` ${this.escapeHtml(payload.name)}` : '';
    const safeLink = this.escapeHtml(payload.link);

    return `
      <div style="font-family:Arial,sans-serif;background:#f6f8fb;padding:24px;color:#1f2937">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:28px">
          <p style="margin:0 0 12px;font-size:14px;color:#64748b">${this.escapeHtml(appName)}</p>
          <h1 style="margin:0 0 16px;font-size:24px;color:#111827">${title}</h1>
          <p style="margin:0 0 14px;font-size:16px;line-height:1.6">Xin chào${safeName},</p>
          <p style="margin:0 0 22px;font-size:16px;line-height:1.6">${intro}</p>
          <a href="${safeLink}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:6px;padding:12px 18px;font-weight:700">${action}</a>
          <p style="margin:22px 0 0;font-size:14px;line-height:1.6;color:#64748b">Link này hết hạn sau ${payload.expiresIn}. Nếu bạn không yêu cầu thao tác này, hãy bỏ qua email.</p>
          <p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#64748b;word-break:break-all">Nếu nút không hoạt động, mở link này: ${safeLink}</p>
        </div>
      </div>
    `;
  }

  private renderAccountEmailText(
    purpose: MailPurpose,
    payload: AccountEmailPayload,
    appName: string,
  ) {
    const action =
      purpose === 'email_verification' ? 'xác thực email' : 'đặt lại mật khẩu';
    const greeting = payload.name ? `Xin chào ${payload.name},` : 'Xin chào,';

    return `${appName}\n\n${greeting}\n\nBạn vừa yêu cầu ${action} cho tài khoản.\nLink: ${payload.link}\n\nLink này hết hạn sau ${payload.expiresIn}. Nếu bạn không yêu cầu thao tác này, hãy bỏ qua email.`;
  }

  private renderAppointmentConfirmedEmail(
    payload: AppointmentConfirmedPayload,
    appName: string,
  ) {
    const safePatientName = this.escapeHtml(payload.patientName);
    const safeDoctorName = this.escapeHtml(payload.doctorName);
    const safeHospitalName = this.escapeHtml(payload.hospitalName);
    const safeHospitalAddress = payload.hospitalAddress
      ? this.escapeHtml(payload.hospitalAddress)
      : '';
    const safeDate = this.escapeHtml(this.formatDate(payload.appointmentDate));
    const safeTime = this.escapeHtml(`${payload.startTime} - ${payload.endTime}`);
    const safeAmount = this.escapeHtml(this.formatCurrency(payload.totalAmount));
    const safePaymentStatus = this.escapeHtml(
      this.formatPaymentStatus(payload.paymentStatus),
    );
    const safeLink = payload.appointmentLink
      ? this.escapeHtml(payload.appointmentLink)
      : '';

    return `
      <div style="font-family:Arial,sans-serif;background:#f6f8fb;padding:24px;color:#1f2937">
        <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:28px">
          <p style="margin:0 0 12px;font-size:14px;color:#64748b">${this.escapeHtml(appName)}</p>
          <h1 style="margin:0 0 16px;font-size:24px;color:#111827">Lịch hẹn đã được xác nhận</h1>
          <p style="margin:0 0 18px;font-size:16px;line-height:1.6">Xin chào ${safePatientName}, lịch hẹn khám của bạn đã được xác nhận.</p>
          <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.6">
            <tbody>
              <tr><td style="padding:8px 0;color:#64748b">Bác sĩ</td><td style="padding:8px 0;font-weight:700">${safeDoctorName}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b">Bệnh viện</td><td style="padding:8px 0;font-weight:700">${safeHospitalName}</td></tr>
              ${safeHospitalAddress ? `<tr><td style="padding:8px 0;color:#64748b">Địa chỉ</td><td style="padding:8px 0">${safeHospitalAddress}</td></tr>` : ''}
              <tr><td style="padding:8px 0;color:#64748b">Ngày khám</td><td style="padding:8px 0">${safeDate}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b">Giờ khám</td><td style="padding:8px 0">${safeTime}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b">Chi phí</td><td style="padding:8px 0">${safeAmount}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b">Thanh toán</td><td style="padding:8px 0">${safePaymentStatus}</td></tr>
            </tbody>
          </table>
          ${safeLink ? `<a href="${safeLink}" style="display:inline-block;margin-top:22px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:6px;padding:12px 18px;font-weight:700">Xem lịch hẹn</a>` : ''}
          <p style="margin:22px 0 0;font-size:14px;line-height:1.6;color:#64748b">Vui lòng đến trước giờ hẹn khoảng 10-15 phút để hoàn tất thủ tục.</p>
        </div>
      </div>
    `;
  }

  private renderAppointmentConfirmedText(
    payload: AppointmentConfirmedPayload,
    appName: string,
  ) {
    return `${appName}\n\nXin chào ${payload.patientName}, lịch hẹn khám của bạn đã được xác nhận.\n\nBác sĩ: ${payload.doctorName}\nBệnh viện: ${payload.hospitalName}\n${payload.hospitalAddress ? `Địa chỉ: ${payload.hospitalAddress}\n` : ''}Ngày khám: ${this.formatDate(payload.appointmentDate)}\nGiờ khám: ${payload.startTime} - ${payload.endTime}\nChi phí: ${this.formatCurrency(payload.totalAmount)}\nThanh toán: ${this.formatPaymentStatus(payload.paymentStatus)}${payload.appointmentLink ? `\nLink: ${payload.appointmentLink}` : ''}\n\nVui lòng đến trước giờ hẹn khoảng 10-15 phút để hoàn tất thủ tục.`;
  }

  private formatDate(value: Date) {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Asia/Ho_Chi_Minh',
    }).format(value);
  }

  private formatCurrency(value: number) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  }

  private formatPaymentStatus(value: string) {
    const statusMap: Record<string, string> = {
      pending: 'Chờ thanh toán',
      completed: 'Đã thanh toán',
      failed: 'Thanh toán thất bại',
      refunded: 'Đã hoàn tiền',
    };

    return statusMap[value] ?? value;
  }

  private escapeHtml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
