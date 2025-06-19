import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
