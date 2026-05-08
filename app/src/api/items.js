import client from "./client";

export const getItems = () => client.get("/items").then((r) => r.data);
export const getItem = (id) => client.get(`/items/${id}`).then((r) => r.data);
export const createItem = (data) =>
  client.post("/items", data).then((r) => r.data);
export const updateItem = (id, data) =>
  client.put(`/items/${id}`, data).then((r) => r.data);
export const deleteItem = (id) => client.delete(`/items/${id}`);
