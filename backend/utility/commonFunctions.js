const firebase = require('firebase-admin');

const verifyToken = async (req, res, next) => {
    const idToken = req?.headers?.authorization ? req.headers.authorization.replace('Bearer ','') : null;
    try {
        const decodedToken = await firebase.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error(error)
        res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = verifyToken;