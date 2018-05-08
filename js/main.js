// Full Page

$(document).ready(function() {
    $('.main').fullpage({
        //Navigation
        menu: '#menu',
        lockAnchors: false,
        anchors:['welcome', 'smoking', 'superresolution', 'who', 'what', 'services', 'story', 'contact'],
        navigation: true,
        navigationPosition: 'right',
        navigationTooltips: ['VideoGorillas', 'Smoking demo', 'Super Resolution', 'Who We Are', 'What We Do', 'Products and Services', 'Our Story', 'Hit Us Up'],
        showActiveTooltip: false,
        slidesNavigation: false,
        slidesNavPosition: 'bottom',

        //Scrolling
        css3: true,
        scrollingSpeed: 600,
        autoScrolling: true,
        fitToSection: false,
        fitToSectionDelay: 300,
        scrollBar: false,
        easing: 'easeInOutCubic',
        easingcss3: 'ease',
        loopBottom: false,
        loopTop: false,
        loopHorizontal: true,
		continuousVertical: false,
        continuousHorizontal: false,
        scrollHorizontally: false,
        interlockedSlides: false,
        resetSliders: false,

        //Accessibility
        keyboardScrolling: true,
        animateAnchor: true,
        recordHistory: true,

        //Design
        controlArrows: true,
        verticalCentered: true,
        paddingTop: '0',
        paddingBottom: '0',
        responsiveWidth: 500,
        responsiveHeight: 0,

        //Custom selectors
        sectionSelector: 'section',
        slideSelector: '.slide',
    });
});


// Player

$(document).ready(function() {
    $('.hex-player-play, .play-button-label').click(function () {
        $('.page-2.overlay, #page2 div.page-container').fadeOut(1000);
        elements.player.play();
    });
    
    $('.hex-player-play-smoking').click(function () {
        $('.page2.overlay, #page2 div.page-container').fadeOut(1000);
        players.smoking.play();
    });

    $('.hex-player-play-superres').click(function () {
        $('.page3.overlay, #page3 div.page-container').fadeOut(1000);
        players.superRes.player.play();
    });
    

    $('.player-features-list').on('mouseover', function (e) {
        $.fn.fullpage.setAllowScrolling(false);
    });

    $('.player-features-list').on('mouseleave', function (e) {
        $.fn.fullpage.setAllowScrolling(true);
    });

    $('.section-logo, .section-logo-grey, .footer-image').click(function () {
        window.location.assign('/');
    });

    $('.vg-icon-gorilla-framework').click(function () {
        window.location.assign('#player');
    })
});


// Contact Form 

$(document).ready(function() {
	function validateEmail($email) {
		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		return emailReg.test( $email );
	}
    $('.error').hide();
    $("#contact-form .button").click(function() {
        $('.error').hide();
        var name = $("input#name").val();
        if (name == "") {
            $("label#name_error").show();
            $("input#name").focus();
            return false;
        }
        var email = $("input#email").val();
        if (email == "") {
            $("label#email_error").show();
            return false;
        }
		if( !validateEmail(email)) {
            $("label#email_error").show();
            $("input#email").focus();
            return false;
		}
        var message = $("textarea#message").val();
        if (message == "") {
            $("label#message_error").show();
            $("textarea#message").focus();
            return false;
        }
        var dataString = 'name=' + name + '&email=' + email + '&message=' + message;
        $.ajax({
            type: "POST",
            url: "email/process.php",
            data: dataString,
            success: function() {
				$('h2#contact-headline').html('Sent');
				$('p#contact-copy').html("We'll be in touch shortly.");
                $('#contact-form').remove();
            }
        });
        return false;
    });
});