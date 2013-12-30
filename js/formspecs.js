
var user = {
    title: '',
    name: 'user',
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

// FormSpecs Module
var formSpecs = angular.module('formSpecs', []);

// FactoryService
formSpecs.factory('httpService', function($http) {

});

function inputTemplate(name, field) {
    var template = '';

    template += '<div class="form-group">';
    template += '<label class="control-label" for="' + field.name + '">' + field.label + '</label>';
    template += '<input type="' + field.type + '" ng-model="' + name + '.' + field.name + '">';
    template += '</div>';

    return template;
}

function buttonTemplate(action, oklabel) {
    var template = '';

    template += '<div class="form-group">';
    template += '<button ng-click="' + action + '" class="btn btn-primary">' + oklabel + '</button>';
    template += '</div>';

    return template;
}

// directive
formSpecs.directive('formspecs', function() {

    var element = '';

    // fields
    var createInput = function(fields) {
        fields.forEach(function(field) {

            if (Array.isArray(field.fields)) {
                var fields = field.fields;
                fields.forEach(function(_field) {
                    _field.name = field.name + '.' + _field.name;
                });
                createInput(fields);
                return;
            }

            // TODO: ここのtemplateをどうにかしたいね
            element += inputTemplate(user.name, field);
        });
    };
    createInput(user.fields);

    // button
    element += buttonTemplate(user.action, user.oklabel);

    // debug
    element += '<pre>{{' + user.name + '|json}}</pre>';

    // view
    return {
        restrict: 'E',
        template: '<form>' + element + '</form>'
    };
});

// Controller
formSpecs.controller('FormSpecs', ['$scope', function($scope) {

    $scope.test = 'FormSpaces';

    $scope.save = function() {
        alert(JSON.stringify($scope.user, null, '  '));
    };

}]);

// Application
var app = angular.module('app', ['formSpecs']);

