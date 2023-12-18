import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Modules } from "./components/Modules";
import { Students } from "./components/Students"

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/modules',
    element: <Modules />
  },
  {
    path: '/students',
    element: <Students />
  },
  {
    path: '/login',
    element: <Login/>
  }
];

export default AppRoutes;
