import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig, COLLECTION_NAME } from "./firebaseConfig";

/**
 * Inicialização centralizada do Firebase.
 * Ao separar a configuração, garantimos que a instância seja única e estável.
 */

// Inicializa o Firebase com a configuração separada
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore e exporta a instância do banco de dados
export const db = getFirestore(app);

// Re-exporta o nome da coleção para conveniência
export { COLLECTION_NAME };
