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
/* Check to see if this browser supports flexbox gap propert   */
/* See: https://ishadeed.com/article/flexbox-gap/              */
/*    09/04/2021 - initial                                     */
/* ----------------------------------------------------------- */

function checkFlexGap() {
  // create flex container with row-gap set
  var flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  // create two, elements inside it
  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  // append to the DOM (needed to obtain scrollHeight)
  document.body.appendChild(flex);
  var isSupported = flex.scrollHeight === 1; // flex container should be 1px high from the row-gap
  flex.parentNode.removeChild(flex);

  return isSupported;
}

$(document).ready(function() {
  if (checkFlexGap()) {$('body').addClass('flex-gap');}
})

function getCookie(name) {
    
  // Split cookie string and get all individual name=value pairs in an array
  var cookieArr = document.cookie.split(";");
  // Loop through the array elements
  for(var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");
      
      /* Removing whitespace at the beginning of the cookie name
      and compare it with the given string */
      if(name == cookiePair[0].trim()) {
          // Decode the cookie value and return
          return decodeURIComponent(cookiePair[1]);
      }
  }
  // Return null if not found
  return null;
}

function getCachedSheet(name,url) {
  var useName = name + "Unity";
  var theCookie = getCookie(useName);
  var data = sessionStorage.getItem(useName)
  if (theCookie && data != null) { // cookie still alive
    var temp = JSON.parse(data); 
    return temp;
  }
  else {
    var retlist = get_spreadsheet(url);
    sessionStorage.setItem(useName,JSON.stringify(retlist));
    document.cookie = useName + "=cookieValue; max-age=" + 5*60 + "; path=/;";
    return retlist; 
  }
}

