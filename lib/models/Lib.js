const uidGenerator = require('node-unique-id-generator');

class Lib {
    constructor(title = "", description = "", authors = "", favorite = "", fileCover = "", fileName = "", id = uidGenerator.generateUniqueId()) {
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
        this.id = id;
    }
}

module.exports = Lib;