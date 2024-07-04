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
