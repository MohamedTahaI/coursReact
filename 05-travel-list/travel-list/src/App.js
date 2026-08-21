import './index.css';
import { useState } from 'react';

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
];

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
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  return (
    <div className="App">
      <Header />
      <Form onAddItem={handleAddItem} />
      <List items={items} onDeleteItem={handleDeleteItem} onToggleItem={handleToggleItem} />
      <Footer />

    </div>
  );
}


function Header() {
  return (
    <header >
      <h1>PackIt</h1>
    </header>
  );
}

function Form({ onAddItem }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function HandleSubmit(e) {
    e.preventDefault();
    const newItem = { id: Date.now(), description, quantity, packed: false };

    onAddItem(newItem);
    
    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={HandleSubmit}>
      <h3>What do you need for your trip?</h3>
      <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (<option value={num} key={num}>{num}</option>))
        }
      </select>
      <input type="text" placeholder="Item..." value={description} onChange={(e) => setDescription(e.target.value)} />
      <button>Add</button>
    </form>
  )
}


function List({ items, onDeleteItem, onToggleItem }) {
  return (
    <div className="list">
      <ul>
        {items.map((item) => (<Item item={item} onDeleteItem={onDeleteItem} onToggleItem={onToggleItem} />))}
      </ul>
    </div>
  )
}

function Item({ item, onDeleteItem , onToggleItem }) {
  return (
    <li>
      <input type="checkbox" value={item.packed} onChange={() => onToggleItem(item.id)} />
      <span>{item.quantity}</span>
      <span style={item.packed ? { textDecoration: "line-through" } : {}}> {item.description} </span>
      <button onClick={() => onDeleteItem(item.id)} >❌</button>
    </li>
  )
}
function Footer() {
  return (
    <footer className="stats">
      <p>You Have X items on your list , and your already packed X (X%) </p>
    </footer>
  )
}