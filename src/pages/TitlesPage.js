import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import GetTitles from "../utils/GetTitles";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import CardsContainer from "../components/CardsContainer";

const TitlesPage = ({ category = "all" }) => {
  const [titles, setTitles] = useState({
    data: [],
    totalPages: null,
    title: null,
  });
  const [pageNumber, setPageNumber] = useState(1);
  const [titleDeleted, setTitleDeleted] = useState(false);
  let [searchParams] = useSearchParams();

  let searchTerm = null;

  const params = useParams();
  if (Object.keys(params).length) {
    searchTerm = params.searchTerm;
  }

  const handleTitleDelete = () => {
    // Toggle the reviewSubmitted state to trigger a re-render
    setTitleDeleted((prev) => !prev);
  };

  useEffect(() => {
    const initialPage = searchParams.get("page");
    if (initialPage) {
      setPageNumber(parseInt(initialPage));
    }

    const fetchTitles = async () => {
      try {
        const data = await GetTitles({
          titlesPerPage: 20,
          movieOrTv: category,
          searchTerm: searchTerm,
          pageNumber: pageNumber,
        });
        setTitles({
          data: data.titles,
          totalPages: data.total_pages,
          title: searchTerm
            ? "Search Results"
            : category === "movie"
            ? "Movies"
            : category === "tv"
            ? "Tv Shows"
            : category === "all"
            ? "All Titles"
            : "",
        });
      } catch (error) {
        console.error("Error fetching top titles:", error);
      }
    };

    fetchTitles();
  }, [category, searchTerm, pageNumber]);
  return (
    <Container>
      <h1>{titles.title}:</h1>
      {Object.keys(titles.data).length ? (
        <>
          <CardsContainer
            titles={titles.data}
            onTitleDelete={handleTitleDelete}
          />
        </>
      ) : (
        <Container>
          <h3>No Titles Found</h3>
        </Container>
      )}
      <Nav className="pagination">
        <Nav.Item>
          <Nav.Link
            disabled={pageNumber === 1}
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            Previous
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link disabled="true">{`${pageNumber} / ${titles.totalPages}`}</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            disabled={pageNumber === titles.totalPages}
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            Next
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Container>
  );
};

export default TitlesPage;
