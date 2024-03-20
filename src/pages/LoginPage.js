import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import AuthContext from "../context/AuthContext";

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);

  return (
    <Container className="form-signin w-100 m-auto">
      <h1 className="h3 mb-3 fw-normal">Please Sign In</h1>
      <Form onSubmit={loginUser}>
        <Form.Group className="form-floating">
          <Form.Control
            type="email"
            id="email"
            name="email"
            placeholder="name@example.com"
          />
          <Form.Label htmlFor="InputEmail">Email address</Form.Label>
        </Form.Group>

        <Form.Group className="form-floating">
          <Form.Control
            type="password"
            id="password"
            name="password"
            placeholder="Password"
          />
          <Form.Label htmlFor="InputPassword">Password</Form.Label>
        </Form.Group>

        <Button className="btn btn-primary w-100 my-2 py-2" type="submit">
          Sign In
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;
