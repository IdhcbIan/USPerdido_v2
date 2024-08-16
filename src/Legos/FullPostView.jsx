import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Header from "./Header.jsx"
import VideoPlayer from "./VideoPlayer.jsx"
import './Legos.css';


import Liked from '../assets/like(full).png';
import NotLiked from '../assets/like(not).png';


const FullPostView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { post } = location.state || {};
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [localUser, setLocalUser] = useState(null);
  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    console.log("Post data:", post);
    if (post && post.id) {
      fetchComments();
      recordClick();
      fetchLikes();
    }
    fetchUser();
  }, [post, user.username]);

  const fetchUser = async () => {
    try {
      const response = await fetch('/db/Users/users.json');
      const data = await response.json();
      const foundUser = data.find(u => u.username === user.username);
      if (foundUser) {
        setLocalUser(foundUser);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchComments = async () => {
    try {
      console.log('Fetching comments for post ID:', post.id);
      const response = await fetch(`http://localhost:3001/api/comments/${post.id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched comments:', data);
        setComments(data);
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const recordClick = async () => {
    if (!user) return;
    try {
      const response = await fetch('http://localhost:3001/api/recordClick', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post.id,
          username: user.username
        }),
      });
      if (!response.ok) {
        console.error('Failed to record click');
      }
    } catch (error) {
      console.error('Error recording click:', error);
    }
  };

  const fetchLikes = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/likes/${post.id}`);
      if (response.ok) {
        const data = await response.json();
        setLikes(data);
        setIsLiked(data.includes(user.username));
      } else {
        console.error('Failed to fetch likes');
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like posts.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/api/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post.id,
          username: user.username
        }),
      });
      if (response.ok) {
        fetchLikes();
      } else {
        console.error('Failed to like post');
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to comment.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post.id,
          content: newComment,
          username: user.username
        }),
      });
      if (response.ok) {
        setNewComment('');
        fetchComments();
      } else {
        console.error('Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  if (!post) {
    return <div>No post data available</div>;
  }

  const displayName = post.Username ? post.Username.split('@')[0] : '';

  return (
    <div className="full-post-view">
      <Header />
      <div className="img-strip">
        <img src="../src/assets/cauc.jpg" style={{ maxWidth: '100%', height: 'auto' }} alt="Header" />
      </div>
    
      <div className='full-post'> 
        <div className='post-box'> 
          <button className='back-button' onClick={() => navigate(-1)}>Back</button>
          
          <h1>{post.caption}</h1>

          <div className="post-header-info">
            <div className="post-header-links">
              <Link className="community-label" to={`/${post.community}`}>
                u/{post.community}
              </Link>
              {post.Username && (
                <Link 
                  className="username-label"
                  to="/UserCom"
                  state={{ username: post.Username }}
                >
                  @{displayName}
                </Link>
              )}
            </div>
            <div className="post-type">{post.Ptype}</div>
          </div>

          <div className="post-content">
            <hr />
            {post.imagePath && (
              <img 
                src={`http://localhost:3001/api/images/${post.imagePath}`} 
                alt={post.caption}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}
            {post.videoId && (
              <VideoPlayer videoId={post.videoId} width='100%' height='500'/>
            )}
            <p>{post.description}</p>
          </div>

          <div className="post-actions">
            <button onClick={handleLike}>
              {isLiked ? <img src={Liked}/> : <img src={NotLiked}/>} ({likes.length})
            </button>
          </div>

          <h2>Comments</h2>
          <div className="comments-section">
            <div className='mkcomment'>
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
              />
            <button type="submit">Submit Comment</button>
            </form>
            </div>
            <hr />
            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <p>{comment.content}</p>
                    <hr />
                    <small>
                      By: <Link to={`/UserCom`} state={{ username: comment.username }}>@{comment.username.split('@')[0]}</Link> at {comment.timestamp}
                    </small>
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPostView;
