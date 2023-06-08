var wrapper = document.querySelector('.wrapper');
var topRatedDiv = document.querySelector('.top-rated');
var tvDiv = document.querySelector('.tv');
var plusButton = document.querySelector('.plus');
var modal = document.querySelector('.modal');
var modalTitle = document.getElementById('modal-title');
var modalImage = document.getElementById('modal-image');
var modalOverview = document.getElementById('modal-overview');
var modalVote = document.getElementById('vote-count');
var modalRelease = document.getElementById('modal-release');
var envoyer = document.querySelector("button");
var nomFilm = document.querySelector("input");
var contenairDiv = document.querySelector('.contenair');


// la partie de recherche qui amène à la page about

function redirectToAboutPage() {
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=a8474f1d2890e5292bbea59b0d600a91&query=${nomFilm.value}&language=fr`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      nomFilm.value = '';

      // Stocker les résultats dans le localStorage
      localStorage.setItem('searchResults', JSON.stringify(data.results));

      // Rediriger vers la page about.html
      window.location.href = 'about.html';
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des données :", error);
    });
}

envoyer.addEventListener('click', redirectToAboutPage);

nomFilm.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    redirectToAboutPage();
  }
});

function fetchPopularMovies(page) {
  // Récupérez les données des films populaires
  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=a8474f1d2890e5292bbea59b0d600a91&language=fr&adult=false&page=${page}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      var swiperWrapper = document.createElement('div');
      swiperWrapper.classList.add('swiper-wrapper');

      // Parcourez les résultats et créez les slides du Swiper
      for (var i = 0; i < 20; i++) {
        var movie = data.results[i];
        var movieId = movie.id;

        var movieLink = `<a href="detail.html?movieId=${movieId}">`;
        var slide = document.createElement('div');
        slide.classList.add('swiper-slide');
        slide.innerHTML = `
          ${movieLink}
            <p>${movie.vote_average}</p>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
            <h3>${movie.title}</h3>
          </a>
        `;

        swiperWrapper.appendChild(slide);
      }

      // Remplacez les résultats affichés par les nouveaux résultats
      var wrapper = document.querySelector('.wrapper');
      wrapper.innerHTML = '';
      wrapper.appendChild(swiperWrapper);

      // Réinitialisez Swiper avec les nouveaux résultats
      new Swiper('.wrapper', {
        slidesPerView: 3,
        spaceBetween: 20,
        slidesPerGroup: 1,
       
      
        // Ajoutez d'autres options selon vos besoins
      });
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des films populaires :", error);
    });
}

// Appeler fetchPopularMovies lors du chargement initial de la page
fetchPopularMovies(1);

const filmPopBtns = document.querySelectorAll('.film-pop-btn');

filmPopBtns[0].addEventListener('click', () => {
  // Afficher les résultats initiaux par défaut lorsque le premier bouton est cliqué
  fetchPopularMovies(1);
});

filmPopBtns[1].addEventListener('click', () => {
  // Afficher les résultats de la page 2 lorsque le deuxième bouton est cliqué
  fetchPopularMovies(2);
});




 // Récupérer la référence du conteneur du swiper
var swiperContainer = document.querySelector('.swiper-container');

// Récupérer la référence du conteneur des vidéos de bandes-annonces
var bandesDiv = document.querySelector('.bandes');

// Récupérer les vidéos de bandes-annonces
fetch(`https://api.themoviedb.org/3/movie/popular?api_key=a8474f1d2890e5292bbea59b0d600a91&language=fr&page=1`)
  .then(response => response.json())
  .then(data => {
    var movies = data.results.slice(4, 15); // Limiter aux 10 premiers films populaires

    // Parcourir les films populaires et récupérer les vidéos de bandes-annonces
    var videosPromises = movies.map(movie => {
      var movieId = movie.id;
      return fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=a8474f1d2890e5292bbea59b0d600a91&language=fr`)
        .then(response => response.json())
        .then(videoData => {
          if (videoData.results && videoData.results.length > 0) {
            return videoData.results[0]; // Récupérer uniquement la première vidéo de chaque film
          }
        });
    });

    // Attendre que toutes les requêtes de vidéos soient terminées
    Promise.all(videosPromises)
      .then(videos => {
        // Parcourir les vidéos et les ajouter au conteneur
        videos.forEach(video => {
          if (video) {
            var trailerKey = video.key;
            var trailerURL = `https://www.youtube.com/watch?v=${trailerKey}`;

            var bandeTemplate = `
              <div class="swiper-slide">
                <h4>${video.name} </h4>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${trailerKey}" frameborder="0" allowfullscreen></iframe>
              </div>
            `;

            bandesDiv.innerHTML += bandeTemplate;
          }
        });

        // Initialiser le swiper
        new Swiper(swiperContainer, {
          slidesPerView: 1,
          spaceBetween: 20,
          slidesPerGroup: 1,
        
        
        
        });
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des données des vidéos :", error);
      });
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des films populaires :", error);
  });


