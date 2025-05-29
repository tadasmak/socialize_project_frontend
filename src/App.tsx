import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import ActivityFeed from './pages/ActivityFeed';
import Activity from './pages/Activity';
import ActivityCreation from './pages/ActivityCreation';
import Profile from './pages/Profile';
import User from './pages/User';

import Navigation from './components/Navigation';

const App = () => {
  return (
    <Router>
      <Navigation />

      <main className="p-4">
        <Routes>
          <Route path="/" element={<ActivityFeed />} />
          <Route path="/activity/:id" element={<Activity />} />
          <Route path="/activity/new" element={<ActivityCreation />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/:username" element={<User />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
