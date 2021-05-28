const { io } = require('./server');
const { format } = require('date-fns');
const db = require('./database/database');

io.on('connection', async socket => {
    let link = socket.handshake.headers.referer;
    var room = link.split('/')[4];
    socket.join(room);
    const userConnect = socket.handshake.session.passport.user;
    socket.emit('connected', userConnect)
    socket.on('sendMessage', async msg => {
        const conn = await db.connection();
        const idUser = socket.handshake.session.passport.user;
        const time = format(Date.now(), 'HH:mm');
        let messageObject = {
            msg: msg.message,
            time,
            idUser,
            read: msg.read,
            room
        }
        io.to(room).emit('sendMessage', messageObject);
        await conn.query(`INSERT INTO mensagem(ds_conteudo_mensagem, cd_chat_mensagem,
        cd_usuario_mensagem) VALUES(?,?,?)`,[msg.message, room, idUser])
        await conn.end();
    })
})
