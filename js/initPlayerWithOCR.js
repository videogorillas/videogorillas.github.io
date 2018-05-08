var initPlayerOCR = () => {

    var elementsOCR = {};
    var pCont = document.querySelector("#playerOCR");
    var videoUrl = "//kote.videogorillas.com/vmir/videogorillascom/smoking-dash/file.mpd";
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        videoUrl = "//kote.videogorillas.com/vmir/videogorillascom/smoking.mp4";
    }

    if (elementsOCR.player == undefined) {
        var pConfig = {
            hotkeys: false,
            playlist: false,
            search: false,
            theme: 'vg',
            plugins: ['filmstrip']
        };
        elementsOCR.player = new VG.Player(pCont, pConfig);
    }
    elementsOCR.player.loadUrl(videoUrl, function (loadResponse) {
        console.log("loaded", elementsOCR.player);
        if (!loadResponse) {
            var timeline = elementsOCR.player.getTimeline();
            console.log("everything loaded " + timeline);
            loadSubs();
            loadAudio();
            $('.vg_addon.vg_addon__list.vg_default-bg.vg_audiolist').on('mouseover', function (e) {
                $.fn.fullpage.setAllowScrolling(false);
            });
            $('.vg_addon.vg_addon__list.vg_default-bg.vg_audiolist').on('mouseleave', function (e) {
                $.fn.fullpage.setAllowScrolling(true);
            });

            let ocr = TimecodeOCRPlugin.init(elementsOCR.player.player, "newocr.tf/model.json");
            let ocrView = new TimecodeOCRView(elementsOCR.player.player);
            window.ocr = ocr;
            window.ocrView = ocrView;

            setTimeout(() => {
                ocrView.initView();
            }, 2000);

            elementsOCR.player.player.addEventListener("play", (p) => {
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
                        });
                    }, 420);
                }
            });

            elementsOCR.player.player.addEventListener("timeupdate", (t) => {
                if (!elementsOCR.player.player.isPlaying() && ocrView.finder) {
                    ocrView.finder.style.display = "none";
                }
            });

        } else {
            console.error(loadResponse);
        }
    });
    var loadSubs = function () {
        var player = elementsOCR.player;
        var timeline = player.getTimeline();

        var urls = ['//kote.videogorillas.com/vmir/videogorillascom/smoking.srt'];

        urls.forEach(function (url) {
            var codec = VG.Captions.guessSubtitleCodec(url);
            VG.Captions.parseSubs(timeline, url, codec, function (err, subs) {
                if (!err) {
                    subs.title = 'Captions ' + (elementsOCR.player.getCaptionsList().length + 1);
                    player.addCaptions(subs);
                } else {
                    console.error('Error parsing subs', err);
                }
            });
        })
    };
    var loadAudio = function () {
        var player = elementsOCR.player;
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
    
    return elementsOCR.player;
};