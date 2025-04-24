import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  getDoc, 
  doc, 
  Timestamp,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { User } from '../types/auth';
import { Interaction } from '../types/interaction';

// Collections
const INTERACTIONS_COLLECTION = 'interactions';

export const firebaseService = {
  // Save interaction
  saveInteraction: async (agentType: string, question: string, answer: string): Promise<string> => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const interactionData = {
        user_email: user.email,
        uid: user.uid,
        agent_type: agentType,
        question,
        answer,
        timestamp: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, INTERACTIONS_COLLECTION), interactionData);
      return docRef.id;
    } catch (error) {
      console.error("Error saving interaction:", error);
      throw error;
    }
  },
  
  // Get user interaction history with pagination
  getUserInteractions: async (
    pageSize: number = 10, 
    lastVisible?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ interactions: Interaction[], lastVisible: QueryDocumentSnapshot<DocumentData> | null }> => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      let q;
      
      if (lastVisible) {
        // Get next page
        q = query(
          collection(db, INTERACTIONS_COLLECTION),
          where("uid", "==", user.uid),
          orderBy("timestamp", "desc"),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        // Get first page
        q = query(
          collection(db, INTERACTIONS_COLLECTION),
          where("uid", "==", user.uid),
          orderBy("timestamp", "desc"),
          limit(pageSize)
        );
      }
      
      const querySnapshot = await getDocs(q);
      
      // Get last document for pagination
      const lastVisibleDoc = querySnapshot.docs.length > 0 
        ? querySnapshot.docs[querySnapshot.docs.length - 1]
        : null;
      
      // Map documents to Interaction objects
      const interactions = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          agent_type: data.agent_type,
          question: data.question,
          answer: data.answer,
          timestamp: data.timestamp.toDate().toISOString()
        };
      });
      
      return { 
        interactions, 
        lastVisible: lastVisibleDoc
      };
    } catch (error) {
      console.error("Error getting user interactions:", error);
      throw error;
    }
  }
};

export default firebaseService;