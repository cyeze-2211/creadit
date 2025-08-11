import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AppLayout from "./layouts/AppLayout";
import MainLayout from "./layouts/MainLayout";
import Home from "./Components/Home/Home";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./Components/ProtectedRoute"; // Импорт компонента защиты маршрутов
import Details from "./Components/Details/Details";
import PaymentHistory from "./Components/PaymentHistory/PaymentHistory";
import Login from "./Components/Login/Login";
import Dashboard from "./Components/Dashboard/Dashboard";
import Orders from "./Components/Dashboard/components/Orders/Orders";
import Box from "./Components/Dashboard/components/Box/Box";
import Benefit from "./Components/Dashboard/components/Benefit/Benefit";
import OrderBox from "./Components/Dashboard/components/OrderBox/OrderBox";
import Debtors from "./Components/Debtors/Debtors";
import Expenses from "./Components/Expenses/Expenses";
import ClientDetail from "./Components/ClientDetail/ClientDetail";
import OrderDetail from "./Components/OrderDetail/OrderDetail";
import Product from "./Components/Product/Product";
import Profile from "./Components/Profile/Profile";
import Sell from "./Components/Sell/Sell";
import CreditSell from "./Components/CreditSell/CreditSell";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AppLayout />}>
          <Route
            element={
              <ProtectedRoute>
              <AdminLayout />
                </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/order" element={<Orders />} />
            <Route path="/benefits" element={<Benefit />} />
            <Route path="/box" element={<Box />} />
            <Route path="/orderbox" element={<OrderBox />} />
            <Route path="/debtors" element={<Debtors />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/client/profil/:id" element={<ClientDetail />} />
            <Route path="/order/detail/:id" element={<OrderDetail />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/sell/:id" element={<Sell />} />
            <Route path="/sell/credit" element={<CreditSell />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/details" element={<Details />} />
            <Route path="/paymenthistory" element={<PaymentHistory />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
