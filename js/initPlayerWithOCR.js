var elements = {};
var pCont = document.querySelector("#playerContainer");
var videoUrl = "//kote.videogorillas.com/vmir/videogorillascom/smoking-dash/file.mpd";
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
    videoUrl = "//kote.videogorillas.com/vmir/videogorillascom/smoking.mp4";
}

if (elements.player == undefined) {
    var pConfig = {
        hotkeys: true,
        playlist: false,
        search: false,
        theme: 'vg',
        plugins: ['filmstrip']
    };
    elements.player = new VG.Player(pCont, pConfig);
}
elements.player.loadUrl(videoUrl, function (loadResponse) {
    console.log("loaded", elements.player);
    if (!loadResponse) {
        var timeline = elements.player.getTimeline();
        console.log("everything loaded " + timeline);
        loadSubs();
        loadAudio();
        $('.vg_addon.vg_addon__list.vg_default-bg.vg_audiolist').on('mouseover', function (e) {
            $.fn.fullpage.setAllowScrolling(false);
        });
        $('.vg_addon.vg_addon__list.vg_default-bg.vg_audiolist').on('mouseleave', function (e) {
            $.fn.fullpage.setAllowScrolling(true);
        });

        let ocr = TimecodeOCRPlugin.init(elements.player.player, "newocr.tf/model.json");
        let ocrView = new TimecodeOCRView(elements.player.player);
        window.ocr = ocr;
        window.ocrView = ocrView;

        setTimeout(() => {
            ocrView.initView();
        }, 2000);

        elements.player.player.addEventListener("play", (p) => {
            if (!ocrView.finder) {
            return;
        }

        if (p) {
            ocrView.finder.style.display = "none";
        } else {
            setTimeout(() => {
                ocr.detectCurrentFrame(tc_and_bbox => {
                ocrView.finder.style.display = "block";
            let tc = tc_and_bbox[0];
            let box = tc_and_bbox[1];
            console.log(tc);
            ocrView.finder.innerText = "OCRed timecode: " + tc;
            if (box) {
                TimecodeOCRView.placeFinderBBox(box, ocrView.finder);
            }
            }); }, 420);
            }
        });

        elements.player.player.addEventListener("timeupdate", (t) => {
            if(!elements.player.player.isPlaying() && ocrView.finder) {
            ocrView.finder.style.display = "none";
            }
        });

    } else {
        console.error(loadResponse);
    }
});
var loadSubs = function () {
    var player = elements.player;
    var timeline = player.getTimeline();

    var urls = ['//kote.videogorillas.com/vmir/videogorillascom/smoking.srt'];

    urls.forEach(function (url) {
        var codec = VG.Captions.guessSubtitleCodec(url);
        VG.Captions.parseSubs(timeline, url, codec, function (err, subs) {
            if (!err) {
                subs.title = 'Captions ' + (elements.player.getCaptionsList().length + 1);
                player.addCaptions(subs);
            } else {
                console.error('Error parsing subs', err);
            }
        });
    })
};
var loadAudio = function () {
    var player = elements.player;
    var urls = ['//kote.videogorillas.com/vmir/about_that_oldie.m4a',
        '//kote.videogorillas.com/vmir/the_chase.m4a'
    ];

    urls.forEach(function (url) {
        player.loadAudioTrack(url, "Track " + (urls.indexOf(url) + 1), function (err) {
            if (!err) {
                console.log("audio loaded")
            } else {
                console.error("failed to load audio", err);
            }
        });
    })
};