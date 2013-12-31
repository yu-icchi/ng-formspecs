/*global angular*/

// FormSpecs Module
var formSpecs = angular.module('FormSpecs', []);

// FactoryService
formSpecs.factory('httpService', function($http) {

});

function createInput(model, field) {

    return '<div class="form-group">' +
             '<label class="control-label" for="' + field.name + '">' + field.label + '</label>' +
             '<input type="' + field.type + '" ng-model="' + model + '">' +
           '</div>';
}

function createButton(data) {

    return '<div class="form-group">' +
             '<button ng-click="' + data.action + '" class="btn btn-primary">' + data.oklabel + '</button>' +
           '</div>';
}

function createForm(data) {

    var element = '';

    // fields
    var func = function(fields) {
        fields.forEach(function(field) {

            if (Array.isArray(field.fields)) {
                var fields = field.fields;
                fields.forEach(function(_field) {
                    _field.name = field.name + '.' + _field.name;
                });
                func(fields);
                return;
            }

            // TODO: ここのtemplateをどうにかしたいね
            element += createInput(data.model + '.' + field.name, field);
        });
    };
    func(data.fields);

    // button
    element += createButton(data);

    // debug
    element += '<pre>{{' + data.model + '|json}}</pre>';

    return element;
}

// directive
formSpecs.directive('formSpecs', ['$compile', function($compile) {
    // view
    return {
        restrict: 'AE',
        link: function(scope, element, attrs, controller) {

            var data = scope.data;

            // Formの自動生成
            var el = angular.element(createForm(data));
            var compiled = $compile(el);
            element.append(el);

            // スコープを割り当てる
            compiled(scope);
        }
    };
}]);

// Application
var app = angular.module('app', ['FormSpecs']);

// Controller
app.controller('User', ['$scope', function($scope) {

    $scope.test = 'User';

    $scope.data = {
        title: 'テストForm',
        model: 'user',
        desc: '',
        action: 'save()',
        oklabel: '保存',
        fields: [{
            label: 'コード',
            name: 'id',
            type: 'text'
        }, {
            label: 'なまえ',
            name: 'name',
            type: 'text'
        }, {
            label: '期間',
            name: 'term',
            fields: [{
                label: '開始',
                name: 'start',
                type: 'text'
            }, {
                label: '終了',
                name: 'end',
                type: 'text'
            }]
        }]
    };

    $scope.save = function() {
        alert(JSON.stringify($scope.user, null, '  '));
    };

    $scope.user = {};

}]);

