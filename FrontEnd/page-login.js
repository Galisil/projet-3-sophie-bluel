// fonction pour authentifier l'admin
async function loginAdmin(email, password) {
    const result = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    if (result.ok) {
        let { userId, token } = await result.json();
        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("token", token);
    } else {
        let contentMsgError =
            "La saisie de l'email ou du mot de passe est incorrecte.";
        let msgError = document.createElement("p");
        msgError.textContent = contentMsgError;
        const loginForm = document.getElementById("loginForm");
        //Supprimer le message d'erreur précédent s'il existe
        const existingError = loginForm.querySelector("p.error-message");
        if (existingError) {
            loginForm.removeChild(existingError);
        }
        msgError.classList.add("error-message");
        loginForm.appendChild(msgError);
        loginForm.querySelector("[name=email]").value = "";
        loginForm.querySelector("[name=password]").value = "";
        throw new Error("Identifiants incorrects");
    }
}
function authRedirect() {
    window.location = "./index.html";
    console.log(sessionStorage.getItem("userId"));
}
function loginFormSubmit(event) {
    event.preventDefault();
    const email = document.querySelector("[name=email]").value;
    const password = document.querySelector("[name=password]").value;
    loginAdmin(email, password)
        .then(authRedirect)
        .catch((error) => console.log(error.message));
}
let formFilters = document.getElementById("formFilters");
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", loginFormSubmit);
