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
        btnSupp.id; //?
        //ajout de tout le bazar dans la galerie
        divImgAndSupp.appendChild(photos);
        divImgAndSupp.appendChild(btnSupp);
        divGalleryModal.appendChild(divImgAndSupp);
        // console.log(divGalleryModal); //////////
        let figureToSupp = null;
        btnSupp.addEventListener("click", () => {
            deleteWorks(btnSupp.id, divImgAndSupp /*, figureToSupp, gallery*/);
            synchroSuppGallery(btnSupp.id, figureToSupp);
        });
    }
}

//fonction pour synchroniser la suppression des travaux en dehors de la modale
async function synchroSuppGallery(btnSuppId, figureToSupp) {
    const gallery = document.querySelector(".gallery");
    const allFigures = gallery.querySelectorAll("figure");
    //figureToSupp = null;
    for (let i = 0; i < allFigures.length; i++) {
        let figure = allFigures[i];
        if (figure.id === btnSuppId) {
            figureToSupp = figure;
            break;
        }
    }
    console.log(figureToSupp);
    gallery.removeChild(figureToSupp);
}

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

function closeModal(event) {
    const modal = document.querySelector(".modal");
    if (event) event.stopPropagation();
    if (modal) {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
    }
}

function openSecondPage(event) {
    event.preventDefault();
    if (modal) {
        modalWrapper2.setAttribute("aria-modal", "true");
        modalWrapper1.style.display = "none";
        modalWrapper2.style.display = "flex";
    }
}

function backToFirstPage(event) {
    event.preventDefault();
    if (modal) {
        modalWrapper1.setAttribute("aria-modal", "true");
        modalWrapper2.style.display = "none";
        modalWrapper1.style.display = "flex";
    }
}

async function deleteWorks(
    toto,
    divImgAndSupp /*, figureToSupp, gallery*/
    /*figureToSupp*/
) {
    /*const gallery = document.querySelector(".gallery");
    const figure = gallery.querySelectorAll("figure");
    figure.id = toto;*/
    const token = localStorage.getItem("token");
    const result = await fetch("http://localhost:5678/api/works/" + toto, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
        }
    });
    console.log(toto);
    if (!result.ok) {
        console.log("erreur!!!");
    } else {
        //console.log(divImgAndSupp);
        divImgAndSupp.remove();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const open = document.querySelector(".jsModal");
    const btnQuit = document.querySelectorAll(".btnQuit");
    const fileUpload = document.getElementById("fileUpload");
    const formAddWork = document.getElementById("formAddWork");
    const btnPostPhoto = document.querySelector(".btnPostPhoto");
    const btnGoBack = document.querySelector(".btnGoBack");
    let btnSupp = document.querySelectorAll(".btnSupp");
    if (open) {
        open.addEventListener("click", openModal);
    }
    btnQuit.forEach((btnQuit) => {
        btnQuit.addEventListener("click", closeModal);
    });
    modal.addEventListener("click", closeModal);
    modalWrapper1.addEventListener("click", stopPropagation);
    modalWrapper2.addEventListener("click", stopPropagation);
    if (btnPostPhoto) {
        btnPostPhoto.addEventListener(
            "click",
            //ReverseViewImgSelected,
            openSecondPage
        );
    }
    if (btnGoBack) {
        btnGoBack.addEventListener("click", backToFirstPage);
    }
    if (fileUpload) {
        fileUpload.addEventListener("change", viewImgSelected);
    }
    let figureToAdd = null;
    if (formAddWork) {
        formAddWork.addEventListener("submit", submitForm);
        //synchroAddGallery(figureToAdd);
        console.log(formAddWork);
    }
    //formAddWork.addEventListener("submit", logSubmit);
    const log = document.getElementById("log");
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });
});
/*function logSubmit(event) {
    log.textContent = `Form Submitted! Timestamp: ${event.timeStamp}`;
    event.preventDefault();
}*/
// photo choisie intégrée sur form modale
function viewImgSelected(event) {
    const file = event.target.files[0];
    const fileUpload = document.getElementById("fileUpload");
    if (file) {
        console.log("truc ajouté: ", file.name);
        const reader = new FileReader();
        reader.onload = function (event) {
            let containerPhoto = document.querySelector(".containerPhoto");
            let selectedImg = document.getElementById("customTest");
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
                console.log(selectedImg);
            }
        };
        reader.readAsDataURL(file);
    } else {
        console.log("no file selected");
    }
}

