const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/RefreshToken.model');

const generateToken = async(user) => {

    const {_id:id, username} = user;
    const secret = process.env.JWT_SECRET;
    const accessToken = jwt.sign({ id,username}, secret, {expiresIn: '15m'});
    
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    
    await RefreshToken.create({
        token:refreshToken,
        user:id,
        expiresAt
    })
    
    return { accessToken, refreshToken};
}

module.exports = generateToken;
