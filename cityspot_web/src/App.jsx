import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./features/auth/pages/LoginPage";
import AdminDashboardPage from "./features/admin/pages/AdminDashboardPage";
import CategoriesPage from "./features/categories/pages/CategoriesPage";
import ActivitiesPage from "./features/activities/pages/ActivitiesPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/login" element={<LoginPage />} />
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
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default App;
