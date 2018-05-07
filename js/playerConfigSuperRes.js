var elementsSR = {};
var pCont = document.querySelector("#playerContainerSuperRes");
var videoUrl = "//kote.videogorillas.com/vmir/videogorillascom/superres-dash/file.mpd";
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
    videoUrl = "//kote.videogorillas.com/vmir/videogorillascom/super-res-demo.mp4";
}

if (elementsSR.player == undefined) {
    var pConfig = {
        hotkeys: false,
        playlist: false,
        search: false,
        theme: 'vg',
        plugins: ['filmstrip']
    };
    elementsSR.player = new VG.Player(pCont, pConfig);
}
elementsSR.player.loadUrl(videoUrl, function (loadResponse) {
    console.log("loaded", elementsSR.player);
    if (!loadResponse) {
        var timeline = elementsSR.player.getTimeline();
        console.log("everything loaded " + timeline);
        loadSubs();
        loadAudio();
        $('.vg_addon.vg_addon__list.vg_default-bg.vg_audiolist').on('mouseover', function (e) {
            $.fn.fullpage.setAllowScrolling(false);
        });
        $('.vg_addon.vg_addon__list.vg_default-bg.vg_audiolist').on('mouseleave', function (e) {
            $.fn.fullpage.setAllowScrolling(true);
        });

        let ocr = TimecodeOCRPlugin.init(elementsSR.player.player, "newocr.tf/model.json");
        let ocrView = new TimecodeOCRView(elementsSR.player.player);
        window.ocr = ocr;
        window.ocrView = ocrView;

        setTimeout(() => {
            ocrView.initView();
        }, 2000);

        elementsSR.player.player.addEventListener("play", (p) => {
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

        elementsSR.player.player.addEventListener("timeupdate", (t) => {
            if(!elementsSR.player.player.isPlaying() && ocrView.finder) {
            ocrView.finder.style.display = "none";
            }
        });

    } else {
        console.error(loadResponse);
    }
});