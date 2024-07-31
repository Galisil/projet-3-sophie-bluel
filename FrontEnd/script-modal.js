const modal = document.getElementById("modal1");
const modalWrapper1 = document.getElementById("modal-wrapper1");
const modalWrapper2 = document.getElementById("modal-wrapper2");

async function generatePhotosWorks() {
    const reponseWorks = await fetch("http://localhost:5678/api/works");
    const works = await reponseWorks.json();
    let divGalleryModal = document.querySelector(".photosGalleryModal");
    divGalleryModal.innerHTML = ""; //nettoyer la div si déjà remplie de photos
    for (let i = 0; i < works.length; i++) {
        const imageWork = works[i];
        //création div pour chaque "case" photo work + btn poubelle
        let divImgAndSupp = document.createElement("div");
        divImgAndSupp.className = "divImgAndSupp";
        divImgAndSupp.id = works[i].id;
        //création d'un attribut catégorie pour chaque photo
        let category = works[i].category.name;
        divImgAndSupp.setAttribute("category", category);
        //
        let photos = document.createElement("img");
        photos.src = imageWork.imageUrl;
        photos.className = "photosWorksGalleryModal";
        //création btn supp pour chaque photo
        let btnSupp = document.createElement("button");
        btnSupp.className = "btnSupp";
        btnSupp.id = divImgAndSupp.id;
        //ajout icone poubelle pour chaque btn supp
        let iconSupp = document.createElement("img");
        iconSupp.src = "./assets/icons/icone-poubelle.svg";
        iconSupp.alt = "Supprimer la photo";
        btnSupp.appendChild(iconSupp);
        //ajout de tout le bazar dans la galerie
        divImgAndSupp.appendChild(photos);
        divImgAndSupp.appendChild(btnSupp);
        divGalleryModal.appendChild(divImgAndSupp);
        let figureToSupp = null;
        btnSupp.addEventListener("click", () => {
            deleteWorks(btnSupp.id, divImgAndSupp);
            synchroSuppGallery(btnSupp.id, figureToSupp);
        });
    }
}

//fonction pour synchroniser la suppression des travaux en dehors de la modale
async function synchroSuppGallery(btnSuppId, figureToSupp) {
    const gallery = document.querySelector(".gallery");
    const allFigures = gallery.querySelectorAll("figure");
    for (let i = 0; i < allFigures.length; i++) {
        let figure = allFigures[i];
        if (figure.id === btnSuppId) {
            figureToSupp = figure;
            break;
        }
    }
    gallery.removeChild(figureToSupp);
}

//fonction ouverture de la 1ère vue modale
async function openModal(event) {
    event.preventDefault();
    const target = document.querySelector(".jsModal");
    let divGalleryModal = document.querySelector(".photosGalleryModal");
    let alreadyExisting = divGalleryModal.querySelectorAll(".divImgAndSupp");

    if (divGalleryModal) {
        alreadyExisting.forEach((divImgAndSupp) => divImgAndSupp.remove());
        console.clear(divGalleryModal);
    }
    if (modal) {
        modal.style.display = "flex";
        modal.removeAttribute("aria-hidden");
        target.setAttribute("aria-modal", "true");
        modalWrapper1.style.display = "flex";
        modalWrapper2.style.display = "none";
    }
    await generatePhotosWorks();
}

function stopPropagation(event) {
    event.stopPropagation();
}

//fonction fermeture modale
function closeModal(event) {
    resetForm(event);
    changeBtnColor(event);
    const modal = document.querySelector(".modal");
    if (event) event.stopPropagation();
    if (modal) {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
    }
}

//fonction ouverture 2ème vue modale
function openSecondPage(event) {
    event.preventDefault();
    console.log(fileUpload);
    if (modal) {
        modalWrapper2.setAttribute("aria-modal", "true");
        modalWrapper1.style.display = "none";
        modalWrapper2.style.display = "flex";
    }
}

//fonction pour retourner à la 1ère vue de la modale (en nettoyant le form)
function backToFirstPage(event) {
    event.preventDefault();
    resetForm(event);
    changeBtnColor(event);
    if (modal) {
        modalWrapper1.setAttribute("aria-modal", "true");
        modalWrapper2.style.display = "none";
        modalWrapper1.style.display = "flex";
    }
}

//fonction pour supprimer des travaux
async function deleteWorks(toto, divImgAndSupp) {
    const token = sessionStorage.getItem("token");
    const result = await fetch("http://localhost:5678/api/works/" + toto, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
        }
    });
    if (!result.ok) {
        console.log("erreur!!!");
    } else {
        divImgAndSupp.remove();
    }
}

