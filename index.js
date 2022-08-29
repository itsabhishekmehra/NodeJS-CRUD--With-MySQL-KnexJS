const express = require('express');
var app = express();
// app.use(express.json())
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var port = process.env.PORT || 2022;

// db connection
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'Abhi@123',
        database: 'NG'
    }
});

// simple create table

// knex.schema.createTable('students', function (table) {
//     table.increments();
//     table.string('name');
//     table.string('email');
//     table.string('password');
//     table.timestamps();
// }).then(() => {
//     console.log("Students table created...");
// }).catch((err) => {
//     console.log(err, "Students can't be created...");
// })


// has table
knex.schema.hasTable('students').then(function (exists) {
    if (!exists) {
        return knex.schema.createTable('students', function (t) {
            t.increments('id').primary();
            t.string('name', 100);
            t.string('email', 100).unique();
            t.string('password', 50);
        });
    }
}).then(() => {
    console.log("Students table created...");
}).catch((err) => {
    console.log(err, "Students can't be created...");
})


// This is for Delete Table
// knex.schema.dropTable('students').then(() => {
//     console.log("Students Table Deleted...Success");
// }).catch((err) => {
//     console.log(err, "delete me error ara hai");
// })


// routes are define below
app.post('/addstudent', (req, res) => {
    const bodyData = req.body;
    knex('students').insert(bodyData).then((Data) => {
        bodyData['id'] = Data[0]
        res.send({ 'status': 'success', 'data': bodyData })
    }).catch((err) => {
        console.log(err, "Errrrrrrrrrr");
        res.send({ 'status': "error", 'message': err.sqlMessage })
    })
})


// This is for get all the users at once.
app.get('/allstudents', (req, res) => {

    knex('students').then((data) => {
        res.json(data)
    })
        .catch((err) => {
            console.log(err, "View ka data lane me error ara hai...");
        });
})


// This is for get the user by id.
app.get('/getstudent/:id', (req, res) => {
    knex('students')
        .where({ id: parseInt(req.params.id) })
        .then((data) => {
            // console.log(data, "hello deleted data");
            if (data.length > 0) {
                // console.log("inside wala");
                res.send({ 'data': data, 'message': `${req.params.id} Data Got successfully!` })
            } else {
                // console.log("outsidewala");
                res.send({ 'message': `${req.params.id} user not found!`, 'errorCode': 404 })
            }
        }).catch((err) => {
            console.log(err, "Some Error Came...");
            res.send(err)
        })
})


// This is for update the user by id.
app.put('/updatestudent/:id', (req, res) => {
    const bodyData = req.body;
    knex('students')
        .where({ id: req.params.id })
        .update({
            "name": req.body.name,
            "email": req.body.email,
            "password": req.body.password
        }).then((updatedata) => {
            console.log(updatedata, "updatedata hai ye ....");
            if (!updatedata) {
                console.log(updatedata, "id not exists");
                res.send({'message': 'invalid id'})
            } else {
                console.log(updatedata, "Updated Successfull...");
                res.send("Data Updated")

            }
        }).catch((err) => {
            console.log(err, "Something went wrong");
        })
})


// This is for delete the user by id.
app.delete('/deletestudent/:id', (req, res) => {
    knex('students')
        .where({ id: parseInt(req.params.id) })
        .del()
        .then((delData) => {
            if (delData) {
                console.log("inside wala");
                res.send({ 'data': delData, 'message': `${req.params.id} Data deleted successfully!` })
            } else {
                console.log("outsidewala");
                res.send({ 'message': `${req.params.id} user not found!`, 'errorCode': 404 })
            }
        }).catch((err) => {
            console.log(err, "Some Error Came...");
            res.send(err)
        })
})


app.listen(port, () => {
    console.log("server is runnin..");
})