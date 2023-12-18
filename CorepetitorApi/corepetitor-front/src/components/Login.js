import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoginModal: false,
            email: '',
            password: '',
        };
    }

    handleShowLoginModal = () => {
        this.setState({ showLoginModal: true });
    };

    handleHideLoginModal = () => {
        this.setState({ showLoginModal: false });
    };

    handleLogin = async () => {
        // Implement your login logic here
        try {
            const response = await fetch('https://localhost:7014/api/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Specify the content type as JSON
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                }),
            });

            if (response.ok) {
                // Handle successful login
                const responseData = await response.json();

                // Save the token to local storage
                localStorage.setItem('token', responseData.token);

                console.log('Login successful');
                // Optionally, provide feedback to the user
                alert('Login successful!');

                // Close the modal
                this.handleHideLoginModal();
            } else {
                // Handle login failure
                console.error('Login failed', response.statusText);
                // Optionally, provide feedback to the user
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Login failed', error);
            // Optionally, provide feedback to the user
            alert('Login failed due to a network error. Please try again later.');
        }
    };

    render() {
        return (
            <div>
                <h1>Login Page</h1>
                <Button variant="primary" onClick={this.handleShowLoginModal}>
                    Open Login Modal
                </Button>

                <Modal show={this.state.showLoginModal} onHide={this.handleHideLoginModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={this.state.email}
                                    onChange={(e) => this.setState({ email: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={this.state.password}
                                    onChange={(e) => this.setState({ password: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleHideLoginModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleLogin}>
                            Login
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default Login;
