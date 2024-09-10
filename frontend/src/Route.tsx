import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./Pages/Dashboard";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <h1>Hello Video Card</h1>,
      },
      {
        path: "/videos",
        element: <Dashboard />,
      },
    ],
  },
]);

export default router;
