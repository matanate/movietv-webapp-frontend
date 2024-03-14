import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button } from "react-bootstrap";
import AuthContext from "../context/AuthContext";
import { BsStarFill } from "react-icons/bs";
import DeleteTitle from "../utils/DeleteTitle";

const CardsContainer = ({ titles }) => {
  const { user, authTokens, onTitleDelete } = useContext(AuthContext);
  return (
    <Row className="card-container">
      {titles.map((title) => (
        <Col key={title.id} className="my-4">
          <Link
            to={`/${
              title.movie_or_tv === "movie"
                ? "movies"
                : title.movie_or_tv === "tv"
                ? "tv-shows"
                : ""
            }/${title.id}`}
          >
            <Card>
              <div
                className="front"
                style={{ backgroundImage: `url('${title.img_url}')` }}
              >
                <span>{title.movie_or_tv}</span>
              </div>
              <Card.Body className="back">
                <div>
                  <div className="card-title">{title.title}</div>
                  <hr />
                  <BsStarFill color="gold" />
                  <span
                    className={`text-${
                      title.rating > 8
                        ? "success"
                        : title.rating <= 8 && title.rating > 7
                        ? "warning"
                        : "danger"
                    }`}
                  >
                    {title.rating}
                  </span>
                  <hr />
                  {user && user.is_staff && (
                    <Button
                      variant="danger"
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          await DeleteTitle(
                            title.id,
                            authTokens,
                            onTitleDelete
                          );
                        } catch (error) {
                          // Handle errors, e.g., display an error message
                          console.error("Error deleting title:", error);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
};

export default CardsContainer;
