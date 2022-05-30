import View from './View.js';
import previewView from './previewView.js';
// import icons from 'url:../../img/icons.svg'; parcel 2
import icons from '../../img/icons.svg';

class bookMarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet!';
  _successMessage = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new bookMarksView();
