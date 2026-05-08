export default function ItemList({ items, onDelete }) {
  if (!items.length) return <p>No items yet.</p>;
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <strong>{item.name}</strong> — {item.description}
          <button onClick={() => onDelete(item.id)} style={{ marginLeft: 8 }}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
