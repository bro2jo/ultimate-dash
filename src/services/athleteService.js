// src/services/athleteService.js

import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Fetch all athletes
 */
export const fetchAthletes = async () => {
  const athletesCol = collection(db, 'athletes');
  const athletesSnapshot = await getDocs(athletesCol);
  const athletesList = athletesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return athletesList;
};

/**
 * Add a new athlete
 */
export const addAthlete = async (athleteData) => {
  const athletesCol = collection(db, 'athletes');
  const docRef = await addDoc(athletesCol, athleteData);
  return docRef.id;
};

/**
 * Update an athlete
 */
export const updateAthlete = async (id, updatedData) => {
  const athleteDoc = doc(db, 'athletes', id);
  await updateDoc(athleteDoc, updatedData);
};

/**
 * Delete an athlete
 */
export const deleteAthlete = async (id) => {
  const athleteDoc = doc(db, 'athletes', id);
  await deleteDoc(athleteDoc);
};