//tous les écouteurs d'évènement
document.addEventListener("DOMContentLoaded", () => {
    const open = document.querySelector(".jsModal");
    const btnQuit = document.querySelectorAll(".btnQuit");
    const fileUpload = document.getElementById("fileUpload");
    const formAddWork = document.getElementById("formAddWork");
    const btnPostPhoto = document.querySelector(".btnPostPhoto");
    const btnGoBack = document.querySelector(".btnGoBack");
    let btnValider = document.getElementById("btnValider");
    //let btnSupp = document.querySelectorAll(".btnSupp");
    const addPhotoTitleInput = document.getElementById("addPhotoTitleInput");
    const addPhotoCategoryInput = document.getElementById(
        "addPhotoCategoryInput"
    );
    changeBtnColor();
    fileUpload.addEventListener("change", changeBtnColor);
    addPhotoTitleInput.addEventListener("input", changeBtnColor);
    addPhotoCategoryInput.addEventListener("change", changeBtnColor);
    if (btnValider) {
        btnValider.addEventListener("click", msgErrorForm);
        // btnValider.addEventListener("click", changeBtnColor);
    }
    //si btn modifier cliqué, exécuter fonction openModal
    if (open) {
        open.addEventListener("click", openModal);
    }
    //bouton croix quitter modale
    btnQuit.forEach((btnQuit) => {
        btnQuit.addEventListener("click", closeModal);
    });
    modal.addEventListener("click", closeModal);
    modalWrapper1.addEventListener("click", stopPropagation);
    modalWrapper2.addEventListener("click", stopPropagation);
    //ouverture de la 2ème vue modale
    if (btnPostPhoto) {
        btnPostPhoto.addEventListener("click", openSecondPage);
    }
    //bouton flèche retour 1ère vue modale
    if (btnGoBack) {
        btnGoBack.addEventListener("click", backToFirstPage);
    }
    //ajout d'une photo dans le conteneur du form
    if (fileUpload) {
        fileUpload.addEventListener("change", viewImgSelected);
    }
    //let figureToAdd = null;
    if (formAddWork) {
        formAddWork.addEventListener("submit", submitForm);
    }
    const log = document.getElementById("log");
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });
});

//fonction pour afficher l'image sélectionnée dans le formulaire
function viewImgSelected(event) {
    let file = event.target.files[0];
    let selectedImg = document.getElementById("customTest");
    const fileUpload = document.getElementById("fileUpload");
    if (file) {
        console.log("truc ajouté: ", file.name);
        const reader = new FileReader();
        reader.onload = function (event) {
            let containerPhoto = document.querySelector(".containerPhoto");
            let iconeImage = document.getElementById("iconeImage");
            let textContainerPhoto =
                document.getElementById("textContainerPhoto");
            if (selectedImg) {
                iconeImage.style = "display:none";
                textContainerPhoto.style = "display:none";
                containerPhoto.style.cssText =
                    "flex-direction: row; justify-content:center;";
                selectedImg.style.cssText =
                    "padding:0px; background-color:transparent; position:absolute; height:100%; margin:auto;";
                selectedImg.innerHTML = `<img src="${event.target.result}" alt="Selected Image"/>`;
            }
        };
        reader.readAsDataURL(file);
    } else {
        console.log("no file selected");
    }
}

//fonction pour nettoyer la div container photo quand on quitte la secondemodale
function resetForm(event) {
    let fileUpload = document.getElementById("fileUpload");
    let addPhotoTitleInput = document.getElementById("addPhotoTitleInput");
    let addPhotoCategoryInput = document.getElementById(
        "addPhotoCategoryInput"
    );
    let errorMsgAddPhoto = document.getElementById("errorMsgAddPhoto");
    let selectedImg = document.getElementById("customTest");
    let containerPhoto = document.querySelector(".containerPhoto");
    let iconeImage = document.getElementById("iconeImage");
    let textContainerPhoto = document.getElementById("textContainerPhoto");
    if (errorMsgAddPhoto) {
        formAddWork.removeChild(errorMsgAddPhoto);
    }
    if (selectedImg !== "+ Ajouter Photo") {
        iconeImage.style = "display:inline";
        textContainerPhoto.style = "display:inline";
        containerPhoto.style.cssText = "";
        selectedImg.style.cssText = "";
        selectedImg.innerHTML = `+ Ajouter Photo`;
        fileUpload.value = "";
        addPhotoTitleInput.value = "";
        addPhotoCategoryInput.value = null;
    }
}

function changeBtnColor() {
    const btnValider = document.getElementById("btnValider");
    const fileUpload = document.getElementById("fileUpload");
    const addPhotoTitleInput = document.getElementById("addPhotoTitleInput");
    const addPhotoCategoryInput = document.getElementById(
        "addPhotoCategoryInput"
    );
    //fonction pour changer couleur bouton valider

    const isFileUploaded = fileUpload.files.length > 0;
    const isTitleFilled = addPhotoTitleInput.value.length > 0;
    const isCategorySelected = addPhotoCategoryInput.value !== "";

    if (isFileUploaded && isTitleFilled && isCategorySelected) {
        btnValider.classList.add("active");
        btnValider.classList.remove("inactive");
    } else {
        btnValider.classList.add("inactive");
        btnValider.classList.remove("active");
    }
}

