let express = require('express')
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const greetings = require('./greetings')
const Greet = greetings()

let app = express()

const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});

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
        
         Greet.setUserName(req.body.theNames);
         Greet.setLanguage(req.body.language);
         Greet.pushName(req.body.theNames);
         Greet.greetingsCounter()
         
         res.redirect('/')
});

app.post('/action', function (req, res) {

    console.log(req.body.language)
    res.render('index', { output: Greet.languageSelected(req.body.language, req.body.theNames) })
    res.redirect('/')
})

app.get('/counter', function (req, res) {

    res.redirect('/')
})

app.post('/counter/<USER_NAME>', function (req, res) {

})

let PORT = process.env.PORT || 3018;

app.listen(PORT, function () {
    console.log("App started at PORT: ", PORT);
});