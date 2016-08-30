angular
    .module('ngTeam')
    .controller('surveyController', function ($scope, $timeout) {
        var config = {
            apiKey: "AIzaSyBuisL8xrUulT28TEY0CDmDk2VMR5iHurY",
            authDomain: "family-feud-86a21.firebaseapp.com",
            databaseURL: "https://family-feud-86a21.firebaseio.com"
        };

        firebase.initializeApp(config);

        $scope.myData = firebase.database().ref();
        $scope.allSurveyData = firebase.database().ref().child('surveys');

        $scope.survey = {};
        $scope.surveyData = {};
        $scope.surveyQuestion = "";
        $scope.surveyKey = "";
        $scope.surveyDataSize = 0;

        /* Checks input for characters not allowed in Firebase key */
        $scope.checkInput = function(input) {
            var cleanedKey = input;

            while (cleanedKey.indexOf(".") !== -1 ) {
                cleanedKey = cleanedKey.replace('.','');
            }
            while (cleanedKey.indexOf("#") !== -1) {
                cleanedKey = cleanedKey.replace('#','');
            }
            while (cleanedKey.indexOf("$") !== -1) {
                cleanedKey = cleanedKey.replace('$','');
            }
            while (cleanedKey.indexOf("[") !== -1) {
                cleanedKey = cleanedKey.replace('[','');
            }
            while (cleanedKey.indexOf("]") !== -1) {
                cleanedKey = cleanedKey.replace(']','');
            }

            return cleanedKey;
        }

        /* Saves input question to database */
        $scope.saveQuestion = function() {
            // create ref to surveys table of database
            var surveyRef = $scope.myData.child("surveys");

            var question = $scope.survey.question;

            $scope.survey.question = $scope.checkInput($scope.survey.question)
            var entryKey = $scope.survey.question;
            surveyRef.child(entryKey).set($scope.survey.question);
            surveyRef.child(entryKey).child("question").set(question);

            // clear question field
            $scope.survey.question = "";
        }

        /* Retrieves a random question from the database */
        $scope.getAQuestion = function() {
            var rand = Math.floor(Math.random() * $scope.surveyDataSize);
            var counter = 0;
            for (var key in $scope.surveyData) {
                if (counter === rand) {
                    $scope.surveyKey = key;
                    $scope.surveyQuestion = $scope.surveyData[key].question;
                }
                counter++;
            }
        }

        /* Saves input response to database */
        $scope.saveResponse = function() {
            var surveyRef = $scope.myData.child("surveys");
            surveyRef.child($scope.surveyKey).child("responses").push($scope.survey.response);

            // clear response form and get new question
            $scope.survey.response = "";
            $scope.getAQuestion();
        }

        /* Anonymous function acting as listener to detect database updates */
        $scope.allSurveyData.on('value', function (dataSnapshot) {
            // $timeout to load database on initial page load
            $timeout(function () {
                $scope.surveyData = dataSnapshot.val();
            });
        });

        /* Loads a random question from the database */
        $scope.allSurveyData.once('value', function (dataSnapshot) {
            $scope.surveyDataSize = dataSnapshot.numChildren();
            var rand = Math.floor(Math.random() * dataSnapshot.numChildren());
            var counter = 0;
            for (var key in dataSnapshot.val()) {
                if (counter === rand) {
                    $scope.surveyKey = key;
                    $scope.surveyQuestion = dataSnapshot.val()[key].question;
                }
                counter++;
            }
        });

    });