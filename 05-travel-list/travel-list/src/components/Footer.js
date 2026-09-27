export default function Footer({ items }) {
  const totalItems = items.length;
  const packedItems = items.filter((item) => item.packed).length;
  const percentage = Math.round((packedItems / totalItems) * 100) || 0;
  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "Congratulations! You are all packed!"
          : `You Have ${totalItems} items on your list , and your already packed
          ${packedItems} (${percentage}%) `}
      </em>
    </footer>
  );
}
