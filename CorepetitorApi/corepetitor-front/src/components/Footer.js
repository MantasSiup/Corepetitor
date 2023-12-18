import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
    const footerStyle = {
        fontFamily: 'Roboto, sans-serif',
        fontSize: '20px',
        color: '#333',
        marginTop: '20px',
    };

    return (
        <footer style={footerStyle}>
            <Container>
                <p className="text-center">
                    Created by Mantas Siupienius IFF-0/6
                </p>
            </Container>
        </footer>
    );
};

export default Footer;
