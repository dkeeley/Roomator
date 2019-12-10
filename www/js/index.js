/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        console.log("Device is ready");
        navigator.geolocation.getCurrentPosition(geoCallback, onError);
        
        //create the map
        map = new google.maps.Map(document.getElementById('map'),
            {
                zoom: 15,
                centre: Userlocation
            }
        );
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

// Variable that can be accessed by any function
var map;

// Current user location at login
var Userlocation;

// Updating the map, the function
// receives two parameters
function updateMap(lat, long){

    // The location is not hardcoded
    // it is going to be the value that we
    // get from outside the function
    var postion = {lat: lat, lng: long};
    var map = new google.maps.Map(document.getElementById('map'), 
        {  zoom: 15,
           center: postion
        }
    );

    var marker = new google.maps.Marker({
        position: postion,
        map: map
    });

}

// Getting the location from the GPS module
function getLocation(){
    navigator.geolocation.getCurrentPosition(geoCallback, onError);
}

// This is the function in charge of doing something 
// with the location once we have it
function geoCallback(position){
    console.log(position);
    
    Userlocation = {
        
        lat: position.coords.latitude,
        lng: position.coords.longitude
    }
    console.log(Userlocation);
    // Extracting especifically the lat and long
    //var lat = position.coords.latitude;
    //var long = position.coords.longitude;
    
    // Calling the function in charge of contacting
    // the external API
   // openCageApi(lat, long);

    // Calling the function to update the map
    // once we have our current location
    // Passing the coords into the function
    updateMap(Userlocation.lat, Userlocation.lng);

    // Printing to front end
    var textToDisplay = "Latitude: " + Userlocation.lat + " Longitude: " + Userlocation.lng;
    document.getElementById('pos').innerHTML = textToDisplay;

}

// Map function
function initMap(){

    // Hardcoding coordinates
  var cct = {lat: 53.346, lng: -6.2588};
  var map = new google.maps.Map(document.getElementById('map'), 
      {  zoom: 12,
         center: cct
      }
  );

    // Adding a marker
  var marker = new google.maps.Marker({
      position: cct,
      map: map
  });

    // Adding another marker
 // var anotherPosition = {lat: 53.3458, lng: -6.2575};
 // var marker2 = new google.maps.Marker({
 //     position: anotherPosition,
 //     map: map
 // });
    
}



// This function receives two parameters
function openCageApi(lat, long) {
   
    // The variable http is an instance of the class XMLHttpRequest
    // this is a library included in JS that helps with HTTP requests
    var http = new XMLHttpRequest();
    
    // The end point of the API
    const url = 'https://api.opencagedata.com/geocode/v1/json?q=' +lat+ '+ ${long}&key=a458a72b40c648a3a5235e172c7160d4';
    
    // Preparing the request
    http.open('GET', url);
    // Sending the request
    http.send();
    // The we obtain the response, then we can do something with it
    http.onreadystatechange = (e) => {
		// Getting the response in a text format
        var response = http.responseText;
		// converting the response from a text format to a json format
        var responseJSON = JSON.parse(response); 
        
        // printing both results to the console to compare
        console.log(responseJSON);
        console.log(response);
        
        // extracting one piece of information from the response
        var country = responseJSON.results[0].components.country;
        document.getElementById('pos').innerHTML = country;
    }
}

//function geoCallback(position){
    
    //console.log(position.coords.latitude);
    
   // var lat = position.coords.latitude;
   // var long = position.coords.longitude;
    
   // openCageApi
    
   // var textToDisplay = "latitude: " + lat + "longitude: " + long;
   // document.getElementById("pos").innerHTML = textToDisplay;
    
   // updateMap (lat, long);
//}

