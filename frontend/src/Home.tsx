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
    const response = await fetch('https://acampus-toy-1.onrender.com/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: input }),
    });

    const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();

    if (!reader) {
      console.error('Failed to get reader from response');
      return;
    }

    let result = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      console.log('Received: ', value);
      result += value;
      setMarkdown(result);
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
    <main className="main-container">
      <p>ClassRoom</p>
      <br />
      <input 
        type="text"
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="What do you want to learn today?" 
        className="input-box"
      />
      <button onClick={handleClick} className="submit-button">Submit</button>

      {!courseStarted && (
        <div className="markdown-container">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      )}

      {markdown && !courseStarted && (
        <button className="start-course-button" onClick={() => setCourseStarted(true)}>
          Start Course
        </button>
      )}

      {courseStarted && !isComplete && (
        <CoursePage
          chapters={chapters}
          currentChapter={currentChapter}
          onPrev={handlePrev}
          onNext={handleNext}
          onComplete={handleComplete}
          onChapterSelect={handleChapterSelect} // Passing the new prop
        />
      )}

      {isComplete && (
        <div className="complete-message">
          <p>Congratulations! You have completed the course.</p>
        </div>
      )}
    </main>
  );
};

export default Home;
