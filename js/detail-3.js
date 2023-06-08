// Récupérer l'ID de la série à partir de l'URL
function getSeriesIdFromURL() {
  const currentUrl = new URL(window.location.href);
  const params = new URLSearchParams(currentUrl.search);
  return params.get('serieId');
}

// Récupérer les détails de la série en utilisant l'ID
function fetchSerieDetails(serieId) {
  var requestUrl = `https://api.themoviedb.org/3/tv/${serieId}?api_key=a8474f1d2890e5292bbea59b0d600a91&language=fr`;
  var creditsUrl = `https://api.themoviedb.org/3/tv/${serieId}/credits?api_key=a8474f1d2890e5292bbea59b0d600a91&language=fr`;
  
  var seriePromise = fetch(requestUrl).then(response => response.json());
  var creditsPromise = fetch(creditsUrl).then(response => response.json());

  return Promise.all([seriePromise, creditsPromise])
    .then(([serieData, creditsData]) => {
      serieData.credits = creditsData.cast;
      return serieData;
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des détails de la série :", error);
    });
}

// Afficher les détails de la série
function displaySerieDetails(serie) {
  var movieDetails = document.getElementById('movieDetails');
  var voteAverage = serie.vote_average.toFixed(1);
  var movieDetailsTemplate = `
    <div class="movie-poster">
      <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" alt="${serie.name}">
    </div>
    <div class="text">
      <h2 class="movie-title">${serie.name}</h2>
      <i class="fa-sharp fa-solid fa-heart fa-lg" style="color: #eb94ad;"></i>
      <i class="fa-sharp fa-solid fa-comment fa-lg" style="color: #eb94ad;"></i>
      <i class="fa-solid fa-bookmark fa-lg" style="color: #eb94ad;"></i>
      <i class="fa-sharp fa-solid fa-star fa-lg" style="color: #eb94ad;"></i>
      <p> ${serie.overview}</p>
      <p class="vote">${voteAverage}</p>
      <p><strong>Popularité</strong>: ${serie.popularity}</p>
      <p><strong>Vote count</strong>: ${serie.vote_count}</p>
  `;

  // Vérifier si les informations sur le réalisateur sont disponibles
  if (serie.created_by && serie.created_by.length > 0 && serie.created_by[0].name) {
    var directorName = serie.created_by[0].name;
    movieDetailsTemplate += `<p><strong>Réalisateur</strong>: ${directorName}</p>`;
  }

  movieDetailsTemplate += `<div class="actor-images"></div>`;

  // Ajouter le template des détails de la série TV au conteneur correspondant
  movieDetails.innerHTML = movieDetailsTemplate;

  // Récupérer le conteneur des images d'acteurs
  var actorImagesContainer = document.querySelector('.actor-images');

  // Récupérer les détails des acteurs
  var creditsURL = `https://api.themoviedb.org/3/tv/${serie.id}/credits?api_key=a8474f1d2890e5292bbea59b0d600a91&language=fr`;
  fetch(creditsURL)
    .then(response => response.json())
    .then(creditsData => {
      var cast = creditsData.cast;
      for (var i = 0; i < 4; i++) {
        var actor = cast[i];

        var actorContainer = document.createElement('div');
        actorContainer.classList.add('contoure');

        var actorImg = document.createElement('img');
        actorImg.src = 'https://image.tmdb.org/t/p/w500' + actor.profile_path;
        actorImg.alt = actor.name;

        var actorName = document.createElement('p');
        actorName.textContent = actor.name;

        actorContainer.appendChild(actorImg);
        actorContainer.appendChild(actorName);
        actorImagesContainer.appendChild(actorContainer);
      }
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des détails des acteurs :", error);
    });
}

// Point d'entrée principal pour récupérer les détails de la série
function retrieveSerieDetails() {
  var serieId = getSeriesIdFromURL();
  if (serieId) {
    fetchSerieDetails(serieId)
      .then(serie => {
        displaySerieDetails(serie);
      });
  } else {
    console.log("ID de la série non trouvé dans l'URL.");
  }
}

// Appeler la fonction principale pour récupérer les détails de la série
retrieveSerieDetails();