/* ----------------------------------------------------------- */
/* Process the ajax request to get spreadsheet data            */
/*    04/10/2021 - initial                                     */
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
/*
var icons = [
'https://static1.squarespace.com/static/5f73ca8db43a982332ef42a7/60316dbd7dd52d12ad920e7f/605f4857363da23de8d99653/1616857176038/aahom.png?format=2500w',
'https://static1.squarespace.com/static/5f73ca8db43a982332ef42a7/60316dbd7dd52d12ad920e7f/605f48565689961a0425d469/1616857174314/lsnc.png',
'https://static1.squarespace.com/static/5f73ca8db43a982332ef42a7/60316dbd7dd52d12ad920e7f/605f485760b0890b8760c9d1/1616857176070/yam.png',
'https://static1.squarespace.com/static/5f73ca8db43a982332ef42a7/t/6091ade1fd0aad2861dda465/1620159977712/SC4+Challenger+Learning+Center+logo_150x271.png'
];
*/
/* updated 6/3/21 with Ari's new image */
var icons = [
'https://images.squarespace-cdn.com/content/v1/5f73ca8db43a982332ef42a7/e7aeba34-467f-40cf-8056-3fba38fd490a/ke17ZwdGBToddI8pDm48kBkSiM__EzOQIDgmzlPq1lAUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcHu3Ya3GWyjn2T6Pyc7Qz5bVN2MLWeLldKxJgMp5MiZ5EAsHAx8kgg2xyUEBRqgnS/AAHOM+1200+x+480+Transparency.png?format=300w',
'https://images.squarespace-cdn.com/content/v1/5f73ca8db43a982332ef42a7/2c40ddd6-3359-4061-a531-43ff65632a6c/ke17ZwdGBToddI8pDm48kBkSiM__EzOQIDgmzlPq1lAUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcHu3Ya3GWyjn2T6Pyc7Qz5bVN2MLWeLldKxJgMp5MiZ5EAsHAx8kgg2xyUEBRqgnS/LSNC+1200+x+480+Transparency.png?format=300w',
'https://images.squarespace-cdn.com/content/v1/5f73ca8db43a982332ef42a7/20c32031-135c-435b-a9b0-4c45bc0acbf0/ke17ZwdGBToddI8pDm48kBkSiM__EzOQIDgmzlPq1lAUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcHu3Ya3GWyjn2T6Pyc7Qz5bVN2MLWeLldKxJgMp5MiZ5EAsHAx8kgg2xyUEBRqgnS/YAM+1200+x+480+Transparency.png?format=300w',
'https://images.squarespace-cdn.com/content/v1/5f73ca8db43a982332ef42a7/3419d464-2d84-4a93-bd05-d877700324df/ke17ZwdGBToddI8pDm48kBkSiM__EzOQIDgmzlPq1lAUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcHu3Ya3GWyjn2T6Pyc7Qz5bVN2MLWeLldKxJgMp5MiZ5EAsHAx8kgg2xyUEBRqgnS/Challenger+1200+x+480+Transparency.png?format=300w'
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

  var isEditor = window.frameElement ? true : false;
  //  && isEditor === false
  // was if (sticky && isEditor === false) {
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
      if (item.c[i] != null) { 
        var src = item.c[i].v;
        if (src.indexOf('images.squarespace-cdn.com')) {
          var temp = src.split('?');
          var src = temp[0] + '?format=300w';
        }
        images.push(src); 
      }
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

function showAddressInfo(
  museum = null,
  file_id = '1eBU2TqbjAT0-PUkKVa0J9obsoyIBJ7ib_KJMQLNym8Y', 
  sheet = 'Hours') {

  museum = museum.toLowerCase();
  var qry = "SELECT *  WHERE A = '" + museum + "' ORDER BY A, B";
  var url = 'https://docs.google.com/spreadsheets/u/0/d/'
    + file_id + '/gviz/tq?tqx=out:json&sheet=' + sheet + 
    '&headers=1&tq=' + escape(qry);
   // alert(url);
  var colorClass = "museum" + museum.charAt(0).toUpperCase() + museum.slice(1);
  $('#hoursContainer').html(out).addClass(colorClass); 

  var addlist = getCachedSheet('hours',url); 
  var adds = addlist.table.rows;
  var out = '<p>No data found</p>'; 
  for (i = 0; i < adds.length; i++) {
    if (adds[i] && adds[i].c[0] != null && adds[i].c[0].v == museum) {
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
    }
  }
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
      'challenger',
      'camp'];
    var mtitles = [
      'Unity in Learning','Ann Arbor Hands-On Museum',
      'Leslie Science & Nature Center','Yankee Air Museum',
      'Challenger Learning Center at SC4',
      'Summer Camps'];

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

  //if ($('.team_container').is(':hidden') == true) { return;};
  var fontsize = parseInt($('.item_bio').css('font-size'));
  var height = parseInt($('div.team_container div.item_box div.item_back').css('height'));
  var padding = parseInt($('div.team_container div.item_box div.item_back div.item_bio').css('padding-top'));
  height = height - (padding * 2); // allow for padding top and bottom
  var lineheight = fontsize * 1.2;
  var lines = parseInt(height / lineheight);
  //alert(padding + " " + fontsize + ' ' + height + ' ' + lineheight + ' ' + lines); 
  $('div.team_container div.item_box div.item_bio').css("-webkit-line-clamp", lines.toString());
  $('div.team_container div.item_box div.item_bio').data("lines", lines.toString());
  $('div.team_container div.item_box').css("line-height", lineheight + 'px');

  var teams = $('.team_container .item_back');
  teams.each(function(index) {
    temp = $(this).find('.item_bio');
    $(this).find('.readMoreDetails').hide(); 
    var dataLines = temp.data("lines");
    var client = temp.prop('clientHeight');
    var beforeh = parseInt(temp.height());
    var lineh = parseInt(temp.css('line-height'));
    var lines = dataLines;
    temp.css('-webkit-box-orient','unset');
    temp.css('-webkit-line-clamp','unset');
    temp.css('overflow','unset');
    var afterh = parseInt(temp.height());
    console.log('beforeh=' + beforeh + ' afterh=' + afterh);
    if (afterh > beforeh) {
        console.log('client=' + client + ' datalines=' + dataLines + ' before=' + beforeh + ' after=' + afterh + ' lines=' + lines);
        lines = lines - 2; 
        $(this).find('.readMoreDetails').show(); 
    }
    temp.css('-webkit-line-clamp',lines.toString());
    temp.css('-webkit-box-orient','vertical');  
    temp.css('overflow','hidden');
         
  })
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
    var position = $(window).scrollTop(); 

    var topmost = $('section.page-section').eq(1).offset().top;
     
    if (!file_id) {
      file_id = '1hiPd3cJMf_JOr3Z4RnR3XA6-Z927OSJhxJJgYXix448';
    }
    if (!sheet) {
      var sheet = 'Members';
    }

    var url = 'https://docs.google.com/spreadsheets/u/0/d/'
    + file_id + '/gviz/tq?sheet=' + sheet + '&tqx=out:json&headers=1&tq=' + escape("SELECT A, B, C, D, E, F, G, H, I WHERE F = 'No' ORDER BY B, A");

    var teamlist = get_spreadsheet(url);
    if(teamlist.length == 0) {
        $('.team_container').append('<br>Ooops.. unable to read spreadsheet</br>');
        return;
    }
    var out = ''; 
    var teams = teamlist.table.rows;
    var prevgroup = '';
    $('<div id="teamDetail"></div>').insertBefore('.team_container')
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
            out = out + '<button class="readMoreDetails"><i class="arrow"></i></button>';
            out = out + '</div>'; // end back
          out = out + '</div>';     
        }
    })
    $('.team_container').append(out); 
    teamCardResize();
    $( window ).resize(function() {
      teamCardResize();
    });
    $('#teamDetail').hide(); 
    $('.team_container').show();
    teamCardResize();
