const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true , lowercase: true , trim: true},
    password: {type: String, required: true , minlength: 8},
    role: { type: String, enum: ["user", "admin"], default: "user" },
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('user', userSchema);