
let express = require('express')
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const connectFlash = require('connect-flash');
const flash = require('express-flash');
const session = require('express-session');
const greetings = require('./greetings')
const routes = require('./greetRoutes')
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
    ssl:{ rejectUnauthorized: false}    
  });


const Greet = greetings(pool)
const greetingsRoutes = routes(Greet)



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

app.use(flash({ sessionKeyName: 'flashMessage' }));

app.use(express.static('public'));

app.get('/', greetingsRoutes.home)


//app.post('/', greetRoutes.root

app.post('/', greetingsRoutes.home_);

// app.post('/action', function (req, res) {
//    // res.render('index', { output: Greet.languageSelected(req.body.language, req.body.theNames) })
//     res.redirect('/')
// })

app.get('/greeted', greetingsRoutes.greets)

app.get('/counter/:theNames', greetingsRoutes.names)

app.get('/resetBtn', greetingsRoutes.btnReset)

let PORT = process.env.PORT || 3885;

app.listen(PORT, function () {
    console.log("App started at PORT: ", PORT);
});


