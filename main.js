var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Session = require('./Routes/Session.js');
var Validator = require('./Routes/Validator.js');
var CnnPool = require('./Routes/CnnPool.js');
var async = require('async');
var fs = require('fs')

var app = express();
var port = 3001;
if (process.argv.indexOf("-p") != -1) { //does our flag exist?
   port = parseInt(process.argv[process.argv.indexOf("-p") + 1]); //grab the next item
}
//app.use(function(req, res, next) {console.log("Hello"); next();});
// Static paths to be served like index.html and all client side js
app.use(express.static(path.join(__dirname, 'client/build')))
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
   // 2 more access control
   console.log("Handling " + req.path + '/' + req.method);
   res.header("Access-Control-Allow-Origin", "http://localhost:"+port);
   res.header("Access-Control-Allow-Credentials", true);
   res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// No further processing needed for options calls.
app.options("/*", function(req, res) {
   res.status(200).end();
});

// Static path to index.html and all clientside js
// Parse all request bodies using JSON
app.use(bodyParser.json());

// Attach cookies to req as req.cookies.<cookieName>
app.use(cookieParser());

// Set up Session on req if available
app.use(Session.router);

// Check general login.  If OK, add Validator to |req| and continue processing,
// otherwise respond immediately with 401 and noLogin error tag.
app.use(function(req, res, next) {
   console.log(req.path);
   if (req.session || (req.method === 'POST' &&
    (req.path === '/REST/Prss' || req.path === '/REST/Ssns'))) {
      req.validator = new Validator(req, res);
      console.log("At creation of validator")
      next();
   } else
      res.status(401).end();
});

// Add DB connection, with smart chkQry method, to |req|
app.use(CnnPool.router);

// Load all subroutes
app.use('/REST/Msgs', require('./Routes/Conversation/Msgs.js'))
app.use('/REST/Prss', require('./Routes/Account/Prss.js'));
app.use('/REST/Ssns', require('./Routes/Account/Ssns.js'));
app.use('/REST/Cnvs', require('./Routes/Conversation/Cnvs.js'));

// Special debugging route for /DB DELETE.  Clears all table contents,
//resets all auto_increment keys to start at 1, and reinserts one admin user.
app.delete('/REST/DB', function(req, res) {
   // Callbacks to clear tables
   if(!req.session.isAdmin()){
      res.status(403).end()
      req.cnn.release()
      return
   }
   var cbs = ["Project", "Comment", "Person", "Likes"].
               map(function(tblName) {
      return function(cb) {
         req.cnn.query("delete from " + tblName, cb);
      };
   });

   // Callbacks to reset increment bases
   cbs = cbs.concat(["Project", "Comment", "Person", "Likes"].
         map(function(tblName){
      return function(cb) {
         req.cnn.query("alter table " + tblName + " auto_increment = 1", cb);
      };
   }));

   // Callback to reinsert admin user
   cbs.push(function(cb) {
      req.cnn.query('INSERT INTO Person (email, handle,' +
          ' password, role) VALUES ' +
          '("admin@aol.net", "admin", "password", 1);', cb);
   });

   // Callback to clear sessions, release connection and return result
   cbs.push(function(callback){
      for (var session in Session.sessions)
         delete Session.sessions[session];
      callback();
   });

   async.series(cbs, function(err) {
      req.cnn.release();
      if (err)
         res.status(400).json(err);
      else
         res.status(200).end();
   });
});
app.use(function(err, req, res, next) {
   if(err){
      console.log(err.stack);
      res.status(500).end();
   }
   req.cnn && req.cnn.release();
});

app.use(function(req, res) {
   console.log("404");
   res.status(404).end();
   req.cnn && req.cnn.release();
});



app.listen(port, function () {
   console.log('App Listening on port '+port);
});
