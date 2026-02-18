export interface SessionRecord {
  id: string;
  date: string;
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  mode: string;
  difficulty: string;
}

const STORAGE_KEY = "typingTestHistory";
const MAX_SESSIONS = 50;

export function getHistory(): SessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSession(
  session: Omit<SessionRecord, "id" | "date">,
): SessionRecord {
  const record: SessionRecord = {
    ...session,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };

  const history = getHistory();
  history.push(record);

  if (history.length > MAX_SESSIONS) {
    history.splice(0, history.length - MAX_SESSIONS);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return record;
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
