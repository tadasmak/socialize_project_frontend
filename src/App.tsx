import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ReactNode } from "react";
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// import Home from './pages/Home';
import ActivityFeed from './pages/ActivityFeed';
import Activity from './pages/Activity';
import ActivityCreation from './pages/ActivityCreate';
import ActivityEdit from './pages/ActivityEdit';
import Profile from './pages/Profile';
import EditProfile from './pages/ProfileEdit';
import Participant from './pages/Participant';
import Welcome from './pages/Welcome';

import Register from './pages/Register';
import Login from './pages/Login';

import Navigation from './components/Navigation/Navigation';
import React from 'react';

const MainLayout: React.FC<{ children?: ReactNode }> = ({ children }) => (
  <div className="flex flex-col h-full">
    <Navigation />
    <main className="flex flex-col w-full h-full mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
      {children ?? <Outlet />}
    </main>
  </div>
);

const NoNavLayout: React.FC<{ children?: ReactNode }> = ({ children }) => (
  <div className="flex flex-col h-full">
    <main className="flex flex-col w-full h-full mx-auto">
      {children ?? <Outlet />}
    </main>
  </div>
);

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<NoNavLayout><Welcome /></NoNavLayout>} />

          <Route element={<MainLayout />}>
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
          </Route>
        </Routes>

        <ToastContainer />
      </AuthProvider>
    </Router>

  );
};

export default App;
