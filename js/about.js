window.addEventListener('scroll', function() {
    var navigation = document.querySelector('.navigation');
    var headerHeight = document.querySelector('header').offsetHeight;
    var scrollLine = document.querySelector('.scroll-line');
    var pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    var scrollPosition = window.pageYOffset;
    var scrollPercentage = (scrollPosition / pageHeight) * 100;

    if (window.scrollY > headerHeight) {
      navigation.classList.add('sticky');
    } else {
      navigation.classList.remove('sticky');
    }

    scrollLine.style.width = scrollPercentage + '%';
  });
  window.addEventListener('scroll', function() {
    var navigation = document.querySelector('.navigation');
    var headerHeight = document.querySelector('header').offsetHeight;

    if (window.scrollY > headerHeight) {
      navigation.classList.add('sticky');
    } else {
      navigation.classList.remove('sticky');
    }
  });

  // Récupérer les résultats du localStorage
  var searchResults = JSON.parse(localStorage.getItem('searchResults'));

  // Sélectionner le div contenant les résultats
  var contenaireDiv = document.querySelector('.contenaire');

  // Fonction pour afficher les détails du film dans le modal
  function afficherDetailsFilm(movie) {
    var title = movie.title;
    var imageSrc = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'img/R.jpg';
    var overview = movie.overview;
    var releaseDate = movie.release_date;
    var movieId = movie.id; // Identifiant du film

    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalImage").src = imageSrc;
    document.getElementById("modalOverview").textContent = overview;
  

    // Réinitialiser le contenu des acteurs du film dans le modal
    document.getElementById("modalActors").innerHTML = "";

    // Afficher le modal
    var modal = document.getElementById("myModal");
    modal.style.display = "block";

    // Ajouter une classe "modal-image" à l'image du modal pour styliser la taille
    var modalImage = document.getElementById("modalImage");
    modalImage.classList.add("modal-image");

    // Appel à la fonction pour récupérer les acteurs du film
    getActors(movieId);
  }

// Fonction pour récupérer les informations des acteurs du film
function getActors(movieId) {
// Clé d'API TMDB
var apiKey = 'a8474f1d2890e5292bbea59b0d600a91';

// URL de l'API pour récupérer les informations des acteurs
var apiUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=fr`;

// Effectuer la requête à l'API TMDB pour récupérer les informations des acteurs
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    var actors = data.cast;

    // Trier les acteurs par popularité (du plus célèbre au moins célèbre)
    actors.sort((a, b) => b.popularity - a.popularity);

    // Sélectionner les 5 premiers acteurs les plus célèbres
    var topActors = actors.slice(0, 3);

    var actorsList = "";

    // Parcourir les acteurs et créer une liste de noms d'acteurs
    for (var i = 0; i < topActors.length; i++) {
      var actor = topActors[i];
      var actorName = actor.name;

      actorsList += `<p>${actorName}</p>`;
    }

    // Vérifier s'il y a des noms d'acteurs disponibles
    if (actorsList === "") {
      actorsList = "<p>Nom d'acteurs n'existe pas</p>";
    }

    // Afficher la liste des acteurs dans le modal
    document.getElementById("modalActors").innerHTML = actorsList;
  })
  .catch(error => console.log(error));
}

  // Vérifier s'il y a des résultats de recherche
  if (searchResults && searchResults.length > 0) {
    // Créer une balise div pour le message des résultats
    var messageDiv = document.createElement('div');
    messageDiv.innerHTML = "<p class=\"resultats\">Voici les résultats de votre recherche :</p>";

    // Insérer le message avant le conteneur des résultats
    contenaireDiv.parentNode.insertBefore(messageDiv, contenaireDiv);
    function fetchActors(movieId) {
var apiKey = 'a8474f1d2890e5292bbea59b0d600a91';
var actorsEndpoint = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`;

return fetch(actorsEndpoint)
  .then(response => response.json())
  .then(data => {
    var actors = data.cast;
    var actorNames = actors.map(actor => actor.name);
    return actorNames;
  });
}
   // Afficher les résultats dans le div
for (var i = 0; i < searchResults.length; i++) {
(function(index) {
  var movie = searchResults[index];

  // Vérifier si toutes les données du film sont disponibles
  if (movie.title && movie.release_date && movie.vote_average) {
    // Vérifier si l'image du film est disponible
    var posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'img/R.jpg';
    var voteAverage = movie.vote_average.toFixed(1); // Arrondir à 1 décimale

    // Variable pour stocker les noms des acteurs
    var actorsList = "";

    // Vérifier s'il y a des acteurs disponibles
    if (movie.actorNames && movie.actorNames.length > 0) {
      actorsList = "<p>Acteurs :</p>";

      // Limiter le nombre d'acteurs à afficher à trois
      var actorsToShow = movie.actorNames.slice(0, 3);

      for (var j = 0; j < actorsToShow.length; j++) {
        actorsList += `<p>${actorsToShow[j]}</p>`;
      }
    } else {
      actorsList = "<p>Nom d'acteurs n'existe pas</p>";
    }

    var myTemplate = `
      <div class="box">
        <div class="image">
          <img src="${posterPath}">
        </div>
        <div class="review">
          <h3>${movie.title}</h3>
       
          <p>Date: ${movie.release_date}</p>
          <p>popularity: ${movie.popularity}</p>
          

          <p class="vote">${voteAverage}</p>
        </div>
      </div>
    `;

    contenaireDiv.innerHTML += myTemplate; // Ajoute le contenu à chaque itération
  }
})(i);
}
    


    
  } else {
    // Afficher le message d'absence de résultats
    contenaireDiv.innerHTML = "<p class=\"resultats\">Il n'y a pas de résultats pour votre recherche.</p>";
  }

  // Ajouter un gestionnaire d'événements "click" à chaque boîte
  var boites = document.querySelectorAll('.box');
  for (var i = 0; i < boites.length; i++) {
    boites[i].addEventListener('click', function() {
      var index = Array.prototype.indexOf.call(this.parentNode.children, this);
      var movie = searchResults[index];
      afficherDetailsFilm(movie);
    });
  }

  // Récupérer la référence du modal et du bouton de fermeture
  var modal = document.getElementById("myModal");
  var closeModal = document.getElementsByClassName("close")[0];

  // Gérer l'événement de clic sur le bouton de fermeture pour masquer le modal
  closeModal.addEventListener("click", function() {
    modal.style.display = "none";
  });
  // Gérer l'événement de clic sur la fenêtre
window.addEventListener("click", function(event) {
var modal = document.getElementById("myModal");

// Vérifier si l'élément cliqué est à l'extérieur du modal
if (event.target === modal) {
  modal.style.display = "none"; // Fermer le modal
}
});