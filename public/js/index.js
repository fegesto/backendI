const socket = io();  // Intenta conectarte al servidor WebSocket

socket.on("updateProducts", (products) => {

    const productsContainer = document.getElementById("products");
    productsContainer.innerHTML = "";

    products.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.innerHTML = `
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <img src="${product.thumbnail}" alt="${product.title}">
            <p>Precio: ${product.price}</p>
            <p>Stock: ${product.stock}</p>
        `;
        productsContainer.appendChild(productDiv);
    });
});

const form = document.getElementById("productForm");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const price = document.getElementById("price").value;
    const status = document.getElementById("status").value;
    const thumbnail = document.getElementById("thumbnail").value;
    const stock = document.getElementById("stock").value;
    
    fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title,
            description,
            code,
            price,
            status,
            thumbnail,
            stock})
    })
    .then(res => res.json())
    .then(data => {
        console.log("Producto agregado:", data);
        form.reset();
    })
    .catch(error => console.error("Error:", error));
}); 