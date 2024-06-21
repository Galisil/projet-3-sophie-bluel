async function loginAdmin(email, password) {
    const result = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    if (result.ok) {
        let { userId, token } = await result.json();
        localStorage.setItem("userId", userId);
        localStorage.setItem("token", token);
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
        // Ajout classe "error-message" pour la suppression future
        msgError.classList.add("error-message");
        loginForm.appendChild(msgError);
        loginForm.querySelector("[name=email]").value = "";
        loginForm.querySelector("[name=password]").value = "";
        throw new Error("Identifiants incorrects");
    }
}
function authRedirect() {
    window.location = "./index.html";
}
function loginFormSubmit(event) {
    event.preventDefault();
    const email = document.querySelector("[name=email]").value;
    const password = document.querySelector("[name=password]").value;
    loginAdmin(email, password)
        .then(authRedirect)
        .catch((error) => console.log(error.message));
}
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", loginFormSubmit);
