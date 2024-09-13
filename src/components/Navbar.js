import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const CustomNavbar = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
            <Navbar.Brand href="/">ACONEWS</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/search">Search News</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
};

export default CustomNavbar;