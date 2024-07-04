const API_KEY = "4f57b0e76402471ba0eb0fa6db4faefb";
const url = "https://newsapi.org/v2/everything?q=";
const pageSize = 12; // Number of articles per page
let currentPage = 1; // Current page of news articles

window.addEventListener("load", () => fetchNews("home"));

// Fetch news based on query and page number
async function fetchNews(query, page = 1) {
  try {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}&pageSize=${pageSize}&page=${page}`);
    const data = await res.json();
    bindData(data.articles);
    updatePaginationButtons(data.totalResults);
  } catch (error) {
    console.error("Error fetching news:", error);
  }
}

// Bind news articles to cards
function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("news-template");

  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.urlToImage) return;
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

// Fill data into news card
function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description;

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  newsSource.innerHTML = `${article.source.name} · ${date}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

// Update pagination buttons based on total results
function updatePaginationButtons(totalResults) {
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");

  // Enable/disable previous button
  if (currentPage > 1) {
    prevButton.classList.remove("disabled");
  } else {
    prevButton.classList.add("disabled");
  }

  // Enable/disable next button
  if (currentPage < Math.ceil(totalResults / pageSize)) {
    nextButton.classList.remove("disabled");
  } else {
    nextButton.classList.add("disabled");
  }
}

// Set Home as the default selected nav item and fetch news
let curSelectedNav = document.getElementById("home");

window.addEventListener("load", () => {
  fetchNews("home");
  curSelectedNav.classList.add("active");
});

// Handle navigation item click
function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  if (curSelectedNav) {
    curSelectedNav.classList.remove("active");
  }
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

// Handle search button click
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value;
  if (!query) return;
  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});

// Previous page button handler
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchNews(curSelectedNav.id, currentPage);
  }
}

// Next page button handler
function nextPage() {
  currentPage++;
  fetchNews(curSelectedNav.id, currentPage);
}


// Function to toggle dark mode
let isDarkMode = false;

function toggleDarkMode() {
  const body = document.body;
  const currentTheme = body.getAttribute('data-bs-theme');
  const footer = document.getElementById('footer');

  if (currentTheme === 'light') {
    body.setAttribute('data-bs-theme', 'dark');
    footer.classList.add("bg-dark", "text-white");
    document.getElementById("dark-mode-button").setAttribute("data-bs-toggle", "button");
    document.getElementById('dark-mode-icon').classList.remove('fa-moon');
    document.getElementById('dark-mode-icon').classList.add('fa-sun');
  } else {
    body.setAttribute('data-bs-theme', 'light');
    footer.classList.remove("bg-dark", "text-white");
    document.getElementById("dark-mode-button").removeAttribute("data-bs-toggle");
    document.getElementById('dark-mode-icon').classList.remove('fa-sun');
    document.getElementById('dark-mode-icon').classList.add('fa-moon');
  }
}
