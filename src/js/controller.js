import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultView.js';
import PaginationView from './views/paginationView.js';
import 'core-js/stable'; //  for polyfilling صطبناه الأول من التيرمينال وده مطلوب علشان المتصفحات القديمة
import { async } from 'regenerator-runtime'; // نفس الكلام بس ده مهم لل async
import paginationView from './views/paginationView.js';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update Results View to mark the selected search result
    resultsView.update(model.getSearchResultsPage());
    /*
    //*كان ممكن نستخدم رندر بدل أبديت لكن طبعا ده بيخليه يعمل رندر لكامل نتائج البحث ولهذا عملنا ميثود اسمها ابديت
*/
    // 1) loading recipe
    await model.loadRecipe(id);

    // 2)rendering recipe
    recipeView.render(model.state.recipe);

    // 3) render results
    // console.log(model.state.recipe.results);
    /* الخطوة دي استلمنا الداتا بتاعتها بعد اللي علمناه في رقم 1 اللي قبلها على طول واللي هي غيرت ال
    state of state in model module
    */
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // get search query
    const query = searchView.getQuery();
    if (!query) return;

    // load search resutls
    await model.loadSearchResults(query);

    //render results
    resultsView.render(model.getSearchResultsPage());

    // Render the initial pagination feature
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  //render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render NEW initial pagination feature
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Updating the recipe servings (in state)
  model.updateServings(newServings);

  // Updating the recipe veiw
  // recipeView.render(model.state.recipe); very bad cuz it reRender the entire view(html to the browser)
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else {
    model.deleteBookmark(model.state.recipe.id);
  }

  recipeView.update(model.state.recipe);
};

const newFeature = function () {
  console.log('Welcome to the new app');
};

const init = function () {
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  PaginationView.addHandlerClick(controlPagination);
  newFeature();
};
init();
/*
// window.addEventListener('hashchange',controlRecipes);
// window.addEventListener('load',controlRecipes);
//لازم كمان أسمع للود إيفنت لأن لو خدت الرابط ونسخته في مكان تاني كده محلصش تغير في الهاش فمش هيظهر أي وصفة لكن لما أخليه يظهر مع ال
// load event يبقى كده صح
// ! تم نقلها إلي الفيو لأن هذا منطقي وتم تطبيق ال
// publizher subscriber design pattern
*/
