import { ApiClient } from "@/services/api-client";

export const apiClient = new ApiClient();

export function setApiAuthHooks(hooks) {
  apiClient.setAuthHooks(hooks);
}

export const api = {
  health: () => apiClient.request("/api/v1/health"),

  auth: {
    register: (payload) =>
      apiClient.request("/api/v1/auth/register", { method: "POST", body: payload }),
    login: (payload) =>
      apiClient.request("/api/v1/auth/login", { method: "POST", body: payload }),
    google: (idToken) =>
      apiClient.request("/api/v1/auth/google", {
        method: "POST",
        body: { id_token: idToken },
      }),
    refresh: (refreshToken) =>
      apiClient.request("/api/v1/auth/refresh", {
        method: "POST",
        body: { refresh_token: refreshToken },
      }),
    logout: (refreshToken) =>
      apiClient.request("/api/v1/auth/logout", {
        method: "POST",
        auth: true,
        body: refreshToken ? { refresh_token: refreshToken } : {},
      }),
    me: () => apiClient.request("/api/v1/users/me", { auth: true }),
  },

  users: {
    me: () => apiClient.request("/api/v1/users/me", { auth: true }),
    updateMe: (payload) =>
      apiClient.request("/api/v1/users/me", {
        method: "PATCH",
        auth: true,
        body: payload,
      }),
    uploadPhoto: (formData) =>
      apiClient.request("/api/v1/users/me/photo", {
        method: "POST",
        auth: true,
        body: formData,
      }),
    byId: (userId) => apiClient.request(`/api/v1/users/${userId}`, { auth: true }),
  },

  tutors: {
    list: (query) => apiClient.request("/api/v1/tutors/", { query }),
    byId: (teacherId) => apiClient.request(`/api/v1/tutors/${teacherId}`),
    availability: (teacherId) =>
      apiClient.request(`/api/v1/tutors/${teacherId}/availability`),
    addAvailability: (payload) =>
      apiClient.request("/api/v1/tutors/availability", {
        method: "POST",
        auth: true,
        body: payload,
      }),
    removeAvailability: (slotId) =>
      apiClient.request(`/api/v1/tutors/availability/${slotId}`, {
        method: "DELETE",
        auth: true,
      }),
    updateMe: (payload) =>
      apiClient.request("/api/v1/tutors/me", {
        method: "PATCH",
        auth: true,
        body: payload,
      }),
  },

  sessions: {
    mine: (status) =>
      apiClient.request("/api/v1/sessions/mine", {
        auth: true,
        query: status ? { status } : undefined,
      }),
    book: (payload) =>
      apiClient.request("/api/v1/sessions/", {
        method: "POST",
        auth: true,
        body: payload,
      }),
    byId: (sessionId) => apiClient.request(`/api/v1/sessions/${sessionId}`, { auth: true }),
    confirm: (sessionId) =>
      apiClient.request(`/api/v1/sessions/${sessionId}/confirm`, {
        method: "PATCH",
        auth: true,
      }),
    complete: (sessionId) =>
      apiClient.request(`/api/v1/sessions/${sessionId}/complete`, {
        method: "PATCH",
        auth: true,
      }),
    cancel: (sessionId) =>
      apiClient.request(`/api/v1/sessions/${sessionId}/cancel`, {
        method: "PATCH",
        auth: true,
      }),
    dailyRoom: (sessionId) =>
      apiClient.request(`/api/v1/sessions/${sessionId}/daily/room`, {
        method: "POST",
        auth: true,
      }),
    dailyToken: (sessionId) =>
      apiClient.request(`/api/v1/sessions/${sessionId}/daily/token`, {
        method: "POST",
        auth: true,
      }),
  },

  reviews: {
    create: (payload) =>
      apiClient.request("/api/v1/reviews/", {
        method: "POST",
        auth: true,
        body: payload,
      }),
    teacher: (teacherId) => apiClient.request(`/api/v1/reviews/teacher/${teacherId}`),
    tutor: (teacherId) => apiClient.request(`/api/v1/reviews/teacher/${teacherId}`),
    student: (studentId) => apiClient.request(`/api/v1/reviews/student/${studentId}`, { auth: true }),
  },

  payments: {
    byCourse: (coursePaymentId) =>
      apiClient.request(`/api/v1/payments/course/${coursePaymentId}`, { auth: true }),
    byStudent: (studentId) =>
      apiClient.request(`/api/v1/payments/student/${studentId}`, { auth: true }),
    byTeacher: (teacherId) =>
      apiClient.request(`/api/v1/payments/teacher/${teacherId}`, { auth: true }),
    setPlan: (coursePaymentId, paymentPlan) =>
      apiClient.request(`/api/v1/payments/course/${coursePaymentId}/plan`, {
        method: "POST",
        auth: true,
        body: { payment_plan: paymentPlan },
      }),
    checkoutLegacy: (coursePaymentId) =>
      apiClient.request(`/payments/course/${coursePaymentId}/checkout`, { auth: true }),
    confirmLegacy: (coursePaymentId) =>
      apiClient.request(`/payments/course/${coursePaymentId}/confirm`, {
        method: "POST",
        auth: true,
      }),
  },

  chat: {
    send: (payload) =>
      apiClient.request("/api/v1/chat/", {
        method: "POST",
        auth: true,
        body: payload,
      }),
    conversation: (otherUserId, limit = 50) =>
      apiClient.request(`/api/v1/chat/${otherUserId}`, {
        auth: true,
        query: { limit },
      }),
    toggleLike: (messageId) =>
      apiClient.request(`/api/v1/chat/${messageId}/like`, {
        method: "POST",
        auth: true,
      }),
  },

  admin: {
    suspend: (payload) =>
      apiClient.request("/api/v1/admin/suspend", {
        method: "POST",
        auth: true,
        body: payload,
      }),
    unsuspend: (userId) =>
      apiClient.request(`/api/v1/admin/unsuspend/${userId}`, {
        method: "POST",
        auth: true,
      }),
    autoRelease: () =>
      apiClient.request("/api/v1/admin/sessions/auto-release", {
        method: "POST",
        auth: true,
      }),
    overdueSessions: () =>
      apiClient.request("/api/v1/admin/sessions/overdue", { auth: true }),
    listUsers: (role, params = {}) =>
      apiClient.request("/api/v1/admin/users", {
        auth: true,
        query: { role, ...params },
      }),
  },

  // Additional merged routes mounted in app.main
  availability: {
    all: () => apiClient.request("/availability/"),
  },
  booking: {
    create: (payload) =>
      apiClient.request("/booking/", { method: "POST", auth: true, body: payload }),
  },
  reschedule: {
    create: (payload) =>
      apiClient.request("/reschedule/", { method: "POST", auth: true, body: payload }),
    bySession: (sessionId) => apiClient.request(`/reschedule/session/${sessionId}`, { auth: true }),
  },
  exams: {
    create: (payload) =>
      apiClient.request("/exams/create", { method: "POST", auth: true, body: payload }),
    byId: (examId) => apiClient.request(`/exams/${examId}`, { auth: true }),
    submit: (examId, payload) =>
      apiClient.request(`/exams/${examId}/submit`, { method: "POST", auth: true, body: payload }),
    list: (languageId, level) => apiClient.request(`/exams/list/${languageId}/${level}`, { auth: true }),
  },
  materials: {
    byTeacher: (teacherId) => apiClient.request(`/materials/${teacherId}`, { auth: true }),
    forStudent: (languageId, level) =>
      apiClient.request(`/materials/student/${languageId}/${level}`, { auth: true }),
  },
  certificates: {
    upload: (teacherId, formData) =>
      apiClient.request(`/certificates/upload/${teacherId}`, {
        method: "POST",
        auth: true,
        body: formData,
      }),
    byTeacher: (teacherId) => apiClient.request(`/certificates/${teacherId}`, { auth: true }),
    remove: (certificateId, teacherId) =>
      apiClient.request(`/certificates/${certificateId}`, {
        method: "DELETE",
        auth: true,
        query: { teacher_id: teacherId },
      }),
  },
  paypal: {
    createOrder: (payload) =>
      apiClient.request("/paypal/create-order", { method: "POST", auth: true, body: payload }),
    captureOrder: (payload) =>
      apiClient.request("/paypal/capture-order", { method: "POST", auth: true, body: payload }),
  },
};
