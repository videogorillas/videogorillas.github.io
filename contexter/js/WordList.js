/**
 * Created by oles on 26.09.15.
 */
var WordList = function(wordsJsonURL, treshhold, callback) {
    this.WORDS = {}
    this.framesData = [];
    this.func_words = ['a', 'on', 'of', 'the', 'in', 'with', 'and', 'is', 'to', 'an', 'two', 'at', 'next', 'are', 'his'];
    var self = this;
    getJSON(wordsJsonURL, function(data) {
        self.framesData = data;
        self.frameCount = data.length;
        self.init(treshhold);
        if (callback) {
            callback();
        }
    })
};

WordList.prototype.init = function(treshhold) {
    var self = this;
    var Word = function(name) {
        name = name.replace(' ', '-');
        this.name = name
        this.frames = [];
        this.values = [];
        this.confidence = 0;
        this.confcount = 0;
        for (var i = 0; i<self.frameCount; i++) {
            this.values.push(0);
        };
        this.count = 0
    }
    this.wordsByFrame = [];
    for (var i=0; i < this.frameCount; i++) {
        var wordsInFrame = this.framesData[i];
        this.wordsByFrame[i] = [];
        for (var j = 0; j< wordsInFrame.length; j++) {
            var currentWord = wordsInFrame[j][0].replace(' ', '-');
            var currentWordValue = wordsInFrame[j][1];
            if (this.func_words.indexOf(currentWord) < 0 && currentWordValue > treshhold) {
                if (!this.WORDS[currentWord]) {
                    this.WORDS[currentWord] = new Word(currentWord);
                };
                this.WORDS[currentWord].values[i] = currentWordValue;
                this.wordsByFrame[i].push(this.WORDS[currentWord]);
                this.WORDS[currentWord].frames.push(i)
            }
        }
    }
};

WordList.prototype.getMostOftenWords = function(range) {
    var treshhold = 0.03;
    var range = range || {start: 0, end:this.frameCount};
    var usedWords = [];
    for (var i = range.start; i< range.end; i++) {
        var currentFrameWords = this.wordsByFrame[i];
        for (var j=0; j < currentFrameWords.length; j++) {
            var currentWord = currentFrameWords[j];
            if (usedWords.indexOf(currentWord) < 0) {
                usedWords.push(currentWord);
            }
            currentWord.count++;
            if (currentWord.values[i] > treshhold) {
                currentWord.confcount++;
                currentWord.confidence += currentWord.values[i];
            }
        }
    }
    for (var i=0; i<usedWords.length; i++) {
        usedWords[i].confidence = usedWords[i].confidence/usedWords[i].count
    }
    usedWords.sort(function(a,b) {
        return b.confcount - a.confcount
    })
    return usedWords;
};

WordList.prototype.getWordsOnFrame = function(frame) {
    var words = [];
    var _wordsByFrame = this.wordsByFrame[frame] || [];
    for (var i = 0; i < _wordsByFrame.length; i++) {
        words.push(_wordsByFrame[i]);
    }
    return words
};