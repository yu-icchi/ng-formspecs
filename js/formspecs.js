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
                    '<button ng-click="' + data.action + '(' + data.model + ')' +
                        '" class="btn btn-primary">' + data.oklabel + '</button>' +
                    '<button ng-click="reset()" class="btn">キャンセル</button>' +
                '</div>' +
            '</div>';
}

// form
function createForm(data) {

    var element = [];
    element.push('<form class="form-horizontal">');

    // fields
    var func = function(fields, element) {
        fields.forEach(function(field) {

            if (Array.isArray(field.fields)) {
                var fields = field.fields;
                fields.forEach(function(_field) {
                    _field.name = field.name + '.' + _field.name;
                });
                func(fields, element);
                return;
            }

            element.push(createInput(data.model + '.' + field.name, field));
        });
    };
    func(data.fields, element);

    // button
    element.push(createButton(data));

    element.push('</form>');

    // debug
    if (data.debug) {
        element.push('<pre>{{' + data.model + '|json}}</pre>');
    }

    return element.join('');
}

// directive
formSpecs.directive('formSpecs', ['$compile', function($compile) {

    // view
    return {
        restrict: 'AE',
        link: function(scope, element, attrs) {

            // リセットボタンの設定
            scope.reset = scope.reset || function() {
                alert('reset');
            };

            // <form-specs data="data">のdata=の値
            var data = scope.data;

            // <form-specs debug="true" デバッグモード
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
        type: 'group',
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

