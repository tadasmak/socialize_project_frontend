import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import ActivityFeed from './pages/ActivityFeed';
import Activity from './pages/Activity';
import ActivityCreation from './pages/ActivityForm/ActivityCreate';
import ActivityEdit from './pages/ActivityForm/ActivityEdit';
import Profile from './pages/Profile';
import EditProfile from './pages/ProfileEdit';
import Participant from './pages/Participant';

import Register from './pages/Register';
import Login from './pages/Login';

import Navigation from './components/Navigation/Navigation';

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
            <Route path="/activities/new" element={
              <ProtectedRoute>
                <ActivityCreation />
              </ProtectedRoute>
            } />
            <Route path="/activities/:id/edit" element={
              <ProtectedRoute>
                <ActivityEdit />
              </ProtectedRoute>
            } />

            <Route path="/participants/register" element={<Register />} />
            <Route path="/participants/login" element={<Login />} />
            <Route path="/participants/me" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute> 
            } />
            <Route path="/participants/me/edit" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute> 
            } />
            <Route path="/participants/:username" element={<Participant />} />
          </Routes>
        </main>

        <ToastContainer />
      </AuthProvider>
    </Router>
    
  );
};

export default App;
