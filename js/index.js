"use strict"

var socket = io.connect('https://repeater.somenano.com');
socket.on('bps', handle_bps);
socket.on('new_block', handle_new_block);

function handle_bps(data)
{
    // console.log(data);
}

function handle_new_block(data)
{
    /* = = = Send = = =
    account: "nano_3ohriafuds5pudyanucjzn46ireff1bii18189ihk7u4xcmq39wxa6u3qac9"
    amount: "100000000000000000000000000000"
    block: "{
        "type": "state",
        "account": "nano_3ohriafuds5pudyanucjzn46ireff1bii18189ihk7u4xcmq39wxa6u3qac9",
        "previous": "18A79AED7E5422E7F9A3FB79FAE956D12721B3C0D483881F24C9A31725770CCA",
        "representative": "nano_3o7uzba8b9e1wqu5ziwpruteyrs3scyqr761x7ke6w1xctohxfh5du75qgaj",
        "balance": "29148261333333333300000000000000",
        "link": "397B1551443C04B8C49C9B761AECEF5F38A664B71D4595053318CACA52C9EDC1",
        "link_as_account": "nano_1gdu4oanah16q54bs8up5dpgyqsrnskdg9c7kn4m888csbbemug3yc3zdmta",
        "signature": "A7EA175448754EC56CA9D944B40ED51CC4190FB0957BD717665D19EF09243079D98C01A9ED57684B16B8DA8DC5882E8E56D1F50BDC394F337D7B159399F29904",
        "work": "864b01bc9a991fd2"
        }"
    hash: "EC9C181F812FE112B9BCE7EA4FBEA6A56008BFE778222BE7B4F889B2D92C9614"
    is_send: "true"
    subtype: "send"
    */

    /* = = = Receive = = =
    account: "nano_1gdu4oanah16q54bs8up5dpgyqsrnskdg9c7kn4m888csbbemug3yc3zdmta"
    amount: "100000000000000000000000000000"
    block: "{
        "type": "state",
        "account": "nano_1gdu4oanah16q54bs8up5dpgyqsrnskdg9c7kn4m888csbbemug3yc3zdmta",
        "previous": "E06C6158D8E9DEA4510569A4A4A36D838EE25DDB7E1146B7FD46E60975A284A6",
        "representative": "nano_3o7uzba8b9e1wqu5ziwpruteyrs3scyqr761x7ke6w1xctohxfh5du75qgaj",
        "balance": "109294000000000000000000000000",
        "link": "EC9C181F812FE112B9BCE7EA4FBEA6A56008BFE778222BE7B4F889B2D92C9614",
        "link_as_account": "nano_3u6w51hr4dz34cwusszcbyzcfbd134zygy347hmuby6bpdeks7inrumkcqma",
        "signature": "F2E2975000F4408A92528BB07400FC035BAAA44577DAA3038F196C2768D9C733B30B6A21048F9BBEB7C77857E96A5372E529C113D937B61646B8F554F254780B",
        "work": "33b43475d61091c0"
    }"
    hash: "DB2126797DF5F9E6870BB8F38F07BF9A423BD8623F154F3D4708EC7FC6A6A266"
    subtype: "receive"
    */
    // console.log(data);

    // Create snowflake
    var nanocrawler = 'https://nanocrawler.cc/explorer/block/' + data.hash;
    var flake = '<div id="' + data.hash + '" class="snowflake" onclick="window.open(\'' + nanocrawler + '\', \'_blank\');"></div>';

    var document_height = $(document).height();
    var document_width = $(window).width();
    var image_height = flake_height(data.amount);
    var image_width = image_height/1.05

    // Animation time is randomized by multiplier of 0.7 to 1.3
    var multiplier = 1 + (0.3 - (secureMathRandom()*0.6) )
    // 1 second per 150 pixels
    var animation_time = ( ( (document_height+image_height*2) / 150 ) * 1000 ) * multiplier;

    // Animation horizontal movement is randomized by at most a quarter the document width
    var horizontal_movement = document_width/4 - (secureMathRandom()*(document_width/2));

    $('body').append(flake);
    $('#'+data.hash).css('height', ''+image_height+'px');
    $('#'+data.hash).css('width', ''+image_width+'px');
    $('#'+data.hash).css('top', ''+(image_height*-1)+'px');
    $('#'+data.hash).css('background-size', 'contain');
    $('#'+data.hash).css('left', ''+flake_left(document_width, image_width)+'px');
    
    // Animate snoflake
    $('#'+data.hash).animate({
        top: "+="+(document_height+image_height*2)+"px",
        left: "+="+(horizontal_movement)+"px"
    }, {
        duration: animation_time,
        easing: "linear"
    });

    // Schedule the snow shovel (snowflake removal)
    setTimeout(function() {
        $('#'+data.hash).remove();
    }, animation_time);

}

function flake_height(amount)
{
    /* amount 1 Nano is 1000000000000000000000000000000 */
    var tiny = 25;
    var small = 50;
    var medium = 75;
    var large = 125;
    var giant = 200;
    var blizzard = 400;

    if (amount.length <= 30) return tiny;
    amount = parseInt(amount.substring(0, amount.length-30));

    if (amount <= 10) return tiny;
    if (amount <= 100) return small;
    if (amount <= 1000) return medium;
    if (amount <= 10000) return large;
    if (amount <= 50000) return giant;
    return blizzard;
}

function flake_left(document_width, width)
{
    var max = document_width-width;
    var left = secureMathRandom()*max;
    return left;
}


function secureMathRandom() {
  // Divide a random UInt32 by the maximum value (2^32 -1) to get a result between 0 and 1
  return window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;
}

function toggle_bg_flakes() {
    if ($('#bg-flakes-check').is(':checked')) {
        $('#flakes-enabled').text('enabled');
    } else {
        $('#flakes-enabled').text('disabled');
    }
    snowStorm.toggleSnow();
}

function toggle_options() {
    var more = 'Show more options...';
    var less = 'Show less options...';
    if ($('#options-link').text() == more) {
        $('#options-link').text(less);
        $('.additional-option').css('display', 'table-row');
    } else {
        $('#options-link').text(more);
        $('.additional-option').css('display', 'none');
    }
}

function toggle_adverts() {
    if ($('#adverts-check').is(':checked')) {
        $('#adverts-enabled').text('enabled');
        if (typeof advertisements !== 'undefined') {
            advertisements.start();
        }
    } else {
        $('#adverts-enabled').text('disabled');
        if (typeof advertisements !== 'undefined') {
            advertisements.stop();
        }
    }
}