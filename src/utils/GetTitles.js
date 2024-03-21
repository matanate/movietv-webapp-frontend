import { toast } from "react-toastify";

const GetTitles = async ({
  orderBy = "rating",
  movieOrTv = "all",
  titlesPerPage = 10,
  pageNumber = 1,
  searchTerm = null,
  api,
}) => {
  try {
    const response = await api.post(`/get-titles/`, {
      order_by: orderBy,
      movie_or_tv: movieOrTv,
      title_per_page: titlesPerPage,
      page_number: pageNumber,
      search_term: searchTerm,
    });

    return response.data;
  } catch (error) {
    console.error("An error occurred during title fetching:", error);
    toast.warning("Failed to fetch titles.");
    return [];
  }
};

export default GetTitles;
