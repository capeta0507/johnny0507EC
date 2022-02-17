const express = require('express');
const app = express();

// Server listen
const PORT = 8060;
app.listen(PORT,()=>{
  console.log(`Running on http://localhost:${PORT}`);
});

app.get('/',(req,res)=>{
  console.log('/ ...');
  res.send("<h1>---INDEX---</h1>");
});

app.get('/home',(req,res)=>{
  console.log('/home ...');
  res.send("<h1>---HOME---</h1>");
});

app.get('/about',(req,res)=>{
  console.log('/about ...');
  res.send("<h1>---About---</h1>");
});