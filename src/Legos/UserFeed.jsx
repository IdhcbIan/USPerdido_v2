import React, { useState, useEffect } from 'react';
import Post from './Post';
import VideoPost from './VideoPost';
import ImagePost from './ImagePost';
import { Link, useNavigate } from 'react-router-dom';
import './Legos.css';

const UserFeed = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/posts');
        const data = await response.json();
        
        const userPosts = Object.entries(data).flatMap(([community, communityPosts]) => 
          communityPosts.filter(post => post.Username && post.Username.toLowerCase() === username.toLowerCase())
            .map(post => ({ ...post, community }))
        );
        
        setPosts(userPosts);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };
    fetchPosts();
  }, [username]);

  const handlePostClick = (post) => {
    navigate(`/post/${post.id}`, { state: { post } });
  };

  return (
    <div className="feed-box">
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post, index) => {
          const commonProps = {
            key: post.id || index,
            community: post.community,
            caption: post.caption,
            Ptype: post.Ptype,
            description: post.description,
            username: post.Username,
            onClick: () => handlePostClick(post)
          };

          switch (post.type) {
            case 'text':
              return <Post {...commonProps} />;
            case 'video':
              return <VideoPost {...commonProps} videoId={post.videoId} />;
            case 'image':
              return <ImagePost {...commonProps} imagePath={post.imagePath} />;
            default:
              return null;
          }
        })
      )}
    </div>
  );
};

export default UserFeed;
