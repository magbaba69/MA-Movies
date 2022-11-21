let id = 0;
const search = document.getElementById("search");
const page = document.querySelector(".pagging");
const apiKey = `api_key=802d728b7baba8a95e2b11a4cb63c614`;
const baseMoviesURL = `https://api.themoviedb.org/3/`;
const discoverPartURL = `discover/movie?sort_by=popularity.desc&`;
const genresPartURL = `genre/movie/list?`;
const searchPartURL = `search/movie?`;
const moviesV = document.querySelector(".movies");
const imgPathMoviesURL = `https://image.tmdb.org/t/p/w500`;
const pageNumber = document.getElementById("page");
const secondsontainerV = document.getElementById("main-second-container");
const genresV = document.getElementById("genresOption");
const back = document.getElementById("btnBack");
const moviesContainer = document.querySelector(".movies-container");
const btn = document.getElementById("btnBack");
const language = "&language=en-US";
let fav;
let flag = "";
let genreText = "All";
let myFavourites = JSON.parse(localStorage.getItem("MAMovies"));
let genText;
let imageMoviePath;
let posteMoviePath;
let numOfActors;
let lcLogin = JSON.parse(localStorage.getItem("MAMoviesLogin"));

url = `${baseMoviesURL}${discoverPartURL}${apiKey}&with_genres=${genreText}${language}`;
let genresURL = `${baseMoviesURL}${genresPartURL}${apiKey}${language}`;
getMovies(url, 1, genreText);
getGenres(genresURL);

//CHECK LOCAL STORAGE  MAMovies
if (myFavourites === null) {
  fav = [];
} else {
  fav = myFavourites.moviesID;
}

//GET ALL MOVIES (by popularity)
async function getMovies(url, page, genreText) {
  document.querySelector(".genreHeader").innerHTML = genreText;
  genText = genreText;
  let nesto = url + "&page=" + page;
  const response = await fetch(url + "&page=" + page);
  const respData = await response.json();
  showMovies(respData);
}
//GET BY TOP RATED
document.querySelector(".topRated").addEventListener("click", topRatedMovies);
function topRatedMovies() {
  genresV.selectedIndex = 0;
  search.value = "";
  let ggg = "Top rated movies";

  url = `https://api.themoviedb.org/3/movie/top_rated?${apiKey}&language=en-US`;
  getMovies(url, 1, ggg);
}

// GET LATEST MOVIES
document.querySelector(".latest").addEventListener("click", upcomingMovies);
function upcomingMovies() {
  genresV.selectedIndex = 0;
  search.value = "";
  let ggg = "Upcoming";
  url = `https://api.themoviedb.org/3/movie/upcoming?${apiKey}&language=en-US`;

  getMovies(url, 1, ggg);
}

//SHOW ALL MOVIES
let totalPages;
function showMovies(response) {
  console.log("bbbbbbbbbbbbbb");
  console.log(response);
  moviesContainer.style.display = "block";
  secondsontainerV.style.display = "none";
  btn.style.display = "none";
  totalPages = response.total_pages;
  let data = response.results;
  let printing = ``;
  moviesV.innerHTML = "";
  data.forEach((element) => {
    formatDate(element.release_date);
    element.release_date = date;
    if (element.poster_path != null) {
      imageMoviePath = imgPathMoviesURL + element.poster_path;
    } else {
      imageMoviePath = "img/noImage.png";
    }

    printing = ``;
    const div = document.createElement("div");
    div.classList.add("theMovie");
    printing += `
        <h2> ${element.title}</h2>
        <img src="${imageMoviePath}" data-id="${element.id}"  alt="${element.title}" class="theMovieImg">
        <div class="movieRate">
        <div class="popularity"><i class="fa-solid fa-star"></i> ${element.vote_average}</div>
        <div class="release"> ${element.release_date}</div>
        </div>
     `;
    div.innerHTML = printing;
    moviesV.appendChild(div);

    //svi favoriti
    //ovde
  });

  const images = document.querySelectorAll(".theMovieImg");

  images.forEach((element) => {
    element.addEventListener("click", getTheMovieData);
  });
}

//GET second DATA BY MOVIES ID
function getTheMovieData(e) {
  let id = e.target.dataset.id;

  getTheMovie(id);
}
//GET THE ACTOR DATA
function getActorData(e) {
  let id = e.target.dataset.acid;
  getTheActor(id);
  // console.log(id);
}

