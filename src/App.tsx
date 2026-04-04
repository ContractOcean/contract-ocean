import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import { ProtectedRoute, PublicRoute } from './lib/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ContractsPage from './pages/contracts/ContractsPage';
import TemplatesPage from './pages/templates/TemplatesPage';
import AIGeneratorPage from './pages/ai-generator/AIGeneratorPage';
import EditorPage from './pages/editor/EditorPage';
import SignSendPage from './pages/sign-send/SignSendPage';
import ContactsPage from './pages/contacts/ContactsPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import SettingsPage from './pages/settings/SettingsPage';
import BillingPage from './pages/billing/BillingPage';
import PDFExportPage from './pages/pdf-export/PDFExportPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth routes — redirect to dashboard if already logged in */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

          {/* Protected app routes — redirect to login if not authenticated */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/contracts" element={<ContractsPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/ai-generator" element={<AIGeneratorPage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/sign-send" element={<SignSendPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/pdf-export" element={<PDFExportPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
