module.exports = {
    isAuth: (req, res, next) => {
        if(req.isAuthenticated()){
            return next()
        }
        req.flash('errorMsg', 'Faça login para prosseguir')
        res.redirect('/login')
    }
}