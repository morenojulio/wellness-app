import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { writable } from "svelte/store";
import { db } from "$lib/firebase";

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

interface JournalStore {
  entries: Array<JournalEntry & { id: string }>;
  isLoading: boolean;
  error: string;
  isInitialized: boolean;
}

function createJournalStore() {
  const { subscribe, set, update } = writable<JournalStore>({
    entries: [],
    isLoading: true,
    error: "",
    isInitialized: false,
  });

  let unsubscribe: (() => void) | null = null;

  return {
    subscribe,
    init: () => {
      if (unsubscribe) return; // Already initialized

      const q = query(
        collection(db, "journal-entries"),
        orderBy("timestamp", "desc"),
      );

      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const entries: Array<JournalEntry & { id: string }> = [];

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            entries.push({
              id: doc.id,
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

          update((store) => ({
            ...store,
            entries,
            isLoading: false,
            error: "",
            isInitialized: true,
          }));
        },
        (error) => {
          console.error("Error in journal entries listener:", error);
          update((store) => ({
            ...store,
            isLoading: false,
            error: error instanceof Error ? error.message : String(error),
            isInitialized: true,
          }));
        },
      );
    },
    destroy: () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
      set({
        entries: [],
        isLoading: true,
        error: "",
        isInitialized: false,
      });
    },
  };
}

export const journalStore = createJournalStore();

export async function saveJournalEntry(entry: Omit<JournalEntry, "timestamp">) {
  try {
    const docRef = await addDoc(collection(db, "journal-entries"), {
      ...entry,
      timestamp: Timestamp.now(),
    });
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
  try {
    const q = query(
      collection(db, "journal-entries"),
      orderBy("timestamp", "desc"),
    );
    const querySnapshot = await getDocs(q);
    const entries: Array<JournalEntry & { id: string }> = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      entries.push({
        id: doc.id,
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
