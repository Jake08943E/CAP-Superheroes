const cds = require('@sap/cds');
const { results } = require('@sap/cds/lib/utils/cds-utils');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');
const { ObjectId } = require('mongodb');
dotenv.config();

const sMongoUrl = process.env.mongo_URL;
const sDbName = process.env.DATABASE_NAME;
const client = new MongoClient(sMongoUrl);

async function _crearsuperheroe(req) {
    if (req.data.franquicia !== 'Marvel' && req.data.franquicia !== 'DC') {
        req.error({ code: "401", message: 'franquicia no valida' });
    }

    await client.connect();
    const dataBase = await client.db(sDbName);
    const superheroes = await dataBase.collection('superheroes');
    const result = await superheroes.insertOne(req.data);

    if (result.insertedId) {
        req.data.id = result.insertedId;
    }

    return req.data;
}

async function _recuperarsuperheroe(req) {
    await client.connect();
    const dataBase = client.db(sDbName);
    const superheroes = dataBase.collection('superheroes');

    let ilimit = 9999; // Valor predeterminado
    let iOffset = 0;   // Valor predeterminado
    let oFilter = {};  // Filtro vacío por defecto

    // Validar y asignar valores de paginación
    if (req.query.SELECT.limit) {
        ilimit = req.query.SELECT.limit.rows?.val || 1000;
        iOffset = req.query.SELECT.limit.offset?.val || 0;
    }

    // Validar si se solicita un registro específico
    if (req.query.SELECT.one) {
        const sId = req.query.SELECT.from.ref[0].where[2]?.val;
        if (sId) {
            oFilter = { "_id": new ObjectId(sId) }; // Usar `new ObjectId`
        }
    }

    // Consultar la base de datos con paginación
    const result = await superheroes.find(oFilter)
        .skip(iOffset)
        .limit(ilimit)
        .toArray();

    // Convertir `_id` a `id` y eliminar `_id` si es necesario
    for (let i = 0; i < result.length; i++) {
        result[i].id = result[i]._id.toString();
        delete result[i]._id; // Opcional
    }

    return result;
}

async function _actualizarsuperheroe(req) {
    await client.connect();
    const dataBase = await client.db(sDbName);
    const superheroes = await dataBase.collection('superheroes');

    const oSuperHeroe = req.data;
    const sId = new ObjectId(oSuperHeroe.id);
    delete oSuperHeroe.id;

    const oResult = await superheroes.updateOne({ _id: sId }, { $set: oSuperHeroe });

    if (oResult.modifiedCount > 0) {
        return oSuperHeroe;
    } else {
        return oResult;
    }
}

async function _borrarsuperheroe(req) {
    await client.connect();
    const dataBase = await client.db(sDbName);
    const superheroes = await dataBase.collection('superheroes');

    const oSuperHeroe = req.data;
    const sId = new ObjectId(oSuperHeroe.id);
    const oResult = await superheroes.deleteOne({ _id: sId });
    return oResult;
}

module.exports = cds.service.impl(function () {
    const { superheroe } = this.entities;
    this.on('INSERT', superheroe, _crearsuperheroe);
    this.on('READ', superheroe, _recuperarsuperheroe);
    this.on('UPDATE', superheroe, _actualizarsuperheroe);
    this.on('DELETE', superheroe, _borrarsuperheroe);
});