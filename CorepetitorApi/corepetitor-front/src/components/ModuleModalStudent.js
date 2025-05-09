import React, { Component } from 'react';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';

class ModuleModalStudent extends Component {

    render() {
        const { module, show, handleClose } = this.props;

        if (!module) {
            return (
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Module Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="text-muted">No module selected.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
            );
        }


        return (
            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Module Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="mb-4">
                        <Col md={6}>
                            <h5 className="text-dark mb-3">📘 {module.name}</h5>
                            <p className="mb-2"><strong>Description:</strong><br /> {module.description}</p>
                            <p className="mb-2"><strong>Price per hour:</strong> <Badge bg="success">€{module.pricePerHour}</Badge></p>
                            <p className="mb-2"><strong>Start Date:</strong> {new Date(module.startDate).toLocaleDateString()}</p>
                            <p className="mb-2"><strong>End Date:</strong> {new Date(module.endDate).toLocaleDateString()}</p>                        </Col>
                        <Col md={6}>
                            <h6 className="text-primary mb-3">👤 Tutor Information</h6>
                            <p className="mb-2"><strong>Name:</strong> {module.tutor?.name ?? 'Unknown'}</p>
                            <p className="mb-2"><strong>Email:</strong> <a href={`mailto:${module.tutor?.email}`}>{module.tutor?.email}</a></p>
                            <p className="mb-2"><strong>Phone:</strong> {module.tutor?.phoneNumber}</p>
                            <p className="mb-2"><strong>City:</strong> {module.tutor?.city}</p>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ModuleModalStudent;
