/*global firebase, document */
/*jslint browser:true */
"use strict";

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
 * Reads data from Firestore and updates information
 * displayed on the dashboard
 * @param {String} sensor The sensor key.
 */
function htmlUpdate() {
            function (doc) {
                document.getElementById().innerText = doc.data().value;
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
function checkQuality(sensor, temp, hum) {
    var db = firebase.firestore();
    let tem;
    let hum;
    let MaxTem; 
    let MinTem;
    let MaxHum; 
    let MinHum;
    db.collection(sensor)
        .onSnapshot(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
		    if (sensor=="temperature") {
		    	tem = doc.data().value;
	            } else if (sensor=="humidity") {
			hum = doc.data().value;
	            } else if (sensor=="people") {
			MaxTem = doc.data().maxTem;
			MinTem = doc.data().minTem;
			MaxHum = doc.data().maxHum;
			MinHum = doc.data().minHum;
		    } else if (sensor=="computer") {
			MaxTem = doc.data().maxTem;
			MinTem = doc.data().minTem;
			MaxHum = doc.data().maxHum;
			MinHum = doc.data().minHum;
	            }
            });
        });
    if (tem!=null && hum!=null && MaxTem!=null && MinTem!=null && MaxHum!=null && MinHum!=null) {
	    if (sensor=="people") {
		    if (tem>MaxTem) {
			    // Not OK
		    } else if (tem<MinTem) {
			    // Not OK
		    } else {
			    // Ok
		    }
		    if (hum>MaxHum) {
			    // Not OK
		    } else if (hum<MinHum) {
			    // Not Ok
		    } else {
			    // OK
		    }
	    } else if (sensor=="computer") {
            	    if (tem>MaxTem) {
		    } else if (tem<MinTem) {
		    } else {
		    }
		    if (hum>MaxHum) {
		    } else if (hum<MinHum) {
		    } else {
		    }
	    }
    }

}



/**
 * Triggered once DOM is loaded.
 */
document.addEventListener('DOMContentLoaded', function () {
    try {
        var sensors = ["temperature", "humidity", "pressure","people","computer"];
        sensors.forEach(function (sensor) {
            if (sensor == "people" || sensor == "computer"){
		    checkQuality(sensor, "temperature", "humidity"):
	    }
		else {
		    readData(sensor);
	    }
        });
    } catch (e) {
        console.error(e);
    }
});
