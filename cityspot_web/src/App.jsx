import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/layout/AdminLayout";
import OwnerLayout from "./components/layout/OwnerLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomePage from "./features/public/pages/HomePage";
import ExplorePage from "./features/public/pages/ExplorePage";
import ActivityDetailPage from "./features/public/pages/ActivityDetailPage";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import FavoritesPage from "./features/favorites/pages/FavoritesPage";
import SearchHistoryPage from "./features/history/pages/SearchHistoryPage";
import OwnerDashboardPage from "./features/owner/pages/OwnerDashboardPage";
import OwnerActivitiesPage from "./features/owner/pages/OwnerActivitiesPage";
import ActivityFormPage from "./features/owner/pages/ActivityFormPage";
import ActivityImagesPage from "./features/owner/pages/ActivityImagesPage";
import AdminDashboardPage from "./features/admin/pages/AdminDashboardPage";
import CategoriesPage from "./features/categories/pages/CategoriesPage";
import ActivitiesPage from "./features/activities/pages/ActivitiesPage";
function App(){return <Routes>
 <Route element={<PublicLayout/>}><Route path="/" element={<HomePage/>}/><Route path="/activities" element={<ExplorePage/>}/><Route path="/activities/:id" element={<ActivityDetailPage/>}/><Route path="/profile" element={<ProtectedRoute allowedRoles={["USUARIO","PROPIETARIO","ADMINISTRADOR"]}><ProfilePage/></ProtectedRoute>}/><Route path="/favorites" element={<ProtectedRoute allowedRoles={["USUARIO","PROPIETARIO","ADMINISTRADOR"]}><FavoritesPage/></ProtectedRoute>}/><Route path="/search-history" element={<ProtectedRoute allowedRoles={["USUARIO","PROPIETARIO","ADMINISTRADOR"]}><SearchHistoryPage/></ProtectedRoute>}/></Route>
 <Route path="/login" element={<LoginPage/>}/><Route path="/register" element={<RegisterPage/>}/>
 <Route path="/owner" element={<ProtectedRoute allowedRoles={["PROPIETARIO"]}><OwnerLayout/></ProtectedRoute>}><Route index element={<OwnerDashboardPage/>}/><Route path="activities" element={<OwnerActivitiesPage/>}/><Route path="activities/new" element={<ActivityFormPage/>}/><Route path="activities/:id/edit" element={<ActivityFormPage/>}/><Route path="activities/:id/images" element={<ActivityImagesPage/>}/></Route>
 <Route path="/admin" element={<ProtectedRoute allowedRoles={["ADMINISTRADOR"]}><AdminLayout/></ProtectedRoute>}><Route index element={<AdminDashboardPage/>}/><Route path="categories" element={<CategoriesPage/>}/><Route path="activities" element={<ActivitiesPage/>}/></Route>
 <Route path="*" element={<Navigate to="/" replace/>}/>
 </Routes>}
export default App;
