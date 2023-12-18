import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

export class Students extends Component {
    static displayName = Students.name;

    constructor(props) {
        super(props);
        this.state = {
            tutors: [],
            tutor: {},
            modules: [],
            module: {},
            students: [],
            student: {},
            tutorId: 0,
            moduleId: 0,
            studentId: 0,
            newTutorData: {
                id: '',
                name: '',
                email: '',
                password: '',
                phoneNumber: '',
                address: '',
                city: '',
            },
        };
    }

    fetchAllStudents = async () => {
        try {
            const { tutorId, moduleId } = this.state;
            if (tutorId < 0) {
                alert('Tutor ID cannot be negative.');
                return;
            }
            if (moduleId < 0) {
                alert('Module ID cannot be negative.');
                return;
            }
            const token = localStorage.getItem('token');
            const response = await fetch(`https://localhost:7014/api/Tutors/${tutorId}/Modules/${moduleId}/Students`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const students = await response.json();
                this.setState({ students });
            } else {
                alert('Failed to fetch students: ' + response.status);
            }
        } catch (error) {
            alert('Error fetching students: ' + error);
        }
    };

    fetchStudentById = async () => {
        try {
            const { tutorId, moduleId, studentId } = this.state;

            if (tutorId < 0) {
                alert('Tutor ID cannot be negative.');
                return;
            }
            if (moduleId < 0) {
                alert('Tutor ID cannot be negative.');
                return;
            }
            if (studentId < 0) {
                alert('Tutor ID cannot be negative.');
                return;
            }

            const token = localStorage.getItem('token');
            const response = await fetch(`https://localhost:7014/api/Tutors/${tutorId}/Modules/${moduleId}/Students/${studentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.url);

            if (response.ok) {
                const student = await response.json();
                this.setState({ student });
            } else {
                alert(`Failed to fetch student with ID ${moduleId}: ` + response.status);
            }
        } catch (error) {
            alert(`Error fetching student by ID`, error);
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
    handleStudentIdChange = (event) => {
        const studentId = parseInt(event.target.value, 10);
        this.setState({ studentId });
    };

    handleInputChange = (field, value) => {
        this.setState((prevState) => ({
            newTutorData: {
                ...prevState.newTutorData,
                [field]: value,
            },
        }));
    };

    addTutor = async () => {
        try {
            const response = await fetch('https://localhost:7014/api/Tutors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(this.state.newTutorData),
            });

            if (response.ok) {
                this.fetchAllTutors();
                console.log('Tutor added successfully');
            } else {
                throw new Error(`Failed to add tutor: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error adding tutor:', error);
            alert(`Failed to add tutor: ${error.message}`);
        }
    };

    updateTutor = async (id) => {
        try {
            const response = await fetch(`https://localhost:7014/api/Tutors/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(this.state.newTutorData),
            });

            if (response.ok) {
                this.fetchAllTutors();
                console.log(`Tutor with ID ${id} updated successfully`);
            } else {
                throw new Error(`Failed to update tutor: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error updating tutor:', error);
            alert(`Failed to update tutor: ${error.message}`);
        }
    };

    render() {
        const { tutors, tutor, tutorId, moduleId, module, modules, students, student, studentId } = this.state;

        return (
            <div>
                <h1>Students!</h1>
                <Form inline>
                    <FormGroup className="mr-2">
                <Label>TutorId</Label>
                <Input
                    type="number"
                    id="tutorIdInput"
                    value={tutorId}
                    onChange={this.handleTutorIdChange}
                    style={{ width: '80px' }}
                />
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
                <div className="mb-4">
                    <h2>Choose Action</h2>
                    <Button color="primary" className="mr-2" onClick={this.fetchAllStudents}>
                        Fetch All Students
                    </Button>
                </div>

                <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                    <h2>All Modules</h2>
                    <table className="table table-bordered">
                        <thead>
                           <tr>
                               <th>ID</th>
                               <th>Name</th>
                               <th>Email</th>
                               <th>Phone Number</th>
                               <th>Address</th>
                               <th>City</th>
                               <th>Tutor id</th>
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
                                    <td>{student.tutorId}</td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                        <Label for="studentIdInput" className="mr-2">
                            Student ID:
                        </Label>
                        <Input
                            type="number"
                            id="studentIdInput"
                            value={studentId}
                            onChange={this.handleStudentIdChange}
                            style={{ width: '80px' }}
                        />
                </div>
                    <Button color="primary" onClick={this.fetchStudentById}>
                        Fetch Student by ID
                    </Button>
                </Form>

                <div>
                    <h2>Specific Student</h2>
                    {Object.keys(student).length !== 0 ? (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Address</th>
                                    <th>City</th>
                                    <th>Tutor id</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.phoneNumber}</td>
                                    <td>{student.address}</td>
                                    <td>{student.city}</td>
                                    <td>{student.tutorId}</td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <p>No specific student found.</p>
                    )}
                </div>

                <div>
                    <h2>Add Tutor</h2>
                    <form>
                        {/* Input fields for adding a new tutor */}
                        <div>
                            <label>Name:</label>
                            <Input
                                type="text"
                                value={this.state.newTutorData.name}
                                onChange={(e) => this.handleInputChange('name', e.target.value)}
                            />
                            <label>Email:</label>
                            <Input
                                type="email"
                                value={this.state.newTutorData.email}
                                onChange={(e) => this.handleInputChange('email', e.target.value)}
                            />
                            <label>Password:</label>
                            <Input
                                type="text"
                                value={this.state.newTutorData.password}
                                onChange={(e) => this.handleInputChange('password', e.target.value)}
                            />
                            <label>Phone number:</label>
                            <Input
                                type="text"
                                value={this.state.newTutorData.phoneNumber}
                                onChange={(e) => this.handleInputChange('phoneNumber', e.target.value)}
                            />
                            <label>Address:</label>
                            <Input
                                type="text"
                                value={this.state.newTutorData.address}
                                onChange={(e) => this.handleInputChange('address', e.target.value)}
                            />
                            <label>City:</label>
                            <Input
                                type="text"
                                value={this.state.newTutorData.city}
                                onChange={(e) => this.handleInputChange('city', e.target.value)}
                            />
                        </div>
                        {/* Add other input fields for properties like email, password, etc. */}
                        <Button color="primary" type="button" onClick={this.addTutor}>
                            Add Tutor
                        </Button>
                    </form>
                </div>

                {/* Update Tutor Form */}
                <div>
                    <h2>Update Tutor</h2>
                    <form>
                        {/* Input fields for updating an existing tutor */}
                        <div>
                            <Label for="tutorIdInput" className="mr-2">
                                Tutor ID:
                            </Label>
                            <Input
                                type="number"
                                value={this.state.newTutorData.id}
                                onChange={(e) => this.handleInputChange('id', e.target.value)}
                            />
                            <label>Name:</label>
                            <Input
                                type="text"
                                value={this.state.newTutorData.name}
                                onChange={(e) => this.handleInputChange('name', e.target.value)}
                            />
                            <label>Email:</label>
                            <Input
                                type="email"
                                value={this.state.newTutorData.email}
                                onChange={(e) => this.handleInputChange('email', e.target.value)}
                            />
                            <label>Password:</label>
                            <Input
                                type="text"
                                value={this.state.newTutorData.password}
                                onChange={(e) => this.handleInputChange('password', e.target.value)}
                            />
                            <label>Phone number:</label>
                            <Input
                                type="text"
                                value={this.state.newTutorData.phoneNumber}
                                onChange={(e) => this.handleInputChange('phoneNumber', e.target.value)}
                            />
                            <label>Address:</label>
                            <Input
                                type="text"
                                value={this.state.newTutorData.address}
                                onChange={(e) => this.handleInputChange('address', e.target.value)}
                            />
                            <label>City:</label>
                            <Input
                                type="text"
                                value={this.state.newTutorData.city}
                                onChange={(e) => this.handleInputChange('city', e.target.value)}
                            />
                        </div>
                        {/* Add other input fields for properties like email, password, etc. */}
                        <Button color="primary" type="button" onClick={() => this.updateTutor(this.state.newTutorData.id)}>
                            Update Tutor
                        </Button>
                    </form>
                </div>
            </div>
        );
    }
}
