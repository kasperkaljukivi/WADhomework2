"use strict";

// Homework 2: loeme postituste andmed JSON-ist ja loome HTML-i JavaScriptiga.
const postsContainer = document.querySelector("#posts-container");

function createPost(post) { 
  const article = document.createElement("article"); //loome article elemendi
  article.className = "post"; //lisame css klassi

  const header = document.createElement("header"); //postituse päis
  const avatar = document.createElement("img");//loome profiilipildi
  avatar.className = "mini-avatar";//lisame css klass
  avatar.src = "images/avatar.jpg";//määrame profiilipildi asukoha
  avatar.alt = "User avatar";//lisame kirjelduse

  const author = document.createElement("strong"); // loome autori nime elemendi
  author.className = "post-author";//lisame autori css klassi
  author.textContent = post.author;//lisane nime json failist

  const time = document.createElement("time");//loome kuupäeva elemendi
  time.dateTime = post.createdAt; //määrame kuupäeva
  time.textContent = new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "UTC" 
  }).format(new Date(post.createdAt + "T00:00:00Z")); //vormindame kuupäeva
  header.append(avatar, author, time); //lisame pildi autori ja kuupäeva
  article.appendChild(header); //lisame päise

  if (post.image) { //kontrollime kas postitusel on pilt
    const photo = document.createElement("img"); //loome pildi elemendi
    photo.className = "post-photo"; //lisame css klassi
    photo.src = post.image;//pildi asukoht jsonist
    photo.alt = post.imageAlt || "Post photo"; //lisame kirjelduse
    article.appendChild(photo); //lisame pildi postituse sisse
  }

  const text = document.createElement("p"); //loome postituse teksti elemendi
  text.textContent = post.text; //lisame teksti jsonist
  article.appendChild(text); //lisame teksti postituse sisse

  const likeButton = document.createElement("button"); //loome like nupu
  likeButton.className = "like-button"; //lisame css klassi
  likeButton.type = "button"; //määrame nupu tüübiks button 
  likeButton.textContent = "♡ Like"; //nupu algne tekst
  likeButton.setAttribute("aria-label", "Like this post"); //
  likeButton.setAttribute("aria-pressed", "false"); //määrame algse oleku mitteaktiivseks
  likeButton.addEventListener("click", () => {
    const liked = likeButton.getAttribute("aria-pressed") === "true"; //kontrollime kas postitus on laigitud
    likeButton.setAttribute("aria-pressed", String(!liked)); //muudame nupu olekut
    likeButton.textContent = liked ? "♡ Like" : "♥ Liked"; //muudame nupu teksti vastavalt olekult
  });
  article.appendChild(likeButton); //lisame like nupu postituse sisse 
  return article;
}

// võtab kõik postitused JSON-failist ja kuvab need lehel.
async function loadPosts() {
  if (!postsContainer) return; //kui konteinerit ei ole, lõpetame funktsiooni

  try {
    // TASK 4: Online-allikas. Testimiseks eemalda järgmise rea eest //
    // ja kommenteeri ajutiselt allolev kohalik fetch välja.
    // See avalik URL töötab pärast GitHub Pagesi kasutuselevõttu.
    // const response = await fetch("https://gist.githubusercontent.com/JanTristan0/50ae98d9c355831b31fe215e13607ac2/raw/b094c489fcf4a9dc0acaf14af854f4baa38a8e9a/posts.json");

    // TASK 5: Kasutame nüüd projekti sees olevat kohalikku JSON-faili.
    const response = await fetch("./posts.json");

    if (!response.ok) {
      throw new Error("JSON-faili laadimine ebaõnnestus: " + response.status); //anname vea korral veateate
    }
    const posts = await response.json();
    if (!Array.isArray(posts)) {
      throw new Error("posts.json peab sisaldama postituste massiivi."); //vale formaadi korral 
    }

    const fragment = document.createDocumentFragment(); //loome ajutise konteineri postituse jaoks
    posts.forEach(post => fragment.appendChild(createPost(post))); //loome iga postituse  ja lisame selle fragmenti
    postsContainer.replaceChildren(fragment); //kuvame kõik postitused lehel
  } catch (error) { //püüame kinni tekkinud vead
    console.error(error); //kuvame vea konsoolis
    const message = document.createElement("p"); //loome veateate elemendi
    message.textContent = "Posts could not be loaded. Check posts.json and GitHub Pages."; 
    postsContainer.replaceChildren(message); //kuvame kõik postitused lehel
  }
}

const profileToggle = document.querySelector("#profile-toggle"); //leiame profiilinupu
const profileMenu = document.querySelector("#profile-menu"); //leiame profiilimenüü

function closeProfileMenu() {//funktsioon menüü sulgemiseks
  if (!profileMenu || !profileToggle) return; //kontrollime kas vajalikud elemendid on oleams
  profileMenu.hidden = true;//peidame menüü
  profileToggle.setAttribute("aria-expanded", "false"); //märgime et menüü on suletud
}

if (profileToggle && profileMenu) {
  profileToggle.addEventListener("click", (event) => { // vaatame profiilinupule vajutamist
    event.preventDefault(); // ei lähe login.html lehele, vaid avab menüü.
    const willOpen = profileMenu.hidden; // kontrollime kas menüü on peidetud
    profileMenu.hidden = !willOpen; // avame või sulgeme menüüd
    profileToggle.setAttribute("aria-expanded", String(willOpen)); //uuendame menüüd
  });

  document.addEventListener("click", (event) => { //jälgime kogu lehe klikke
    if (!profileToggle.contains(event.target) && !profileMenu.contains(event.target)) { //kontrollime kas klikite väljaspool menüüd
      closeProfileMenu();
    }
  });

  document.addEventListener("keydown", (event) => { //jälgime klaviatuuri vajutusi
    if (event.key === "Escape" && !profileMenu.hidden) {
      closeProfileMenu(); 
      profileToggle.focus(); //fookus tagasi profiilinupule
    }
  });
}

loadPosts();
