import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            tutors: [],
            tutor: {},
            tutorId: 0,
            newTutorData: {
                name: '',
                email: '',
                password: '',
                phoneNumber: '',
                address: '',
                city: '',
            },
        };
    }

    fetchAllTutors = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://localhost:7014/api/Tutors', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const tutors = await response.json();
                this.setState({ tutors });
            } else {
                alert('Failed to fetch tutors: ' + response.status);
            }
        } catch (error) {
            alert('Error fetching tutors: ' + error);
        }
    };

    fetchTutorById = async () => {
        try {
            const { tutorId } = this.state;

            if (tutorId < 0) {
                alert('Tutor ID cannot be negative.');
                return;
            }

            const token = localStorage.getItem('token');
            const response = await fetch(`https://localhost:7014/api/Tutors/${tutorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const tutor = await response.json();
                this.setState({ tutor });
            } else {
                alert(`Failed to fetch tutor with ID ${tutorId}: ` + response.status);
            }
        } catch (error) {
            alert(`Error fetching tutor by ID`, error);
        }
    };

    handleTutorIdChange = (event) => {
        const tutorId = parseInt(event.target.value, 10);
        this.setState({ tutorId });
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
                throw new Error(response.status);
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
                throw new Error(response.status);
            }
        } catch (error) {
            console.error('Error updating tutor:', error);
            alert(`Failed to update tutor: ${error.message}`);
        }
    };

    deleteTutor = async (id) => {
        try {
            const response = await fetch(`https://localhost:7014/api/Tutors/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                this.fetchAllTutors();
                console.log(`Tutor with ID ${id} deleted successfully`);
            } else {
                throw new Error(response.status);
            }
        } catch (error) {
            console.error('Error deleting tutor:', error);
            alert(`Failed to delete tutor: ${error.message}`);
        }
    };

    render() {
        const { tutors, tutor, tutorId } = this.state;

        return (
            <div>
                <div className="mb-4">
                    <h2>Choose Action</h2>
                    <Button color="primary" className="mr-2" onClick={this.fetchAllTutors}>
                        Fetch All Tutors
                    </Button>
                </div>

                <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                    <h2>All Tutors</h2>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Address</th>
                                    <th>City</th>
                                    {/* Add other properties as needed */}
                                </tr>
                            </thead>
                            <tbody>
                                {tutors.map((tutor) => (
                                    <tr key={tutor.id}>
                                        <td>{tutor.id}</td>
                                        <td>{tutor.name}</td>
                                        <td>{tutor.email}</td>
                                        <td>{tutor.phoneNumber}</td>
                                        <td>{tutor.address}</td>
                                        <td>{tutor.city}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                </div>

                <Form inline>
                    <FormGroup className="mr-2">
                        <Label for="tutorIdInput" className="mr-2">
                            Tutor ID:
                        </Label>
                        <Input
                            type="number"
                            id="tutorIdInput"
                            value={tutorId}
                            onChange={this.handleTutorIdChange}
                            style={{ width: '80px' }}
                        />
                    </FormGroup>
                    <Button color="primary" onClick={this.fetchTutorById}>
                        Fetch Tutor by ID
                    </Button>
                </Form>

                <div>
                    <h2>Specific Tutor</h2>
                    {Object.keys(tutor).length !== 0 ? (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Address</th>
                                    <th>City</th>
                                    {/* Add other properties as needed */}
                                </tr>
                            </thead>
                            <tbody>  
                                    <tr key={tutor.id}>
                                        <td>{tutor.id}</td>
                                        <td>{tutor.name}</td>
                                        <td>{tutor.email}</td>
                                        <td>{tutor.phoneNumber}</td>
                                        <td>{tutor.address}</td>
                                        <td>{tutor.city}</td>
                                    </tr>
                            </tbody>
                        </table>
                    ) : (
                        <p>No specific tutor found.</p>
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
                <div>
                    <h2>Delete Tutor</h2>
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
                        </FormGroup>
                        <Button color="danger" onClick={() => this.deleteTutor(tutorId)}>
                            Delete Tutor
                        </Button>
                    </Form>
                </div>

            </div>
        );
    }
}
