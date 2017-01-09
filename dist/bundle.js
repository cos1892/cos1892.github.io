/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	window.onload = () => {

	    const {searchDiv, searchLabel, search, wrapper, resultDiv, pages} = __webpack_require__(1);
	    const searchListener = __webpack_require__(2);
	    const req = __webpack_require__(3);

	    let obj = {
	        currentPage: 1,
	        mousedownX: 0,
	        countResult: 0,
	        resultPerPage: 4,
	        numberOfPages: 0,
	        nextPageToken: ''
	    }

	    let resultDivPostionX = 0;
	    
	    obj = searchListener(search, resultDiv, pages, obj);

	    pages.addEventListener('click', function(e) {
	        if(e.target.classList.contains('page')) {
	            obj.currentPage = parseInt(e.target.innerHTML, 10);
	            changePage(obj.currentPage);
	        }
	    });

	    function changePage(number) {
	        console.log(number, obj.numberOfPages);
	        resultDiv.style.left = '-' + 1480*(number - 1) + 'px';
	        if(number % 3 === 0 && number + 3 > obj.numberOfPages || number === obj.numberOfPages) {
	            req(pages, resultDiv, search, obj);
	        }
	    }

	    const moveHandler = function(e) {
	        resultDiv.style.left = parseInt(resultDiv.style.left, 10) + (e.pageX - obj.mousedownX) + 'px';
	        obj.mousedownX = e.pageX;
	    }

	    const mouseUpHandler = function(e) {
	        resultDiv.style.transition = 'left 2s';
	        const changePosition = resultDivPostionX - parseInt(resultDiv.style.left, 10);
	        if(changePosition > 300) {
	            obj.currentPage++;
	        } else if(changePosition < -300) {
	            if(obj.currentPage > 1) {
	                obj.currentPage--;
	            }
	        }
	        changePage(obj.currentPage);
	        obj.mousedownX = 0;
	        wrapper.removeEventListener('mousemove', moveHandler);
	        wrapper.removeEventListener('mouseup', mouseUpHandler);
	    }

	    wrapper.addEventListener('mousedown', function(e) {
	        obj.mousedownX = e.pageX;
	        resultDivPostionX = parseInt(resultDiv.style.left);
	        console.log(obj.mousedownX);
	        resultDiv.style.transition = 'left .1s';
	        wrapper.addEventListener('mousemove', moveHandler);
	        wrapper.addEventListener('mouseup', mouseUpHandler);
	    });
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	const searchDiv = document.createElement('div');
	searchDiv.className = 'search';
	document.body.appendChild(searchDiv);
	const searchLabel = document.createElement('label');
	searchLabel.innerHTML = `<i class="fa fa-search" aria-hidden="true"></i>`;
	searchDiv.appendChild(searchLabel);
	const search = document.createElement('input');
	search.setAttribute('id', 'stringSearch');
	search.setAttribute('type', 'text');
	search.setAttribute('placeholder', 'Search');
	searchDiv.appendChild(search);
	searchLabel.setAttribute('for', 'stringSearch');
	const wrapper = document.createElement('div');
	wrapper.setAttribute('id', 'wrapper');
	document.body.appendChild(wrapper);
	const resultDiv = document.createElement('div');
	resultDiv.setAttribute('id', 'result');
	wrapper.appendChild(resultDiv);
	const pages = document.createElement('div');
	pages.setAttribute('id', 'pages');
	document.body.appendChild(pages);

	module.exports = {searchDiv, searchLabel, search, wrapper, resultDiv, pages};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	const req = __webpack_require__(3);

	function addSearchListener(search, resultDiv, pages, obj) {
	    search.addEventListener('keydown', function(e) {
	        if(e.keyCode === 13) {
	            resultDiv.innerHTML = '';
	            resultDiv.style.left = '0px';
	            pages.innerHTML = '';
	            obj.numberOfPages = 0;
	            obj.countResult = 0;
	            obj.currentPage = 0;
	            obj.nextPageToken = '';
	            obj = req(pages, resultDiv, search, obj);
	        }
	    });

	    return obj;
	}

	module.exports = addSearchListener;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	const viewResult = __webpack_require__(4);

	function req(pages, resultDiv, search, obj) {
	    const xhr = new XMLHttpRequest();
	    if(obj.nextPageToken !== '') {
	       xhr.open('GET', `https://www.googleapis.com/youtube/v3/search?key=AIzaSyBmUKQP_BfLZY-0Q1JbK6pjco-jdThV-Pw&pageToken=${obj.nextPageToken}&type=video&part=snippet&maxResults=15&q=${search.value}`, true); 
	    } else {
	       xhr.open('GET', `https://www.googleapis.com/youtube/v3/search?key=AIzaSyBmUKQP_BfLZY-0Q1JbK6pjco-jdThV-Pw&type=video&part=snippet&maxResults=15&q=${search.value}`, true); 
	    }

	    xhr.onload = function() {
	        const result = JSON.parse(this.responseText);
	        const previousCount = obj.countResult;
	        const previousNumberOfPages = obj.numberOfPages;
	        obj.countResult = previousCount + result.items.length;
	        obj.numberOfPages = Math.floor(obj.countResult / obj.resultPerPage);
	        if(obj.nextPageToken === '' && obj.countResult === 0) {
	            alert('Поиск не дал результатов');
	        } else {
	            obj.nextPageToken = result.nextPageToken;
	            for(let i = previousNumberOfPages; i < obj.numberOfPages; i++) {
	                pages.innerHTML += `<button class="page">${i + 1}</button>`;
	            }
	            result.items.forEach(function(item, i, arr) {
	                viewResult(item, previousCount + i, resultDiv);
	            });
	        }
	    }

	    xhr.onerror = function() {
	      alert( 'Ошибка ' + this.status );
	    }

	    xhr.send();

	    return obj;
	}

	module.exports = req;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict'

	function viewResult(item, number, resultDiv) {
	    const xhrVideo = new XMLHttpRequest();
	    xhrVideo.open('GET', `https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBmUKQP_BfLZY-0Q1JbK6pjco-jdThV-Pw&id=${item.id.videoId}&part=snippet,statistics`, true);

	    xhrVideo.onload = function() {
	        const resultVideo = JSON.parse(this.responseText);
	        const itemDiv = document.createElement('div');
	        const urlYoutube = `https://www.youtube.com/watch?v=${item.id.videoId}`;
	        itemDiv.className = `item ${number}`;
	        itemDiv.innerHTML = `<a href=${urlYoutube} class="title">${resultVideo.items[0].snippet.title}</a>
	                            <img src=${resultVideo.items[0].snippet.thumbnails.medium.url} alt="preview image" />
	                            <div class="information">
	                                <div>
	                                    <i class="fa fa-user" aria-hidden="true"></i>
	                                    <span class="channel">${resultVideo.items[0].snippet.channelTitle}</span>
	                                </div>
	                                <div>
	                                    <i class="fa fa-calendar" aria-hidden="true"></i>
	                                    <span class="date">${resultVideo.items[0].snippet.publishedAt.slice(0, 10)}</span>
	                                </div>
	                                <div>
	                                    <i class="fa fa-eye" aria-hidden="true"></i>
	                                    <span class="date">${resultVideo.items[0].statistics.viewCount}</span>
	                                </div>
	                            </div>
	                            <p class="description">${item.snippet.description}</p>`;
	        resultDiv.appendChild(itemDiv);
	        itemDiv.style.left = 370 * number + 'px';
	    }

	    xhrVideo.onerror = function() {
	        alert( 'Ошибка ' + this.status );
	    }

	    xhrVideo.send();
	}

	module.exports = viewResult;

/***/ }
/******/ ]);