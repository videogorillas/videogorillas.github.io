var playerInit = function (elementsArray, containerId, urlMpd, urlMp4, useOCR, useHotkeys, subUrlsArray, audioUrlsArray) {

    var elementsArray = {};
    var pCont = document.querySelector("#" + containerId);
    var videoUrl = urlMpd;
    if(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        videoUrl = urlMp4;
    }

    if (elementsArray.player == undefined) {
        var pConfig = {
            hotkeys: useHotkeys,
            playlist: false,
            search: false,
            theme: 'vg',
            plugins: ['filmstrip']
        };
        elementsArray.player = new VG.Player(pCont, pConfig);
    }
    elementsArray.player.loadUrl(videoUrl, function (loadResponse) {
        console.log("loaded", elementsArray.player);
        if (!loadResponse) {
            var timeline = elementsArray.player.getTimeline();
            console.log("everything loaded " + timeline);
            loadSubs();
            loadAudio();
            loadOCR(useOCR);
            $('.vg_addon.vg_addon__list.vg_default-bg.vg_audiolist').on('mouseover', function (e) {
                $.fn.fullpage.setAllowScrolling(false);
            });
            $('.vg_addon.vg_addon__list.vg_default-bg.vg_audiolist').on('mouseleave', function (e) {
                $.fn.fullpage.setAllowScrolling(true);
            });

        } else {
            console.error(loadResponse);
        }
    });

    var loadSubs = function () {
        var player = elementsArray.player;
        var timeline = player.getTimeline();

        if (subUrlsArray != null) {
            subUrlsArray.forEach(function (url) {
                var codec = VG.Captions.guessSubtitleCodec(url);
                VG.Captions.parseSubs(timeline, url, codec, function (err, subs) {
                    if (!err) {
                        subs.title = 'Captions ' + (elementsArray.player.getCaptionsList().length + 1);
                        player.addCaptions(subs);
                    } else {
                        console.error('Error parsing subs', err);
                    }
                });
            })
        }
    };
    
    var loadAudio = function () {
        var player = elementsArray.player;

        if (audioUrlsArray != null) {
            audioUrlsArray.forEach(function (url) {
                player.loadAudioTrack(url, "Track " + (audioUrlsArray.indexOf(url) + 1), function (err) {
                    if (!err) {
                        console.log("audio loaded")
                    } else {
                        console.error("failed to load audio", err);
                    }
                });
            })
        }
    };
    
    var loadOCR = function (b) {
        if (b) {
            let ocr = TimecodeOCRPlugin.init(elementsArray.player.player, "newocr.tf/model.json");
            let ocrView = new TimecodeOCRView(elementsArray.player.player);
            window.ocr = ocr;
            window.ocrView = ocrView;

            setTimeout(() => {
                ocrView.initView();
            }, 2000);

            elementsArray.player.player.addEventListener("play", (p) => {
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

            elementsArray.player.player.addEventListener("timeupdate", (t) => {
                if (!elementsOCR.player.player.isPlaying() && ocrView.finder) {
                    ocrView.finder.style.display = "none";
                }
            });
        }
    };

    return elementsArray.player;

};