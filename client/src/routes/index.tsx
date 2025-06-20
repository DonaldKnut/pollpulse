import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import CreateRoomPage from "../pages/CreateRoomPage";
import RoomPage from "../pages/RoomPage";
import ResultsPage from "../pages/ResultsPage";
import Layout from "../components/layout/Layout";
import UserProfileWrapper from "@/context/UserProfileWrapper";

const router = createBrowserRouter([
  {
    element: <Layout />, // Wraps pages with header/footer
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/create-room", element: <CreateRoomPage /> },
      { path: "/room/:roomId", element: <RoomPage /> },
      { path: "/profile", element: <UserProfileWrapper /> },
      { path: "/results/:roomId", element: <ResultsPage /> },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
