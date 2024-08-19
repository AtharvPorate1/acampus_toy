import { useState } from 'react';
import './components/style/Test.css';

const Test = () => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<{ question: string, options: string[], correctAnswer: string }[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const generateTest = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: topic }),
      });

      const data = await response.json();
      console.log('Received Data:', data);

      if (Array.isArray(data)) {
        setQuestions(data);
        setSelectedAnswers(new Array(data.length).fill(''));
      } else {
        console.error('Unexpected data format:', data);
      }
    } catch (error) {
      console.error('Error generating test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = answer;
    setSelectedAnswers(updatedAnswers);
  };

  const submitTest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions, selectedAnswers }),
      });

      const resultData = await response.json();
      console.log('Grading Result:', resultData);

      if (typeof resultData.score === 'number') {
        setResult(resultData.score);
      } else {
        console.error('Unexpected result format:', resultData);
      }
    } catch (error) {
      console.error('Error grading test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="test-container">
      <div className="input-section">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter test topic..."
        />
        <button onClick={generateTest} disabled={isLoading}>
          {isLoading ? 'Generating Test...' : 'Generate Test'}
        </button>
      </div>

      {questions.length > 0 && (
        <div className="questions-section">
          {questions.map((questionData, index) => (
            <div key={index} className="question-card">
              <p className="question">{questionData.question}</p>
              <div className="options">
                {questionData.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="option-label">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      onChange={() => handleAnswerSelect(index, option)}
                      checked={selectedAnswers[index] === option}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="submit-button" onClick={submitTest} disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Test'}
          </button>
        </div>
      )}

      {result !== null && (
        <div className="result-section">
          <h3>Your Score: {result}/{questions.length}</h3>
        </div>
      )}
    </div>
  );
};

export default Test;
