import axiosInstance from "./axiosInstance";

// ==========================================
// 1. Module User Profile
// ==========================================
export const patientProfileService = {
  getProfiles: () => axiosInstance.get("/users/me/patient-profiles"),
  getProfileDetail: (id) => axiosInstance.get(`/users/me/patient-profiles/${id}`),
  createProfile: (data) => axiosInstance.post("/users/me/patient-profiles", data),
  updateProfile: (id, data) => axiosInstance.patch(`/users/me/patient-profiles/${id}`, data),
  setDefaultProfile: (id) => axiosInstance.patch(`/users/me/patient-profiles/${id}/default`),
  deleteProfile: (id) => axiosInstance.delete(`/users/me/patient-profiles/${id}`),
};

// ==========================================
// 2. Module Doctor
// ==========================================
export const doctorService = {
  doctors: (params = {}) => axiosInstance.get("/doctors", { params }),
  doctorDetail: (slug) => axiosInstance.get(`/doctors/${slug}`),
  getMeProfile: () => axiosInstance.get("/doctors/me/profile"),
  updateMeProfile: (data) => axiosInstance.patch("/doctors/me/profile", data),
  adminGetDoctors: (params = {}) => axiosInstance.get("/admin/doctors", { params }),
  adminGetDoctorDetail: (id) => axiosInstance.get(`/admin/doctors/${id}`),
  adminCreateDoctor: (data) => axiosInstance.post("/admin/doctors", data),
  adminUpdateDoctor: (id, data) => axiosInstance.patch(`/admin/doctors/${id}`, data),
  adminDeleteDoctor: (id) => axiosInstance.delete(`/admin/doctors/${id}`),
};

// ==========================================
// 3. Module Hospital
// ==========================================
export const hospitalService = {
  hospitals: (params = {}) => axiosInstance.get("/hospitals", { params }),
  getCities: () => axiosInstance.get("/hospitals/cities"),
  hospitalDetail: (slug) => axiosInstance.get(`/hospitals/${slug}`),
  adminGetHospitals: (params = {}) => axiosInstance.get("/admin/hospitals", { params }),
  adminCreateHospital: (data) => axiosInstance.post("/admin/hospitals", data),
  adminUpdateHospital: (id, data) => axiosInstance.patch(`/admin/hospitals/${id}`, data),
  adminDeleteHospital: (id) => axiosInstance.delete(`/admin/hospitals/${id}`),
};

// ==========================================
// 4. Module Specialty
// ==========================================
export const specialtyService = {
  specialties: (params = {}) => axiosInstance.get("/specialties", { params }),
  specialtyDetail: (slug) => axiosInstance.get(`/specialties/${slug}`),
  adminGetSpecialties: (params = {}) => axiosInstance.get("/admin/specialties", { params }),
  adminCreateSpecialty: (data) => axiosInstance.post("/admin/specialties", data),
  adminUpdateSpecialty: (id, data) => axiosInstance.patch(`/admin/specialties/${id}`, data),
  adminDeleteSpecialty: (id) => axiosInstance.delete(`/admin/specialties/${id}`),
};

// ==========================================
// 5. Module TimeSlot
// ==========================================
export const timeSlotService = {
  getTimeSlots: (params = {}) => axiosInstance.get("/timeslots", { params }),
  getDoctorSchedule: () => axiosInstance.get("/doctors/me/schedule"),
  getDoctorTimeSlots: (params = {}) => axiosInstance.get("/doctors/me/timeslots", { params }),
  doctorBlockTimeSlot: (id, data = {}) => axiosInstance.patch(`/doctors/me/timeslots/${id}/block`, data),
  adminGetTimeSlots: (params = {}) => axiosInstance.get("/admin/timeslots", { params }),
  adminGenerateTimeSlots: (data) => axiosInstance.post("/admin/timeslots/generate", data),
  adminBlockTimeSlot: (id, data = {}) => axiosInstance.patch(`/admin/timeslots/${id}/block`, data),
  adminDeleteTimeSlot: (id) => axiosInstance.delete(`/admin/timeslots/${id}`),
  adminBulkDeleteTimeSlots: (params = {}) => axiosInstance.delete("/admin/timeslots/bulk", { params }),
};

// ==========================================
// 6. Module Appointment
// ==========================================
export const appointmentService = {
  createAppointment: (data) => axiosInstance.post("/appointments", data),
  cancelAppointment: (id, data = {}) => axiosInstance.post(`/appointments/${id}/cancel`, data),
  getMyAppointments: (params = {}) => axiosInstance.get("/users/me/appointments", { params }),
  getMyAppointmentDetail: (id) => axiosInstance.get(`/users/me/appointments/${id}`),
  getDoctorAppointments: (params = {}) => axiosInstance.get("/doctors/me/appointments", { params }),
  doctorUpdateAppointmentStatus: (id, data) => axiosInstance.patch(`/appointments/${id}/status`, data),
  adminGetAppointments: (params = {}) => axiosInstance.get("/admin/appointments", { params }),
  adminGetAppointmentDetail: (id) => axiosInstance.get(`/admin/appointments/${id}`),
  adminUpdateAppointmentStatus: (id, data) => axiosInstance.patch(`/admin/appointments/${id}/status`, data),
  adminCancelAppointment: (id, data = {}) => axiosInstance.patch(`/admin/appointments/${id}/cancel`, data),
};

// ==========================================
// 7. Module Review
// ==========================================
export const reviewService = {
  getReviews: (params = {}) => axiosInstance.get("/reviews", { params }),
  createReview: (data) => axiosInstance.post("/reviews", data),
  getMyReviews: (params = {}) => axiosInstance.get("/users/me/reviews", { params }),
  adminGetReviews: (params = {}) => axiosInstance.get("/admin/reviews", { params }),
  adminGetReviewDetail: (id) => axiosInstance.get(`/admin/reviews/${id}`),
  adminUpdateReviewVisibility: (id, data) => axiosInstance.patch(`/admin/reviews/${id}/visibility`, data),
};

// ==========================================
// 8. Module Search
// ==========================================
export const searchService = {
  search: (params = {}) => axiosInstance.get("/search", { params }),
};

// ==========================================
// 9. Module Payment
// ==========================================
export const paymentService = {
  createPaymentUrl: (data) => axiosInstance.post("/payment/create-url", data),
  vnPayIpn: (params = {}) => axiosInstance.get("/payment/vnpay-ipn", { params }),
  confirmCashPayment: (id) => axiosInstance.patch(`/payment/confirm-cash/${id}`),
};

// ==========================================
// 10. Các API Quản Trị Hệ Thống
// ==========================================
export const adminSystemService = {
  getStats: () => axiosInstance.get("/admin/stats"),
  getReports: (params = {}) => axiosInstance.get("/admin/reports", { params }),
  getUsers: (params = {}) => axiosInstance.get("/admin/users", { params }),
  updateUserRole: (id, data) => axiosInstance.patch(`/admin/users/${id}/role`, data),
  banUser: (id, data) => axiosInstance.patch(`/admin/users/${id}/ban`, data),
};