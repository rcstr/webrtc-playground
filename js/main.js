$(function() {
    'use strict';
    navigator.getWebcam = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    //
    var $videoContainer = $('#video-container'),
        $myVideo = $('#my-video', $videoContainer),
        $friendVideo = $('#their-video', $videoContainer),
        //
        $errorContainers = $('ol'),
        $step1 = $('.step-1', $errorContainers),
        $step2 = $('.step-2', $errorContainers),
        $step3 = $('.step-3', $errorContainers),
        //
        hiddenClass = 'visuallyhidden';

    // PeerJS
    var peer = new Peer({
        key: 'alwkpy9vnlgzaor', // You can generate your own key at http://peerjs.com/
        debug: 3, // display all logs
        config: {
            iceServers: [{ // taken from https://gist.github.com/zziuni/3741933
                url: 'stun:stun.l.google.com:19302'
            }, {
                url: 'stun:stun1.l.google.com:19302'
            }, {
                url: 'stun:stun2.l.google.com:19302'
            }, {
                url: 'stun:stun3.l.google.com:19302'
            }, {
                url: 'stun:stun4.l.google.com:19302'
            }]
        }
    });

    peer.on('open', function() {
        $('[data-my-id]', $step2).text(peer.id);
    });

    peer.on('call', function(call) {
        call.answer(window.localStream);
        return step3(call);
    });

    function step1() {
        // get media
        navigator.getWebcam({
            audio: false,
            video: true
        }, onGetMedia, function(err) {
            $('.error', $step1).removeClass(hiddenClass);
        });
    }

    function step2() {
        $step1.addClass(hiddenClass);
        $step3.addClass(hiddenClass);
    }

    function step3(call) {
        // hang up if ther's an existing call
        if (window.existingCall) {
            window.existingCall.close();
        }

        // wait for stream the call, then setup the video
        call.on('stream', function(stream) {
            var url = buildURL(stream);
            $friendVideo.attr('src', url);
        });

        $step1.addClass(hiddenClass);
        $step2.addClass(hiddenClass);
        $step3.removeClass(hiddenClass);
    }

    // helpers
    function onGetMedia(stream) {
        // display the video stream in the video object
        var url = buildURL(stream);
        $myVideo.attr('src', url);

        window.localStream = stream;
        return step2();
    }

    function buildURL(stream) {
        return window.URL.createObjectURL(stream);
    }

    // handlers
    $('form', $step2).submit(function() {
        var $friendId = $('#friend-id' ,$step2);
        // initiate call
        var call = peer.call($friendId.val(), window.localStream);
        step3(call);

        return false;
    });

    $('[data-end-call]', $step3).click(function() {
        window.existingCall.close();
        step2();

        return false;
    });

    $('[data-retry]', $step1).click(function() {
        $('.error', $step1).addClass(hiddenClass);
        step1();

        return false;
    });

    // init
    step1();
});
