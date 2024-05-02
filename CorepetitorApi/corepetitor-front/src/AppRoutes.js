import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Modules } from "./components/Modules";
import { Students } from "./components/Students"
import { About } from "./components/About"
import { Navigate } from "react-router-dom";
import StudentView from "./components/StudentView";
import TutorSearch from "./components/TutorSearch";


const token = localStorage.getItem('token');

const AppRoutes = [
    {
        index: true,
        element: token ? <Home /> : <Navigate to="/login" replace />
    },
    {
        path: '/modules',
        element: token ? <Modules /> : <Navigate to="/login" replace />
    },
    {
        path: '/students',
        element: token ? <Students /> : <Navigate to="/login" replace />
    },
    {
        path: '/login',
        element: token ? <Navigate to="/" replace /> : <Login />
    },
    {
        path: '/about',
        element: <About/>
    },
    {
        path: '/studentView',
        element: <StudentView />
    },
    {
        path: '/tutor-search',
        element: <TutorSearch />
    }
];

export default AppRoutes;
