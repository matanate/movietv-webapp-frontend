import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import AxiosContext from "../context/AxiosContext";
import GetTitles from "../utils/GetTitles";

const SearchResult = () => {
  const [titles, setTitles] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(null);
  const formRef = useRef(null);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search/${searchTerm}`);
    setSearchTerm(null);
    formRef.current.reset();
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Adjust the delay time as needed

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const data = await GetTitles({
          searchTerm: debouncedSearchTerm,
          titlesPerPage: 20,
          movieOrTv: "all",
        });
        setTitles(data.titles);
      } catch (error) {
        console.error("Error fetching titles:", error);
      }
    };
    if (debouncedSearchTerm && debouncedSearchTerm.length > 0) {
      fetchTitles();
    } else {
      setTitles([]);
    }
  }, [debouncedSearchTerm]);

  return (
    <>
      <Form className="me-3" onSubmit={handleSubmit} ref={formRef}>
        <Form.Control
          name="searchTerm"
          type="text"
          placeholder="Search..."
          className="mr-sm-2"
          onInput={(e) => setSearchTerm(e.target.value)}
        />
        <div className="list-group search-list">
          {titles.map((title) => (
            <Button
              className="list-group-item list-group-item-action"
              as={Link}
              to={`${title.movie_or_tv === "movie" ? "movies" : "tv-shows"}/${
                title.id
              }`}
              onClick={() => {
                setSearchTerm(null);
                formRef.current.reset();
              }}
            >
              <div
                style={{ backgroundImage: `url('${title.img_url}')` }}
                className="list-group-item-img"
              >
                {title.movie_or_tv}
              </div>
              {title.title}
            </Button>
          ))}
        </div>
      </Form>
    </>
  );
};

export default SearchResult;
