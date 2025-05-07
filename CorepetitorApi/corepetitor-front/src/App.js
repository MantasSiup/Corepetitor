import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Students } from './components/Students';
import { About } from './components/About';
import Login from './components/Login';
import Register from './components/Register';
import Modules from './components/Modules';
import StudentView from './components/StudentView';
import TutorSearch from './components/TutorSearch';
import './custom.css';
import { getUserRoleFromToken } from './helpers/authHelper';


export default class App extends Component {
    static displayName = App.name;

    render() {
        const token = localStorage.getItem('token');

        return (
            <Layout>
                <Routes>
                    <Route
                        path="/"
                        element={
                            token ? (
                            getUserRoleFromToken() === 'admin' ? (
                                <Home />
                            ) : getUserRoleFromToken() === 'student' ? (
                                <Navigate to="/studentView" replace />
                            ) : getUserRoleFromToken() === 'tutor' ? (
                                <Navigate to="/modules" replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                            ) : (
                            <About />
                            )
                        }
                    />

                    <Route
                        path="/modules"
                        element={token ? <Modules /> : <Navigate to="/login" replace />}
                    />
                    <Route
                        path="/students"
                        element={token ? <Students /> : <Navigate to="/login" replace />}
                    />
                    <Route
                        path="/login"
                        element={token ? <Navigate to="/" replace /> : <Login />}
                    />
                    <Route
                        path="/register"
                        element={token ? <Navigate to="/" replace /> : <Register />}
                    />
                    <Route path="/about" element={<About />} />
                    <Route path="/studentView" element={<StudentView />} />
                    <Route path="/tutor-search" element={<TutorSearch />} />
                </Routes>
            </Layout>
        );
    }
}
