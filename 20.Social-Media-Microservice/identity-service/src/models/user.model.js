const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

// Hash the password before saving the user model
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const hash = await argon2.hash(this.password);
            this.password = hash;
            next();
        } catch (err) {
            next(err);
        }
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;