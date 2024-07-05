const modal = document.getElementById("modal1");
const modalWrapper1 = document.getElementById("modal-wrapper1");
const modalWrapper2 = document.getElementById("modal-wrapper2");

async function generatePhotosWorks() {
    const reponseWorks = await fetch("http://localhost:5678/api/works");
    const works = await reponseWorks.json();
    let divGalleryModal = document.querySelector(".photosGalleryModal");
    divGalleryModal.innerHtml = ""; //nettoyer la div si déjà remplie de photos
    for (let i = 0; i < works.length; i++) {
        const imageWork = works[i];
        //création div pour chaque "case" photo work + btn poubelle
        let divImgAndSupp = document.createElement("div");
        divImgAndSupp.className = "divImgAndSupp";
        //création photos des travaux
        let photos = document.createElement("img");
        photos.src = imageWork.imageUrl;
        photos.className = "photosWorksGalleryModal";
        //création btn supp pour chaque photo
        let btnSupp = document.createElement("button");
        btnSupp.className = "btnSupp";
        //ajout icone poubelle pour chaque btn supp
        let iconSupp = document.createElement("img");
        iconSupp.src = "./assets/icons/icone-poubelle.svg";
        iconSupp.alt = "Supprimer la photo";
        btnSupp.appendChild(iconSupp);
        //ajout de tout le bazar dans la galerie
        divImgAndSupp.appendChild(photos);
        divImgAndSupp.appendChild(btnSupp);
        divGalleryModal.appendChild(divImgAndSupp);
        console.log(divGalleryModal);
    }
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

document.addEventListener("DOMContentLoaded", () => {
    const open = document.querySelector(".jsModal");
    const btnQuit = document.querySelectorAll(".btnQuit");
    const btnPostPhoto = document.querySelector(".btnPostPhoto");
    const btnGoBack = document.querySelector(".btnGoBack");
    if (open) {
        open.addEventListener("click", openModal);
    }
    btnQuit.forEach((button) => {
        button.addEventListener("click", closeModal);
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
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });
});

/*pour fonction supprimer photo quand click poubelle : if machin truc add eventlistener "click" 
--> icone.poubelle.removeparent(photo)?? ou supprimer plutot la divImgAndSupp concernée ?*/
