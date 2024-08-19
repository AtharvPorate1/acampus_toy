import React, { useEffect, useState } from 'react';
import './Home.css'; // Import the CSS file
import ReactMarkdown from 'react-markdown';
import CoursePage from './CoursePage';

function splitSyllabus(markdown: string): string[] {
  const syllabus: string[] = [];
  const sections = markdown.split(/(?=## Chapter \d+)/);

  if (sections.length > 0) {
    syllabus.push("Thermodynamics"); // Adding the main title
  }

  sections.forEach(section => {
    syllabus.push(section.trim());
  });

  return syllabus;
}

const Home: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [courseStarted, setCourseStarted] = useState<boolean>(false);
  const [chapters, setChapters] = useState<string[]>([]);
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const handleClick = async () => {
    try {
      const response = await fetch('https://acampus-toy-1.onrender.com/api/completion/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input }),
      });
  
      if (!response.body) {
        console.error('No response body found');
        return;
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let result = '';
      let done = false;
  
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
  
        if (value) {
          result += decoder.decode(value, { stream: !done });
          console.log('Received chunk:', result);
          setMarkdown(result); // Update the markdown as new data arrives
        }
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };
  

  useEffect(() => {
    if (markdown) {
      const splitChapters = splitSyllabus(markdown);
      setChapters(splitChapters);
      setCurrentChapter(1);
    }
  }, [markdown]);

  const handleNext = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const handlePrev = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const handleComplete = () => {
    setIsComplete(true);
  };

  const handleChapterSelect = (chapter: number) => {
    setCurrentChapter(chapter);
  };

  

  return (
    <div className="home-container">
      <header className="header">
        <h1>acampus.ai</h1>
        <button className="premium-button">Get Premium</button>
        <div className="user-icon">👤</div>
      </header>
      <main className="main-content">
        <h2>Classroom</h2>
        <div className="course-input">
          <input 
            type="text"
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="What do you want to learn today?" 
            className="input-box"
          />
          <button onClick={handleClick} className="submit-button">Continue</button>
        </div>

        {!courseStarted && markdown && (
          <div className="syllabus-container">
            <h3>Syllabus</h3>
            <div className="markdown-container">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
            <button className="start-course-button" onClick={() => setCourseStarted(true)}>
              Start Course
            </button>
          </div>
        )}

        {courseStarted && !isComplete && (
          <CoursePage
            chapters={chapters}
            currentChapter={currentChapter}
            onPrev={handlePrev}
            onNext={handleNext}
            onComplete={handleComplete}
            onChapterSelect={handleChapterSelect}
          />
        )}

        {isComplete && (
          <div className="complete-message">
            <p>Chapter Completed!</p>
            <button onClick={() => window.location.href = '/'}>Continue to Test</button>
            <button onClick={() => setCurrentChapter(currentChapter + 1)}>Skip to Next chapter</button>
          </div>
        )}
      </main>
      <footer className="footer">
        <img src="/cat-icon.png" alt="Cat Icon" className="cat-icon" />
      </footer>
    </div>
  );
};

export default Home;
