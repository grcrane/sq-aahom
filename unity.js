/* ------------------------------------------------------------------- */
/* Slideshow gallery                                                   */
/* ------------------------------------------------------------------- */


function doGalleryShow() {

    // get some selectors and data 
    var background = $('#page article:first-child section:first-child div.section-background');
    var gallery = $('#page  article:first-child section.gallery-section').first().find('figure');

    // If no gallery found so abort
    if (gallery.length == 0) {
        return false;
    } 

    // Don't need the initial template image anymore.
    background.find('img').remove();

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
        if (caplink) {
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
    
    carousel();
}
  
  var myIndex = 0;
  function carousel() {
    var i;
    var background = $('#page article:first-child section:first-child div.section-background');
    var x = background.find('.mySlides');
    if (myIndex >= x.length) {
      myIndex = 0
    }
    x.removeClass("opaque");
    background.find('div.mySlides').eq(myIndex).addClass("opaque");
    myIndex++;
    setTimeout(carousel, 8000);
  }
  
  /* ------------------------------------------------------------------- */
/* Filter checklist values                                             */
/* ------------------------------------------------------------------- */ 

function filter_values () {

    // initialize based on current checkboxes
    filter_showvals();

    // Process a checkbox selection 
    $('#filterContainer input[type=checkbox]').on('change', function(e) {
        console.log('change=' + this.value);
        var name = $(this).attr('name');
        if (name) {
        $('#filterContainer input[type=checkbox][name=' + name + ']')
         .not(this).attr('checked',false);
        }
        filter_showvals();
    })

}

function filter_showvals () {

    // get an array of checked items
    var ids = [];
    var xidsx = [];
    $('#filterContainer input[type=checkbox]:checked')
      .each(function() {
        if(this.value) {ids.push(this.value); }
    });

    $('div.summary-content div.summary-metadata-container div.summary-metadata span.summary-metadata-item--cats a').removeClass('active');

    // if we have anything checked then start with everything hidden
    if (ids.length) {
        $('div.summary-item').css('display','none');
    }

    $('div.summary-item').each(function(index, value) {
        xidsx = [...ids]; // copy the array of checked items
        $(this).find('div.summary-content div.summary-metadata-container div.summary-metadata span.summary-metadata-item--cats a').filter(function (index2) {
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

function do_donor_wall() {
    $('div.summary-item').each(function() {
        var wall = $('div.summary-excerpt');
        var flag = false;
        // remove comments
        var data = wall.find('p').html().replace(/\/\*(.|\n)*\*\//g, ''); 
        $('div.data').append(data);
        var lines = data.split('<br>');   // lines is an array of strings
        for (var j = 0; j < lines.length; j++) {
            line = lines[j].trim();
            var test = line.split('//');
            if (test.length) {line = test[0];}
            // have line and not comment
            if (line && line.substr(0,2) != '//') {
                // group heading 
                if (line.substr(0,1) == '#') {
                    line = line.substr(1).trim();
                    wall.append('<div class=heading>' + line + '</div>');
                    flag = true; 
                }
                else if (!flag) {
                    wall.append('<div class=note>' + line + '</div>');
                }
                // Donor name
                else {
                    wall.append('<div class=donor>' + line + '</div>');
                }
            }
        }
    })
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
  
  var w = $('.f1_container').width();
  var fontsize = w/12;
  var lheight = fontsize + 4;
  var box = $("#flexbox .flip-card-back p.message");
  $(box).css('font-size',fontsize + 'px') 
    .css('line-height',lheight + 'px')
    .css('line-height',lheight + 'px')
    .css('height',(lheight*5) + 'px')
    .css('max-height',(lheight*5) + 'px');

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
