require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

app.post('/api/completion/completion', async (req, res) => {
  const { query } = req.body;

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: [
          { role: 'system', content: 'You are an SEO expert.' },
          { role: 'user', content: `Generate a 5 chapter syllabus on the topic ${query} respond in markdown format, have headings, normal texts, images, italics, all of the markdown format` },
        ],
        temperature: 0.3,
      },
      responseType: 'stream',
    });

    let buffer = '';

    response.data.on('data', (chunk) => {
      buffer += chunk.toString();
      let boundary = buffer.indexOf('\n\n');
      while (boundary !== -1) {
        const payload = buffer.substring(0, boundary);
        buffer = buffer.substring(boundary + 2);
        boundary = buffer.indexOf('\n\n');

        if (payload.includes('[DONE]')) {
          res.end();
          return;
        }

        if (payload.startsWith('data:')) {
          const dataStr = payload.replace('data: ', '');
          try {
            const data = JSON.parse(dataStr);
            const text = data.choices[0].delta?.content;
            if (text) {
              res.write(text);
              console.log(text);
            }
          } catch (error) {
            console.error(`Error parsing JSON: ${dataStr}`, error);
          }
        }
      }
    });

    response.data.on('end', () => {
      res.end();
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.post('/api/reviseqna', async (req, res) => {
  const { query } = req.body;

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: [
          { role: 'system', content: 'You are an teaching expert.' },
          { role: 'user', content: `${query} respond in markdown format,` },
        ],
        temperature: 0.3,
        max_tokens: 200,
      },
      responseType: 'stream',
    });

    let buffer = '';

    response.data.on('data', (chunk) => {
      buffer += chunk.toString();
      let boundary = buffer.indexOf('\n\n');
      while (boundary !== -1) {
        const payload = buffer.substring(0, boundary);
        buffer = buffer.substring(boundary + 2);
        boundary = buffer.indexOf('\n\n');

        if (payload.includes('[DONE]')) {
          res.end();
          return;
        }

        if (payload.startsWith('data:')) {
          const dataStr = payload.replace('data: ', '');
          try {
            const data = JSON.parse(dataStr);
            const text = data.choices[0].delta?.content;
            if (text) {
              res.write(text);
              console.log(text);
            }
          } catch (error) {
            console.error(`Error parsing JSON: ${dataStr}`, error);
          }
        }
      }
    });

    response.data.on('end', () => {
      res.end();
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/flashcards', async (req, res) => {
  const { query } = req.body;

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: [
          { role: 'system', content: 'You are an educational expert.' },
          { role: 'user', content: `Generate 10 flashcards for the topic "${query}". Keep the answers brief and make sure they are in a question-answer format.` },
        ],
        temperature: 0.3,
      },
      responseType: 'stream',
    });

    let buffer = '';

    response.data.on('data', (chunk) => {
      buffer += chunk.toString();
      let boundary = buffer.indexOf('\n\n');
      while (boundary !== -1) {
        const payload = buffer.substring(0, boundary);
        buffer = buffer.substring(boundary + 2);
        boundary = buffer.indexOf('\n\n');

        if (payload.includes('[DONE]')) {
          res.end();
          return;
        }

        if (payload.startsWith('data:')) {
          const dataStr = payload.replace('data: ', '');
          try {
            const data = JSON.parse(dataStr);
            const text = data.choices[0].delta?.content;
            if (text) {
              res.write(text);
              console.log(text);
            }
          } catch (error) {
            console.error(`Error parsing JSON: ${dataStr}`, error);
          }
        }
      }
    });

    response.data.on('end', () => {
      res.end();
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/test', async (req, res) => {
  const { query } = req.body;

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a quiz generation expert.' },
          { role: 'user', content: `Generate a set of multiple-choice questions on the topic "${query}". Format the response as a JSON array of objects. Each object should include:
            - "question": The question text
            - "options": An array of strings representing the multiple-choice options
            - "correctAnswer": The correct option among the choices (as a string)
            Example format:
            [
              {
                "question": "What is the capital of France?",
                "options": ["A) Paris", "B) London", "C) Berlin", "D) Rome"],
                "correctAnswer": "A) Paris"
              },
              {
                "question": "What is the largest planet in our solar system?",
                "options": ["A) Earth", "B) Jupiter", "C) Saturn", "D) Mars"],
                "correctAnswer": "B) Jupiter"
              }
            ]` },
        ],
        temperature: 0.3,
      },
    });

    const responseData = response.data.choices[0].message.content;
    const parsedQuestions = JSON.parse(responseData);
    res.json(parsedQuestions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Endpoint to grade the test
app.post('/api/grade', async (req, res) => {
  const { questions, selectedAnswers } = req.body;

  try {
    // Assuming each question in 'questions' has a 'correctAnswer' field
    if (!Array.isArray(questions) || !Array.isArray(selectedAnswers)) {
      return res.status(400).send('Invalid input format');
    }

    let score = 0;

    questions.forEach((question, index) => {
      if (question.correctAnswer === selectedAnswers[index]) {
        score += 1;
      }
    });

    res.json({ score });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});





app.post('/api/coursecontent', async (req, res) => {
  const { query } = req.body;

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: [
          { role: 'system', content: 'You are a teaching expert.' },
          { role: 'user', content: `Teach me on the topic ${query}, in about 500 words to an engineering graduate,use mathematical expressions if needed, respond in markdown format, have headings, normal texts, images, italics, all of the markdown format and make it look like a book` },
        ],
        temperature: 0.3,
      },
      responseType: 'stream',
    });

    let syllabus = '';

    response.data.on('data', (chunk) => {
      syllabus += chunk.toString();
      let boundary = syllabus.indexOf('\n\n');
      while (boundary !== -1) {
        const payload = syllabus.substring(0, boundary);
        syllabus = syllabus.substring(boundary + 2);
        boundary = syllabus.indexOf('\n\n');

        if (payload.includes('[DONE]')) {
          res.end();
          return;
        }

        if (payload.startsWith('data:')) {
          const dataStr = payload.replace('data: ', '');
          try {
            const data = JSON.parse(dataStr);
            const text = data.choices[0].delta?.content;
            if (text) {
              res.write(text);
              console.log(text);
            }
          } catch (error) {
            console.error(`Error parsing JSON: ${dataStr}`, error);
          }
        }
      }
    });

    response.data.on('end', () => {
      res.end();
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
