import $$model from '../lib/model.js';
import $$app from '../script/app.js';
import under from '../lib/underscore.v1.4.4.min.js';
import format from './proxy/format';
import assert from '../lib/assert';
import $$buildingItem from './building-item';
import $$user from './user';

var _ = under;
var licence = new $$model({});

var licenceParams = {
};

_.extend(licence, {
    //配置项list列表
    getConfigList: function(params, fn) {

    },
    //环线list列表
    getHxList: function(params, fn) {

    },
    //环线删除
    delConfigById: function (params, fn) {

    },
    //配置项删除
    //环线填加
    //配置项填加
    setParams: function (data) {
        licenceParams = data;
        this.trigger('setParams');
    },
    getParams: function () {
        this.trigger('getParams');
        return licenceParams;
    },
    delItem: function (data, fn) {
        licenceParams.forEach(function (item, index) {
            if (item.id === data.pid) {
                licenceParams.splice(index, 1);
            }
        });
    },
    editItem: function (data, fn) {
        var newParams = {
            id: data.licence_id,
            preorderNum: data.preorderNum,
            preorderRange: data.preorderRange,
            preorderTime: format.dateToString(data.preorderTime),
            publishTime: data.publishTime,
            image: data.image
            //sender: data.sender || $$user.getUserData().userId
        };
        if (data.licence_id) {
            licenceParams.forEach(function (item, index) {
                if (item.id === data.licence_id) {
                    licenceParams.splice(index, 1, newParams);
                }
            });
        } else {
            newParams.publishTime = format.dateToString(new Date().getTime());
            newParams.id = data.licence_id = licenceParams.length + 1;
            licenceParams.unshift(newParams);
        }

        fn && fn({code: 1});
    },
    lint: function (data) {
        var that = this;
        that.trigger('lint', data);
    },
    editUrl: function (url) {
        var that = this;
        that.trigger('editUrl', url);
    },
    submit: function (params, fn) {
        var that = this;
        var lint = assert(licenceParams, [{
            preorderTime: 's,r',
            preorderRange: 's,r',
            preorderNum: 's',
            publishTime: 's,r',
            image: 's,r'
        }, 'F']);
        if (lint !== true) {
            that.lint(lint);
            return;
        }
        $$app.getApi('/api/preorder-spider.json', licenceParams,  function (data) {
            that.trigger('submit', data);
            fn && fn(data);
            $$buildingItem.getCurrentItem();
        });
    }
});

export default licence;
