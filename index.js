
let express = require('express')
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const connectFlash = require('connect-flash');
const flash = require('express-flash');
const session = require('express-session');
const greetings = require('./greetings')
const pg = require("pg");
const Pool = pg.Pool;

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local){
    useSSL = true;
} 

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost:5432/my_database';

const pool = new Pool({
    connectionString,
    ssl : useSSL
  });


const Greet = greetings(pool)


let app = express()

app.engine('handlebars', exphbs({ 
partialsDir: "./views/partials", 
viewPath: './views', 
layoutsDir: './views/layouts' 
}));

app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded());

app.use(session({
    secret : "<add a secret string here>",
    resave: false,
    saveUninitialized: true
  }));


app.use(express.static('public'));

app.get('/', async function (req, res) {
console.log("the counter ==> "+ await Greet.allUser());

    res.render('index', {

        counter: await Greet.allUser(),
        theNames: await Greet.insertNames(),
        output: await Greet.languageSelected()
    })
    
})

app.post('/greet', async function (req, res) {
var name = req.body.theNames

// console.log(name + "Sdsdsdsddsds");
    if(name ===""){
        req.flash('error', await Greet.errorMsg());

    }else{
       await Greet.insertNames(name);
       Greet.setLanguage(req.body.language);
       Greet.setUserName(name)
    //    console.log('the message is ' + await Greet.languageSelected())
    //    await Greet.pushName(name);
    //    await Greet.greetingsCounter()
    }
   

    // req.flash('message', Greet.errorMsg())

    res.redirect('/')
    
});

app.post('/action', function (req, res) {

    console.log(req.body.language)
    res.render('index', { output: Greet.languageSelected(req.body.language, req.body.theNames) })
    res.redirect('/')
})

app.get('/greeted', async function (req, res) {

    let namesGreeted = await Greet.getNameList();
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

let PORT = process.env.PORT || 3001;

app.listen(PORT, function () {
    console.log("App started at PORT: ", PORT);
});