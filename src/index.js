import axios from 'axios';
import './css/style.css';
import hero from './images/hero-image.png';

const $ = (str) => {
  return document.querySelector(str);
};

const $$ = (str) => {
  return document.querySelectorAll(str);
};

const heroImg = $('.hero__image img');
const popularItems = $$('.popular .recipe__item');
const modal = $('.modal');
const overlay = $('.overlay');
const form = $('.recipes form');
const input = $('.recipes form input');
const recipeList = $('.recipe__list');

class Navbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <style>
    .navbar {
      width: 100%;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 80px;
    }
    
    .nav__logo {
      font-weight: 500;
      font-size: 1.5rem;
      color: var(--primary);
      padding: 1rem;
    }
    
    .nav__menu {
      text-decoration: none;
      list-style: none;
      display: flex;
      align-items: center;
    }
    
    .nav__item {
      margin-left: 4rem;
    }
    
    .nav__item a {
      color: var(--body);
    }
    
    .nav__item svg {
      height: 32px;
      width: 32px;
    }
    
    .nav__item:last-child {
      display: inline-block;
    }
    
    .nav__item {
      display: none;
    }
    @media screen and (min-width: 768px) {
      .nav__item:last-child {
        display: none;
      }
    
      .nav__item {
        display: block;
      }
    }
    </style>
    <nav class="navbar container">
    <div class="nav__logo">recipecast</div>
    <ul class="nav__menu">
      <li class="nav__item"><a href="#">Home</a></li>
      <li class="nav__item"><a href="#">Recipe</a></li>
      <li class="nav__item"><a href="./categories.html">Category</a></li>
      <li class="nav__item">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h8m-8 6h16"
          />
        </svg>
      </li>
    </ul>
  </nav>
    `
  }
}

customElements.define('nav-bar', Navbar)

const url = 'https://www.themealdb.com/api/json/v1/1';
const popularRecipe = [
  {
    id: '52854',
    name: 'Pancakes',
    category: 'Dessert',
    imgUrl: 'https://www.themealdb.com/images/media/meals/rwuyqx1511383174.jpg',
    area: 'American',
  },
  {
    id: '52787',
    name: 'Hot Chocolate Fudge',
    category: 'Dessert',
    imgUrl: 'https://www.themealdb.com/images/media/meals/xrysxr1483568462.jpg',
    area: 'American',
  },
  {
    id: '52935',
    name: 'Steak Diane',
    category: 'Beef',
    imgUrl: 'https://www.themealdb.com/images/media/meals/vussxq1511882648.jpg',
    area: 'French',
  },
];
heroImg.src = hero;

overlay.addEventListener('click', (e) => {
  const target = e.target;

  if (
    target.classList.contains('overlay') ||
    target.classList.contains('modal__close')
  ) {
    overlay.classList.add('hide');
  }
});

popularItems.forEach((item) => {
  item.addEventListener('click', () => {
    overlay.classList.remove('hide');
    getRecipe(item.dataset.id);
  });
});

const fetchPopular = (popular) => {
  popular.forEach((recipe, i) => {
    const item = popularItems[i];
    item.dataset.id = recipe.id;
    item.querySelector('img').src = recipe.imgUrl;
    item.querySelector('.recipe__name').innerText = recipe.name;
    item.querySelector('.recipe__category').innerText = recipe.category;
    item.querySelector('.recipe__area').innerText = recipe.area;
  });
};

fetchPopular(popularRecipe);

const renderRecipe = (
  name,
  category,
  area,
  imgUrl,
  instructions,
  ingredients
) => {
  const listIngredient = ingredients.map((list) => {
    return `
      <li>${list}</li>
    `;
  });
  const html = `
  <div class="modal__img">
  <img
  src=${imgUrl}
  alt=""
/>
<p class="recipe__name">${name}</p>
<div class="recipe__tags">
  <p class="recipe__category">${category}</p>
  <p class="recipe__area">${area}</p>
</div>
</div>
<div class="modal__content">
<h4 class="recipe__heading">Instructions:</h4>
<p>${instructions}</p>
<h4 class="recipe__heading">Ingredients:</h4>
  <ul>
    ${listIngredient}
  </ul>
</div>
<div class="modal__close">
<svg
class="modal__close"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M6 18L18 6M6 6l12 12"
  />
</svg></div>
  `;

  modal.innerHTML = html;
};

const getRecipe = (id) => {
  let ingredients = [];
  let name = '';
  let category = '';
  let area = '';
  let imgUrl = '';
  let instructions = '';
  axios.get(`${url}/lookup.php?i=${id}`).then((res) => {
    const obj = res.data.meals[0];
    name = obj.strMeal;
    category = obj.strCategory;
    area = obj.strArea;
    imgUrl = obj.strMealThumb;
    instructions = obj.strInstructions;
    for (let j = 1; j <= 20; j++) {
      if (obj['strIngredient' + j]) {
        ingredients.push(
          `${obj[`strIngredient${j}`]} - ${obj[`strMeasure${j}`]}`
        );
      } else {
        break;
      }
    }
    renderRecipe(name, category, area, imgUrl, instructions, ingredients);
  });
};

recipeList.addEventListener('click', (e) => {
  const item = e.target.parentElement;
  const itemId = item.dataset.id;
  overlay.classList.remove('hide');
  getRecipe(itemId);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = input.value;
  axios
    .get(`${url}/search.php?s=${value}`)
    .then((res) => {
      return res.data.meals;
    })
    .then((meals) => {
      let html = '';
      if (!meals) {
        recipeList.innerHTML = '<p></p><p class="not-found"> Not Found </p>';
        return;
      }
      meals.forEach((meal) => {
        const mealItem = `
        <div class="recipe__item" data-id=${meal.idMeal}>
        <img
          src=${meal.strMealThumb}
          alt=""
        />
        <div class="popular__content">
          <p class="recipe__name">${meal.strMeal}</p>
          <div class="recipe__tags">
            <p class="recipe__category">${meal.strCategory}</p>
            <p class="recipe__area">${meal.strArea}</p>
          </div>
        </div>
        </div>
        `;
        html += mealItem;
      });
      recipeList.innerHTML = html;
    });
});
