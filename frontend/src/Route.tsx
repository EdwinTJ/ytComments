import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import AuthOptions from "./components/AuthOptions";
import Account from "./Pages/Account";
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
        path: "/videos",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/account",
        element: <Account />,
      },
    ],
  },
]);

export default router;
