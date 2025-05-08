import React, { Component } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';

export class TutorSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allModules: [],
            modules: [],
            showSuggestionModal: false,
            showTutorModal: false,
            selectedModule: null,
            availableTutors: [],
            selectedTutorId: null,
            userInput: '',
            inputError: '',
            student: null,
            loadingTutors: false,
            alert: { show: false, message: '', variant: 'success' },
            studentEnrollments: [],
        };
    }

    componentDidMount() {
        this.getStudentByEmail();
    }

    showAlert = (message, variant = 'success') => {
        this.setState({ alert: { show: true, message, variant } });
        setTimeout(() => {
            this.setState({ alert: { show: false, message: '', variant: 'success' } });
        }, 3000);
    };

    getStudentByEmail = async () => {
        try {
            const email = localStorage.getItem('userEmail');
            if (!email) return;

            const response = await fetch(`https://localhost:7014/api/Auth/get-by-email?email=${email}`);
            if (response.ok) {
                const student = await response.json();
                this.setState({ student }, () => {
                    this.fetchAllModules();
                    this.fetchStudentEnrolledModules();
                });
            } else {
                this.showAlert('Failed to fetch student.', 'danger');
            }
        } catch (error) {
            this.showAlert('Error fetching student.', 'danger');
        }
    };

    fetchAllModules = async () => {
        try {
            const response = await fetch(`https://localhost:7014/api/UniqueModules`);
            if (response.ok) {
                const modules = await response.json();
                this.setState({ modules, allModules: modules });
            }
        } catch (error) {
            this.showAlert('Error fetching modules.', 'danger');
        }
    };

    fetchStudentEnrolledModules = async () => {
        const { student } = this.state;
        try {
            const res = await fetch(`https://localhost:7014/api/StudentModules/with-tutor?studentId=${student.id}`);
            if (res.ok) {
                const modules = await res.json();
                const studentEnrollments = modules.map(m => ({
                    moduleId: m.module.id,
                    tutorId: m.tutor.id
                }));
                this.setState({ studentEnrollments });
            }
        } catch (err) {
            this.showAlert('Failed to fetch enrolled modules.', 'danger');
        }
    };

    handleInputChange = (e) => {
        this.setState({ userInput: e.target.value, inputError: '' });
    };

    handleShowModal = () => {
        this.setState({ showSuggestionModal: true });
    };

    handleHideModal = () => {
        this.setState({ showSuggestionModal: false, userInput: '' });
    };

    handleModulesFiltering = (responseText) => {
        const modulesFromResponse = responseText.split(';').map(m => m.trim());
        const filteredModules = this.state.allModules.filter(module => modulesFromResponse.includes(module.description));
        this.setState({ modules: filteredModules });
    };

    handleShowSuggestions = () => {
        const { userInput } = this.state;
        if (!userInput.trim()) {
            this.setState({ inputError: 'Please enter a description.' });
            return;
        }

        fetch('https://localhost:7014/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserInput: userInput })
        })
            .then(res => res.text())
            .then(responseText => {
                this.setState({ showSuggestionModal: false });
                this.handleModulesFiltering(responseText);
            })
            .catch(error => this.showAlert('Error using AI suggestion.', 'danger'));
    };

    handleOpenTutorModal = async (module) => {
        this.setState({ selectedModule: module, showTutorModal: true, loadingTutors: true });
        try {
            const res = await fetch(`https://localhost:7014/api/TutorModules/module/${module.id}/tutors`);
            if (res.ok) {
                const tutors = await res.json();
                this.setState({ availableTutors: tutors, loadingTutors: false });
            } else {
                this.setState({ availableTutors: [], loadingTutors: false });
                this.showAlert('No tutors found for this module.', 'warning');
            }
        } catch (err) {
            this.setState({ loadingTutors: false });
            this.showAlert('Error fetching tutors.', 'danger');
        }
    };

    handleSelectTutor = (tutorId) => {
        this.setState({ selectedTutorId: tutorId });
    };

    handleEnrollStudent = async () => {
        const { selectedTutorId, selectedModule, student, studentEnrollments } = this.state;
        if (!selectedTutorId || !student) return;

        const alreadyEnrolled = studentEnrollments.some(
            (e) => e.moduleId === selectedModule.id && e.tutorId === selectedTutorId
        );

        if (alreadyEnrolled) {
            this.showAlert("You're already enrolled with this tutor for this module.", "warning");
            return;
        }

        try {
            const res = await fetch(`https://localhost:7014/api/tutors/${selectedTutorId}/modules/${selectedModule.id}/students`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            });

            if (res.ok) {
                this.setState(prev => ({
                    showTutorModal: false,
                    selectedTutorId: null,
                    studentEnrollments: [...prev.studentEnrollments, { moduleId: selectedModule.id, tutorId: selectedTutorId }]
                }));
                this.showAlert('Successfully enrolled.', 'success');
                setTimeout(() => {
                    window.location.href = '/studentview';
                }, 300);
            } else {
                const errText = await res.text();
                this.showAlert('Enrollment failed: ' + errText, 'danger');
            }
        } catch (err) {
            this.showAlert('Error enrolling student.', 'danger');
        }
    };

    render() {
        const {
            modules, allModules, showSuggestionModal, showTutorModal, userInput, inputError,
            availableTutors, selectedTutorId, selectedModule, loadingTutors,
            alert, studentEnrollments
        } = this.state;

        return (
            <div className="container py-5">
                {alert.show && (
                    <Alert variant={alert.variant} className="position-fixed top-0 end-0 m-3" style={{ zIndex: 1050 }}>
                        {alert.message}
                    </Alert>
                )}

                <h2 className="text-center mb-4">Find a Tutor</h2>

                <div className="d-flex justify-content-center mb-4">
                    <Button variant="primary" onClick={this.handleShowModal}>Suggest a Tutor with AI</Button>
                </div>

                <Modal show={showSuggestionModal} onHide={this.handleHideModal} centered>
                    <Modal.Header closeButton><Modal.Title>AI Tutor Suggestion</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>What would you like help with?</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="E.g. 'I want help with calculus basics'"
                                value={userInput}
                                onChange={this.handleInputChange}
                                isInvalid={!!inputError}
                            />
                            {inputError && <Form.Text className="text-danger">{inputError}</Form.Text>}
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleHideModal}>Cancel</Button>
                        <Button variant="primary" onClick={this.handleShowSuggestions}>Show Suggestions</Button>
                    </Modal.Footer>
                </Modal>

                <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                    <h4>Suggested Modules</h4>
                    <Button variant="outline-secondary" onClick={() => this.setState({ modules: allModules })}>Reset Filter</Button>
                </div>

                {modules.length === 0 ? (
                    <p className="text-center text-muted">No modules available. Try searching with AI!</p>
                ) : (
                    <div className="row">
                        {modules.map((module) => (
                            <div className="col-md-6 col-lg-4 mb-4" key={module.id}>
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{module.name}</h5>
                                        <p className="card-text text-muted">{module.description}</p>
                                        <p><strong>€{module.pricePerHour}</strong> / hour</p>
                                        <div className="mt-auto">
                                            <Button
                                                variant="success"
                                                onClick={() => this.handleOpenTutorModal(module)}
                                            >
                                                Select Module
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Modal show={showTutorModal} onHide={() => this.setState({ showTutorModal: false, selectedTutorId: null })} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Select a Tutor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {loadingTutors ? (
                            <div className="text-center my-3"><Spinner animation="border" /></div>
                        ) : availableTutors.length === 0 ? (
                            <p>No tutors available for this module.</p>
                        ) : (
                            <Form.Group>
                                <Form.Label>Select a tutor for <strong>{selectedModule?.name}</strong>:</Form.Label>
                                <div className="d-flex flex-column gap-3">
                                    {availableTutors.map((tutor) => {
                                        const isEnrolled = studentEnrollments.some(
                                            e => e.moduleId === selectedModule?.id && e.tutorId === tutor.id
                                        );

                                        return (
                                            <div
                                                key={tutor.id}
                                                onClick={() => !isEnrolled && this.handleSelectTutor(tutor.id)}
                                                className={`border rounded p-3 shadow-sm tutor-card ${
                                                    selectedTutorId === tutor.id ? 'selected' : ''
                                                } ${isEnrolled ? 'bg-light text-muted' : ''}`}
                                                style={{ cursor: isEnrolled ? 'not-allowed' : 'pointer' }}
                                            >
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h6 className="mb-1">{tutor.name}</h6>
                                                        <p className="mb-1 text-muted">{tutor.city}</p>
                                                        <p className="mb-1 small">Email: {tutor.email}</p>
                                                    </div>
                                                    <div className="text-end">
                                                        {tutor.averageRating != null ? (
                                                            <>
                                                                <span className="text-warning" style={{ fontSize: '1.2rem' }}>⭐</span>
                                                                <strong>{tutor.averageRating.toFixed(1)}</strong> / 5
                                                            </>
                                                        ) : (
                                                            <span className="text-muted small">Not yet rated</span>
                                                        )}
                                                        {isEnrolled && (
                                                            <div className="text-danger small mt-1">Already Enrolled</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Form.Group>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ showTutorModal: false, selectedTutorId: null })}>Cancel</Button>
                        <Button variant="primary" onClick={this.handleEnrollStudent} disabled={!selectedTutorId}>Confirm Selection</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default TutorSearch;
