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
// INSERT INTO zoos ("name") VALUES ("req.body.name");
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
// SELECT * FROM zoos;
app.get('/api/zoos', async (req, res) => {
  try {
    const allZoos = await knex('zoos');
    res.status(200).json(allZoos);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// [GET], '/api/zoos/:id'
// returns an array of zoo object with specific ID
// SELECT * FROM zoos WHERE id = req.params.id;
app.get('/api/zoos/:id', async (req, res) => {
  const zooId = req.params.id;
  try {
    const oneZoo = await knex('zoos').where('id', zooId);
    if (oneZoo.length) {
      res.status(200).json(oneZoo);
    } else {
      res.status(404).json({ message: `Zoo with ID ${zooId} does not exist.` });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

// [DELETE], '/api/zoos/:id'
// returns number of affected rows in DB
// DELETE FROM zoos WHERE id = 4;
app.delete('/api/zoos/:id', (req, res) => {
  const zooId = req.params.id;
  knex('zoos').where('id', zooId).del()
    .then(deletedZoo => {
      if (deletedZoo >= 1) {
        res.status(200).json(deletedZoo);
      } else {
        res.status(404).json({ message: `Zoo with ID ${zooId} does not exist.` });
      }
    })  
    .catch(error => res.status(500).json({ error }));
});

// [PUT], '/api/zoos/:id', requires { name: "value" }
// returns number of affected rows in DB
// UPDATE zoos SET "name" = "Birdie" WHERE id = 7;
app.put('/api/zoos/:id', (req, res) => {
  const zooId = req.params.id;
  const updatedZoo = req.body;
  if (updatedZoo.name) {
    knex('zoos').where('id', zooId).update(updatedZoo)
      .then(newZoo => {
        if (newZoo >= 1) {
          return knex('zoos').where('id', zooId);
        } else {
          res.status(404).json({ message: `Zoo with ID ${zooId} does not exist.` });
        }
      })
      .then(updatedZooObj => res.status(200).json(updatedZooObj)) 
      .catch(error => res.status(500).json({ error }));
  } else {
    res.status(400).json({ message: 'Please include name inside the body of the request' });
  }
});


const port = 3300;
app.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
