import "../index.css";
import { useState } from "react";
import Header from "./Header";
import Form from "./Form";
import List from "./List";
import Footer from "./Footer";

export default function App() {
  const [items, setItems] = useState([]);

  function handleAddItem(newItem) {
    setItems((items) => [...items, newItem]);
  }

  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item,
      ),
    );
  }
  function handleClearList() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all items?",
    );
    if (!confirmed) return;
    setItems([]);
  }

  return (
    <div className="App">
      <Header />
      <Form onAddItem={handleAddItem} />
      <List
        items={items}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onClearList={handleClearList}
      />
      <Footer items={items} />
    </div>
  );
}
