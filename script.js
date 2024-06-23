const signUp = document.querySelector(".signup");
const username = document.querySelector(".username");
const password = document.querySelector(".password");
const login = document.querySelector(".login");
const errorMessage1 = document.querySelector(".error-message1");

signUp.addEventListener("click", () => {
  if (
    username.value !== "" &&
    password.value !== "" &&
    username.value.length >= 5 &&
    password.value[0] === password.value[0].toUpperCase()
  ) {
    fetch("http://localhost:3000/user", {
      method: "POST",
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });
  } else {
    errorMessage1.innerHTML =
      "Username must have 5 characters and Password should start with a capital letter";
    setTimeout(() => {
      errorMessage1.innerHTML = "";
    }, 3500);
  }
});

login.addEventListener("click", () => {
  fetch("http://localhost:3000/user")
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].username === username.value &&
          data[i].password === password.value
        ) {
          fetch("http://localhost:3000/status", {
            method: "PUT",
            body: JSON.stringify({
              logged: true,
              username: username.value,
            }),
          }).then(() => {
            window.location.href = "/index.html";
          });
          return;
        }
      }
      errorMessage1.innerHTML = "Your username or password are incorrect!";
      setTimeout(() => {
        errorMessage1.innerHTML = "";
        username.value = "";
        password.value = "";
      }, 1500);
    })
    .catch((error) => {
      console.log("Ceva nu e bine");
    });
});
