import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import HomePage from "./componants/HomePage";
import Signup from "./componants/Signup";
import Login from "./componants/Login";
import Contact from "./pages/user/Contact";
import RentCycle from "./pages/user/Rentcycle";
import BookingConfirmation from "./pages/user/BookingConformation";
import UserDashboard from "./pages/user/UserDashboard";
import UserProfile from "./pages/user/UserProfile";
import ActiveRental from "./pages/employee/ActiveRental";
import WalletComponent from "./pages/user/WalletComponent";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import CycleManagement from "./pages/employee/CycleManagement";
import StationManagement from "./pages/employee/SationManagement";
import AdminStationManagement from "./pages/admin/AdminStationManagement";
import MaintanenceLogging from "./pages/employee/MaintanenceLogging";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CustomerManagement from "./pages/admin/CustomerManagement";
import CycleFleetManagement from "./pages/admin/CycleFleetManagement";
import RentalTransactionManagement from "./pages/admin/RentalTransectionManagement";
import PaymentManagement from "./pages/admin/PaymentManagement";
import EmployeeManagement from "./pages/admin/EmployeeManagement";
import FeedbackRatings from "./pages/admin/FeedBackRatings";
import AlertManagement from "./pages/admin/AlertManagement";
import MaintenanceOverview from "./pages/admin/MaintananceOverview";
import Navbar from "./pages/user/Navbar";
import RecoverPassword from "./pages/user/RecoverPassword";
import RideStatusBar from "./pages/user/Ridestatusbar";
import RideHistory from "./pages/user/Ridehistory";
import StationAnalytics from "./pages/employee/Stationanalytics";
import MaintenanceDashboard from './pages/employee/MaintenanceDashboard';
import { AdminRoute, EmployeeRoute, CustomerRoute } from "./componants/ProtectedRoute";
import FAQ from "./pages/user/FAQ";
import SafetyTips from "./pages/user/SafetyTips";
import RevenueManagement from './pages/admin/RevenueManagement';
// ✅ Layout that wraps only USER pages
const UserLayout = () => (
  <>
    <RideStatusBar />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  // ── Public / Auth pages (NO RideStatusBar) ──
  { path: "/",              element: <HomePage /> },
  { path: "/signup",        element: <Signup /> },
  { path: "/login",         element: <Login /> },
  { path: "/navbar",        element: <Navbar /> },
  { path: "/recoverpassword", element: <RecoverPassword /> },

  // ── USER pages (RideStatusBar appears here) ──
  {
   element: <CustomerRoute><UserLayout /></CustomerRoute>,   // ✅ wraps all user routes
    children: [
      { path: "/userdashboard",       element: <UserDashboard /> },
      { path: "/bookingconfirmation", element: <BookingConfirmation /> },
      { path: "/rentcycle",           element: <RentCycle /> },
      { path: "/contact",             element: <Contact /> },
      { path: "/userprofile",         element: <UserProfile /> },
      { path: "/wallet",              element: <WalletComponent /> },
      {path:"/ridehistory",           element: <RideHistory/>},
      {path:"/faq", element:<FAQ/>},
      {path:"/safety", element:<SafetyTips/>}
    ],
  },

  // ── EMPLOYEE pages (NO RideStatusBar) ──
  { path: "/employeedashboard",   element: <EmployeeRoute><EmployeeDashboard /></EmployeeRoute> },
  { path: "/activerental",        element: <EmployeeRoute><ActiveRental /></EmployeeRoute> },
  { path: "/cyclemanagement",     element: <EmployeeRoute><CycleManagement /></EmployeeRoute> },
  { path: "/stationmanagement",   element: <EmployeeRoute><StationManagement /></EmployeeRoute> },
  { path: "/maintanencelogging",  element: <EmployeeRoute><MaintanenceLogging /></EmployeeRoute> },
  { path: "/station-analytics" ,  element: <EmployeeRoute><StationAnalytics /></EmployeeRoute> },
  { path: "/maintenancedashboard",element: <EmployeeRoute><MaintenanceDashboard /></EmployeeRoute> },

  // ── ADMIN pages (NO RideStatusBar) ──
  { path: "/admindashboard",        element: <AdminRoute><AdminDashboard /></AdminRoute> },
  { path: "/adminstation",          element: <AdminRoute><AdminStationManagement /></AdminRoute> },
  { path: "/customermanagement",    element: <AdminRoute><CustomerManagement /></AdminRoute> },
  { path: "/cyclefleetmanagement",  element: <AdminRoute><CycleFleetManagement /></AdminRoute> },
  { path: "/rentaltransaction",     element: <AdminRoute><RentalTransactionManagement /></AdminRoute> },
  { path: "/paymentmanagement",     element: <AdminRoute><PaymentManagement /></AdminRoute> },
  { path: "/employeemanagement",    element: <AdminRoute><EmployeeManagement /></AdminRoute> },
  { path: "/feedback",              element: <AdminRoute><FeedbackRatings /></AdminRoute> },
  { path: "/alert",                 element: <AdminRoute><AlertManagement /></AdminRoute> },
  { path: "/maintanaceoverview",    element: <AdminRoute><MaintenanceOverview /></AdminRoute> },
  { path: "/revenue", element: <AdminRoute><RevenueManagement /></AdminRoute> },


  { path: "*", element: <div>404 Page Not Found</div> },
]);

function App() {
  return (
    <RouterProvider
      router={router}
      future={{ v7_startTransition: true }}
    />
  );
}

export default App;