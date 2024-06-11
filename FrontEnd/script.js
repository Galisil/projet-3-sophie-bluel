document.addEventListener("DOMContentLoaded", async () => {
  const reponse = await fetch("http://localhost:5678/api/works");
  const works = await reponse.json();
  for (let i = 0; i < works.length; i++) {
    const exemple = works[i];
    let figure = document.createElement("figure");
    let imageWork = document.createElement("img");
    imageWork.src = exemple.imageUrl;
    let nameWork = document.createElement("figcaption");
    nameWork.innerText = exemple.title;

    let sectionGallery = document.querySelector(".gallery");
    sectionGallery.appendChild(figure);
    figure.appendChild(imageWork);
    figure.appendChild(nameWork);
  }
});
