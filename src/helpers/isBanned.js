module.exports = {
    isBanned: (req, res, next) => {
        if(req.user && (req.user[0].qt_advertencias_usuario == 3 || req.user[0].cd_deletado_usuario == 1)){
                req.logout();
                req.flash('errorMsg', "Sua conta foi suspensa por tempo indeterminado");
                res.redirect('/login')
        }
        else return next();
    }
}