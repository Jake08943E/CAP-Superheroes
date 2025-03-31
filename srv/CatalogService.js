const cds = require("@sap/cds");
const MongoClient = require("mongodb").MongoClient;
const dotenv = require('dotenv');
dotenv.config();

const sMongoUrl = process.env.MONGO_URL;
const sDbName = process.env.DATABASE_NAME;
const client = new MongoClient(sMongoUrl);
console.log("MongoDB URL: ", sMongoUrl);

async function _crearsuperheroe(req) {
    return req.data;
}

async function _recuperarsuperheroes(req) {
    return req;
}   

async function _actualizarsuperheroe(req) {
        return req.data;
    }


async function _borrarsuperheroe(req) {
    return req;
}


module.exports = cds.service.impl(function() {
    const {superheroes} = this.entities;
    this.on("INSERT", superheroes, _crearsuperheroe) ; 
    this.on("READ", superheroes, _recuperarsuperheroes); 
    this.on("UPDATE", superheroes, _actualizarsuperheroe),
    this.on("DELETE", superheroes, _borrarsuperheroe) 
});

