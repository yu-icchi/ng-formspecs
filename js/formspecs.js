/*global angular */

// FormSpecs Module
var formSpecs = angular.module('FormSpecs', []);

// text
function createTextInput(model, field) {

    // 属性
    var attr = '';
    for (var n in field) {
        if (n !== 'label' && n !== 'type' && n !== 'name') {
            attr += n + '="' + field[n] + '"';
        }
    }

    // テンプレート
    return  '<div class="form-group">' +
                '<label class="col-sm-2 control-label" for="' + model + '">' + field.label + '</label>' +
                '<div class="col-sm-8">' +
                    '<input id="' + model + '" name="' + model + '" class="form-control" type="' + field.type + '" ng-model="' + model + '"' + attr +'/>' +
                '</div>' +
            '</div>';
}

// select
function createSelectBox(model, label, value) {


}

// checkbox
function createCheckBox(model, field) {

    var element = [];

    for (var i = 0; i < field.labels.length; i++) {
        var id = model + '-' + i;
        var label = field.labels[i];
        var value = field.values[i];

        var template = [];
        template.push('<div class="checkbox col-sm-offset-2">');
        template.push('<label>');

        if (typeof value !== 'string') {
            template.push('<input type="checkbox" id="' + id + '" value="' + value + '" ng-model="' + model + '">' + label);
        } else {
            template.push('<input type="checkbox" id="' + id + '" value="' + value + '" ng-model="' + model + '" ng-true-value="' + value + '" ng-false-value="">' + label);
        }

        template.push('</label>');
        template.push('</div>');

        element.push(template.join(''));
    }

    return element.join('');
}

// radio
function createRadioButton(model, field) {

    var element = [];

    for (var i = 0; i < field.labels.length; i++) {
        var label = field.labels[i];
        var value = field.values[i];

        var template = [];
        template.push('<div class="radio col-sm-offset-2">');
        template.push('<label>');

        if (typeof value !== 'string') {
            template.push('<input type="radio" value="' + value + '" ng-model="' + model + '" ng-value="' + value + '">' + label);
        } else {
            template.push('<input type="radio" value="' + value + '" ng-model="' + model + '">' + label);
        }

        template.push('</label>');
        template.push('</div>');

        element.push(template.join(''));
    }

    return element.join('');
}

// button
function createButton(data) {

    return  '<div class="form-group">' +
                '<div class="col-sm-offset-2 col-sm-10">' +
                    '<button ng-click="' + data.action + '(' + data.model + ')' +
                        '" class="btn btn-primary ">' + data.oklabel + '</button>' +
                    '<button ng-click="reset()" class="btn btn-default">キャンセル</button>' +
                '</div>' +
            '</div>';
}

// field
function createField(element, model, field) {
    // model name
    var ns = model + '.' + field.name;

    switch (field.type) {
        case 'group':
            element.push('<div><blockquote><h3>' + field.label + '</h3>');

            field.fields.forEach(function(_field) {
                createField(element, ns, _field);
            });

            element.push('</blockquote></div>');
            break;
        case 'array':
            break;
        case 'multiple':
            break;
        case 'space':
            break;
        case 'hidden':
            break;
        case 'select':
            break;
        case 'radio':
                element.push(createRadioButton(ns, field));
            break;
        case 'checkbox':
                element.push(createCheckBox(ns, field));
            break;
        case 'number':
        case 'text':
        case 'password':
        default :
            element.push(createTextInput(ns, field));
            break;
    }
}

// form
function createForm(data) {

    var element = [];
    element.push('<form class="form-horizontal" role="form">');

    // fields
    data.fields.forEach(function(field) {
        createField(element, data.model, field);
    });

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
        restrict: 'E',
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
            value: 10,
            min: 10,
            max: 20
        }, {
            label: '期間２',
            name: 'term',
            type: 'group',
            fields: [{
                label: 'ラベル',
                name: 'label',
                type: 'text'
            }]
        }]
    }, {
        label: '公開/非公開',
        name: 'published',
        type: 'checkbox',
        labels: ['公開', '非公開'],
        values: ['public', 'private']
    }, {
        label: 'カテゴリー',
        name: 'category',
        type: 'radio',
        labels: ['服', '家具'],
        values: ['cloth', 'furniture']
    }, {
        label: 'タイプ',
        name: 'type',
        type: 'radio',
        labels: ['方法１', '方法２', '方法３'],
        values: [1, 2, 3]
    }]
});

// Controller
app.controller('User', ['$scope', 'User', function($scope, User) {

    $scope.data = User;

    $scope.save = function(data) {
        alert(JSON.stringify(data, null, ' '));
    };

}]);

