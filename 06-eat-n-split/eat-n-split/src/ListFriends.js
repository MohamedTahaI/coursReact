import { useState } from "react";

export function ListFriends({ friends }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend key={friend.id} friend={friend} />
      ))}
    </ul>
  );
}
function Friend({ friend }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <span className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </span>
      )}
      {friend.balance > 0 && (
        <span className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </span>
      )}
      {friend.balance === 0 && (
        <span className="gray">{friend.name} and you are even</span>
      )}
      <button className="button">Select</button>
    </li>
  );
}
