import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import CreateTitle from "../utils/CreateTitle";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

// Define the base URL for the authentication API
const API_URL = "http://localhost:8000/api/";

const SelectTitlePage = () => {
  const [titles, setTitles] = useState([]);
  const { authTokens } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  let navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const toastId = toast.loading("Fetching titles...");
      try {
        const movieOrTv = searchParams.get("movie-or-tv");
        const searchTerm = searchParams.get("search-term");

        const response = await axios.get(
          `${API_URL}get-tmdb-search/?movie-or-tv=${movieOrTv}&search-term=${searchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          toast.dismiss(toastId);
          const data = response.data;
          setTitles(data);
        }
      } catch (error) {
        toast.update(toastId, {
          render: "Failed to fetch titles. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeOnClick: true,
          closeButton: true,
        });
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchParams, authTokens.access]);

  return (
    <Container>
      <h1>Select Title to Add:</h1>
      <ul className="list-group">
        {titles.map((title, index) => (
          <Form
            key={index}
            className="form-floating"
            onSubmit={(e) => {
              CreateTitle(
                e,
                title,
                searchParams.get("movie-or-tv"),
                authTokens
              );
              navigate(
                `/${
                  searchParams.get("movie-or-tv") === "movie"
                    ? "movies"
                    : "tv-shows"
                }/${title.id}`
              );
            }}
          >
            <Form.Control
              as={Button}
              type="submit"
              className="list-group-item list-group-item-action rounded"
            >
              {searchParams.get("movie-or-tv") === "movie"
                ? `${title.title} - ${title.release_date}`
                : `${title.name} - ${title.first_air_date}`}
            </Form.Control>
          </Form>
        ))}
      </ul>
    </Container>
  );
};

export default SelectTitlePage;
