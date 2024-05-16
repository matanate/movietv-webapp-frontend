import React, { useState, useEffect, useContext } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import FormCheck from "react-bootstrap/FormCheck";
import ToggleButton from "react-bootstrap/ToggleButton";
import NavDropdown from "react-bootstrap/NavDropdown";
import GetGenres from "../utils/GetGenres";
import GetAvailableYears from "../utils/GetAvailableYears";
import AxiosContext from "../context/AxiosContext";

const FilterOptions = ({
  category,
  movieOrTv,
  setMovieOrTv,
  genres,
  updateGenres,
  ratings,
  updateRatings,
  years,
  updateYears,
  changePageNumber,
}) => {
  const radios = [
    { name: "Movies", value: "movie" },
    { name: "Tv Shows", value: "tv" },
    { name: "All Titles", value: "all" },
  ];
  const ratingOptions = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
  const [genresOptions, setGenresOptions] = useState([]);
  const [yearsOptions, setYearsOptions] = useState([]);
  const { useAxios } = useContext(AxiosContext);
  const api = useAxios();

  useEffect(() => {
    const fetchGenres = async () => {
      const fetchedGenres = await GetGenres({ api: api });
      setGenresOptions(fetchedGenres);
    };
    const fetchYears = async () => {
      const fetchedYears = await GetAvailableYears({ api: api });
      setYearsOptions(fetchedYears);
    };

    fetchGenres();
    fetchYears();
  }, []);

  return (
    <Container className="d-flex">
      <span>Filters:</span>
      {category != "tv" && category != "movie" && (
        <NavDropdown title="Category" className="mx-3">
          <ButtonGroup size="sm">
            {radios.map((radio, idx) => (
              <ToggleButton
                key={`cat-${idx}`}
                id={`movieOrTv-${idx}`}
                type="radio"
                variant="outline-secondary"
                name="movieOrTv"
                value={radio.value}
                checked={movieOrTv === radio.value}
                onChange={(e) => {
                  setMovieOrTv(e.currentTarget.value);
                  changePageNumber(1);
                }}
              >
                {radio.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </NavDropdown>
      )}

      <NavDropdown title="Genres" className="mx-3" id="genre-dropdown">
        {genresOptions.map((genre, idx) => (
          <FormCheck
            key={`genre-${idx}`}
            type="checkbox"
            label={genre.genre_name}
            name="genreOption"
            id={`genreOption-${idx}`}
            value={genre.id}
            checked={genres.has(genre.id)}
            onChange={() => {
              genres.has(genre.id)
                ? updateGenres(genre.id, "remove")
                : updateGenres(genre.id, "add");
              changePageNumber(1);
            }}
          />
        ))}
      </NavDropdown>
      <NavDropdown title="Rating" className="mx-3" id="rating-dropdown">
        {ratingOptions.map((rating, idx) => (
          <FormCheck
            key={`rating-${idx}`}
            type="checkbox"
            label={
              rating === 10 ? 10 : `${rating.toFixed(1)} - ${rating + 0.99}`
            }
            name="ratingOption"
            id={`ratingOption-${idx}`}
            value={rating}
            checked={ratings.has(rating)}
            onChange={() => {
              ratings.has(rating)
                ? updateRatings(rating, "remove")
                : updateRatings(rating, "add");
              changePageNumber(1);
            }}
          />
        ))}
      </NavDropdown>
      <NavDropdown title="Years" className="mx-3" id="year-dropdown">
        {yearsOptions.map((year, idx) => (
          <FormCheck
            key={`year-${idx}`}
            type="checkbox"
            label={year}
            name="yearOption"
            id={`yearOption-${idx}`}
            value={year}
            checked={years.has(year)}
            onChange={() => {
              years.has(year)
                ? updateYears(year, "remove")
                : updateYears(year, "add");
              changePageNumber(1);
            }}
          />
        ))}
      </NavDropdown>
    </Container>
  );
};

export default FilterOptions;
