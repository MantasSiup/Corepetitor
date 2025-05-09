import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Label, Modal } from 'reactstrap';
import AddModuleForm from './AddModuleForm';
import ModuleModal from './ModuleModal';
import { Students } from './Students';
import ModuleChat from './ModuleChat';


export class Modules extends Component {
    static displayName = Modules.name;

    constructor(props) {
        super(props);
        this.state = {
            tutors: [],
            tutor: {},
            modules: [],
            module: {},
            tutorId: 0,
            moduleId: 0,
            moduleTutorId : 0,
            newModuleData: {
                id: 0,
                name: '',
                description: '',
                pricePerHour: 0,
                startDate: null,
                endDate: null,
                tutorId: 0,
            },
            show: false,
            suggestion: '',
            students: [],
            showModal: false,
            selectedModule: {},
            showForm: false,
            uniqueModules: [],
            toast: { show: false, message: '', variant: 'success' },
            searchQuery: '',
            editingModule: null,
            showChat: false,
            selectedStudent: null,
        };
    }

    handleOpenForm = () => {
        this.setState({ showForm: true });
    };

    handleCloseForm = () => {
        this.setState({ showForm: false });
        this.fetchAllModules();
    };

    fetchAllModules = async () => {
        try {
            const { tutor } = this.state;
            const tutorId = tutor.id;
            if (tutorId < 0) {
                alert('Tutor ID cannot be negative.');
                return;
            }
            const token = localStorage.getItem('token');
            const response = await fetch(`https://localhost:7014/api/Tutors/${tutorId}/Modules`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

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

    getTutorIdByEmail = async () => {
        try {
            const email = localStorage.getItem('userEmail');
            if (email === '')
                return;
            const response = await fetch(`https://localhost:7014/api/Tutors/get-by-email?email=${email}`, {
            });
            if (response.ok) {
                const tutor = await response.json();
                this.setState({ tutor }, () => {
                    this.fetchAllModules();
                });
                console.log(tutor);
            } else {
                alert(`Failed to fetch tutor by email ${email}: ` + response.status);
                localStorage.clear();
                window.location.href='/about';
            }
        } catch (error) {
            alert(`Error fetching tutor by email`, error);
        }
    };

    async componentDidMount() {
        setTimeout(500);
        await this.getTutorIdByEmail();
    }    

    fetchModuleById = async () => {
        try {
            const { tutorId } = this.state;
            const { moduleId } = this.state;

            if (tutorId < 0) {
                alert('Tutor ID cannot be negative.');
                return;
            }
            if (moduleId < 0) {
                alert('Tutor ID cannot be negative.');
                return;
            }

            const token = localStorage.getItem('token');
            const response = await fetch(`https://localhost:7014/api/Tutors/${tutorId}/Modules/${moduleId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.url);

            if (response.ok) {
                const module = await response.json();
                this.setState({ module });
            } else {
                alert(`Failed to fetch module with ID ${moduleId}: ` + response.status);
            }
        } catch (error) {
            alert(`Error fetching module by ID`, error);
        }
    };

    showToast = (message, variant = 'success') => {
        this.setState({
            toast: { show: true, message, variant }
        });
        setTimeout(() => {
            this.setState({ toast: { ...this.state.toast, show: false } });
        }, 3000);
    };    

    handleTutorIdChange = (event) => {
        const tutorId = parseInt(event.target.value, 10);
        this.setState({ tutorId });
    };
    handleModuleIdChange = (event) => {
        const moduleId = parseInt(event.target.value, 10);
        this.setState({ moduleId });
    };

    handleInputChange = (field, value) => {
        this.setState((prevState) => ({
            newModuleData: {
                ...prevState.newModuleData,
                [field]: value,
            },
        }));
    };

    addModule = async () => {
        try {
            const response = await fetch(`https://localhost:7014/api/Tutors/${this.state.newModuleData.tutorId}/Modules`, {                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(this.state.newModuleData),
            });

            if (response.ok) {
                this.fetchAllModules();
                this.showToast('Module added successfully!', 'success');
            } else {
                throw new Error(`Failed to add module: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error adding module:', error);
            alert(`Failed to add module: ${error.message}`);
        }
    };

    updateModule = async (tutorId, moduleId) => {
        try {
            const response = await fetch(`https://localhost:7014/api/Tutors/${tutorId}/Modules/${moduleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(this.state.newModuleData),
            });

            if (response.ok) {
                this.fetchAllModules();
                console.log(`Module with ID ${moduleId} updated successfully`);
                this.showToast('Module was updated successfully!', 'success');
            } else {
                throw new Error(`Failed to update module: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error updating module:', error);
            this.showToast(`Failed to update module: ${error.message}`, 'danger');
        }
    };

    deleteModule = async (id, moduleId) => {
        try {
            const response = await fetch(`https://localhost:7014/api/Tutors/${id}/Modules/${moduleId}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                this.fetchAllModules();
                console.log(`Module with ID ${id} deleted successfully`);
                this.showToast('Module deleted successfully', 'success');
            } else {
                throw new Error(response.status);
            }
        } catch (error) {
            console.error('Error deleting module:', error);
            this.showToast('Error deleting module', 'danger');;
        }
    };

    handleShowModal = (module, tutorId) => {
        this.fetchAllStudents(module, tutorId);
    }

    handleCloseModal = () => {
        this.setState({ showModal: false });
        this.fetchAllModules();
    }

    fetchAllStudents = async (module, tutorId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://localhost:7014/api/Tutors/${tutorId}/Modules/${module.id}/Students`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const students = await response.json();
                this.setState({ students, showModal: true, selectedModule: module });
            } else {
                this.setState({ students:[], showModal: true, selectedModule: module });
            }
        } catch (error) {
            alert('Error fetching students: ' + error);
        }
    };


    fetchAllUniqueModules = async () => {
        try {
            const response = await fetch(`https://localhost:7014/api/UniqueModules`);

            if (response.ok) {
                const uniqueModules = await response.json();
                this.setState({ uniqueModules });
            } else {
                alert('Failed to fetch modules: ' + response.status);
            }
        } catch (error) {
            alert('Error fetching modules: ' + error);
        }
    };


    handleSelectModule = async (tutorId, moduleId) => {
        try {
            const response = await fetch(`https://localhost:7014/api/tutors/${tutorId}/Modules/add-to-module?moduleId=${moduleId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, 
                },
            });

            if (response.ok) {
                console.log('Module added to tutor successfully');
                this.showToast('Module added to tutor!', 'success');
                this.fetchAllModules();
            } else {
                this.showToast('You already have this module.', 'danger');
            }
        } catch (error) {
            console.error('Error adding module to tutor:', error);
        }
    };

    handleSearchChange = (e) => {
        this.setState({ searchQuery: e.target.value });
    };


    handleOpenChat = (student, module) => {
        this.setState({ selectedStudent: student, selectedModule: module, showChat: true });
    };

    handleCloseChat = () => {
        this.setState({ showChat: false, selectedStudent: null });
    };

    render() {
        const {
            tutor,
            modules,
            students,
            selectedModule,
            showModal,
            showForm,
            uniqueModules,
            selectedStudent,
            showChat
        } = this.state;
        const { show, message, variant } = this.state.toast;
        
        return (
        <>
            {show && (
                <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
                  <div className={`toast show text-white bg-${variant} border-0`}>
                    <div className="d-flex">
                      <div className="toast-body">{message}</div>
                    </div>
                  </div>
                </div>
              )}
              
            <div className="container py-5">
                <h2 className="text-center mb-4">Manage Your Modules</h2>
    
                <div className="d-flex justify-content-center mb-4 flex-wrap gap-2">
                    <Button variant="secondary" onClick={this.fetchAllUniqueModules}>
                        Find Existing Modules
                    </Button>
                    <Button variant="success" onClick={this.handleOpenForm}>
                        Add New Module
                    </Button>
                </div>
    
                {/* My Modules Section */}
                <div className="mb-5">
                    <h4 className="mb-3">My Modules</h4>
                    {modules.length === 0 ? (
                        <p className="text-muted">No modules found.</p>
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
                                                    variant="outline-primary"
                                                    onClick={() => this.handleShowModal(module, tutor.id)}>
                                                    View
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
    
                {/* Existing Modules Section */}
                <div className="mb-5">
                    <h4 className="mb-3">Available Modules</h4>
                    {uniqueModules.length === 0 ? (
                        <p className="text-muted">No modules to display. Click "Find Existing Modules" above.</p>
                    ) : (
                        <div className="row">
                            {uniqueModules.map((module) => (
                                <div className="col-md-6 col-lg-4 mb-4" key={module.id}>
                                    <div className="card h-100 shadow-sm">
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">{module.name}</h5>
                                            <p className="card-text text-muted">{module.description}</p>
                                            <p><strong>€{module.pricePerHour}</strong> / hour</p>
                                            <div className="mt-auto">
                                                <Button
                                                    variant="outline-success"
                                                    onClick={() => this.handleSelectModule(tutor.id, module.id)}
                                                >
                                                    Add to My Modules
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
    
                {/* Add Module Form */}
                <AddModuleForm 
                    show={showForm} 
                    handleClose={this.handleCloseForm} 
                    moduleTutorId={tutor.id} 
                    showToast={this.showToast} 
                />
    
                {/* Student Modal */}
                <ModuleModal
                    tutorId={tutor.id}
                    module={selectedModule}
                    students={students}
                    show={showModal}
                    handleClose={this.handleCloseModal}
                    showToast={this.showToast}
                    onStartChat={this.handleOpenChat}
                />
                {showChat && (
                        <ModuleChat
                            moduleId={selectedModule.id}
                            senderId={tutor.id}
                            senderRole="tutor"
                            studentId={selectedStudent.id}
                            tutorId={tutor.id}
                            show={showChat}
                            onClose={this.handleCloseChat}
                        />
                )}
            </div>
            </>
        );
    }
}
export default Modules;