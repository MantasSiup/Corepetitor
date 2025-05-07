import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true,
            userRole: null
        };
    }

    componentDidMount() {
        // Fetch user role
        this.getUserRole();
    }

    async getUserRole() {
        try {
            const email = localStorage.getItem('userEmail'); // Assuming you have the user email stored in local storage
            const response = await fetch(`https://localhost:7014/api/Auth/role?userEmail=${email}`);
            console.log(response);
            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    this.setState({ userRole: data.role });
                } else {
                    console.error('Response is not in JSON format');
                    // Handle the response that is not in JSON format
                    // For example, set a default user role or log a message
                }
            } else {
                console.error('Failed to fetch user role:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
        }
    }

    handleLogout = () => {
        window.location.href = '/about';
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        const { userRole } = this.state;
        const token = localStorage.getItem('token');

        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
                    <NavbarBrand tag={Link} to="/">Corepetitor</NavbarBrand>
                    <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                    <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                        <ul className="navbar-nav flex-grow">
                            {userRole === 'admin' && (
                                <>
                                    <NavItem>
                                        <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink tag={Link} className="text-dark" to="/modules">Modules</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink tag={Link} className="text-dark" to="/students">Students</NavLink>
                                    </NavItem>
                                </>
                            )}
                            {userRole === 'student' && (
                                <>
                                   
                                    <NavItem>
                                        <NavLink tag={Link} className="text-dark" to="/studentView">StudentView</NavLink>
                                    </NavItem>
                                </>
                            )}
                            {userRole === 'tutor' && (
                                <>
                                   
                                    <NavItem>
                                        <NavLink tag={Link} className="text-dark" to="/modules">Modules</NavLink>
                                    </NavItem>
                                </>
                            )}
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/about">About</NavLink>
                            </NavItem>
                           
                            {!token && (
                                <>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/login">Login</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/register">Register</NavLink>
                                </NavItem>
                             </>
                            )}
                            {token && (
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/about" onClick={this.handleLogout}>Logout</NavLink>
                                </NavItem>
                            )}
                            
                        </ul>
                    </Collapse>
                </Navbar>
            </header>
        );
    }
}
