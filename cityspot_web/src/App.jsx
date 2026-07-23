import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import OwnerLayout from "./components/layout/OwnerLayout";
import PublicLayout from "./components/layout/PublicLayout";
import ActivitiesPage from "./features/activities/pages/ActivitiesPage";
import AdminDashboardPage from "./features/admin/pages/AdminDashboardPage";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import CategoriesPage from "./features/categories/pages/CategoriesPage";
import FavoritesPage from "./features/favorites/pages/FavoritesPage";
import SearchHistoryPage from "./features/history/pages/SearchHistoryPage";
import MyInquiriesPage from "./features/inquiries/pages/MyInquiriesPage";
import ActivityFormPage from "./features/owner/pages/ActivityFormPage";
import ActivityImagesPage from "./features/owner/pages/ActivityImagesPage";
import OwnerActivitiesPage from "./features/owner/pages/OwnerActivitiesPage";
import OwnerDashboardPage from "./features/owner/pages/OwnerDashboardPage";
import OwnerInquiriesPage from "./features/owner/pages/OwnerInquiriesPage";
import ActivityDetailPage from "./features/public/pages/ActivityDetailPage";
import ExplorePage from "./features/public/pages/ExplorePage";
import HomePage from "./features/public/pages/HomePage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { clearSession, getCurrentUser, getSessionExpiresAt, getToken, isSessionExpired } from "./services/sessionStorage";

const protectedPaths = [
  { matches: (path) => path === "/admin" || path.startsWith("/admin/"), roles: ["ADMINISTRADOR"] },
  { matches: (path) => path === "/owner" || path.startsWith("/owner/"), roles: ["PROPIETARIO"] },
  { matches: (path) => path === "/profile", roles: ["USUARIO", "PROPIETARIO", "ADMINISTRADOR"] },
  { matches: (path) => path.startsWith("/activities/"), roles: ["USUARIO", "PROPIETARIO", "ADMINISTRADOR"] },
  { matches: (path) => path === "/favorites", roles: ["USUARIO"] },
  { matches: (path) => path === "/search-history", roles: ["USUARIO"] },
  { matches: (path) => path === "/consultas", roles: ["USUARIO"] }
];

function getPathProtection(pathname) {
  return protectedPaths.find((route) => route.matches(pathname));
}

function AuthHistoryGuard() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = () => {
      const protection = getPathProtection(window.location.pathname);

      if (!protection) return;

      if (isSessionExpired()) {
        clearSession();
        navigate("/login", { replace: true });
        return;
      }

      const token = getToken();
      const user = getCurrentUser();

      if (!token || !user || !protection.roles.includes(user.role)) {
        navigate("/login", { replace: true });
      }
    };

    const verifyAfterHistoryChange = () => {
      window.setTimeout(verifySession, 0);
    };

    verifySession();
    window.addEventListener("pageshow", verifySession);
    window.addEventListener("popstate", verifyAfterHistoryChange);

    return () => {
      window.removeEventListener("pageshow", verifySession);
      window.removeEventListener("popstate", verifyAfterHistoryChange);
    };
  }, [location.pathname, navigate]);

  useEffect(() => {
    const expiresAt = getSessionExpiresAt();

    if (!expiresAt) return undefined;

    const remainingTime = expiresAt - Date.now();

    if (remainingTime <= 0) {
      clearSession();
      navigate("/login", { replace: true });
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      clearSession();
      navigate("/login", { replace: true });
    }, remainingTime);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, navigate]);

  return null;
}

function App() {
  return (
    <>
      <AuthHistoryGuard />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/activities" element={<ExplorePage />} />
          <Route
            path="/activities/:id"
            element={
              <ProtectedRoute allowedRoles={["USUARIO", "PROPIETARIO", "ADMINISTRADOR"]}>
                <ActivityDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["USUARIO", "PROPIETARIO", "ADMINISTRADOR"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute allowedRoles={["USUARIO"]}>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search-history"
            element={
              <ProtectedRoute allowedRoles={["USUARIO"]}>
                <SearchHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consultas"
            element={
              <ProtectedRoute allowedRoles={["USUARIO"]}>
                <MyInquiriesPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRoles={["PROPIETARIO"]}>
              <OwnerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OwnerDashboardPage />} />
          <Route path="activities" element={<OwnerActivitiesPage />} />
          <Route path="inquiries" element={<OwnerInquiriesPage />} />
          <Route path="activities/new" element={<ActivityFormPage />} />
          <Route path="activities/:id/edit" element={<ActivityFormPage />} />
          <Route path="activities/:id/images" element={<ActivityImagesPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMINISTRADOR"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="activities" element={<ActivitiesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
