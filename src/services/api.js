import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;; // ⚠️ change to Render URL when deployed

export const getPosts = async () => {
  const res = await axios.get(`${BASE_URL}/posts`);
  return res.data;
};

export const createPost = async (postData) => {
  const res = await axios.post(`${BASE_URL}/posts`, postData);
  return res.data;
};