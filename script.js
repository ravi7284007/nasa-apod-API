const resultsNav = document.getElementById('resultsNav')
const favoritesNav = document.getElementById('favoritesNav')
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader')

// NASA 
const count = 10;
const apiKey = 'DEMO_KEY';
const API = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent(page) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden')
    } else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden')
    }
    loader.classList.add('hidden')
}

function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);

    currentArray.forEach(result => {
        // card container
        const card = document.createElement('div');
        card.classList.add('card');
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // images
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'Nasa Picture of the day!'
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results') {
            saveText.textContent = 'Add To Favorites';
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
        } else {
            saveText.textContent = 'Remove Favorites';
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }
        // Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        // footer container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;

        // Append
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card)
    })
}

function updateDOM(page) {
    // Get Favorites from localstorage
    if (localStorage.getItem('nasaFav')) {
        favorites = JSON.parse(localStorage.getItem('nasaFav'))
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page)
}

// Get 10 images from NASA API

async function getNasaPictures() {
    // Show loader
    loader.classList.remove('hidden')
    try {
        const response = await fetch(API);
        resultsArray = await response.json();
        updateDOM('results');

    } catch (error) {
        console.log(error);
    }
}

function saveFavorite(itemUrl) {
    // Loop through result
    resultsArray.forEach(item => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;

            // show save confimation
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true
            }, 2000)

            // set fav in local storage
            localStorage.setItem('nasaFav', JSON.stringify(favorites))
        }
    })
}

function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        // set fav in local storage
        localStorage.setItem('nasaFav', JSON.stringify(favorites));
        updateDOM('favorites')
    }
}

// onLoad
getNasaPictures()