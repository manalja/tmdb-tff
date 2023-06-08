window.addEventListener('scroll', function() {
    var navigation = document.querySelector('.navigation');
    var headerHeight = document.querySelector('header').offsetHeight;

    if (window.scrollY > headerHeight) {
      navigation.classList.add('sticky');
    } else {
      navigation.classList.remove('sticky');
    }
  });

  var currentPage = 1;
  var totalResults = 0;
  var resultsPerPage = 10;
  var totalPages = 0;
  var topRatedData = [];

  var contenairDiv = document.querySelector('.contenaire');
  var contenairDiv2 = document.querySelector('.contenaire2');

  // Fonction pour afficher les séries top-rated dans un conteneur spécifié
  function displayTopRatedSeries(data, contenaire) {
    var series = data.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);
    var template = '';

    series.forEach(serie => {
      var title = serie.name;
      var overview = serie.overview;
      var date = serie.first_air_date;
      var imageSrc = serie.poster_path ? `https://image.tmdb.org/t/p/w500${serie.poster_path}` : 'img/R.jpg';

      template += `
        <div class="box">
          <div class="image">
            <img src="${imageSrc}" alt="${title}">
          </div>
          <div class="review">
            <h4>${title}</h4>
            <p>Date: ${date}</p>
            <p>Popularity: ${serie.popularity}</p>
            <p class="vote">${serie.vote_average}</p>
            <p class="overview">${overview}</p>
          </div>
        </div>
      `;
    });

    contenaire.innerHTML += template;

    // Ajouter un gestionnaire d'événements "click" à chaque boîte
    var boxes = contenaire.querySelectorAll('.box');
    boxes.forEach(box => {
      box.addEventListener('click', function() {
        var title = this.querySelector('h4').textContent;
        var overview = this.querySelector('.overview').textContent;
        var imageSrc = this.querySelector('img').src;
       

        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalOverview').textContent = overview;
        document.getElementById('modalImage').src = imageSrc;
       

        var modal = document.getElementById('myModal');
        modal.style.display = 'block';

        // Ajoutez le code pour afficher les images et les noms des acteurs ici
        // Utilisez les données de la série sélectionnée
      });
    });
  }

  // Fonction pour charger les données de la page suivante
  function loadNextPage() {
    currentPage++;

    if (currentPage <= totalPages) {
      displayTopRatedSeries(topRatedData, contenairDiv2);
    }

    if (currentPage === totalPages) {
      var moreButton = document.querySelector('.more-button');
      moreButton.style.display = 'none';
    }
  }

  // Les séries top_rated sur la colonne à gauche
  fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=a8474f1d2890e5292bbea59b0d600a91&language=fr&page=3`)
    .then(response => response.json())
    .then(data => {
      topRatedData = data.results;
      totalResults = topRatedData.length;
      totalPages = Math.ceil(totalResults / resultsPerPage);

      displayTopRatedSeries(topRatedData, contenairDiv);

      // Gérer l'événement de clic sur le bouton "Plus"
      var moreButton = document.querySelector('.more-button');
      moreButton.addEventListener('click', loadNextPage);
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des séries TV top rated :", error);
    });

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

  // Gérer l'événement de clic sur le bouton de fermeture pour masquer le modal
  var closeModal = document.querySelector('.close');
  closeModal.addEventListener('click', function() {
    var modal = document.getElementById('myModal');
    modal.style.display = 'none';
  });
  // Gérer l'événement de clic sur la fenêtre
window.addEventListener("click", function(event) {
var modal = document.getElementById("myModal");

// Vérifier si l'élément cliqué est à l'extérieur du modal
if (event.target === modal) {
  modal.style.display = "none"; // Fermer le modal
}
});