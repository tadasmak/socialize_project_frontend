import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'

import ActivityFeed from './pages/ActivityFeed';

const App = () => {
  return (
    <Router>
      <nav className="p-4 flex gap-4 bg-gray-100 shadow">
        <Link to="/" className="text-blue-500 hover:underline">Activities</Link>
      </nav>

      <main className="p-4">
        <Routes>
          <Route path="/" element={<ActivityFeed />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
