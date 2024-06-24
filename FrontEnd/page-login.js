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
        /*let formFilters = document.getElementById("formFilters");
        formFilters.removeChild(btnTous);
        formFilters.removeChild(btnObjets);
        formFilters.removeChild(btnAppartements);
        formFilters.removeChild(btnHotelsRestaurants);*/
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
    /* const contentLinkModal = `
    <img src="./FrontEnd/assets/icons/Group.png" alt="icône modifier"/>
    <p>modifier</p>
    `;
    const linkModal = document.querySelector(".projets-modale");
    linkModal.innerHTML = contentLinkModal;
    console.log(linkModal);*/
    //////
    /*const iconeModifier = document.createElement(
        "img"[
            ((src = "./FrontEnd/assets/icons/Group.png"),
            (alt = "icône modifier"))
        ]
    );
    const textModifier = document.createElement("p");
    textModifier.textContent = "modifier";
    const linkModal = document.querySelector(".projets-modale");
    linkModal.appendChild = iconeModifier;
    linkModal.appendChild = textModifier;*/
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
