import React, { useState } from 'react';
import { useAuth } from './AuthContext';

function JoinCard({ communityName, image, onJoin }) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const handleJoinCommunity = async () => {
    if (!user) {
      setMessage('Please log in to join a community.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/joinCommunity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.username, communityName }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setIsJoined(true);
        onJoin(communityName); // Call the onJoin prop function
      } else {
        setMessage(data.message || 'Failed to join community.');
      }
    } catch (error) {
      console.error('Error joining community:', error);
      setMessage('An error occurred while joining the community.');
    }
  };

  return (
    <div className="join-box">
      <img src={`./src/assets/${image}`} alt={`${communityName} community`}/>
      <h3>Join {communityName}!</h3>
      {!isJoined ? (
        <button onClick={handleJoinCommunity}>Join Community</button>
      ) : (
        <p>Joined!</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default JoinCard;