/*
    $('.readMoreDetails').on('click',function() {
        var content = $(this).parent().find('.item_bio').html(); 
        var front = $(this).parent().parent();
        var img = front.find('img').attr('src'); 
        var name = front.find('.item_name').clone().children().remove().end().text();
        var title = front.find('.item_title').text();
        $('#teamDetail').html('<div id="teamName">' + name + '</div>' +
          '<div id="teamTitle">' + title + '</div>');
        $('#teamDetail').append('<img class="item_img" src="' + img + '">');
        $('#teamDetail').append(content); 
        $('#teamDetail').append('<div class="teamDetailClose topClose"><a href="#">X</a></div>');
        $('#teamDetail').append('<div class="teamDetailClose bottomClose"><a href="#">Close</a></div>');
        
        position = $(window).scrollTop(); 
        $(".teamDetailClose").on('click',function(event) {
            event.preventDefault();
            $('#teamDetail').hide(); 
            $('.team_container').show();
            //var headerHeight = $('#header').height();
            //var t = 797 + headerHeight;
            //$('.team_container').scrollTop(t);
            $(window).scrollTop(position); 
            teamCardResize();
        });
        $('#teamDetail').show(); 
        $('.team_container').hide();
        var headerHeight = $('#header').height();
        var t = $('#teamDetail').closest('section').offset().top;
        t = t - headerHeight + 20;
        $(window).scrollTop(t); 
    });
*/

    $('div.item_back').on('click',function() {
        var content = $(this).find('.item_bio').html(); 
        var front = $(this).parent();
        var img = front.find('img').attr('src'); 
        var name = front.find('.item_name').clone().children().remove().end().text();
        var title = front.find('.item_title').text();
        $('#teamDetail').html('<div id="teamName">' + name + '</div>' +
          '<div id="teamTitle">' + title + '</div>');
        if (img) {
            $('#teamDetail').append('<img class="item_img" src="' + img + '">');
        }
        $('#teamDetail').append(content); 
        $('#teamDetail').append('<div class="teamDetailClose topClose"><a href="#">X</a></div>');
        $('#teamDetail').append('<div class="teamDetailClose bottomClose"><a href="#">Close</a></div>');
        
        position = $(window).scrollTop(); 
        $(".teamDetailClose").on('click',function(event) {
            event.preventDefault();
            $('#teamDetail').hide(); 
            $('.team_container').show();
            //var headerHeight = $('#header').height();
            //var t = 797 + headerHeight;
            //$('.team_container').scrollTop(t);
            $(window).scrollTop(position); 
            teamCardResize();
        });
        $('#teamDetail').show(); 
        $('.team_container').hide();
        var headerHeight = $('#header').height();
        var t = $('#teamDetail').closest('section').offset().top;
        t = t - headerHeight + 20;
        $(window).scrollTop(t); 
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

/* Resize carousel images with screen size to keep aspect ratio right */


function adjustSlickImageHeight() {
  var aspect_ratio_box2 = 0.6
  var box2 = jQuery("div.slick-list div.slick-track div.item img");
  var w = box2.width();
  var h = w * aspect_ratio_box2;
  var topval = (h / 2) - 25;
  jQuery('button.slick-arrow').css('top',topval + 'px');
  box2.height(h);
}

jQuery(window).resize(function() {
  adjustSlickImageHeight(); 
});


function showAnnouncements(
  museum = null,
  file_id = '1oFRM_HEIcPjLWlyC3QuL_QN67L8kTVujfdG4S3-14X0', 
  sheet = 'Announce') {

  museum = museum.toLowerCase();
  var url = 'https://docs.google.com/spreadsheets/u/0/d/'
    + file_id + '/gviz/tq?tqx=out:json&sheet=' + sheet + 
    '&headers=1&tq=' + escape('SELECT * Where upper(E) != "YES" ORDER BY A, B');

  var addlist = get_spreadsheet(url);
  console.log(addlist);
  var adds = addlist.table.rows;
  var out = '<p>No data found</p>'; 
  var temp = '<div class="slickButtons">\n' +
        '<button class="prev slick-arrow"> < </button>\n' +
        '<button class="next slick-arrow"> > </button>\n' +
        '</div>\n' +
        '<div class="theCarousel">';
  $('#announceContainer').html(temp);
  for (i = 0; i < adds.length; i++) {
    console.log(adds[i]);
    
    var item = adds[i];  
    var namd = item.c[0].v;
    
    var titlehref = "#";
    var readhref = "#";
    var read = "Read more";
    var categories = (item.c[6] != null) ? item.c[6].v : '';
    var startdate = (item.c[2] != null) ? item.c[2].v : '1950-01-01'; // default start
    var enddate = (item.c[3] != null) ? item.c[3].v : '2099-01-01'; // default end
    var title = (item.c[1] != null) ? item.c[1].v : 'unknown';
    var excerpt = (item.c[7] != null) ? item.c[7].v : 'unknown';
    var link = (item.c[8] != null) ? item.c[8].v : 'unknown';
    var src = (item.c[9] != null) ? item.c[9].v + "?format=300w" : 'unknown';

    // valid formats are original, 1500w, 1000w, 750w, 500w, 300w, 100w

    if (src.indexOf('images.squarespace-cdn.com')) {
      var temp = src.split('?');
      var src = temp[0] + '?format=300w';
    }
  
    var today = new Date();
    var startcompare = new Date(startdate);
    var endcompare = new Date(enddate);
    
    if (today > startcompare && today < endcompare ) {
      var temp = '<div class="item">\n' + 
      '<img src="' + src + '">\n' +
      '<div class="title"><a href="' + link + '">' + title + '</a></div>\n' +
      '<div class="classcontent">' + excerpt + '</div>\n' + 
      '<div class="readmore"><a href="' + link + '">' + read + '</a></div>\n' +
      '</div>';
      $(temp).appendTo('#announceContainer .theCarousel'); 
    }
       
}
  
$('.theCarousel').slick({
    dots: true,
    adaptiveHeight: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: true,
  prevArrow: $('#announceContainer' + ' .prev'),
  nextArrow: $('#announceContainer' + ' .next'),
    
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

}

/* ------------------------------------------------------------------- */
/* slick.js carousel                                                   */
/*    Build a slick carousel based on an existing summary block        */
/*    Copy all items to slick structure and remove the original block  */
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

    adjustSlickImageHeight(); 

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

/* ----------------------------------------------------------- */
/* Sub Menu Bar                                                */
/*    05/18/2021 - initial                                     */
/* ----------------------------------------------------------- */

function subMenuBar(act = '', sel = '#subMenu') {

  var menu = 
  '<div class="subMenuBar">\n' +
  '<nav>\n' +
  '   <a href="#" class="headerName">For Families and Indiviuals</a>\n' +
  '   <a name="adventure" href="choose-your-adventure">Choose Adventure</a>\n' +
  '   <a name="birthdays" href="/birthday-parties">Birthdays Parties</a>\n' +
  '   <a name="camp" href="/camps">Pick your Camp</a>\n' +
  '</nav>\n' +
  '<nav>\n' +
  '   <a href="#" class="headerName">For Schools and Organizations</a>\n' +
  '   <a name="outreach" href="/outreach">Outreach</a>\n' +
  '   <a name="field" href="/field-trips">Field Trips</a>\n' +
  '   <a name="distance" href="/distance-learning">Distance Learning</a>\n' +
  '</nav>\n' +
'</div>\n';

  // add the menu code
  $(menu).appendTo('#subMenu');
  // Set the appropriate active 
  $(sel).find('.subMenuBar a[name="' + act + '"]').addClass('active');
  var temp = '<div class="learnMenuButton">' +
    '<div class="toggle">' +
    '<a href=""></i>- More Opportunities -</a></div></div>';
  $(temp).insertBefore('#subMenu');
  $('.learnMenuButton .toggle a').click(function(e) {
    e.preventDefault(); 
    $('#subMenu').toggleClass("open")
  })
return menu; 
}

/*-------------------------------------------------------------*/
/* Add filter radio/checkboxes                                 */
/*    07/03/2021 - initial                                     */
/*-------------------------------------------------------------*/

/* Usage

parameter 1 (groups): group<:[radio|checkbox]><:[default]>
parameter 2 (selector): ie. '#filtercontainer'
parameter 3 (file_id): Google docs file id 
parameter 4 (sheet name): Google docs spreadsheet sheet name

Example:

$( document ).ready(function() {
    showFilterSelections('locations:radio:leslie, groups:checkbox:4th');
});
<div id="container">
  <div id="filterContainer"></div>
</div>

*/

/* This is the selector that we will use to find all of the category items
   within the current SquareSpace page section. */

var catloc =  'div.summary-content ' + 
    'div.summary-metadata-container ' + 
    'div.summary-metadata ' + 
    'span.summary-metadata-item--cats a';

var mygroups = [];   // Groups 
var mygroupids = []; // Nested array of blog item index ids
var mycats = [];     // List of found categories 
var mycatsids = [];  // Nested array list of found items by category

function filter_values (selector = '#filterContainer') {

    // Find all of the categories in this section 
    var catsel = $(selector).parent().parent().next().find(catloc);
    $(selector).closest('section').addClass('filterValuesSection');

    // tag them all
    $(catsel).addClass('filterCat');

    // initialize based on current checkboxes
    filter_showvals();

    // Process selection when a radio or checkbox is changes 
    $(selector + ' input[type=checkbox], ' +
      selector + ' input[type=radio]')
      .on('change', function(e) {
        filter_showvals(selector);
    })
}

/* here we find the intersection of two arrays */
function intersection(first, second)
{
    first = new Set(first);
    second = new Set(second);
    return [...first].filter(item => second.has(item));
}

function filter_showvals (selector = '#filterContainer') {

    // get an array of checked items
    var ids = [];
    var xidsx = [];
    mygroups = [];
    mygroupids = [];
    selectedcats = [];  
    $(selector + ' input[type=checkbox]:checked, ' +
        selector + ' input[type=radio]:checked')
        .each(function() {
          if(this.value) {
            ids.push(this.value);
            var group = $(this).attr('name');
            var cat = this.value;
            cat = cat.replace("&", "%26");
            selectedcats.push(cat);
            i = mycats.indexOf(cat);
            if (i != -1) {
              var x = mygroups.indexOf(group);
              if (x == -1) {
                  mygroups.push(group);
                  mygroupids.push(mycatsids[i]);
              }  
              else {
                  var newids = mygroupids[x].concat(mycatsids[i]);
                  mygroupids[x] = newids;
              }
              console.log('found ' + cat + ' in ' + group + ' found in ' + mycatsids[i]); 
            }
            else {
              var x = mygroups.indexOf(group);
              if (x == -1) {
                  mygroups.push(group);
                  mygroupids.push([999]);
              }  
              else {
                  var newids = mygroupids[x].concat([999]);
                  mygroupids[x] = newids;
              }
              console.log('oops. all done1');
            }
          }
          //else {
          //  console.log('oops. all done2');
          //}
        
    });
    console.log('mygroups ' + mygroups.length);
    console.log(mygroups);
    console.log('mygroupids ' + mygroupids.length);
    console.log(mygroupids);

    var catsel = $(selector).parent().parent().next();
    var allcats = $(catsel).find('div.summary-item').css('display','block');
    console.log('allcats.length=' + allcats.length); 

    var common = [];
    if (mygroups.length > 0) {
      $(allcats).css('display','none')
      common = mygroupids[0];
      for (n = 1; n < mygroups.length; n++) {
        common = intersection(common, mygroupids[n]);
      }
      console.log("Common elements are: " + common);
    }
    console.log('type=' + typeof common + ' length=' + common.length);
    for (n = 0; n < common.length; n++) {
        $(allcats).eq(common[n]).css('display','block');
    }

    var catsel = $(selector).parent().parent().next();
    $(catsel).find('a.active').removeClass('active');
    $(catsel).find('div.summary-item').each(function(index, value) {
        $(this).find(catloc).filter(function (index2) {
            var t = this.href.indexOf('?category=');
            var code = this.href.substr(t+10).toLowerCase();
              if (selectedcats.indexOf(code) != -1) {
                $(this).addClass('active');   
              }
           
        })
        
    });

}  
/* Get the category groups and items from the spreadsheet
   then build radio and/or checkboxes based on requested groups
*/

 function showFilterSelections(

  groups = 'locations, groups', selector = "#filterContainer",
  file_id = '1qrUPQu2qs8eOOi-yZwvzOuGseDFjkvj5_mSnoz0tJVc', 
  sheet = 'Categories') {

  var where = "SELECT A,B,C,D,E WHERE E != 'Yes' AND A IS NOT NULL ORDER BY A,B";
  var url = 'https://docs.google.com/spreadsheets/u/0/d/'
    + file_id + '/gviz/tq?tqx=out:json&sheet=' + sheet + 
    '&headers=1&tq=' + escape(where);
  //console.log(url);
  var catlist = get_spreadsheet(url); 
  var cats = catlist.table.rows;
  allgroups = groups.split(',');

  // Get a list of the found categories and nested list of 
  // the div index's that the categorie are found on
  // Needed later for AND/OR filtering 
  var catsel = $(selector).parent().parent().next();
  $(catsel).find('div.summary-item').each(function(index, value) {
        $(this).find(catloc).filter(function (index2) {
            var t = this.href.indexOf('?category=');
            var cat = this.href.substr(t+10).toLowerCase(); 
            var i = mycats.indexOf(cat);
            if (i == -1) {
                mycats.push(cat);
                mycatsids.push([index]);
                console.log('index=' + index + ' cat=' + cat);
            }  
            else {
                if (mycatsids[i].indexOf(index) == -1) {
                    mycatsids[i].push(index);
                }
            }
        })     
    });
  console.log('mycats=' + mycats);
  console.log('mycatsids=' + mycatsids);  

  var out = '<div class="flexBox">\n';
  for (i = 0; i < allgroups.length; i++) { 
    var group = allgroups[i].trim().toLowerCase();
    var labels = allgroups[i].split(':');
    var type = 'checkbox'; // default
    var temp = group.split(':');
    var validtypes = ['radio','checkbox'];
    if (temp.length > 1) {
      group = temp[0];
      if (validtypes.indexOf(temp[1]) > -1) {
        type = temp[1];
      }
    }
    var defaultvalue = '';
    if (temp.length > 2) {
      defaultvalue = temp[2].toLowerCase().replaceAll(' ','+');
    } 
    group = group.toLowerCase();
    groupparts = group.split('/');
    group = groupparts[0];
    grouplabel = (groupparts[1]) ? groupparts[1] : group;
    
    var prettyname = grouplabel.charAt(0).toUpperCase() + grouplabel.slice(1); 
    if (labels.length > 2 && typeof(labels[2]) != 'undefined') {
      prettyname = labels[2];
    }
    out = out + '<div class="filterGroup">\n';
    out = out + '<span>' + prettyname + '</span><table class="outer">\n';
    var colorClass = "group" + group.charAt(0).toUpperCase() + group.slice(1);
    var numcols = 1;
    if (group == 'grades') {
      numcols = 2;
    }
    numcols = (groupparts[2]) ? groupparts[2] : numcols;
    var curcol = 0;
    var tr = '<tr>';
    if (type == 'radio') {
      if (defaultvalue == '') {checked = ' checked ';}
      out = out + tr + '<td><input type="' + type + '" value="" name="' + group + '"' + checked + '><span>Any</span></td>\n';
      curcol = curcol + 1; 
    }
    for (n = 0; n < cats.length; n++) {
      if (cats[n] && cats[n].c[0].v.toLowerCase() == group) {
        var item = cats[n];
        var lookup = item.c[2].v.toLowerCase().replaceAll(' ','+'); 
        // Only show category if it appears in at least one blog entry
        if (mycats.indexOf(lookup) !== -1) {
          curcol = curcol + 1;

          if (parseInt(curcol) > parseInt(1) && parseInt(curcol) <= parseInt(numcols)) {
            tr = ''; 
            
          }
          else {
            tr = '<tr>';
            curcol = 1;
          }
          if (curcol > numcols) { curcol = 1;}
          //var item = cats[n];
          var checked = '';
          var lookup = item.c[2].v.toLowerCase().replaceAll(' ','+'); 
          if (defaultvalue == lookup) {
            checked = ' checked '; 
          }

          out = out + tr + '<td><input type="' + type + '" value="' + lookup + '" name="' + group + '"' + checked + '><span>' + item.c[3].v + '</span></td>\n';  
        }   
      }
    }
    out = out + '</table></div>\n';
  }
  var out = out + '</div>\n'; 
  $(selector).html(out);
  filter_showvals(selector); 
  filter_values (selector);
  return; 

} 