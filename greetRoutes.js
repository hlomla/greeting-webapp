module.exports = function (Greet) {


    async function home(req, res) {


        res.render('index', {
            counter: await Greet.allUser()

        })
    }

    async function home_(req, res) {
        var name = req.body.theNames
        var lang = req.body.language

        //
        console.log(name);
        if (!name) {
            // console.log(lang);
            req.flash('error', 'Please enter a name!');
        }
        else if (!lang) {

            req.flash('error', 'Please select a language!')
        }
        else {
            await Greet.insertNames(name);
            (lang === lang && name === name)
            req.flash('success', 'Name is added successfully!')
        }
        res.render('index', {
            counter: await Greet.allUser(),
            output: await Greet.languageSelected(req.body.language, name)
        })
    }

    async function greets(req, res) {
        let namesGreeted = await Greet.getNameList();
        res.render('userList', { listOfNames: namesGreeted })
    }
    async function names(req, res) {
        let greetedName = req.params.theNames;
        let greetedCounts = await Greet.greetingsCounter(greetedName);
        res.render('timesGreeted', {
            names: greetedName,
            counts: greetedCounts
        })
    }
    async function btnReset(req, res){
        await Greet.resetBtn();
        req.flash('key', 'Database has been cleared successfully!');
        res.redirect('/');
    }

    return {
        home,
        home_,
        greets,
        names,
        btnReset
    }
}