// FIND ONE MOVIE AND ACTORS BY ID
async function getTheMovie(id) {
  const res = await fetch(
    `${baseMoviesURL}movie/${id}?${apiKey}${language}`
    // `https://api.themoviedb.org/3/movie/${id}?api_key=802d728b7baba8a95e2b11a4cb63c614`
  );

  const resA = await fetch(
    `${baseMoviesURL}movie/${id}/casts?${apiKey}${language}`
    // `http://api.themoviedb.org/3/movie/${id}/casts?api_key=802d728b7baba8a95e2b11a4cb63c614`
  );

  const respData = await res.json();
  const respDataA = await resA.json();

  showsecondData(respData, respDataA);
}
//***************************************************************************************************** */

//FIND ACTOR DETAILS BY ACTOR ID

async function getTheActor(id) {
  const resActor = await fetch(
    `${baseMoviesURL}person/${id}?${apiKey}${language}`
    // `https://api.themoviedb.org/3/person/${id}?api_key=802d728b7baba8a95e2b11a4cb63c614&language=en-US`
  );
  const respAcData = await resActor.json();

  showActorData(respAcData);
}

//SHOW DATA ABOUT MOVIE
async function showsecondData(data, actor) {
  scroll(0, 0);
  let numberOfActors = actor.cast.length;
  console.log(numberOfActors);
  document.querySelector(".movies-container").style.display = "none";
  secondsontainerV.style.display = "block";
  btn.style.display = "block";
  let movieGenres = data.genres;
  let theMovieGenres = [];
  movieGenres.forEach((element) => {
    theMovieGenres.push(" " + element.name);
  });

  document.querySelector(".second-header").innerHTML = ` <h2>${data.title}</h2>
`;
  document.querySelector(".second-movie-image-container").innerHTML = `
      <img class="second-movie-image" src="${
        imgPathMoviesURL + data.poster_path
      }" alt="poster of movie"/>
      <p>Genres: 
      <span class="genres">${theMovieGenres}</span>
      </p>
      <p><i class="fa-solid fa-heart favourite"></i>
      </p>
`;
  document.querySelector(".second-movie-text").innerHTML = `
      <h2>Overview</h2>
      <p>
      ${data.overview}</p>
      <br>
      <h2> ${data.tagline}</h2>
      <img class="second-movie-image" src="${
        imgPathMoviesURL + data.backdrop_path
      }" alt="poster of movie"/>
      </div>
`;
  //CHCK NUMBER OF ACTORS IN RESPONSE AND CHECK IF ACTOR HAS AN IMAGE
  if (numberOfActors <= 6) {
    numOfActors = numberOfActors;
  } else {
    numOfActors = 6;
  }
  let actorID = [];
  let actorName = [];
  let actorImage = [];
  let noImage = "img/noImage.png";

  for (let i = 0; i < numOfActors; i++) {
    actorName[i] = actor.cast[i].name;
    actorID[i] = actor.cast[i].id;
    if (actor.cast[i].profile_path != null) {
      actorImage[i] = imgPathMoviesURL + actor.cast[i].profile_path;
      console.log(actorImage);
    } else {
      actorImage[i] = noImage;
    }
    console.log(actorImage[0]);
  }
  let actorsImages = "";

  document.querySelector(".second-actors-container").innerHTML = ``;

  for (let i = 0; i < numOfActors; i++) {
    actorsImages += `
      <div class="actor-container"  >
      <img src="${actorImage[i]}" alt='actor image'data-acid="${actorID[i]}" class="actor-image"/>
      <p class="actor-name">${actorName[i]}</p>
      </div>`;
  }

  document.querySelector(
    ".second-actors-container"
  ).innerHTML += `<h2>ACTORS</h2>
  ${actorsImages}`;
  let acImage = document.querySelectorAll(".actor-image");
  console.log(acImage);
  acImage.forEach((element) => {
    element.addEventListener("click", getActorData);
  });

  //FAVOURITES

  let favouriteV = document.querySelector(".favourite");
  if (fav.includes(data.id)) {
    favouriteV.className = "fa-solid fa-heart favourite yes";
  }

  favouriteV.addEventListener("click", () => {
    favouriteV.classList.toggle("yes");
    setFavourite(data.id);
  });
}

//***************************************************************************************************** */

//PAGINATION
document.getElementById("next").addEventListener("click", nextPage);
function nextPage() {
  let numberOfPage = Number(document.getElementById("page").textContent);
  getMovies(url, numberOfPage + 1, genText);
  page.innerHTML = `
      <span id="previous"> <i class="fa fa-angle-double-left"></i> </span>
      <span id="page">${numberOfPage + 1}</span>`;

  if (numberOfPage < totalPages) {
    page.innerHTML += `
      <span id="next"> <i class="fa fa-angle-double-right"></i> </span>`;
  }
  document.getElementById("next").addEventListener("click", nextPage);
  document.getElementById("previous").addEventListener("click", previousPage);

  scroll(0, 0);
}

