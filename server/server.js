import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'db', 'ImgLib'))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });



// Middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
  next();
});

// Serve images from the ImgLib directory
app.use('/api/images', express.static(path.join(__dirname, '..', 'db', 'ImgLib')));

// Serve images from the ComCards/ComImg directory
app.use('/api/comcards', express.static(path.join(__dirname, '..', 'db', 'ComCards', 'ComImg')));

async function initializeUsersFile() {
  const filePath = path.join(__dirname, '..', 'db', 'Users', 'users.json');
  if (!existsSync(filePath)) {
    await fs.writeFile(filePath, '[]', 'utf8');
    console.log('Initialized empty users.json file');
  }
}

app.post('/api/login', async (req, res) => {
  console.log('Received login request');
  const { username, password } = req.body;
  
  try {
    const filePath = path.join(__dirname, '..', 'db', 'Users', 'users.json');
    console.log('Attempting to read users file:', filePath);
    const data = await fs.readFile(filePath, 'utf8');
    const users = JSON.parse(data);
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      console.log('Login successful for user:', username);
      res.json({ success: true });
    } else {
      console.log('Login failed for user:', username);
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

app.get('/api/posts', async (req, res) => {
  console.log('Received request for /api/posts');
  try {
    const filePath = path.join(__dirname, '..', 'db', 'Posts', 'posts.json');
    console.log('Attempting to read file:', filePath);
    const data = await fs.readFile(filePath, 'utf8');
    console.log('Raw file content:', data);
    
    try {
      const posts = JSON.parse(data);
      console.log('Successfully parsed JSON:', posts);
      res.json(posts);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({ success: false, message: 'Error parsing JSON: ' + parseError.message });
    }
  } catch (err) {
    console.error('Error reading file:', err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

app.get('/api/cards', async (req, res) => {
  console.log('Received request for /api/cards');
  try {
    const filePath = path.join(__dirname, '..', 'db', 'ComCards', 'cards.json');
    console.log('Attempting to read file:', filePath);
    const data = await fs.readFile(filePath, 'utf8');
    console.log('Raw file content:', data);
    
    try {
      const cards = JSON.parse(data);
      console.log('Successfully parsed JSON:', cards);
      res.json(cards);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({ success: false, message: 'Error parsing JSON: ' + parseError.message });
    }
  } catch (err) {
    console.error('Error reading file:', err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

app.get('/api/desc', async (req, res) => {
  console.log('Received request for /api/desc');
  try {
    const filePath = path.join(__dirname, '..', 'db', 'ComDesc', 'Desc.json');
    console.log('Attempting to read file:', filePath);
    const data = await fs.readFile(filePath, 'utf8');
    console.log('Raw file content:', data);
    
    try {
      const desc = JSON.parse(data);
      console.log('Successfully parsed JSON:', desc);
      res.json(desc);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({ success: false, message: 'Error parsing JSON: ' + parseError.message });
    }
  } catch (err) {
    console.error('Error reading file:', err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

app.post('/api/register', async (req, res) => {
  console.log('Received registration request');
  const { name, email, password } = req.body;
  try {
    const filePath = path.join(__dirname, '..', 'db', 'Users', 'users.json');
    console.log('Attempting to read users file:', filePath);
    const data = await fs.readFile(filePath, 'utf8');
    let users = JSON.parse(data);

    if (users.some(user => user.username === email)) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = {
      name,
      username: email,
      password
    };

    users.push(newUser);
    const jsonString = JSON.stringify(users, null, 2);
    
    if (jsonString.trim() === '') {
      throw new Error('Attempted to write empty JSON string');
    }

    await fs.writeFile(filePath, jsonString);
    console.log('Registration successful for user:', email);

    // Return user data (excluding password) along with success message
    res.json({ 
      success: true, 
      message: 'User registered successfully',
      user: {
        name: newUser.name,
        username: newUser.username
      }
    });
  } catch (err) {
    console.error('Error in registration:', err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});


// Add this new endpoint after the existing /api/posts GET endpoint

app.post('/api/mkpost', upload.single('image'), async (req, res) => {
  console.log('Received request to create a new post');
  try {
    const { community, type, caption, description, Ptype, Username } = req.body;
    const filePath = path.join(__dirname, '..', 'db', 'Posts', 'posts.json');
    const data = await fs.readFile(filePath, 'utf8');
    let posts = JSON.parse(data);

    // Find the highest existing ID
    let highestId = 0;
    for (const com in posts) {
      for (const post of posts[com]) {
        const postId = parseInt(post.id);
        if (postId > highestId) {
          highestId = postId;
        }
      }
    }

    let newPost = {
      id: (highestId + 1).toString(),
      type,
      caption,
      description,
      Ptype,
      Username, // Keep the capitalization consistent
      comments: []
    };

    if (type === 'image' && req.file) {
      newPost.imagePath = req.file.filename;
    } else if (type === 'video') {
      newPost.videoId = req.body.videoId;
    }

    if (!posts[community]) {
      posts[community] = [];
    }
    posts[community].push(newPost);

    await fs.writeFile(filePath, JSON.stringify(posts, null, 2));
    console.log('New post added successfully to', community);
    res.json({ success: true, message: 'Post created successfully' });
  } catch (err) {
    console.error('Error creating new post:', err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});



app.post('/api/joinCommunity', async (req, res) => {
  console.log('Received request to join community');
  const { username, communityName } = req.body;
  console.log('Username:', username);
  console.log('Community:', communityName);

  try {
    const filePath = path.join(__dirname, '..', 'db', 'Users', 'interactions.json');
    let interactions = {};
    
    if (existsSync(filePath)) {
      const data = await fs.readFile(filePath, 'utf8');
      interactions = JSON.parse(data);
    }

    if (!interactions[username]) {
      interactions[username] = [{ coms: [] }];
    }

    if (!interactions[username][0].coms.includes(communityName)) {
      interactions[username][0].coms.push(communityName);
      await fs.writeFile(filePath, JSON.stringify(interactions, null, 2));
      console.log(`User ${username} joined community ${communityName}`);
      res.json({ success: true, message: `Successfully joined ${communityName}` });
    } else {
      console.log(`User ${username} is already a member of ${communityName}`);
      res.json({ success: true, message: `You're already a member of ${communityName}` });
    }
  } catch (err) {
    console.error('Error joining community:', err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// Add this new endpoint to display comments
app.get('/api/comments/:postId', async (req, res) => {
  console.log('Received request for comments');
  const { postId } = req.params;
  try {
    const filePath = path.join(__dirname, '..', 'db', 'Posts', 'posts.json');
    const data = await fs.readFile(filePath, 'utf8');
    const posts = JSON.parse(data);

    let targetPost;
    for (const community in posts) {
      targetPost = posts[community].find(post => post.id === postId);
      if (targetPost) break;
    }

    if (targetPost) {
      const comments = targetPost.comments || [];
      res.json(comments);
    } else {
      res.status(404).json({ success: false, message: 'Post not found' });
    }
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

app.post('/api/comments', async (req, res) => {
  console.log('Received request to add a comment');
  const { postId, content, username } = req.body;
  try {
    const filePath = path.join(__dirname, '..', 'db', 'Posts', 'posts.json');
    const data = await fs.readFile(filePath, 'utf8');
    let posts = JSON.parse(data);
    let targetPost;
    let targetCommunity;

    for (const community in posts) {
      targetPost = posts[community].find(post => post.id === postId);
      if (targetPost) {
        targetCommunity = community;
        break;
      }
    }

    if (targetPost) {
      if (!targetPost.comments) {
        targetPost.comments = [];
      }

      const newComment = {
        id: (targetPost.comments.length + 1).toString(),
        content,
        username, // This should now be the email address
        timestamp: new Date().toLocaleString() // Format: MM/DD/YYYY, HH:MM:SS AM/PM
      };

      targetPost.comments.push(newComment);
      await fs.writeFile(filePath, JSON.stringify(posts, null, 2));
      console.log(`New comment added to post ${postId}`);
      res.json({ success: true, comment: newComment });
    } else {
      res.status(404).json({ success: false, message: 'Post not found' });
    }
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});





//--------   Interactions    -----------------------------

app.post('/api/recordClick', async (req, res) => {
  const { postId, username } = req.body;
  try {
    const filePath = path.join(__dirname, '..', 'db', 'Posts', 'posts.json');
    let posts = JSON.parse(await fs.readFile(filePath, 'utf8'));
    
    for (let community in posts) {
      let post = posts[community].find(p => p.id === postId);
      if (post) {
        if (!post.clicks) post.clicks = [];
        if (!post.clicks.includes(username)) {
          post.clicks.push(username);
        }
        await fs.writeFile(filePath, JSON.stringify(posts, null, 2));
        return res.json({ success: true });
      }
    }
    res.status(404).json({ success: false, message: 'Post not found' });
  } catch (err) {
    console.error('Error recording click:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


app.get('/api/likes/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const filePath = path.join(__dirname, '..', 'db', 'Posts', 'posts.json');
    let posts = JSON.parse(await fs.readFile(filePath, 'utf8'));
    
    for (let community in posts) {
      let post = posts[community].find(p => p.id === postId);
      if (post) {
        return res.json(post.likes || []);
      }
    }
    res.status(404).json({ success: false, message: 'Post not found' });
  } catch (err) {
    console.error('Error fetching likes:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/like', async (req, res) => {
  const { postId, username } = req.body;
  try {
    const filePath = path.join(__dirname, '..', 'db', 'Posts', 'posts.json');
    let posts = JSON.parse(await fs.readFile(filePath, 'utf8'));
    
    for (let community in posts) {
      let post = posts[community].find(p => p.id === postId);
      if (post) {
        if (!post.likes) post.likes = [];
        const index = post.likes.indexOf(username);
        if (index > -1) {
          post.likes.splice(index, 1); // Unlike
        } else {
          post.likes.push(username); // Like
        }
        await fs.writeFile(filePath, JSON.stringify(posts, null, 2));
        return res.json({ success: true, likes: post.likes });
      }
    }
    res.status(404).json({ success: false, message: 'Post not found' });
  } catch (err) {
    console.error('Error updating like:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

















//------------------------------

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'An unexpected error occurred' });
});

app.listen(port, async () => {
  await initializeUsersFile();
  console.log(`Server running on http://localhost:${port}`);
});
