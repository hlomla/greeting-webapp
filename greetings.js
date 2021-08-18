module.exports = function Greet(name) {

    var nameList = name || [];
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


    function pushName(myName) {
        // let name = myName.charAt(0).toUpperCase() + myName.slice(1).toLowerCase()
        if (!nameList.includes(myName)) {
            nameList.push(myName)
        }
    }
    function getNameList() {
        return nameList;
    }

    function greetingsCounter() {
        return nameList.length;
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
