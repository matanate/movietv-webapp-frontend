import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import AxiosContext from "../context/AxiosContext";
import GetTitles from "../utils/GetTitles";

const SearchResult = () => {
  const [loading, setLoading] = useState(true);
  const [titles, setTitles] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(null);
  const formRef = useRef(null);
  let { useAxios } = useContext(AxiosContext);
  let api = useAxios();
  const [isSearchFocus, setIsSearchFocus] = useState(false);
  const searchDropdownRef = React.createRef();

  const onSearchFocus = () => {
    if (searchTerm && searchTerm.length > 0) {
      setIsSearchFocus(true);
    }
  };
  const onSearchBlur = (e) => {
    if (!searchDropdownRef.current.contains(e.relatedTarget)) {
      setIsSearchFocus(false);
    }
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search/${searchTerm}`);
    setSearchTerm(null);
    setIsSearchFocus(false);
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
      setLoading(true);
      try {
        const data = await GetTitles({
          searchTerm: debouncedSearchTerm,
          titlesPerPage: 20,
          movieOrTv: "all",
          api: api,
        });
        setTitles(data.titles);
      } catch (error) {
        console.error("Error fetching titles:", error);
      }
      setLoading(false);
    };
    if (debouncedSearchTerm && debouncedSearchTerm.length > 0) {
      fetchTitles();
    } else {
      setTitles(null);
    }
  }, [debouncedSearchTerm]);

  return (
    <NavDropdown
      id="search-dropdown"
      ref={searchDropdownRef}
      title={
        <Form
          inline="true"
          className="me-3"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <Form.Control
            as="input"
            name="searchTerm"
            type="text"
            placeholder="Search..."
            className="mr-sm-2"
            onInput={(e) => {
              setSearchTerm(e.target.value);
              e.target.value.length > 0
                ? setIsSearchFocus(true)
                : setIsSearchFocus(false);
            }}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </Form>
      }
      toggle="false"
      onFocus={onSearchFocus}
      onBlur={onSearchBlur}
      show={isSearchFocus}
    >
      {!titles || loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : titles.length > 0 ? (
        titles.map((title) => (
          <NavDropdown.Item
            key={`search-${title.id}`}
            as={Link}
            to={`${title.movie_or_tv === "movie" ? "movies" : "tv-shows"}/${
              title.id
            }`}
            onClick={() => {
              setSearchTerm(null);
              formRef.current.reset();
              setIsSearchFocus(false);
            }}
          >
            <div
              style={{ backgroundImage: `url('${title.img_url}')` }}
              className="list-group-item-img"
            >
              {title.movie_or_tv}
            </div>
            {title.title}
          </NavDropdown.Item>
        ))
      ) : (
        <p>No results found.</p>
      )}
    </NavDropdown>
  );
};

export default SearchResult;
