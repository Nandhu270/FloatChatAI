import api from "./axios";

export const sendChatMessage = async (message) => {
  const res = await api.post("/chat/", {
    message: message,
  });
  return res.data;
};
