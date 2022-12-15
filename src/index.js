import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import OnlyScroll from 'only-scrollbar';
import NewsApiaServise from './js/api-pixabay';
import LoadMoreBtn from './js/btn-load-more';
import  renderPhotoCard  from "./js/render-function";

 
const searchForm = document.querySelector('#search-form');
const galleryCard = document.querySelector('.gallery');

const loadMoreBtn = new LoadMoreBtn({
    selector: '.load-more',
    hidden: 'true'
});

const newsApiaServise = new NewsApiaServise();

const lightbox = new SimpleLightbox(".gallery a", {
  captionsData: "alt",
    captionDelay: 250,
});

// const scroll = new OnlyScroll('.gallery', {
//     damping: 0.8,
//     eventContainer: window
// });

searchForm.addEventListener('submit', onSubmitForm);
loadMoreBtn.refs.button.addEventListener('click', fetchHits);
  


function onSubmitForm(e) {
    e.preventDefault();
    
    newsApiaServise.query = e.currentTarget.elements.searchQuery.value;

    onNotifyfailure();
    loadMoreBtn.show();
    newsApiaServise.resetPage();
    clearHitsContainer(); 
    fetchHits();
  
};

function fetchHits() {
    loadMoreBtn.disable();

    newsApiaServise.fetchPixbayPhotos()
        .then(photo => {
            // console.log(photo);
            renderCard(photo);
            lightbox.refresh();
            loadMoreBtn.enable();
            newsApiaServise.incrementPage();
            onNotifyWarning();
        });
};

function onNotifyfailure() {
  newsApiaServise.fetchPixbayPhotos()
        .then(photo => {
            // console.log(photo);
            if (photo.length === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                loadMoreBtn.hide();
                return;
            };
        });
}
function onNotifyWarning() {
    newsApiaServise.fetchPixbayPhotos()
        .then(photo => {
            const photoAll = document.querySelectorAll('a.gallery__image');
            // console.log(photoAll);
            
            if (photo.length === photoAll.length) {
                loadMoreBtn.hide();
                Notify.warning("We're sorry, but you've reached the end of search results.");
                return;
            }
        });
}

function renderCard(photos) {
    const card = renderPhotoCard(photos);
    galleryCard.insertAdjacentHTML('beforeend', card);

};

function clearHitsContainer() {
    galleryCard.innerHTML = '';
};
