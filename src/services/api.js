import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api'; // ⚠️ change to Render URL when deployed

export const getPosts = async () => {
  const res = await axios.get(`${BASE_URL}/posts`);
  return res.data;
};

export const createPost = async (postData) => {
  const res = await axios.post(`${BASE_URL}/posts`, postData);
  return res.data;
};