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
import DomainsPage from './pages/DomainsPage';
import ToolsPage from './pages/ToolsPage';
import CompilerPage from './pages/CompilerPage';
import GalleryPage from './pages/GalleryPage';
import RecruitmentPage from './pages/RecruitmentPage';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

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
              <Route path="/domains" element={<DomainsPage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/tools/compiler" element={<CompilerPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
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
