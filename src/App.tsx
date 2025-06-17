import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import Home from './pages/Home';
import ActivityFeed from './pages/ActivityFeed';
import Activity from './pages/Activity';
import ActivityCreation from './pages/ActivityCreation';
import Profile from './pages/Profile';
import User from './pages/User';

import Register from './pages/Register';
import Login from './pages/Login';

import Navigation from './components/Navigation';

const App = () => {
  return (
    <Router>
      <Navigation />

      <main className="mx-auto mt-12 max-w-7xl px-2 sm:px-6 lg:px-8 pb-12">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/activities" element={<ActivityFeed />} />
          <Route path="/activities/:id" element={<Activity />} />
          <Route path="/activities/new" element={<ActivityCreation />} />

          <Route path="/users/register" element={<Register />} />
          <Route path="/users/login" element={<Login />} />
          <Route path="/users/me" element={<Profile />} />
          <Route path="/users/:username" element={<User />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
