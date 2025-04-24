import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  getDoc, 
  setDoc, 
  doc, 
  Timestamp,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  collectionGroup
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { User } from '../types/auth';
import { Interaction } from '../types/interaction';

// Collections
const USERS_COLLECTION = 'users';
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
        uid: user.uid,
        user_email: user.email,
        agent_type: agentType,
        question,
        answer,
        timestamp: Timestamp.now()
      };
      
      // Save to nested collection under user
      const userInteractionsRef = collection(
        db, 
        `${USERS_COLLECTION}/${user.uid}/${INTERACTIONS_COLLECTION}`
      );
      
      const docRef = await addDoc(userInteractionsRef, interactionData);
      console.log("Interaction saved successfully to user's subcollection");
      
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
      
      // Reference to the nested subcollection
      const userInteractionsRef = collection(
        db, 
        `${USERS_COLLECTION}/${user.uid}/${INTERACTIONS_COLLECTION}`
      );
      
      let q;
      
      if (lastVisible) {
        // Get next page
        q = query(
          userInteractionsRef,
          orderBy("timestamp", "desc"),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        // Get first page
        q = query(
          userInteractionsRef,
          orderBy("timestamp", "desc"),
          limit(pageSize)
        );
      }
      
      console.log("Fetching interactions for user:", user.uid);
      const querySnapshot = await getDocs(q);
      console.log("Retrieved interactions:", querySnapshot.size);
      
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
  },
  
  // Save user profile to Firestore
  saveUserProfile: async (user: User): Promise<void> => {
    try {
      if (!user || !user.uid) {
        throw new Error("Invalid user data");
      }
      
      const userRef = doc(db, USERS_COLLECTION, user.uid);
      
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        lastLogin: Timestamp.now(),
        createdAt: Timestamp.now()
      });
      
      console.log("User profile saved successfully");
    } catch (error) {
      console.error("Error saving user profile:", error);
      throw error;
    }
  }
};

export default firebaseService;