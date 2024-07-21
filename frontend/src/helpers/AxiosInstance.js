import axios from "axios";

// Create a custom instance of Axios
const axiosInstance = axios.create({
  baseURL: "https://your-api-base-url.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Set a timeout if needed
});

// Request interceptor for adding any additional headers or settings
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling responses
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle error responses here
    let errorMessage = "An error occurred";
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      switch (error.response.status) {
        case 404:
          errorMessage = "Resource not found";
          break;
        case 500:
          errorMessage = "Internal server error";
          break;
        default:
          errorMessage = `Error: ${error.response.status}`;
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "No response from the server";
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;
