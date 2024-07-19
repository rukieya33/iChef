const express = require('express');
const app = express();
const port = 3000;
let db;

const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'iChefDB',
  password: 'roses',
  port: 5432,
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

function insertData(insertQuery, item)
{

client.query(insertQuery, [item])
  .then(res => {
    console.log('Data inserted:', res.rows[0]);
    return res.rows
  })
  .catch(err => {
    console.error('Error inserting data', err.stack);
  })
  .finally(() => {
    client.end()
      .then(() => console.log('Client disconnected'))
      .catch(err => console.error('Error disconnecting', err.stack));
  })
}
  // Create
app.post('/sign_up', async (req, res) => {

  try {
    const insertQuery = `
    INSERT INTO registration (sign_up_data)
    VALUES ($1)
    RETURNING *;
  `;
  
    const item = req.body;
    const result = insertData(insertQuery, item)
    res.status(201).json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
  
});

// Read
app.get('/sign_up', (req, res) => {
  if(req.body != null)
  {
  res.send(JSON.stringify({req.body}));
  }
  else{
    res.send("Unsuccessful or no data sent")
  }
});

// Update
app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  let item = items.find(i => i.id === id);
  if (item) {
    Object.assign(item, req.body);
    res.send(item);
  } else {
    res.status(404).send({ message: 'Item not found' });
  }
});

// Delete
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  items = items.filter(i => i.id !== id);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
