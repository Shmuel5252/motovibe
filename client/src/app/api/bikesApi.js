import http from "./http.js";

export async function listBikes() {
  const { data } = await http.get("/bikes");
  return data;
}

export async function createBike(payload) {
  const { data } = await http.post("/bikes", payload);
  return data;
}
