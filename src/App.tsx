import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* App routes */}
        <Route element={<AppLayout />}>
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
    </BrowserRouter>
  );
}

export default App;