///:::::::::::::::::::::::::::::::::::::::::::::::::::::::
// les top_rated//////////////////////////////:
fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=a8474f1d2890e5292bbea59b0d600a91&language=fr`)
  .then(response => response.json())
  .then(topRatedData => {
    var series = topRatedData.results.slice(0, 20); // Limiter aux 7 premières séries

    var swiperWrapper = document.querySelector('.top-rated .swiper-wrapper');

    for (var i = 0; i < series.length; i++) {
      var serie = series[i];
      var swiperSlide = document.createElement('div');
      swiperSlide.setAttribute('data-id', serie.id);
      swiperSlide.classList.add('swiper-slide');
      swiperSlide.innerHTML = `
        <div class="tv-series">
          <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" alt="${serie.name}">
          <h3>${serie.name}</h3>
          <p>${serie.vote_average}</p>
        </div>
      `;
    
      swiperSlide.addEventListener('click', function() {
        var serieId = this.getAttribute('data-id');
      
        // Rediriger vers la page detail-2.html avec l'identifiant de la série TV
        window.location.href = 'detail-2.html?serieId=' + serieId;
     
    
        // Rediriger vers la page detail-2.html avec les informations de la série TV
        var params = encodeURIComponent(JSON.stringify(selectedSerie));
        window.location.href = 'detail-2.html?serie=' + params;
      });
      swiperWrapper.appendChild(swiperSlide);
    }

    // Initialisation du carrousel Swiper
    new Swiper('.top-rated', {
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      
    
        // when window width is >= 480px
       
      }
    
    });
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des séries TV top rated :", error);
  });
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Récupérer les séries TV populaires
fetch(`https://api.themoviedb.org/3/tv/popular?api_key=a8474f1d2890e5292bbea59b0d600a91&language=fr&page=1`)
  .then(response => response.json())
  .then(data => {
    var series = data.results;

    var swiperWrapper = document.querySelector('.swiper-container.tv .swiper-wrapper');
for (var i = 0; i < 20; i++) {
  var serie = series[i];
  var slide = document.createElement('div');
  slide.classList.add('swiper-slide');
  slide.innerHTML = `
  <div class="tv-series" data-id="${serie.id}">
    <a href="detail-3.html?serieId=${encodeURIComponent(serie.id)}">
      <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" alt="${serie.name}">
      <h3>${serie.name}</h3>
      <p>${serie.vote_average}</p>
    </a>
  </div>
`;

  slide.addEventListener('click', function() {
    var serieId = this.getAttribute('data-id');
    console.log(serieId); // Ajoutez cette ligne pour afficher la valeur de serieId
    window.location.href = 'detail-3.html?serieId=' + serieId;
  });

  swiperWrapper.appendChild(slide);
}

    new Swiper('.swiper-container.tv', {
      slidesPerView: 1,
      spaceBetween: 10,
     
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des détails de la série :", error);
  })
  const currentUrl = new URL(window.location.href);
  const params = new URLSearchParams(currentUrl.search);
  const serieId = params.get('serieId');
  
  if (serieId) {
    fetchSerieDetails(serieId)
      .then(serie => {
        displaySerieDetails(serie);
      });
  } else {
    console.log("ID de la série non trouvé dans l'URL.");
  }



  window.addEventListener('scroll', function() {
    var navigation = document.querySelector('.navigation');
    var headerHeight = document.querySelector('header').offsetHeight;
  
    if (window.scrollY > headerHeight) {
      navigation.classList.add('sticky');
    } else {
      navigation.classList.remove('sticky');
    }
  });

  const buttons = document.querySelectorAll('.film-pop-btn');

function changeActive(index) {
  buttons.forEach((button, i) => {
    if (i === index) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    changeActive(index);
  });
});

// Ajouter la classe active au deuxième bouton par défaut
changeActive(0);
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

