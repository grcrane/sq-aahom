/* ------------------------------------------------------------------- */
/* Initialize Camp signup list                                         */
/* ------------------------------------------------------------------- */

var camptypes = ["envtykes","envk1", "env23", "env45","stem23","stem45"];
var monthnames = ["January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"];
var cells = new Array(7);
var week = '';
var data = ''; 
var heading = '';
var prevweek = ''; 
var startdate = ''; 
var enddate = '';
var slug = '';
var camptype = '';
var campage = '';
var campprice = '';
var camplink = '';
var campwait = '';
var camptitle = '';
var campexcerpt = '';
var ar = [];
var celindex = 0;

/* ------------------------------------------------------------------- */
/* Get data from Google Spreadsheet                                    */
/* ------------------------------------------------------------------- */

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

/* ------------------------------------------------------------------- */
/* Output a row in the table                                           */
/* ------------------------------------------------------------------- */

function outputRow(cells) {
	var str = '<tr>\n';
	var i;	        		
		str = str + "<td>" + prevweek + "</td>\n";
		str = str + "<td>" + startdate + "</td>\n";
		for (i = 0; i < 6; i++) {							
			if (cells[i] != null) {
				startdate = cells[i][1];
				camptitle = cells[i][9];
				if (cells[i][8] == 'Yes'){
					camptitle = camptitle +"<br><em>Join the waitlist!</em>";
				}
				camptitle = '<a href="#" class="tooltip" title="' + cells[i][10] + '">' + camptitle + "</a>";
			  	str = str + '<td class="' + cells[i][4] + '">' + camptitle + '</a></td>\n';
			}
			else {
				str = str + "<td>&nbsp;</td>\n";
				console.log("i=" + i +  " week=" + prevweek + " empty");
			}
		} 
		str = str + "</tr>\n"
		$('tbody').append(str);		
}

/* ------------------------------------------------------------------- */
/* Process the camp signup spreadsheet                                 */
/* ------------------------------------------------------------------- */

function do_camp_list(file_id) {

    var url = 'https://docs.google.com/spreadsheets/u/0/d/'
    + file_id + '/gviz/tq?tqx=&tq=' + escape('SELECT * WHERE A IS NOT NULL ORDER BY A, B, C');
    //alert(url);

    var camplist = get_spreadsheet(url);
    if(camplist.length == 0) {
        $('#campWall').append('<br>Ooops.. unable to read spreadsheet</br>');
        return;
    }
    console.log(camplist);
    var camps = camplist.table.rows;

    
    camps.forEach(function(item, key) {
        if (item.c[0] != null) {
        	week = item.c[0].v;
        	if (week != prevweek) {
        		if (prevweek) {     		
        			outputRow(cells);
				}
        		cells = new Array(7);
        		prevweek = week;
        		cellindex = 0; 
        	}
        	startdate = '';
        	enddate = '';
        	slug = '';
        	camptype = '';
        	campage = '';
        	campprice = '';
        	camplink = '';
        	campwait = '';
        	camptitle = '';
        	campexcerpt = '';
        	if (item.c[1] != null) { 
        		
        		var thedate = eval("new " + item.c[1].v);
        		var smonth = thedate.getMonth();
        		var sday = thedate.getDate();
        		startdate = monthnames[smonth] + " " + sday;
        		
        		var thedate = eval("new " + item.c[2].v);
        		var emonth = thedate.getMonth();
        		var eday = thedate.getDate();
        		enddate = monthnames[emonth] + " " + eday;
        		if (smonth == emonth) {
        			startdate = startdate + '-' + eday;
        		}
        		else {
        			startdate = startdate + " - " + enddate;
        		}
        	
        	}
        	if (item.c[2] != null) { enddate = item.c[2].v;}
        	if (item.c[3] != null) { slug = item.c[3].v;}
        	if (item.c[4] != null) { camptype = item.c[4].v;}
        	if (item.c[5] != null) { campage  = item.c[5].v;}
        	if (item.c[6] != null) { campprice  = item.c[6].v;}
        	if (item.c[7] != null) { camplink  = item.c[7].v;}
        	if (item.c[8] != null) { campwait  = item.c[8].v;}
        	if (item.c[9] != null) { camptitle  = item.c[9].v;}
        	if (item.c[10] != null) { campexcerpt  = item.c[10].v;}
        	var cellindex = camptypes.indexOf(camptype + campage);
        	ar = [week, startdate, enddate, slug, camptype, campage, 
        		campprice, camplink, campwait, camptitle, campexcerpt];
        	if (cellindex > -1) {
        		cells[cellindex] = ar;
        	}
        	else {
        		console.log('cellindex not found ' + camptype + campage);
        	}
        }
    })
    if (week) {
    	outputRow(cells);  // output last row	
	}
	var last = '<tr>\n' + 
	'<td colspan=8 class="cool">CAMP COOL DOWNB ! Offred from 3:30-5:30pm ' + 
	'every week</td></tr>\n';
	$('tbody').append(last);	

}