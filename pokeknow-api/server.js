const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv')

const router = express.Router()
const app = express();
app.use(cors({
  methods: ['GET', 'POST','PUT','DELETE','OPTIONS'],
}));
app.options('*', cors());
app.use(bodyParser.json());

const secretKey = process.env.SECRET_KEY; 

const db = mysql.createConnection({
  host: 'db.3wa.io',
  user: 'paulboraakcan',
  password: '69dc08b104327ccc21be18113881d949',
  database: 'paulboraakcan_pokeknow',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.get('/pokemon/stats', (req, res) => {
  const query = 'SELECT * FROM pokemonstats';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});

app.get('/pokemon/stats/:id', (req, res) => {
    const query = `SELECT * FROM pokemonstats WHERE no = ${req.params.id}`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
        return;
      }
      res.json(results);
    });
  });

  app.get('/user/profile/:id', (req, res) => {
    const query = `SELECT * FROM users WHERE id = '${req.params.id}'`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
        return;
      }
      res.json(results);
    });
  })

  app.get('/user/team/:id', (req, res) =>{
    const query = `SELECT * FROM teams WHERE user_id = '${req.params.id}'`; 
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
        return;
      }
      res.json(results);
    });
  })

  app.post('/user/team/:id', async (req,res) => {
    let user = req.params.id
    let pokemon = req.body.pokemonId
    console.log(user,pokemon)

    const query = `INSERT INTO teams (user_id, pokemon_no) VALUES ('${user}','${pokemon}')`
      db.query(query, (err, results) => {
        if(err){
          console.error(err);
          return
        }
        res.json(results)
      })
  })

  app.post('/signup' , async (req, res) => {
    let username = req.body.username;
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const query = `INSERT INTO users (username, password_hash) VALUES ('${username}','${hashedPassword}')`
      db.query(query, (err, results) => {
        if(err){
          console.error(err);
          return
        }
        res.json(results)
      })
  })

  app.post('/login' , (req, res) => {
    const { username, password } = req.body;

    db.query(`SELECT * FROM users WHERE username = '${username}'`,(err, results) => {
      if (err){
        console.error(err)
      }
      if (!results[0] ||!(bcrypt.compareSync(password, results[0].password_hash))){
        return res.status(401).json({ error: "Invalid credentials" });
      }
        const token = jwt.sign({ userId: results[0].id, isAdmin: results[0].is_admin }, secretKey, { expiresIn: '1h' });
        res.cookie("SESSION", token, {httpOnly:true, secure:true})
        return res.status(200).json({ message: "Login successful", token });
    })
  })

  app.get('/users', (req, res) => {
    const query = `SELECT * FROM users`
    db.query(query , (err, results) => {
      if(err){
        console.error(err);
        return
      }
      res.json(results)
    })
  })
  
  app.put('/users/:id/admin-status', async (req, res) => {
    const user = req.params.id;
    const { isAdmin } = req.body;
    const role = isAdmin ? '0' : '1';
    const query = `UPDATE users SET is_admin = '${role}' WHERE id = '${user}'`
    db.query(query , (err, results) => {
      if(err){
        console.error(err);
        return
      }
      res.json(results)
    })
  })

  app.delete('/users/:id', async (req, res) => {
    const user = req.params.id;
    const query = `DELETE FROM users WHERE id = '${user}'`
    db.query(query , (err, results) => {
      if(err){
        console.error(err);
        return
      }
      res.json(results)
    })
  })


  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });


