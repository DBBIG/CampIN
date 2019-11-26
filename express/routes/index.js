var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var request = require('request');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'qlrvka94!',
  port     : 3306,
  database : 'dbbig'
});

connection.connect(()=>{
  console.log('connect');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/search/name', function(req, res, next){
  connection.query(
    'SELECT name, address from CampingSite where name like ?'
    , ["%"+req.query.name+"%"]
    , function(err, rows, fields) {
    if (!err){
      console.log(rows);
      res.render('index', {keyword:rows, title: 'CampIN'});}
    else
      console.log('Error while performing Query.', err);
  });
})

router.get('/search/address', (req, res) => {
    connection.query(
      'SELECT name, address from CampingSite where address like ?'
      ,["%"+req.query.address+"%"]
      , function(err, rows, fields) {
        if (!err){
          console.log(rows);
          res.render('index', {keyword:rows, title: 'CampIN'});
        }
        else
          console.log('Error while performing Query.', err);
   });
});

router.get('/search/rank', (req, res) => {
  connection.query('SELECT name, address from CampingSite where cp_id in (select cp_id from CampingSiteGrade where grade = ?)',
  ["%"+req.query.rank+"%"], function(err, rows, fields) {
    if (!err){
      console.log(rows);
      res.render('index', {keyword:rows, title: 'CampIN'});}
    else
      console.log('Error while performing Query.', err);
   });
});

router.get('/search/available', (req, res) => {
  connection.query('SELECT grade, available_sites, total_sites from CampingSiteGrade where cp_id = ?',
  ["%"+req.query.cp_id+"%"], function(err, rows, fields) {
    if (!err){
      console.log(rows);
      res.render('index', {keyword:rows, title: 'CampIN'});}
    else
      console.log('Error while performing Query.', err);
   });
});

router.get('/search/facility/cp_id', (req, res)=>{
  connection.query('select name from CampingSiteFacility where cp_id = ?',
  [req.query.cp_id],
  function(err, rows, fields){
    if(!err){
      console.log(rows);
      res.render('index', {result: rows, title: 'CampIN'})
    }
    else
      console.log('Error while performing Query.', err);
  });
})

router.get('/search/facility/type', (req, res)=>{
  connection.query('select type from FacilityDefine where name = ?',
  [req.query.name],
  function(err, rows, fields){
    if(!err){
      console.log(rows);
      res.render('index', {result: rows, title: 'CampIN'})
    }
    else
      console.log('Error while performing Query.', err);
  });
})

router.post('/reservation', (req, res) => {
  var {r_id, cp_id, user_id, grade, date} = req.body;
  connection.query('INSERT INTO Reservation(r_id, cp_id, user_id, grade, date) VALUES (?, ?, ?, ?, ?)',
  [r_id, cp_id, user_id, grade, date],
  function(err, rows, fields){
    if(!err){
      console.log(rows);
      res.render('index', {result: rows, title: 'CampIN'})
    }
    else console.log('Error while performing Query.', err);
  });
})

router.get('/reservation/check', (req, res)=>{
  connection.query('select * from Reservation where user_id = ?',
  [req.query.user_id],
  function(err, rows, fields){
    if(!err){
      console.log(rows);
      res.render('index', {result: rows, title: 'CampIN'})
    }
    else console.log('Error while performing Query.', err);
  });
})

router.delete('/reservation', (req, res)=>{
  connection.query('delete from reservation where r_id = ?',
  [req.query.r_id],
  function(err, rows, fields){
    if(!err){
      console.log(rows);
      res.render('index', {result: rows, title: 'CampIN'})
    }
    else console.log('Error while performing Query.', err);
  });
})


router.get('/api', (req, res)=>{
})
module.exports = router;