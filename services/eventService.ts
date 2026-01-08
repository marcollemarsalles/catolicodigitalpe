import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db, COLLECTION_NAME } from "./firebase";

/**
 * Serviço de dados de eventos utilizando Firebase Firestore.
 * Escuta a coleção definida nas configurações em tempo real.
 */

export const subscribeToEvents = (callback: (events: any[]) => void) => {
  console.log(`[Firebase] Tentando conectar na coleção: ${COLLECTION_NAME}`);
  
  try {
    const eventsCollection = collection(db, COLLECTION_NAME);
    // Ordenando por data. Nota: Se a coleção estiver vazia, o Firebase retorna array vazio.
    const q = query(eventsCollection, orderBy("date", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`[Firebase] Eventos recebidos: ${events.length}`);
      callback(events);
    }, (error) => {
      console.error("[Firebase] Erro ao escutar eventos:", error);
      // Se houver erro, retornamos vazio para parar o estado de loading no componente
      callback([]);
    });

    return unsubscribe;
  } catch (error) {
    console.error("[Firebase] Erro crítico na configuração do listener:", error);
    callback([]);
    return () => {};
  }
};