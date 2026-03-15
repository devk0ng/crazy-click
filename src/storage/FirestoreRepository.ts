import { IScoreRepository, ScoreEntry } from './IScoreRepository';

/**
 * Firestore implementation of IScoreRepository.
 * TODO: Install firebase and configure with your project credentials.
 * TODO: import { initializeApp } from 'firebase/app';
 * TODO: import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
 */
export class FirestoreRepository implements IScoreRepository {
  async save(_name: string, _score: number): Promise<ScoreEntry> {
    // TODO: Implement Firestore save
    // const db = getFirestore();
    // const ref = await addDoc(collection(db, 'scores'), { name, score, createdAt: Date.now() });
    // return { id: ref.id, name, score, createdAt: Date.now() };
    throw new Error('Not implemented: FirestoreRepository.save');
  }

  async getTopScores(_limit: number): Promise<ScoreEntry[]> {
    // TODO: Implement Firestore query
    // const db = getFirestore();
    // const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(_limit));
    // const snapshot = await getDocs(q);
    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScoreEntry));
    throw new Error('Not implemented: FirestoreRepository.getTopScores');
  }
}
