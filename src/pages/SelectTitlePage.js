import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import AxiosContext from "../context/AxiosContext";
import CreateTitle from "../utils/CreateTitle";

const SelectTitlePage = () => {
  const [titles, setTitles] = useState([]);
  const [searchParams] = useSearchParams();
  let navigate = useNavigate();
  let { useAxios } = useContext(AxiosContext);
  let api = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      const toastId = toast.loading("Fetching titles...");
      const movieOrTv = searchParams.get("movie-or-tv");
      const searchTerm = searchParams.get("search-term");

      try {
        const response = await api.get(
          `get-tmdb-search/?movie-or-tv=${movieOrTv}&search-term=${searchTerm}`
        );
        toast.dismiss(toastId);
        const data = response.data;
        setTitles(data);
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
  }, [searchParams]);

  return (
    <Container>
      <h1>Select Title to Add:</h1>
      <ul className="list-group">
        {titles.map((title, index) => (
          <Form
            key={index}
            className="form-floating"
            onSubmit={(e) => {
              CreateTitle(e, title, searchParams.get("movie-or-tv"), api)
                .then(() => {
                  // Navigate only on successful response
                  navigate(
                    `/${
                      searchParams.get("movie-or-tv") === "movie"
                        ? "movies"
                        : "tv-shows"
                    }/${title.id}`
                  );
                })
                .catch((error) => {
                  console.error("Error creating title:", error);
                  // Handle any errors here, e.g., display an error message
                });
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
