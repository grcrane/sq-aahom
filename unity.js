/* files included 

common.css
gallery.css
iconbar.css
flipbox3.css
hours.css
faqs2.css
teamboxes2.css
filter.css
donor.css

common.js
gallery.js
iconbar.js
flipbox3.js
hours.js
faqs2.js
teamboxes2.js
filter.js
donor.js

*/ 

/* ----------------------------------------------------------- */
/* Process the ajax request to get spreadsheet data            */
/*    04/10/2021 - initial                                     */
/* ----------------------------------------------------------- */

function get_spreadsheet(theurl) {
  var result = "";
  console.log('getting:' + url);
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

/* ----------------------------------------------------------- */
/* Slideshow gallery                                           */
/* ----------------------------------------------------------- */

function doGalleryShow() {

    // get some selectors and data 
    var background = $('#page article:first-child section:first-child div.section-background');
    var gallery = $('#page  article:first-child section.gallery-section').first().find('figure.gallery-grid-item');
    
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
    
    galleryCarousel();
}
  
  var myGalIndex = 0;
  function galleryCarousel() {
    var i;
    var background = $('#page article:first-child section:first-child div.section-background');
    var x = background.find('.mySlides');
    if (myGalIndex >= x.length) {
      myGalIndex = 0
    }
    x.removeClass("opaque");
    background.find('div.mySlides').eq(myGalIndex).addClass("opaque");
    myGalIndex++;
    setTimeout(galleryCarousel, 8000);
  }

/*-------------------------------------------------------------*/
/* Icon Bar                                                    */
/*    04/17/2021 - initial                                     */
/*-------------------------------------------------------------*/

// unity
// 'https://static1.squarespace.com/static/5f73ca8db43a982332ef42a7/60316dbd7dd52d12ad920e7f/605f48578926120327029e3f/1616857176069/uil.png',
// Challenger
// https://images.squarespace-cdn.com/content/v1/5f73ca8db43a982332ef42a7/1614786000565-L6LRAQGSOU2RCTJO0GMR/ke17ZwdGBToddI8pDm48kPxxGCBoMQSgw3nyp-BaIiZZw-zPPgdn4jUwVcJE1ZvWhcwhEtWJXoshNdA9f1qD7baX_VdYN7eZTOScYEC6H_pLV4CKJoqyvEGc-h-owCr40lNeO9O4GGfQSgSHrTD7DA/Logo_mainHeader.png
var iconsFor = ['aahom','leslie','yankee','Challenger']; 
var icons = [
'https://static1.squarespace.com/static/5f73ca8db43a982332ef42a7/60316dbd7dd52d12ad920e7f/605f4857363da23de8d99653/1616857176038/aahom.png?format=2500w',
'https://static1.squarespace.com/static/5f73ca8db43a982332ef42a7/60316dbd7dd52d12ad920e7f/605f48565689961a0425d469/1616857174314/lsnc.png',
'https://static1.squarespace.com/static/5f73ca8db43a982332ef42a7/60316dbd7dd52d12ad920e7f/605f485760b0890b8760c9d1/1616857176070/yam.png',
'https://static1.squarespace.com/static/5f73ca8db43a982332ef42a7/t/6091ade1fd0aad2861dda465/1620159977712/SC4+Challenger+Learning+Center+logo_150x271.png'
];
// 'Experience',
// 'https://images.squarespace-cdn.com/content/5f73ca8db43a982332ef42a7/3bace990-2ca4-4963-a409-06cb861b15b4/experience_logo.png',
function showIconBar(sticky = true, iconID = 'iconBar') {
  var temp = '<ul class="iconBarFlex">';
  icons.forEach(function(item,key) {
    temp += '<li class="flex-item ' + 'logo' + iconsFor[key] + '"><img src="' + item + '"></li>\n';
  })
  temp += '</ul>\n';
  $('#' + iconID).html(temp); 
  if (sticky) {
    var s = $('article:first-of-type section:first-of-type div.content-wrapper div.content');
    var h = s.height();
    h = parseInt(h) + 100; 
    s.height(h + 'px'); 
    $('#' + iconID).addClass('sticky');
    $('#' + iconID).appendTo('#page article:first-of-type section:first-of-type div.section-background');
        $('div.mySlides div.slideCaption').css('bottom','100px');
  } 
}

/* ----------------------------------------------------------- */
/* Flipbox3 - Home page flip boxes                             */
/*    04/10/2021 - initial                                     */
/* ----------------------------------------------------------- */

var columnIndex = 1; 

function flipCardResize3() {
  var fontsize = parseInt($('#flexbox.v3 .backContent div').css('font-size'));
  var height = parseInt($('#flexbox.v3 .backContent').css('height'));
  var lineheight = fontsize * 1.2;
  var lines = parseInt(height / lineheight);
  //alert(fontsize + ' ' + height + ' ' + lineheight + ' ' + lines); 
  $('#flexbox.v3 .backContent div').css("-webkit-line-clamp", lines.toString());
  $('#flexbox.v3 .backContent div').css("line-height", lineheight + 'px');
}

function flip_carousel3() {
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
  setTimeout(flip_carousel3, 5000);
}

function process_card_info3(link,images, caption, label, message) {
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
    
    '        <div class=centerBack>\n' +
    '          <div class="topBox">\n' +
    '             <div class="labelText">' + caption + '</div>\n' +
    '          </div>\n' +
    '          <div class="backContent">\n<div>' + message + 
    '          </div></div>\n' +
    '          <div class="backLink"><span>Learn More</span></div>' +
    '        </div>\n' +
   
    '      </a>\n' +
    '     </div>\n' +
    '   </div>\n' +
    '  </div>\n';
  $('.flex-container').append(str);
}

/* ----------------------------------------------------------- */
/* Get data from spreadsheet a build flipcards html            */
/* ----------------------------------------------------------- */

function build_flipcards3(boxNumber = '1', file_id = null, sheet = null) {


  if (!file_id) {
    file_id = '1wEfSb4Dnjz-eNEayaNiiws3ta1ZEueiQyG5-BTWSXag';
  }
  if (!sheet) {
    sheet = 'Cards2';
  }
  var where = 'SELECT * WHERE A=' + boxNumber + ' ORDER BY A, B';
  var url = 'https://docs.google.com/spreadsheets/u/0/d/'
    + file_id + '/gviz/tq?tqx=&sheet=' + sheet + 
    '&headers=1&tq=' + escape(where);

  var cardlist = get_spreadsheet(url);
  var cards = cardlist.table.rows;
  console.log(cards);

  var prevcard = ''; 
  cards.forEach(function(item, key) {
    var images = [];
    var cardnumber = '';
    var label = 'More Info';
    var message = 'See more info';
    var caption = 'VISIT'; 
    var link = '#'; 
    var background = 'rgb(102,102,102)';
    var color = 'white'; 
  
    if (item.c[1] != null) {cardnumber = item.c[1].v;}
    if (item.c[2] != null) {caption = item.c[2].v;}
    if (item.c[3] != null) {label = item.c[3].v;}
    if (item.c[4] != null) {link = item.c[4].v;}
    if (item.c[5] != null) {background = item.c[5].v;}
    if (item.c[6] != null) {color = item.c[6].v;}
    if (item.c[7] != null) {message = item.c[7].v;}
    for (var i = 8; i < 15; i++) {
      if (item.c[i] != null) { images.push(item.c[i].v); }
    };
    process_card_info3(link,images, caption, label, message);
  })   

  $('div.front.face img:first-child')
    .addClass("active");
    $('')
  setTimeout(flip_carousel3, 5000);

  flipCardResize3();

  $( window ).resize(function() {
    flipCardResize3();
  });
}

/*-------------------------------------------------------------*/
/* Address/Hours/Admissions flex boxes                         */
/*    04/10/2021 - initial                                     */
/*-------------------------------------------------------------*/

function showAddressInfo(museum = null,file_id = null, sheet = null) {
  if (!file_id) {
    file_id = '1eBU2TqbjAT0-PUkKVa0J9obsoyIBJ7ib_KJMQLNym8Y';
  }
  if (!sheet) {
    sheet = 'Hours';
  }
  var where = ''; 
  if (museum) {
    where = ' WHERE lower(A) = lower("' + museum + '") ';
  }
  var url = 'https://docs.google.com/spreadsheets/u/0/d/'
    + file_id + '/gviz/tq?tqx=out:json&sheet=' + sheet + 
    '&headers=1&tq=' + escape('SELECT * ' + where + ' ORDER BY A, B LIMIT 1');
  var colorClass = "museum" + museum.charAt(0).toUpperCase() + museum.slice(1);
  $('#hoursContainer').html(out).addClass(colorClass); 
  var addlist = get_spreadsheet(url);
  var adds = addlist.table.rows;
  var out = '<p>No data found</p>'; 
  if (adds[0]) {
    var item = adds[0];  
    var namd = item.c[0].v;
    
    var add1 = (item.c[1] != null) ? item.c[1].v : 'unknown';
    var text1 = (item.c[2] != null) ? item.c[2].v : 'unknown';
    var add2 = (item.c[3] != null) ? item.c[3].v : 'unknown';
    var text2 = (item.c[4] != null) ? item.c[4].v : 'unknown';
    var add3 = (item.c[5] != null) ? item.c[5].v : 'unknown';
    var text3 = (item.c[6] != null) ? item.c[6].v : 'unknown';
    out = '<div>\n<h3>' + add1 + '</h3>\n' + text1 + '</div>\n';
    out = out + '<div>\n<h3>' + add2 + '</h3>\n' + text2 + '</div>\n';
    out = out + '<div>\n<h3>' + add3 + '</h3>\n' + text3 + '</div>\n';
  } 
  $('#hoursContainer').html(out).css('display','flex'); 
  return; 
}

/*-------------------------------------------------------------*/
/* Frequently Asked Questions, FAQS2                           */
/*    04/11/2021 - initial                                     */
/*-------------------------------------------------------------*/

function do_faqs2(museums, collapsed = true, file_id = null, sheet = null) {

    var listCol = 0;
    var catCol = 1;
    var hideCol = 2;
    var questionCol = 3;
    var answerCol = 4;
    var tabLinks = ''; 
    var out = '';
    var activeli = 0;
    var tabs = []; 
    var mtabs = [
      'unity',
      'aahom',
      'leslie',
      'yankee',
      'challenger'];
    var mtitles = [
      'Unity in Learning','Ann Arbor Hands-On',
      'Leslie Center','Yankee air Museum',
      'Challenger Center'];

    if (!file_id) {
      file_id = '1f3G-ECzjt8p-czZNPyUQGXG8NND016Nue5QypQTf6PQ';
    }
    if (!sheet) {
      var sheet = 'FAQS';
    }

    if (collapsed == true) {activeli = 'none';}

    if ($(window).width() < 960) {
      activeli = 'none';
    }
    if (!museums) {
      museums = mtabs.join();
    }
    var theMuseums = museums.split(",");
    theMuseums.forEach(function(item) {
      console.log('museum=' + item.toLowerCase());
      var i = mtabs.indexOf(item.toLowerCase());
      console.log('index=' + i + ' title=' + mtitles[i]); 
    });

    var url = 'https://docs.google.com/spreadsheets/u/0/d/'
    + file_id + '/gviz/tq?sheet=' + sheet + '&tqx=out:json&headers=1&tq=' + 
    escape("SELECT A, B, C, D, E WHERE C != 'Yes'");
    var spreadSheetLink = 'https://docs.google.com/spreadsheets/d/' + file_id + '/edit';
    var faqlist = get_spreadsheet(url);
    console.log(url);
    // Test for some error conditions 
    if(faqlist.length == 0) {
        $('.faq_container').append('<br>Ooops.. unable to read spreadsheet</br>' +
          '<p>url=' + url);
        return;
    }
    if(theMuseums.length == 0) {
        $('.faq_container').append('<br>Ooops.. No lists name provided</br>');
        return;
    }

    // Loop for each tab 
    var faqs = faqlist.table.rows;
    theMuseums.forEach(function(item, key) {
      var i = mtabs.indexOf(item.toLowerCase());
      if (i) {
        var val = item;
        // camelcase css tag for background
        var background = 'color' + item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
        if (item.length>1) { val = mtitles[i];}
        tabLinks = tabLinks + '<li class="' + background + '"><a href="#tabs-' + +(key+1) + '">' + val + '</a></li>\n'; 
        var lookfor = item.toLowerCase();
        
        // Loop for the questions/answers in each tab 
        out = out + '<div id="tabs-' + +(key+1) + '">\n<div class="accordian">\n'; 
        faqs.forEach(function(item2, key2) {
          if (item2.c[listCol] != null && item2.c[listCol].v.toLowerCase() == lookfor) {
            out = out + '<h3 class="' + background + '">' + item2.c[questionCol].v + '</h3><div>\n';
            out = out + '<p>' + item2.c[answerCol].v + '</p></div>\n';
          }
        });
        out = out + '</div>\n</div>\n';
      }

      });
      
      out = '<div id="tabs"><ul>' + tabLinks + '</ul>' + out + '</div></div>\n';

      $(out).appendTo('.faq_container');

      // Initialize the accordian styles
      $( ".accordian" ).accordion({
        collapsible: true, active : activeli,
        heightStyle: "content"
      });

      // Display the faqs
      $( "#tabs" ).tabs();

}

/* ----------------------------------------------------------- */
/* Team Boxes                                                  */
/*    04/11/2021 - initial                                     */
/* ----------------------------------------------------------- */ 

function teamCardResize() {
  var fontsize = parseInt($('.item_bio').css('font-size'));
  var height = parseInt($('div.team_container div.item_box div.item_back').css('height'));
  var padding = parseInt($('div.team_container div.item_box div.item_back div.item_bio').css('padding-top'));
  height = height - (padding * 2); // allow for padding top and bottom
  var lineheight = fontsize * 1.2;
  var lines = parseInt(height / lineheight);
  //alert(padding + " " + fontsize + ' ' + height + ' ' + lineheight + ' ' + lines); 
  $('div.team_container div.item_box div.item_bio').css("-webkit-line-clamp", lines.toString());
  $('div.team_container div.item_box').css("line-height", lineheight + 'px');
}

function do_team_members2(file_id = null, sheet = null) {

    var firstCol = 0;
    var lastCol = 1;
    var orgCol = 2;
    var groupCol = 3;
    var titleCol = 4;
    var hideCol = 5;
    var imageCol = 6;
    var bioCol = 7;
    var linkCol = 8;
     
    if (!file_id) {
      file_id = '1hiPd3cJMf_JOr3Z4RnR3XA6-Z927OSJhxJJgYXix448';
    }
    if (!sheet) {
      var sheet = 'Members';
    }

    var url = 'https://docs.google.com/spreadsheets/u/0/d/'
    + file_id + '/gviz/tq?sheet=' + sheet + '&tqx=out:json&headers=1&tq=' + escape("SELECT A, B, C, D, E, F, G, H, I WHERE F = 'No' ORDER BY B, A");

    var teamlist = get_spreadsheet(url);
    console.log(teamlist);
    if(teamlist.length == 0) {
        $('.team_container').append('<br>Ooops.. unable to read spreadsheet</br>');
        return;
    }
    var out = ''; 
    var teams = teamlist.table.rows;
    var prevgroup = ''; 
    teams.forEach(function(item, key) {
        if (item.c[groupCol] != null) { // ignore blank lines
            if (prevgroup != item.c[groupCol] || prevgroup == '') {
              prevgroup = item.c[groupCol].v;
            }
            out = out + '<div class="item_box">';
            out = out + '<div class="item_front">';
            if (item.c[imageCol] != null) {
              //var imgsrc = 'https://drive.google.com/uc?export=view&id=1VxokDflhs9p1sIYDYBX7HertCAcP4887'; 
              out = out + '<img class="item_img" src="' + item.c[imageCol].v + '" alt="Example image">';
            }
            if (item.c[lastCol] != null && item.c[firstCol] != null) {
              out = out + '<div class="item_name">' + 
                item.c[firstCol].v + ' ' + item.c[lastCol].v;
              if (item.c[titleCol] != null) {
                out = out + '<div class="item_title">' + item.c[titleCol].v + '</div>';
              }
              out = out + '</div>';
            }
            out = out + '</div>'; // end front
            out = out + '<div class="item_back">';
            var biotext = 'No bio';
            if (item.c[bioCol] != null) {
              biotext = item.c[bioCol].v; }
            out = out + '<div class="item_bio">' + biotext + '</div>';
            out = out + '</div>'; // end back
          out = out + '</div>';     
        }
    })
    $('.team_container').append(out); 
    teamCardResize();
    $( window ).resize(function() {
      teamCardResize();
    });
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
  console.log('getting:' + url);
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

function do_donor_wall_new(file_id = null, sheet = null) {

    var colMin = 0;
    var colDonor = 1;
    var colDonors = 2;
    var colEndowment = 3;
    var colRecent = 4; 
    var footone = '';
    var foottwo = ''; 
    var notes = ''; 

    if (!file_id) {
      file_id = '1Euo2kWx3lMC60XIAE7oUgXjEjoXkktFU3cW3YpZKLKw';
    }
    if (!sheet) {
      var sheet = 'DonorWall';
    }

    var spreadSheetLink = 'https://docs.google.com/spreadsheets/d/' + file_id + '/edit';

    var url = 'https://docs.google.com/spreadsheets/u/0/d/'
    + file_id + '/gviz/tq?sheet=' + sheet + '&tqx=out:json&headers=1&tq=' 
    + escape('SELECT A, B, C, D, E ORDER BY A DESC');
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
/* slick.js carousel                                                   */
/* ------------------------------------------------------------------- */

function createCarousel (id, container = 0) {

    var x = $(id).closest('section').find('div.summary-item-list-container').eq(container);

    var temp = '<div class="slickButtons">\n' +
        '<button class="prev slick-arrow"> < </button>\n' +
        '<button class="next slick-arrow"> > </button>\n' +
        '</div>\n' +
        '<div class="theCarousel"></div>\n';
    $(temp).appendTo(id); 

    var theCarousel = $(id).find('.theCarousel');

    $(x).find('.summary-item').each(function(index) {
        var src = $(this).find('.summary-thumbnail img').data('src');
        var title = $(this).find('.summary-title a').text();
        var titlehref = $(this).find('.summary-title a').attr('href');
        var excerpt = $(this).find('.summary-excerpt').text();
        var read = $(this).find('.summary-read-more-link').text();
        var readhref = $(this).find('.summary-read-more-link').attr('href');
        var temp = '<div class="item">\n' + 
        '<img src="' + src + '">\n' +
        '<div class="title"><a href="' + titlehref + '">' + title + '</a></div>\n' +
        '<div class="classcontent">' + excerpt + '</div>\n' + 
        '<div class="readmore"><a href="' + readhref + '">' + read + '</a></div>\n' +
        '</div>';
        $(temp).appendTo(theCarousel);
        $(x).remove();
    })
   
    $(theCarousel).slick({
        dots: true,
        adaptiveHeight: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        arrows: true,
      prevArrow: $(id + ' .prev'),
    nextArrow: $(id + ' .next'),
        
        responsive: [{
            breakpoint: 500,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            }},
            {
            breakpoint: 800,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            }
        }]
    });
    var w = $(theCarousel).find('div.item img').eq(0).width();
    //$(theCarousel).find('div.item img').css('height','150px');

}

/* ----------------------------------------------------------- */
/* Build a tabbed list of calendars from spreadsheet           */
/*    05/18/2021 - initial                                     */
/* ----------------------------------------------------------- */

function build_calendars(
  active = 0, 
  file_id = '1i5EjZCpxI4UnvXyMYXCLyLP9tSCNt0PZYemaU6f6XtU', 
  sheet = 'Calendars') {

  var where = "SELECT B, C, E, F, G WHERE D != 'Yes' AND B IS NOT NULL ORDER BY A, B";
  var url = 'https://docs.google.com/spreadsheets/u/0/d/'
    + file_id + '/gviz/tq?tqx=&sheet=' + sheet + 
    '&headers=1&tq=' + escape(where);
  var callist = get_spreadsheet(url);
  var cals = callist.table.rows;
  var tab = 1; 
  var tabs = ''; 
  var tabsdata = '';
  var iframes = []; 
  cals.forEach(function(item, key) {
    var museum = (item.c[0] != null) ? item.c[0].v : '';
    var name = (item.c[1] != null) ? item.c[1].v : '';
    var title = (item.c[2] != null) ? item.c[2].v : '';
    var large = (item.c[3] != null) ? item.c[3].v : '';
    var small = large.replace(/mode=MONTH/gi,'mode=AGENDA');
    var after = (item.c[4] != null && item.c[4].v != null) ? item.c[4].v : ''; 
    var colorClass = "color" + museum.charAt(0).toUpperCase() + museum.slice(1);
    var ar = [large,small];
    iframes.push(ar);
    if ((tab - 1) != active) {
      large = '';
      small = '';
    }
    tabs = tabs + 
      '<li><a href="#tabs-' + tab + '" data-tab="' + tab + '" class="' + colorClass + '">' + 
      name + '</a></li>\n';
      tabsdata = tabsdata + 
      '<div id="tabs-' + tab + '">\n' +
      '<p><strong>' + title + '</strong>\n' + 
      '<div class="calendarLarge">' + large + '</div>\n' +
      '<div class="calendarSmall">' + small + '</div>\n' +
      '</p>' + 
      after +
      '</div>\n'; 
    tab = tab + 1; 
  })   
  tabs = '<div id="tabs"><ul>' + tabs + '</ul></div>\n'; 
  $(tabs).appendTo('#calendarsContainer');
  $(tabsdata).appendTo('#tabs');
  $( "#tabs" ).tabs({ active: active});
  $('#calendarsContainer iframe').width('100%');
  $('#tabs a').click(function() {
    var id = $(this).attr("href");
    var tab = id.substr(6) - 1;
    var x = $(id).find('.calendarLarge iframe').length;
    if (!x) {  // if no iframe found, then fill it in
      $(id).find('.calendarLarge').html(iframes[tab][0]);
      $(id).find('.calendarSmall').html(iframes[tab][1]);
      $('#calendarsContainer iframe').width('100%');
    }
  })
}