import axios from "axios";

const API = axios.create({

    baseURL:
    "https://smart-champs-backend.onrender.com/api"
});

export default API;