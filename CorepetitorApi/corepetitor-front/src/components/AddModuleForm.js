import React from 'react';
import { useState } from 'react';
import { Button, Form, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';





const AddModuleForm = ({ show, handleClose, moduleTutorId }) => {

    const [moduleName, setModuleName] = useState('');
    const [moduleDescription, setModuleDescription] = useState('');
    const [modulePrice, setModulePrice] = useState('');
    const [moduleStartDate, setModuleStartDate] = useState('');
    const [moduleEndDate, setModuleEndDate] = useState('');

    const handleCreateNewModule = async (newModuleData) => {
        try {
            const response = await fetch(`https://localhost:7014/api/Tutors/${newModuleData.tutorId}/Modules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(newModuleData),
            });

            if (response.status === 201) {
                alert('Module added successfully');
            } else {
                throw new Error(`Failed to add module: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error adding module:', error);
            alert(`Failed to add module: ${error.message}`);
        }
    };

    const handleSaveChanges = async () => {
        try {
            const newModuleData = {
                name: moduleName,
                description: moduleDescription,
                pricePerHour: modulePrice,
                startDate: moduleStartDate,
                endDate: moduleEndDate,
                tutorId: moduleTutorId,
            };

            await handleCreateNewModule(newModuleData);
            handleClose();
        } catch (error) {
            console.error('Error adding module:', error);
            alert(`Failed to add module: ${error.message}`);
        }
    };


    return (
        <Modal isOpen={show} toggle={handleClose}>
            <ModalHeader toggle={handleClose}>Add New Module</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="moduleName">Module Name</Label>
                        <Input type="text" name="moduleName" id="moduleName" value={moduleName} onChange={(e) => setModuleName(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="moduleDescription">Module Description</Label>
                        <Input type="textarea" name="moduleDescription" id="moduleDescription" value={moduleDescription} onChange={(e) => setModuleDescription(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="modulePrice">Price per Hour</Label>
                        <Input type="number" name="modulePrice" id="modulePrice" value={modulePrice} onChange={(e) => setModulePrice(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="moduleStartDate">Start date</Label>
                        <Input type="date" name="moduleStartDate" id="moduleStartDate" value={moduleStartDate} onChange={(e) => setModuleStartDate(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="moduleEndDate">End date</Label>
                        <Input type="date" name="moduleEndDate" id="moduleEndDate" value={moduleEndDate} onChange={(e) => setModuleEndDate(e.target.value)} />
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={handleClose}>Close</Button>
                <Button color="primary" onClick={ handleSaveChanges }>Save changes</Button>
            </ModalFooter>
        </Modal>
    );
};

export default AddModuleForm;
