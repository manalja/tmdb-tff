// Récupérer l'identifiant de la série TV à partir des paramètres d'URL
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var serieId = urlParams.get('serieId');

// Effectuer une requête pour obtenir les détails de la série TV correspondante
fetch(`https://api.themoviedb.org/3/tv/${serieId}?api_key=a8474f1d2890e5292bbea59b0d600a91&language=fr`)
  .then(response => response.json())
  .then(serieData => {
    var voteAverage = serieData.vote_average.toFixed(1);
    // Créer le template pour les détails de la série TV
    var movieDetailsTemplate = `
      <div class="movie-poster">
        <img src="https://image.tmdb.org/t/p/w500${serieData.poster_path}">
      </div>
      <div class="text">
        <h2 class="movie-title">${serieData.name}</h2>
        <i class="fa-sharp fa-solid fa-heart fa-lg" style="color: #eb94ad;"></i>
        <i class="fa-sharp fa-solid fa-comment  fa-lg" style="color: #eb94ad;"></i>
        <i class="fa-solid fa-bookmark  fa-lg " style="color: #eb94ad;"></i>
        <i class="fa-sharp fa-solid fa-star fa-lg " style="color: #eb94ad;"></i>
        <p class="movie-overview">${serieData.overview}</p>
        <p class="vote">${voteAverage}</p>
        <p><strong>Popularity</strong>: ${serieData.popularity}</p>
        <p><strong>Vote acount</strong>: ${serieData.vote_count}</p>
  `;

    // Vérifier si les informations sur le réalisateur sont disponibles
    if (serieData.created_by && serieData.created_by.length > 0 && serieData.created_by[0].name) {
      var directorName = serieData.created_by[0].name;
      movieDetailsTemplate += `<p><strong>Réalisateur</strong>: ${directorName}</p>`;
    }

    movieDetailsTemplate += `<div class="actor-images"></div>`;

    // Ajouter le template des détails de la série TV au conteneur correspondant
    var movieDetails = document.getElementById('movieDetails');
    movieDetails.innerHTML = movieDetailsTemplate;

    // Récupérer le conteneur des images d'acteurs
    var actorImagesContainer = document.querySelector('.actor-images');

    // Récupérer les détails des acteurs
    var creditsURL = `https://api.themoviedb.org/3/tv/${serieId}/credits?api_key=a8474f1d2890e5292bbea59b0d600a91&language=fr`;
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
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des détails de la série TV :", error);
  });