/**
 * Created by oles on 26.09.15.
 */
var WordFilmstrip = function(word, width, player, framecount) {
    this.player = player;
    this.framecount = framecount;
    this.el = document.createElement('canvas');
    this.el.width = width-20;
    this.el.style.width = width-20+'px';
    this.el.classList.add('filmstrip-' + word.name);
    this.el.classList.add('filmstrip');
    this.el.height = 30;
    this.word = word;
    this.ctx = this.el.getContext('2d');
    this.ctx.fillStyle = this.getColorByValue(0);
    this.ctx.fillRect(0,0, this.el.width, this.el.height)

    for (var i =0; i<this.word.frames.length; i++) {
        var currFrameId = this.word.frames[i];
        this.ctx.fillStyle = this.getColorByValue(this.word.values[currFrameId]);
        this.ctx.fillRect(this.getYbyFrame(currFrameId),0,1,42);
    }
    var self = this;
    this.el.addEventListener('click', function(e) {
        var x = e.layerX;

        var filmstripsList = document.querySelectorAll('.filmstrip');
        for (var i = 0; i < filmstripsList.length; i++) {
            filmstripsList[i].classList.remove('currentWord');
        }
        this.classList.add('currentWord');
        var frame = Math.floor((x/self.el.width)*self.framecount);
        var nearestFrame = 0;
        var minD = 10000;
        for (var i=0;i<self.word.frames.length; i++) {
            var d = Math.abs(frame - self.word.frames[i]);
            if (d<minD) {
                minD = d;
                nearestFrame = self.word.frames[i];
            }
        }
        currentWord = self.word;
        selectFilmstrip(currentWord);
        self.player.currentTime = (nearestFrame/framecount) * player.duration;
    })
};

WordFilmstrip.prototype.getYbyFrame = function(frame) {
    return Math.floor(frame/this.framecount * this.el.width)
};

WordFilmstrip.prototype.getColorByValue = function(value) {
    return '#' + rainbow.colourAt(Math.min(Math.round(value*300),100));
};