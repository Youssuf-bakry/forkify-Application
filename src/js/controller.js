import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultView.js';
import PaginationView from './views/paginationView.js';
import 'core-js/stable'; //  for polyfilling صطبناه الأول من التيرمينال وده مطلوب علشان المتصفحات القديمة
import { async } from 'regenerator-runtime'; // نفس الكلام بس ده مهم لل async
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
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

    // Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

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
    console.error(err);
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
  // add/romove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //update bookmarsk
  recipeView.update(model.state.recipe);

  // render them
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show the spinnder
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render the recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change id in the url && witohut reloadin the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close the window to see the recipe
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000); // to have time to see the success message
  } catch (err) {
    console.error('👺👹', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  PaginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
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
