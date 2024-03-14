import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import CreateReview from "../utils/CreateReview";

const AddReviewForm = ({ titleId, onReviewSubmit }) => {
  let { user, authTokens } = useContext(AuthContext);
  return (
    <Container>
      <Form onSubmit={(e) => CreateReview(e, user, authTokens, onReviewSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Rating</Form.Label>
          <Form.Control
            name="rating"
            type="number"
            min={0}
            max={10}
            step={0.1}
            placeholder="0.0 - 10.0"
          />
          <Form.Label>Comment</Form.Label>
          <Form.Control
            name="comment"
            as="textarea"
            rows={3}
            placeholder="Leave a comment"
          />
          <Form.Control
            type="submit"
            value="Add Review"
            className="btn btn-primary"
          />
          <Form.Control
            type="hidden"
            name="titleId"
            value={titleId}
          ></Form.Control>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default AddReviewForm;
