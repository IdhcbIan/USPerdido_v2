import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Legos.css';

const Post = ({ id, community, caption, description, Ptype, username, onClick }) => {
  const navigate = useNavigate();

  // Extract the part before "@" from the username
  const displayName = username ? username.split('@')[0] : '';

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/post/${id}`, { state: { post: { id, community, caption, description, Ptype, Username: username }, community } });
  };

  return (
    <div className="post-box" onClick={handleClick}>
      <div className='post-header'> 
        <div className="post-header-info">
          <div className="post-header-links">
            <Link className="community-label" to={`/${community}`} onClick={(e) => e.stopPropagation()}>
              u/{community}
            </Link>
            {username && (
              <div>
                <Link 
                  className="username-label"
                  to="/UserCom"
                  state={{ username: username }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/UserCom', { state: { username: username } });
                  }}
                >
                  @{displayName}
                </Link>
              </div>
            )}
          </div>
          <div className="post-type">{Ptype}</div>
        </div>
      </div>
      <h2>{caption}</h2>
      <hr />
      <p>{description}</p>
    </div>
  );
};

export default Post;
