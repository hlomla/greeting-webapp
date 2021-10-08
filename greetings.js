module.exports = function Greet(pool) {


    //create map to store names
    var namesList = {};
    var languages;
    var User = "";
   

    async function insertNames(users) {

        try {
            var people = users.charAt(0).toUpperCase() + users.slice(1).toLowerCase();
            
            var ifNameExist = await pool.query('select names from usergreet where names=$1', [people])
            if (ifNameExist.rowCount === 0) {
            
                await pool.query('insert into usergreet(names,counts) values($1,$2)', [people, 1])
            }
            else {
                await pool.query('Update usergreet SET counts=counts+1 where names=$1', [people])
            }
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

    async function setUserName(names) {
        User = names;
    }

    async function getUserName() {
        return User;

    }

    async function languageSelected(lang, name) {
        // var lang = languages
        var name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

        if (lang === "isiXhosa") {
            return "Molo, " + name;
        }
        if (lang === "Greek") {
            return "Geia, " + name;
        }
        if (lang === "English") {
            return "Hello, " + name;
        }
    }

    async function getNameList() {
        let userList = await pool.query('SELECT * FROM usergreet ORDER BY names')
        return userList.rows;
    }

    async function greetingsCounter(name) {
        var namesList = await pool.query('select * from usergreet WHERE names =$1', [name]);
        

        if (name) {
            var dtCounts = {};
            for (var i = 0; i < namesList.rows.length; i++) {
                dtCounts['names'] = namesList.rows.names;
                dtCounts['counts'] = namesList.rows.counts;
                if (namesList === name) {
                    dtCounts = namesList.rows[i];
                }
            }
            return namesList.rows
        }
    }

    async function getForEach(name) {
        const db = await pool.query('SELECT count FROM greetedNames WHERE userName = $1', [name]);
        return db.rows[0].count;
    }




     async function errorMsg(lang, name) {

        if (lang === null && name.trim().length === 0) {
            return "Please enter name and select language!"
        }

        if (!name || name.trim().length === 0) {
            return "Please enter name!"
        }

        if (lang === null) {
            return "Please select a language!"
        }
        return '';
    }
    function timeOutErr() {
        return ""
    }
    async function resetBtn() {
        await pool.query('DELETE FROM usergreet')
    }
    return {
        setLanguage,
        getLanguage,
        setUserName,
        getUserName,
        getForEach,
        greetingsCounter,
        languageSelected,
        getNameList,
        errorMsg,
        timeOutErr,
        allUser,
        insertNames,
        resetBtn
    }
}
