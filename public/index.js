const input = document.getElementById("input");
const button = document.getElementById("sendButton");
const chat = document.getElementById("chat");

const template = "<li class=\"list-group-item\">%MESSAGE</li>";
const messages = [];

const socket = io();
// Trova gli elementi
const modal = document.getElementById('myModal');
const openModalButton = document.getElementById('openModalButton');
const closeModalButtons = document.querySelectorAll('#closeModalButton, #closeModalButtonFooter');
const submitNameButton = document.getElementById('submitName');
const nomeUtenteInput = document.getElementById('nomeUtente');
let flag = false;


const openModal = () => {
    if(!flag){
        modal.classList.add('show');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; 
        document.body.classList.add('modal-open'); 
    }
};

const closeModal = () => {
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.body.classList.remove('modal-open');
};
openModal();

document.getElementById("openModalButton").onclick = ()=> {
    if (!flag) {
        openModal(); //solo se l'utente non ha ancora inserito il nome
    }
};

document.getElementById("closeModalButton").onclick= () => {
    closeModal();
}


document.getElementById("submitName").onclick = () => {
    const nome = nomeUtenteInput.value.trim();
    if (nome) {
        flag = true;
        socket.emit("name", nome)
        console.log('Nome inserito:', nome);
    }
    closeModal(); 
};


input.onkeydown = (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        button.click();
    }
}

button.onclick = () => {
    socket.emit("message", input.value);
    input.value = "";
}

socket.on("chat", (message) => {
    console.log(message);
    messages.push(message);
    render();
})
socket.on("list", (users) => {
    const userListElement = document.getElementById("userList");
    userListElement.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement("li");
        li.textContent = user.name;
        userListElement.appendChild(li);
    });
});

const render = () => {
    let html = "";
    messages.forEach((message) => {
        const row = template.replace("%MESSAGE", message);
        html += row;
    });
    chat.innerHTML = html;
    window.scrollTo(0, document.body.scrollHeight);
}