require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 5001;

app.use(express.json());

app.post('/api/completion/completion', async (req, res) => {
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
          { role: 'user', content: 'Write a paragraph about no-code tools to build in 2021.' },
        ],
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
