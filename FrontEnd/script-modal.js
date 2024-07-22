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
    figureToSupp = null;
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

/*function backToFirstPage(event) {
    event.preventDefault();
    if (modal) {
        modalWrapper1.setAttribute("aria-modal", "true");
        modalWrapper2.style.display = "none";
        modalWrapper1.style.display = "flex";
    }
}*/

async function deleteWorks(
    toto,
    divImgAndSupp,
    figureToSupp /*, figureToSupp, gallery*/
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
        btnPostPhoto.addEventListener("click", openSecondPage);
    }
    if (btnGoBack) {
        btnGoBack.addEventListener("click", openModal /* ou backToFirstPage*/);
    }
    /*if (fileUpload) {
        fileUpload.addEventListener("change", viewImgSelected);
    }*/
    if (formAddWork) {
        formAddWork.addEventListener("submit", submitForm);
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
/*function viewImgSelected(event) {
    const file = event.target.files[0];
    const fileUpload = document.getElementById("fileUpload");
    const containerPhoto = document.querySelector(".containerPhoto");
    if (file) {
        console.log("truc ajouté: ", file.name);
        //fileUpload.style.display = "none";
        const reader = new FileReader();
        reader.onload = function (event) {
            //containerPhoto.innerHTML = `<img src="${event.target.result}" id="selectedImg" alt="Selected Image" style="max-width: 100%; style="border: border-box"; height: auto;" />`;
            let selectedImg = document.getElementById("selectedImg");
            if (selectedImg) {
                selectedImg.style = "display:true";
                selectedImg.src = event.target.result;
            }
        };
        reader.readAsDataURL(file);
    } else {
        console.log("no file selected");
    }
}

//////

/* */
async function submitForm(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const formAddWork = document.getElementById("formAddWork");
    //const selectedImg = document.getElementById("selectedImg");
    let fileUpload = document.getElementById("fileUpload");
    let file = fileUpload.files[0];
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
        } else {
            console.log("jpp");
        }
        if (token) {
            console.log(token);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

/*
Pour restaurer travaux suprimés dans la base de données (supp travaux dans la modale):
fermer le terminal Node (ctrl + C)
ouvrir terminal classique (powershell)
entrer commande: git status
entrer commmande: git restore + le nom du fichier modifié (backend, sqlite)
*/
