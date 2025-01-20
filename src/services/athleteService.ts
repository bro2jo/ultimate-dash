import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  DocumentData
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Athlete } from '../types/athlete';

/**
 * Type for creating a new athlete - omits the id since it's generated
 */
type NewAthlete = Omit<Athlete, 'id'>;

/**
 * Type for updating an athlete - all fields are optional
 */
type UpdateAthlete = Partial<NewAthlete>;

/**
 * Fetch all athletes
 * @returns Promise<Athlete[]>
 */
export const fetchAthletes = async (): Promise<Athlete[]> => {
  const athletesCol = collection(db, 'athletes');
  const athletesSnapshot = await getDocs(athletesCol);
  const athletesList = athletesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Athlete, 'id'>)
  }));
  return athletesList;
};

/**
 * Add a new athlete
 * @param athleteData The athlete data to add
 * @returns Promise<string> The ID of the created athlete
 */
export const addAthlete = async (athleteData: NewAthlete): Promise<string> => {
  const athletesCol = collection(db, 'athletes');
  const docRef = await addDoc(athletesCol, athleteData);
  return docRef.id;
};

/**
 * Update an athlete
 * @param id The ID of the athlete to update
 * @param updatedData The data to update
 * @returns Promise<void>
 */
export const updateAthlete = async (
  id: string, 
  updatedData: UpdateAthlete
): Promise<void> => {
  const athleteDoc = doc(db, 'athletes', id);
  await updateDoc(athleteDoc, updatedData as DocumentData);
};

/**
 * Delete an athlete
 * @param id The ID of the athlete to delete
 * @returns Promise<void>
 */
export const deleteAthlete = async (id: string): Promise<void> => {
  const athleteDoc = doc(db, 'athletes', id);
  await deleteDoc(athleteDoc);
};

/**
 * Type guard to check if data matches Athlete type
 * @param data The data to check
 * @returns boolean
 */
export const isAthlete = (data: unknown): data is Athlete => {
  const athlete = data as Athlete;
  return (
    athlete !== null &&
    typeof athlete === 'object' &&
    typeof athlete.id === 'string' &&
    athlete.metadata !== undefined &&
    athlete.skills !== undefined &&
    Array.isArray(athlete.growth_targets)
  );
};

/**
 * Helper to validate athlete data before writing to Firestore
 * @param data The data to validate
 * @throws Error if data is invalid
 */
export const validateAthleteData = (data: unknown): NewAthlete => {
  if (
    !data ||
    typeof data !== 'object' ||
    !('metadata' in data) ||
    !('skills' in data) ||
    !('growth_targets' in data)
  ) {
    throw new Error('Invalid athlete data structure');
  }

  return data as NewAthlete;
};