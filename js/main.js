window.onload = function() {
    var projectList = document.querySelector('#project-list');
    var currentElem;

    projectList.addEventListener('click', function(e) {
        if(e.target.classList.contains('button-more')) {
            var item = e.target.parentNode.querySelector('.project-item');
            displayItem(item);
        }
    });

    function displayItem(item) {
        if(currentElem) {
            currentElem.classList.remove('displayElement');
            currentElem.previousElementSibling.classList.remove('active');
        }

        currentElem = item;
        currentElem.classList.add('displayElement');
        currentElem.previousElementSibling.classList.add('active');
    }
}