function previousPage() {
  numberOfPage = Number(document.getElementById("page").textContent);

  getMovies(url, numberOfPage - 1, genText);
  if (numberOfPage > 2) {
    page.innerHTML = `
      <span id="previous"> <i class="fa fa-angle-double-left"></i> </span>
      <span id="page">${numberOfPage - 1}</span> 
      <span id="next"> <i class="fa fa-angle-double-right"></i> </span>`;
    document.getElementById("previous").addEventListener("click", previousPage);
  } else {
    page.innerHTML = `
      <span id="page">${numberOfPage - 1}</span> 
      <span id="next"> <i class="fa fa-angle-double-right"></i> </span>`;
  }
  document.getElementById("next").addEventListener("click", nextPage);

  scroll(0, 0);
}

//SEARCH MOVIE BY TERM
document.getElementById("searchMovie").addEventListener("submit", function (e) {
  document.querySelector(".aboutActor").style.display = "none";
  genresV.selectedIndex = 0;
  e.preventDefault();
  numberOfPage = 1;
  document.getElementById("page").innerHTML = numberOfPage;
  const searchTerm = search.value;
  url = `${baseMoviesURL}${searchPartURL}${apiKey}&query=${searchTerm}${language}`;
  if (searchTerm) {
    getMovies(url, 1, searchTerm);
  }
});

//SET MOVIES ID IN LOCALSTORAGE
let moviesLS = JSON.parse(localStorage.getItem("movies")) || [];
function checkLocalStorage(id) {
  moviesLS.forEach((element) => {
    if (element != id) {
      let newItem = id;
      moviesLS.push(newItem);
      localStorage.setItem("movies", JSON.stringify(moviesLS));
    } else {
      removeLocalStorage(id);
    }
  });
}
//CHECK IF ID ALREDY IS IN LOCALSTORAGE
function removeLocalStorage(id) {
  const index = moviesLS.indexOf(id);
  if (index > -1) {
    moviesLS.splice(index, 1);
  }
}

//ADD FAVOURETE TO THE LOCAL STORAGE
function setFavourite(id) {
  if (fav.includes(id)) {
    // let ind = fav.indexOf(id);
    fav.splice(fav.indexOf(id), 1);
  } else {
    fav.push(id);
  }
  myFavourites = { moviesID: fav };
  let ls = JSON.stringify(myFavourites);
  localStorage.setItem("MAMovies", ls);
}

//NAV BAR TOGGLE
const navToggler = document.querySelector(".nav-toggler");
const navMenu = document.querySelector(".movie-navbar ul");
const navLinks = document.querySelectorAll(".movie-navbar a");
allEventListners();
function allEventListners() {
  navToggler.addEventListener("click", togglerClick);

  navLinks.forEach((elem) => elem.addEventListener("click", navLinkClick));
}
function togglerClick() {
  navToggler.classList.toggle("toggler-open");
  navMenu.classList.toggle("open");
  moviesV.classList.toggle("hidden");
}
function navLinkClick() {
  if (navMenu.classList.contains("open")) {
    navToggler.click();
  }
}
//GET GENRES AND FILL OPTION
async function getGenres(genresURL) {
  console.log(genresURL);
  const response = await fetch(genresURL);
  const genresRes = await response.json();
  fillOptionGenres(genresRes);
}
function fillOptionGenres(gen) {
  gen.genres.forEach((element) => {
    genresV.innerHTML += `
      <option value="${element.id}">${element.name}</option>
    `;
  });
}
//GET MOVIES BY GENRE
genresV.addEventListener("change", getGenreMovies);
function getGenreMovies() {
  document.querySelector(".aboutActor").style.display = "none";
  search.value = "";
  let page = 1;
  let k = genresV.value;
  console.log("aaaaaabababa" + k);
  genresText = genresV.options[genresV.selectedIndex].text;
  url = `${baseMoviesURL}${discoverPartURL}${apiKey}&with_genres=${k}${language}`;
  document.getElementById("page").textContent = 1;
  getMovies(url, page, genresText);
}

