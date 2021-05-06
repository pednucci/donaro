module.exports = {
    isAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user[0].cd_isAdmin_usuario == 1){    //função gerada pelo express
            return next()
        }
        res.redirect('/')
    }
}