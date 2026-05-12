import { request } from './client';

// ─── Auth ───────────────────────────────────────────────────────────────────
export const auth = {
  register: (p: { email: string; password: string; full_name: string; role: 'teacher' | 'student'; timezone?: string; phone?: string }) =>
    request('/api/v1/auth/register', { method: 'POST', body: p }),
  login: (p: { email: string; password: string }) =>
    request('/api/v1/auth/login', { method: 'POST', body: p }),
  refresh: (refresh_token: string) =>
    request('/api/v1/auth/refresh', { method: 'POST', body: { refresh_token } }),
  logout: (refresh_token?: string) =>
    request('/api/v1/auth/logout', { method: 'POST', auth: true, body: refresh_token ? { refresh_token } : {} }),
};

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = {
  me: () => request('/api/v1/users/me', { auth: true }),
  updateMe: (p: Record<string, unknown>) => request('/api/v1/users/me', { method: 'PATCH', auth: true, body: p }),
  uploadPhoto: (fd: FormData) => request('/api/v1/users/me/photo', { method: 'POST', auth: true, body: fd }),
  byId: (id: string) => request(`/api/v1/users/${id}`, { auth: true }),
};

// ─── Tutors ───────────────────────────────────────────────────────────────────
export const tutors = {
  list: (q?: Record<string, unknown>) => request('/api/v1/tutors/', { query: q as Record<string, unknown> }),
  byId: (id: string) => request(`/api/v1/tutors/${id}`),
  availability: (id: string, timezone?: string) =>
    request(`/api/v1/tutors/${id}/availability`, { query: timezone ? { student_timezone: timezone } : undefined }),
  addAvailability: (p: Record<string, unknown>) =>
    request('/api/v1/tutors/availability', { method: 'POST', auth: true, body: p }),
  removeAvailability: (slotId: string) =>
    request(`/api/v1/tutors/availability/${slotId}`, { method: 'DELETE', auth: true }),
  updateAvailability: (slotId: string, p: Record<string, unknown>) =>
    request(`/api/v1/tutors/availability/${slotId}`, { method: 'PUT', auth: true, body: p }),
  updateMe: (p: Record<string, unknown>) =>
    request('/api/v1/tutors/me', { method: 'PATCH', auth: true, body: p }),
};

// ─── Sessions ─────────────────────────────────────────────────────────────────
export const sessions = {
  mine: (status?: string) => request('/api/v1/sessions/mine', { auth: true, query: status ? { status } : undefined }),
  book: (p: Record<string, unknown>) => request('/api/v1/sessions/', { method: 'POST', auth: true, body: p }),
  byId: (id: string) => request(`/api/v1/sessions/${id}`, { auth: true }),
  confirm: (id: string) => request(`/api/v1/sessions/${id}/confirm`, { method: 'PATCH', auth: true }),
  complete: (id: string) => request(`/api/v1/sessions/${id}/complete`, { method: 'PATCH', auth: true }),
  cancel: (id: string) => request(`/api/v1/sessions/${id}/cancel`, { method: 'PATCH', auth: true }),
  dailyRoom: (id: string) => request(`/api/v1/sessions/${id}/daily/room`, { method: 'POST', auth: true }),
  dailyToken: (id: string) => request(`/api/v1/sessions/${id}/daily/token`, { method: 'POST', auth: true }),
};

// ─── Booking ─────────────────────────────────────────────────────────────────
export const booking = {
  create: (p: Record<string, unknown>) => request('/booking/', { method: 'POST', auth: true, body: p }),
  byStudent: (studentId: string) => request(`/booking/student/${studentId}`, { auth: true }),
  byTeacher: (teacherId: string) => request(`/booking/teacher/${teacherId}`, { auth: true }),
};

// ─── Reviews ─────────────────────────────────────────────────────────────────
export const reviews = {
  create: (p: Record<string, unknown>) => request('/api/v1/reviews/', { method: 'POST', auth: true, body: p }),
  byTeacher: (id: string) => request(`/api/v1/reviews/teacher/${id}`),
  byStudent: (id: string) => request(`/api/v1/reviews/student/${id}`, { auth: true }),
  flag: (p: Record<string, unknown>) => request('/api/v1/reviews/flag', { method: 'POST', auth: true, body: p }),
  flags: () => request('/api/v1/reviews/flags', { auth: true }),
};

