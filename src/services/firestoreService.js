import { db } from "./firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where 
} from "firebase/firestore";

/**
 * Fetch all chats for a specific user from Firestore
 */
export const getUserChats = async (userId) => {
  try {
    const q = query(collection(db, "chats"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const chats = [];
    querySnapshot.forEach((doc) => {
      chats.push(doc.data());
    });
    // Sort client-side by most recent
    return chats.sort((a, b) => b.id - a.id);
  } catch (error) {
    console.error("Error fetching chats from Firestore:", error);
    return [];
  }
};

/**
 * Save or update a single chat session in Firestore
 */
export const saveChatToFirestore = async (userId, chat) => {
  try {
    await setDoc(doc(db, "chats", chat.id), {
      ...chat,
      userId,
    });
  } catch (error) {
    console.error("Error saving chat to Firestore:", error);
  }
};

/**
 * Delete a specific chat from Firestore
 */
export const deleteChatFromFirestore = async (chatId) => {
  try {
    await deleteDoc(doc(db, "chats", chatId));
  } catch (error) {
    console.error("Error deleting chat from Firestore:", error);
  }
};