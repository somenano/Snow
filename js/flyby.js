function rnd() {
    // random number between 0 and 1
    return window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;
}

function rnd_int(min, max) {
    return Math.floor(rnd()*(max-min+1)+min);
}

(function(window, document) {

    var adverts = Object();

    // Properties  --- public ---
    adverts.period = 30*1000;          // milliseconds between new advertisement

    // Properties --- private ---
    adverts.enabled = true;            // false will disable the showing of advertisements
    adverts.timer = null;              // timer that stores the timer
    adverts.adverts_array = [];        // array of active advertisements
    adverts.id_prefix = "advert-";     // prefix followed by random numbers to be used for div on the document
    adverts.id_min = 1;                // minimum value to append to adverts.id_prefix
    adverts.id_max = 99999;            // maximum value to append to adverts.id_prefix

    // Methods

    adverts.gen_id = function() {
        // Generate unique id and add to adverts.adverts_array, also returning the value
        var new_id = null;
        while (!new_id || adverts.adverts_array.includes(new_id)) {
            new_id = adverts.id_prefix + rnd_int(adverts.id_min, adverts.id_max);
        }
        adverts.adverts_array.push(new_id);
        return new_id;
    };

    adverts.show_advert = function() {

        // Create advert
        var advert_id = adverts.gen_id();
        $('body').append(adverts.gen_advert(advert_id));

        var document_height = $(document).height();
        var document_width = $(window).width();
        var advert_height = $('#'+advert_id).height();
        var advert_width = $('#'+advert_id).width();

        $('#'+advert_id).css('left', ''+document_width+'px');
        $('#'+advert_id).css('top', ''+(document_height/2) - rnd()*(document_height/2)+'px');

        // Animate advert
        var animation_time = ( ( (document_width+advert_width*2) / 150 ) * 1000 );
        $('#'+advert_id).animate({
            top: "+="+(advert_height*2 - advert_height*4*rnd())+"px",
            left: "-="+Math.floor(document_width+advert_width)+"px"
        }, {
            duration: animation_time,
            easing: "linear"
        });

        // Schedule the removal of the advert from the document as well as adverts array
        setTimeout(function() {
            $('#'+advert_id).remove();
            var index = adverts.adverts_array.indexOf(advert_id);
            if (index > -1) {
                adverts.adverts_array.splice(index, 1);
            }
        }, animation_time);
    };

    adverts.get_advert_details = function() {
        // Retrieve details of random advert
        if (typeof advert_listing === 'undefined' || advert_listing.length == 0) {
            console.error('No adverts found! You must include advertisement_listings.js before advertisement.js');
            return {'text': 'No adverts loaded', 'url': '#'};
        }
        return advert_listing[rnd_int(0, advert_listing.length-1)];
    };

    adverts.gen_advert = function(advert_id) {
        var cur_advert = adverts.get_advert_details();
            /*
         __
         \  \     _ _    /
          \**\ ___\/ \-<| 
        X*#####*+^^\_\   \
          o/\  \
             \__\
             */
        var plane = "&nbsp;__<br>";
        plane += "&nbsp;\\&nbsp;&nbsp;\\&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_&nbsp;_<br>";
        plane += "&nbsp;&nbsp;\\**\\&nbsp;___\\/&nbsp;\\&nbsp;&nbsp;&nbsp;/";
        plane += "-".repeat(cur_advert.text.length+1) + "/<br>"; // top border of advertisement
        plane += "X*#####*+^^\\_\\-<|&nbsp;";
        plane += cur_advert.text + " |<br>"; // text of advertisement
        plane += "&nbsp;&nbsp;o/\\&nbsp;&nbsp;\\&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\";
        plane += "-".repeat(cur_advert.text.length+1) + "\\<br>"; // bottom border of advertisement
        plane += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\__\\<br>";

        var div = "<div id='" + advert_id + "' class='advertisement' onclick='window.open(\"" + cur_advert.url + "\", \"_blank\")'>" + plane + "</div>";

        return div;
    };

    adverts.start = function() {
        adverts.enabled = true;
        adverts.show_advert();  // show one then set the interval
        adverts.timer = setInterval(function() {
            adverts.show_advert();
        }, adverts.period);
    };

    adverts.stop = function() {
        adverts.enabled = false;
        clearInterval(adverts.timer);
        $('.advertisement').remove();
    };

    // Initiate the advertisements
    if (adverts.enabled) {
        adverts.start();
    }

    window.advertisements = adverts;

})(window, document);