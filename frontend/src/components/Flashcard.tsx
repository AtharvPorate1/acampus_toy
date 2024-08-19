import { useState } from 'react';
import './style/Flashcard.css';

const Flashcards = () => {
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const generateFlashcards = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: topic }),
      });

      const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();

      if (!reader) {
        setIsLoading(false);
        return;
      }

      let flashcardsData = '';
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        flashcardsData += value;
      }

      const generatedCards = flashcardsData.split('\n').filter((card) => card.trim());
      setCards(generatedCards);
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : cards.length - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex < cards.length - 1 ? prevIndex + 1 : 0));
  };

  return (
    <div className="flashcards-container">
      <div className="input-section">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic for flashcards..."
        />
        <button onClick={generateFlashcards} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Flashcards'}
        </button>
      </div>
      {cards.length > 0 && (
        <>
          <button className="nav-button left" onClick={handlePrevClick}>
            &lt;
          </button>
          <div className="flashcard">{cards[currentIndex]}</div>
          <button className="nav-button right" onClick={handleNextClick}>
            &gt;
          </button>
        </>
      )}
    </div>
  );
};

export default Flashcards;
