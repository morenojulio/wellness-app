import { collection, addDoc, Timestamp } from "firebase/firestore";
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
