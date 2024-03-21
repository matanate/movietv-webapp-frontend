import { toast } from "react-toastify";

const CreateTitle = async (e, title, category, api) => {
  e.preventDefault();
  const ToastId = toast.loading("Creating title...");
  try {
    const response = await api.post("/add-title/", {
      id: title.id,
      title: category === "movie" ? title.title : title.name,
      release_date:
        category === "movie" ? title.release_date : title.first_air_date,
      overview: title.overview,
      img_url: `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${title.poster_path}`,
      movie_or_tv: category,
      genres: title.genre_ids,
    });

    let data = response.data;
    toast.update(ToastId, {
      render: "Title created successfully!",
      type: "success",
      isLoading: false,
      autoClose: 5000,
      closeOnClick: true,
      closeButton: true,
    });
    return data;
  } catch (error) {
    if (error.response.request.status === 400) {
      toast.update(ToastId, {
        render: "Title already exists. try another title",
        type: "warning",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      });
    } else {
      toast.update(ToastId, {
        render: "Failed to create title. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      });
    }
    throw error;
  }
};
export default CreateTitle;
