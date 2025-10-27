import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import './Layout.css';

const Layout = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebarExpanded');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.innerWidth > 768;
  });

  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(isSidebarExpanded));
  }, [isSidebarExpanded]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="layout">
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
      <div className={`main-content ${isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <Header onMenuClick={toggleSidebar} />
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;