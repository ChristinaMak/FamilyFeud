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

        $scope.saveQuestion = function() {
            // create red to surveys table of database
            var surveyRef = $scope.myData.child("surveys");

            // use as key to enter data
            var entryKey = $scope.survey.question;
            surveyRef.child(entryKey).set($scope.survey);

            // clear question field
            $scope.survey.question = "";
        }

        $scope.getAQuestion = function(dataSnapshot) {
            var rand = Math.floor(Math.random() * $scope.surveyDataSize);
            var counter = 0;
            for (var key in $scope.surveyData) {
                if (counter === rand) {
                    $scope.surveyQuestion = key;
                }
                counter++;
            }
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