function msgErrorForm() {
    console.log("coucou");
    let formAddWork = document.getElementById("formAddWork");
    let btnValider = document.getElementById("btnValider");
    console.log(btnValider);
    if (btnValider.classList.contains("inactive")) {
        let contentMsgError =
            "Merci de remplir correctement tous les champs du formulaire avant de valider";
        let msgError = document.createElement("p");
        msgError.textContent = contentMsgError;
        msgError.id = "errorMsgAddPhoto";
        console.log("coucou");
        //Supprimer le message d'erreur précédent s'il existe
        const existingError = document.getElementById("errorMsgAddPhoto");
        if (existingError) {
            formAddWork.removeChild(existingError);
        }
        formAddWork.appendChild(msgError);
    }
}

async function submitForm(event) {
    event.preventDefault();
    btnValider = document.getElementById("btnValider");
    if (btnValider.classList.contains("active")) {
        const token = sessionStorage.getItem("token");
        let fileUpload = document.getElementById("fileUpload");
        let file = fileUpload.files[0];
        let figureToAdd = null;
        const formData = new FormData(formAddWork);
        try {
            const result = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token
                },
                body: formData
            });
            if (result.ok) {
                const figureToAdd = await result.json();
                synchroAddGallery(figureToAdd);
                synchroAddGalleryModal(figureToAdd);
                backToFirstPage(event);
            } else {
                /*let contentMsgError =
                    "Merci de remplir correctement tous les champs du formulaire avant de valider";
                let msgError = document.createElement("p");
                msgError.textContent = contentMsgError;
                msgError.id = "errorMsgAddPhoto";
                //Supprimer le message d'erreur précédent s'il existe
                const existingError =
                    document.getElementById("errorMsgAddPhoto");
                if (existingError) {
                    formAddWork.removeChild(existingError);
                }
                if (!result.ok) {
                    formAddWork.appendChild(msgError);
                }*/
                console.log("erreur lors de l'envoi du formulaire");
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }
}

/*document.addEventListener("DOMContentLoaded", function () {
    const btnValider = document.getElementById("btnValider");
    const fileUpload = document.getElementById("fileUpload");
    const addPhotoTitleInput = document.getElementById("addPhotoTitleInput");
    const addPhotoCategoryInput = document.getElementById(
        "addPhotoCategoryInput"
    );
    changeBtnColor();
    fileUpload.addEventListener("change", changeBtnColor);
    addPhotoTitleInput.addEventListener("input", changeBtnColor);
    addPhotoCategoryInput.addEventListener("change", changeBtnColor);

    //fonction pour l'envoi du formulaire
    /*document
        .getElementById("formAddWork")
        .addEventListener("submit", async function (event) {*/

//});
//});

/*
                    //afficher les données du form dans la console
                    for (var key of formData.keys()) {
                        console.log(key);
                    }
                    for (var value of formData.values()) {
                        console.log(value);
                    }*/

//fonction synchro ajout photo dans la galerie en arrière-plan de la modale
async function synchroAddGallery(figureToAdd) {
    let gallery = document.querySelector(".gallery");
    let newFigure = document.createElement("figure");
    newFigure.id = figureToAdd.id;
    let imageWork = document.createElement("img");
    imageWork.src = figureToAdd.imageUrl;
    imageWork.alt = figureToAdd.title;
    let nameWork = document.createElement("figcaption");
    nameWork.innerText = figureToAdd.title;
    newFigure.appendChild(imageWork);
    newFigure.appendChild(nameWork);
    gallery.appendChild(newFigure);
}

//fonction synchro ajout photo dans la galerie de la modale
async function synchroAddGalleryModal(figureToAdd) {
    let divGalleryModal = document.querySelector(".photosGalleryModal");
    let gallery = document.querySelector(".gallery");
    let figure = document.querySelectorAll(".figure");
    let divImgAndSupp = document.createElement("div");
    divImgAndSupp.className = "divImgAndSupp";
    divImgAndSupp.id = figureToAdd.id;
    let photos = document.createElement("img");
    photos.src = figureToAdd.imageUrl;
    photos.className = "photosWorksGalleryModal";
    //création btn supp pour chaque photo
    let btnSupp = document.createElement("button");
    btnSupp.className = "btnSupp";
    btnSupp.id = divImgAndSupp.id;
    figure.id = divImgAndSupp.id;
    //ajout icone poubelle pour chaque btn supp
    let iconSupp = document.createElement("img");
    iconSupp.src = "./assets/icons/icone-poubelle.svg";
    iconSupp.alt = "Supprimer la photo";
    btnSupp.appendChild(iconSupp);
    //ajout de tout le bazar dans la galerie
    divImgAndSupp.appendChild(photos);
    divImgAndSupp.appendChild(btnSupp);
    divGalleryModal.appendChild(divImgAndSupp);
    btnSupp.addEventListener("click", () => {
        synchroSuppGallery(btnSupp.id, figure);
        deleteWorks(btnSupp.id, divImgAndSupp);
    });
}

/*
Pour restaurer travaux suprimés dans la base de données (supp travaux dans la modale):
fermer le terminal Node (ctrl + C)
ouvrir terminal classique (powershell)
entrer commande: git status
entrer commmande: git restore + le nom du fichier modifié (backend, sqlite)
*/
