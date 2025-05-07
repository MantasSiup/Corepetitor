import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const ModuleModal = ({ tutorId, module, students, show, handleClose, showToast }) => {
    const [showDetails, setShowDetails] = useState({});
    const [editable, setEditable] = useState(false); // State to track edit mode
    const [editedModule, setEditedModule] = useState({}); // State to track edited module data
    

    // Function to handle editing of module fields
    const handleEdit = () => {
        setEditable(true); // Enable edit mode
        setEditedModule(module); // Set initial values for edited module
    };

    // Function to handle changes to edited module data
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedModule(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Function to handle saving changes
    const handleSaveChanges = async () => {
        try {
            const response = await fetch(`https://localhost:7014/api/Tutors/${tutorId}/Modules/${module.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(editedModule),
            });

            if (response.status === 204) {
                handleClose();
                showToast('Module successfully updated', 'success');
                console.log('Saving changes:', editedModule);
                setEditable(false); // Disable edit mode after saving changes
            } else {
                showToast(`Failed to update module: ${response.statusText}`, 'danger');
            }
        } catch (error) {
            console.error('Error updating module:', error);
            showToast(`Failed to update module: ${error.message}`, 'danger');
        }
    };


    const handleClosed = () => {
        setEditable(false); // Disable edit mode after saving changes
        handleClose();
    };


    // Function to toggle showing/hiding additional details for a student
    const toggleDetails = (studentId) => {
        setShowDetails(prevState => ({
            ...prevState,
            [studentId]: !prevState[studentId] // Toggle the value for the student ID
        }));
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`https://localhost:7014/api/tutors/${tutorId}/Modules/remove-from-module?moduleId=${module.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.status === 204) {
                showToast('Module removed successfully', 'success');
                handleClose();
                handleRemoveAllStudentsFromModule(module, students);
            } else {
                showToast(`Failed to remove module: ${response.statusText}`, 'danger');
            }
        } catch (error) {
            console.error('Error removing module:', error);
            showToast(`Error removing module: ${error.message}`, 'danger');
        }
    };

    const handleRemoveStudentFromModule = async (module, studentId) => {
        try {
            const response = await fetch(`https://localhost:7014/api/tutors/${tutorId}/modules/${module.id}/Students/remove/${studentId}`, {
                method: 'DELETE',
            });

            if (response.status === 204) {
                handleClose();
                setEditable(false);
                showToast('Student removed successfully', 'success');
            } else {
                showToast('Failed to remove student from module: ' + response.status, 'danger');
            }
        } catch (error) {
            showToast('Error removing student from module: ' + error, 'danger');
        }
    };

    const handleRemoveAllStudentsFromModule = async (module, students) => {
        try {
            students.forEach(async (student) => {
                await handleRemoveStudentFromModule(module, student.id);
            });

            console.log('All students removed from the module successfully');
            showToast('All students removed successfully', 'success');
        } catch (error) {
            showToast('Error removing students from the module:', 'danger');
        }
    };


    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}-${month}-${day}`;
    };
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Module Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formModuleName">
                        <Form.Label>Module Name</Form.Label>
                        <Form.Control type="text"
                            name="name" value={editable ? editedModule.name : module.name}
                            onChange={handleChange}
                            readOnly={!editable}
                        />
                    </Form.Group>
                    <Form.Group controlId="formModuleDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea"
                            rows={3} name="description" value={editable ? editedModule.description : module.description}
                            onChange={handleChange}
                            readOnly={!editable}
                        />
                    </Form.Group>
                    <Form.Group controlId="formModulePrice">
                        <Form.Label>Price per Hour</Form.Label>
                        <Form.Control
                            type="text"
                            name="pricePerHour"
                            value={editable ? editedModule.pricePerHour : module.pricePerHour}
                            onChange={handleChange}
                            readOnly={!editable}
                        />
                    </Form.Group>
                    <Form.Group controlId="formModuleStartDate">
                        <Form.Label>Start date</Form.Label>
                        <Form.Control
                            type="date"
                            name="startDate"
                            value={editable ? formatDate(editedModule.startDate) : formatDate(module.startDate)}
                            onChange={handleChange}
                            readOnly={!editable}
                        />
                    </Form.Group>
                    <Form.Group controlId="formModuleEndDate">
                        <Form.Label>End date</Form.Label>
                        <Form.Control
                            type="date"
                            name="endDate"
                            value={editable ? formatDate(editedModule.endDate) : formatDate(module.endDate)}
                            onChange={handleChange}
                            readOnly={!editable}
                        />
                    </Form.Group>

                </Form>

                {students.length > 0 && (
                    <p><strong>Students:</strong></p>
                )}

                <ul>
                    {students.map(student => (
                        <li key={student.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p>
                                    <strong>Name:</strong> {student.name}
                                    <Button variant="primary" style={{ marginLeft: '35px' }} onClick={() => toggleDetails(student.id)}>
                                        {showDetails[student.id] ? 'Hide' : 'Show'} Details
                                    </Button>
                                    {editable && (
                                        <Button variant="danger" style={{ marginLeft: '20px' }} onClick={() => handleRemoveStudentFromModule(module, student.id)}>
                                        Delete
                                        </Button>
                                    )}
                                    {showDetails[student.id] && (
                                        <>
                                            <p><strong>Email:</strong> {student.email}</p>
                                            <p><strong>Phone Number:</strong> {student.phoneNumber}</p>
                                            <p><strong>Address:</strong> {student.address}</p>
                                        </>
                                    )}
                                    </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </Modal.Body>
            <Modal.Footer>
                {editable ? (
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                ) : (
                    <Button variant="primary" onClick={handleEdit}>
                        Edit
                    </Button>
                )}
                <Button variant="danger" onClick={handleDelete}>
                    Delete
                </Button>
                <Button variant="secondary" onClick={handleClosed}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModuleModal;
