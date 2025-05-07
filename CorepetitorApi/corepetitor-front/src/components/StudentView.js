import React, { Component } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import ModuleModalStudent from './ModuleModalStudent';

class StudentViewPage extends React.Component {
    state = {
        isLoading: false,
        modules: [],
        student: {},
        showModal: false,
        selectedModule: {},
    };

    handleShowModal = (module) => {
        this.setState({ showModal: true, selectedModule: module });
    }

    handleCloseModal = () => {
        this.setState({ showModal: false });
    }

    handleRedirectToSearchPage = () => {
        this.setState({ isLoading: true });
        setTimeout(() => {
            window.location.href = '/tutor-search';
        }, 500); 
    };

    getStudentByEmail = async () => {
        try {
            const email = localStorage.getItem('userEmail');
            if (email === '')
                return;
            const response = await fetch(`https://localhost:7014/api/Auth/get-by-email?email=${email}`, {
            });
            if (response.ok) {
                const student = await response.json();
                this.setState({ student }, () => {
                    this.fetchAllModules();
                });
                console.log(student);
            } else {
                alert(`Failed to fetch student by email ${email}: ` + response.status);
            }
        } catch (error) {
            alert(`Error fetching student by email`, error);
        }
    };

    componentDidMount() {
        setTimeout(() => {
        this.getStudentByEmail();
        },200)
    }

    fetchAllModules = async () => {
        try {
            const { student } = this.state;
            console.log(student.id);
            const response = await fetch(`https://localhost:7014/api/StudentModules/id?id=${student.id}`);

            if (response.ok) {
                const modules = await response.json();
                this.setState({ modules });
            } else {
                alert('Failed to fetch modules: ' + response.status);
            }
        } catch (error) {
            alert('Error fetching modules: ' + error);
        }
    };

    handleRemoveStudentFromModule = async (module) => {
        try {
            const { student } = this.state;
            const response = await fetch(`https://localhost:7014/api/tutors/${module.tutorId}/modules/${module.id}/Students/remove/${student.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('Student removed from module:', student.id);
                this.fetchAllModules();
            } else {
                alert('Failed to remove student from module: ' + response.status);
            }
        } catch (error) {
            alert('Error removing student from module: ' + error);
        }
    };



    render() {
        const { isLoading, modules, selectedModule, showModal } = this.state;
    
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
                        {modules.map((module) => (
                            <div className="col-md-6 col-lg-4 mb-4" key={module.id}>
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{module.name}</h5>
                                        <p className="card-text text-muted">
                                            {module.description}
                                        </p>
                                        <p className="mb-1"><strong>Price/hour:</strong> €{module.pricePerHour}</p>
                                        <p className="mb-3"><strong>Tutor ID:</strong> {module.tutorId}</p>
                                        <div className="mt-auto d-flex justify-content-between">
                                            <Button
                                                variant="primary"
                                                onClick={() => this.handleShowModal(module)}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                onClick={() => this.handleRemoveStudentFromModule(module)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
    
                <ModuleModalStudent
                    module={selectedModule}
                    show={showModal}
                    handleClose={this.handleCloseModal}
                />
            </div>
        );
    }    
}

export default StudentViewPage;