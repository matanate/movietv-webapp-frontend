import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import SearchResult from "../components/SearchResult";

import { BsPersonCircle } from "react-icons/bs";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

const Header = () => {
  let { user, logoutUser } = useContext(AuthContext);
  return (
    <Container>
      <Navbar expand="lg" className="text-light">
        <Navbar.Brand as={Link} to="/">
          <img
            src="/logo.png"
            alt="site logo"
            width="40"
            height="40"
            className="me-2"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/movies">
              Movies
            </Nav.Link>
            <Nav.Link as={Link} to="/tv-shows">
              Tv Shows
            </Nav.Link>
            {user && user.is_staff && (
              <Nav.Link as={Link} to="/add-title">
                Add New Title
              </Nav.Link>
            )}
          </Nav>
          <Nav className="ml-auto">
            <SearchResult />
            {user ? (
              <NavDropdown
                title={
                  <>
                    <BsPersonCircle size={30} /> {user.username}
                  </>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item onClick={logoutUser}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <ButtonGroup aria-label="Login SignUp buttons">
                <Button variant="outline-light" as={Link} to="/login">
                  Login
                </Button>
                <Button variant="warning" as={Link} to="/signup">
                  SignUp
                </Button>
              </ButtonGroup>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
};

export default Header;
