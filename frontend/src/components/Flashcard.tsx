import { useState } from 'react';
import './style/Flashcard.css';

const Flashcards = ({ cards }: { cards: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : cards.length - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex < cards.length - 1 ? prevIndex + 1 : 0));
  };

  return (
    <div className="flashcards-container">
      <button className="nav-button left" onClick={handlePrevClick}>
        &lt;
      </button>
      <div className="flashcard">{cards[currentIndex]}</div>
      <button className="nav-button right" onClick={handleNextClick}>
        &gt;
      </button>
    </div>
  );
};

export default Flashcards;