// construction fonction pour nettoyer la div containrer photo quand on quitte la secondemodale
/*function ReverseViewImgSelected(event) {
    const file = event.target.files[0];
    const fileUpload = document.getElementById("fileUpload");
    if (file) {
        //const reader = new FileReader();
        //reader.onload = function (event) {
        let containerPhoto = document.querySelector(".containerPhoto");
        let selectedImg = document.getElementById("customTest");
        let iconeImage = document.getElementById("iconeImage");
        let textContainerPhoto = document.getElementById("textContainerPhoto");
        if (selectedImg) {
            iconeImage.style = "display:inline";
            textContainerPhoto.style = "display:inline";
            containerPhoto.style.cssText = "";
            selectedImg.style.cssText = "";
            selectedImg.innerHTML = `""`;
            console.log(selectedImg);
        }
    }
}*/

//////

/* */
async function submitForm(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const formAddWork = document.getElementById("formAddWork");
    //const selectedImg = document.getElementById("selectedImg");
    let fileUpload = document.getElementById("fileUpload");
    let file = fileUpload.files[0];
    let figureToAdd = null;
    let addPhotoTitleInput = document.getElementById("addPhotoTitleInput");
    let addPhotoCategoryInput = document.getElementById(
        "addPhotoCategoryInput"
    );
    //);
    const formData = new FormData(formAddWork);
    console.log(formData.entries());
    console.log(Array.from(formData.entries()));

    try {
        const result = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token
            },
            body: formData
        });
        console.log(formData);
        //afficher les données du form dans la console
        for (var key of formData.keys()) {
            console.log(key);
        }
        for (var value of formData.values()) {
            console.log(value);
        }
        /////
        if (result.ok) {
            console.log("tout est ok");
            const figureToAdd = await result.json();
            synchroAddGallery(figureToAdd);
            synchroAddGalleryModal(figureToAdd);
            backToFirstPage(event);
            console.log(figureToAdd);
        } else {
            console.log("jpp");
            let contentMsgError =
                "Tous les champs doivent être remplis pour pouvoir valider";
            let msgError = document.createElement("p");
            msgError.textContent = contentMsgError;
            //Supprimer le message d'erreur précédent s'il existe
            const existingError = formAddWork.querySelector("p.error-message");
            if (existingError) {
                formAddWork.removeChild(existingError);
            } else if (
                //file === null ||
                addPhotoTitleInput.value === null ||
                addPhotoCategoryInput.value === null
            ) {
                // Ajout classe "error-message" pour la suppression future
                msgError.classList.add("error-message");
                formAddWork.appendChild(msgError);
                //formAddWork.querySelector("[name=email]").value = "";
                //formAddWork.querySelector("[name=password]").value = "";
                //throw new Error("Identifiants incorrects");
            }
        }
        //if (token) {
        //console.log(token);
        //}
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

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
    //ce qui reste à faire gnagnagna
    //photosGalleryModal.appendChild(newFigure);
}

async function synchroAddGalleryModal(figureToAdd) {
    let divGalleryModal = document.querySelector(".photosGalleryModal");
    let gallery = document.querySelector(".gallery");
    let figure = document.querySelectorAll(".figure");
    let divImgAndSupp = document.createElement("div");
    divImgAndSupp.className = "divImgAndSupp";
    divImgAndSupp.id = /*works[0]*/ figureToAdd.id;
    //création d'un attribut catégorie pour chaque photo
    //let category = works[i].category.name;
    //divImgAndSupp.setAttribute("category", category);
    //
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
        deleteWorks(btnSupp.id, divImgAndSupp /*, figureToSupp, gallery*/);
    });
}

/*async function synchroAddGallery(figureToAdd) {
    const reponseWorks = await fetch("http://localhost:5678/api/works");
    const works = await reponseWorks.json();
    let gallery = document.querySelector(".gallery");
    let allFigures = gallery.querySelectorAll("figure");
    for (let i = 0; i < allFigures.length; i++) {
        let exemple = works[i];
        figureToAdd = document.createElement("figure");
        //newFigure.id = works[i].id;
        let imageWork = document.createElement("img");
        imageWork.src = exemple.imageUrl;
        let nameWork = document.createElement("figcaption");
        nameWork.innerText = exemple.title;
        //figureToAdd = null;
        let maxId = allFigures.length;
        console.log(allFigures);
        console.log(maxId);
        let figure = allFigures[i];
        if (figure.id < maxId) {
            figureToAdd = figure;
            break;
        }
        figureToAdd.appendChild(imageWork);
        figureToAdd.appendChild(nameWork);
        gallery.appendChild(figureToAdd);
    }
    console.log(figureToAdd);
}


///////
{id: 19, title: 'ezezdsdezezd', imageUrl: 'http://localhost:5678/images/malt-and-juniper-NY1721827816725.png', categoryId: '3', userId: 1}
///////

/*
Pour restaurer travaux suprimés dans la base de données (supp travaux dans la modale):
fermer le terminal Node (ctrl + C)
ouvrir terminal classique (powershell)
entrer commande: git status
entrer commmande: git restore + le nom du fichier modifié (backend, sqlite)
*/
