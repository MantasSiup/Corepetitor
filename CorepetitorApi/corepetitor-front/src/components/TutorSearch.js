import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export class TutorSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allModules: [],
            modules: [],
            showModal: false,
            userInput: '',
            inputError: ''
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
                this.setState({ modules, allModules: modules });
            } else {
                alert('Failed to fetch modules: ' + response.status);
            }
        } catch (error) {
            alert('Error fetching modules: ' + error);
        }
    };

    handleInputChange = (e) => {
        this.setState({
            userInput: e.target.value,
            inputError: '' // clear on edit
        });
    };
    

    handleShowModal = () => {
        this.setState({ showModal: true });
    };

    handleHideModal = () => {
        this.setState({ showModal: false, userInput: '' });
    };

    handleModulesFiltering = (responseText) => {
        const { allModules } = this.state;
      
        const modulesFromResponse = responseText
          .split(';')
          .map(module => module.trim());
      
        const filteredModules = allModules.filter(module =>
          modulesFromResponse.includes(module.description)
        );
      
        this.setState({ modules: filteredModules });
      };
      

    handleShowSuggestions = () => {
        const UserInput = this.state.userInput; 
        if (!UserInput.trim()) {
            this.setState({ inputError: 'Please enter a description before submitting.' });
            return;
        }

        this.setState({ inputError: '' });
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
                setTimeout(() => {
                    window.location.href = '/studentview';
                }, 500); 
            } else {
                alert('Failed to add student to module: ' + response.status);
            }
        } catch (error) {
            alert('Error adding student to module: ' + error);
        }
    }



    render() {
    const { modules, showModal, userInput, inputError } = this.state;

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Find a Tutor</h2>

            <div className="d-flex justify-content-center mb-4">
                <Button variant="primary" onClick={this.handleShowModal}>
                    Suggest a Tutor with AI
                </Button>
            </div>

            {/* Modal for AI tutor suggestion */}
            <Modal show={showModal} onHide={this.handleHideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>AI Tutor Suggestion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>What would you like help with?</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="userInput"
                                placeholder="E.g. 'I want help with calculus basics'"
                                value={userInput}
                                onChange={this.handleInputChange}
                                isInvalid={!!inputError}
                            />
                            {inputError && (
                                <Form.Text className="text-danger fade-in">
                                    {inputError}
                                </Form.Text>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.handleShowSuggestions}>
                        Show Suggestions
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                <h4>Suggested Modules</h4>
                <Button
                    variant="outline-secondary"
                    onClick={() => this.setState({ modules: this.state.allModules })}
                >
                    Reset Filter
                </Button>
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
                                    <p className="mb-1"><strong>Price/hour:</strong> €{module.pricePerHour}</p>
                                    <p className="mb-3"><strong>Tutor ID:</strong> {module.tutorId}</p>
                                    <div className="mt-auto">
                                        <Button variant="success" onClick={() => this.handleSelectModule(module)}>
                                            Select Module
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
}

export default TutorSearch;