import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";

import Login from "./features/login/Login";
import NotFound from "./pages/NotFound";
import Dashboard from "./features/dashboard/Dashboard";
import Quiz from "./features/quiz/Quiz";

// Mendefinisikan struktur rute
const routes: RouteObject[] = [
  {
    path: "/",
    // Redirect halaman utama langsung ke login jika belum ada sesi (sementara)
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/quiz",
    children: [
      {
        path: ":id",
        element: <Quiz />,
      },
    ],
  },
  {
    // Halaman 404 sederhana jika rute tidak ditemukan
    path: "*",
    element: <NotFound />,
  },
];

export const router = createBrowserRouter(routes);
