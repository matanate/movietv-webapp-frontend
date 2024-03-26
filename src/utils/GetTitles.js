import { toast } from "react-toastify";

const GetTitles = async ({
  orderBy = "rating",
  isAscending = true,
  movieOrTv = "all",
  titlesPerPage = 10,
  pageNumber = 1,
  searchTerm = null,
  genres = null,
  ratings = null,
  years = null,
  api,
}) => {
  try {
    const response = await api.post(`/get-titles/`, {
      order_by: orderBy,
      is_ascending: isAscending,
      movie_or_tv: movieOrTv,
      title_per_page: titlesPerPage,
      page_number: pageNumber,
      search_term: searchTerm,
      genres: genres,
      ratings: ratings,
      years: years,
    });

    return response.data;
  } catch (error) {
    console.error("An error occurred during title fetching:", error);
    toast.warning("Failed to fetch titles.");
    return [];
  }
};

export default GetTitles;
