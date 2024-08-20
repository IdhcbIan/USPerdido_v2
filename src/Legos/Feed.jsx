import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Post from './Post';
import VideoPost from './VideoPost';
import ImagePost from './ImagePost';
import './Legos.css';

const Feed = ({ community = null }) => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/posts');
        const data = await response.json();
        
        if (community) {
          const communityPosts = data[community] || [];
          setPosts(communityPosts.map(post => ({ ...post, community })));
        } else {
          const allPosts = Object.entries(data).flatMap(([com, communityPosts]) => 
            communityPosts.map(post => ({ ...post, community: com }))
          );
          setPosts(allPosts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, [community]);

  const handlePostClick = (post) => {
    navigate(`/post/${post.id}`, { state: { post, community: post.community } });
  };

  return (
    <div className="feed-box">
      <Link className="DLink" to={`/MakePost`}>
        <div>Criar Post</div>
      </Link>

      <h3>{community ? `Posts for ${community}` : 'Posts Recomendados Para Voce'}:</h3>
      {posts.length === 0 ? (
        <p>Nenhum Post Disponivel  :/</p>
      ) : (
        posts.map((post, index) => {
          const commonProps = {
            key: post.id || index,
            id: post.id,
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

export default Feed;
