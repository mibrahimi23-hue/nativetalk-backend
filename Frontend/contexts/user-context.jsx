import { createContext, useCallback, useContext, useMemo, useState } from "react";

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

export function UserProvider({ children }) {
  const [role, setRole] = useState(null);
  const [profile, setProfileState] = useState(DEFAULT_PROFILE);
  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: "Lesson 1: Basic Greetings",
      level: "A1",
      status: "completed",
      date: null,
      time: null,
    },
    {
      id: 2,
      title: "Lesson 2: Common Phrases",
      level: "A1",
      status: "join",
      date: "10/02",
      time: "5:00 PM",
    },
    {
      id: 3,
      title: "Lesson 3: Numbers",
      level: "A1",
      status: "upcoming",
      date: "10/07",
      time: "7:00 PM",
    },
    {
      id: 4,
      title: "Lesson 4: Directions",
      level: "A1",
      status: "upcoming",
      date: "10/07",
      time: "8:00 PM",
    },
  ]);
  const [materials, setMaterials] = useState([
    { id: 1, title: "Vocabulary List", file: null },
    { id: 2, title: "Grammar Guide", file: null },
    { id: 3, title: "Practice Exercises", file: null },
    { id: 4, title: "Audio Lessons", file: null },
  ]);
  const [savedTutorIds, setSavedTutorIds] = useState([]);

  const setProfile = useCallback((patch) => {
    setProfileState((prev) => ({ ...prev, ...patch }));
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
    setRole(null);
    setProfileState(DEFAULT_PROFILE);
    setSavedTutorIds([]);
  }, []);

  const value = useMemo(
    () => ({
      role,
      setRole,
      profile,
      setProfile,
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
