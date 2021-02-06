/* ------------------------------------------------------------------- */
/* Slideshow gallery                                                   */
/* ------------------------------------------------------------------- */


function doGalleryShow() {

    /* Don't do the fancy gallery if we are in IE 11 or earlier */
    /*
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE '); // IE 10 and older
    var trident = ua.indexOf('Trident/'); // IE 11
    if (msie > 0 || trident > 0) {
        var gallery = $('#page  article:first-child section.gallery-section').first().find('figure');
        gallery.closest('section').css('display', 'none'); 
        return;
    }
    */
    // get some selectors and data 
    var background = $('#page article:first-child section:first-child div.section-background');
    var gallery = $('#page  article:first-child section.gallery-section').first().find('figure');

    // If no gallery found so abort
    if (gallery.length == 0) {
        return false;
    } 

    // Hide the initial template, not needed.
    background.find('img').css('display','none');

    // https://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
    // See if we are editing the SquareSpace page, if so hide the gallery section
    var isEditor = window.frameElement ? true : false;
    if (isEditor == false) {
       gallery.closest('section').css('display', 'none'); 
    }

    // Loop through each figure and add to the list of slides 
    gallery.each(function() {

        var imgtemp = $(this).find('img');
        var imgcap = $(this).find('figcaption p.gallery-caption-content').text();
        var caplink = $(this).find('a').first().attr('href');
        if (caplink && imgcap) {
            imgcap = '<a href="' + caplink + '">' + imgcap + '</a>';
        }
        if (imgcap) { imgcap = '<div class="slideCaption">' + imgcap + '</div>';}
        var imgpos = imgtemp.attr('data-image-focal-point');

        imgpos = imgpos.split(",");
        var temp = "";
        for (var i = 0; i < imgpos.length; i++) {
            imgpos[i] = imgpos[i] * 100;
            temp = temp + " " + imgpos[i] + "%";
        }
        imgpos = temp.trim();
        var style = ' style="object-position:' + imgpos + ';';
        temp = '<div class="mySlides"><img src="' + imgtemp.attr('data-src') + '"' + style + '">' +
        imgcap + '</div>';
        background.append(temp);
    });

    // start the slideshow
    
    gallerycarousel();
}
  
  var myGalIndex = 0;
  function gallerycarousel() {
    var i;
    var background = $('#page article:first-child section:first-child div.section-background');
    var x = background.find('.mySlides');
    if (myGalIndex >= x.length) {
      myGalIndex = 0
    }
    x.removeClass("opaque");
    background.find('div.mySlides').eq(myGalIndex).addClass("opaque");
    myGalIndex++;
    setTimeout(gallerycarousel, 8000);
  }
  
/* ------------------------------------------------------------------- */
/* Filter checklist values                                             */
/* ------------------------------------------------------------------- */ 

var catloc =  'div.summary-content ' + 
    'div.summary-metadata-container ' + 
    'div.summary-metadata ' + 
    'span.summary-metadata-item--cats a';


function filter_values () {

    $(catloc).addClass('filterCat');

    // initialize based on current checkboxes
    filter_showvals();

    // Process a checkbox selection 
    $('#filterContainer input[type=checkbox], ' +
    '#filterContainer input[type=radio]')
    .on('change', function(e) {
        filter_showvals();
    })
}

function filter_showvals () {

    // get an array of checked items
    var ids = [];
    var xidsx = [];
    $('#filterContainer input[type=checkbox]:checked, ' +
        '#filterContainer input[type=radio]:checked')
        .each(function() {
        if(this.value) {ids.push(this.value); }
    });
   
    $(catloc).removeClass('active');

    // if we have anything checked then start with everything hidden
    if (ids.length) {
        $('div.summary-item').css('display','none');
    }

    // make sure ids only has unique values
    var t = [];
    for(var x = 0; x < ids.length; x++){
        if(t.indexOf(ids[x]) == -1) {t.push(ids[x]);}
    }
    ids = t;

    $('div.summary-item').each(function(index, value) {
        var xidsx = ids.slice(); // copy the array of checked items
        $(this).find(catloc).filter(function (index2) {
            var t = this.href.indexOf('?category=');
            var i = xidsx.indexOf(this.href.substr(t+10));
            if ( i >= 0) {
                xidsx.splice(i, 1);  
            }
            var i = ids.indexOf(this.href.substr(t+10));
            if ( i >= 0) {
                $(this).addClass('active');   
            }
        })
        // if we have found all of the selected items the show
        if (xidsx.length == 0) {
            $(this).css('display','block');
        }
    });
}    

/* ------------------------------------------------------------------- */
/* Accordian                                                           */
/* ------------------------------------------------------------------- */

