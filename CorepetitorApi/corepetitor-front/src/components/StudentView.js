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
            if (email == '')
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
        this.getStudentByEmail();
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
        const { isLoading, modules, selectedModule, showModal} = this.state;
        return (
            <div>
                <h1>Student view page</h1>
                <Button variant="primary" onClick={this.handleRedirectToSearchPage} disabled={isLoading}>
                    {isLoading ? (
                        <span>
                            <Spinner animation="border" size="sm" /> Redirecting...
                        </span>
                    ) : (
                        'Find a new tutor'
                    )}
                </Button>
                <h2>My Modules</h2>          
                <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>PricePerHour</th>
                                <th>Tutor id</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modules.map((module) => (
                                <tr key={module.id}>
                                    <td>{module.name}</td>
                                    <td>{module.description}</td>
                                    <td>{module.pricePerHour}</td>
                                    <td>{module.tutorId}</td>
                                    <td>
                                        <Button variant="primary" onClick={() => this.handleShowModal(module)}>Select</Button>
                                    </td>
                                    <td>
                                        <Button variant="secondary" onClick={() => this.handleRemoveStudentFromModule(module)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ModuleModalStudent module={selectedModule} show={showModal} handleClose={this.handleCloseModal} />
            </div>
        );
    }
}

export default StudentViewPage;