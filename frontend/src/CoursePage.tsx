import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './CoursePage.css';

interface CoursePageProps {
  chapters: string[];
  currentChapter: number;
  onPrev: () => void;
  onNext: () => void;
  onComplete: () => void;
  onChapterSelect: (chapter: number) => void;
}

const CoursePage: React.FC<CoursePageProps> = ({ chapters, currentChapter, onPrev, onNext, onComplete, onChapterSelect }) => {
  const [markdown, setMarkdown] = useState<string>('');
  const isLastChapter = currentChapter === chapters.length - 1;
  const query = chapters[currentChapter];

  console.log('Component rendered. Current chapter:', currentChapter, 'Query:', query);

  useEffect(() => {
    console.log('useEffect triggered. Fetching course content...');
    const fetchCourseContent = async () => {
      try {
        console.log('Sending POST request to fetch course content');
        const response = await fetch('https://acampus-toy-1.onrender.com/api/coursecontent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        });

        console.log('Response received. Status:', response.status);

        const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();

        if (!reader) {
          console.error('Failed to get reader from response');
          return;
        }

        let result = '';
        const chunks: string[] = [];
        let shouldUpdate = true;

        const readChunks = async () => {
          while (shouldUpdate) {
            const { value, done } = await reader.read();
            if (done) {
              console.log('Finished reading response');
              break;
            }
            chunks.push(value);
            result = chunks.join('');

            requestAnimationFrame(() => {
              setMarkdown(result);
            });
          }
        };

        readChunks().catch(error => console.error('Error reading chunks:', error));

        return () => {
          shouldUpdate = false;
          console.log('Cleanup function called');
        };
      } catch (error) {
        console.error('Error fetching course content:', error);
      }
    };

    fetchCourseContent();
  }, [query]);

  const handlePageClick = (pageNumber: number) => {
    console.log('Page clicked:', pageNumber);
    onChapterSelect(pageNumber);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 0; i < chapters.length; i++) {
      pages.push(
        <button
          key={i}
          className={`page-button ${i === currentChapter ? 'active' : ''}`}
          onClick={() => handlePageClick(i)}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  console.log('Rendering component. Markdown length:', markdown.length);

  return (
    <div className="main-container">
      <div className="markdown-container">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
      <div className="navigation-buttons">
        <button className="submit-button" onClick={() => {
          console.log('Prev button clicked');
          onPrev();
        }} disabled={currentChapter === 0}>
          Prev
        </button>
        <div className="pagination-container">{renderPagination()}</div>
        {isLastChapter ? (
          <button className="start-course-button" onClick={() => {
            console.log('Mark as Complete button clicked');
            onComplete();
          }}>
            Mark as Complete
          </button>
        ) : (
          <button className="submit-button" onClick={() => {
            console.log('On Client: Next button is clicked');
            onNext();
          }}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default CoursePage;