// Function to match potential roommates by comparing smoking status and age difference
function FillMapWithPotential(Matches) {
    var html = "";
    console.log("Potential Roommates: ");
    console.log(Matches);
    
    for (var i = 0; i<Matches.length; i++) {
        if ((Matches[i].smoker == Userloction[0].smoker) && ((Matches[i].age + 10) >= Userlocation[0].age) && ((Matches[i].age - 10) <= Userlocation[0].age)) {
            updateMap(Matches[i].currentlocation.latitude, Matches[i].currentlocation.longitude);
            
            html += '<div class="Potential"'
                + '<p class="PotentialName">' + Matches[i].username + '</p>'
                + '<p class="PotentialAge">' + Matches[i].age + '</p>'
                + '<p class="PotentialLatitude">' + Matches[i].currentlocation.latitude + '</p>'
                + '<p class="PotentialLongitude">' + Matches[i].currentlocation.longitude + '</p>'
                + '</div>'; 
        }
    }
    
    document.getElementById("matches").innerHTML = html;   
}

// Get the register
var register = document.getElementById('id01');

// When the user clicks anywhere outside of the register form, close it
window.onclick = function(event) {
  if (event.target == register) {
    register.style.display = "null";
  }
}

// Get the login
var login = document.getElementById('id02');

// When the user clicks anywhere outside of the login form, close it
window.onclick = function(event) {
    if (event.target == login) {
        login.style.display = "null";
    }
}

// onError function for map geolocation
function onError(msg){
    console.log(msg);
}

// Register function that has access to SendRegRequest on register form
function Register(){
    SendRegRequest();   
}

// Login function that has access to SendLogRequest on login form
function Login(){
    SendLogRequest();
}


// Function that returns potential roommates range with latitude and longitude
function FillMapWithPotential(range, currentlatitude, currentlongitude){
   
}

// Function to send a registration request
function SendRegRequest() {
    
    var url = "http://localhost:9090/registration";
    var http = new XMLHttpRequest();
    
    // Prepare the request
    http.open("POST", URL, true);
    http.setRequestHeader('Content-Type', 'application/json');
    
    // Send the request
   http.send(JSON.stringify({"name":document.getElementById("name").value
                              ,"email":document.getElementById("email").value
                              ,"password":document.getElementById("password").value
                              ,"smoker":document.getElementById("smoker").value 
                              ,"age":document.getElementById("age").value
                              ,"gpslat":Userlocation.lat
                              ,"gpslng":Userlocation.lng}));
    
    // Call the following when there is a response
    http.onreadystatechange = (e) => {
        
        // Response in text format
        var response = http.response;
        
        // Convert from a text to a JSON format
        try{
            var responseJSON = JSON.parse(response);
            //RegistrationCallback(responseJSON);
            console.log(responseJSON)
        }
        catch (err){
            console.log("Error" + err.message)
        }
    }
}

// Function to send a login request
function SendLogRequest() {
    
    var url = "http://localhost:9090/login";
    var http = new XMLHttpRequest();
    
    // Prepare the request
    http.open("POST", URL, true);
    http.setRequestHeader('Content-Type', 'application/json');
    
    // Send the request
    http.send(JSON.stringify({"email": document.getElementById("logemail").value
                              , "password" : document.getElementById ("logpassword").value
                             }));
    
    // Call the following when there is a response
    http.onreadystatechange = (e) => {
        
        // Response in text format
        var response = http.response;
        
        // Convert from a text to a JSON format
        try{
            var responseJSON = JSON.parse(response);
            //RegistrationCallback(responseJSON);
            console.log(responseJSON)
        }
        catch (err){
            console.log("Error" + err.message)
        }
    }
}


// Function to return roommates that are within a specified distance as stored on the server
function GetRoomates(){
    
    var url = "http://localhost:9090/getRoommates?gpslat="+Userlocation.lat+"&gpslong="+Userlocation.lng;
    //var url = "http://localhost:9090/login?gpslat="+Userlocation.lat+"&gpslong="+Userlocation.lng;
    console.log(url);
    var http = new XMLHttpRequest();
    
    // Prepare the request
    http.open("GET", URL, true);
    http.setRequestHeader('Content-Type', 'application/json');
    
    // Send the request
    http.send();
    
    
    // Call the following when there is a response
    http.onreadystatechange = (e) => {
        
        // Response in text format
        var response = http.response;
        
        // Convert from a text to a JSON format
        try{
            console.log(response);
            var responseJSON = JSON.parse(response);
            FillMapWithPotential(responseJSON);
            console.log(responseJSON)
        }
        catch (err){
            console.log("Error" + err.message)
        }
    }
}


