/*
Please add all Javascript code to this file.
*/
const xhr = new XMLHttpRequest(),
API_KEY = "69a479fb328f45ce94737e35e0b77c10",
baseUrl = 'https://newsapi.org/v2/everything?',
ARTICLE = document.getElementsByClassName('article'),
IMG = document.getElementsByClassName('featuredImage'),
CONTAINER = document.getElementById('main'),
CONTENT = document.getElementsByClassName('articleContent'),
TITLES = document.getElementsByTagName('h3');
SUMMARY = document.getElementsByTagName('h6'),
POPUP = document.getElementById('popUp'),
POPUPCONTENT = document.querySelector('#popUp .container'),
CLOSEPOPUP = document.querySelector('.closePopUp'),
BUTTON = document.getElementsByTagName('button')[0],
DROPDOWN = document.getElementById("dropDown"),
LISELECT = document.getElementsByClassName('news-select'),
SPAN = document.getElementsByTagName('span')[0],
LOGO = document.getElementById('logo');

let pages = 1,
sources = '',
contentExtended= [],
links = document.getElementsByClassName('linkPopUp'),
selectDropmenu = [{ source: "NYT", idCode: "the-new-york-times"},
{ source: "AP", idCode: "associated-press" }, { source: "Reuters", idCode: "reuters" }, { source: "Vice News", idCode: "vice-news" }, { source: "WaPo", idCode: "the-washington-post" }, { source: "Politico", idCode: "politico" }, { source: "Fox News", idCode: "fox-news" }, { source: "The Economist", idCode: "the-economist" }, { source: "Buzfeed", idCode: "buzfeed" }, {source: "All", idCode: ''}];

createDropDown();
activeSelection();

var getTheNews = () => {

  xhr.open('GET', `${baseUrl}q=us&page=${pages}&sources=${sources}&pageSize=10&apiKey=${API_KEY}`);
  xhr.send();
  xhr.onload = handleSuccess;
  xhr.onerror = handleError;

  function handleSuccess() {
    var response = JSON.parse(xhr.responseText);
    var content = response.articles;

    contentExtended = contentExtended.concat(content);
    createContent(content);
    popUpOpen(contentExtended);
    popUpClose();
  }

  function handleError() {
    console.log('error');
  }

}

getTheNews();

function createDropDown() {
  DROPDOWN.innerHTML = '';
  for(i = 0; i < selectDropmenu.length; i++) {
    DROPDOWN.innerHTML += `<li><a class="news-select" id="${selectDropmenu[i].idCode}" href="#">${selectDropmenu[i].source}</a></li>`;
  }
}

function activeSelection() {

  for(i = 0; i < selectDropmenu.length; i++) {
    LISELECT[i].addEventListener('click', function(event) {

      event.preventDefault();
      SPAN.innerText = this.innerText;
      sources= this.id;
      CONTAINER.innerHTML = '';
      getTheNews();
    });
  }
}

var createContent = (content) => {

  for(i=0; i < content.length; i++) {

    CONTAINER.innerHTML += `<article class="article"><section class="featuredImage"><img src="${content[i].urlToImage}" alt></section><section class="articleContent"><a href="" class="linkPopUp"><h3>${content[i].title}</h3></a><h5>${content[i].description}</h5><h6>Source: ${content[i].source.name}</h6></section><div class="clearfix"></div></article>`;
  }

}

function createPopUp(content) {

  for(i=0; i < content.length; i++) {

    POPUPCONTENT.innerHTML = `<h1>${content[i].title}</h1><p>${content[i].content}</p><a href="${content[i].url}" class="popUpAction" target="_blank">Read more from source</a>`;
  }
}

function popUpOpen(contentExtended) {

  for(i=0; i < contentExtended.length; i++) {

      POPUPCONTENT.innerHTML = `<h1>${contentExtended[i].title}</h1><p>${contentExtended[i].content}</p><a href="${contentExtended[i].url}" class="popUpAction" target="_blank">Read more from source</a>`;

    links[i].addEventListener('click', function(event){

      event.preventDefault();
      POPUP.classList.remove("hidden");
      POPUP.classList.remove("loader");
      createPopUp(contentExtended);
    });
  }
}

function popUpClose() {
  CLOSEPOPUP.addEventListener('click', function(){
    event.preventDefault();
    POPUP.classList.add("hidden");
    POPUP.classList.add("loader");

  });
}

function getScrollXY() { // taken from http://jsfiddle.net/W75mP/
  var scrOfX = 0, scrOfY = 0;
  if( typeof( window.pageYOffset ) == 'number' ) {
    //Netscape compliant
    scrOfY = window.pageYOffset;
    scrOfX = window.pageXOffset;
  } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
    //DOM compliant
    scrOfY = document.body.scrollTop;
    scrOfX = document.body.scrollLeft;
  } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
    //IE6 standards compliant mode
    scrOfY = document.documentElement.scrollTop;
    scrOfX = document.documentElement.scrollLeft;
  }
  return [ scrOfX, scrOfY ];
}

function getDocHeight() { // taken from http://jsfiddle.net/W75mP/

  return Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
}

document.addEventListener("scroll", function() {
  if (getDocHeight() == getScrollXY()[1] + window.innerHeight) {
    pages = pages + 1;
    console.log(pages);
    getTheNews();
  }
})


LOGO.addEventListener("click", function() {
      event.preventDefault();
      sources = '';
      pages = 1;
      getTheNews();
    });
