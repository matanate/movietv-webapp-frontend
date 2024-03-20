import React from "react";
import CardsContainer from "../components/CardsContainer";
import Container from "react-bootstrap/Container";

const HomePage = () => {
  const [topTitles, setTopTitles] = useState({
    movie: { data: [], title: null },
    tv: { data: [], title: null },
  });

  useEffect(() => {
    const fetchTopTitles = async () => {
      try {
        const movieTitlesData = await GetTitles({
          movieOrTv: "movie",
        });
        const tvTitlesData = await GetTitles({
          movieOrTv: "tv",
        });
        setTopTitles({
          movie: { data: movieTitlesData.titles, title: "Movies" },
          tv: { data: tvTitlesData.titles, title: "Tv Shows" },
        });
      } catch (error) {
        console.error("Error fetching top titles:", error);
      }
    };

    fetchTopTitles();
  }, []);
  return (
    <Container>
      {Object.keys(topTitles).map((category) => (
        <div key={category}>
          <h1>Top 10 {topTitles[category].title}:</h1>
          <CardsContainer titles={topTitles[category].data} />
        </div>
      ))}
    </Container>
  );
};

export default HomePage;
