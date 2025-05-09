import React, { Component } from 'react';
import { Modal, Button, Form, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import ModuleChat from './ModuleChat';
import ModuleModalStudent from './ModuleModalStudent';
import ReactStars from 'react-rating-stars-component';

class StudentViewPage extends Component {
    state = {
        isLoading: false,
        modules: [],
        student: {},
        showModal: false,
        selectedModule: {},
        showToast: false,
        toastMessage: '',
        showConfirmModal: false,
        pendingRemoval: null,
        showChat: false,
        chatModuleId: null,
        chatTutorId: null,
        ratings: {},
        submittingRating: false,
    };

    componentDidMount() {
        setTimeout(() => {
            this.getStudentByEmail();
        }, 200);
    }

    getStudentByEmail = async () => {
        try {
            const email = localStorage.getItem('userEmail');
            if (email === '') return;

            const response = await fetch(`https://localhost:7014/api/StudentInfo/by-email?email=${email}`);
            if (response.ok) {
                const student = await response.json();
                this.setState({ student }, () => {
                    this.fetchAllModules();
                });
            } else {
                alert(`Failed to fetch student by email ${email}: ` + response.status);
            }
        } catch (error) {
            alert(`Error fetching student by email`, error);
        }
    };

    fetchAllModules = async () => {
        try {
            const { student } = this.state;
            const response = await fetch(`https://localhost:7014/api/StudentModules/with-tutor?studentId=${student.id}`);
            if (response.ok) {
                const modules = await response.json();
                console.log({modules});
                this.setState({ modules }, () => {
                    setTimeout(() => {
                        this.fetchExistingRatings();
                    }, 100); // Delay of 100ms
                });                
            } else {
                alert('Failed to fetch modules: ' + response.status);
            }
        } catch (error) {
            alert('Error fetching modules: ' + error);
        }
    };

    handleShowModal = (module, tutor) => {
        this.setState({ showModal: true, selectedModule: { ...module, tutor } });
    };

    handleCloseModal = () => {
        this.setState({ showModal: false });
    };

    handleRedirectToSearchPage = () => {
        this.setState({ isLoading: true });
        setTimeout(() => {
            window.location.href = '/tutor-search';
        }, 500);
    };

    handleRemoveStudentFromModule = async () => {
        try {
            const { student, pendingRemoval } = this.state;
            const { module, tutor } = pendingRemoval;

            const response = await fetch(`https://localhost:7014/api/tutors/${tutor.id}/modules/${module.id}/Students/remove/${student.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.setState({ showConfirmModal: false, pendingRemoval: null });
                this.fetchAllModules();
                this.showToast('Successfully removed from module', 'success');
            } else {
                this.showToast('Failed to remove student from module: ' + response.status, 'danger');
            }
        } catch (error) {
            this.showToast('Error removing student from module: ' + error, 'danger');
        }
    };

    handleOpenChat = (moduleId, tutorId) => {
        this.setState({ showChat: true, chatModuleId: moduleId, chatTutorId: tutorId});
    };
      
    handleCloseChat = () => {
        this.setState({ showChat: false, chatModuleId: null, chatTutorId: null });
    };
      
    fetchExistingRatings = async () => {
        const { student, modules } = this.state;
      
        const ratings = {};
        console.log({modules});
        for (const entry of modules) {
          const moduleId = entry.module.id;
          const tutorId = entry.tutor.id;

      
          try {
            const response = await fetch(
              `https://localhost:7014/api/TutorModules/${moduleId}/ratings?tutorId=${tutorId}&studentId=${student.id}`
            );
      
            if (response.ok) {
              const rating = await response.json();
              ratings[moduleId] = rating;
            }
          } catch (error) {
            console.warn(`Could not fetch rating for module ${moduleId}`);
          }
        }
      
        this.setState({ ratings });
      };
      

      handleRatingSubmit = async ({ tutorId, moduleId, rating }) => {
        const { student } = this.state;
      
        if (!rating || rating < 1 || rating > 5) {
            this.showToast(`Please provide a valid rating between 1 and 5`, 'danger');
            return;
        }
      
        this.setState({ submittingRating: true });
      
        try {
          const response = await fetch('https://localhost:7014/api/TutorModules/submit-rating', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              studentId: student.id,
              tutorId,
              moduleId,
              rating: parseFloat(rating),
            }),
          });
      
          if (response.ok) {
            this.showToast('Rating submitted successfully!', 'success');
          } else {
            const errorText = await response.text();
            this.showToast(`Failed to submit rating: ${errorText}`, 'danger');
          }
        } catch (error) {
            this.showToast(`Failed to submit rating: ${error.message}`, 'danger');
        } finally {
          this.setState({ submittingRating: false });
        }
      };
      


      showToast = (message, variant = 'success') => {
        this.setState({ showToast: true, toastMessage: message, toastVariant: variant });
        setTimeout(() => this.setState({ showToast: false }), 3000);
      };
      

    render() {
        const { isLoading, modules, selectedModule, showModal, showToast, toastMessage, showConfirmModal } = this.state;

        return (
            <div className="container py-5">
                <h2 className="text-center mb-4">Welcome to Your Dashboard</h2>

                <div className="d-flex justify-content-center mb-4">
                    <Button
                        variant="primary"
                        onClick={this.handleRedirectToSearchPage}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Redirecting...
                            </>
                        ) : (
                            'Find a New Tutor'
                        )}
                    </Button>
                </div>

                <h4 className="mb-3">Your Enrolled Modules</h4>

                {modules.length === 0 ? (
                    <p className="text-muted text-center">You are not enrolled in any modules yet.</p>
                ) : (
                    <div className="row">
                        {modules.map(({ module, tutor }) => (
                            module && (
                                <div className="col-md-6 col-lg-4 mb-4" key={module.id}>
                                    <div className="card h-100 d-flex flex-column shadow-sm">
                                        <div className="card-body d-flex flex-column flex-grow-1">
                                            <h5 className="card-title">{module.name}</h5>
                                            <p className="card-text text-muted">{module.description}</p>
                                            <p className="mb-1"><strong>Price/hour:</strong> €{module.pricePerHour}</p>
                                            <p className="mb-1"><strong>Tutor:</strong> {tutor?.name} ({tutor?.city})</p>
                                            <p className="mb-3"><strong>Email:</strong> {tutor?.email}</p>
                                            <div className="bg-light p-3 rounded mt-3 border">
                                            <h6 className="mb-2 text-dark">⭐ Rate Your Tutor</h6>

                                            {this.state.ratings[module.id] !== undefined && (
                                                <p className="mb-1 text-muted">
                                                Your Current Rating: <strong>{this.state.ratings[module.id].toFixed(1)}</strong> / 5
                                                </p>
                                            )}

                                            <div className="d-flex align-items-center mb-2">
                                                <ReactStars
                                                count={5}
                                                size={28}
                                                isHalf={true}
                                                value={parseFloat(this.state.ratings[module.id] || 0)}
                                                activeColor="#ffd700"
                                                onChange={(newValue) =>
                                                    this.setState((prevState) => ({
                                                    ratings: {
                                                        ...prevState.ratings,
                                                        [module.id]: newValue,
                                                    },
                                                    }))
                                                }
                                                />
                                            </div>

                                            <Button
                                                variant="warning"
                                                size="sm"
                                                onClick={() =>
                                                this.handleRatingSubmit({
                                                    tutorId: tutor.id,
                                                    moduleId: module.id,
                                                    rating: this.state.ratings[module.id],
                                                })
                                                }
                                                disabled={this.state.submittingRating}
                                            >
                                                {this.state.submittingRating ? 'Submitting...' : 'Submit Rating'}
                                            </Button>
                                            </div>



                                            <div className="mt-4 d-flex justify-content-between align-items-center gap-2 flex-wrap">
                                                <Button
                                                    variant="primary"
                                                    className="flex-fill"
                                                    onClick={() => this.handleShowModal(module, tutor)}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    variant="outline-primary"
                                                    className="flex-fill"
                                                    onClick={() => this.handleOpenChat(module.id, tutor.id)}
                                                >
                                                    Chat
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    className="flex-fill"
                                                    onClick={() => this.setState({ showConfirmModal: true, pendingRemoval: { module, tutor } })}
                                                >
                                                    Remove
                                                </Button>
                                            </div>

                                        </div>
                                    </div>
                                    

                                </div>
                            )
                        ))}
                    </div>
                )}

                <ModuleModalStudent
                    module={selectedModule}
                    show={showModal}
                    handleClose={this.handleCloseModal}
                />

                <Modal show={showConfirmModal} onHide={() => this.setState({ showConfirmModal: false, pendingRemoval: null })} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Removal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to remove yourself from this module?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ showConfirmModal: false, pendingRemoval: null })}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={this.handleRemoveStudentFromModule}>
                            Remove
                        </Button>
                    </Modal.Footer>
                </Modal>

                <ToastContainer className="p-3" position="top-end">
                    <Toast show={showToast} bg={this.state.toastVariant || 'success'} onClose={() => this.setState({ showToast: false })} delay={3000} autohide>
                        <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                    </Toast>

                </ToastContainer>

                <ModuleChat
                    moduleId={this.state.chatModuleId}
                    senderId={this.state.student.id} 
                    senderRole="student"             
                    show={this.state.showChat}
                    onClose={this.handleCloseChat}
                    studentId={this.state.student.id}
                    tutorId={this.state.chatTutorId}
                />

            </div>
        );
    }
}

export default StudentViewPage;
