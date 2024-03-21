import React from "react";
import CardsContainer from "../components/CardsContainer";
import Container from "react-bootstrap/Container";

const HomePage = () => {
  const pageTitleCategories = {
    movie: "Movies",
    tv: "TV Shows",
  };
  return (
    <Container>
      {Object.keys(pageTitleCategories).map((category) => (
        <div key={category}>
          <h1>Top 10 {pageTitleCategories[category]}:</h1>
          <CardsContainer category={category} isHomePage={true} />
        </div>
      ))}
    </Container>
  );
};

export default HomePage;
