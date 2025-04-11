import { Route, BrowserRouter as Router, Routes } from "react-router";
import AppLayout from "./layout/AppLayout";
import AuthLayout from "./layout/AuthLayout";
import SignIn from "./pages/AuthPages/SignIn";
import Blank from "./pages/Blank";
import Calendar from "./pages/Calendar";
import FormElements from "./pages/Forms/FormElements";
import NotFound from "./pages/OtherPage/NotFound";
import BasicTables from "./pages/Tables/BasicTables";
import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";
import UserProfiles from "./pages/UserProfiles";
import RequestList from "./pages/Requests/RequestList";
import UserDataTableRes from "./pages/UserDataTable/UserDataTableRes";
import CreateRequest from "./pages/Requests/CreateRequest";
import CreateCoach from "./pages/UserDataTable/CreateCoach";
import Report_Form from "./pages/Report_Form";
import Payment_successful from "./pages/OtherPage/Payment_successful";
import { useEffect } from "react";
const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
export default function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (location.pathname === "/") return;
    if (token) {
      fetch(`${SERVER_URL}/auth/check-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) handleLogout();
        })
        .catch(() => handleLogout());
    } else {
      handleLogout();
    }

    function handleLogout() {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }, [location.pathname]);

  return (
    <>
      <Router>
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/Dashboard" element={<Blank />} />
            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/requests" element={<RequestList />} />
            <Route path="/create-request" element={<CreateRequest />} />
            <Route path="/generate-report" element={<Report_Form />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/coaches" element={<UserDataTableRes />} />
            <Route path="/create-coach" element={<CreateCoach />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badges" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
          </Route>

          {/* Auth Layout */}
          <Route element={<AuthLayout />}>
            <Route path="/" element={<SignIn />} />
          </Route>
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
          <Route path="/payment_success" element={<Payment_successful />} />
        </Routes>
      </Router>
    </>
  );
}
