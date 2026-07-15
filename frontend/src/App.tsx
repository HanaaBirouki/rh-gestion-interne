import ProfilePage from "./pages/ProfilePage";
import LeavesPage from "./pages/LeavesPage";
import DocumentsPage from "./pages/DocumentsPage";
import PayslipsPage from "./pages/PayslipsPage";
import RequestsPage from "./pages/RequestsPage";

export default function App() {
  const path = window.location.pathname;

  if (path === "/leaves") return <LeavesPage />;
  if (path === "/documents") return <DocumentsPage />;
  if (path === "/payslips") return <PayslipsPage />;
  if (path === "/requests") return <RequestsPage />;

  return <ProfilePage />;
}