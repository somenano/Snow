function rnd() {
    // random number between 0 and 1
    return window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;
}

function rnd_int(min, max) {;
    return Math.floor(rnd()*(max-min+1)+min);
}

var advertisements = (function(window, document) {

    // Properties  --- public ---
    this.period = 30*1000;          // milliseconds between new advertisement

    // Properties --- private ---
    this.enabled = true;            // false will disable the showing of advertisements
    this.timer = null;              // timer that stores the timer
    this.adverts = [];              // array of active advertisements
    this.id_prefix = "advert-";     // prefix followed by random numbers to be used for div on the document
    this.id_min = 1;                // minimum value to append to this.id_prefix
    this.id_max = 99999;            // maximum value to append to this.id_prefix


    // Methods

    function gen_id() {
        // Generate unique id and add to this.adverts, also returning the value
        var new_id = null;
        while (!new_id || this.adverts.includes(new_id)) {
            new_id = this.id_prefix + rnd_int(this.id_min, this.id_max);
        }
        this.adverts.push(new_id);
        return new_id;
    }

    function show_advert() {

        // Create advert
        var advert_id = gen_id();
        $('body').append(gen_advert(advert_id));

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
            var index = this.adverts.indexOf(advert_id);
            if (index > -1) {
                this.adverts.splice(index, 1);
            }
        }, animation_time);
    }

    function get_advert_details() {
        // Retrieve details of random advert
        if (typeof advert_listing === 'undefined' || advert_listing.length == 0) {
            console.error('No adverts found! You must include advertisement_listings.js before advertisement.js');
            return {'text': 'No adverts loaded', 'url': '#'};
        }
        return advert_listing[rnd_int(0, advert_listing.length-1)]
    }

    function gen_advert(advert_id) {
        var advert = get_advert_details()
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
        plane += "-".repeat(advert.text.length+1) + "/<br>"; // top border of advertisement
        plane += "X*#####*+^^\\_\\-<|&nbsp;";
        plane += advert.text + " |<br>"; // text of advertisement
        plane += "&nbsp;&nbsp;o/\\&nbsp;&nbsp;\\&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\";
        plane += "-".repeat(advert.text.length+1) + "\\<br>"; // bottom border of advertisement
        plane += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\__\\<br>";

        var div = "<div id='" + advert_id + "' class='advertisement' onclick='window.open(\"" + advert.url + "\", \"_blank\")'>" + plane + "</div>";

        return div;
    }

    function start() {
        this.enabled = true;
        show_advert();  // show one then set the interval
        this.timer = setInterval(function() {
            show_advert();
        }, this.period);
    }

    function stop() {
        this.enabled = false;
        clearInterval(this.timer);
    }

    // Initiate the advertisements
    if (this.enabled) {
        start();
    }

    return this;

}(window, document));