const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../database/database');

module.exports = async function (passport) {
    passport.use(
        new localStrategy(
            {
                usernameField: 'email',
                passwordField: 'pass'
            },
            async (email, senha, done) => {
                try{
                    var conn = await db.connection();
                    const [rows] = await conn.query(`SELECT
                     * FROM usuario WHERE cd_email_usuario = ? LIMIT 1`, [email])

                    if(!rows.length) {
                        return done(null, false, { message: "Email ou/e senha inválidos" })
                    }
                    else {
                        const compare = bcrypt.compareSync(senha, rows[0].cd_senha_usuario)
                        if (compare) {
                            return done(null, rows, null)
                        }
                        else {
                            return done(null, false, { message: "Email ou/e senha inválidos" })
                        }
                    }
                } catch (err) {
                    return done(null, false, { message: "Ocorreu algum erro inesperado" })
                } finally{
                    await conn.end();
                }

            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user[0].cd_usuario);
    });

    passport.deserializeUser(async (id, done) => {
        const conn = await db.connection();
        try{
            const [rows] = await conn.query(`SELECT
            * FROM usuario WHERE cd_usuario = ? LIMIT 1`, [id]);
            return done(null, rows);
        }
       catch(error){
         return done(error, null)
       }
       finally{
        await conn.end();
       }
    })
}

