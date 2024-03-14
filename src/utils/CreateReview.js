import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000/api/";

const CreateReview = async (e, user, authTokens, onReviewSubmit) => {
  e.preventDefault();
  const toastId = toast.loading("Creating review...");
  try {
    let response = await axios.post(
      `${API_URL}create-review/`,
      {
        title: e.target.titleId.value,
        author: user.user_id,
        rating: e.target.rating.value,
        comment: e.target.comment.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      }
    );

    if (response.status === 201) {
      let data = response.data;
      toast.update(toastId, {
        render: "Review created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
        closeButton: true,
      });
      onReviewSubmit();
      return data;
    }
  } catch (error) {
    console.error("An error occurred during review creation:", error);
    toast.update(toastId, {
      render: "Failed to create review. Please try again.",
      type: "error",
      isLoading: false,
      autoClose: 5000,
      closeOnClick: true,
      closeButton: true,
    });
  }
};

export default CreateReview;
