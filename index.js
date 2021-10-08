
let express = require('express')
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const connectFlash = require('connect-flash');
const { flash } = require('express-flash-message');
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
    
    ssl:{ rejectUnauthorized: false
}    
  });


const Greet = greetings(pool)

pool


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

app.get('/', async function (req, res) {
    res.render('index', {     
        counter: await Greet.allUser(),
    })
    
})


app.post('/', async function (req, res) {
var name = req.body.theNames

    if(name === ""){
        req.flash('error',  await Greet.errorMsg());

    }else{
       await Greet.insertNames(name);
       Greet.setLanguage(req.body.language);
       Greet.setUserName(name);
    }
    res.render('index', {     
        counter: await Greet.allUser(),
        output: await Greet.languageSelected(req.body.language, name)
    }) 
});

app.post('/action', function (req, res) {
    res.render('index', { output: Greet.languageSelected(req.body.language, req.body.theNames) })
    res.redirect('/')
})

app.get('/greeted', async function (req, res) {

    let namesGreeted = await Greet.getNameList();
    res.render('userList', { listOfNames: namesGreeted })
})

app.get('/counter/:theNames', async function (req, res) {
    let greetedName = req.params.theNames;
    let greetedCounts = await Greet.greetingsCounter(greetedName);

    res.render('timesGreeted', {
        greetedName,
        greetedCounts
    })
})

app.get('/resetBtn', async function(req, res){
    await Greet.resetBtn();
    res.redirect('/');
})
// app.get('/the-route', function (req, res) {
//     try {
//     const errFlash = {
//         language: req.body.language,
//         name: req.body.theNames
//     }
//     if (language === null && myName.trim().length === 0) {
//         req.flash("error","Please enter name and select language!")
//     }

//     else if (!myName || myName.trim().length === 0) {
//         req.flash("error", "Please enter name!") 
//     }
//     else if (language === null) {
//         req.flash("error", "Please select a language!")
//     }
// } catch (error) {
//     console.log('flash has an error')

// }
//     res.redirect('/');
// });

let PORT = process.env.PORT || 3002;

app.listen(PORT, function () {
    console.log("App started at PORT: ", PORT);
});


