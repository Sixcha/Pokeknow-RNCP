const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv')

const router = express.Router()
const app = express();
app.use(cors());

app.use(bodyParser.json());

const secretKey = 'Ihaveneverseenaduck'; 

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Lar1ssa.',
  database: 'pokeknow',
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
    const query = `SELECT * FROM pokemonstats WHERE no = ?`;
    db.query(query, [req.params.id], (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
        return;
      }
      res.json(results);
    });
  });

  app.get('/pokemon/moves/:id', (req, res) => {
    const query = `SELECT pokemonstats.no, pokemonmoves.move_rank, movedetails.* FROM pokemonstats JOIN pokemonmoves ON pokemonstats.no = pokemonmoves.pokemon_no JOIN movedetails ON movedetails.movename = pokemonmoves.move_name WHERE no = ?`;
    db.query(query, [req.params.id], (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
        return;
      }
      res.json(results);
    });
  });

    // app.get('/pokemon/abilities/:id', (req, res) => {
  //   const query = `SELECT pokemonstats.ability1, pokemonabilities.name FROM pokemonstats WHERE no = ${req.params.id} INNER JOIN pokemonabilities ON pokemonstats.ability1 = pokemonabilities.name`;
  //   db.query(query, (err, results) => {
  //     if (err) {
  //       console.error('Error fetching data:', err);
  //       res.status(500).send('Error fetching data');
  //       return;
  //     }
  //     res.json(results);
  //   });
  // });

  app.get('/user/profile/:id', (req, res) => {
    const query = `SELECT * FROM users WHERE id = ?`;
    db.query(query, [req.params.id], (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
        return;
      }
      res.json(results);
    });
  })

  app.get('/user/team/:id', (req, res) =>{
    const query = `SELECT * FROM teams WHERE user_id = ?`; 
    db.query(query, [req.params.id], (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
        return;
      }
      res.json(results);
    });
  })

  app.post('/user/team/:id', async (req,res) => {
    const user = req.params.id
    const pokemon = req.body.pokemonId

    const query = `INSERT INTO teams (user_id, pokemon_no) VALUES (?, ?)`
      db.query(query, [user, pokemon], (err, results) => {
        if(err){
          console.error(err);
          return
        }
        res.json(results)
      })
  })

  app.post('/signup' , async (req, res) => {
    const username = req.body.username;

    const nameQuery = `SELECT * FROM users WHERE username = ?`
    db.query(nameQuery, [username], (err, results) => {
      if(err){
        return res.status(500).json({ message: 'Error checking username', err });
      }
      if (results.length > 0) {
        return res.status(200).json({ message: 'Username is already taken', available: false });
      }
    })

    // const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const query = `INSERT INTO users (username, password_hash) VALUES (? , ?)`
      db.query(query, [username, req.body.password], (err, results) => {
        if(err){
          console.error(err);
          return
        }
        res.json(results)
      })
  })

  app.post('/login' , (req, res) => {
    const { username, password } = req.body;
    
    const query = `SELECT * FROM users WHERE username = ?`

    db.query(query, [username], (err, results) => {
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
    const userId = req.params.id;
    const { isAdmin } = req.body;
    const newRole = isAdmin ? '1' : '0';
    const updateQuery = `UPDATE users SET is_admin = ? WHERE id = ?`
    const selectQuery = `SELECT * FROM users WHERE id = ?`;

    db.query(updateQuery , [newRole, userId], (err, results) => {
      if(err){
        console.error(err);
        res.status(500).send('Failed to update admin status');
        return
      }
    })

    db.query(selectQuery, [userId], (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Failed to fetch updated user');
        return;
      }
      console.log(updatedUser)
      res.json(updatedUser[0]);
    });

  })

  app.delete('/users/:id', async (req, res) => {
    const user = req.params.id;
    const query = `DELETE FROM users WHERE id = ?`
    db.query(query , [user], (err, results) => {
      if(err){
        console.error(err);
        return
      }
      res.json(results)
    })
  })

  app.delete('/:user/team/remove/:id', async (req,res) => {
    let {user, id} = req.params

    const query = `DELETE FROM teams WHERE user_id = ? AND pokemon_no = ? LIMIT 1`
    db.query(query, [user, id], (err, results) => {
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


