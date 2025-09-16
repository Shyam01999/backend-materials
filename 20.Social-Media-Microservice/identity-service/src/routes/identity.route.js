const express = require('express');
const { register } = require('../controllers/identity.controller');

const identityRouter = express.Router();

identityRouter.post('/register', register);
// identityRouter.post('/login');
// identityRouter.get('/profile');
// identityRouter.post('/logout');

module.exports = identityRouter;