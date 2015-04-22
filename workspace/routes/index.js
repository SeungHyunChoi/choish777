var express = require('express');
var router = express.Router();
var pagination = require('pagination');
var querystring = require("querystring");
var url = require("url"); 

function TodayNewDate(){
    var newDate = new Date();
    var dateString = "";
    var tz = newDate.getTime() + (newDate.getTimezoneOffset() * 60000) + (9 * 3600000);
    newDate.setTime(tz);   
    
    dateString += newDate.getFullYear()+ "-";
    dateString += NewDateZero((newDate.getMonth() + 1)) + "-";
    dateString += NewDateZero(newDate.getDate()) + " ";
    dateString += NewDateZero(newDate.getHours()) + ":";
    dateString += NewDateZero(newDate.getMinutes()) + ":";
    dateString += NewDateZero(newDate.getSeconds());
    
    return dateString;
}

function NewDateZero(v){
    var date ="";
    if(parseInt(v) > 9){
        date = v;
    }else{
        date = '0' + v;        
    }
    return date;
}


/* GET home page. */
router.get('/', function(req, res) {
    var db = req.db;
    console.log('page = > '+req.query.page);
    var pageNum = querystring.parse(req.url)['/?page'];
 
 //   console.log(req.connection.remoteAddress);
 console.log(TodayNewDate());
    var collection = db.get('cshcollection');
    collection.find({},{},function(e,docs){
        res.render('index', {
            userlist : docs,
         });
    });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
	res.render('helloworld', { title: 'Hello, World!' });
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
    var userFullname = req.body.UserFullname;
    var userAge = req.body.UserAge;
    var userLocation = req.body.UserLocation;
    var gender = req.body.Gender;


    // Set our collection
    var collection = db.get('cshcollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail,
        "fullname" :userFullname,
        "userAge" : userAge,
        "userLocation" :userLocation,
        "gender" :gender,
        "regdt" : TodayNewDate()
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


/*
 * show user list
 */
router.post('/userlist/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
  //  console.log(userToDelete);

    var collection = db.get('cshcollection');
    // Submit to the DB  
    
    collection.find({
        "_id" : userToDelete
    }, function (err, doc) {
              //  console.log(doc);
              //console.log(JSON.stringify(doc));
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            res.writeHead(200, { 'Content-Type': 'application/json' }); 
            res.end(JSON.stringify(doc));
        }
    });

});

module.exports = router;