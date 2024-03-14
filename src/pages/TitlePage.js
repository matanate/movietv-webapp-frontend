import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import GetTitle from "../utils/GetTitle";
import AuthContext from "../context/AuthContext";
import ReviewComment from "../components/ReviewComment";
import AddReviewForm from "../components/AddReviewForm";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import { BsStarFill } from "react-icons/bs";

const TitlePage = ({ category }) => {
  const { title_id } = useParams();
  const [title, setTitle] = useState({});
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const { user, authTokens } = useContext(AuthContext);

  const handleReviewSubmit = () => {
    // Toggle the reviewSubmitted state to trigger a re-render
    setReviewSubmitted((prev) => !prev);
  };

  const getRatingColor = () => {
    if (title.rating > 8) {
      return "success";
    } else if (title.ratings <= 8 && title.ratings > 7) {
      return "warning";
    } else {
      return "danger";
    }
  };
  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const titleData = await GetTitle({ title_id: title_id });
        setTitle(titleData);
      } catch (error) {
        console.error("Error fetching title:", error);
      }
    };

    fetchTitle();
  }, [title_id, reviewSubmitted]);

  // Check if title is falsy or movie_or_tv is not equal to category
  if (!title || title.movie_or_tv !== category) {
    return (
      <Container>
        <h1>Title not found</h1>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="featurette">
        <Col md={5} className="order-md-1">
          <Image
            className="featurette-image img-fluid mx-auto rounded"
            alt="500x500"
            style={{ maxWidth: "100%", height: "auto" }}
            src={title.img_url}
            rounded
          />
        </Col>
        <Col md={7} className="order-md-2">
          <h2 className="featurette-heading">
            {title.title} - <BsStarFill as="i" color="gold" />{" "}
            <span className={`text-${getRatingColor()}`}>{title.rating} </span>{" "}
            / 10
          </h2>
          <h4>
            <div className="text-muted">
              {title.release_date} &middot;{" "}
              {Object.values(title.genres)?.join(", ")}
              <p className="lead">{title.overview}</p>
            </div>
          </h4>
          <Container className="reviews-section">
            <h3>Reviews:</h3>
            {!title.reviews.length ? (
              <p>No Reviews to display.</p>
            ) : (
              title.reviews.map((review) => (
                <ReviewComment
                  key={review.id}
                  review={review}
                  user={user}
                  authTokens={authTokens}
                  onReviewDeleted={handleReviewSubmit}
                />
              ))
            )}
          </Container>
          {user &&
            !title.reviews
              .map((review) => review.author_id)
              .includes(user.user_id) && (
              <Container className="add-review-form">
                <h3>Add Reviews:</h3>
                <AddReviewForm
                  titleId={title.id}
                  onReviewSubmit={handleReviewSubmit}
                />
              </Container>
            )}
        </Col>
      </Row>
    </Container>
  );
};

export default TitlePage;
