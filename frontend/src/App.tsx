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
import DriverHome from './pages/driver/DriverHome';
import DriverLogin from './pages/driver/DriverLogin';
import CreateBill from './pages/driver/CreateBill';
import OrdersPage from './pages/driver/OrdersPage';

function App() {
  const admin = useAppSelector(state => state.admins.admin)
  const driver = useAppSelector(state => state.drivers.driver)
  const adminLoc = localStorage.getItem("admin")
  const driverLoc = localStorage.getItem("driver")
  const adminLogged = admin || adminLoc ? true : false
  const driverLogged = driver || driverLoc ? true : false

  return (
    <>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verifymail" element={<VerifyMail />} />
        <Route path="/login/admin" element={adminLogged ? <Navigate to="/home/admin" replace /> : <AdminLogin />} />
        <Route path="/register/admin" element={adminLogged ? <Navigate to="/home/admin" replace /> : <AdminRegister />} />
        <Route path="/home/admin" element={adminLogged ? <AdminHome /> : <AdminRegister />} />
        <Route path="/check-email/admin" element={adminLogged ? <AdminHome /> : <EmailVerificationNotice />} />

        {/* Driver Console */}
        <Route path="/login/driver" element={driverLogged ? <Navigate to="/home/driver" replace /> : <DriverLogin />} />
        <Route path="/home/driver" element={driverLogged ? <DriverHome /> : <DriverLogin />} />
        <Route path="/driver/create-bill" element={driverLogged ? <CreateBill /> : <DriverLogin />} />
        <Route path="/driver/view-orders" element={driverLogged ? <OrdersPage role='DRIVER' /> : <DriverLogin />} />

        {/* Admin  Management */}
        <Route path="/admin/drivers-management" element={adminLogged ? <DriversPage /> : <AdminLogin />} />
        <Route path="/admin/vendors-management" element={adminLogged ? <VendorsPage /> : <AdminLogin />} />
        <Route path="/admin/inventory-management" element={adminLogged ? <InventoryPage /> : <AdminLogin />} />
        <Route path="/admin/orders" element={adminLogged ? <OrdersPage role='ADMIN' /> : <AdminLogin />} />
        <Route path="/admin/create-bill" element={adminLogged ? <CreateBill /> : <AdminLogin />} />
      </Routes>
    </>
  )
}

export default App
