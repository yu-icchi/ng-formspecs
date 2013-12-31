/*global angular */

// FormSpecs Module
var formSpecs = angular.module('FormSpecs', []);

// input
function createInput(model, field) {

    return  '<div class="control-group">' +
                '<label class="control-label" for="' + model + '">' + field.label + '</label>' +
                '<div class="controls">' +
                    '<input id="' + model + '" type="' + field.type + '" ng-model="' + model + '"/>' +
                '</div>' +
            '</div>';
}

// button
function createButton(data) {

    return  '<div class="control-group">' +
                '<div class="controls">' +
                    '<button ng-click="' + data.action + '(' + data.model + ')' + '" class="btn btn-primary">' + data.oklabel + '</button>' +
                '</div>' +
            '</div>';
}

// form
function createForm(data) {

    var element = '<form class="form-horizontal">';

    console.log(data);

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

    element += '</form>';

    // debug
    if (data.debug) {
        element += '<pre>{{' + data.model + '|json}}</pre>';
    }

    return element;
}

// directive
formSpecs.directive('formSpecs', ['$compile', function($compile) {

    // view
    return {
        restrict: 'AE',
        link: function(scope, element, attrs) {

            // <form-specs data="data">のdata=の値
            var data = scope.data;

            // デバッグモード
            data.debug = attrs.debug;

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

// User Scheme
app.value('User', {
    title: 'テストForm',
    model: 'user',
    desc: 'ユーザデータスキーマ',
    action: 'save',
    oklabel: '保存',
    fields: [{
        label: 'コード',
        name: 'id',
        type: 'text',
        placeholder: 'アイテムコード'
    }, {
        label: 'なまえ',
        name: 'name',
        type: 'text',
        placeholder: 'アイテム名'
    }, {
        label: '期間',
        name: 'term',
        fields: [{
            label: '開始',
            name: 'start',
            type: 'number',
            min: 0,
            max: 99
        }, {
            label: '終了',
            name: 'end',
            type: 'number',
            min: 10,
            max: 20
        }]
    }, {
        label: '公開/非公開',
        name: 'published',
        type: 'radio'
    }]
});

// Controller
app.controller('User', ['$scope', 'User', function($scope, User) {

    $scope.data = User;

    $scope.save = function(data) {
        alert(JSON.stringify(data, null, '  '));
    };

}]);

