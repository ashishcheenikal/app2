import axios from "axios"; 

const instance = axios.create({
  baseURL : process.env.REACT_APP_BACKEND_URL,
  headers: {
      "Content-Type": "application/json",
      timeout : 1000,
      //  Authorization: `<Your Auth Token>`,
  }, 
  // .. other options
});

export default instance;