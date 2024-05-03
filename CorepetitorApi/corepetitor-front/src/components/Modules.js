import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Label, Modal } from 'reactstrap';
import AddModuleForm from './AddModuleForm';
import ModuleModal from './ModuleModal';
import { Students } from './Students';

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
            if (email == '')
                return;
            const response = await fetch(`https://localhost:7014/api/Tutors/get-by-email?email=${email}`, {
            });
            if (response.ok) {
                const tutor = await response.json();
                this.setState({ tutor });
                console.log(tutor);
            } else {
                alert(`Failed to fetch tutor by email ${email}: ` + response.status);
            }
        } catch (error) {
            alert(`Error fetching tutor by email`, error);
        }
    };

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
                console.log('Module added successfully');
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
            } else {
                throw new Error(`Failed to update module: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error updating module:', error);
            alert(`Failed to update module: ${error.message}`);
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
            } else {
                throw new Error(response.status);
            }
        } catch (error) {
            console.error('Error deleting module:', error);
            alert(`Failed to delete module: ${error.message}`);
        }
    };

    handleShowModal = (module) => {
        this.fetchAllStudents(module);
    }

    handleCloseModal = () => {
        this.setState({ showModal: false });
        this.fetchAllModules();
    }

    fetchAllStudents = async (module) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://localhost:7014/api/Tutors/${module.tutorId}/Modules/${module.id}/Students`, {
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


    componentDidMount() {
        setTimeout(500);
        this.getTutorIdByEmail();
    }

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
                alert('Module added to tutor successfully');
                this.fetchAllModules();
            } else {
                alert(`Failed to add module becaues you already have it`);
            }
        } catch (error) {
            console.error('Error adding module to tutor:', error);
        }
    };



    render() {
    const { tutors, tutor, tutorId, moduleId, module, modules, students, selectedModule, showModal, showForm, uniqueModules} = this.state;
        return (
            <div>
                <h1>Modules!</h1>
                <div>
                </div>
                <div className="mb-4">
                    <h2>Choose Action</h2>
                    <Button color="primary" className="mr-2" onClick={this.fetchAllModules}>
                        Fetch my modules
                    </Button>
                </div>

                <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                    <h2>My modules</h2>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>PricePerHour</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modules.map((module) => (
                                    <tr key={module.id}>
                                        <td>{module.name}</td>
                                        <td>{module.description}</td>
                                        <td>{module.pricePerHour}</td>
                                        <td>
                                            <Button variant="primary" onClick={() => this.handleShowModal(module)}>Select</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                </div>  

                <div>
                    <button type="button" className="btn btn-primary" onClick={() => this.fetchAllUniqueModules()}>Find existing modules</button>
                </div>

                <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>PricePerHour</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uniqueModules.map((module) => (
                                <tr key={module.id}>
                                    <td>{module.name}</td>
                                    <td>{module.description}</td>
                                    <td>{module.pricePerHour}</td>
                                    <td><Button variant="primary" onClick={() => this.handleSelectModule(tutor.id, module.id)}>Select</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div>
                    <button type="button" className="btn btn-primary" onClick={this.handleOpenForm}>Add Module</button>
                    <AddModuleForm show={showForm} handleClose={this.handleCloseForm} moduleTutorId={ tutor.id } />
                </div>

               
                <ModuleModal tutorId={ tutor.id } module={selectedModule} students={ students } show={showModal} handleClose={this.handleCloseModal} />
            </div>
        );
    }
}
export default Modules;