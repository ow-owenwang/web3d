import axios from "axios";

export function getSmartCityInfo() {
  return axios.get("http://127.0.0.1:4523/mock/804594/api/smartcity/info");
}

export function getSmartCityList() {
  return axios.get("http://127.0.0.1:4523/mock/804594/api/smartcity/list");
}


/* export function getSmartCityInfo() {
    return axios({
      url: "http://127.0.0.1:4523/mock/806782/api/smartcity/info",
      method: "get",
    });
  }
  
  export function getSmartCityList() {
    return axios({
      url: "http://127.0.0.1:4523/mock/806782/api/smartcity/list",
      method: "get",
    });
  } */