window.addEventListener('scroll', function() {
    var navigation = document.querySelector('.navigation');
    var headerHeight = document.querySelector('header').offsetHeight;
  
    if (window.scrollY > headerHeight) {
      navigation.classList.add('sticky');
    } else {
      navigation.classList.remove('sticky');
    }
  });
  
  var moviesContainer = document.querySelector('.contenaire');
  var nextPageContainer = document.querySelector('.contenaire2');
  var moreButton = document.querySelector('.more-button');
  
  function addBoxClickListeners(boxes) {
    boxes.forEach(function(box) {
      box.addEventListener("click", function() {
        var modal = document.getElementById("myModal");
        var title = box.querySelector("h4").textContent;
        var imageSrc = box.querySelector("img").src;
        var overview = box.querySelector(".review p.overview").textContent;
        var releaseDate = box.querySelector(".review .release-date").textContent;
        var voteAverage = box.querySelector(".review .vote").textContent;
  
        document.getElementById("modalTitle").textContent = title;
        document.getElementById("modalImage").src = imageSrc;
        document.getElementById("modalOverview").textContent = overview;
       
  
        modal.style.display = "block";
      });
    });
  }
  
  fetch('https://api.themoviedb.org/3/movie/popular?api_key=a8474f1d2890e5292bbea59b0d600a91&language=fr&page=2&page=2')
    .then(response => response.json())
    .then(data => {
      var movies = data.results;
  
      var myTemplate = '';
  
      for (var i = 0; i < 10; i++) {
        var movie = movies[i];
        var title = movie.title;
        var posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'img/R.jpg';
        var overview = movie.overview;
        var releaseDate = movie.release_date;
        var voteAverage = movie.vote_average.toFixed(1);
  
        myTemplate += `
          <div class="box">
            <div class="image">
              <img src="${posterPath}">
            </div>
            <div class="review">
              <h4>${title}</h4>
              <p class="vote"> ${voteAverage}</p>
              <p class="overview">${overview}</p>
              <p class="release-date">Date de sortie: ${releaseDate}</p>
            </div>
          </div>
        `;
      }
  
      moviesContainer.innerHTML = myTemplate;
  
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
  
      // Gérer l'événement de clic sur le bouton "plus" pour charger la deuxième page de résultats
      moreButton.addEventListener("click", function() {
        nextPageContainer.innerHTML = ''; // Effacer le contenu précédent du conteneur de la deuxième page
  
        fetch('https://api.themoviedb.org/3/movie/popular?api_key=a8474f1d2890e5292bbea59b0d600a91&language=fr&page=3')
          .then(response => response.json())
          .then(data => {
            var nextPageMovies = data.results;
  
            var nextPageTemplate = '';
  
            for (var i = 0; i < 10; i++) {
              var movie = nextPageMovies[i];
              var title = movie.title;
              var posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'img/R.jpg';
              var overview = movie.overview;
              var releaseDate = movie.release_date;
              var voteAverage = movie.vote_average.toFixed(1);
  
              nextPageTemplate += `
                <div class="box">
                  <div class="image">
                    <img src="${posterPath}">
                  </div>
                  <div class="review">
                    <h4>${title}</h4>
                    <p class="vote"> ${voteAverage}</p>
                    <p class="overview">${overview}</p> 
                    <p class="release-date">Date: ${releaseDate}</p>
                  </div>
                </div>
              `;
            }
  
            nextPageContainer.innerHTML = nextPageTemplate;
            moreButton.style.display = "none"; // Masquer le bouton "plus" après avoir affiché la deuxième page
  
            // Ajouter les écouteurs d'événements de clic aux nouvelles boîtes dans le contenaire2
            var nextPageBoxes = document.querySelectorAll(".contenaire2 .box");
            addBoxClickListeners(nextPageBoxes);
          })
          .catch(error => {
            console.error("Erreur lors de la récupération de la deuxième page de films populaires :", error);
          });
      });
  
      // Ajouter les écouteurs d'événements de clic aux boîtes existantes dans le contenaire initial
      var initialBoxes = document.querySelectorAll(".contenaire .box");
      addBoxClickListeners(initialBoxes);
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des films populaires :", error);
    });