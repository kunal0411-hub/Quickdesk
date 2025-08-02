import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TicketProvider } from './contexts/TicketContext';
import AuthForm from './components/Auth/AuthForm';
import Layout from './components/Layout';
import EndUserDashboard from './components/Dashboard/EndUserDashboard';
import SupportAgentDashboard from './components/Dashboard/SupportAgentDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'support_agent':
        return <SupportAgentDashboard />;
      case 'end_user':
      default:
        return <EndUserDashboard />;
    }
  };

  return (
    <TicketProvider>
      <Layout>
        {renderDashboard()}
      </Layout>
    </TicketProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;