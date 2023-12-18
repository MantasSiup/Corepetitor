import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

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
        };
    }

    fetchAllModules = async () => {
        try {
            const { tutorId } = this.state;
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


    render() {
        const { tutors, tutor, tutorId, moduleId, module, modules } = this.state;

        return (
            <div>
                <h1>Modules!</h1>
                <Label>TutorId</Label>
                <Input
                    type="number"
                    id="tutorIdInput"
                    value={tutorId}
                    onChange={this.handleTutorIdChange}
                    style={{ width: '80px' }}
                />
                <div className="mb-4">
                    <h2>Choose Action</h2>
                    <Button color="primary" className="mr-2" onClick={this.fetchAllModules}>
                        Fetch All Modules
                    </Button>
                </div>

                <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                    <h2>All Modules</h2>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>PricePerHour</th>
                                <th>Start date</th>
                                <th>End date</th>
                                <th>Tutor id</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modules.map((module) => (
                                    <tr key={module.id}>
                                        <td>{module.id}</td>
                                        <td>{module.name}</td>
                                        <td>{module.description}</td>
                                        <td>{module.pricePerHour}</td>
                                        <td>{module.startDate}</td>
                                        <td>{module.endDate}</td>
                                        <td>{module.tutorId}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                </div>
                <div>
                <Form inline>
                    <FormGroup className="mr-2">
                        <Label for="moduleIdInput" className="mr-2">
                            Module ID:
                        </Label>
                        <Input
                            type="number"
                            id="moduleIdInput"
                            value={moduleId}
                            onChange={this.handleModuleIdChange}
                            style={{ width: '80px' }}
                        />
                    </FormGroup>
                    <Button color="primary" onClick={this.fetchModuleById}>
                        Fetch Module by ID
                    </Button>
                    </Form>
                </div>

                <div>
                    <h2>Specific Module</h2>
                    {Object.keys(module).length !== 0 ? (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>PricePerHour</th>
                                    <th>Start date</th>
                                    <th>End date</th>
                                    <th>Tutor id</th>
                                </tr>
                            </thead>
                            <tbody>  
                                <tr key={module.id}>
                                    <td>{module.id}</td>
                                    <td>{module.name}</td>
                                    <td>{module.description}</td>
                                    <td>{module.pricePerHour}</td>
                                    <td>{module.startDate}</td>
                                    <td>{module.endDate}</td>
                                    <td>{module.tutorId}</td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <p>No specific module found.</p>
                    )}
                </div>

                <div>
                    <h2>Add Module</h2>
                    <form>
                        <div>
                            <label>Name:</label>
                            <Input
                                type="text"
                                value={this.state.newModuleData.name}
                                onChange={(e) => this.handleInputChange('name', e.target.value)}
                            />
                            <label>Description:</label>
                            <Input
                                type="text"
                                value={this.state.newModuleData.description}
                                onChange={(e) => this.handleInputChange('description', e.target.value)}
                            />
                            <label>Price per hour:</label>
                            <Input
                                type="number"
                                value={this.state.newModuleData.pricePerHour}
                                onChange={(e) => this.handleInputChange('pricePerHour', e.target.value)}
                            />
                            <label>Start date</label>
                            <Input
                                type="date"
                                value={this.state.newModuleData.startDate}
                                onChange={(e) => this.handleInputChange('startDate', e.target.value)}
                            />
                            <label>End date:</label>
                            <Input
                                type="date"
                                value={this.state.newModuleData.endDate}
                                onChange={(e) => this.handleInputChange('endDate', e.target.value)}
                            />
                            <label>Tutor ID:</label>
                            <Input
                                type="number"
                                value={this.state.newModuleData.tutorId}
                                onChange={(e) => this.handleInputChange('tutorId', e.target.value)}
                            />
                        </div>
                        {/* Add other input fields for properties like email, password, etc. */}
                        <Button color="primary" type="button" onClick={this.addModule}>
                            Add Tutor
                        </Button>
                    </form>
                </div>

                <div>
                    <h2>Update Module</h2>
                    <form>
                        <div>
                            <label>Tutor ID:</label>
                            <Input
                                type="number"
                                value={this.state.newModuleData.tutorId}
                                onChange={(e) => this.handleInputChange('tutorId', e.target.value)}
                            />
                            <Label for="moduleIdInput" className="mr-2">
                                Module ID:
                            </Label>
                            <Input
                                type="number"
                                value={this.state.newModuleData.id}
                                onChange={(e) => this.handleInputChange('id', e.target.value)}
                            />
                            <label>Name:</label>
                            <Input
                                type="text"
                                value={this.state.newModuleData.name}
                                onChange={(e) => this.handleInputChange('name', e.target.value)}
                            />
                            <label>Description:</label>
                            <Input
                                type="text"
                                value={this.state.newModuleData.description}
                                onChange={(e) => this.handleInputChange('description', e.target.value)}
                            />
                            <label>Price per hour:</label>
                            <Input
                                type="number"
                                value={this.state.newModuleData.pricePerHour}
                                onChange={(e) => this.handleInputChange('pricePerHour', e.target.value)}
                            />
                            <label>Start date</label>
                            <Input
                                type="date"
                                value={this.state.newModuleData.startDate}
                                onChange={(e) => this.handleInputChange('startDate', e.target.value)}
                            />
                            <label>End date:</label>
                            <Input
                                type="date"
                                value={this.state.newModuleData.endDate}
                                onChange={(e) => this.handleInputChange('endDate', e.target.value)}
                            />
                            
                        </div>
                        <Button color="primary" type="button" onClick={() => this.updateModule(this.state.newModuleData.tutorId, this.state.newModuleData.id)}>
                            Update Module
                        </Button>
                    </form>
                </div>

                <div>
                    <h2>Delete Module</h2>
                    <Form inline>
                        <FormGroup className="mr-2">
                            <Label for="deleteTutorIdInput" className="mr-2">
                                Tutor ID:
                            </Label>
                            <Input
                                type="number"
                                id="deleteTutorIdInput"
                                value={tutorId}
                                onChange={this.handleTutorIdChange}
                                style={{ width: '80px' }}
                            />
                            <Label for="deleteModuleIdInput" className="mr-2">
                                Module ID:
                            </Label>
                            <Input
                                type="number"
                                id="deleteModuleIdInput"
                                value={moduleId}
                                onChange={this.handleModuleIdChange}
                                style={{ width: '80px' }}
                            />
                        </FormGroup>
                        <Button color="danger" onClick={() => this.deleteModule(tutorId, moduleId)}>
                            Delete Module
                        </Button>
                    </Form>
                </div>
               
            </div>
        );
    }
}
