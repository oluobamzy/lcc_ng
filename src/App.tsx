import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from './components/AdminLayout';
import { LoginForm } from './components/LoginForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { BlogPage } from './pages/BlogPage';
import { SinglePostPage } from './pages/SinglePostPage';
import { EventsPage } from './pages/EventsPage';
import { SingleEventPage } from './pages/SingleEventPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { MediaPage } from './pages/MediaPage';
import { TeamPage } from './pages/TeamPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { LiveStreamPageEnhanced } from './components/LiveStreamEnhanced/LiveStreamPageEnhanced';
import { AdminPosts } from './pages/admin/AdminPosts';
import  AdminMediaEnhanced  from './pages/admin/AdminMediaEnhanced';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminEvents } from './pages/admin/AdminEvents';
import { AdminTeam } from './pages/admin/AdminTeam';
import { MainNav } from './components/Navigation/MainNav';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    
    <div className="min-h-screen bg-gray-50">
    <MainNav />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<SinglePostPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:slug" element={<SingleEventPage />} />        <Route path="/live" element={<LiveStreamPageEnhanced />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/media" element={<MediaPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/admin/login" element={<LoginForm />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      {/* Protected Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminPosts />} />
        <Route path="posts" element={<AdminPosts />} />
        <Route path="media" element={<AdminMediaEnhanced />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="team" element={<AdminTeam />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      
      {/* Catch-all route for 404 - Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </div>
    
  );
}

export default App;