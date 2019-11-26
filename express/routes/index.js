var express = require('express');
var router = express.Router();
var mysql = require('mysql');

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
      console.log('The solution is: ', rows);
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
          console.log('The solution is: ', rows);
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
      console.log('The solution is: ', rows);
      res.render('index', {keyword:rows, title: 'CampIN'});}
    else
      console.log('Error while performing Query.', err);
   });
});

router.get('/reservation', (req, res) => {
    res.render('reservation/reservation', { title: 'CampIN' });
});

module.exports = router;