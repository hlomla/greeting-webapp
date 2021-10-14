module.exports = function Greet(pool) {
    var namesList = {};
    var languages;
    var User = "";

    async function insertNames(users) {

        try {
            var people = users.charAt(0).toUpperCase() + users.slice(1).toLowerCase();
            var ifNameExist = await pool.query('select names from usergreet where names=$1', [people]);

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

    async function languageSelected(lang, name) {
        var name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    if(name !== "" && lang !== undefined){        
    if (lang === "isiXhosa") {
            return "Molo, " + name;
        }
        else if (lang === "Greek") {
            return "Geia, " + name;
        }
        else if (lang === "English") {
            return "Hello, " + name;
        }
        
    }
}
    async function getNameList() {
        let userList = await pool.query('SELECT names,counts FROM usergreet ORDER BY names')
        return userList.rows;
    }

    async function greetingsCounter(name) {
        var namesList = await pool.query('select * from usergreet WHERE names =$1', [name]);

        return namesList.rows[0].counts
    }

    async function resetBtn() {
        await pool.query('DELETE FROM usergreet')
    }
    return {
        greetingsCounter,
        languageSelected,
        getNameList,
        allUser,
        insertNames,
        resetBtn
    }
}
