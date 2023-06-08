window.addEventListener('scroll', function() {
    var navigation = document.querySelector('.navigation');
    var headerHeight = document.querySelector('header').offsetHeight;

    if (window.scrollY > headerHeight) {
      navigation.classList.add('sticky');
    } else {
      navigation.classList.remove('sticky');
    }
  });

  var apiUrl = 'https://api.themoviedb.org/3/tv/popular?api_key=a8474f1d2890e5292bbea59b0d600a91&language=en-US&page=6';

  // Fonction pour afficher les détails de la série de télévision dans le modal
  function displayTvShowDetails(title, imageSrc, overview, releaseDate) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalImage').src = imageSrc;
    document.getElementById('modalOverview').textContent = overview;
   

    var modal = document.getElementById('myModal');
    modal.style.display = 'block';
  }

  // Faire une requête API pour récupérer les séries de télévision
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Récupérer les résultats des séries de télévision
      var tvSeries = data.results;

      // Sélectionner l'élément div avec la classe "contenaire"
      var contenaireElement = document.querySelector('.contenaire');

   // Parcourir les séries de télévision et afficher les détails
for (var i = 0; i < 8; i++) {
  var tvShow = tvSeries[i];
  // Vérifier si toutes les données de la série de télévision sont disponibles
  if (tvShow.name && tvShow.first_air_date && tvShow.vote_average && tvShow.overview) {
    // Vérifier si l'image de la série de télévision est disponible
    var posterPath = tvShow.poster_path ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}` : 'img/R.jpg';
    var voteAverage = tvShow.vote_average.toFixed(1); // Arrondir à 1 décimale

    // Créer un modèle HTML pour afficher les détails de la série de télévision
    var tvShowTemplate = `
      <div class="box">
        <div class="image">
          <img src="${posterPath}">
        </div>
        <div class="review">
          <h4>${tvShow.name}</h4>
          <p>Date: ${tvShow.first_air_date}</p>
          <p>Popularity: ${tvShow.popularity}</p>
          <p class="vote">${voteAverage}</p>
        </div>
      </div>
    `;

    // Ajouter le contenu du modèle à l'élément div "contenaire"
    contenaireElement.innerHTML += tvShowTemplate;
  }
}

      // Gérer l'événement de clic sur la boîte pour afficher le modal
      var boxes = document.querySelectorAll('.box');
      boxes.forEach(box => {
        box.addEventListener('click', function() {
          var title = this.querySelector('h4').textContent;
          var imageSrc = this.querySelector('img').src;
          var overview = tvSeries.find(tvShow => tvShow.name === title).overview;
        

          displayTvShowDetails(title, imageSrc, overview);
        });
      });

      // Gérer l'événement de clic sur le bouton de fermeture pour masquer le modal
      var closeModal = document.querySelector('.close');
      closeModal.addEventListener('click', function() {
        var modal = document.getElementById('myModal');
        modal.style.display = 'none';
      });

      // Gérer l'événement de clic sur le bouton "plus" pour charger la page suivante dans contenaire2
      var moreButton = document.querySelector('.more-button');
      moreButton.addEventListener('click', function() {
        var currentPage = Math.ceil(tvSeries.length / 10) + 1; // Calculer la page suivante
        var nextPageUrl = `https://api.themoviedb.org/3/tv/popular?api_key=a8474f1d2890e5292bbea59b0d600a91&language=en-US&page=${currentPage}`;

        fetch(nextPageUrl)
          .then(response => response.json())
          .then(data => {
            var nextPageSeries = data.results;

            // Sélectionner l'élément div avec la classe "contenaire2"
            var contenaire2Element = document.querySelector('.contenaire2');

            // Parcourir les séries de télévision de la page suivante et afficher les détails
            nextPageSeries.forEach(tvShow => {
              // Vérifier si toutes les données de la série de télévision sont disponibles
              if (tvShow.name &&  tvShow.vote_average && tvShow.overview) {
                // Vérifier si l'image de la série de télévision est disponible
                var posterPath = tvShow.poster_path ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}` : 'img/R.jpg';
                var voteAverage = tvShow.vote_average.toFixed(1); // Arrondir à 1 décimale
                moreButton.style.display = 'none';
                // Créer un modèle HTML pour afficher les détails de la série de télévision
                var tvShowTemplate = `
                  <div class="box">
                    <div class="image">
                      <img src="${posterPath}">
                    </div>
                    <div class="review">
                      <h4>${tvShow.name}</h4>
                      <p>Date: ${tvShow.first_air_date}</p>
                      <p class="vote">${voteAverage}</p>
                    </div>
                  </div>
                `;

                // Ajouter le contenu du modèle à l'élément div "contenaire2"
                contenaire2Element.innerHTML += tvShowTemplate;
                
              }
            });

            // Gérer l'événement de clic sur la boîte pour afficher le modal
            var boxes2 = document.querySelectorAll('.contenaire2 .box');
            boxes2.forEach(box => {
              box.addEventListener('click', function() {
                var title = this.querySelector('h4').textContent;
                var imageSrc = this.querySelector('img').src;
                var overview = nextPageSeries.find(tvShow => tvShow.name === title).overview;
              

                displayTvShowDetails(title, imageSrc, overview);
              });
            });
          })
          .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération de la page suivante:', error);
          });
      });
    })
    .catch(error => {
      console.error('Une erreur s\'est produite lors de la récupération des séries de télévision:', error);
    });
    // Gérer l'événement de clic sur la fenêtre
window.addEventListener("click", function(event) {
  var modal = document.getElementById("myModal");

  // Vérifier si l'élément cliqué est à l'extérieur du modal
  if (event.target === modal) {
    modal.style.display = "none"; // Fermer le modal
  }
});