jQuery(document).ready(function($) {

    //IE 10 fix
    // Copyright 2014-2015 Twitter, Inc.
    // Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
        var msViewportStyle = document.createElement('style')
        msViewportStyle.appendChild(
            document.createTextNode(
                '@-ms-viewport{width:auto!important}'
            )
        )
        document.querySelector('head').appendChild(msViewportStyle)
    }





    // thumbs bg image
    function ctaImage(cta) {
        var ctaElement = document.getElementsByClassName(cta);
        for (var i = 0; i < ctaElement.length; i++) {
            var img = ctaElement[i].getAttribute('data-img-url');
            ctaElement[i].style.backgroundImage = "url('" + img + "')";
        };
    }
    ctaImage('programs-thumb');
    ctaImage('img-thumb');
    ctaImage('thumb');
    ctaImage('sidebar-inner');
    ctaImage('album-thumb');

    (function() {
        $(".dropdown").hover(function() {
            $('.dropdown-menu', this).stop(true, true).slideDown("fast");
            $(this).toggleClass('open');
        }, function() {
            $('.dropdown-menu', this).stop(true, true).slideUp("fast");
            $(this).toggleClass('open');
        });
    })();

    //select
    $('select').niceSelect();

    (function() {
        var mainCtaShape = $('.dbox-shape');

        var mainCtaWidth = mainCtaShape.outerWidth() * (280 / 455);
        mainCtaShape.css('border-right-width', mainCtaWidth);

    })();

    //fancyBox
    $('.fancybox').fancybox({
        beforeLoad: function() {
            this.title = $(this.element).attr('caption');
        }
    });


    /**
     * @author       Rob W <gwnRob@gmail.com>
     * @website      http://stackoverflow.com/a/7513356/938089
     * @version      20131010
     * @description  Executes function on a framed YouTube video (see website link)
     *               For a full list of possible functions, see:
     *               https://developers.google.com/youtube/js_api_reference
     * @param String frame_id The id of (the div containing) the frame
     * @param String func     Desired function to call, eg. "playVideo"
     *        (Function)      Function to call when the player is ready.
     * @param Array  args     (optional) List of arguments to pass to function func*/
    function callPlayer(frame_id, func, args) {
        if (window.jQuery && frame_id instanceof jQuery) frame_id = frame_id.get(0).id;
        var iframe = document.getElementById(frame_id);
        if (iframe && iframe.tagName.toUpperCase() != 'IFRAME') {
            iframe = iframe.getElementsByTagName('iframe')[0];
        }

        // When the player is not ready yet, add the event to a queue
        // Each frame_id is associated with an own queue.
        // Each queue has three possible states:
        //  undefined = uninitialised / array = queue / 0 = ready
        if (!callPlayer.queue) callPlayer.queue = {};
        var queue = callPlayer.queue[frame_id],
            domReady = document.readyState == 'complete';

        if (domReady && !iframe) {
            // DOM is ready and iframe does not exist. Log a message
            window.console && console.log('callPlayer: Frame not found; id=' + frame_id);
            if (queue) clearInterval(queue.poller);
        } else if (func === 'listening') {
            // Sending the "listener" message to the frame, to request status updates
            if (iframe && iframe.contentWindow) {
                func = '{"event":"listening","id":' + JSON.stringify('' + frame_id) + '}';
                iframe.contentWindow.postMessage(func, '*');
            }
        } else if (!domReady ||
            iframe && (!iframe.contentWindow || queue && !queue.ready) ||
            (!queue || !queue.ready) && typeof func === 'function') {
            if (!queue) queue = callPlayer.queue[frame_id] = [];
            queue.push([func, args]);
            if (!('poller' in queue)) {
                // keep polling until the document and frame is ready
                queue.poller = setInterval(function() {
                    callPlayer(frame_id, 'listening');
                }, 250);
                // Add a global "message" event listener, to catch status updates:
                messageEvent(1, function runOnceReady(e) {
                    if (!iframe) {
                        iframe = document.getElementById(frame_id);
                        if (!iframe) return;
                        if (iframe.tagName.toUpperCase() != 'IFRAME') {
                            iframe = iframe.getElementsByTagName('iframe')[0];
                            if (!iframe) return;
                        }
                    }
                    if (e.source === iframe.contentWindow) {
                        // Assume that the player is ready if we receive a
                        // message from the iframe
                        clearInterval(queue.poller);
                        queue.ready = true;
                        messageEvent(0, runOnceReady);
                        // .. and release the queue:
                        while (tmp = queue.shift()) {
                            callPlayer(frame_id, tmp[0], tmp[1]);
                        }
                    }
                }, false);
            }
        } else if (iframe && iframe.contentWindow) {
            // When a function is supplied, just call it (like "onYouTubePlayerReady")
            if (func.call) return func();
            // Frame exists, send message
            iframe.contentWindow.postMessage(JSON.stringify({
                "event": "command",
                "func": func,
                "args": args || [],
                "id": frame_id
            }), "*");
        }
        /* IE8 does not support addEventListener... */
        function messageEvent(add, listener) {
            var w3 = add ? window.addEventListener : window.removeEventListener;
            w3 ?
                w3('message', listener, !1) :
                (add ? window.attachEvent : window.detachEvent)('onmessage', listener);
        }
    }

    // callPlayer("testvid", function() {
    //     // This function runs once the player is ready ("onYouTubePlayerReady")
    //     callPlayer("testvid", "playVideo");
    // });
    // // When the player is not ready yet, the function will be queued.
    // // When the iframe cannot be found, a message is logged in the console.
    // callPlayer("testvid", "playVideo");



});
