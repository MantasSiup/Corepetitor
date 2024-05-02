import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export class TutorSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modules: [],
            showModal: false,
            userInput: '',
        };
    }

    componentDidMount() {
        this.getStudentByEmail();
    }


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

    fetchAllModules = async () => {
        try {
            const response = await fetch(`https://localhost:7014/api/UniqueModules`);

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

    handleShowModal = () => {
        this.setState({ showModal: true });
    };

    handleHideModal = () => {
        this.setState({ showModal: false });
    };

    handleInputChange = (e) => {
        this.setState({ userInput: e.target.value });
    }

    handleModulesFiltering = (responseText: string) => {
        const currentModules = this.state.modules;
        const modulesFromResponse = responseText.split(',').map(module => module.trim());

        const filteredModules = currentModules.filter(module => {
            // Check if the module description exists in the response
            return modulesFromResponse.includes(module.description);
        });

        // Update state to store only the filtered modules
        this.setState({ modules: filteredModules });
        console.log(this.state.modules);
    }

    handleShowSuggestions = () => {
        const UserInput = this.state.userInput; // Assuming you're storing user input in the state variable
        fetch('https://localhost:7014/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ UserInput })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); // Return the response as text
            })
            .then(responseText => {
                // Once the response text is available, handle it
                this.setState({ showModal: false }); // Close the modal
                this.handleModulesFiltering(responseText); // Handle the response text
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    handleSelectModule = async (module) => {
        const { student } = this.state;

        try {
            const response = await fetch(`https://localhost:7014/api/tutors/${module.tutorId}/modules/${module.id}/Students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization token if needed
                    // 'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(student)
            });

            if (response.ok) {
                // Student added successfully, update UI as needed
                console.log('Student added to module:', module.id);
            } else {
                alert('Failed to add student to module: ' + response.status);
            }
        } catch (error) {
            alert('Error adding student to module: ' + error);
        }
    }



    render() {
        const { modules } = this.state;
        return (
            <div>
                <h1>Tutor search page</h1>
                <Button variant="primary" onClick={this.handleShowModal}>
                    Suggest a tutor
                </Button>

                <Modal show={this.state.showModal} onHide={this.handleHideModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>AI tutor suggestion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Let us help suggest you a tutor</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter information about a module you need to learn"
                                    value={this.state.userInput}
                                    onChange={this.handleInputChange}
                                    as="textarea" rows={5}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleShowSuggestions}>
                            Show suggestions
                        </Button>
                    </Modal.Footer>
                </Modal>

                <h2>All Modules</h2>

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
                                    <td><Button variant="primary" onClick={() => this.handleSelectModule(module)}>Select</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default TutorSearch;