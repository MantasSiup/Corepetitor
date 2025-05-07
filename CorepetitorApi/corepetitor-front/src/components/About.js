import React from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';

export const About = () => {

    const token = localStorage.getItem('token');
    return (
        <Container className="mt-5">
            <Row className="text-center mb-4">
                <Col>
                    <h1>Welcome to Corepetitor</h1>
                    <p className="lead">
                        Find the perfect tutor and modules tailored to your academic goals —
                        powered by smart AI recommendations.
                    </p>
                    {!token && (
                    <>
                        <Button variant="primary" href="/register" className="me-2">
                            Get Started
                        </Button>
                        <Button variant="outline-secondary" href="/login">
                            Already have an account? Log in
                        </Button>
                    </>
                    )}
                </Col>
            </Row>

            <Row className="text-center">
                <Col md={4}>
                    <Card className="mb-4 h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>📚 Module Matching AI</Card.Title>
                            <Card.Text>
                                Our AI analyzes your learning preferences and matches you
                                with the best modules across various tutors.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="mb-4 h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>👨‍🏫 Verified Tutors</Card.Title>
                            <Card.Text>
                                Every tutor is screened for quality and subject expertise —
                                ensuring reliable and effective learning.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="mb-4 h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>⚡ Smart Search</Card.Title>
                            <Card.Text>
                                Instantly search and filter modules by requested themes and more.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>


            <Row className="text-center mt-5">
                <Col>
                    <h3>Why Corepetitor?</h3>
                    <p>
                        Whether you're a student looking for help or a tutor offering services,
                        Corepetitor bridges the gap using data-driven matching, feedback,
                        and smart scheduling features.
                    </p>
                </Col>
            </Row>

            <Row className="text-center mt-4">
                <Col>
                    <img
                        src="/education.jpg"
                        alt="Tutoring Illustration"
                        className="img-fluid rounded shadow"
                        style={{ maxHeight: '400px' }}
                    />
                </Col>
            </Row>
        </Container>
    );
};

