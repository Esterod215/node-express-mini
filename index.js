// implement your API here
const express = require('express');

const db = require('./data/db');

const server = express();

//middleWare
server.use(express.json());


server.get('/',(req,res) =>{
    res.send('Hello World');
});
server.get('/api/users', (req,res)=>{
    db.find()
    .then(users => {
        res.status(200).json({ success: true, users }); // sets the Content-Type header
    
    }).catch(err=>{
        res.status(500).json({success:false, message:'The users information could not be retrieved.'})
    })
});

server.post('/api/users',(req,res)=>{
   const { name, bio, created_at, updated_at } = req.body;
    if(!name || !bio) {
        res.status(400).json({message:"Must provide name and bio"})
        return;
    }
    
    db
    .insert({
        name, bio, created_at, updated_at
    })
    .then(response =>{
        res.status(201).json(response)
    }).catch(err=>{
        res.status(400).json({message: err})
        return;
    });
});

server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db
      .findById(id)
      .then(user => {
        if (user.length === 0) {
          res.status(404).json({success:false,message:'User with that id not found'});
          return;
        }
        res.json(user);
      })
      .catch(error => {
        res.status(500).json({message:'Error looking up user'});
      });
  });

  server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db
      .remove(id)
      .then(response => {
        if (response === 0) {
          res.status(404).json({message:'The user with that ID does not exist.'});
          return;
        }
        res.json({ success:true,message: `User with id: ${id} removed from system` });
      })
      .catch(error => {
        res.status(500).json({message:'The user could not be removed'});
        return;
      });
  });

  server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, bio } = req.body;
    if (!name || !bio) {
      res.status(400).json({message:'Must provide name and bio'});
      return;
    }
    db
      .update(id, { name, bio })
      .then(response => {
        if (response == 0) {
            res.status(404).json({message:'The user with the specified ID does not exist.'});
          return;
        }
        db
          .findById(id)
          .then(user => {
            if (user.length === 0) {
              res.status(404).json({message:'User with that id not found'});
              return;
            }
            res.json(user);
          })
          .catch(error => {
            res.status(500).json({message:'Error looking up user'});
          });
      })
      .catch(error => {
        res.status(500).json({message:'The user information could not be modified.'});
        return;
      });
  });













server.listen(3000,()=>{
    console.log('\n*** Running on port 3000 ***\n');
})