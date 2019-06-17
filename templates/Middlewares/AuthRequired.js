
const AuthRequired = (req, res, next) => {

    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        res.status(403).json("Bad credencial");
    } else {
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [id, password] = credentials.split(':');

        if (id && password) {
            return next();
        } else {
            res.status(403).json("Bad credencial");
        }

    }

}

module.exports = AuthRequired;