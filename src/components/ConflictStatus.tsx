import React from 'react';
import useFetch from '../customHooks/useFetch'; 

interface ConflictStatusProps {
  absenceId: number; 
}

const ConflictStatus: React.FC<ConflictStatusProps> = ({ absenceId }) => {
  // Fetch conflict data 
  const { data, loading, error } = useFetch(`https://front-end-kata.brighthr.workers.dev/api/conflict/${absenceId}`);
 console.log(data)
  if (loading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span style={{ color: 'red' }}>Error: {error.message || 'Something went wrong'}</span>;
  }

  return (
    <span style={{ color: data?.conflicts ? 'red' : 'green' }}>
      {data?.conflicts ? '⚠️ Conflict' : 'No Conflict'}
    </span>
  );
};

export default ConflictStatus;