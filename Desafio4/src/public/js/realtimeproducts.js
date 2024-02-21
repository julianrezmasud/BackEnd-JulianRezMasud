
const socket = io();

const cardsContainer = document.getElementById('cards-container')


socket.emit("logMessage", "Conected with client trough socketServer");
socket.on("status", (data) => {
    console.log(data);
});


const printCard = (prod) => {

    cardsContainer.innerHTML += `
    <div class="card" id="card">
    <div class="img-card-container">
    <img src=${prod.thumbnail} alt=${prod.title}></p>
    </div>
    <ul>
    <li><h2>${prod.title}</h2></li>
    <li><h4><b>Price: </b>$${prod.price}</h4></li>
    <li><b>Description:</b> ${prod.description}</li>
    <li><b>Code:</b> ${prod.code}</li>
    <li><b>Status:</b> ${prod.status}</li>
    <li><b>Stock:</b> ${prod.stock}</li>
    <li><b>Category:</b> ${prod.category}</li>
    <li><b>ID:</b> ${prod.id}</li>
    </ul>
    </div>
    `;

}


const formGet = document.getElementById("formGet");
const msgGet = document.getElementById("msgGet");

formGet.addEventListener("submit", (e) => {
    e.preventDefault();
    let getProductInput = document.getElementById('getProductId-input').value
    socket.emit("getProduct", getProductInput);
    msgGet.innerHTML = "";
});


socket.on("getProduct", (data) => {
    msgGet.innerHTML = data.message;
    cardsContainer.innerHTML = "";
    data.products.forEach((prod) => {
        printCard(prod);
    });
    document.getElementById('getProductId-input').value = ""
});


const formPost = document.getElementById("formPost");
const msgPost = document.getElementById("msgPost");


formPost.addEventListener("submit", (e) => {
    e.preventDefault();
    let postProduct = document.getElementById('postProduct-input').value.trim();


    if (postProduct.length == 0) return msgPost.innerHTML = "Have to add a product";

    if (/^\d+$/.test(postProduct) || /^[a-zA-Z]+$/.test(postProduct)) {
        return msgPost.innerHTML = "Have to add a product in format JSON";
    }

    try {
        JSON.parse(postProduct);
        socket.emit("addProduct", postProduct);
        msgPost.innerHTML = "";
    }
    catch (error) {
        msgPost.innerHTML = "Have to add a product in format JSON";
    }
})

socket.on("addProduct", (data) => {
    msgPost.innerHTML = data.message;
    cardsContainer.innerHTML = "";

    data.products.forEach((prod) => {
        printCard(prod);

    });
    document.getElementById('postProduct-input').value = ""

});



const formDel = document.getElementById("formDel");
const msgDel = document.getElementById("msgDel");


formDel.addEventListener("submit", (e) => {
    e.preventDefault();
    let delProductById = document.getElementById('delProduct-input').value.trim()


    if (delProductById.length == 0) return msgDel.innerHTML = "Have to add id";

    socket.emit("deleteProduct", delProductById);
    msgDel.innerHTML = "";
});


socket.on("deleteProduct", (data) => {
    msgDel.innerHTML = data.message;
    cardsContainer.innerHTML = "";
    data.products.forEach((prod) => {
        printCard(prod);
    });
    document.getElementById('delProduct-input').value = ""

});
