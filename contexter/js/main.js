/**
 * Created by oles on 26.09.15.
 */
var player = document.querySelector('#player');
var frameinfoDiv = document.querySelector('.frameInfo');
var wordListDiv = document.querySelector('.wordList');
var selectedWordsDiv = document.querySelector('.selectedWords');
var wordsFilmstrips = document.querySelector('.wordsFilmstrips');
var anchor = document.querySelector('.anchor')
var rainbow = new Rainbow();
var lineTop = document.querySelector('.line1')
var lineBottom = document.querySelector('.line2')
rainbow.setSpectrum('white','grey','black','red');

treshhold = 0.10

movieId = ''
args =  document.location.search.split('=')
if (args.length > 1){
    movieId = args[1].replace('/','')
} else{
    alert('no movieId!')
}

if (movieId.length) {
        var wordlist = new WordList('data/'+movieId+'.json', treshhold, function(){
        generateRangeWordList()
    });


    player.src = 'data/'+movieId;
    player.load()
    player.play()
    player.controls = true;

    player.addEventListener('timeupdate', function() {
        if (wordlist.framesData.length > 0) {
            var currentFrame = Math.floor((player.currentTime/player.duration)*(wordlist.framesData.length-1));
            var words = wordlist.getWordsOnFrame(currentFrame);
            makeFrameWordsView(words, currentFrame);
            highlightCurrentWords(words);
            updateAnchor(currentFrame);
        } else {
            player.currentTime = 0
        }
    });

    var currentWord = '';

    makeFrameWordsView = function(words, frame) {
        frameinfoDiv.innerHTML = '';
        for (var i=0; i< words.length; i++) {
            var wordEl = document.createElement('div');
            wordEl.classList.add('wordOnFrame');
            wordEl.classList.add('wordOnFrame-' + words[i].name);
            wordEl.innerHTML = words[i].name.toUpperCase();
            wordEl.style.opacity = Math.min(Math.max(words[i].values[frame]*3, 0.2),1)
            wordEl.addEventListener('click', function() {
                player.pause();

                var wordsonframe = document.querySelectorAll('.wordOnFrame');
                for (var i = 0; i < wordsonframe.length; i++) {
                    wordsonframe[i].classList.remove('currentWord');
                }

                this.classList.toggle('currentWord')

                var filmstripsList = document.querySelectorAll('.filmstrip');
                for (var i = 0; i < filmstripsList.length; i++) {
                    filmstripsList[i].classList.remove('currentWord');
                }
                var wordFilmstrip = document.querySelector('.filmstrip-' + this.innerText.toLowerCase());
                wordFilmstrip.classList.add('currentWord')
                currentWord = wordlist.WORDS[this.innerText.toLowerCase()];
                selectFilmstrip(currentWord)
                wordFilmstrip.scrollIntoView({behavior: "smooth"});
            })
            if (words[i] == currentWord) {
                wordEl.classList.add('currentWord')
            }
            frameinfoDiv.appendChild(wordEl);
        }
    }

    var selectFilmstrip = function(word) {
        var wordfilmstrip =   document.querySelector('.filmstrip-' + word.name);
        filmstriptop = getPosition(wordfilmstrip).y - getPosition(wordsFilmstrips).y
        lineTop.style.top = filmstriptop-3 + 'px';
        lineBottom.style.top = filmstriptop + 38 + 'px'
    };

    var generateRangeWordList = function(range) {
        wordListDiv.innerHTML = '';
        var rangeWordlist = wordlist.getMostOftenWords(range)
        for (var i=0; i<rangeWordlist.length; i++) {
            var wordli = document.createElement('li');
            wordli.classList.add('list-group-item');
            wordli.classList.add('word-' + rangeWordlist[i].name)

            var count = document.createElement('div');
            count.classList.add('col-lg-3');
            count.innerHTML = rangeWordlist[i].confcount;
            wordli.appendChild(count)

            var wordLabel = document.createElement('div')
            wordListDiv.appendChild(wordli)
            wordLabel.classList.add('col-lg-8');

            wordLabel.innerHTML = '<span class="wordlabel"> ' + rangeWordlist[i].name.toUpperCase() + '</span>'
            wordli.appendChild(wordLabel)
        }
        setTimeout(function(){
                generateFilmstripsForWordlist(rangeWordlist)
        },200)

    };

    var generateFilmstripsForWordlist = function(rangeWordList) {
       // wordsFilmstrips.innerHTML = '';
        for (var i=0; i < rangeWordList.length; i++) {
            var filmstrip = new WordFilmstrip(rangeWordList[i], wordsFilmstrips.getBoundingClientRect().width, player, wordlist.frameCount);
            wordsFilmstrips.appendChild(filmstrip.el);
        }
    }

    var highlightCurrentWords = function(words) {
        var wordsLis = document.querySelectorAll('.list-group-item');

        for (var i = 0; i < wordsLis.length; i++) {
            wordsLis[i].classList.remove('text-success');
        }

        for (var i = 0; i < words.length; i++) {
             document.querySelector('.word-' + words[i].name).classList.add('text-success');
        }
    };

    updateAnchor = function(frame) {
        anchor.style.left = (frame/wordlist.frameCount) * document.querySelector('canvas').width + 'px'
    };

    function getPosition(element) {
        var xPosition = 0;
        var yPosition = 0;

        while(element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }
        return { x: xPosition, y: yPosition };
    }

}
