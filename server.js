console.log("hello")
const MongoClient = require('mongodb').MongoClient

// call the packages we need
var express    = require('express')      // call express
var bodyParser = require('body-parser')
var app        = express()     // define our app using express

// configure app to use bodyParser() and ejs
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.set('view engine','ejs');

// get an instance of the express Router
var router = express.Router();


app.get('/editMonkey', function(req,res) {
  var name = req.query.oldName
  var editName = req.params.name
  var location = req.params.location
  var food = req.params.food
  var photo = req.params.photo

  db.collection('monkeys').find({name:name}).toArray(function(err,result) {
      console.log(result)
      res.render('detail.ejs', {monkeyDetails: result[0]})
    })
})

app.post('/editSubmit', function(req,res){
  var a = req.body.name
  var b = req.body.location
  var c = req.body.food
  var d = req.body.oldName

  console.log(a)
  console.log(b)
  console.log(c)

  db.collection('monkeys').updateOne({"name":d}, { $set: { "location" : b, "name" : a, "food" : c} }, {upstart : true});
  res.redirect('/');
})


app.get('/deleteMonkey/:name', function(req,res){
    var monkeyName = req.params.name
  db.collection('monkeys').deleteOne({name:monkeyName}, function(err, obj) {
  console.log("1 document deleted");
  res.redirect('/');
});
})


app.get('/', function(req, res) {

  db.collection('monkeys').find().toArray((err, result) => {
    if(err) {console.log(err)}
    res.render('index.ejs', {monkeys: result})
  })
});



// all of our routes will be prefixed with /api
// app.use('/api', router);

// START THE SERVER
//==========================================================


var db
MongoClient.connect('mongodb://asuzuki:chick3n@ds054308.mlab.com:54308/allyn-database',{useNewUrlParser:true}, (err, client) => {
    if(err) { console.log(err) }
    console.log("Connected successfully to server");
    db = client.db('allyn-database');
    app.listen(port, () => {
        console.log('bananas')
    })
})




//where ‘items’ is a collection in the connected db and index is an ejs file that can access ‘pageItems’
app.get('/', function(req, res) {
  db.collection('monkeys').find({}).toArray((err, result) => {
	//  res.render('index.ejs', {pageItems: result});
   res.render('index.ejs', {monkeys: result});
  })
});

//where an HTML form posts to /contacts, a new record will be written with url, dogName, capt
//and redirects to the home page
app.post('/formSubmit', function (req, res) {
  var monkeyName = req.body.name
  var location = req.body.location
  var food = req.body.food
  var photo = Math.floor(Math.random() * 12) + ".jpg"

  if(monkeyName!= ""){
      db.collection('monkeys').save({name:monkeyName, location:location, food:food, photo:photo})
      
      res.redirect('/')
  }

})
