
module.exports= app => {
    app.route('/teste').post(app.api.user.save)
}
