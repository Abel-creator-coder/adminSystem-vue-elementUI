import $$model from '../lib/model.js';
import $$app from '../script/app.js';
import under from '../lib/underscore.v1.4.4.min.js';
import $$statusModel from './app-status.js';

var _ = under;
var huxingModel = new $$model({});

var huxingParams = {
    layoutId: null
};

_.extend(huxingModel, {
    getHuxingList: function () {
        var params = {
            pid: 1
        };
        $$statusModel.setValue('loading', true);
        $$app.getApi('/api/huxing-list.json', params, function (obj) {
            $$statusModel.setValue('loading', false);
            huxingModel.trigger('getHuxingList', obj);
        });
    },
    getLayoutList: function () {
        $$statusModel.setValue('loading', true);
        $$app.getApi('/api/layout-list.json', {}, function (obj) {
            $$statusModel.setValue('loading', false);
            huxingModel.trigger('getLayoutList', obj);
        });
    },
    delHuxing: function (data, fn) {
        var params = {
            id: data.id
        };
        $$statusModel.setValue('loading', true);
        $$app.getApi('/api/del-huxing.json', params, function (obj) {
            $$statusModel.setValue('loading', false);
            huxingModel.trigger('delHuxing', obj);
            fn && fn(obj);
        });
    },
    delHuxingList: function (data, fn) {
        var params = {
            list: data.list
        };
        $$statusModel.setValue('loading', true);
        $$app.getApi('/api/del-huxing-list.json', params, function (obj) {
            $$statusModel.setValue('loading', false);
            huxingModel.trigger('delHuxingList', obj);
            fn && fn(obj);
        });
    }
});

export default huxingModel;
