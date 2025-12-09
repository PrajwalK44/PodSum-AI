const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp : { type: String },
    otpExpiry : { type: Date },
    isVerified : { type: Boolean, default: false },
});

module.exports = mongoose.model('User', UserSchema);