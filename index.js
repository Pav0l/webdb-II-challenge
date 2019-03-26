const express = require('express');
const helmet = require('helmet');
const knex = require('knex')({
  client: 'sqlite',
  useNullAsDefault: true,
  connection: {
    filename: './data/lambda.sqlite3',
  }
});

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here

server.post('/api/zoos', async (req, res) => {
  const zoo = req.body;
  if (zoo.name) {
    try {
      const newZoo = await knex('zoos').insert(req.body);
      res.status(201).json({message: `New Zoo created with an ID ${newZoo}`});
    } catch (error) {
      res.status(500).json({ error });
    }
  } else {
    res.status(400).json({ message: 'Please include name inside the body of the request' });
  }
});


const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
