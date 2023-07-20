const divContainer = window.document.querySelector(".movies");
const buttonBackwards = window.document.querySelector(".btn-prev");
const buttonFoward = window.document.querySelector(".btn-next");
const inputSearch = window.document.querySelector(".input");
const highLightLink = window.document.querySelector(".highlight__video-link");
const highLightVideo = window.document.querySelector(".highlight__video");
const highLightTitle = window.document.querySelector(".highlight__title");
const highLightRating = window.document.querySelector(".highlight__rating");
const highLightGenres = window.document.querySelector(".highlight__genres");
const highLightLaunch = window.document.querySelector(".highlight__launch");
const highLightDescription = window.document.querySelector(".highlight__description");
const modal = window.document.querySelector(".modal");
const modalBody = window.document.querySelector(".modal__body");
const modalTitle = window.document.querySelector(".modal__title");
const modalImg = window.document.querySelector(".modal__img");
const modalDescription = window.document.querySelector(".modal__description");
const modalAverage = window.document.querySelector(".modal__average");
const modalGenres = window.document.querySelector(".modal__genres");
const modalClose = window.document.querySelector(".modal__close");
const body = window.getComputedStyle(window.document.body);
const root = window.document.querySelector(":root");
const theme = window.document.querySelector(".btn-theme");
const logo = window.document.querySelector(".header__container-logo img");

let data = [];
let page = 0;

async function loadPage(phrase){
    data = await getData(phrase);
    renderElements(data);
}

async function loadHighLight(){
    const generalVideo = await api.get("/3/movie/436969?language=pt-BR");
    const specifcVideo = await getData("/3/movie/436969/videos?language=pt-BR");

    highLightVideo.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${generalVideo.data.backdrop_path})`;
    highLightVideo.style.backgroundSize = "contain";
    highLightTitle.innerText = generalVideo.data.title;
    highLightRating.innerText = generalVideo.data.vote_average;
    let genre = "";
    generalVideo.data.genres.forEach((item, index) => {
        if(index === generalVideo.data.genres.length - 1){
            genre += `${item.name}`;
        }else {
            genre += `${item.name}, `;
        }
    });
    highLightGenres.innerText = genre;
    highLightLaunch.innerText = new Date(generalVideo.data.release_date).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
    highLightDescription.innerText = generalVideo.data.overview;
    highLightLink.href = `https://www.youtube.com/watch?v=${specifcVideo[0].key}`;
}
loadHighLight();

loadPage("/3/discover/movie?language=pt-BR&include_adult=false");

function renderElements(array){
    divContainer.innerHTML = "";
    array.slice(page, page + 6).forEach((item) => {
        const divMovie = window.document.createElement("div");
        divMovie.classList.add("movie");
        divMovie.style.backgroundImage = `url(${item.poster_path})`;

        const divMovieInfo = window.document.createElement("div");
        divMovieInfo.classList.add("movie__info");

        const spanMovieTitle = window.document.createElement("span");
        spanMovieTitle.classList.add("movie__title");
        spanMovieTitle.innerText = item.title;

        const spanMovieRating = window.document.createElement("span");
        spanMovieRating.classList.add("movie__rating");
        spanMovieRating.innerText = item.vote_average;

        const spanImage = window.document.createElement("img");
        spanImage.src = "./assets/estrela.svg";
        spanImage.alt = "Estrela";

        divMovie.appendChild(divMovieInfo);
        divMovieInfo.appendChild(spanMovieTitle);
        divMovieInfo.appendChild(spanMovieRating);
        spanMovieRating.appendChild(spanImage);
        divContainer.appendChild(divMovie);

        divMovie.addEventListener("click", () => {openModal(item)});
    });
}

async function openModal(event){
    modal.classList.remove("hidden");
    modalGenres.innerHTML = "";

    const response = await api.get(`/3/movie/${event.id}?language=pt-BR`);
    const movie = await response.data;

    movie.genres.forEach((item) => {
        const spanGenres = window.document.createElement("span");
        spanGenres.classList.add("modal__genre");
        spanGenres.innerText = item.name;
        modalGenres.appendChild(spanGenres);
    });

    modalTitle.innerText = movie.title;
    modalImg.src = movie.backdrop_path;
    modalDescription.innerText = movie.overview;
    modalAverage.innerText = movie.vote_average;
}

buttonBackwards.addEventListener("click", () => {
    if(page === 0){
        page = 12;
        renderElements(data);
    }else if(page >= 6){
        page -= 6;
        renderElements(data);
    }
});

buttonFoward.addEventListener("click", () => {
    if(page == 12){
        page = 0;
        renderElements(data);
    }else if(page <= 10){
        page += 6;
        renderElements(data);
    }

});

inputSearch.addEventListener("keypress", (event) => {
    if(event.key === "Enter" && !inputSearch.value){
        page = 0;
        loadPage("/3/discover/movie?language=pt-BR&include_adult=false");
    }else if(event.key === "Enter" && inputSearch.value){
        page = 0;
        loadPage(`/3/search/movie?language=pt-BR&include_adult=false&query=${inputSearch.value}`);
        inputSearch.value = "";
    }
});

modalBody.addEventListener("click", () => {
    modal.classList.add("hidden")
});

modalClose.addEventListener("click", () => {
    modal.classList.add("hidden")
});

theme.addEventListener("click", () => {
    if(body.getPropertyValue("background-color") === "rgb(255, 255, 255)"){
        root.style.setProperty("--background", "#1B2028");
        root.style.setProperty("--text-color", "#FFFFFF");
        root.style.setProperty("--bg-secondary", "#2D3440");
        root.style.setProperty("--input-color", "#665F5F");
        root.style.setProperty("--background-input-color", "#3E434D");

        buttonFoward.src = "./assets/arrow-right-light.svg";
        buttonBackwards.src = "./assets/arrow-left-light.svg";
        theme.src = "./assets/dark-mode.svg";
        logo.src = "./assets/logo.svg";
        modalClose.src = "./assets/close.svg";
    }else {
        root.style.setProperty("--background", "#fff");
        root.style.setProperty("--text-color", "#1b2028");
        root.style.setProperty("--bg-secondary", "#ededed");
        root.style.setProperty("--input-color", "#979797");
        root.style.setProperty("--background-input-color", "#fff");
        
        buttonFoward.src = "./assets/arrow-right-dark.svg";
        buttonBackwards.src = "./assets/arrow-left-dark.svg";
        theme.src = "./assets/light-mode.svg";
        logo.src = "./assets/logo-dark.png";
        modalClose.src = "./assets/close-dark.svg";
    }
});