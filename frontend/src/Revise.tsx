import { useEffect, useState } from "react";
import pdfToText from "react-pdftotext";
import "./Revise.css";
import Flashcards from "./components/Flashcard";



const Chatbot = ({ context }: { context: string }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = async () => {
    setMessages((prevMessages) => [...prevMessages, input]);
    setIsLoading(true); // Set loading state to true
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
      setIsLoading(false); // Reset loading state
      return;
    }

    let result = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      console.log('Received: ', value);
      result += value;
    }

    setMessages((prevMessages) => [...prevMessages, result]);
    setIsLoading(false); // Reset loading state
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
          <div className="message">
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
  const [method, setMethod] = useState<number>(0);
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

  
    

  
function extractText(event) {
  const file = event.target.files[0];
  pdfToText(file)
    .then((text) => setText(text))
    .catch((error) => console.error("Failed to extract text from pdf", error));
}
  return (
    <>
    <div>
      <div className="top-button">
        <button onClick={handleChatbot} className="" >Chatbot</button>
        <button onClick={handleFlashcards}>Flashcards</button>
      </div>
      {activeChatbot && <div className="chatbot-container">
        <input type="file" accept="application/pdf" onChange={extractText} />
        {/* <div>
          {text}
        </div> */}
        <div>
          <Chatbot context={text}/>
        </div>
      </div>}
      <div>
        {activeFlashcards && <div className="chatbot-container">
          Coming Soon...
          <Flashcards cards={text.split("\n\n")}/>
        </div>}
      </div>
    </div>
    </>
  )
}

export default Revise
