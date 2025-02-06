import axios from "axios";

const API_URL = "http://localhost:3000/api/";

export const fetchJobs = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createJob = async (job) => {
  const response = await axios.post(API_URL, job);
  return response.data;
};
