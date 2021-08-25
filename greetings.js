module.exports = function Greet(name) {


    //create map to store names
    var namesList = {};
    var languages;
    var User = "";


    function setLanguage(lang) {
        languages = lang;

    }
    function getLanguage() {
        return languages;
    }

    function setUserName(names) {
        User = names;
    }

    function getUserName() {
        return User;
    }

    function languageSelected() {

        if (getLanguage() === "isiXhosa") {
            return "Molo, " + getUserName().charAt(0).toUpperCase() + getUserName().slice(1).toLowerCase();
        }
        if (getLanguage() === "Greek") {
            return "Geia, " + getUserName().charAt(0).toUpperCase() + getUserName().slice(1).toLowerCase();
        }
        if (getLanguage() === "English") {
            return "Hello, " + getUserName().charAt(0).toUpperCase() + getUserName().slice(1).toLowerCase();
        }
    }

//store names in the object map
    function pushName(name) {
        
        // let name = myName.charAt(0).toUpperCase() + myName.slice(1).toLowerCase()
        if (namesList[name] === undefined) {
            namesList[name] = 1
        }
        else {
            namesList[name]++
        }
    }
    function getNameList() {
        return namesList;
    }

    function greetingsCounter() {   
        return Object.keys(namesList).length;
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
        pushName,
        greetingsCounter,
        languageSelected,
        getNameList,
        errorMsg,
        timeOutErr
    }
}
