import React, { useContext, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Row,
  Col,
  Container,
  Card,
  Button,
  Nav,
  Spinner,
} from "react-bootstrap";
import AuthContext from "../context/AuthContext";
import AxiosContext from "../context/AxiosContext";
import { BsStarFill } from "react-icons/bs";
import DeleteTitle from "../utils/DeleteTitle";
import GetTitles from "../utils/GetTitles";

const CardsContainer = ({
  category,
  isHomePage = false,
  searchTerm = null,
  titlesPerPage = 10,
}) => {
  let { user } = useContext(AuthContext);
  let { useAxios } = useContext(AxiosContext);
  let api = useAxios();

  const [titles, setTitles] = useState(null);
  const [titleDeleted, setTitleDeleted] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageNumber, setPageNumber] = useState(
    parseInt(searchParams.get("page")) || 1
  );

  const handleTitleDelete = () => {
    // Toggle the reviewSubmitted state to trigger a re-render
    setTitleDeleted((prev) => !prev);
  };

  const adjustPageNumber = (amount) => {
    setSearchParams({ page: pageNumber + amount });
    setPageNumber((prev) => {
      return prev + amount;
    });
  };

  useEffect(() => {
    const fetchTitles = async () => {
      const fetchedTitles = await GetTitles({
        movieOrTv: category,
        titlesPerPage: titlesPerPage,
        pageNumber: pageNumber,
        searchTerm: searchTerm,
        api: api,
      });
      setTitles(fetchedTitles);
    };

    fetchTitles();
  }, [titleDeleted, pageNumber, category, searchTerm]);

  if (!titles) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (titles.length === 0 || titles.titles.length === 0) {
    return (
      <Container>
        {searchTerm ? (
          <h4>No titles found.</h4>
        ) : (
          <h4>No Titles to display.</h4>
        )}
      </Container>
    );
  }

  return (
    <>
      <Row className="card-container">
        {titles.titles?.map((title) => (
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
                    <hr style={{ width: "90%" }} />
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
                    <hr style={{ width: "90%" }} />
                    {user && user.is_staff && (
                      <Button
                        variant="danger"
                        onClick={async (e) => {
                          e.preventDefault();
                          await DeleteTitle(title.id, api);
                          handleTitleDelete();
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
      {!isHomePage && (
        <Nav className="pagination">
          <Nav.Item>
            <Nav.Link
              disabled={pageNumber === 1}
              onClick={() => adjustPageNumber(-1)}
            >
              Previous
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link disabled="true">{`${pageNumber} / ${titles.total_pages}`}</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              disabled={pageNumber == titles.total_pages}
              onClick={() => adjustPageNumber(1)}
            >
              Next
            </Nav.Link>
          </Nav.Item>
        </Nav>
      )}
    </>
  );
};

export default CardsContainer;
