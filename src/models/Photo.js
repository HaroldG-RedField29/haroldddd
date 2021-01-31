const {Schema, model} = require('mongoose');

const Photo = new Schema({
    title: String,
    description: String,
    album: String,
    des: String,
    genero: String,
    imageURL: String,
    public_id: String
});

module.exports = model('Photo', Photo);

