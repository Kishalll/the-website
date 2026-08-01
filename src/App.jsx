import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ContactSidebar from './components/ContactSidebar';
import Grain from './components/ui/Grain';

// Pages
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import AboutSlugResolver from './pages/AboutSlugResolver';
import PersonDetailPage from './pages/PersonDetailPage';
import DomainsPage from './pages/DomainsPage';
import ToolsPage from './pages/ToolsPage';
import CompilerPage from './pages/CompilerPage';
// import GalleryPage from './pages/GalleryPage'; // Unlinked but file retained
import RecruitmentPage from './pages/RecruitmentPage';

// Scroll to top on route change with smart About page scroll restoration
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathRef = React.useRef(pathname);

  React.useEffect(() => {
    const prevPath = prevPathRef.current;
    prevPathRef.current = pathname;

    if (pathname === '/about') {
      if (prevPath && prevPath.startsWith('/about/') && prevPath !== '/about') {
        // Returning from an About sub-route, let AboutPage handle scroll restoration
        return;
      }
      // Coming from another main page, clear saved scroll pos and scroll to top
      sessionStorage.removeItem('about_locked_y');
      sessionStorage.removeItem('about_scroll_pos');
      window.scrollTo(0, 0);
    } else {
      // For non-about pages, if leaving about sub-routes for main nav pages, clear saved scroll
      if (!pathname.startsWith('/about')) {
        sessionStorage.removeItem('about_locked_y');
        sessionStorage.removeItem('about_scroll_pos');
      }
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans antialiased overflow-x-hidden">
        <Grain />
        <Navbar onContactClick={() => setIsContactOpen(true)} />

        <ContactSidebar
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />

        <main>
          <AnimatePresence mode='wait'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/about/:slug" element={<AboutSlugResolver />} />
              <Route path="/about/:dept/:name" element={<PersonDetailPage />} />
              <Route path="/domains" element={<DomainsPage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/tools/compiler" element={<CompilerPage />} />
              {/* Gallery route removed completely so it's inaccessible via URL or slug */}
              <Route path="/recruitment" element={<RecruitmentPage />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;