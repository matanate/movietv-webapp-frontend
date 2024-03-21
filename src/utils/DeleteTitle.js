import { toast } from "react-toastify";

const DeleteTitle = async (titleId, api) => {
  const toastId = toast.loading("Deleting title...");

  try {
    const response = await api.delete(`/delete-title/${titleId}`);

    let data = response.data;
    toast.update(toastId, {
      render: "Title deleted successfully!",
      type: "success",
      isLoading: false,
      autoClose: 5000,
      closeOnClick: true,
      closeButton: true,
    });
    return data;
  } catch (error) {
    console.error("An error occurred during title delete:", error);
    toast.update(toastId, {
      render: "Failed to delete title. Please try again.",
      type: "success",
      isLoading: false,
      autoClose: 5000,
      closeOnClick: true,
      closeButton: true,
    });
  }
};

export default DeleteTitle;
