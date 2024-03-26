import React, { useContext, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BsStarFill } from "react-icons/bs";
import { Row, Col, Card, Button, Nav, Spinner } from "react-bootstrap";
import AuthContext from "../context/AuthContext";
import AxiosContext from "../context/AxiosContext";
import SortOptions from "../components/SortOptions";
import FilterOptions from "../components/FilterOptions";
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
  const [orderBy, setOrderBy] = useState("rating");
  const [isAscending, setIsAscending] = useState(true);
  const [checkedCategory, setCheckedCategory] = useState(
    category === "search" ? "all" : category
  );
  const [genres, setGenres] = useState(new Set());
  const [ratings, setRatings] = useState(new Set());
  const [years, setYears] = useState(new Set());

  // Update Set helper function
  const updateSet = (item, operation) => {
    return (prevItems) => {
      const newItems = new Set(prevItems);
      if (operation === "add") {
        newItems.add(item);
      } else if (operation === "remove") {
        newItems.delete(item);
      }
      return newItems;
    };
  };

  // Functions to update filters
  const updateGenres = (genre, operation) => {
    setGenres(updateSet(genre, operation));
  };

  const updateRatings = (rating, operation) => {
    setRatings(updateSet(rating, operation));
  };

  const updateYears = (year, operation) => {
    setYears(updateSet(year, operation));
  };

  // Function to handle title deletion
  const handleTitleDelete = () => {
    // Toggle the reviewSubmitted state to trigger a re-render
    setTitleDeleted((prev) => !prev);
  };

  const adjustPageNumber = (amount) => {
    setSearchParams(
      pageNumber + amount === 1 ? "" : { page: pageNumber + amount }
    );
    setPageNumber((prev) => {
      return prev + amount;
    });
  };

  // Function to change page number
  const changePageNumber = (newPageNumber) => {
    setSearchParams(newPageNumber === 1 ? "" : { page: newPageNumber });
    setPageNumber(newPageNumber);
  };

  // Fetch titles based on dependencies
  useEffect(() => {
    setCheckedCategory(category === "search" ? "all" : category);
    const fetchTitles = async () => {
      setLoading(true);
      const fetchedTitles = await GetTitles({
        movieOrTv: checkedCategory,
        titlesPerPage: titlesPerPage,
        pageNumber: pageNumber,
        searchTerm: searchTerm,
        orderBy: orderBy,
        isAscending: isAscending,
        genres: [...genres],
        ratings: [...ratings],
        years: [...years],
        api: api,
      });
      setTitles(fetchedTitles);
      setLoading(false);
    };
    if (
      !(category === "search" && searchTerm === null) &&
      (category === "search" ? "all" : category) === checkedCategory
    ) {
      fetchTitles();
    }
  }, [
    titleDeleted,
    pageNumber,
    category,
    orderBy,
    isAscending,
    searchTerm,
    genres,
    ratings,
    years,
    checkedCategory,
  ]);

  // Component for loading spinner
  const LoadingSpinner = () => (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );

  // Component for sort and filter options
  const SortAndFilterOptions = () => (
    <>
      <SortOptions
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        isAscending={isAscending}
        setIsAscending={setIsAscending}
        changePageNumber={changePageNumber}
      />
      <FilterOptions
        category={category}
        movieOrTv={checkedCategory}
        setMovieOrTv={setCheckedCategory}
        genres={genres}
        updateGenres={updateGenres}
        ratings={ratings}
        updateRatings={updateRatings}
        years={years}
        updateYears={updateYears}
        changePageNumber={changePageNumber}
      />
    </>
  );

  // Component for displaying no titles message
  const NoTitlesMessage = () => (
    <h4>{searchTerm ? "No titles found." : "No Titles to display."}</h4>
  );

  // Component for rendering titles
  const RenderTitles = () => (
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

  return (
    <>
      {!isHomePage && <SortAndFilterOptions />}
      {loading || !titles ? (
        <LoadingSpinner />
      ) : titles.length === 0 || titles.titles.length === 0 ? (
        <NoTitlesMessage />
      ) : (
        <RenderTitles />
      )}
    </>
  );
};

export default CardsContainer;
