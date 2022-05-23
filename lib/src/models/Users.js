const uidGenerator = require('node-unique-id-generator');

class Users {
    constructor(firstname = "", lastname = "", login = "", pass = "", id = uidGenerator.generateUniqueId()) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.login = login;
        this.pass = pass;
        this.id = id;
    }
}

module.exports = Users;