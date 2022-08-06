/**
 * class represent all fonction for all photographers
 */
export default class AllPhotographers {
  /**
   * Constructor
   */
  constructor() {
    this.data = [];
    this.getPhotographers();
  }

  /**
   * get all photographers form json
   * @return {Array}
   */
  async getPhotographers() {
    const response = await fetch('../../data/photographers.json');
    const res = await response.json();
    this.data = res.photographers;
    this.displayData();
  }

  /**
   * display all photographers on section
   */
  displayData() {
    const photographers = this.data;
    const photographsSection = document.querySelector('.photographer_section');

    photographers.forEach((photographer) => {
      const photographerModel = this.photographerCard(photographer);
      photographsSection.appendChild(photographerModel);
    });
  }

  /**
   * create card photographer
   * @param {array} data
   * @return {HTMLElement}
   */
  photographerCard(data) {
    const {name, portrait, city, country, tagline, price, id} = data;

    const article = document.createElement('article');

    const link = document.createElement('a');
    link.href = `/photographer.html?id=${id}`;

    const picture = `assets/photographers/${portrait}`;
    const containerImg = document.createElement('div');
    containerImg.classList.add('containerImg');
    const img = document.createElement('img');
    img.setAttribute('src', picture);
    img.setAttribute('alt', name);
    containerImg.appendChild(img);

    const h2 = document.createElement('h2');
    h2.textContent = name;

    link.appendChild(containerImg);
    link.appendChild(h2);

    const location = document.createElement('h3');
    location.textContent = `${city}, ${country}`;

    const taglineElement = document.createElement('h4');
    taglineElement.textContent = tagline;

    const priceElement = document.createElement('span');
    priceElement.textContent = `${price}€/jours`;

    article.appendChild(link);
    article.appendChild(location);
    article.appendChild(taglineElement);
    article.appendChild(priceElement);
    return (article);
  }
}
