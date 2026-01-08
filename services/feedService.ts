import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  increment,
  arrayUnion 
} from "firebase/firestore";
import { db } from "./firebase";
import { FEED_COLLECTION_NAME } from "./firebaseConfig";
import { PrayerActivity } from "../types";

/**
 * Converte dados do Firestore para objetos JavaScript simples (POJO).
 * Essencial para evitar erros de "Circular Structure" ao lidar com DocumentReferences ou Timestamps.
 */
const toPlainObject = (data: any): any => {
  if (data === null || data === undefined) return data;
  
  // Trata Timestamps do Firebase
  if (data.toDate && typeof data.toDate === 'function') {
    return data.toDate().toISOString();
  }
  
  if (Array.isArray(data)) {
    return data.map(toPlainObject);
  }
  
  if (typeof data === 'object') {
    // Evita processar objetos que não são literais (como instâncias de classes do Firebase)
    // se não forem especificamente Timestamps ou Arrays.
    const plain: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        plain[key] = toPlainObject(data[key]);
      }
    }
    return plain;
  }
  
  return data;
};

/**
 * Serviço para escutar as graças/orações do feed em tempo real.
 */
export const subscribeToFeed = (callback: (feed: PrayerActivity[]) => void) => {
  try {
    const feedCollection = collection(db, FEED_COLLECTION_NAME);
    const q = query(feedCollection, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feedData = snapshot.docs.map(doc => {
        const rawData = doc.data();
        const data = toPlainObject(rawData);
        
        const glorias = (data.glorias && typeof data.glorias === 'object' && !Array.isArray(data.glorias)) 
          ? data.glorias 
          : {};

        return {
          id: doc.id,
          ...data,
          prayerName: data.prayer || data.prayerName || "Oração",
          userMessage: data.gratitude || data.userMessage || "",
          userGloria: data.userGloria || null,
          amenCount: data.amenCount || 0,
          glorias: glorias,
          hasAmened: false
        } as unknown as PrayerActivity;
      });
      
      callback(feedData);
    }, (error) => {
      console.error("[Firebase] Feed subscription error:", error);
      callback([]);
    });

    return unsubscribe;
  } catch (error) {
    console.error("[Firebase] Fatal error in subscribeToFeed:", error);
    callback([]);
    return () => {};
  }
};

/**
 * Adiciona um novo item ao feed de graças.
 */
export const addFeedItem = async (item: Omit<PrayerActivity, 'id'>) => {
  try {
    const feedCollection = collection(db, FEED_COLLECTION_NAME);
    // Usamos o toPlainObject para garantir que nada circular ou complexo seja enviado
    const payload = toPlainObject(item);
    const docRef = await addDoc(feedCollection, payload);
    return docRef.id;
  } catch (error) {
    console.error("[Firebase] Error adding feed item:", error);
    throw error;
  }
};

/**
 * Atualiza um item do feed (Amém, Glória, etc).
 */
export const updateFeedItem = async (id: string, data: any) => {
  try {
    const docRef = doc(db, FEED_COLLECTION_NAME, id);
    const payload = toPlainObject(data);
    await updateDoc(docRef, payload);
  } catch (error) {
    console.error("[Firebase] Error updating feed item:", error);
    throw error;
  }
};

export { increment, arrayUnion };