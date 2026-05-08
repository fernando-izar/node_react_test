let items = [
  { id: 1, name: "Item One", description: "First item" },
  { id: 2, name: "Item Two", description: "Second item" },
];
let nextId = 3;

module.exports = {
  getAll: () => items,
  getById: (id) => items.find((i) => i.id === id),
  create: (data) => {
    const item = { id: nextId++, ...data };
    items.push(item);
    return item;
  },
  update: (id, data) => {
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data };
    return items[idx];
  },
  remove: (id) => {
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return false;
    items.splice(idx, 1);
    return true;
  },
};
