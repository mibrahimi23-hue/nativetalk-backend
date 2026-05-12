import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, setApiAuthHooks } from "@/services/nativetalk-api";

const UserContext = createContext(null);

const DEFAULT_PROFILE = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  bio: "",
  level: "",
  language: "",
  avatar: null,
};

const toUiRole = (backendRole) => (backendRole === "teacher" ? "Tutor" : "Learner");
const toBackendRole = (uiRole) => (uiRole === "Tutor" ? "teacher" : "student");

function formatDateParts(isoValue) {
  if (!isoValue) return { date: "", time: "" };
  const dt = new Date(isoValue);
  if (Number.isNaN(dt.getTime())) return { date: "", time: "" };
  return {
    date: dt.toLocaleDateString(),
    time: dt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
  };
}

function mapSessionToLesson(session) {
  const { date, time } = formatDateParts(session.scheduled_at);
  return {
    id: String(session.id),
    sessionId: String(session.id),
    coursePaymentId: String(session.course_payment_id || ""),
    title: `Lesson (${session.level})`,
    level: session.level || "A1",
    status:
      session.status === "completed"
        ? "completed"
        : session.status === "confirmed"
          ? "join"
          : session.status,
    date,
    time,
    raw: session,
  };
}

function splitFullName(fullName = "") {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export function UserProvider({ children }) {
  const [role, setRole] = useState(null);
  const [profile, setProfileState] = useState(DEFAULT_PROFILE);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [savedTutorIds, setSavedTutorIds] = useState([]);
  const [sessionById, setSessionById] = useState({});

  const applyAuthResult = useCallback((result) => {
    if (!result) return;

    setAccessToken(result.access_token || null);
    setRefreshToken(result.refresh_token || null);
    setCurrentUser(result.user || null);

    if (result.user) {
      const { firstName, lastName } = splitFullName(result.user.full_name);
      setRole(toUiRole(result.user.role));
      setProfileState((prev) => ({
        ...prev,
        firstName,
        lastName,
        email: result.user.email || prev.email,
        phone: result.user.phone || prev.phone,
        bio: result.user.bio || prev.bio,
      }));
    }
  }, []);

  const tryRefreshSession = useCallback(async () => {
    if (!refreshToken) return false;
    try {
      const refreshed = await api.auth.refresh(refreshToken);
      applyAuthResult(refreshed);
      return true;
    } catch {
      return false;
    }
  }, [applyAuthResult, refreshToken]);

  useEffect(() => {
    setApiAuthHooks({
      getAccessToken: () => accessToken,
      onUnauthorized: tryRefreshSession,
    });
  }, [accessToken, tryRefreshSession]);

  const setProfile = useCallback((patch) => {
    setProfileState((prev) => ({ ...prev, ...patch }));
  }, []);

  const loginWithEmail = useCallback(async ({ email, password }) => {
    setAuthLoading(true);
    try {
      const result = await api.auth.login({ email, password });
      applyAuthResult(result);
      try {
        const me = await api.users.me();
        const { firstName, lastName } = splitFullName(me.full_name);
        setCurrentUser(me);
        setProfileState((prev) => ({
          ...prev,
          firstName,
          lastName,
          email: me.email || prev.email,
          phone: me.phone || prev.phone,
        }));
      } catch {
        // ignore; token response already applied
      }
      return result;
    } finally {
      setAuthLoading(false);
    }
  }, [applyAuthResult]);

  const registerWithEmail = useCallback(async ({ firstName, lastName, email, phone, password, uiRole }) => {
    setAuthLoading(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const result = await api.auth.register({
        email,
        password,
        full_name: fullName,
        role: toBackendRole(uiRole),
      });
      applyAuthResult(result);
      setProfileState((prev) => ({ ...prev, phone: phone || prev.phone }));
      return result;
    } finally {
      setAuthLoading(false);
    }
  }, [applyAuthResult]);

  const loadTutors = useCallback(async (query = {}) => {
    const result = await api.tutors.list(query);
    const mapped = (result?.items || []).map((t) => ({
      id: String(t.id),
      userId: String(t.user_id),
      name: t.full_name || "Tutor",
      language: t.language_name || (t.language_id ? `Language ${t.language_id}` : "Language"),
      level: t.max_level || "A1",
      price: t.hourly_rate ? `$${t.hourly_rate}/hr` : "$--/hr",
      likes: 0,
      image: t.profile_photo || null,
      raw: t,
    }));
    setTutors(mapped);
    return mapped;
  }, []);

  const fetchConversation = useCallback(async (otherUserId, limit = 50) => {
    return api.chat.conversation(otherUserId, limit);
  }, []);

  const loadMySessions = useCallback(async (status) => {
    const result = await api.sessions.mine(status);
    const mapped = (result || []).map(mapSessionToLesson);
    setLessons(mapped);
    setSessionById(
      mapped.reduce((acc, lesson) => {
        acc[lesson.id] = lesson;
        return acc;
      }, {}),
    );
    return mapped;
  }, []);

  const refreshMyProfile = useCallback(async () => {
    const me = await api.users.me();
    const { firstName, lastName } = splitFullName(me.full_name);
    setCurrentUser(me);
    setRole(toUiRole(me.role));
    setProfileState((prev) => ({
      ...prev,
      firstName,
      lastName,
      email: me.email || prev.email,
      phone: me.phone || prev.phone,
      avatar: me.profile_photo || prev.avatar,
    }));
    return me;
  }, []);

  const updateProfileRemote = useCallback(async (payload) => {
    const updated = await api.users.updateMe(payload);
    const { firstName, lastName } = splitFullName(updated.full_name);
    setCurrentUser(updated);
    setProfileState((prev) => ({
      ...prev,
      firstName,
      lastName,
      email: updated.email || prev.email,
      phone: updated.phone || prev.phone,
      avatar: updated.profile_photo || prev.avatar,
    }));
    return updated;
  }, []);

  const cancelSessionRemote = useCallback(async (sessionId) => {
    await api.sessions.cancel(sessionId);
    setLessons((prev) => prev.filter((lesson) => String(lesson.id) !== String(sessionId)));
    setSessionById((prev) => {
      const clone = { ...prev };
      delete clone[String(sessionId)];
      return clone;
    });
  }, []);

  const sendMessage = useCallback(async ({ receiverId, content }) => {
    return api.chat.send({ receiver_id: receiverId, content });
  }, []);

  const addLesson = useCallback((lesson) => {
    setLessons((prev) => [
      ...prev,
      { id: Date.now(), status: "upcoming", ...lesson },
    ]);
  }, []);

  const cancelLesson = useCallback((id) => {
    setLessons((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const rescheduleLesson = useCallback((id, date, time) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === id ? { ...l, date, time } : l)),
    );
  }, []);

  const addMaterial = useCallback((material) => {
    setMaterials((prev) => [
      ...prev,
      { id: Date.now(), file: null, ...material },
    ]);
  }, []);

  const toggleSavedTutor = useCallback((id) => {
    setSavedTutorIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const logout = useCallback(() => {
    api.auth.logout(refreshToken).catch(() => undefined);
    setRole(null);
    setAccessToken(null);
    setRefreshToken(null);
    setCurrentUser(null);
    setProfileState(DEFAULT_PROFILE);
    setSavedTutorIds([]);
    setTutors([]);
    setSessionById({});
  }, [refreshToken]);

  const value = useMemo(
    () => ({
      role,
      setRole,
      profile,
      setProfile,
      currentUser,
      authLoading,
      isAuthenticated: !!accessToken,
      loginWithEmail,
      registerWithEmail,
      loadTutors,
      tutors,
      fetchConversation,
      sendMessage,
      loadMySessions,
      refreshMyProfile,
      updateProfileRemote,
      cancelSessionRemote,
      sessionById,
      lessons,
      addLesson,
      cancelLesson,
      rescheduleLesson,
      materials,
      addMaterial,
      savedTutorIds,
      toggleSavedTutor,
      logout,
    }),
    [
      role,
      profile,
      setProfile,
      currentUser,
      authLoading,
      accessToken,
      loginWithEmail,
      registerWithEmail,
      loadTutors,
      tutors,
      fetchConversation,
      sendMessage,
      loadMySessions,
      refreshMyProfile,
      updateProfileRemote,
      cancelSessionRemote,
      sessionById,
      lessons,
      addLesson,
      cancelLesson,
      rescheduleLesson,
      materials,
      addMaterial,
      savedTutorIds,
      toggleSavedTutor,
      logout,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within UserProvider");
  }
  return ctx;
}
