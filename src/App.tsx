import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { AdminLayout } from './components/AdminLayout';
import { LoginForm } from './components/LoginForm';
import { HomePage } from './pages/HomePage';
import { BlogPage } from './pages/BlogPage';
import { SinglePostPage } from './pages/SinglePostPage';
import { EventsPage } from './pages/EventsPage';
import { SingleEventPage } from './pages/SingleEventPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPosts } from './pages/admin/AdminPosts';
import { AdminMedia } from './pages/admin/AdminMedia';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminEvents } from './pages/admin/AdminEvents';
import { MainNav } from './components/Navigation/MainNav';

function App() {
  return (
    
    <div className="min-h-screen bg-gray-50">
    <MainNav />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<SinglePostPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:slug" element={<SingleEventPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/admin/login" element={<LoginForm />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminPosts />} />
        <Route path="posts" element={<AdminPosts />} />
        <Route path="media" element={<AdminMedia />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
    </div>
    
  );
}

export default App;