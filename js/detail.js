// Récupérer le paramètre d'URL "movieId"
var urlParams = new URLSearchParams(window.location.search);
var movieId = urlParams.get('movieId');

// Effectuer une requête à l'API pour obtenir les détails du film
fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=a8474f1d2890e5292bbea59b0d600a91&language=fr`)
  .then(response => response.json())
  .then(movieData => {
    console.log(movieData);

    // Récupérer les informations sur le réalisateur et les acteurs
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=a8474f1d2890e5292bbea59b0d600a91`)
      .then(response => response.json())
      .then(creditsData => {
        console.log(creditsData);

        // Afficher les détails du film sur la page
        var movieDetailsElement = document.getElementById('movieDetails');
        var voteAverage = movieData.vote_average.toFixed(1);
        var movieDetailsTemplate = `
          <div class="movie-poster">
            <img src="https://image.tmdb.org/t/p/w500${movieData.poster_path}">
          </div>
          <div class="text">
            <h2 class="movie-title">${movieData.title}</h2>
            <i class="fa-sharp fa-solid fa-heart fa-lg" style="color: #eb94ad;"></i>
            <i class="fa-sharp fa-solid fa-comment  fa-lg" style="color: #eb94ad;"></i>
            <i class="fa-solid fa-bookmark  fa-lg " style="color: #eb94ad;"></i>
            <i class="fa-sharp fa-solid fa-star fa-lg " style="color: #eb94ad;"></i>
            <p class="movie-overview">${movieData.overview}</p>
            <span><strong>Date</strong>: ${movieData.release_date}</span>
            <p><strong>Vote acount</strong>: ${movieData.vote_count}</p>
            <p><strong>Popularity</strong>: ${movieData.popularity}</p>
            <p class="vote">${voteAverage}</p>
            <p><strong>Durée</strong>: ${movieData.runtime} min</p>
            <p class="director"><strong>Réalisateur</strong>: ${getDirector(creditsData)}</p>
           
            <div class="actor-images">${getActorImages(creditsData)}</div>
        
          </div>
        `;
        
        // Ajouter le contenu du modèle au div "movieDetails"
        movieDetailsElement.innerHTML = movieDetailsTemplate;
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des crédits :", error);
      });
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des détails du film :", error);
  });

// Fonction pour récupérer le réalisateur à partir des crédits
function getDirector(creditsData) {
  var director = creditsData.crew.find(member => member.job === "Director");
  return director ? director.name : "N/A";
}

// Fonction pour récupérer les acteurs à partir des crédits
function getActors(creditsData) {
  var actors = creditsData.cast.slice(0, 4).map(actor => actor.name);
  return actors.length > 0 ? actors.join(", ") : "N/A";
}

// Fonction pour récupérer les images des acteurs à partir des crédits
function getActorImages(creditsData) {
  var actorImages = creditsData.cast.slice(0, 4).map(actor => {
    var imageUrl = actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'img/actor_placeholder.jpg';
    return `
      <div class="contoure">
        <img src="${imageUrl}" alt="${actor.name}">
        <p>${actor.name}</p>
      </div>
    `;
  });
  return actorImages.join("");

}