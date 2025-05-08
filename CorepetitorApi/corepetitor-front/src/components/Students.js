import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';

export class Students extends Component {
    static displayName = Students.name;

    constructor(props) {
        super(props);
        this.state = {
            tutors: [],
            modules: [],
            students: [],
            selectedTutorId: 0,
            selectedModuleId: 0,
            selectedStudent: null,
            searchEmail: '',
            showModal: false,
            confirmDelete: false,
            alert: { show: false, message: '', color: 'success' },
        };
    }

    showAlert = (message, color = 'success') => {
        this.setState({ alert: { show: true, message, color } });
        setTimeout(() => {
            this.setState({ alert: { show: false, message: '', color: 'success' } });
        }, 3000);
    };

    componentDidMount() {
        this.fetchAllTutors();
    }

    fetchAllTutors = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://localhost:7014/api/Tutors', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const tutors = await response.json();
                this.setState({ tutors });
            } else {
                this.showAlert('Failed to fetch tutors.', 'danger');
            }
        } catch (error) {
            this.showAlert('Error fetching tutors.', 'danger');
        }
    };

    fetchModulesForTutor = async (tutorId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://localhost:7014/api/Tutors/${tutorId}/Modules`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const modules = await response.json();
                this.setState({ modules });
            } else {
                this.showAlert('Failed to fetch modules.', 'danger');
            }
        } catch (error) {
            this.showAlert('Error fetching modules.', 'danger');
        }
    };

    fetchStudentsForModule = async () => {
        const { selectedTutorId, selectedModuleId } = this.state;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://localhost:7014/api/Tutors/${selectedTutorId}/Modules/${selectedModuleId}/Students`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const students = await response.json();
                this.setState({ students });
                this.showAlert('Students fetched successfully.');
            } 
            else if(response.status === 404)
                {
                    this.showAlert('There are no students for this module', 'danger');
                } 
            else {
                this.showAlert('Failed to fetch students.', 'danger');
            }
        } catch (error) {
            this.showAlert('Error fetching students.', 'danger');
        }
    };

    fetchStudentByEmail = async () => {
        const { searchEmail } = this.state;
        try {
            const response = await fetch(`https://localhost:7014/api/Auth/get-by-email?email=${encodeURIComponent(searchEmail)}`);
            if (response.ok) {
                const student = await response.json();
                this.setState({ selectedStudent: student, showModal: true });
            } else {
                this.showAlert('Student not found.', 'warning');
            }
        } catch (error) {
            this.showAlert('Error searching student.', 'danger');
        }
    };

    updateStudent = async () => {
        const { selectedStudent, selectedTutorId, selectedModuleId} = this.state;
        if (!selectedTutorId || !selectedModuleId) {
            this.showAlert('Cannot update student without module context.', 'warning');
            return;
        }
        try {
            const response = await fetch(`https://localhost:7014/api/Tutors/${selectedTutorId}/Modules/${selectedModuleId}/Students/${selectedStudent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(selectedStudent),
            });
            if (response.ok) {
                this.showAlert('Student updated successfully.');
                this.setState({ showModal: false });
                this.fetchStudentsForModule();
            } else {
                this.showAlert('Failed to update student.', 'danger');
            }
        } catch (error) {
            this.showAlert('Error updating student.', 'danger');
        }
    };

    deleteStudent = async () => {
        const { selectedStudent, selectedTutorId, selectedModuleId } = this.state;
        const hasContext = selectedTutorId && selectedModuleId;
        const url = hasContext
            ? `https://localhost:7014/api/Tutors/${selectedTutorId}/Modules/${selectedModuleId}/Students/${selectedStudent.id}`
            : null;
        if (!url) {
            this.showAlert('Cannot delete student without tutor/module context.', 'danger');
            return;
        }
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (response.ok) {
                this.showAlert('Student deleted successfully.');
                this.setState({ showModal: false, confirmDelete: false });
                this.fetchStudentsForModule();
            } else {
                this.showAlert('Failed to delete student.', 'danger');
            }
        } catch (error) {
            this.showAlert('Error deleting student.', 'danger');
        }
    };

    unlinkStudent = async () => {
        const { selectedStudent, selectedTutorId, selectedModuleId } = this.state;
        if (!selectedTutorId || !selectedModuleId) {
            this.showAlert('Cannot unlink student without tutor/module context.', 'warning');
            return;
        }
        try {
            const response = await fetch(`https://localhost:7014/api/Tutors/${selectedTutorId}/Modules/${selectedModuleId}/Students/remove/${selectedStudent.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (response.ok) {
                this.showAlert('Student unlinked from module.');
                this.setState({ showModal: false });
                this.fetchStudentsForModule();
            } else {
                this.showAlert('Failed to unlink student.', 'danger');
            }
        } catch (error) {
            this.showAlert('Error unlinking student.', 'danger');
        }
    };

    handleStudentInputChange = (field, value) => {
        this.setState((prevState) => ({
            selectedStudent: { ...prevState.selectedStudent, [field]: value },
        }));
    };

    handleTutorChange = (event) => {
        const selectedTutorId = parseInt(event.target.value);
        this.setState({ selectedTutorId, selectedModuleId: 0, modules: [], students: [] });
        this.fetchModulesForTutor(selectedTutorId);
    };

    handleModuleChange = (event) => {
        const selectedModuleId = parseInt(event.target.value);
        this.setState({ selectedModuleId });
    };

    openStudentModal = (student) => {
        this.setState({ selectedStudent: student, showModal: true, confirmDelete: false });
    };

    render() {
        const {
            tutors,
            modules,
            students,
            selectedTutorId,
            selectedModuleId,
            searchEmail,
            selectedStudent,
            showModal,
            confirmDelete,
            alert
        } = this.state;

        return (
            <div className="container py-4">
                <h2 className="mb-4">Student Management</h2>

                {alert.show && (
                    <Alert color={alert.color} className="position-fixed top-0 end-0 m-3" style={{ zIndex: 1050 }}>
                        {alert.message}
                    </Alert>
                )}

                <Form className="mb-3">
                    <FormGroup>
                        <Label for="tutorSelect">Select Tutor</Label>
                        <Input type="select" id="tutorSelect" value={selectedTutorId} onChange={this.handleTutorChange}>
                            <option value={0}>-- Choose a tutor --</option>
                            {tutors.map((tutor) => (
                                <option key={tutor.id} value={tutor.id}>
                                    {tutor.name} ({tutor.email})
                                </option>
                            ))}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="moduleSelect">Select Module</Label>
                        <Input type="select" id="moduleSelect" value={selectedModuleId} onChange={this.handleModuleChange} disabled={selectedTutorId === 0}>
                            <option value={0}>-- Choose a module --</option>
                            {modules.map((mod) => (
                                <option key={mod.id} value={mod.id}>{mod.name}</option>
                            ))}
                        </Input>
                    </FormGroup>
                    <Button color="primary" disabled={selectedModuleId === 0} onClick={this.fetchStudentsForModule}>
                        Fetch Students
                    </Button>
                </Form>

                <Form inline className="mb-4">
                    <Input
                        type="email"
                        value={searchEmail}
                        placeholder="Search student by email"
                        onChange={(e) => this.setState({ searchEmail: e.target.value })}
                    />
                    <Button color="info" className="ms-2" onClick={this.fetchStudentByEmail}>
                        Search
                    </Button>
                </Form>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>City</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{student.phoneNumber}</td>
                                <td>{student.address}</td>
                                <td>{student.city}</td>
                                <td>
                                    <Button color="warning" size="sm" className="me-2" onClick={() => this.openStudentModal(student)}>Edit</Button>
                                    <Button color="danger" size="sm" onClick={() => this.setState({ selectedStudent: student, showModal: true, confirmDelete: true })}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Modal isOpen={showModal} toggle={() => this.setState({ showModal: false, confirmDelete: false })}>
                    <ModalHeader toggle={() => this.setState({ showModal: false, confirmDelete: false })}>Student Details</ModalHeader>
                    <ModalBody>
                        {confirmDelete ? (
                            <p>Are you sure you want to delete this student?</p>
                        ) : selectedStudent ? (
                            <Form>
                                {['name', 'email', 'phoneNumber', 'address', 'city'].map((field) => (
                                    <FormGroup key={field}>
                                        <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                                        <Input
                                            type="text"
                                            value={selectedStudent[field] || ''}
                                            onChange={(e) => this.handleStudentInputChange(field, e.target.value)}
                                        />
                                    </FormGroup>
                                ))}
                            </Form>
                        ) : (
                            <p>No student data available.</p>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        {confirmDelete ? (
                            <>
                                <Button color="danger" onClick={this.deleteStudent}>Confirm Delete</Button>
                                <Button color="secondary" onClick={() => this.setState({ confirmDelete: false })}>Cancel</Button>
                            </>
                        ) : (
                            <>
                                <Button color="warning" onClick={this.updateStudent} disabled={!selectedTutorId || !selectedModuleId}>Update</Button>
                                <Button color="secondary" onClick={this.unlinkStudent} disabled={!selectedTutorId || !selectedModuleId}>Unlink from Module</Button>
                                <Button color="secondary" onClick={() => this.setState({ showModal: false })}>Close</Button>
                            </>
                        )}
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Students;
