import $$model from '../lib/model.js';
import $$app from '../script/app.js';
import $$statusModel from '../model/app-status.js';
import under from '../lib/underscore.v1.4.4.min.js';
import $$building from './building';
import $$album from './album';
import $$layout from './huxing';
import $$licence from './licence';
import $$sell from './sell';
import $$launch from './launch';

var _ = under;
var model = new $$model({});


var currentItem = {
    loupanId: '',
    cityId: '',
    type: 'sail',
    position: {
        geoLat: '',
        geoLng: ''
    }
};
var currentItemParams = {
    sail: {
    },
    city: {
    },
    preorder: {
    },
    basic: {
    },
    traffic: {
    },
    plan: {
    },
    album: {
    },
    huxing: {
    }
};

var getCurrentId = function (key) {
    var keys = location.href.split('?').pop().split('&');
    for (let i = 0; i < keys.length; i++) {
        if (keys[i].indexOf(key) !== -1) {
            return keys[i].split('=')[1];
        }
    }
};

var url = {
    newItem: {
        name: 'newItem',
        audit: '/api/audit-new-item.json'
    },
    sail: {
        name: 'sale',
        audit: '/api/audit-tab.json',
        update: '/api/set-sail-info.json'
    },
    kaipan: {
        name: 'launch',
        audit: '/api/audit-tab.json',
        update: '/api/set-kaipan-info.json',
        submit: '/api/set-kaipa-submit-info.json'
    },
    preorder: {
        name: 'licence',
        audit: '/api/audit-tab.json',
        update: '/api/set-preorder-info.json'
    },
    basic: {
        name: 'basic',
        audit: '/api/audit-tab.json',
        update: '/api/set-basic-info.json'
    },
    traffic: {
        name: 'traffic',
        audit: '/api/audit-tab.json',
        update: '/api/set-traffic-info.json'
    },
    plan: {
        name: 'plan',
        audit: '/api/audit-tab.json',
        update: '/api/set-plan-info.json'
    },
    album: {
        name: 'album',
        audit: '/api/audit-tab.json',
        update: '/api/set-album-info.json'
    },
    huxing: {
        name: 'layout',
        audit: '/api/audit-tab.json',
        update: '/api/set-huxing-info.json'
    }
};
var update = {
    sail: '/api/set-sail-info.json',
    sailPrice: '/api/set-sail-price.json',
    kaipan: '/api/set-kaipan-info.json',
    kaipanSub: '/api/set-kaipan-sub-info.json',
    preorder: '/api/set-preorder-info.json',
    basic: '/api/set-basic-info.json',
    traffic: '/api/set-traffic-info.json',
    plan: '/api/set-plan-info.json',
    album: '/api/set-album-info.json',
    huxing: '/api/set-huxing-info.json'
};

var updateParams = function (data) {
    $$licence.setParams(data.preorder_info);
    $$launch.setParams(data.kaiPanData, 'kaipan');
    $$launch.setParams(data.jiaoFangData, 'jiaofang');
    $$sell.setParams(data.sellInfo);
};

