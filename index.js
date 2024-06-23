const logOut = document.querySelector(".log-out");
const username = document.querySelector(".username");
const productWrapper = document.querySelector(".products-wrapper");
const dot = document.querySelector(".dot");
const dotValue = document.querySelector(".dot-value");
const close = document.querySelector(".close");
const modal = document.querySelector(".modal");
const shoppingCart = document.querySelector(".shopping-cart");
const itemsWrapper = document.querySelector(".items-wrapper");
const placeOrder = document.querySelector(".order");
const orderMessage = document.querySelector(".order-message-wrapper");
const inputName = document.querySelector(".name");
const inputPrice = document.querySelector(".input-price");
const search = document.querySelector(".search-btn");
const inputRating = document.querySelector(".input-rating");

let cartProducts = [];
let phoneProducts = [];
let firstClick = false;
modal.style.opacity = 1;

const createProduct = (product) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("card-wrapper");
  const image = document.createElement("img");
  image.classList.add("card-img");
  image.src = product.image;
  const name = document.createElement("div");
  name.classList.add("name-wrapper");
  const title = document.createElement("p");
  title.classList.add("title");
  title.innerHTML = product.title;
  const price = document.createElement("p");
  price.classList.add("price");
  const stars = document.createElement("p");
  for (let i = 0; i < product.stars; i++) {
    stars.innerHTML = stars.innerHTML + "⭐";
  }
  price.innerHTML = "Pret " + product.price + " RON";
  const btn = document.createElement("button");
  btn.classList.add("btn-card");
  btn.innerHTML = "Add to cart";
  btn.addEventListener("click", () => {
    cartProducts.push(product);
    if (cartProducts.length > 0) {
      dot.style.display = "flex";
      dotValue.innerHTML = cartProducts.length;
    }
  });
  name.appendChild(title);
  name.appendChild(price);
  wrapper.appendChild(image);
  wrapper.appendChild(name);
  wrapper.appendChild(stars);
  wrapper.appendChild(btn);

  productWrapper.appendChild(wrapper);
};

const showProduct = (product, index) => {
  const cartProduct = document.createElement("div");
  cartProduct.classList.add("cart-product");
  const image = document.createElement("img");
  image.src = product.image;
  const textWrapper = document.createElement("div");
  textWrapper.classList.add("text-wrapper");
  const name = document.createElement("p");
  name.innerHTML = product.title;
  const price = document.createElement("span");
  price.innerHTML = product.price;
  const trash = document.createElement("button");
  trash.innerHTML = "🗑️";
  trash.addEventListener("click", () => {
    cartProduct.style.display = "none";
    cartProducts = cartProducts.filter((_, pos) => pos !== index);
    dotValue.innerHTML = cartProducts.length;
    if (cartProducts.length === 0) {
      dot.style.display = "none";
      modal.style.display = "none";
    }
  });
  textWrapper.appendChild(name);
  textWrapper.appendChild(price);
  cartProduct.appendChild(image);
  cartProduct.appendChild(textWrapper);
  cartProduct.appendChild(trash);
  itemsWrapper.appendChild(cartProduct);
};

fetch("http://localhost:3000/phones")
  .then((res) => res.json())
  .then((data) => {
    phoneProducts = data;
    for (let i = 0; i < data.length; i++) {
      createProduct(data[i]);
    }
  })
  .catch((error) => {
    console.log(error);
  });

fetch("http://localhost:3000/status")
  .then((res) => res.json())
  .then((data) => {
    if (data.logged === false) {
      window.location.href = "/signUp.html";
    }
    username.innerHTML = data.username;
  })
  .catch((error) => {
    console.log("Ceva nu e bine");
  });

logOut.addEventListener("click", () => {
  fetch("http://localhost:3000/status", {
    method: "PUT",
    body: JSON.stringify({
      logged: false,
      username: "",
    }),
  }).then(() => {
    window.location.href = "/signUp.html";
  });
});

shoppingCart.addEventListener("click", () => {
  if (cartProducts.length > 0) {
    itemsWrapper.innerHTML = "";
    modal.style.display = "flex";
    for (let i = 0; i < cartProducts.length; i++) {
      showProduct(cartProducts[i], i);
    }
  }
});
close.addEventListener("click", () => {
  modal.style.display = "none";
});

placeOrder.addEventListener("click", () => {
  itemsWrapper.style.display = "none";
  cartProducts = [];
  dot.style.display = "none";
  cartProducts.length = "0";
  placeOrder.style.display = "none";
  close.style.display = "none";
  orderMessage.style.display = "flex";
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      modal.style.opacity = Number(modal.style.opacity) - 0.1;
    }, i * 300);
  }
  setTimeout(() => {
    modal.style.display = "none";
  }, 2000);
});

search.addEventListener("click", () => {
  let filterArray = [];

  for (let i = 0; i < phoneProducts.length; i++) {
    if (phoneProducts[i].price === parseInt(inputPrice.value)) {
      filterArray.push(phoneProducts[i]);
    }
    if (phoneProducts[i].title === inputName.value) {
      filterArray.push(phoneProducts[i]);
    }
    if (phoneProducts[i].stars === Number(inputRating.value)) {
      filterArray.push(phoneProducts[i]);
    }
  }

  productWrapper.innerHTML = "";
  if (
    inputPrice.value !== "" ||
    inputName.value !== "" ||
    inputRating.value !== ""
  ) {
    for (let i = 0; i < filterArray.length; i++) {
      createProduct(filterArray[i]);
    }
  } else {
    for (let i = 0; i < phoneProducts.length; i++) {
      createProduct(phoneProducts[i]);
    }
  }
});
