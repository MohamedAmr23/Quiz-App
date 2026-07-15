export function getUserProfile() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("userProfile");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getUserRole(): "Instructor" | "Student" | null {
  return getUserProfile()?.role ?? null;
}

export function isStudent(): boolean {
  return getUserRole() === "Student";
}

export function isInstructor(): boolean {
  return getUserRole() === "Instructor";
}