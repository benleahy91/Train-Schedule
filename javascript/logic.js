$(document).ready(function() {

	var config = {
		apiKey: "AIzaSyCRBotmcXlQajfrlgIO6bwbCdovAkDeEso",
		authDomain: "traintime-6f156.firebaseapp.com",
		databaseURL: "https://traintime-6f156.firebaseio.com",
		projectId: "traintime-6f156",
		storageBucket: "traintime-6f156.appspot.com",
		messagingSenderId: "733630802719"
	};

	firebase.initializeApp(config);

	var database = firebase.database();

	$("#submit").click(function(event){
		event.preventDefault();
		var trainName = $("#name-form").val().trim();
		var trainDest = $("#destination-form").val().trim();
		var trainFrequency = $("#frequency-form").val().trim();
		var firstArrival = $("#arrival-form").val().trim();
		var naFormat = moment.unix(firstArrival).format("h:mm");

		var newTrain = {
			name: trainName,
			destination: trainDest,
			frequency: trainFrequency,
			arrival: firstArrival,
		}
		database.ref("train").push(newTrain);
		location.reload();
	});

	database.ref("train").on("value", function(snapshot) {
		var train = snapshot.val();
		var keys = Object.keys(train);
		for (var i = 0; i < keys.length; i++) {
			var td = keys[i];
			var trainName = train[td].name;
			var trainDest = train[td].destination;
			var firstArrival = train[td].arrival;
			var trainFrequency = train[td].frequency;

			var arrivalSplit = firstArrival.split(":");
			var arrivalTime = moment().hours(arrivalSplit[0]).minutes(arrivalSplit[1]);
			// console.log(arrivalTime)
			var diffTime = moment().diff(arrivalTime, "minutes");
			var remainder = diffTime % trainFrequency;
			var minutesAway = trainFrequency - remainder;
			var trainArrive = moment().add(minutesAway, "minutes").format("h:mm a");
			console.log(trainArrive);
			$(".table").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainArrive + "</td><td>" + trainFrequency + "</td><td>" + minutesAway + "</td></tr>");
		}
	}, function(errorObject) {
		console.log("The read failed: " + errorObject.code);

	});
});