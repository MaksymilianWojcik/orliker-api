const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const { User } = require('../../../models/user');

describe('user generate auth token', () => {
    it('should return a valid jwt', () => {
        const payload = {_id: new mongoose.Types.ObjectId().toHexString(), email: 'mamak22d@gmail.com'};
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        expect(decoded).toMatchObject(payload);
    })
});