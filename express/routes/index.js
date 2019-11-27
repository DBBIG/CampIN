var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection(
    {host: 'localhost', user: 'root', password: 'qlrvka94!', port: 3306, database: 'dbbig'}
);

connection.connect(() => {
    console.log('connect');
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'CampIN'});
});

router.get('/search/name', function (req, res, next) {
    connection.query(
        'SELECT name, address, cp_id from CampingSite where name like ?',
        ["%" + req.query.name + "%"],
        function (err, rows, fields) {
            if (!err) {
                console.log(rows);
                res.render('search/name', {
                    keyword: req.query.name,
                    result: rows,
                    title: 'CampIN'
                });
            } else 
                console.log('Error while performing Query.', err);
            }
        );
})

router.get('/search', (req, res) => {
    res.render('search', {title: 'CampIN'});
});

router.get('/search/detail', (req, res) => {
    var cp_id = req.query.cp_id;
    data = {};
    connection.query(
        'select * from CampingSite where cp_id = ?',
        [cp_id],
        function (err, rows, fields) {
            if (!err) {
                data.result = rows;
                connection.query(
                    'select * from CampingSiteGrade where cp_id = ?',
                    [cp_id],
                    function (err, rows2, fields) {
                        if (!err) {
                            console.log(rows2);
                            data.gradeResult = rows2

                            connection.query(
                                'select type, name from FacilityDefine natural join(CampSiteFacility) where cp_' +
                                        'id = ? order by type',
                                [cp_id],
                                function (err, rows3, fields) {
                                    if (!err) {
                                        data.faci = rows3
                                        connection.query(
                                            'select grade, count(*) as count from reservation where cp_id = ? and date = ? ' +
                                                    'group by grade',
                                            [
                                                cp_id, req.query.date
                                            ],
                                            function (err, rows4, fields) {
                                                if (!err) {
                                                    console.log(rows4);
                                                    for (var i = 0; i < data.gradeResult.length; i++) {
                                                        data.gradeResult[i].available_sites = data.gradeResult[i].total_sites;
                                                        for (var j = 0; j < rows4.length; j++) {
                                                            if (rows4[j].grade == data.gradeResult[i].grade) {
                                                                data.gradeResult[i].available_sites -= rows4[j].count
                                                            }
                                                        }
                                                    }
                                                    res.render('search/detail', {
                                                        result: data.result,
                                                        gradeResult: data.gradeResult,
                                                        facilityResult: data.faci,
                                                        user_id: req.query.user_id,
                                                        cp_id: cp_id,
                                                        date: req.query.date
                                                    });
                                                } else 
                                                    console.log('Error while performing Query.', err);
                                                }
                                            );

                                    } else 
                                        console.log('Error while performing Query.', err);
                                    }
                                );
                        } else 
                            console.log('Error while performing Query.', err);
                        }
                    );
            } else 
                console.log('Error while performing Query. ', err);
            }
        );

})
router.get('/search/address', (req, res) => {
    connection.query(
        'SELECT name, address, cp_id from CampingSite where address like ?',
        ["%" + req.query.address + "%"],
        function (err, rows, fields) {
            if (!err) {

                console.log(rows);
                res.render('search/address', {
                    keyword: req.query.address,
                    result: rows,
                    title: 'CampIN'
                });
            } else 
                console.log('Error while performing Query.', err);
            }
        );
});

router.get('/search/rank', (req, res) => {
    connection.query(
        'SELECT name, address, cp_id from CampingSite where cp_id in (select cp_id from' +
                ' CampingSiteGrade where grade = ?)',
        [req.query.rank],
        function (err, rows, fields) {
            if (!err) {

                console.log(rows);

                res.render('search/rank', {
                    keyword: req.query.rank,
                    result: rows,
                    title: 'CampIN'
                });
            } else 
                console.log('Error while performing Query.', err);
            }
        );
});

router.get('/search/available', (req, res) => {
    connection.query(
        'SELECT grade, available_sites, total_sites from CampingSiteGrade where cp_id =' +
                ' ?',
        ["%" + req.query.cp_id + "%"],
        function (err, rows, fields) {
            if (!err) {
                console.log(rows);
                res.render('index', {
                    keyword: rows,
                    title: 'CampIN'
                });
            } else 
                console.log('Error while performing Query.', err);
            }
        );
});

router.get('/reservation', (req, res) => {
    res.render('reservation', {title: 'CampIN'});
});

router.get('/signup', (req, res) => {
    res.render('signUp', {title: 'CampIN'});
});

router.get('/search/facility/cp_id', (req, res) => {
    connection.query(
        'select name from CampingSiteFacility where cp_id = ?',
        [req.query.cp_id],
        function (err, rows, fields) {
            if (!err) {
                console.log(rows);
                res.render('index', {
                    result: rows,
                    title: 'CampIN'
                })
            } else 
                console.log('Error while performing Query.', err);
            }
        );
})

router.get('/search/facility/type', (req, res) => {
    connection.query(
        'select type from FacilityDefine where name = ?',
        [req.query.name],
        function (err, rows, fields) {
            if (!err) {
                console.log(rows);
                res.render('index', {
                    result: rows,
                    title: 'CampIN'
                })
            } else 
                console.log('Error while performing Query.', err);
            }
        );
})
router.post('/signup', (req, res) => {
    console.log(req.body);
    connection.query('insert into user (phone, name) values (?,?)', [
        req.body.phone, req.body.name
    ], function (err, rows, fields) {
        if (!err) {
            console.log(rows);
            res.render('signUped', {user_id: rows.insertId})
        } else 
            console.log('Error while performing Query.', err);
        }
    );
})
router.post('/reservation', (req, res) => {
    res.render('reservation', {title: "ss"});
})

router.get('/reservation/cancel', (req, res) => {
    res.render('reservation/cancel', {r_id: req.query.r_id});
})
router.get('/reservation/check', (req, res) => {
    connection.query(
        'select * from Reservation natural join(CampingSite) where user_id = ?',
        [req.query.user_id],
        function (err, rows, fields) {
            if (!err) {
                console.log(rows);
                res.render('reservation/check', {
                    user_id: req.query.user_id,
                    result: rows,
                    title: 'CampIN'
                })
            } else 
                console.log('Error while performing Query.', err);
            }
        );
})

router.get('/reservation/canceled', (req, res) => {
    connection.query(
        'delete from reservation where r_id = ?',
        [req.query.r_id],
        function (err, rows, fields) {
            if (!err) {
                console.log(rows);
                res.render('reservation/canceled', {r_id: req.query.r_id});
            } else 
                console.log('Error while performing Query.', err);
            }
        );
})

router.get('/search/state', (req, res) => {
    console.log(req.query.cp_id);
    res.render('search/state', {cp_id: req.query.cp_id});
})

router.post('/reservation/new', (req, res) => {
    console.log(req.body);
    var {
        cp_id,
        user_id,
        date,
        grade
    } = req.body;

    connection.query(
        'insert into reservation (cp_id, user_id, grade, date) values (?,?,?,?)',
        [
            cp_id, user_id, grade, date
        ],
        function (err, rows, fields) {
            if (!err) {
                console.log(rows);
                connection.query(
                    'update campingSite set used_time = used_time +1 where cp_id = ?',
                    [cp_id],
                    function (err, rows, fields) {
                        if (!err) {
                            console.log(rows);
                            res.render('reservation/new', {title: 'CampIN'})
                        } else 
                            console.log('Error while performing Query.', err);
                        }
                    );

            } else 
                console.log('Error while performing Query.', err);
            }
        );
})
module.exports = router;