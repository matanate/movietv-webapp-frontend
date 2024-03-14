import React, { useEffect, useState } from "react";
import DeleteReview from "../utils/DeleteReview";
import UpdateReview from "../utils/UpdateReview";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ToggleButton from "react-bootstrap/ToggleButton";
import Form from "react-bootstrap/Form";
import { BsPersonCircle, BsStarFill, BsClock } from "react-icons/bs";

const ReviewComment = ({ review, user, authTokens, onReviewDeleted }) => {
  const [checked, setChecked] = useState(false);
  const [comment, setComment] = useState(
    <p className="comment-text">{review.comment}</p>
  );
  const [rating, setRating] = useState(review.rating);

  useEffect(() => {
    if (!checked) {
      setComment(<p className="comment-text">{review.comment}</p>);
      setRating(review.rating);
    } else {
      setComment(
        <Form.Control
          name="comment"
          as="textarea"
          rows={3}
          defaultValue={review.comment}
          className="comment-text"
        />
      );
      setRating(
        <Form.Control
          name="rating"
          className="review-rating"
          defaultValue={review.rating}
          type="number"
          min={0}
          max={10}
          step={0.1}
        />
      );
    }
  }, [checked, review]);

  return (
    <Container
      as={checked ? "form" : "div"}
      onSubmit={
        checked
          ? (e) => {
              UpdateReview(
                e,
                review.id,
                authTokens,
                user.user_id,
                onReviewDeleted
              );
              setChecked(false);
            }
          : null
      }
      id={`review-${review.id}`}
      className="comment"
    >
      <div className="img-comment">
        <BsPersonCircle size={50} />
      </div>
      <div className="comment-content">
        <span className="comment-name">{review.author_username} - </span>
        <span className="comment-rating">
          <BsStarFill as="i" color="gold" /> {rating} / 10
        </span>
        <span className="comment-time">
          <BsClock />
          {review.date_posted}
        </span>
      </div>
      <div className="comment-content">
        {comment}
        <div>
          {user && (user.user_id === review.author_id || user.is_staff) && (
            <Button
              variant="danger"
              size="sm"
              className="d-block"
              onClick={() =>
                DeleteReview(review.id, authTokens, onReviewDeleted)
              }
            >
              Delete
            </Button>
          )}
          {!user || (user && !(user.user_id === review.author_id)) ? (
            ""
          ) : !checked ? (
            <ToggleButton
              id={`edit-check-${review.id}`}
              type="checkbox"
              variant="primary"
              checked={checked}
              size="sm"
              className="d-block"
              onChange={(e) => setChecked(e.currentTarget.checked)}
            >
              Edit
            </ToggleButton>
          ) : (
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="d-block"
            >
              Save
            </Button>
          )}
          {checked && (
            <Button
              variant="warning"
              size="sm"
              className="block"
              onClick={(e) => setChecked(e.currentTarget.checked)}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ReviewComment;
