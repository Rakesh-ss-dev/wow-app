import { Route, BrowserRouter as Router, Routes } from "react-router";
import AppLayout from "./layout/AppLayout";
import UserLayout from "./layout/UserLayout";
import AuthLayout from "./layout/AuthLayout";
import SignIn from "./pages/AuthPages/SignIn";
import UserLogin from "./pages/AuthPages/UserLogin";
import Blank from "./pages/Blank";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import RequestList from "./pages/Requests/RequestList";
import UserDataTableRes from "./pages/UserDataTable/UserDataTableRes";
import CreateRequest from "./pages/Requests/CreateRequest";
import CreateCoach from "./pages/UserDataTable/CreateCoach";
import Report_Form from "./pages/Report_Form";
import Payment_successful from "./pages/OtherPage/Payment_successful";
import { useEffect } from "react";
import PendingRequestList from "./pages/Requests/PendingRequests";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import HealthReportForm from "./pages/ClientPages/HealthReportForm";
import HealthReportsList from "./pages/ClientPages/HealthReportsList";
import ClientProfile from "./pages/ClientProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import ClientDetails from "./components/UserProfile/ClientDetails";
import PendingInstallment from "./pages/Requests/PendingInstallment";

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

export default function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const publicRoutes = ["/", "/user", "/payment_success"];

    if (publicRoutes.includes(location.pathname)) return;

    if (token) {
      fetch(`${SERVER_URL}/auth/check-token`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) handleLogout();
        })
        .catch(() => handleLogout());
    } else handleLogout();

    function handleLogout() {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }, [location.pathname]);

  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<SignIn />} />
          <Route path="/user" element={<UserLogin />} />
          <Route path="/payment_success" element={<Payment_successful />} />
        </Route>

        <Route element={<ProtectedRoute allowedRole="user"><AppLayout /></ProtectedRoute>}>
          <Route path="/user-dashboard" element={<Blank />} />
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/requests" element={<RequestList />} />
          <Route path="/pending_requests" element={<PendingRequestList />} />
          <Route path="/create-request" element={<CreateRequest />} />
          <Route path="/generate-report" element={<Report_Form />} />
          <Route path="/coaches" element={<UserDataTableRes />} />
          <Route path="/create-coach" element={<CreateCoach />} />
          <Route path="/client-details/:userId" element={<ClientDetails />} />
          <Route path="/installments" element={<PendingInstallment />} />
        </Route>

        <Route element={<ProtectedRoute allowedRole="patient"><UserLayout /></ProtectedRoute>}>
          <Route path="/patient-dashboard" element={<UserDashboard />} />
          <Route path="/add-report" element={<HealthReportForm />} />
          <Route path="/view-reports" element={<HealthReportsList />} />
          <Route path="/view-profile" element={<ClientProfile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
