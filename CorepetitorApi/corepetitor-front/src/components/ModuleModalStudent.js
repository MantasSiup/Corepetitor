import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ModuleModalStudent = ({ module, show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Module Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Name:</strong> {module.name}</p>
                <p><strong>Description:</strong> {module.description}</p>
                <p><strong>Price per Hour:</strong> {module.pricePerHour}</p>
                <p><strong>Start date:</strong> {module.startDate}</p>
                <p><strong>End date:</strong> {module.endDate}</p>
                <p><strong>Tutor ID:</strong> {module.tutorId}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModuleModalStudent;
