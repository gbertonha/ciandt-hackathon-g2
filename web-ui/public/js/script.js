/*global firebase, document */
/*jslint browser:true */
"use strict";

var tem;
var hum;
var pMaxTem; 
var pMinTem;
var pMaxHum; 
var pMinHum;
var cMaxTem; 
var cMinTem;
var cMaxHum; 
var cMinHum;
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
 * write from Firestore
 * displayed on the dashboard
 * @param {String} sensor The sensor key.
 */
function htmlUpdate(id, message) {
			
            document.getElementById(id).innerText = message;
}


function conditions(vsensor,vtem,vhum,Maxvtem,Minvtem,Maxvhum,Minvhum) {
	if (vtem!=null && vhum!=null && Maxvtem!=null && Minvtem!=null && Maxvhum!=null && Minvhum!=null) {
		if (vtem>Maxvtem) {
			htmlUpdate(vsensor + "_temp","Bad!");
		} else if (vtem<Minvtem) {
			htmlUpdate(vsensor + "_temp","Bad!");
		} else {
			htmlUpdate(vsensor + "_temp","Good!");
		}
		if (vhum>Maxvhum) {
			htmlUpdate(vsensor + "_hum","Bad!");
		} else if (vhum<Minvhum) {
			htmlUpdate(vsensor + "_hum","Bad!");
		} else {
			htmlUpdate(vsensor + "_hum","Good!");
		}

	}
}


/**
 * Reads data from Firestore and updates information
 * displayed on the dashboard
 * @param {String} sensor The sensor key.
 */
function checkQuality(sensor) {
    var db = firebase.firestore();
	
	db.collection("temperature")
        .onSnapshot(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
				tem = doc.data().value;
			conditions("people",tem,hum,pMaxTem,pMinTem,pMaxHum,pMinHum);
			conditions("computer",tem,hum,cMaxTem,cMinTem,cMaxHum,cMinHum);
			});
        });

	db.collection("humidity")
        .onSnapshot(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
				hum = doc.data().value;
			conditions("people",tem,hum,pMaxTem,pMinTem,pMaxHum,pMinHum);
			conditions("computer",tem,hum,cMaxTem,cMinTem,cMaxHum,cMinHum);			
			});
        });
	
    db.collection(sensor)
        .onSnapshot(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
		    if (sensor=="people") {
			pMaxTem = doc.data().maxTemp;
			pMinTem = doc.data().minTemp;
			pMaxHum = doc.data().maxHum;
			pMinHum = doc.data().minHum;
		    } else if (sensor=="computer") {
			cMaxTem = doc.data().maxTemp;
			cMinTem = doc.data().minTemp;
			cMaxHum = doc.data().maxHum;
			cMinHum = doc.data().minHum;
	            }
			conditions("people",tem,hum,pMaxTem,pMinTem,pMaxHum,pMinHum);
			conditions("computer",tem,hum,cMaxTem,cMinTem,cMaxHum,cMinHum);
            });
        });
    

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
