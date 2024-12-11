const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: function () {
                // Password is required only for non-OAuth users
                return !this.twitterId;
            },
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },
        // Twitter OAuth fields
        twitterId: {
            type: String,
            unique: true,
            sparse: true,
        },
        username: String,
        displayName: String,
        photo: String,
        token: String,
        tokenSecret: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', UserSchema);


module.exports = mongoose.model('User', UserSchema);


module.exports = mongoose.model('User', UserSchema);
