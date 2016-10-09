/*
  get data from Olando station  by ID
*/
/*\
NCDC token:
Token:  wmMlmMmIQoGYAXZfMBwaWPBmMNoeaElI
*/
/*
need to be done later:
change the center of map to Orlando disney world
add elevation service (do research on it)
graph view

bug:
There is a small window appear for the first marker.

*/
      //Location ID: CITY:US120028
   
   var washedData = [];
   function initMap(){
    var mapDiv = document.getElementById('map'); //Line 1: Save reference to div element where map would be shown
    var map = new google.maps.Map(mapDiv, {//Line 2: Create Map object passing element reference, center and zoom as parameters
        center: {lat: 40.4237, lng: -86.9212}, //This is Purdue University's Location
        zoom: 12});

    // create a marker of  Purdue University location 
    var marker = new google.maps.Marker({ //Line 1
        position: {lat: 40.4237, lng: -86.9212}, //Line2: Location to be highlighted
        map: map,//Line 3: Reference to map object
        title: 'Purdue University'   // when we hover over the marker, it will show to title.
    }); //Line 4: Title to be given
     
    // creat a infor window    // info window need to be tested 
    infowindow = new google.maps.InfoWindow({
               content: "This is Purdue University"
           });
    google.maps.event.addListener(marker, 'click', function() {
               infowindow.setContent("Purdue University");
               infowindow.open(map, marker);
           });

   

 
    //create a new httprequest for this session
    var xmlhttp = new XMLHttpRequest();
    //json format data resource url 
    //var url = "http://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&datatypeid=SNOW&locationid=ZIP:28801&startdate=2010-05-01&enddate=2010-05-01";
    // get all the stations (30) of orlando
    var url = "http://www.ncdc.noaa.gov/cdo-web/api/v2/stations?locationid=CITY:US120028";
    xmlhttp.open("GET", url, true);

    xmlhttp.setRequestHeader("Token", "wmMlmMmIQoGYAXZfMBwaWPBmMNoeaElI");
    //once the request is accepted, process the fowllowing function to get data and complete the app information
    xmlhttp.send();

    xmlhttp.onreadystatechange = function() {
       //debugger;
        
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
              //console.log(this.responseText);     
            var myArr = xmlhttp.responseText;
              var json= JSON.parse(myArr);
              //document.getElementById("weather").innerHTML = "Weather:  <em><b>" + json.results[0].name + "</b></em>";
        

          // add information
          for (var i= 0; i < 2 ; i++) {
              var dataline = [];
              // 0 for latitude
              dataline.push(json.results[i].latitude);
              // 1 for longitude
              dataline.push(json.results[i].longitude);
                // 2 for name
              dataline.push(json.results[i].name);
                // 3 for elevation
              dataline.push(json.results[i].elevation);

              washedData.push(dataline);
     
          }
          debugger;
         console.log(washedData[0][2]);

             // number of stations
          var numOfStations = washedData.length;
            
            // add marker on the map and add bounds for the markers.
            var markers = [];
            var bounds = new google.maps.LatLngBounds();
            for (var i= 0; i < numOfStations ; i++) {
                var latlng = new google.maps.LatLng(Number(washedData[i][0]), Number(washedData[i][1]));
                markers[i] = new google.maps.Marker({
                        position: latlng,
                        map: map,
                        title: washedData[i][2]
                        //icon: 'http://google-maps-icons.googlecode.com/files/red' + ('0' + key.toString()).slice(-2) + '.png'
                });
                
                // add infor window for the marker 
                var infowindow = new google.maps.InfoWindow({
                      content: washedData[i][2]
                });
                markers[i].addListener('mouseover', function() {  // sometime click event added on marker does not work
                       infowindow.open(map, markers[i]);
                       
                });
                
                // The below does not work.
                google.maps.event.addListener(markers[i], 'click', function() {
            
                       // fill infomation into submenu
                        //document.getElementById("station-name").innerHtml= "<b>station name : </b><em>" + washedData[i][2] + "</em>"; // it complain can not read propety of 2 of underdefined.
                       document.getElementById("station-name").innerHtml= "<b>station name : </b><em>" + washedData[i][2] + "</em>";
                       
                      document.getElementById("elevation").innerHtml= "<b>elevation: </b><em>" + washedData[i][3] + "</em>";
                });
                
               // add the marker into the bound
                bounds.extend(latlng);
            }  
            map.fitBounds(bounds);  // set the bound to the map or Sets the viewport to contain the given bounds.

      
            

    /*  
            google.maps.event.addListener(map, 'idle', function() {
              // Create an ElevationService
              elevator = new google.maps.ElevationService();
              $.each(markers, function(key, value)
              {
                  value.setMap(null);
               });   
            });


            // getting bounds of current location
            var boundBox = map.getBounds();
            var southWest = boundBox.getSouthWest();
            var northEast = boundBox.getNorthEast();
            var lngSpan = northEast.lng() - southWest.lng();
            var latSpan = northEast.lat() - southWest.lat();
            // adding 3 markers to the map at random locations
            var locations = [];
            for (var j = 0; j < numberOfStations; j++)
            {
                var location = new google.maps.LatLng(
                        southWest.lat() + latSpan * Math.random(),
                        southWest.lng() + lngSpan * Math.random()
                        );
                locations.push(location);
            }
            
            // Create a LocationElevationRequest object using the array's one value
            var positionalRequest = {
                'locations': locations
            };

            elevator.getElevationForLocations(positionalRequest, function(results, status)
            {
                if (status === google.maps.ElevationStatus.OK)
                {
                    //if the infowindow is open
                    var prev_infowindow =false;

                    $.each(results, function(key, value) {

                        //alert(key);
                        markers[key] = new google.maps.Marker({
                            position: {lat: Number(washedData[key][0]), lng: Number(washedData[key][1])},
                            map: map,
                            //icon: 'http://google-maps-icons.googlecode.com/files/red' + ('0' + key.toString()).slice(-2) + '.png'
                        });
                        google.maps.event.addListener(markers[key], 'click', function() {
                            //if another window is open, close it
                            if( prev_infowindow ) {
                                prev_infowindow.close();
                            }
                             infowindow.setContent(washedData[key][2]);
                             infowindow.open(map, markers[key]);
                                //set the menu information about the market
                            document.getElementById("station-name").innerHTML = "<b>Station Name</b>: " + washedData[key][2] + "</em>";
                        });
                    });
                }
            });  
     */         

        }
    };   


}

// window.onload = initmap; // we do not need this line since it has been added in call back of googl API link.