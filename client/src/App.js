import "./App.css";
import AdminRoutes from "./routes/AdminRoutes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes/userRoutes";

function App() {
  return (
    <div>
      <UserRoutes />
      <AdminRoutes />
    </div>
  );
}

export default App;