$( document ).ready(function() {
    $('p span.accordian').closest('.markdown-block').addClass('markdown-accordian');
    $('.markdown-accordian .sqs-block-content h4').addClass('ui-closed').css('cursor','pointer');
    $('.markdown-accordian .sqs-block-content h4').css('cursor','pointer');
    $(".markdown-accordian .sqs-block-content h4").nextUntil("h4").slideToggle();
    $(".markdown-accordian .sqs-block-content h4").click(function() {
        var status = $(this).hasClass("ui-open");
        $(".markdown-accordian .sqs-block-content h4").nextUntil("h4").slideUp();
        $(".markdown-accordian .sqs-block-content h4").removeClass('ui-open');
        $(".markdown-accordian .sqs-block-content h4").addClass('ui-closed');
        if (status == false) {
           $(this).nextUntil("h4").slideDown();
           $(this).toggleClass('ui-closed ui-open');
        }
    });
});


/* ------------------------------------------------------------------- */
/* Donor Wall                                                          */
/* ------------------------------------------------------------------- */

//https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-string
var formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  style: 'currency',
  currency: 'USD',
});

function get_spreadsheet(theurl) {
  var result = "";
  $.ajax({
      url: theurl,
      dataType: 'text',
      async: false,
      success: function(data) {
          i = data.indexOf('(');
          j = data.lastIndexOf(')');
          data = data.substr(i + 1, j - 1 - i);
          var data = JSON.parse(data);
          result = data;
      }
  });
  return result;
}

function do_donor_wall_new(file_id) {

    var colMin = 0;
    var colDonor = 1;
    var colDonors = 2;
    var colEndowment = 3;
    var colRecent = 4; 
    var footone = '';
    var foottwo = ''; 
    var notes = ''; 
    var sheet = 'DonorWall';

    var url = 'https://docs.google.com/spreadsheets/u/0/d/'
    + file_id + '/gviz/tq?sheet=' + sheet + '&tqx=out:json&tq=' + escape('SELECT A, B, C, D, E ORDER BY A DESC');

    var spreadSheetLink = 'https://docs.google.com/spreadsheets/d/' + file_id + '/edit';

    var donorlist = get_spreadsheet(url);
    console.log(donorlist);
    if(donorlist.length == 0) {
        $('#donorWall').append('<br>Ooops.. unable to read spreadsheet</br>');
        return;
    }
    var donors = donorlist.table.rows;
    //donors.shift(); // remove header row

    var data = ''; 
    var foot = '';
    var donorcount = '';
    var donor = '';
    var heading = '';
    var prevMin = ''; 
    var maxval = ' & Above'; 
    donors.forEach(function(item, key) {
        if (item.c[colMin] != null && item.c[colDonor] != null) {
            var donorname = item.c[colDonor].v; 
            var minval = item.c[colMin].v;
            if (prevMin != minval && minval) {
              // new group
              if (prevMin) {
                maxval = ' - ' + formatter.format(prevMin - 1); 
              }
              var heading = formatter.format(minval);
              data = data + '<div class="heading">' + heading + maxval + '</div>\n';
              prevMin = minval;
            }   
            if (donorname == 'Anonymous') {
              if (item.c[colDonors] != null) {
                donorcount = '<span class="donorCount">(' + item.c[colDonors].v + ')</span>';
              }
              else {
                donorcount = '<span class="donorCount">(1)</span>';
              }
            }
            else {
              donorcount = ''; 
            }
            if (item.c[colEndowment] != null && item.c[colEndowment].v == 'Yes') {
              foot = '<sup>E</sup>';
              footone = '<div class="footnote"><sup>E</sup>&nbsp;Endowment contributor</div>\n';
            }
            else {
              foot = '';
            }
            if (item.c[colMin].v) {
              data  = data + '<div class="donor">' + donorname + donorcount + foot + '</div>';
            }
            else {
              notes  = notes + '<div class="note">' + donorname + '</div>';
            }
            
        }
    })
    var link = '<p><a href="' + spreadSheetLink + '" target="_blank">(Edit/View spreadsheet data)</a></p>';
    $('#donorWall').append(footone).append(notes).append(data).append(link);

}

/* ------------------------------------------------------------------- */
/* Home page flip boxes                                                */
/* ------------------------------------------------------------------- */

var columnIndex = 1; 
function flip_carousel() {
  var i;
  var numColumns = $('.newcolumn').length;
  if (columnIndex > numColumns) { columnIndex = 1;}
  var background = $('.newcolumn:nth-child(' + +columnIndex + ') .flip-card-front');
  columnIndex++;
  var t = background.find('img.active').index();
  myIndex =  t + 1;
  var x = background.find('img');
  if (myIndex >= x.length) {
    myIndex = 0
  }
  x.removeClass("active");
  background.find('img').eq(myIndex).addClass("active");
  myIndex++;
  setTimeout(flip_carousel, 5000);
}