//GO TO TOP BUTTON
document.getElementById("btnTop").addEventListener("click", () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

//GO BACK BUTTON
back.addEventListener("click", () => {
  moviesContainer.style.display = "block";
  secondsontainerV.style.display = "none";
  btn.style.display = "none";
  document.querySelector(".aboutActor").style.display = "none";
});

//SHOW ACTOR DATA
function showActorData(response) {
  let noData = "There is no data about this.";
  data = response;
  document.querySelector(".aboutActor").style.display = "block";
  console.log("ovo su podaci");
  console.log(data);
  let biog = response.biography.split(".");
  biog.forEach((element) => {
    console.log("ok");
  });
  let biographyText = response.biography;
  if (biographyText == "" || biographyText == []) {
    biographyText = noData;
    console.log("nema biografiju");
  }
  formatDate(response.birthday);
  let birthdayText = date;

  if (birthdayText == [] || birthdayText == "null" || birthdayText == null) {
    birthdayText = noData;
  }
  let allAboutActor = document.querySelector(".aboutActor");
  formatDate(response.deathday);
  let deathdayText = date;
  if (deathdayText == null || deathdayText == "null") {
    deathdayText = "";
  }
  let alsoKnownAsText = response.also_known_as;
  if (
    alsoKnownAsText == "null" ||
    alsoKnownAsText == [] ||
    alsoKnownAsText == "null"
  ) {
    alsoKnownAsText = noData;
  }
  let placeOfBirth = response.place_of_birth;
  if (placeOfBirth == null || placeOfBirth == "") {
    placeOfBirth = noData;
  }
  allAboutActor.innerHTML = `
      <p><span>Name:</span> <span class="nameOfActor">${response.name}</span></p>
      <p><span>Biography:</span><br>${biographyText}</p>
      <p><span>Birthday:</span> ${birthdayText}</p>
      <p><span>Place of birth:</span> ${placeOfBirth}</p>
      <p><span>Deathday:</span> ${deathdayText}</p>
      <p><span>Also known as:</span> ${alsoKnownAsText}</p>
      <p><span>Popularity:</span> ${response.popularity}</p>`;
  const scroll = document.querySelector(".aboutActor");
  scroll.scrollIntoView();
}
let mainContainer = document.getElementById("main-container");
let loginPage = document.querySelector(".login-form");
let registerPage = document.querySelector(".register-form");

//DISPLAY PAGE IF LOGIN IS SUCCESSFULL
function displayMain(h) {
  if (h == 0) {
    mainContainer.style.display = "none";
    // registerPage.style.display = "none";
    loginPage.style.display = "flex";
  } else {
    mainContainer.style.display = "block";
    // registerPage.style.display = "none";
    loginPage.style.display = "none";
    refresh();
  }
}

displayMain((h = 0));
controllLogin();
document.querySelector(".loginError").textContent = "";
let btnLogin = document.getElementById("btn-login");
console.log(btnLogin);
btnLogin.addEventListener("click", controllLogin);

function controllLogin() {
  let printing = "";

  let mailText = document.getElementById("mail-text");
  console.log(mailText.value);
  let passText = document.getElementById("pass-text");
  console.log(passText.value);
  printing = [mailText.value, passText.value];
  console.log(printing);
  if (printing[0] == "proba" && printing[1] == "proba") {
    let login = ["proba", "proba"];
    localStorage.setItem("MAMoviesLogin", JSON.stringify(login));
    mailText.value = "";
    passText.value = "";
    console.log("mail text contnt:" + mailText.textContent);

    displayMain((h = 1));
  } else {
    document.querySelector(".loginError").textContent =
      "Name or password is not correct, try again.";
  }
}

function checkLoginLC() {
  if (lcLogin != null) {
    displayMain((h = 1));
  } else {
    displayMain((h = 0));
  }
}

checkLoginLC();
//LOGOUT AND EMPTY LOCALSTORAGE
document.querySelector(".logout").addEventListener("click", () => {
  document.querySelector(".loginError").textContent = "";
  localStorage.removeItem("MAMoviesLogin");
  displayMain((h = 0));
});

//REFRESH PAGE AND DISPLAY DEFAULT
function refresh() {
  gentText = "All";
  url = `${baseMoviesURL}${discoverPartURL}${apiKey}${language}`;
  // getGenres(url);
  getMovies(url, 1, genText);
  // genresV.firstChild.value = "All";
  genresV.selectedIndex = 0;
  console.log((genresV.selectedIndex = 0));
  search.value = "";
  document.querySelector(".genreHeader").innerHTML = "All";
  document.querySelector(".aboutActor").style.display = "none";
}
let navHome = document.querySelector(".home");
navHome.addEventListener("click", refresh);

//FORMAT DATE (from yyyy-mm-dd to dd.mm.yyyy.)
function formatDate(d) {
  let formated;
  if (d == null || d == "" || d == "null") {
    date = d;
  } else {
    formated = d.split("-");
    date = formated[2] + "." + formated[1] + "." + formated[0] + ".";
  }
}
