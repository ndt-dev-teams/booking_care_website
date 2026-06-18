import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { MailModule } from '@modules/mail/mail.module';
import {
  AppointmentUserController,
  AppointmentUserMeController,
  AppointmentDoctorMeController,
  AppointmentDoctorStatusController,
  AppointmentAdminController,
} from './appointment.controller';

@Module({
  imports: [MailModule],
  controllers: [
    AppointmentUserController, // POST /appointments, POST /appointments/:id/cancel
    AppointmentUserMeController, // GET /users/me/appointments, GET /users/me/appointments/:id
    AppointmentDoctorMeController, // GET /doctors/me/appointments
    AppointmentDoctorStatusController, // PATCH /appointments/:id/status  (Doctor)
    AppointmentAdminController, // GET|PATCH /admin/appointments
  ],
  providers: [AppointmentService],
  exports: [AppointmentService], // Export để Review/MedicalRecord module dùng
})
export class AppointmentModule {}
