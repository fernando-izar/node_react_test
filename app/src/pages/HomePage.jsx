import { useEffect, useState } from "react";
import { getItems, createItem, deleteItem } from "../api/items";
import ItemList from "../components/ItemList";
import ItemForm from "../components/ItemForm";

export default function HomePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getItems().then(setItems);
  }, []);

  const handleCreate = async (data) => {
    const newItem = await createItem(data);
    setItems((prev) => [...prev, newItem]);
  };

  const handleDelete = async (id) => {
    await deleteItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div>
      <h1>Items</h1>
      <ItemForm onSubmit={handleCreate} />
      <ItemList items={items} onDelete={handleDelete} />
    </div>
  );
}
