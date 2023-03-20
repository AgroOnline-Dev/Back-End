const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(token);
        const decodedToken = jwt.verify(token, 'RANDOM_SECRET_TOKEN_in');
        console.log(decodedToken);
        const user = decodedToken.userId;
        req.auth = {
            userId: user.Id
        };
        console.log(user);
        next();

    } catch (error) {
        res.status(401).json({error});
    }
}