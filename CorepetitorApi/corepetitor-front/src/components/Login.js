import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getUserRoleFromToken } from '../helpers/authHelper';
import { withRouter } from '../withRouter'; 

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoginModal: false,
            email: '',
            password: '',
            errors: {},
            toast: {
                show: false,
                message: '',
                variant: '', // 'success' or 'danger'
            }
        };
    }

    handleShowLoginModal = () => {
        this.setState({ showLoginModal: true });
    };

    handleHideLoginModal = () => {
        this.setState({ showLoginModal: false });
    };

    validateForm = () => {
        const { email, password } = this.state;
        const errors = {};
    
        if (!email) {
            errors.email = "Email is required.";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.email = "Please enter a valid email address.";
            }
        }
    
        if (!password) {
            errors.password = "Password is required.";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters long.";
        }
    
        this.setState({ errors });
    
        return Object.keys(errors).length === 0;
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
    
        // Clear the error for the field being edited
        this.setState((prevState) => ({
            [name]: value,
            errors: {
                ...prevState.errors,
                [name]: ''
            }
        }));
    };
    
    showToast = (message, variant = 'success') => {
        this.setState({
            toast: {
                show: true,
                message,
                variant
            }
        });
    
        setTimeout(() => {
            this.setState({ toast: { ...this.state.toast, show: false } });
        }, 3000); // toast disappears after 3 seconds
    };
    

    handleLogin = async () => {
        if (!this.validateForm()) {
            return; // Stop if validation fails
        }

        try {
            const response = await fetch('https://localhost:7014/api/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                }),
            });

            if (response.ok) {
                const responseData = await response.json();

                // Save token
                localStorage.setItem('token', responseData.token);
                localStorage.setItem('userEmail', this.state.email);
               
                console.log('Login successful');
                this.showToast('Login successful!', 'success');
                setTimeout(() => {
                const role = getUserRoleFromToken();
                if (role === 'student') {
                    this.props.navigate('/studentView');
                } else if (role === 'tutor') {
                    this.props.navigate('/modules');
                } else if (role === 'admin') {
                    this.props.navigate('/');
                } else {
                    this.props.navigate('/');
                }
                console.log("Decoded role:", role);
                this.handleHideLoginModal();
                window.location.reload(); // Optional, only if needed
                }, 1500);

            } else {
                console.error('Login failed', response.statusText);
                this.showToast('Login failed. Please check your credentials.', 'danger');
            }
        } catch (error) {
            console.error('Login failed', error);
            this.showToast('Network error. Please try again later.', 'danger');
        }
    };

    render() {
    const { show, message, variant } = this.state.toast;
        return (
            <>
            {show && (
                <div
                    className={`toast-container position-fixed top-0 end-0 p-3`}
                    style={{ zIndex: 9999 }}
                >
                    <div className={`toast show align-items-center text-white bg-${variant} border-0`} role="alert">
                        <div className="d-flex">
                            <div className="toast-body">
                                {message}
                            </div>
                        </div>
                    </div>
                </div>
            )}            
            <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
                <div className="p-4 border rounded shadow" style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white' }}>
                    <h2 className="text-center mb-4">Welcome back</h2>
                    <p className="text-center text-muted">Please sign in to continue</p>
    
                    <Form>
                    <Form.Group controlId="formBasicEmail" className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={this.state.email}
                            onChange={this.handleInputChange}
                            isInvalid={!!this.state.errors.email}
                        />
                        <Form.Control.Feedback type="invalid" className="fade-in">
                            {this.state.errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword" className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.handleInputChange}
                            isInvalid={!!this.state.errors.password}
                        />

                        <Form.Control.Feedback type="invalid" className="fade-in">
                            {this.state.errors.password}
                        </Form.Control.Feedback>
                    </Form.Group>

    
                        <div className="d-grid mb-2">
                            <Button variant="primary" onClick={this.handleLogin}>
                                Log In
                            </Button>
                        </div>
    
                        <div className="text-center">
                            <Form.Text className="text-muted">
                                Don't have an account? <a href="/register">Register here</a>
                            </Form.Text>
                        </div>
                    </Form>
                </div>
            </div>
            </>
        );
    }    
}

export default withRouter(Login);
