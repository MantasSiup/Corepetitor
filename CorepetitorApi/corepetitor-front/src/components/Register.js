import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getUserRoleFromToken } from '../helpers/authHelper';
import { withRouter } from '../withRouter'; 

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showRegisterModal: false,
            name: '',
            email: '',
            password: '',
            phoneNumber: '', 
            phoneSuffix: '',  
            address: '',
            city: '',
            errors: {},
            submitted: false,
            toast: {
                show: false,
                message: '',
                variant: '', 
            }
        };
    }

    handleShowRegisterModal = () => {
        this.setState({ showRegisterModal: true });
    };

    handleHideRegisterModal = () => {
        this.setState({ showRegisterModal: false });
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
        }, 3000);
    };
    

    validateForm = () => {
        const { name, email, password,  address, city } = this.state;
        let errors = {};
        let formIsValid = true;

        // Check for empty fields
            if (!name) {
                errors.name = "Full Name is required.";
                formIsValid = false;
            }
            if (!email) {
                errors.email = "Email is required.";
                formIsValid = false;
            }
            if (!password) {
                errors.password = "Password is required.";
                formIsValid = false;
            }
            if (!address) {
                errors.address = "Address is required.";
                formIsValid = false;
            }
            if (!city) {
                errors.city = "City is required.";
                formIsValid = false;
            }

            // Check valid email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !emailRegex.test(email)) {
                errors.email = "Please enter a valid email address.";
                formIsValid = false;
            }

            // Password length check
            if (password && password.length < 6) {
                errors.password = "Password must be at least 6 characters long.";
                formIsValid = false;
            }

            // Lithuanian phone number validation
            const phoneRegex = /^\d{8}$/;
            if (!this.state.phoneSuffix || !phoneRegex.test(this.state.phoneSuffix)) {
                errors.phoneNumber = "Please enter 8 digits after +370 (e.g. 60000000).";
                formIsValid = false;
            }

        this.setState({ errors });
        return formIsValid;
    };

    handleRegister = async () => {
        this.setState({ submitted: true }); // Mark the form as submitted
        if (!this.validateForm()) {
            return; // Stop if validation fails
        }

        try {
            const response = await fetch('https://localhost:7014/api/Auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.state.name,
                    email: this.state.email,
                    password: this.state.password,
                    phoneNumber: '+370' + this.state.phoneSuffix,
                    address: this.state.address,
                    city: this.state.city,
                }),
            });

            if (response.ok) {
                const responseData = await response.json();

                // Save the token to local storage
                localStorage.setItem('token', responseData.token);
                localStorage.setItem('userEmail', this.state.email);

                console.log('Registration successful');
                this.showToast('Registration successful! Redirecting...', 'success');
                setTimeout(() => {
                const role = getUserRoleFromToken();
                this.handleHideRegisterModal();
                if (role === 'student') {
                    this.props.navigate('/studentView');
                } else if (role === 'tutor') {
                    this.props.navigate('/modules');
                } else if (role === 'admin') {
                    this.props.navigate('/'); // Home
                } else {
                    this.props.navigate('/'); // Default
                }
                }, 1500)
            } else if (response.status === 409) {
                this.showToast('User with this email already exists.', 'danger');
            } else {
                console.error('Registration failed', response.statusText);
                this.showToast('Registration failed. Please try again.', 'danger');

            }
        } catch (error) {
            console.error('Registration failed', error);
            this.showToast('Network error. Please try again later.', 'danger');
        }
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value }, () => {
            this.validateForm();
        });
    };


    render() {
        const { show, message, variant } = this.state.toast;
        return (
            <>
            {show && (
                <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
                    <div className={`toast show text-white bg-${variant} border-0`} role="alert">
                    <div className="d-flex">
                        <div className="toast-body">
                        {message}
                        </div>
                    </div>
                    </div>
                </div>
            )}
            <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
                <div className="p-4 border rounded shadow" style={{ width: '100%', maxWidth: '500px', backgroundColor: 'white' }}>
                    <h2 className="text-center mb-3">Create Your Account</h2>
                    <p className="text-center text-muted">Join Corepetitor to find your ideal tutor and modules</p>
    
                    <Form>
                        <Form.Group controlId="formName" className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your full name"
                                name="name"
                                value={this.state.name}
                                onChange={this.handleInputChange}
                                isInvalid={this.state.submitted && !!this.state.errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {this.state.errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
    
                        <Form.Group controlId="formEmail" className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={this.state.email}
                                onChange={this.handleInputChange}
                                isInvalid={this.state.submitted && !!this.state.errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {this.state.errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
    
                        <Form.Group controlId="formPassword" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handleInputChange}
                                isInvalid={this.state.submitted && !!this.state.errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {this.state.errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
    
                        <Form.Group controlId="formPhone" className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <div className="d-flex">
                                <Form.Control
                                    type="text"
                                    value="+370"
                                    readOnly
                                    style={{ width: '80px', marginRight: '5px' }}
                                />
                                <Form.Control
                                    type="text"
                                    placeholder="Enter 8 digit number"
                                    name="phoneSuffix"
                                    value={this.state.phoneSuffix}
                                    onChange={this.handleInputChange}
                                    isInvalid={this.state.submitted && !!this.state.errors.phoneNumber}
                                    maxLength="8"
                                />
                            </div>
                            <Form.Control.Feedback type="invalid">
                                {this.state.errors.phoneNumber}
                            </Form.Control.Feedback>
                        </Form.Group>
    
                        <Form.Group controlId="formAddress" className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your address"
                                name="address"
                                value={this.state.address}
                                onChange={this.handleInputChange}
                                isInvalid={this.state.submitted && !!this.state.errors.address}
                            />
                            <Form.Control.Feedback type="invalid">
                                {this.state.errors.address}
                            </Form.Control.Feedback>
                        </Form.Group>
    
                        <Form.Group controlId="formCity" className="mb-4">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your city"
                                name="city"
                                value={this.state.city}
                                onChange={this.handleInputChange}
                                isInvalid={this.state.submitted && !!this.state.errors.city}
                            />
                            <Form.Control.Feedback type="invalid">
                                {this.state.errors.city}
                            </Form.Control.Feedback>
                        </Form.Group>
    
                        <div className="d-grid mb-3">
                            <Button variant="success" onClick={this.handleRegister}>
                                Register
                            </Button>
                        </div>
    
                        <div className="text-center">
                            <Form.Text className="text-muted">
                                Already have an account? <a href="/login">Log in here</a>
                            </Form.Text>
                        </div>
                    </Form>
                </div>
            </div>
            </>
        );
    }    
}

export default withRouter(Register);