import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { ToastProvider } from './components/common/ToastContainer.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DronesPage from './pages/DronesPage.jsx';
import SuperPowersPage from './pages/SuperPowersPage.jsx';
import PrimordialDucksPage from './pages/PrimordialDucksPage.jsx';
import CaptureAnalysisPage from './pages/CaptureAnalysisPage.jsx';
import CaptureLogicPage from './pages/CaptureLogicPage.jsx';
import CaptureOperationPage from './pages/CaptureOperationPage.jsx';
import DroneForm from './components/forms/DroneForm.jsx';
import SuperPowerForm from './components/forms/SuperPowerForm.jsx';
import PrimordialDuckForm from './components/forms/PrimordialDuckForm.jsx';
import './styles/global.css';
import './styles/forms.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>Carregando...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>Carregando...</div>;
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              } />
              <Route path="/login" element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } />
              <Route path="/forgot-password" element={
                <PublicRoute>
                  <ForgotPasswordPage />
                </PublicRoute>
              } />

              {/* Rotas protegidas */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/drones" element={
                <ProtectedRoute>
                  <DronesPage />
                </ProtectedRoute>
              } />
              <Route path="/superpowers" element={
                <ProtectedRoute>
                  <SuperPowersPage />
                </ProtectedRoute>
              } />
              <Route path="/capture-analysis" element={
                <ProtectedRoute>
                  <CaptureAnalysisPage />
                </ProtectedRoute>
              } />
              <Route path="/capture-logic" element={
                <ProtectedRoute>
                  <CaptureLogicPage />
                </ProtectedRoute>
              } />
              <Route path="/capture-operation" element={
                <ProtectedRoute>
                  <CaptureOperationPage />
                </ProtectedRoute>
              } />
              <Route path="/primordialducks" element={
                <ProtectedRoute>
                  <PrimordialDucksPage />
                </ProtectedRoute>
              } />
              <Route path="/drones/new" element={
                <ProtectedRoute>
                  <DroneForm />
                </ProtectedRoute>
              } />
              <Route path="/drones/edit/:id" element={
                <ProtectedRoute>
                  <DroneForm />
                </ProtectedRoute>
              } />
              <Route path="/drones/view/:id" element={
                <ProtectedRoute>
                  <DroneForm mode="view" />
                </ProtectedRoute>
              } />
              <Route path="/superpowers/new" element={
                <ProtectedRoute>
                  <SuperPowerForm />
                </ProtectedRoute>
              } />
              <Route path="/superpowers/edit/:id" element={
                <ProtectedRoute>
                  <SuperPowerForm />
                </ProtectedRoute>
              } />
              <Route path="/superpowers/view/:id" element={
                <ProtectedRoute>
                  <SuperPowerForm mode="view" />
                </ProtectedRoute>
              } />
              <Route path="/primordialducks/new" element={
                <ProtectedRoute>
                  <PrimordialDuckForm />
                </ProtectedRoute>
              } />
              <Route path="/primordialducks/edit/:id" element={
                <ProtectedRoute>
                  <PrimordialDuckForm />
                </ProtectedRoute>
              } />
              <Route path="/primordialducks/view/:id" element={
                <ProtectedRoute>
                  <PrimordialDuckForm mode="view" />
                </ProtectedRoute>
              } />

              {/* Configurações */}
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />

              {/* Rota padrão */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;