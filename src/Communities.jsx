import React, { useState } from 'react';
import Header from "./Legos/Header.jsx"
import JoinCard from "./Legos/JoinCard.jsx"
import './index.css';
import './Legos/Legos.css';
import { useNavigate } from 'react-router-dom';

function Communities() {
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const navigate = useNavigate();

  const handleCommunityJoined = (communityName) => {
    setJoinedCommunities([...joinedCommunities, communityName]);
  };

  const handleContinue = () => {
    if (joinedCommunities.length > 0) {
      // Navigate to the next page or perform the next action
      navigate('/feed');
    } else {
      alert('Please join at least one community before continuing.');
    }
  };

  return(
    <>
      <Header />
      <div className="img-strip">
        <img src="./src/assets/cauc.jpg" alt="Community banner"/>
      </div>
      <h1 className="com-name">Join Our Communities!!</h1>
      <div className="coms-container">
        <div className="join-feed">
          <JoinCard communityName="C1" image="test2.webp" onJoin={handleCommunityJoined} />
          <JoinCard communityName="C2" image="fisI_b.webp" onJoin={handleCommunityJoined} />
        </div>
      </div>
    </>
  );
}

export default Communities;
