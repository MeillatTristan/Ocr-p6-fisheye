/**
 * Class represent all functions link to one photographer
 */
export default class OnePhotographer {
  /**
   * constructor of class
   */
  constructor() {
    this.photographer = Object;
    this.medias = [];
    this.likes = 0;
    this.indexLightbox = 0;
    this.getPhotographer();
    this.initEvent();
  }


  /**
   * contain all EventListener
   */
  initEvent() {
    document.getElementById('filtre').addEventListener('change', (e) => {
      this.filterMedia(e.target.value);
    });

    document.getElementById('closeLightbox').addEventListener('click', () => {
      this.closeLightbox();
    });

    document.getElementById('prevLightbox').addEventListener('click', () => {
      this.navLightbox('prev');
    });

    document.getElementById('nextLightbox').addEventListener('click', () => {
      this.navLightbox('next');
    });

    document.addEventListener('keydown', (event) => {
      if (event.code == 'ArrowLeft') {
        this.navLightbox('prev');
      } else if (event.code == 'ArrowRight') {
        this.navLightbox('next');
      } else if (event.code == 'Escape') {
        this.closeLightbox();
      }
    });
  }


  /**
   * Filter medias with the parameter
   * @param {String} param
   */
  filterMedia(param) {
    if (param === 'title') {
      this.medias = this.medias.sort(this.orderMedias(param));
    } else {
      this.medias = this.medias.sort(this.orderMedias(param)).reverse();
    }
    document.querySelector('.containerMedias').innerHTML = '';
    this.medias.forEach((media, index) => {
      this.displayMedia(media, index);
    });
  }

  /**
   * @param {String} parameters
   * @return {Int}
   */
  orderMedias(parameters) {
    return function(x, y) {
      if (x[parameters] < y[parameters]) {
        return -1;
      }
      if (x[parameters] > y[parameters]) {
        return 1;
      }
      return 0;
    };
  }

  /**
   * Function fetch one photographer with his id
   */
  async getPhotographer() {
    const response = await fetch('./data/photographers.json');
    const res = await response.json();
    const id = this.getIdUrl();
    res.photographers.forEach((photographer) => {
      if (photographer.id == id) {
        this.photographer = photographer;
        res.media.forEach((media) => {
          if (media.photographerId == this.photographer.id) {
            this.medias.push(media);
            this.likes += media.likes;
          }
        });
        this.medias = this.medias.sort(this.orderMedias('title'));
        this.displayData();
      }
    });
  }

  /**
   * Return id contain in url
   * @return {String}
   */
  getIdUrl() {
    const str = window.location.href;
    const url = new URL(str);
    if (url.searchParams.get('id')) {
      const id = url.searchParams.get('id');
      return id;
    }
  }

  /**
   * Append data of photographer to html
   */
  displayData() {
    this.displayHeader();
    this.medias.forEach((media, index) => {
      this.displayMedia(media, index);
    });
    this.displayLikes();
  }

  /**
   * append data to header
   */
  displayHeader() {
    const headerSectionInfo = document.querySelector(
        '.photograph-header .containerInfo',
    );

    const title = document.createElement('h1');
    title.textContent = this.photographer.name;

    const location = document.createElement('h3');
    location.textContent = `${this.photographer.city}, 
                            ${this.photographer.country}`;

    const taglineElement = document.createElement('span');
    taglineElement.textContent = this.photographer.tagline;


    headerSectionInfo.appendChild(title);
    headerSectionInfo.appendChild(location);
    headerSectionInfo.appendChild(taglineElement);

    const headerSectionImg = document.querySelector(
        '.photograph-header .containerImg',
    );

    const picture = `assets/photographers/${this.photographer.portrait}`;
    const img = document.createElement('img');
    img.setAttribute('src', picture);
    img.setAttribute('alt', this.photographer.name);

    headerSectionImg.appendChild(img);
  }

