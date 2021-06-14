var socket = io();
var idUrl = window.location.href.split('/');
var containerChat = document.querySelector('.chat-content');

var children = containerChat.children;

window.addEventListener('load', () => {
    for(i = 0; i<children.length; i++){
        let msgClass = children[i].className;
        let msgSplit = msgClass.split(' ');
        if(msgSplit[1] == localStorage.getItem('userId')){
            children[i].classList.add('enviada')
        }
        else{
            children[i].classList.add('recebida')
        }
    }
    containerChat.scrollTop = containerChat.scrollHeight;
})

socket.on('sendMessage', message => {
    if(message.idUser == localStorage.getItem('userId')){
        let msgPai = document.createElement('div');
        let msgStructure = document.createElement('div');
        let msgText = document.createElement('span');
        let info = document.createElement('div');
        let intoinfo = document.createElement('div');
        let time = document.createElement('span');
        //let visualized = document.createElement('img');
        //visualized.setAttribute('src', '/assets/img/arrow-visualized.svg');
        msgText.innerText = message.msg;
        time.innerText = message.time;
        info.classList.add('message-info', 'row');
        time.classList.add('titulo-gray', 'time-msg');
        msgText.classList.add('message-txt');
        msgPai.classList.add('message-row', 'enviada', 'row');
        msgStructure.classList.add('mensagem', 'row');
        intoinfo.append(time);
        //intoinfo.append(visualized);
        info.append(intoinfo);
        msgPai.append(msgStructure);
        msgStructure.append(msgText);
        msgStructure.append(info);
        containerChat.append(msgPai);
    }
    else{
        /*if(!message.read){
            let notification = document.querySelector(`.read-${message.room}`);
            let icon = document.createElement('p');
            icon.classList.add('titulo','white','qnt-msg');
            notification.append(icon);
        }*/
        let msgPai = document.createElement('div');
        let msgStructure = document.createElement('div');
        let msgText = document.createElement('span');
        let info = document.createElement('div');
        let intoinfo = document.createElement('div');
        let time = document.createElement('span');
        time.innerText = message.time;
        msgText.innerText = message.msg;
        time.classList.add('time-msg');
        info.classList.add('message-info', 'row');
        msgText.classList.add('message-txt');
        msgPai.classList.add('message-row', 'recebida', 'row');
        msgStructure.classList.add('mensagem', 'row');
        intoinfo.append(time);
        info.append(intoinfo);
        msgPai.append(msgStructure);
        msgStructure.append(msgText);
        msgStructure.append(info);
        containerChat.append(msgPai);
    }
    containerChat.scrollTop = containerChat.scrollHeight;

    /*document.querySelector(`.chat-${message.room}`).addEventListener('mousemove', event => {
        let icon = document.querySelector(`.read-${message.room}`);
        if(icon.children[1]){
            icon.children[1].remove();
        }
    })*/
})

socket.on('connected', user => {
    localStorage.setItem('userId', user)
})

document.getElementById("chatForm").addEventListener("submit", event => {
    event.preventDefault();

    let message = document.getElementById("txt-mensagem").value;
    if(message.length && message.trim()){
        let messageObject = {
            message,
            read: false
        }
        socket.emit('sendMessage', messageObject)
    }
    document.getElementById("txt-mensagem").value = '';
})