function resizeFlipBoxes() {
  var boxwidth = ($('#flexbox').width());
  var parentwidth = ($('html').width());
  if (parentwidth >= 801) {
    var f = ($('#flexbox').width());
    var c = $('.newcolumn').length; 
    var pwidth = (100/c)-5;
    $('.newcolumn').width(pwidth + '%');
    var w = $('.f1_container').width();
    w = f/c;
    $('.f1_container').height(w + 'px').width(w +'px');
  }
  else {
    $('.flip-card').width(boxwidth + 'px').height(boxwidth + 'px');
  }
  var lineh = $("#flexbox .flip-card-back .backContent").css('line-height').replace('px', '');
  var lines = (w-100)/lineh >> 0; // round down with sign-propogation
  $('#flexbox.v2 .backContent').css("-webkit-line-clamp", lines.toString());
}

function setup_flipboxes() {
  $('.newcolumn .flip-card-front img:first-child')
    .addClass("active");
  resizeFlipBoxes();
  setTimeout(flip_carousel, 5000);

  $( window ).resize(function() {
    resizeFlipBoxes();
  }); 
  
}

/* ----------------------------------------------------------- */
/* Process the ajax request to get spreadsheet data            */
/* ----------------------------------------------------------- */

function get_spreadsheet(theurl) {
  var result = "";
  $.ajax({
      url: theurl,
      dataType: 'text',
      async: false,
      success: function(data) {
          i = data.indexOf('(');
          j = data.lastIndexOf(')');
          data = data.substr(i + 1, j - 1 - i);

          var data = JSON.parse(data);
          result = data;
      }
  });
  return result;
}

function process_card_info(link,images, caption, label, message) {
    var str = 
    '  <div class=newcolumn>\n' +
    '   <div class="f1_container flip-card">\n' +
    '    <div class="f1_card flip-card-inner" class="shadow">\n' +
    '     <div class="front face flip-card-front">\n';
    images.forEach(function(img, key) {
      str = str + 
    '      <img src="' + img + '"/>\n';
    })
    str = str + 
    '      <div class="labelText">' + caption + '</div>\n' +
    '     </div>\n' +
    '     <div class="back face center flip-card-back">\n' +
    '      <a href="' + link + '">\n' +
    '      <div>\n' +
    '        <div class=centerBack>\n' +
    '          <div class="labelText">' + caption + '</div>\n' +
    '          <div class="dividerBack"></div>\n' +
    '          <div class="backContent">\n' + message + 
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '      </a>\n' +
    '     </div>\n' +
    '   </div>\n' +
    '  </div>\n';
  $('.flex-container').append(str);
}

/* ----------------------------------------------------------- */
/* Get data from spreadsheet a build flipcards html            */
/* ----------------------------------------------------------- */

function build_flipcards(file_id = null) {


  if (!file_id) {
    // default to the Unity flipcard spreadsheet
    var file_id = '1wEfSb4Dnjz-eNEayaNiiws3ta1ZEueiQyG5-BTWSXag';
  }
  var url = 'https://docs.google.com/spreadsheets/u/0/d/'
    + file_id + '/gviz/tq?tqx=&tq=' + escape('SELECT * ORDER BY A, B');
  
  var cardlist = get_spreadsheet(url);
  var cards = cardlist.table.rows;

  var prevcard = ''; 
  var images = [];
  var cardnumber = '';
  var label = 'More Info';
  var message = 'See more info';
  var caption = 'VISIT'; 
  var link = '#'; 
  cards.forEach(function(item, key) {
    cardnumber = item.c[0].v;
    itemtype = item.c[1].v;
    itemtype = itemtype.toLowerCase();
    if (Number.isInteger(cardnumber)) { 
      if (prevcard != cardnumber) {
        if (prevcard != '') {
          process_card_info(link,images, caption, label, message); 
        }
        images = [];
        caption = 'TEST';
        label = 'More Info';
        link = '#';
        message = 'See more info';
        prevcard = cardnumber;
      }
      if (itemtype == 'image') {
        images.push(item.c[2].v);
      }
      if (itemtype == 'caption') {
        caption = item.c[2].v;
      }
      if (itemtype == 'message') {
        message = item.c[2].v;
      }
      if (itemtype == 'label') {
        label = item.c[2].v;
      }
      if (itemtype == 'link') {
        link = item.c[2].v;
      }
    }
  })
  if (cardnumber != '') {
    process_card_info(link,images, caption, label, message);
  }
}
