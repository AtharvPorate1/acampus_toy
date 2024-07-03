import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CoursePage: React.FC = () => {
  const { userEnteredTopic, chapterName } = useParams<{ userEnteredTopic: string; chapterName: string; }>();
  const [chapterContent, setChapterContent] = useState<string>('');

  useEffect(() => {
    const fetchChapterContent = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/course/${userEnteredTopic}/${chapterName}`);
        const data = await response.text();
        setChapterContent(data);
      } catch (error) {
        console.error('Error fetching chapter content:', error);
      }
    };

    fetchChapterContent();
  }, [userEnteredTopic, chapterName]);

  return (
    <div>
      <h1>{chapterName}</h1>
      <div>{chapterContent}</div>
    </div>
  );
};

export default CoursePage;
