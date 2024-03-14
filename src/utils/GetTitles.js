import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000/api/";

const GetTitles = async ({
  orderBy = "rating",
  movieOrTv = "all",
  titlesPerPage = 10,
  pageNumber = 1,
  searchTerm = null,
}) => {
  const toastId = toast.loading(
    `Fetching ${
      searchTerm
        ? "search result"
        : movieOrTv === "movie"
        ? "movies"
        : movieOrTv === "tv"
        ? "tv shows"
        : movieOrTv === "all"
        ? "titles"
        : ""
    }...`
  );
  try {
    let response = await axios.post(
      `${API_URL}get-titles/`,
      {
        order_by: orderBy,
        movie_or_tv: movieOrTv,
        title_per_page: titlesPerPage,
        page_number: pageNumber,
        search_term: searchTerm,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      let data = response.data;
      toast.dismiss(toastId);
      return data;
    }
  } catch (error) {
    console.error("An error occurred during title fetching:", error);
    toast.update(toastId, {
      render: `Failed to fetch ${
        searchTerm
          ? "search result"
          : movieOrTv === "movie"
          ? "movies"
          : movieOrTv === "tv"
          ? "tv shows"
          : movieOrTv === "all"
          ? "titles"
          : ""
      }.`,
      type: "warning",
      isLoading: false,
      autoClose: 5000,
      closeOnClick: true,
      closeButton: true,
    });
  }
};

export default GetTitles;
