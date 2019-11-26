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
  res.render('index', { title: 'CampIN' });
});

router.get('/search/name', function(req, res, next){
  connection.query(
    'SELECT name, address, cp_id from CampingSite where name like ?'
    , ["%"+req.query.name+"%"]
    , function(err, rows, fields) {
    if (!err){
      console.log(rows);
      res.render('search/name', {keyword:req.query.name, result:rows, title: 'CampIN'});}

    else
      console.log('Error while performing Query.', err);
  });
})

router.get('/search', (req, res) => {
    res.render('search', { title: 'CampIN' });
});

router.get('/search/detail', (req, res)=>{
  var cp_id = req.query.cp_id;
  data = {};
  connection.query(
      'select * from CampingSite where cp_id = ?'
      ,[cp_id]
      , function(err, rows, fields) {
        if (!err){
          data.result = rows;
          connection.query(
            'select * from CampingSiteGrade where cp_id = ?'
            ,[cp_id]
            , function(err, rows2, fields) {
            if (!err){
              data.gradeResult = rows2
              
              connection.query(
      'select type, name from FacilityDefine natural join(CampSiteFacility) where cp_id = ?'
      ,[cp_id]
      , function(err, rows3, fields) {
        if (!err){
          data.faci= rows3
          console.log(rows3);
          res.render('search/detail', {result: data.result, gradeResult : data.gradeResult, facilityResult: data.faci});
        }
        else
          console.log('Error while performing Query.', err);
    });
            }
            else
              console.log('Error while performing Query.', err);
          });
        }
        else
          console.log('Error while performing Query.', err);
    });

})
router.get('/search/address', (req, res) => {
    connection.query(
      'SELECT name, address, cp_id from CampingSite where address like ?'
      ,["%"+req.query.address+"%"]
      , function(err, rows, fields) {
        if (!err){

          console.log(rows);
          res.render('search/address', {keyword:req.query.address, result:rows, title: 'CampIN'});
        }
        else
          console.log('Error while performing Query.', err);
    });
});

router.get('/search/rank', (req, res) => {
  connection.query('SELECT name, address, cp_id from CampingSite where cp_id in (select cp_id from CampingSiteGrade where grade = ?)',
  ["%"+req.query.rank+"%"], function(err, rows, fields) {
    if (!err){

      console.log(rows);

      res.render('search/rank', {keyword:req.query.rank, result:rows, title: 'CampIN'});}

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

router.get('/reservation', (req, res) => {
    res.render('reservation', { title: 'CampIN' });
});

router.get('/signup', (req, res) => {
    res.render('signUp', { title: 'CampIN' });
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


module.exports = router;