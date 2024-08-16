import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Legos/AuthContext';
import Home from './Home.jsx';
import C1 from './Com/C1.jsx';
import C2 from './Com/C2.jsx';
import CDev from './Com/CDev.jsx';
import CS from './Com/CS.jsx';
import MainFeed from './MainFeed.jsx';
import AboutPage from './AboutPage.jsx';
import OurCom from './OurCom.jsx';
import Profile from './Legos/Profile.jsx';
import Register from './RegisterPage.jsx';
import MakePost from './Com/MakePost.jsx';
import UserCom from './Com/UserCom.jsx';
import Communities from './Communities.jsx';
import FullPostView from './Legos/FullPostView.jsx';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const HomeRoute = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/Feed" replace /> : <Home />;
};

function AppRoutes() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/C1" element={<ProtectedRoute><C1/></ProtectedRoute>} />
          <Route path="/C2" element={<ProtectedRoute><C2/></ProtectedRoute>} />
          <Route path="/CDev" element={<ProtectedRoute><CDev/></ProtectedRoute>} />
          <Route path="/CS" element={<ProtectedRoute><CS/></ProtectedRoute>} />
          <Route path="/Feed" element={<ProtectedRoute><MainFeed/></ProtectedRoute>} />
          <Route path="/Profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
          <Route path="/MakePost" element={<ProtectedRoute><MakePost/></ProtectedRoute>} />
          <Route path="/UserCom" element={<ProtectedRoute><UserCom/></ProtectedRoute>} />
          <Route path="/Communities" element={<ProtectedRoute><Communities/></ProtectedRoute>} />
          <Route path="/post/:id" element={<ProtectedRoute><FullPostView /></ProtectedRoute>} />
          <Route path="/OurCom" element={<OurCom />} />
          <Route path="/About" element={<AboutPage />} />
          <Route path="/Register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default AppRoutes;