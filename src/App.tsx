import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import ActivityFeed from './pages/ActivityFeed';
import Activity from './pages/Activity';
import ActivityCreation from './pages/ActivityCreate/ActivityCreate';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Participant from './pages/Participant';

import Register from './pages/Register';
import Login from './pages/Login';

import Navigation from './components/Navigation';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navigation />

        <main className="mx-auto mt-12 max-w-7xl px-2 sm:px-6 lg:px-8 pb-12">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/activities" element={<ActivityFeed />} />
            <Route path="/activities/:id" element={<Activity />} />
            <Route path="/activities/new" element={<ActivityCreation />} />

            <Route path="/participants/register" element={<Register />} />
            <Route path="/participants/login" element={<Login />} />
            <Route path="/participants/me" element={<Profile />} />
            <Route path="/participants/me/edit" element={<EditProfile />} />
            <Route path="/participants/:username" element={<Participant />} />
          </Routes>
        </main>

        <ToastContainer />
      </AuthProvider>
    </Router>
    
  );
};

export default App;
