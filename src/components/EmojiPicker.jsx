import React, { useState } from "react";
import "../styles/EmojiPicker.css";

const emojis = ["👍", "❤️", "😂", "😮", "😢", "😡"];

const EmojiPicker = ({ onSelect }) => {
  const [activeEmoji, setActiveEmoji] = useState(null);

  const handleEmojiClick = (emoji) => {
    setActiveEmoji(emoji);
    setTimeout(() => {
      onSelect(emoji);
      setActiveEmoji(null);
    }, 300);
  };

  return (
    <div className="emoji-picker">
      {emojis.map((emoji, index) => (
        <button
          key={index}
          className={`emoji-option ${activeEmoji === emoji ? "active" : ""}`}
          onClick={() => handleEmojiClick(emoji)}
          onMouseEnter={() => setActiveEmoji(emoji)}
          onMouseLeave={() => setActiveEmoji(null)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default EmojiPicker;