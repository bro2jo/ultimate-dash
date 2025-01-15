// src/components/FirestoreTest.jsx

import React, { useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const FirestoreTest = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const athletesCol = collection(db, 'athletes');
        const athletesSnapshot = await getDocs(athletesCol);
        const athletesList = athletesSnapshot.docs.map(doc => doc.data());
        console.log('Athletes:', athletesList);
      } catch (error) {
        console.error('Error fetching athletes:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Firestore Test</h2>
    </div>
  );
};

export default FirestoreTest;
