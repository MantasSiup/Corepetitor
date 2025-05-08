import React, { useEffect, useRef, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Button, Modal, Form, Spinner, Toast, ToastContainer } from 'react-bootstrap';

const ModuleChat = ({ moduleId, senderId, senderRole, show, onClose, studentId, tutorId}) => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const messagesEndRef = useRef(null);
    const showRef = useRef(show);

    useEffect(() => {
        showRef.current = show;
    }, [show]);
    
    useEffect(() => {
        if (!show) return;
    
        const connect = new HubConnectionBuilder()
            .withUrl(`https://localhost:7014/chathub?moduleId=${moduleId}&senderId=${senderId}&senderRole=${senderRole}`)
            .withAutomaticReconnect()
            .build();
    
            connect.on('ReceiveMessage', (senderId, role, message, timestamp) => {
                const newMsg = { senderId, role, message, timestamp };
                setTimeout(() => {
                setMessages(prev => {
                    const updated = [...prev, newMsg];
                    console.log("Updated in handler:", updated);
                    return updated;
                });
            },0);
            
                // Correctly check latest modal state
                if (!showRef.current) setShowToast(true);
            });
            
    
        
        fetchMessages();
    
        connect.start()
            .then(() => setConnection(connect))
            .catch(console.error);
    
        return () => {
            connect.stop();
        };
    }, [show]);
    

    const fetchMessages = async () => {
        try {
            const response = await fetch(
                `https://localhost:7014/api/ChatMessage/messages?moduleId=${moduleId}&studentId=${studentId}&tutorId=${tutorId}`
            );
            const data = await response.json();
            const formatted = data.map(msg => ({
                senderId: msg.senderId,
                role: msg.senderRole, // Normalize naming
                message: msg.message,
                timestamp: msg.timestamp
            }));
            setMessages(formatted);

        } catch (error) {
            console.error('Failed to fetch messages', error);
        } finally {
            setLoading(false);
        }
    };
    

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
    
        const recipientId = senderRole === "tutor" ? studentId : tutorId;
        const recipientRole = senderRole === "tutor" ? "student" : "tutor";
    
        try {
            await fetch('https://localhost:7014/api/ChatMessage/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    moduleId,
                    senderId,
                    senderRole,
                    recipientId,
                    recipientRole,
                    message: newMessage
                })
            });
    
            setNewMessage('');
        } catch (err) {
            console.error('Send failed', err);
        }
    };
    
    
    

    const clearChat = () => setMessages([]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            <Modal show={show} onHide={onClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chat for Module #{moduleId}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                    {loading ? <Spinner animation="border" /> : (
                        <div className="chat-messages">
                            {messages.map((msg, i) => (
                                <div key={i} className={`mb-3 d-flex ${msg.senderId === senderId ? 'justify-content-end' : 'justify-content-start'}`}>
                                    <div style={{ maxWidth: '75%' }}>
                                        <div
                                            className="p-2 rounded"
                                            style={{
                                                backgroundColor: msg.senderId === senderId ? '#0d6efd' : '#e9ecef',
                                                color: msg.senderId === senderId ? '#fff' : '#000'
                                            }}
                                        >
                                            <small className="d-block fw-bold mb-1">{msg.role}</small>
                                            <div>{msg.message}</div>
                                            <small className="d-block text-end mt-1" style={{ fontSize: '0.75rem' }}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Form.Control
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        className="me-2"
                    />
                    <Button onClick={sendMessage} variant="primary">Send</Button>
                    <Button onClick={clearChat} variant="outline-danger">Clear</Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer className="p-3" position="bottom-end">
                <Toast bg="info" onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Body>📨 New chat message</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
};

export default ModuleChat;
