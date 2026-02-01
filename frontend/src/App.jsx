import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';

// Company Pages
import CompanyDashboard from './pages/CompanyDashboard';
import CompanyProfile from './pages/company/CompanyProfile';
import CreateDrive from './pages/company/CreateDrive';
import MyDrives from './pages/company/MyDrives';
import DriveApplicants from './pages/company/DriveApplicants';
import DriveDetails from './pages/company/DriveDetails';

// Student Pages
import StudentHome from './pages/student/StudentHome';
import StudentProfile from './pages/student/StudentProfile';
import StudentApply from './pages/student/StudentApply';

// Test Pages
import TestInterface from './pages/TestInterface';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Company Routes */}
        <Route 
          path="/company/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['company']} requireApproval={true}>
              <CompanyDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/company/profile" 
          element={
            <ProtectedRoute allowedRoles={['company']} requireApproval={true}>
              <CompanyProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/company/create-drive" 
          element={
            <ProtectedRoute allowedRoles={['company']} requireApproval={true}>
              <CreateDrive />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/company/drives" 
          element={
            <ProtectedRoute allowedRoles={['company']} requireApproval={true}>
              <MyDrives />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/company/drives/:driveId" 
          element={
            <ProtectedRoute allowedRoles={['company']} requireApproval={true}>
              <DriveDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/company/drives/:driveId/applicants" 
          element={
            <ProtectedRoute allowedRoles={['company']} requireApproval={true}>
              <DriveApplicants />
            </ProtectedRoute>
          } 
        />

        {/* Student Routes */}
        <Route 
          path="/student/dashboard" 
          element={<Navigate to="/student/home" replace />} 
        />
        
        <Route 
          path="/student/home" 
          element={
            <ProtectedRoute allowedRoles={['student']} requireApproval={true}>
              <StudentHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/student/profile" 
          element={
            <ProtectedRoute allowedRoles={['student']} requireApproval={false}> 
              <StudentProfile />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/student/apply" 
          element={
            <ProtectedRoute allowedRoles={['student']} requireApproval={false}>
              <StudentApply />
            </ProtectedRoute>
          } 
        />

        {/* Test Routes */}
        <Route 
          path="/test" 
          element={
            <ProtectedRoute allowedRoles={['student']} requireApproval={true}>
              <TestInterface />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/results" 
          element={
            <ProtectedRoute allowedRoles={['student']} requireApproval={true}>
              <ResultsPage />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
