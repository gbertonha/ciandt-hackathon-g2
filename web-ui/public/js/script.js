/*global firebase, document */
/*jslint browser:true */
"use strict";
var tem;
var hum;
var MaxTem; 
var MinTem;
var MaxHum; 
var MinHum;
/**
 * Reads data from Firestore and updates information
 * displayed on the dashboard
 * @param {String} sensor The sensor key.
 */
function readData(sensor) {
    var db = firebase.firestore();
    db.collection(sensor)
        .onSnapshot(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
				if(sensor == "temperature" && tem != null){
					tem = doc.data().value;
				}else if(sensor == "humidity" && hum != null){
					hum = doc.data().value;
				}
                document.getElementById(sensor).innerText = doc.data().value;
                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                var dateTime = date + ' ' + time;
                document.getElementById("last-update").innerText = dateTime;
            });
        });
}

/**
 * Reads data from Firestore and updates information
 * displayed on the dashboard
 * @param {String} sensor The sensor key.
 */
function writeData(sensor) {
    var db = firebase.firestore();
    db.collection(sensor)
        .onSnapshot(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                document.getElementById(sensor).innerText = doc.data().value;
                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                var dateTime = date + ' ' + time;
                document.getElementById("last-update").innerText = dateTime;
				checkQuality("people");
				checkQuality("computer");
            });
        });
}

/**
 * write from Firestore
 * displayed on the dashboard
 * @param {String} sensor The sensor key.
 */
function htmlUpdate(id, message) {
	document.getElementById(id).innerText = message;
}



/**
 * Reads data from Firestore and updates information
 * displayed on the dashboard
 * @param {String} sensor The sensor key.
 */
function checkQuality(sensor) {
    var db = firebase.firestore();
	
    db.collection(sensor)
        .onSnapshot(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
				if (sensor=="people") {
					MaxTem = doc.data().maxTemp;
					MinTem = doc.data().minTemp;
					MaxHum = doc.data().maxHum;
					MinHum = doc.data().minHum;
				} else if (sensor=="computer") {
					MaxTem = doc.data().maxTemp;
					MinTem = doc.data().minTemp;
					MaxHum = doc.data().maxHum;
					MinHum = doc.data().minHum;
	            }
				checkCondtions(sensor);
            });
        });
    

}
function checkCondtions(sensor) {
	if (tem!=null && hum!=null && MaxTem!=null && MinTem!=null && MaxHum!=null && MinHum!=null) {
		if (tem>MaxTem) {
			htmlUpdate(sensor + "_temp","Bad!");
		} else if (tem<MinTem) {
			htmlUpdate(sensor + "_temp","Bad!");
		} else {
			htmlUpdate(sensor + "_temp","Good!");
		}
		if (hum>MaxHum) {
			htmlUpdate(sensor + "_hum","Bad!");
		} else if (hum<MinHum) {
			htmlUpdate(sensor + "_hum","Bad!");
		} else {
			htmlUpdate(sensor + "_hum","Good!");
		}
	
	}
}


/**
 * Triggered once DOM is loaded.
 */
document.addEventListener('DOMContentLoaded', function () {
    try {
        var sensors = ["temperature", "humidity", "people","computer"];
        sensors.forEach(function (sensor) {
            if (sensor == "people" || sensor == "computer"){
		    checkQuality(sensor);
	    }
		else {
		    readData(sensor);
	    }
        });
    } catch (e) {
        console.error(e);
    }
});
