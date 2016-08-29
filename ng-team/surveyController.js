angular
    .module('ngTeam')
    .controller('surveyController', function ($scope, $timeout) {

        $scope.myData = new Firebase("https://family-feud-86a21.firebaseio.com");
        $scope.allSurveyData =
            new Firebase("https://family-feud-86a21.firebaseio.com/surveys/");

        $scope.survey = {};
        $scope.surveyData = {};
        $scope.surveyQuestion = "";
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
            $scope.survey.question = $scope.checkInput($scope.survey.question)

            // create ref to surveys table of database
            var surveyRef = $scope.myData.child("surveys");

            // use as key to enter data
            var entryKey = $scope.survey.question;
            surveyRef.child(entryKey).set($scope.survey.question);

            // clear question field
            $scope.survey.question = "";
        }

        /* Retrieves a random question from the database */
        $scope.getAQuestion = function() {
            var rand = Math.floor(Math.random() * $scope.surveyDataSize);
            var counter = 0;
            for (var key in $scope.surveyData) {
                if (counter === rand) {
                    $scope.surveyQuestion = key;
                }
                counter++;
            }
        }

        /* Saves input response to database */
        $scope.saveResponse = function() {
            var surveyRef = $scope.myData.child("surveys");
            var entryKey = "responses"
            surveyRef.child($scope.surveyQuestion).child(entryKey).push($scope.survey.response);

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
                    $scope.surveyQuestion = key;
                }
                counter++;
            }
        });

    });