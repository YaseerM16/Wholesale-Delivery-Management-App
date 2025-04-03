import AdminHome from './pages/admin/AdminHome';
import EmailVerificationNotice from './pages/admin/CheckEmail';
import { DriversPage } from './pages/admin/drivers/DriversPage';
import Login from './pages/admin/Login';
import Register from './pages/admin/Register';
import VerifyMail from './pages/admin/VerifyMail';
import Home from './pages/Home'
import { useAppSelector } from './store/hooks';
import { Routes, Route, Navigate } from "react-router-dom";


function App() {
  const admin = useAppSelector(state => state.admins.admin)
  const adminLoc = localStorage.getItem("admin")
  const adminLogged = admin || adminLoc ? true : false

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verifymail" element={<VerifyMail />} />
        <Route path="/login/admin" element={adminLogged ? <Navigate to="/home/admin" replace /> : <Login />} />
        <Route path="/register/admin" element={adminLogged ? <Navigate to="/home/admin" replace /> : <Register />} />
        <Route path="/home/admin" element={adminLogged ? <AdminHome /> : <Register />} />
        <Route path="/check-email/admin" element={adminLogged ? <AdminHome /> : <EmailVerificationNotice />} />

        {/* Management */}
        <Route path="/admin/drivers-management" element={adminLogged ? <DriversPage /> : <Login />} />
      </Routes>
    </>
  )
}

export default App
