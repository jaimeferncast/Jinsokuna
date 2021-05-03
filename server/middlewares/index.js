module.exports = {
    checkRights: (req, res, next) =>
        req.user.role === 'EDITOR' ? next() : res.status(401).json({ message: 'user unauthorized' }),
    checkIfLoggedIn: (req, res, next) => (req.user ? next() : res.status(401).json({ message: 'user unauthorized' })),
}