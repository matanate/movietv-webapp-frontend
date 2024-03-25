import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import CardsContainer from "../components/CardsContainer";

const TitlesPage = ({ category }) => {
  const pageTitleCategories = {
    movie: "Movies",
    tv: "TV Shows",
    all: "Titles",
    search: "Search Results",
  };

  const params = useParams();

  const [searchTerm, setSearchTerm] = useState(
    Object.keys(params).length && params.searchTerm ? params.searchTerm : null
  );

  useEffect(() => {
    if (Object.keys(params).length && params.searchTerm) {
      setSearchTerm(params.searchTerm);
    } else {
      setSearchTerm(null);
    }
  }, [category, params]);

  return (
    <Container>
      <h1>
        {pageTitleCategories[category]}
        {searchTerm ? ` for "${searchTerm}"` : ""}:
      </h1>

      <CardsContainer
        category={category === "search" ? "all" : category}
        searchTerm={searchTerm}
        titlesPerPage={20}
      />
    </Container>
  );
};

export default TitlesPage;
