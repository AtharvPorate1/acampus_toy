import { useState } from "react";
import pdfToText from "react-pdftotext";
import "./Revise.css";
import Flashcards from "./components/Flashcard";

const Chatbot = ({ context }: { context: string }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = async () => {
    if (input.trim() === '') return;

    setMessages((prevMessages) => [...prevMessages, input]);
    setInput('');
    setIsLoading(true);

    const question = `context is ${context} and question is ${input}, please answer this question in 2 - 3 sentences.`;
    const response = await fetch('https://acampus-toy-1.onrender.com/api/reviseqna', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: question }),
    });

    const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();

    if (!reader) {
      console.error('Failed to get reader from response');
      setIsLoading(false);
      return;
    }

    let result = '';
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      result += value;
    }

    setMessages((prevMessages) => [...prevMessages, result]);
    setIsLoading(false);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <p>{message}</p>
          </div>
        ))}
        {isLoading && (
          <div className="message loading-message">
            <p>Loading...</p>
          </div>
        )}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" onClick={handleClick}>Send</button>
      </div>
    </div>
  );
};

const Revise = () => {
  const [text, setText] = useState<string>("");
  const [activeChatbot, setActiveChatbot] = useState<boolean>(false);
  const [activeFlashcards, setActiveFlashcards] = useState<boolean>(false);

  const handleChatbot = () => {
    setActiveChatbot(true);
    setActiveFlashcards(false);
  };

  const handleFlashcards = () => {
    setActiveChatbot(false);
    setActiveFlashcards(true);
  };

  const extractText = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    pdfToText(file)
      .then((text: string) => setText(text))
      .catch((error: Error) => console.error("Failed to extract text from PDF", error));
  };

  return (
    <div>
      <div className="top-button">
        <button onClick={handleChatbot}>Chatbot</button>
        <button onClick={handleFlashcards}>Flashcards</button>
      </div>
      {activeChatbot && (
        <div className="chatbot-container">
          <input type="file" accept="application/pdf" onChange={extractText} />
          <Chatbot context={text} />
        </div>
      )}
      {activeFlashcards && (
        <div className="chatbot-container">
          
          <Flashcards  />
        </div>
      )}
    </div>
  );
};

export default Revise;
