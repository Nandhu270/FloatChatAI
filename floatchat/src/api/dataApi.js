import api from "./axios";

export const getNearbyFloats = async (lat, lon) => {
  const res = await api.get("/floats/", {
    params: { lat, lon },
  });
  return res.data;
};