_.extend(model, {
    getCurrentItem: function () {
        $$statusModel.setValue('loading', true);
        model.setCurrentId();
        var params = {
            pid: currentItem.loupanId || getCurrentId('loupanId'),
            id: currentItem.cityId || getCurrentId('cityId')
        };
        $$app.getApi('/api/building-item.json', params, function (obj) {
            currentItem.position.geoLng = obj.basic_info.long;
            currentItem.position.geoLat = obj.basic_info.latitude;
            _.extend(currentItem, obj);
            updateParams(currentItem);
            $$app.getApi('/api/traffic.json', params, function (obj) {
                _.extend(currentItem, obj);
                $$app.getApi('/api/loop.json', params, function (obj) {
                    _.extend(currentItem, obj);
                    model.trigger('getCurrentItem', currentItem);
                    $$statusModel.setValue('loading', false);
                    if (currentItem.type === 'album') {
                        $$album.getAlbumList();
                    } else if (currentItem.type === 'huxing') {
                        $$layout.getLayoutList();
                    }
                });
            });
        });
    },
    getAuditItem: function () {
        currentItem.type = 'newItem';
        model.setCurrentId();
        var params = {
            pid: currentItem.loupanId || getCurrentId('loupanId')
        };
        $$app.getApi('/api/audit-item.json', params, function (obj) {
            model.trigger('getAuditItem', obj);
        });
    },
    getLinkItem: function(data, fn){
        $$app.getApi('/api/search-link.json', data, function (obj) {
            fn && fn(obj);
        });
    },
    updateItem: function (params, fn) {
        var key;
        var newParams;
        var data;
        for (let k in params) {
            key = k;
        }
        if (key === 'sail') {
            data = params.sail;
            newParams = {
                saleStatus: data.saleStatus,
                salePhase: data.salePhase,
                saleAddressList: [],
                marketingInfo:data.marketingInfo
            }
            data.saleAddressList.forEach(function (item) {
                newParams.saleAddressList.push({
                    id: item.id,
                    cityId: item.cityId,
                    provinceId: item.provinceId,
                    districtId: item.districtId,
                    areas: item.areas,
                    detailedAddress: item.detailedAddress,
                    telephoneArray: item.telephoneArray
                });
            });
            newParams = {
                sail: newParams
            };
        } else if (key === 'sailPrice') {
            data = params.sailPrice;
            newParams = {
                sailPrice: {
                    id: data.id,
                    priceRadio: data.priceRadio,
                    avPrice: data.avPrice,
                    hPrice: data.hPrice,
                    lPrice: data.lPrice,
                    priceDate: data.priceDate,
                    publishDate: data.publishDate,
                    hUnit: data.hUnit,
                    lUnit: data.lUnit,
                    discribe: data.discribe
                }
            };
        } else if (key === 'kaipan') {
            data = params.kaipan;
            newParams = {
                kaipan: {
                    textareaKaipan: data.textareaKaipan,
                    year: data.year,
                    month: data.month,
                    day: data.day,
                    id: data.id,
                    openingIsPredict: data.openingIsPredict,
                    submit: new Date().getTime()
                }
            };
        } else if (key === 'kaipanSub') {
            data = params.kaipanSub;
            newParams = {
                kaipanSub: {
                    textareaJiaofang: data.textareaJiaofang,
                    year: data.year,
                    month: data.month,
                    day: data.day,
                    id: data.id,
                    deliveryIsPredict: data.deliveryIsPredict,
                    submit: new Date().getTime()
                }
            };
        } else if (key === 'preorder') {
            data = params.preorder;
            newParams = {
                preorder: {
                    preorderNum: data.preorder_no,
                    preorderTime: data.preorder_time,
                    preorderRange: data.pre_description,
                    image: data.pic,
                    sender: data.sender,
                    licence_id: data.licence_id,
                    publishTime: data.publishTime
                }
            };
        } else if (key === 'basic') {
            data = params.basic;
            newParams = {
                basic: {
                    name: data.name,
                    subTitle: data.subTitle,
                    address_list: {
                        provinceId: data.address_list.provinceId,
                        cityId: data.address_list.cityId,
                        districtId: data.address_list.districtId,
                        business_list: data.address_list.business_list,
                        address: data.address_list.address,
                        business_listId: data.address_list.business_listId
                    },
                    wuyeCheck: data.wuyeCheck,
                    cqYear: data.cqYear,
                    chanquan: data.chanquan,
                    jianzhuCheck: data.jianzhuCheck,
                    xiangmuCheck: data.xiangmuCheck,
                    zhuangxiuCheck: data.zhuangxiuCheck,
                    relationList: data.relationList,
                    kfs: data.kfs,
                    wy: {
                        decoStd: data.wy.decoStd,
                        company: data.wy.company,
                        wyf: data.wy.wyf,
                        unit: data.wy.unit,
                        info: data.wy.info
                    },
                    xmInfo: data.xmInfo,
                    shenhe: data.shenhe,
                    long: data.long,
                    latitude: data.latitude,
                    projRealestateDeveloper:data.projRealestateDeveloper,
                    projBrand:data.projBrand,
                    projInvestor:data.projInvestor
                }
            };
        } else if (key === 'traffic') {
            data = params.traffic;
            newParams = {
                traffic: {
                    loopline: data.loopline,
                    subway: data.subway,
                    busDesc: data.busDesc,
                    trafficSituation: data.trafficSituation
                }
            };
        } else if (key === 'plan') {
            data = params.plan;
            newParams = {
                plan: {
                    educationIds: data.educationIds,
                    floorArea: data.floorArea,
                    buildArea: data.buildArea,
                    plotRatio: data.plotRatio,
                    buildYear: data.buildYear,
                    greenRatio: data.greenRatio,
                    totalBuild: data.totalBuild,
                    totalRoom: data.totalRoom,
                    aroundSupport: data.aroundSupport,
                    areaSupport: data.areaSupport,
                    parkSpace: data.parkSpace,
                    hydropower: data.hydropower,
                    constructionMaterials: data.constructionMaterials,
                    shenheReason: data.shenheReason
                }
            };
        } else if (key === 'huxing') {
            data = params.huxing;
            newParams = {
                huxing: {
                    layout_id: data.layout_id,
                    index: data.index,
                    isPrime: data.isPrime,
                    photoUrl: data.photoUrl,
                    name: data.name,
                    jiegou: {
                        shi: data.jiegou.shi,
                        ting: data.jiegou.ting,
                        wei: data.jiegou.wei,
                        chu: data.jiegou.chu
                    },
                    jizhuArea: data.jizhuArea,
                    taoneiArea: data.taoneiArea,
                    zengsongArear: data.zengsongArear,
                    cengHeight: data.cengHeight,
                    total: data.total,
                    chaoxiangCheck: data.chaoxiangCheck,
                    teseCheck: data.teseCheck,
                    desc: data.desc,
                    xiaoshou: data.xiaoshou,
                    priceType: data.priceType,
                    price: {
                        num: data.price.num,
                        unit: data.price.unit,
                        totalPrice: data.price.totalPrice,
                        totalUnit: data.price.totalUnit,
                        lowPrice: data.price.lowPrice,
                        lowUnit: data.price.lowUnit
                    },
                    time: data.time
                }
            };
        }
        $$statusModel.setValue('loading', true);
        $$app.getApi(update[key], newParams, function (obj) {
            $$statusModel.setValue('loading', false);
            model.trigger('updateItem', obj);
            fn && fn(obj);
            if ($$building.getType() === 'building' || $$building.getType() === 'audit') {
                model.getCurrentItem();
            }
        });
    },
    setAuditItem: function (params, fn) {
        var isFlash = false;
        if (params.newItem) {
            params.type = 'newItem';
            isFlash = true;
            params = params.newItem;
        } else {
            params.type = url[currentItem.type].name;
        }
        $$app.getApi(url[currentItem.type].audit, params, function (obj) {
            model.trigger('setAuditItem', obj);
            fn && fn(obj);
            if (isFlash) {
                model.getAuditItem();
            } else {
                model.getCurrentItem();
            }
        });
    },
    setCurrentId: function (id, cityId) {
        currentItem.loupanId = id || getCurrentId('loupanId');
        currentItem.cityId = cityId || getCurrentId('cityId');
        model.trigger('setCurrentId');
    },
    setCurrentType: function (type) {
        currentItem.type = type;
        model.trigger('setCurrentType');
    },
    setPosition: function (geoLng, geoLat) {
        currentItem.position.geoLng = geoLng;
        currentItem.position.geoLat = geoLat;
        model.trigger('setPosition', currentItem.position);
    },
    getHistorySellingList: function (pid) {
        if (pid) {
            var params = {
                pid: pid
            };
            $$app.getApi('/api/sell-table.json', params, function (obj) {
                currentItem.selltable = obj;
                model.trigger('getHistorySellingList', currentItem);
            });
        } else {
            model.trigger('getHistorySellingList');
        }
    },
    getBeginSellingList: function (pid) {
        if (pid) {
            var params = {
                pid: pid
            };
            $$app.getApi('/api/begin.json', params, function (obj) {
                currentItem.kaipantable = obj;
                model.trigger('getBeginSellingList', currentItem);
            });
        } else {
            model.trigger('getBeginSellingList');
        }
    },
    getDealHouseList: function (pid) {
        if (pid) {
            var params = {
                pid: pid
            };
            $$app.getApi('/api/deal.json', params, function (obj) {
                currentItem.dealtable = obj;
                model.trigger('getDealHouseList', currentItem);
            });
        } else {
            model.trigger('getDealHouseList');
        }
    },
    getPreorderList: function (id, preorderNum, preorderTime, preorderRange, image, publishTime, sender) {
        if (id) {
            var params = {
                id: id
            };
            var obj = {
                    "preorder_info": {
                        "preorder_no": preorderNum,
                        "preorder_time": preorderTime,
                        "give_area": preorderRange,
                        "pre_description": preorderRange,
                        "pic": image,
                        "licence_id": id,
                        "publishTime": publishTime,
                        "sender": sender
                    }
            }
            model.trigger('getPreorderList', obj);
        } else {
            model.trigger('getPreorderList');
        }
    },
    delSellingList: function (pid, fn) {
        var params = {
            id: pid
        };
        $$app.getApi('/api/del-selling.json', params, function (obj) {
            model.trigger('delSellingList', obj);
            fn && fn(obj);
            //model.getCurrentItem();
        });
    },
    delBeginList: function (pid, fn) {
        var params = {
            pid: pid
        };
        $$app.getApi('/api/del-begin.json', params, function (obj) {
            model.trigger('delBeginList', obj);
            fn && fn(obj);
            model.getCurrentItem();
        });
    },
    delDealList: function (pid, fn) {
        var params = {
            pid: pid
        };
        $$app.getApi('/api/del-deal.json', params, function (obj) {
            model.trigger('delDealList', obj);
            fn && fn(obj);
            model.getCurrentItem();
        });
    },
    delPreList: function (pid, fn) {
        var params = {
            pid: pid
        };
        $$app.getApi('/api/del-pre.json', params, function (obj) {
            model.trigger('delPreList', obj);
            fn && fn(obj);
            model.getCurrentItem();
        });
    },
    getPid: function () {
        model.trigger('getPid', currentItem.loupanId || getCurrentId('loupanId'));
        return currentItem.loupanId || getCurrentId('loupanId');
    },
    getItem: function () {
        model.trigger('getItem');
        return currentItem;
    },
    setAlbumData: function (data) {
        currentItem.album = data.album;
    },
    selectLng: function (data, com) {
        if (com === 'basic-map') {
            model.trigger('selectLng', data);
        }
    },
    suggestBrandList: function (params, fn) {
        if(params.name)
        {
           $$app.getApi("company/getBrandList", params, function (obj) {
            fn && fn(obj);
            }); 
        }
    },
    suggestInvestList: function (params, fn) {
        if(params.name){
            $$app.getApi("company/getInvestorList", params, function (obj) {
            fn && fn(obj);
            });
        }
    },
    suggestDeveloperList: function (params, fn) {
        if(params.name){
            $$app.getApi("company/getRealestateDeveloperList", params, function (obj) {
            fn && fn(obj);
            });
        }
    },
    getHistoryList: function (params, fn) {
        $$app.getApi("getMarketingHistoryList", params, function (obj) {
        fn && fn(obj);
        });
    },
    getPicAll: function (params, fn) {
        $$app.getApi("getPicAll", params, function (obj) {
            fn && fn(obj);
        });
    },
    getBindedPic: function (params, fn) {
        $$app.getApi("getBindedPic", params, function (obj) {
            fn && fn(obj);
        });
    },
    submitPic: function (params, fn) {
        $$app.getApi("submitPic", params, function (obj) {
            fn && fn(obj);
        });
    }
});

export default model;
