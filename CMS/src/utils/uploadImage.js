import axiosClient from "../axios-client";

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await axiosClient.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
}
