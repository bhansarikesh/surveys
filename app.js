'use strict';

const app = angular.module('surveyApp', []);

app.config(function($locationProvider) {
  // remove #! from url
  $locationProvider.html5Mode(true);
});

app.controller('mainCtrl', function($scope, $http) {
  $scope.btnDisabled = false;
  $scope.showSurveyList = true;
  const surveyListUrl = 'https://private-anon-66405f3516-surveys7.apiary-mock.com/api/surveys';
  $http.get(surveyListUrl)
    .then(successResponse => {
      $scope.surveyList = successResponse.data.surveys;
    }, errorResponse => {
      console.log(errorResponse);
    });

  const surveyByIdUrl = 'https://private-anon-66405f3516-surveys7.apiary-mock.com/api/surveys/';
  $scope.getSurveyQuestions = (surveyId) => {
    $scope.showSuccessMessage = false;
    $scope.showSurveyList = false;
    $http.get(surveyByIdUrl + surveyId)
      .then(successResponse => {
        $scope.btnDisabled = false;
        $scope.surveyId = successResponse.data.survey.id;
        $scope.surveyQuestions = successResponse.data.survey.questions;
        $scope.surveyTitle = successResponse.data.survey.title;
        $scope.surveyTagline = successResponse.data.survey.tagline;
      }, errorResponse => {
        console.log(errorResponse);
      });
  }

  $scope.submitSurveyResult = () => {
    const postSurveyUrl = 'https://private-anon-66405f3516-surveys7.apiary-mock.com/api/surveys/' + $scope.surveyId + '/completions';
    const submitObject = {
      completion: [],
    };
    $scope.surveyQuestions.forEach((question) => {
      submitObject.completion.push({
        question_id: question.id,
        value: question.option,
      });
    });
    const req = {
      method: 'post',
      url: postSurveyUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      data: submitObject,
    };
    $scope.btnDisabled = true;
    $http(req)
      .then(successResponse => {
        $scope.surveyQuestions = [];
        $scope.showSuccessMessage = true;
      }, errorResponse => {
        console.log(errorResponse);
      });
  }
});
