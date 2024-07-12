document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId");
    const btnModifier = document.querySelector(".btnModifier");
    if (userId === "1") {
        //apparition bouton modale si admin connecté
        const iconeModifier = document.createElement("img");
        iconeModifier.src = "./assets/icons/icone-modifier.svg";
        iconeModifier.alt = "icône modifier";
        const linkModal = document.createElement("a");
        linkModal.href = "#modal1";
        linkModal.text = "modifier";
        linkModal.className = "jsModal";
        if (btnModifier) {
            btnModifier.appendChild(iconeModifier);
            btnModifier.appendChild(linkModal);
        }
        //bouton login devient bouton logout
        const btnLoginLogout = document.getElementById("btnLoginLogout");
        btnLoginLogout.text = "Logout";
    }
    const reponseWorks = await fetch("http://localhost:5678/api/works");
    const works = await reponseWorks.json();
    function generateWorks(works) {
        for (let i = 0; i < works.length; i++) {
            const exemple = works[i];
            let figure = document.createElement("figure");
            figure.id = works[i].id;
            let imageWork = document.createElement("img");
            imageWork.src = exemple.imageUrl;
            let nameWork = document.createElement("figcaption");
            nameWork.innerText = exemple.title;

            let sectionGallery = document.querySelector(".gallery");
            sectionGallery.appendChild(figure);
            figure.appendChild(imageWork);
            figure.appendChild(nameWork);
            /*btnSupp.addEventListener("click", () => {
                deleteWorks(btnSupp.id, divImgAndSupp);
            });*/
        }
    }
    generateWorks(works);
    //les catégories n'apparaissent pas quand l'admin est connectée
    if (userId !== "1") {
        const reponseCategories = await fetch(
            "http://localhost:5678/api/categories"
        );
        const categories = await reponseCategories.json();
        /* liste boutons filtres */
        const btnTous = document.createElement("button");
        btnTous.innerText = "Tous";
        btnTous.className = "btnCategories";
        btnTous.id = "btnTous";
        const btnObjets = document.createElement("button");
        btnObjets.innerText = "Objets";
        btnObjets.className = "btnCategories";
        btnObjets.id = "btnObjets";
        const btnAppartements = document.createElement("button");
        btnAppartements.innerText = "Appartements";
        btnAppartements.className = "btnCategories";
        btnAppartements.id = "btnAppartements";
        const btnHotelsRestaurants = document.createElement("button");
        btnHotelsRestaurants.innerText = "Hotels & restaurants";
        btnHotelsRestaurants.className = "btnCategories";
        btnHotelsRestaurants.id = "btnHotelsRestaurants";
        /* ajout boutons filtres à la page */
        let formFilters = document.getElementById("formFilters");
        formFilters.appendChild(btnTous);
        formFilters.appendChild(btnObjets);
        formFilters.appendChild(btnAppartements);
        formFilters.appendChild(btnHotelsRestaurants);
        /*bouton Tous cliqué*/
        btnTous.addEventListener("click", function () {
            event.preventDefault();
            const filteredWorks = works.filter(function (works) {
                return works;
            });
            document.querySelector(".gallery").innerHTML = "";
            generateWorks(filteredWorks);
        });
        /*bouton objets cliqué*/
        btnObjets.addEventListener("click", function () {
            event.preventDefault();
            const filteredWorks = works.filter(function (works) {
                return works.category.name === "Objets";
            });
            document.querySelector(".gallery").innerHTML = "";
            generateWorks(filteredWorks);
        });
        /*bouton Appartements cliqué*/
        btnAppartements.addEventListener("click", function () {
            event.preventDefault();
            const filteredWorks = works.filter(function (works) {
                return works.category.name === "Appartements";
            });
            document.querySelector(".gallery").innerHTML = "";
            generateWorks(filteredWorks);
        });
        /*bouton Hotels et restaurants cliqué*/
        btnHotelsRestaurants.addEventListener("click", function () {
            event.preventDefault();
            const filteredWorks = works.filter(function (works) {
                return works.category.name === "Hotels & restaurants";
            });
            document.querySelector(".gallery").innerHTML = "";
            generateWorks(filteredWorks);
        });
    }
});

/*            --1ere idée--
  const reponseCategories = await fetch("http://localhost:5678/api/categories");
  const categories = await reponseCategories.json();
  let filters = `
<button class="categoriesBtns">${"Tous"}</button>
<button class="categoriesBtns">${categories[0].name}</button>
<button class="categoriesBtns">${categories[1].name}</button>
<button class="categoriesBtns">${categories[2].name}</button>
`; 

  let formFilters = document.getElementById("formFilters");
  formFilters.innerHTML = filters; */

/*let categoriesBtns = divFilters.querySelectorAll(".categoriesBtns");
  categoriesBtns.addEventListener("click", function () {
    let filteredWorks = works.filter(function (works) {
      if categories[i].name === works.name
      return works.name === categories.name;
    });
  });
*/
