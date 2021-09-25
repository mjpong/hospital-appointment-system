const MongoClient = require('mongodb').MongoClient;


// global variable is to store the database
let _db;

async function connect(url, dbname) {
    const client = new MongoClient(url, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    await client.connect();
    _db = client.db(dbname);
    return _db;
}

function getDB() {
    return _db;
}
module.exports = {
    connect, getDB
}