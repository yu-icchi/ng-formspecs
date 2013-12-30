
// FormSpecs Module
var formSpecs = angular.module('FormSpecs', []);

// FactoryService
formSpecs.factory('httpService', function($http) {

});

function inputTemplate(model, field) {

    return '<div class="form-group">' +
           '<label class="control-label" for="' + field.name + '">' + field.label + '</label>' +
           '<input type="' + field.type + '" ng-model="' + model + '">' +
           '</div>';
}

function buttonTemplate(action, oklabel) {

    return '<div class="form-group">' +
           '<button ng-click="' + action + '" class="btn btn-primary">' + oklabel + '</button>' +
           '</div>';
}

function createForm(data) {

    var element = '<form>';

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
            element += inputTemplate(data.model + '.' + field.name, field);
        });
    };
    func(data.fields);

    // button
    element += buttonTemplate(data.action, data.oklabel);

    // debug
    element += '<pre>{{' + data.model + '|json}}</pre>';

    element += '</form>';

    return element;
}

// directive
formSpecs.directive('formSpecs', function() {

    // view
    return {
        restrict: 'E',
        link: function(scope, element, attr) {

            var data = scope.data;
            element.html(createForm(data));
        }
    };
});

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

}]);

