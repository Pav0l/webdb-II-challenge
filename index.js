const express = require('express');
const helmet = require('helmet');
const knex = require('knex')({
  client: 'sqlite',
  useNullAsDefault: true,
  connection: {
    filename: './data/lambda.sqlite3',
  }
});

const app = express();

app.use(express.json());
app.use(helmet());

// endpoints here

// [POST], '/api/zoos', req.body requires { name: "value" }
// returns an array with the ID of newly created zoo
app.post('/api/zoos', async (req, res) => {
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

// [GET], '/api/zoos'
// returns an array of zoos
app.get('/api/zoos', async (req, res) => {
  try {
    const allZoos = await knex('zoos');
    res.status(200).json(allZoos);
  } catch (error) {
    res.status(500).json({ error });
  }
})

const port = 3300;
app.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
