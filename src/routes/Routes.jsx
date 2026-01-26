import { createBrowserRouter } from "react-router-dom";
import SignInPage from "../pages/auth/SignInPage";
import ForgetPassword from "../pages/auth/ForgetPassword";
import VerificationCode from "../pages/auth/VerificationCode";
import ResetPassword from "../pages/auth/ResetPassword";
import MainLayout from "../layout/MainLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import PrivacyPolicy from "../pages/Privacy Policy/PrivacyPolicy";
import TermsCondition from "../pages/Terms Condition/TermsCondition";
import UserDetails from "../pages/userDetails/UserDetails";
import Notifications from "../pages/Notifications/Notifications";
import ProfilePage from "../pages/profile/ProfilePage";
import Reports from "../pages/Reports/Reports";
import Settings from "../pages/Settings/Settings";
import ChangePass from "../pages/profile/ChangePass";
import AboutUs from "../pages/optional/AboutUs";
import EditProfile from "../pages/profile/EditProfile";
import CreateAdmin from "../pages/Create Admin/CreateAdmin";
import AddAdmin from "../pages/Add Admin/AddAdmin";
import PaymentManagement from "../pages/paymentManagement/PaymentManagement";
import Invoices from "../pages/invoices/Invoices";
import Subscriptions from "../pages/subscriptions/Subscriptions";
import Faq from "../pages/Faq/Faq";
import Blog from "../pages/Blog/Blog";
import Coupon from "../pages/Coupon/Coupon";
import Imprint from "../pages/Imprint/Imprint";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/verification-code",
    element: <VerificationCode />,
  },
  {
    path: "/new-password",
    element: <ResetPassword />,
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/user-details",
        element: <UserDetails />,
      },

      {
        path: "/payment-management",
        element: <PaymentManagement />,
      },
      {
        path: "/subscriptions",
        element: <Subscriptions />,
      },
      {
        path: "/faq",
        element: <Faq />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },

      // settings
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/imprint",
        element: <Imprint />,
      },
      {
        path: "/terms-and-condition",
        element: <TermsCondition />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/edit-profile",
        element: <EditProfile />,
      },
      {
        path: "/change-password",
        element: <ChangePass />,
      },
      {
        path: "/about-us",
        element: <AboutUs />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path:"/coupon",
        element: <Coupon />,
      },
      {
        path: "/create-admin",
        element: <CreateAdmin />,
      },
      {
        path: "/add-admin",
        element: <AddAdmin />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/invoices",
        element: <Invoices />,
      }
    ],
  },
]);

export default router;
