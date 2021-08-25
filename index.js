
let express = require('express')
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const connectFlash = require('connect-flash');
const flash = require('express-flash');
const session = require('express-session');

const greetings = require('./greetings')
const Greet = greetings()

let app = express()

const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});

app.use(session({
    secret : "<add a secret string here>",
    resave: false,
    saveUninitialized: true
  }));


//  var x = async function(){
//   var users = await pool.query('select * from users');    
//   return users.rows
//   }

//   await x()

app.use(flash());

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function (req, res) {

    res.render('index', {

        counter: Greet.greetingsCounter(),
        theNames: Greet.getUserName(),
        output: Greet.languageSelected()
    })
    
})

app.post('/', function (req, res) {
var name = req.body.theNames;
    if(name ===""){
        req.flash('error', Greet.errorMsg());

    }else{
        Greet.setUserName(name);
        Greet.setLanguage(req.body.language);
        Greet.pushName(name);
        Greet.greetingsCounter()
    }
   

    // req.flash('message', Greet.errorMsg())

    res.redirect('/')
    
});

app.post('/action', function (req, res) {

    console.log(req.body.language)
    res.render('index', { output: Greet.languageSelected(req.body.language, req.body.theNames) })
    res.redirect('/')
})

app.get('/greeted', function (req, res) {

    let namesGreeted = Greet.getNameList();
    res.render('userList', { listOfNames: namesGreeted })
})

app.get('/counter/:theNames', function (req, res) {

    let greetedName = req.params.theNames;
    let namesGreeted = Greet.getNameList();
    res.render('timesGreeted', {
        name: greetedName,
        counter: namesGreeted[greetedName]
    })
})

let PORT = process.env.PORT || 3018;

app.listen(PORT, function () {
    console.log("App started at PORT: ", PORT);
});