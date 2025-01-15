// src/components/AthleteList.jsx

import React from 'react';

const AthleteList = ({ athletes }) => {
  return (
    <div>
      <h2>Athletes</h2>
      <ul>
        {athletes.map(athlete => (
          <li key={athlete.id}>
            <strong>{athlete.metadata.name}</strong> - {athlete.metadata.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AthleteList;
