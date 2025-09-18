import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { writable, get } from "svelte/store";
import { db } from "$lib/firebase";
import { authStore } from "$lib/stores/auth";

export interface JournalEntry {
  date: string;
  morningEnergy: number;
  afternoonEnergy: number;
  eveningEnergy: number;
  morningFocus: string;
  afternoonMoment: string;
  eveningEmotion: string;
  eveningAuthentic: string;
  eveningActing: string;
  eveningAdmiration: string;
  timestamp: Timestamp;
}

interface JournalStoreState {
  entries: Array<JournalEntry & { id: string }>;
  isLoading: boolean;
  error: string;
  isInitialized: boolean;
}

function createJournalStore() {
  const { subscribe, update, set } = writable<JournalStoreState>({
    entries: [],
    isLoading: true,
    error: "",
    isInitialized: false,
  });

  let authUnsub: (() => void) | null = null;
  let entriesUnsub: (() => void) | null = null;
  let currentUid: string | null = null;
  let started = false;

  function attachListener(uid: string) {
    if (entriesUnsub) {
      entriesUnsub();
      entriesUnsub = null;
    }

    update((s) => ({ ...s, isLoading: true, error: "" }));

    const q = query(
      collection(db, "users", uid, "journal-entries"),
      orderBy("timestamp", "desc"),
    );

    entriesUnsub = onSnapshot(
      q,
      (snap) => {
        const entries: Array<JournalEntry & { id: string }> = [];
        snap.forEach((d) => {
          const data = d.data();
          entries.push({
            id: d.id,
            date: data.date,
            morningEnergy: data.morningEnergy,
            afternoonEnergy: data.afternoonEnergy,
            eveningEnergy: data.eveningEnergy,
            morningFocus: data.morningFocus,
            afternoonMoment: data.afternoonMoment,
            eveningEmotion: data.eveningEmotion,
            eveningAuthentic: data.eveningAuthentic,
            eveningActing: data.eveningActing,
            eveningAdmiration: data.eveningAdmiration,
            timestamp: data.timestamp,
          });
        });
        update((s) => ({
          ...s,
          entries,
          isLoading: false,
          error: "",
          isInitialized: true,
        }));
      },
      (error) => {
        console.error("Error in journal entries listener:", error);
        update((s) => ({
          ...s,
          isLoading: false,
          error: error instanceof Error ? error.message : String(error),
          isInitialized: true,
        }));
      },
    );
  }

  return {
    subscribe,
    init: () => {
      if (started) return;
      started = true;

      authUnsub = authStore.subscribe((a) => {
        const uid = a.user?.uid || null;
        if (uid === currentUid) return;

        currentUid = uid;

        if (!uid) {
          if (entriesUnsub) {
            entriesUnsub();
            entriesUnsub = null;
          }
          set({ entries: [], isLoading: false, error: "", isInitialized: true });
          return;
        }

        attachListener(uid);
      });
    },
    destroy: () => {
      if (entriesUnsub) {
        entriesUnsub();
        entriesUnsub = null;
      }
      if (authUnsub) {
        authUnsub();
        authUnsub = null;
      }
      currentUid = null;
      started = false;
      set({ entries: [], isLoading: true, error: "", isInitialized: false });
    },
  };
}

export const journalStore = createJournalStore();

export async function saveJournalEntry(entry: Omit<JournalEntry, "timestamp">) {
  const { user } = get(authStore) as any;
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }
  try {
    const docRef = await addDoc(
      collection(db, "users", user.uid, "journal-entries"),
      { ...entry, timestamp: Timestamp.now() },
    );
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving journal entry:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getJournalEntries() {
  const { user } = get(authStore) as any;
  if (!user) {
    return { success: false, error: "Not authenticated", entries: [] };
  }
  try {
    const q = query(
      collection(db, "users", user.uid, "journal-entries"),
      orderBy("timestamp", "desc"),
    );
    const snap = await getDocs(q);
    const entries: Array<JournalEntry & { id: string }> = [];
    snap.forEach((d) => {
      const data = d.data();
      entries.push({
        id: d.id,
        date: data.date,
        morningEnergy: data.morningEnergy,
        afternoonEnergy: data.afternoonEnergy,
        eveningEnergy: data.eveningEnergy,
        morningFocus: data.morningFocus,
        afternoonMoment: data.afternoonMoment,
        eveningEmotion: data.eveningEmotion,
        eveningAuthentic: data.eveningAuthentic,
        eveningActing: data.eveningActing,
        eveningAdmiration: data.eveningAdmiration,
        timestamp: data.timestamp,
      });
    });
    return { success: true, entries };
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      entries: [],
    };
  }
}

export async function updateJournalEntry(
  id: string,
  data: Partial<Omit<JournalEntry, "timestamp">>,
) {
  const { user } = get(authStore) as any;
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }
  try {
    const ref = doc(db, "users", user.uid, "journal-entries", id);
    await updateDoc(ref, data);
    return { success: true };
  } catch (error) {
    console.error("Error updating journal entry:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function deleteJournalEntry(id: string) {
  const { user } = get(authStore) as any;
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }
  try {
    const ref = doc(db, "users", user.uid, "journal-entries", id);
    await deleteDoc(ref);
    return { success: true };
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
