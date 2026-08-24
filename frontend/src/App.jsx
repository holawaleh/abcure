
import { Routes, Route } from "react-router-dom";

import ProductList from "./pages/ProductList";

import ProductDetail from "./pages/ProductDetail";

import Login from "./pages/Login";

import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";



function App() {

  return (

    <Routes>

      <Route path="/" element={<ProductList />} />

      <Route path="/products/:slug" element={<ProductDetail />} />

      <Route path="/login" element={<Login />} />

      <Route

        path="/admin"

        element={

          <ProtectedRoute>

            <AdminDashboard />

          </ProtectedRoute>

        }

      />

    </Routes>

  );

}



export default App;