  /**
   * create card for a media and append his to mediaSection HTML
   * @param {Object} media
   * @param {Int} index
   */
  displayMedia(media, index) {
    const mediaSection = document.querySelector(
        '.containerMedias',
    );
    const card = document.createElement('div');
    card.classList.add('cardMedia');

    const containerImg = document.createElement('div');
    containerImg.classList.add('containerImg');
    if (media.image) {
      const urlMedia = `assets/medias/${media.image}`;
      const mediaElement = document.createElement('img');
      mediaElement.dataset.index = index;
      mediaElement.setAttribute('tabindex', 0);
      mediaElement.addEventListener('click', (e) => {
        this.displayLightbox(e);
      });
      mediaElement.addEventListener('focus', () => {
        mediaElement.addEventListener('keydown', (e) => {
          if (e.code == 'Enter') {
            this.displayLightbox(e);
          }
        });
      });
      mediaElement.setAttribute('src', urlMedia);
      mediaElement.setAttribute('alt', media.title);
      containerImg.appendChild(mediaElement);
    } else {
      const urlMedia = `assets/medias/${media.video}`;
      const mediaElement = document.createElement('video');
      mediaElement.dataset.index = index;
      mediaElement.addEventListener('click', (e) => {
        this.displayLightbox(e);
      });
      mediaElement.setAttribute('src', urlMedia);
      mediaElement.setAttribute('alt', media.title);
      containerImg.appendChild(mediaElement);
    }

    const containerText = document.createElement('div');
    containerText.classList.add('containerText');

    const titleCard = document.createElement('h3');
    titleCard.textContent= media.title;

    const like = document.createElement('span');
    like.setAttribute('tabindex', 0);
    like.classList.add('like');
    like.innerHTML = `${media.likes} <i class="fa-regular fa-heart"></i>`;

    like.addEventListener('click', () => {
      like.classList.toggle('active');
      if (like.classList.contains('active')) {
        media.likes += 1;
        this.likes += 1;
        like.innerHTML = `${media.likes} <i class="fa-solid fa-heart"></i>`;
      } else {
        media.likes -= 1;
        this.likes -= 1;
        like.innerHTML = `${media.likes} <i class="fa-regular fa-heart"></i>`;
      };
      this.displayLikes();
    });

    like.addEventListener('focus', () => {
      like.addEventListener('keydown', (event) => {
        if (event.code == 'Enter') {
          like.classList.toggle('active');
          if (like.classList.contains('active')) {
            media.likes += 1;
            this.likes += 1;
            like.innerHTML = `${media.likes} <i class="fa-solid fa-heart"></i>`;
          } else {
            media.likes -= 1;
            this.likes -= 1;
            like.innerHTML = `
              ${media.likes} 
              <i class="fa-regular fa-heart"></i>`
            ;
          };
          this.displayLikes();
        }
      });
    });

    containerText.appendChild(titleCard);
    containerText.appendChild(like);

    card.appendChild(containerImg);
    card.appendChild(containerText);

    mediaSection.appendChild(card);
  }

  /**
   * display lightbox
   * @param {Object} e
   * @param {Int} index
   */
  displayLightbox(e) {
    const lightbox = document.getElementsByClassName('lightbox')[0];
    this.indexLightbox = parseInt(e.target.dataset.index);
    this.setSrcLightbox();
    lightbox.classList.add('active');
  }

  /**
   * Set src of img lightbox width dataset
   */
  setSrcLightbox() {
    const imgLightbox = document.getElementById('imgLightbox');
    const videoLightbox = document.getElementById('videoLightbox');
    const title = document.getElementById('titleLightbox');

    const media = this.medias[this.indexLightbox];

    title.innerHTML = media.title;
    if (media.image) {
      const urlMedia = `assets/medias/${media.image}`;
      imgLightbox.setAttribute('src', urlMedia);
      imgLightbox.setAttribute('alt', media.title);

      videoLightbox.classList.remove('active');
      imgLightbox.classList.add('active');
    } else {
      const urlMedia = `assets/medias/${media.video}`;
      videoLightbox.setAttribute('src', urlMedia);
      videoLightbox.setAttribute('alt', media.title);

      imgLightbox.classList.remove('active');
      videoLightbox.classList.add('active');
    }
  }

  /**
   * close lightbox
   */
  closeLightbox() {
    const lightbox = document.getElementsByClassName('lightbox')[0];
    lightbox.classList.toggle('active');
  }

  /**
   * update indexLightbox to change src IMG
   * @param {String} nav
   */
  navLightbox(nav) {
    if (nav === 'prev') {
      this.indexLightbox -= 1;
      if (this.indexLightbox < 0) {
        this.indexLightbox = this.medias.length - 1;
      }
    } else {
      this.indexLightbox += 1;
      if (this.indexLightbox > this.medias.length - 1) {
        this.indexLightbox = 0;
      }
    }
    this.setSrcLightbox();
  }

  /**
   * append to DOM card with likes and price
   */
  displayLikes() {
    const containerFixed = document.createElement('div');
    containerFixed.classList.add('containerFixed');

    const likes = document.createElement('span');
    likes.classList.add('likes');
    likes.innerHTML = `<i class="fa-solid fa-heart"></i> ${this.likes}`;

    const price = document.createElement('span');
    price.classList.add('price');
    price.textContent = `${this.photographer.price}€/jour`;

    containerFixed.appendChild(likes);
    containerFixed.appendChild(price);

    document.querySelector('main').appendChild(containerFixed);
  }
}
