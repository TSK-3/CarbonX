import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";
import { AppLayout } from "./components/AppLayout.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { FarmDetailPage } from "./pages/FarmDetailPage.jsx";
import { EarningsPage } from "./pages/EarningsPage.jsx";
import { NewFarmPage } from "./pages/NewFarmPage.jsx";
import { SubmissionReviewPage } from "./pages/SubmissionReviewPage.jsx";
import { VerificationPage } from "./pages/VerificationPage.jsx";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }) {
  const { token } = useAuth();
  return token ? <Navigate to="/" replace /> : children;
}

function ProfilePlaceholder() {
    return (
        <div className="p-10 text-center">
            <h1 className="text-2xl font-bold text-primary">Profile Page</h1>
            <p className="text-on-surface-variant mt-2">Personal information and account settings will be here.</p>
        </div>
    )
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <AuthPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="farms/new" element={<NewFarmPage />} />
            <Route path="farms/:farmId" element={<FarmDetailPage />} />
            <Route path="farms/:farmId/review" element={<SubmissionReviewPage />} />
            <Route path="verification" element={<VerificationPage />} />
            <Route path="earnings" element={<EarningsPage />} />
            <Route path="profile" element={<ProfilePlaceholder />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
