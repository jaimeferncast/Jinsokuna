module.exports = app => {

    app.use('/api/auth', require('./auth.routes.js'))
    app.use('/api/users', require('./users.routes.js'))
    app.use('/api/menus', require('./menus.routes.js'))
    app.use('/api/categories', require('./categories.routes.js'))
    app.use('/api/products', require('./products.routes.js'))
    app.use('/api/orders', require('./orders.routes.js'))
}