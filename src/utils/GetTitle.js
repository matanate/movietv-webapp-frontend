import { toast } from "react-toastify";

const getTitle = async ({ title_id, api }) => {
  try {
    const response = await api.get(`/get-titles/${title_id}`);

    return response.data;
  } catch (error) {
    console.error("An error occurred during title fetching:", error);
    toast.warning("Failed to fetch title.");
    return [];
  }
};

export default getTitle;
