import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import AssignProductPage from "./pages/AssignProductPage";
import DashboardPage from "./pages/DashboardPage";
import EmployeeManagementPage from "./pages/EmployeeManagementPage";
import ProductManagementPage from "./pages/ProductManagementPage";
import ReturnProductPage from "./pages/ReturnProductPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin-login" replace />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <EmployeeManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ProductManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assign-product"
        element={
          <ProtectedRoute>
            <AssignProductPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/return-product"
        element={
          <ProtectedRoute>
            <ReturnProductPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-settings"
        element={
          <ProtectedRoute>
            <AdminSettingsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
