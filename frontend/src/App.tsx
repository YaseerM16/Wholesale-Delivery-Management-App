import AdminHome from './pages/admin/AdminHome';
import EmailVerificationNotice from './pages/admin/auth/CheckEmail';
import { DriversPage } from './pages/admin/drivers/DriversPage';
import AdminRegister from './pages/admin/auth/AdminRegister';
import VerifyMail from './pages/admin/auth/VerifyMail';
import Home from './pages/Home'
import { useAppSelector } from './store/hooks';
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from './pages/admin/auth/AdminLogin';
import { VendorsPage } from './pages/admin/vendor/VendorsPage';
import { InventoryPage } from './pages/admin/inventory/InventoryPage';

function App() {
  const admin = useAppSelector(state => state.admins.admin)
  const adminLoc = localStorage.getItem("admin")
  const adminLogged = admin || adminLoc ? true : false

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verifymail" element={<VerifyMail />} />
        <Route path="/login/admin" element={adminLogged ? <Navigate to="/home/admin" replace /> : <AdminLogin />} />
        <Route path="/register/admin" element={adminLogged ? <Navigate to="/home/admin" replace /> : <AdminRegister />} />
        <Route path="/home/admin" element={adminLogged ? <AdminHome /> : <AdminRegister />} />
        <Route path="/check-email/admin" element={adminLogged ? <AdminHome /> : <EmailVerificationNotice />} />

        {/* Management */}
        <Route path="/admin/drivers-management" element={adminLogged ? <DriversPage /> : <AdminLogin />} />
        <Route path="/admin/vendors-management" element={adminLogged ? <VendorsPage /> : <AdminLogin />} />
        <Route path="/admin/inventory-management" element={adminLogged ? <InventoryPage /> : <AdminLogin />} />
      </Routes>
    </>
  )
}

export default App
