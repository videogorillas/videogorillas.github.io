let jasonUrl = "https://beta.live4.io/api/streams?userId=jason@videogorillas.com&count=1";
let antonUrl = "https://beta.live4.io/api/streams?userId=anton@videogorillas.com&count=1";

function promiseToFetchJason() {
    return new Promise(resolveJason => {
        $.ajax({
            type: "GET",
            url: jasonUrl,
            success: function (jasonStream) {
                resolveJason(jasonStream[0]);
            }
        });
    });
}

function promisToFetchAnton() {
    return new Promise(resolveAnton => {
        $.ajax({
            type: "GET",
            url: antonUrl,
            success: function (stream) {
                resolveAnton(stream[0]);
            }
        });
    });
}

let contJason = document.querySelector("#playerContainerJason");
let contAnton = document.querySelector("#playerContainerAnton");

var pConfig = {
    hotkeys: true,
    playlist: false,
    search: false,
    theme: 'vg',
    plugins: ['filmstrip']
};
var playerJason = new VG.Player(contJason, pConfig);

var pConfig = {
    hotkeys: true,
    playlist: false,
    search: false,
    theme: 'vg',
    plugins: ['filmstrip']
};
var playerAnton = new VG.Player(contAnton, pConfig);

var resolveJ;
resolveJ = setInterval(() => {
    console.log("tick jason");
    promiseToFetchJason().then(s => {
        if ("LIVE" === s.status) {
            console.log("ga jason ", s);
            clearInterval(resolveJ);

            playerJason.loadUrl("https://beta.live4.io" + s.mpd, function (err) {
                if (!err) {
                    playerJason.play();
                    playerJason.seekSec(playerJason.getDurationSec() - 1);
                }
            });
        }
    })
}, 420);

var resolveA;
resolveA = setInterval(() => {
    promisToFetchAnton().then(s => {
        console.log("tick anton");
        if ("LIVE" === s.status) {
            console.log("ga anton ", s);
            clearInterval(resolveA);

            playerAnton.loadUrl("https://beta.live4.io" + s.mpd, function (err) {
                if (!err) {
                    playerAnton.play();
                    let syncSec = playerJason.getDurationSec();

                    playerJason.seekSec(syncSec);
                    playerAnton.seekSec(syncSec);
                }
            });
        }
    })
}, 420);
