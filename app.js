// Tempelkan code untuk menggunakan express
const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config({path: 'config.env'});

// Tempelkan code untuk menspesifikasikan folder yang menyimpan file CSS dan gambar 
app.use('/public', express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended: false}));
app.set('view engine','ejs');

// Definisikan constant connection dan isikan dengan code informasi koneksi
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB,
  database: 'sql_db',
  port: '3306'
});

// Tambahkan route untuk halaman top
app.get('/', (req,res) => {
  res.render('top')
});

// Tambahkan route untuk halaman daftar belanjaan
app.get('/index', (req,res) => {
  // Ketik code untuk mengakses data dari database 
  connection.query(
    'SELECT * FROM items',
    (error, results) => {
    res.render('index.ejs', {items: results})  
  });
});

// Tambahkan route untuk menuju ke halaman penambahan item
app.get('/new', (req,res) => {
  res.render('new.ejs')
});

// Tambahkan method route untuk menambahkan item 
app.post('/create', (req, res) => {
  // Ketik query untuk menambahkan data ke database
  connection.query(
    'INSERT INTO items (name) VALUES(?)',
    [req.body.itemName],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.post('/delete/:id', (req, res) => {
  connection.query(
    'DELETE FROM items WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT * FROM items WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.render('edit.ejs', {item: results[0]});
    }
  );
});

app.post('/update/:id', (req, res) => {
  connection.query(
    'UPDATE items SET name = ? WHERE id =?',
    [req.body.itemName, req.params.id],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

// Tempelkan code untuk menjalankan server
app.listen(3000);
