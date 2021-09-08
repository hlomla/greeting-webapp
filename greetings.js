module.exports = function Greet(pool) {


    //create map to store names
    var namesList = {};
    var languages;
    var User = "";

    async function insertNames(name) {
        try {
            var ifNameExist = await pool.query('select names from usergreet where names=$1', [name])
            if (ifNameExist.rowCount === 0) {
                await pool.query('insert into usergreet(names,counts) values($1,$2)', [name, 1])
            }
            else {
                await pool.query('Update usergreet SET counts=counts+1 where names=$1', [name])
            }
            // if (ifNameExist[name] === undefined) {
            //     ifNameExist[name] = 1
            //     // await pool.query('insert into usergreet(names,counts) values=$1')
            // }
            // else {
            //     ifNameExist[name]++
            // }
        } catch (error) {
            console.error("error is here!!!", error)
        }

    }


    async function allUser() {
        try {

            let totalNames = await pool.query("select * from userGreet")
            return totalNames.rows.length
        } catch (error) {
            console.error("error message!!", error)
        }
    }


    function setLanguage(lang) {
        languages = lang;

    }

    async function getLanguage() {
        return languages;
    }

    async  function setUserName(names) {
        User = names;
    }

    async function getUserName() {
        return User;

    }

    async function languageSelected() {
        var lang = languages
        var name = User.charAt(0).toUpperCase() + User.slice(1).toLowerCase();

        if ( lang === "isiXhosa") {
            return "Molo, " + name
        }
        if (lang === "Greek") {
            return "Geia, " + name;
        }
        if (lang === "English") {
            return "Hello, " + name;
        }
    }

    //store names in the object map
    // async function pushName(name) {
    //     try {
    //         let names = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    //         if (namesList[names] === undefined) {
    //     namesList[names] = 1
    // }
    // else {
    //     namesList[names]++
    // }

    //     } catch (error) {

    //     }
    // }

    async function getNameList() {
        let userList = await pool.query('SELECT * FROM usergreet ORDER BY names')
        return userList.rows;
    }

    async function greetingsCounter() {
        var nameList = pool.query('select names from usergreet');
        return nameList.rowCount;

        // async function getForEach(name) {
        //     const db = await pool.query('SELECT count FROM greetedNames WHERE userName = $1', [name]);
        //     return db.rows[0].count;
        // }

        // async function (req, res) {
        //     var name = req.params.username;
        //     var nameCount = await greetInsta.getForEach(name)
        //     res.render("counter", {
        //         name,
        //         nameCount
        //     });
        // }
    }

    function errorMsg(language, myName) {

        if (language === null && myName.trim().length === 0) {
            return "Please enter name and select language!"
        }

        if (!myName || myName.trim().length === 0) {
            return "Please enter name!"
        }

        if (language === null) {
            return "Please select a language!"
        }
        return '';
    }
    function timeOutErr() {
        return ""
    }

    return {
        setLanguage,
        getLanguage,
        setUserName,
        getUserName,
        // pushName,
        greetingsCounter,
        languageSelected,
        getNameList,
        errorMsg,
        timeOutErr,
        allUser,
        insertNames
    }
}