// ─── Payments ─────────────────────────────────────────────────────────────────
export const payments = {
  byCourse: (courseId: string) => request(`/api/v1/payments/course/${courseId}`, { auth: true }),
  byStudent: (studentId: string) => request(`/api/v1/payments/student/${studentId}`, { auth: true }),
  byTeacher: (teacherId: string) => request(`/api/v1/payments/teacher/${teacherId}`, { auth: true }),
  bySession: (sessionId: string) => request(`/api/v1/payments/session/${sessionId}`, { auth: true }),
  setPlan: (courseId: string, plan: string) =>
    request(`/api/v1/payments/course/${courseId}/plan`, { method: 'POST', auth: true, body: { payment_plan: plan } }),
  checkout: (courseId: string) => request(`/payments/course/${courseId}/checkout`, { auth: true }),
  confirm: (courseId: string) => request(`/payments/course/${courseId}/confirm`, { method: 'POST', auth: true }),
};

// ─── PayPal ──────────────────────────────────────────────────────────────────
export const paypal = {
  createOrder: (p: Record<string, unknown>) =>
    request('/paypal/create-order', { method: 'POST', auth: true, body: p }),
  captureOrder: (p: Record<string, unknown>) =>
    request('/paypal/capture-order', { method: 'POST', auth: true, body: p }),
  history: (studentId?: string) =>
    studentId ? request(`/paypal/history/${studentId}`, { auth: true }) : request('/paypal/history', { auth: true }),
  refund: (txId: string) => request(`/paypal/refund/${txId}`, { method: 'POST', auth: true }),
};

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const chat = {
  send: (p: { receiver_id: string; content: string }) =>
    request('/api/v1/chat/', { method: 'POST', auth: true, body: p }),
  conversation: (otherId: string, limit = 50) =>
    request(`/api/v1/chat/${otherId}`, { auth: true, query: { limit } }),
  conversations: () => request('/api/v1/chat/conversations', { auth: true }),
  like: (msgId: string) => request(`/api/v1/chat/${msgId}/like`, { method: 'POST', auth: true }),
  markRead: (msgId: string) => request(`/api/v1/chat/${msgId}/read`, { method: 'PATCH', auth: true }),
};

// ─── Availability ─────────────────────────────────────────────────────────────
export const availability = {
  byTeacher: (teacherId: string, tz?: string) =>
    request(`/availability/${teacherId}`, { auth: true, query: tz ? { student_timezone: tz } : undefined }),
  add: (p: Record<string, unknown>) => request('/availability/', { method: 'POST', auth: true, body: p }),
  remove: (slotId: string) =>
    request(`/availability/${slotId}`, { method: 'DELETE', auth: true }),
  update: (slotId: string, p: Record<string, unknown>) =>
    request(`/availability/${slotId}`, { method: 'PUT', auth: true, body: p }),
};

// ─── Reschedule ───────────────────────────────────────────────────────────────
export const reschedule = {
  request: (p: Record<string, unknown>) => request('/reschedule/', { method: 'POST', auth: true, body: p }),
  accept: (id: string) => request(`/reschedule/${id}/accept`, { method: 'PUT', auth: true }),
  reject: (id: string) => request(`/reschedule/${id}/reject`, { method: 'PUT', auth: true }),
  bySession: (sessionId: string) => request(`/reschedule/session/${sessionId}`, { auth: true }),
};

// ─── Exams ────────────────────────────────────────────────────────────────────
export const exams = {
  create: (p: Record<string, unknown>) => request('/exams/create', { method: 'POST', auth: true, body: p }),
  byId: (id: string) => request(`/exams/${id}`, { auth: true }),
  submit: (id: string, p: Record<string, unknown>) =>
    request(`/exams/${id}/submit`, { method: 'POST', auth: true, body: p }),
  list: (languageId?: number, level?: string) =>
    languageId && level
      ? request(`/exams/list/${languageId}/${level}`, { auth: true })
      : request('/exams/list', { auth: true }),
  attempts: (teacherId: string) => request(`/exams/attempts/${teacherId}`, { auth: true }),
  deactivate: (id: string) => request(`/exams/${id}`, { method: 'DELETE', auth: true }),
};

