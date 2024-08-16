import React, { useState } from 'react';
import { useAuth } from '../Legos/AuthContext';
import Header from "../Legos/Header.jsx";
import '../Legos/Legos.css';

function MakePost() {
  const { user } = useAuth();
  const [postType, setPostType] = useState('text');
  const [postTag, setPostTag] = useState('Question!');
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [videoId, setVideoId] = useState('');
  const [image, setImage] = useState(null);
  const [community, setCommunity] = useState('C1');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to create a post.');
      return;
    }

    const formData = new FormData();
    formData.append('community', community);
    formData.append('type', postType);
    formData.append('caption', caption);
    formData.append('description', description);
    formData.append('Ptype', postTag);
    formData.append('Username', user.username); // Changed to 'Username' with capital 'U'

    if (postType === 'video') {
      formData.append('videoId', videoId);
    } else if (postType === 'image' && image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('http://localhost:3001/api/mkpost', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Post created successfully!');
        // Reset form fields
        setPostType('text');
        setPostTag('Question!');
        setCaption('');
        setDescription('');
        setVideoId('');
        setImage(null);
        setCommunity('C1');
      } else {
        const errorData = await response.json();
        alert(`Failed to create post: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the post');
    }
  };

  if (!user) {
    return (
      <>
        <Header />
        <div className="make-post">
          <h1>Please log in to create a post.</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        <Header />
        <div className="img-strip">
          <img src="./src/assets/cauc.jpg" alt="Description of image" style={{ maxWidth: '100%', height: 'auto' }}/>
        </div>
        <div className="make-post">
          <form onSubmit={handleSubmit}>
            
            <div className='SideBySide'>
            <div>
            <h1>Select Community:</h1>
            <select value={community} onChange={(e) => setCommunity(e.target.value)}>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
              <option value="CDev">CDev</option>
            </select>
            </div>

            <div className='Left'>

            <h1>Select Post Tag:</h1>
            <select value={postTag} onChange={(e) => setPostTag(e.target.value)}>
              <option value="Question!">Question!</option>
              <option value="Curiosity!">Curiosity!</option>
              <option value="General Talk!">General Talk!</option>
              <option value="Introduction!">Introduction!</option>
            </select>
           </div>
           </div> 



            <hr />
            <h1>Select Post Type:</h1>
            <select value={postType} onChange={(e) => setPostType(e.target.value)}>
              <option value="text">Text Post</option>
              <option value="image">Image Post</option>
              <option value="video">Video Post</option>
            </select>



            <h1>Enter Caption:</h1>
            <div className="input-container">
              <input value={caption} onChange={(e) => setCaption(e.target.value)} required />
            </div>

            <h1>Enter Description:</h1>
            <div className="input-container">
              <input value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            {postType === 'video' && (
              <>
                <h1>Enter Video ID:</h1>
                <div className="input-container">
                  <input value={videoId} onChange={(e) => setVideoId(e.target.value)} required />
                </div>
              </>
            )}

            {postType === 'image' && (
              <>
                <h1>Upload Image:</h1>
                <div className="input-container">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setImage(e.target.files[0])} 
                    required 
                  />
                </div>
              </>
            )}

            <button type="submit">Create Post</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default MakePost;
