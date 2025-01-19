// src/components/AthleteList.tsx
import React from 'react';

interface Athlete {
  id: string;
  metadata: {
    name: string;
    email: string;
    // Add other necessary fields if needed
  };
}

interface AthleteListProps {
  athletes: Athlete[];
}

const AthleteList: React.FC<AthleteListProps> = ({ athletes }) => {
  if (athletes.length === 0) {
    return <p>No athletes found.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Athletes</h2>
      <ul className="space-y-2">
        {athletes.map((athlete) => (
          <li key={athlete.id} className="flex justify-between items-center p-2 bg-gray-800 rounded-md">
            <span className="font-medium text-white">{athlete.metadata.name}</span>
            <span className="text-gray-400">{athlete.metadata.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AthleteList;