// ─── Certificates ─────────────────────────────────────────────────────────────
export const certificates = {
  upload: (fdOrTeacherId: FormData | string, fd?: FormData) =>
    typeof fdOrTeacherId === 'string'
      ? request(`/certificates/upload/${fdOrTeacherId}`, { method: 'POST', auth: true, body: fd! })
      : request('/certificates/upload', { method: 'POST', auth: true, body: fdOrTeacherId }),
  byTeacher: (teacherId: string) => request(`/certificates/${teacherId}`, { auth: true }),
  verify: (certId: string) => request(`/certificates/${certId}/verify`, { method: 'PUT', auth: true }),
  remove: (certId: string) => request(`/certificates/${certId}`, { method: 'DELETE', auth: true }),
};

// ─── Materials ────────────────────────────────────────────────────────────────
export const materials = {
  upload: (fdOrTeacherId: FormData | string, fd?: FormData) =>
    typeof fdOrTeacherId === 'string'
      ? request(`/materials/upload/${fdOrTeacherId}`, { method: 'POST', auth: true, body: fd! })
      : request('/materials/upload', { method: 'POST', auth: true, body: fdOrTeacherId }),
  byTeacher: (teacherId: string, q?: Record<string, unknown>) =>
    request(`/materials/${teacherId}`, { auth: true, query: q }),
  forStudent: (languageId: number, level: string) =>
    request(`/materials/student/${languageId}/${level}`, { auth: true }),
  remove: (materialId: string) => request(`/materials/${materialId}`, { method: 'DELETE', auth: true }),
};

// ─── Search ───────────────────────────────────────────────────────────────────
export const search = {
  languages: () => request('/search/languages'),
  levels: () => request('/search/levels'),
  teachers: (q?: Record<string, unknown>) => request('/search/teachers', { query: q }),
  teacherProfile: (id: string) => request(`/search/teacher/${id}/profile`),
};

// ─── Progress ─────────────────────────────────────────────────────────────────
export const progress = {
  byStudent: (studentId: string) => request(`/progress/student/${studentId}`, { auth: true }),
};

// ─── Verifications ────────────────────────────────────────────────────────────
export const verifications = {
  pending: () => request('/verifications/pending', { auth: true }),
  verified: () => request('/verifications/verified', { auth: true }),
  status: (teacherId: string) => request(`/verifications/status/${teacherId}`, { auth: true }),
  verify: (teacherIdOrBody: string | Record<string, unknown>) =>
    typeof teacherIdOrBody === 'string'
      ? request('/verifications/verify', { method: 'POST', auth: true, body: { teacher_id: teacherIdOrBody } })
      : request('/verifications/verify', { method: 'POST', auth: true, body: teacherIdOrBody }),
  revoke: (teacherIdOrBody: string | Record<string, unknown>) =>
    typeof teacherIdOrBody === 'string'
      ? request('/verifications/revoke', { method: 'PATCH', auth: true, body: { teacher_id: teacherIdOrBody } })
      : request('/verifications/revoke', { method: 'PATCH', auth: true, body: teacherIdOrBody }),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const admin = {
  dashboard: () => request('/admin/dashboard', { auth: true }),
  flags: () => request('/admin/flags', { auth: true }),
  resolveFlag: (flagId: string, action?: string) =>
    request(`/admin/flags/${flagId}/resolve`, { method: 'PUT', auth: true, body: action ? { action } : undefined }),
  suspensions: () => request('/admin/suspensions', { auth: true }),
  teachers: () => request('/admin/teachers', { auth: true }),
  students: () => request('/admin/students', { auth: true }),
  suspend: (userId: string, data?: Record<string, unknown>) =>
    request('/api/v1/admin/suspend', { method: 'POST', auth: true, body: { user_id: userId, ...data } }),
  unsuspend: (userId: string) =>
    request(`/api/v1/admin/unsuspend/${userId}`, { method: 'POST', auth: true }),
  autoRelease: () => request('/api/v1/admin/sessions/auto-release', { method: 'POST', auth: true }),
  listUsers: (role: string, params?: Record<string, unknown>) =>
    request('/api/v1/admin/users', { auth: true, query: { role, ...params } }),
};

// ─── Videocall ────────────────────────────────────────────────────────────────
export const videocall = {
  getUrl: (sessionId: string, userId: string) =>
    request(`/videocall/${sessionId}`, { auth: true, query: { user_id: userId } }),
};
