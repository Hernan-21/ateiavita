import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { LevelDetail } from './pages/LevelDetail';
import { LessonDetail } from './pages/LessonDetail';
import { TaskDetail } from './pages/TaskDetail';
export function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'level':
        return <LevelDetail onNavigate={setCurrentPage} />;
      case 'lesson':
        return <LessonDetail onNavigate={setCurrentPage} />;
      case 'task':
        return <TaskDetail onNavigate={setCurrentPage} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };
  return <Layout onNavigate={setCurrentPage} currentPage={currentPage}>
      {renderPage()}
    </Layout>;
}