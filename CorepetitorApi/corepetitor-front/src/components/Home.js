import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Label, Table, Card, CardBody, CardTitle, Container, Row, Col, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            tutors: [],
            tutor: {},
            tutorId: 0,
            newTutorData: {
                id: 0,
                name: '',
                email: '',
                password: '',
                phoneNumber: '',
                address: '',
                city: '',
            },
            toast: { show: false, message: '', variant: 'success' },
            confirmDeleteId: null,
            showAddConfirm: false
        };
    }

    componentDidMount() {
        this.fetchAllTutors();
    }

    showToast = (message, variant = 'success') => {
        this.setState({ toast: { show: true, message, variant } });
        setTimeout(() => {
            this.setState({ toast: { ...this.state.toast, show: false } });
        }, 3000);
    };

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
                this.showToast('Failed to fetch tutors', 'danger');
            }
        } catch (error) {
            this.showToast('Error fetching tutors', 'danger');
        }
    };

    handleInputChange = (field, value) => {
        this.setState((prevState) => ({
            newTutorData: {
                ...prevState.newTutorData,
                [field]: value,
            },
        }));
    };

    addOrUpdateTutor = async () => {
        this.setState({ showAddConfirm: false });

        const { newTutorData } = this.state;
        const method = newTutorData.id ? 'PUT' : 'POST';
        const url = newTutorData.id
            ? `https://localhost:7014/api/Tutors/${newTutorData.id}`
            : 'https://localhost:7014/api/Tutors';

        const payload = { ...newTutorData };

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                this.fetchAllTutors();
                this.showToast(`Tutor ${newTutorData.id ? 'updated' : 'added'} successfully!`);
                this.setState({ newTutorData: { id: 0, name: '', email: '', password: '', phoneNumber: '', address: '', city: '' } });
            } else {
                this.showToast(`Failed to ${newTutorData.id ? 'update' : 'add'} tutor`, 'danger');
            }
        } catch (error) {
            this.showToast('Server error during tutor save', 'danger');
        }
    };

    confirmDelete = (id) => {
        this.setState({ confirmDeleteId: id });
    };

    deleteTutor = async () => {
        const { confirmDeleteId } = this.state;
        try {
            const response = await fetch(`https://localhost:7014/api/Tutors/${confirmDeleteId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (response.ok) {
                this.fetchAllTutors();
                this.showToast('Tutor deleted successfully');
            } else {
                this.showToast('Failed to delete tutor', 'danger');
            }
        } catch (error) {
            this.showToast('Error deleting tutor', 'danger');
        } finally {
            this.setState({ confirmDeleteId: null });
        }
    };

    render() {
        const { tutors, newTutorData, toast, confirmDeleteId, showAddConfirm } = this.state;

        return (
            <Container className="py-4">
                {toast.show && (
                    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
                        <div className={`toast show text-white bg-${toast.variant} border-0`}>
                            <div className="d-flex">
                                <div className="toast-body">{toast.message}</div>
                            </div>
                        </div>
                    </div>
                )}

                <h2 className="text-center mb-4">Admin Panel – Manage Tutors</h2>

                <Card className="mb-4">
                    <CardBody>
                        <CardTitle tag="h5">Add / Update Tutor</CardTitle>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Name</Label>
                                    <Input value={newTutorData.name} onChange={(e) => this.handleInputChange('name', e.target.value)} />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Email</Label>
                                    <Input type="email" value={newTutorData.email} onChange={(e) => this.handleInputChange('email', e.target.value)} />
                                </FormGroup>
                                {!newTutorData.id && (
                                    <FormGroup>
                                        <Label>Password</Label>
                                        <Input type="password" value={newTutorData.password} onChange={(e) => this.handleInputChange('password', e.target.value)} />
                                    </FormGroup>
                                )}
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Phone</Label>
                                    <Input value={newTutorData.phoneNumber} onChange={(e) => this.handleInputChange('phoneNumber', e.target.value)} />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Address</Label>
                                    <Input value={newTutorData.address} onChange={(e) => this.handleInputChange('address', e.target.value)} />
                                </FormGroup>
                                <FormGroup>
                                    <Label>City</Label>
                                    <Input value={newTutorData.city} onChange={(e) => this.handleInputChange('city', e.target.value)} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Button color="primary" onClick={() => this.setState({ showAddConfirm: true })}>
                            {newTutorData.id ? 'Update' : 'Add'} Tutor
                        </Button>
                    </CardBody>
                </Card>

                <h4>All Tutors</h4>
                <Table striped responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>City</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tutors.map((t) => (
                            <tr key={t.id}>
                                <td>{t.id}</td>
                                <td>{t.name}</td>
                                <td>{t.email}</td>
                                <td>{t.phoneNumber}</td>
                                <td>{t.city}</td>
                                <td>
                                    <Button
                                        size="sm"
                                        color="info"
                                        className="me-2"
                                        onClick={() => this.setState({ newTutorData: { ...t, password: '' } })}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        color="danger"
                                        onClick={() => this.confirmDelete(t.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Confirm Delete Modal */}
                <Modal isOpen={confirmDeleteId !== null} toggle={() => this.setState({ confirmDeleteId: null })}>
                    <ModalHeader>Confirm Deletion</ModalHeader>
                    <ModalBody>Are you sure you want to delete this tutor?</ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.deleteTutor}>Yes, Delete</Button>{' '}
                        <Button color="secondary" onClick={() => this.setState({ confirmDeleteId: null })}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                {/* Confirm Add/Update Modal */}
                <Modal isOpen={showAddConfirm} toggle={() => this.setState({ showAddConfirm: false })}>
                    <ModalHeader>Confirm {newTutorData.id ? 'Update' : 'Addition'}</ModalHeader>
                    <ModalBody>
                        Are you sure you want to {newTutorData.id ? 'update' : 'add'} this tutor?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.addOrUpdateTutor}>Yes, {newTutorData.id ? 'Update' : 'Add'}</Button>{' '}
                        <Button color="secondary" onClick={() => this.setState({ showAddConfirm: false })}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        );
    }
}

export default Home;
