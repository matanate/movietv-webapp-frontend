import React from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

const AddTitlePage = () => {
  return (
    <Container className="form-signin w-100 m-auto">
      <h1 className="h3 mb-3 fw-normal">Add new Title:</h1>
      <Form action="/select-title">
        <Form.Group className="form-floating">
          <Form.Control as="select" name="movie-or-tv">
            <option value="movie">Movie</option>
            <option value="tv">Tv Show</option>
          </Form.Control>
          <Form.Label htmlFor="InputEmail">Choose Category</Form.Label>
        </Form.Group>

        <Form.Group className="form-floating">
          <Form.Control type="text" name="search-term" placeholder="Password" />
          <Form.Label>Search term</Form.Label>
        </Form.Group>

        <Button className="btn btn-primary w-100 my-2 py-2" type="submit">
          Find Title
        </Button>
      </Form>
    </Container>
  );
};

export default AddTitlePage;
