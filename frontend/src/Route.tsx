import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import Account from "./Pages/Account";
import Home from "./Pages/Home";
import AISummary from "./Pages/AISummary";
import VideoById from "./Pages/VideoById";
import ErrorPage from "./Pages/ErrorPage";
import { AuthProvider } from "./context/AuthContext";
import { SummaryProvider } from "./context/SummaryContext";

const ProviderWrapper = () => {
  return (
    <AuthProvider>
      <SummaryProvider>
        <App />
      </SummaryProvider>
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProviderWrapper />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/home",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: "/videos",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/account",
        element: (
          <PrivateRoute>
            <Account />
          </PrivateRoute>
        ),
      },
      {
        path: "/videoById",
        element: (
          <PrivateRoute>
            <VideoById />
          </PrivateRoute>
        ),
      },
      {
        path: "/aisummary/:videoId",
        element: (
          <PrivateRoute>
            <AISummary />
          </PrivateRoute>
        ),
      },
      {
        path: "/error",
        element: <ErrorPage />,
      },
      {
        path: "*",
        element: <Navigate to="/error" replace />,
      },
    ],
  },
]);

export default router;
