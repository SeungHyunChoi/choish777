var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('cshcollection');
    collection.find({},{},function(e,docs){
        res.render('index', {
            "userlist" : docs
        });
    });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
	res.render('helloworld', { title: 'Hello, World!' })
});
 

router.get('/gg', function(req, res) {
    var db = req.db;
    db.collection('cshcollection').find().toArray(function (err, items) {
        alert(items);
        res.json(items);
    });
});

 

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});


/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('cshcollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("/");
            // And forward to success page
            res.redirect("/");
        }
    });
});
 

/*
 * DELETE to deleteuser.
 */
router.post('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    console.log(userToDelete);

    var collection = db.get('cshcollection');
    // Submit to the DB    
    collection.remove({
        "_id" : userToDelete
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("/");
            // And forward to success page
            res.redirect("/");
        }
    });

});


module.exports = router;