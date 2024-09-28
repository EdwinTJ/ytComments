import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import AuthOptions from "./components/AuthOptions";
import Account from "./Pages/Account";
import Home from "./Pages/Home";
import AISummary from "./Pages/AISummary";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <AuthOptions />,
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
        path: "/aisummary/:title",
        element: (
          <PrivateRoute>
            <AISummary />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
