import React, { Component } from 'react';
import { Modal, Button, Form, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class ModuleModalStudent extends Component {
    render() {
        const { module, show, handleClose } = this.props;

        return (
            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Module Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {module ? (
                        <div className="px-2">
                            <h5 className="mb-3">{module.name}</h5>
                            <p><strong>Description:</strong> {module.description}</p>
                            <p><strong>Price per hour:</strong> €{module.pricePerHour}</p>
                            <p><strong>Start date:</strong> {new Date(module.startDate).toLocaleDateString()}</p>
                            <p><strong>End date:</strong> {new Date(module.endDate).toLocaleDateString()}</p>
                            <hr />
                            <p><strong>Tutor ID:</strong> {module.tutorId ?? 'Unknown'}</p>
                        </div>
                    ) : (
                        <p className="text-muted">No module selected.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ModuleModalStudent;
