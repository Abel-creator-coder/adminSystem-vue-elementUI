import $$buildingItem from '../../model/building-item'
import $$building from '../../model/building'
import BasicMap from '../../components/basic-map/basic-map.vue'
import enumConf from '../../lib/enum.json';
import format from '../../model/proxy/format.js'

export default{
    props: ['status'],
    data(){
        var validatorWuye = (rule, value, callback) => {
            var length = this.basicForm.wuyeCheck.length;
            if (length > 0) {
                callback();
            } else {
                callback(new Error('请至少选择一个物业类型'));
            }
        };
        var validatorUnit = (rule, value, callback) => {
            var wyf = this.basicForm.wy.wyf;
            var reg = /^\d+(\.\d{1,2})?$/;
            if (wyf && !reg.test(wyf)) {
                callback(new Error('物业费为至多两位小数的数字'));
            } else if (wyf && !this.basicForm.wy.unit) {
                callback(new Error('选择物业费之后请选择单位'));
            } else {
                callback();
            }
        };
        var validatorWyInfo = (rule, value, callback) => {
            var wyf = this.basicForm.wy.info;
            if (wyf && wyf.length > 200) {
                callback(new Error('物业费描述过长,请限制在200字以内'));
            } else {
                callback();
            }
        };
        var validatorKfs = (rule, value, callback) => {
            var wyf = this.basicForm.kfs;
            if (wyf && wyf.length > 50) {
                callback(new Error('开放商名字过长,请限制在50字以内'));
            } else {
                callback();
            }
        };
        var validatorWy = (rule, value, callback) => {
            var wyf = this.basicForm.wy.company;
            if (wyf && wyf.length > 50) {
                callback(new Error('物业公司名字过长,请限制在50字以内'));
            } else {
                callback();
            }
        };
        var validatorName = (rule, value, callback) => {
            var name = this.basicForm.name;
            if (!name.length) {
                callback(new Error('请输入楼盘名称'));
            } else if (name && name.length > 20) {
                callback(new Error('楼盘名字过长,请限制在20字以内'));
            } else {
                callback();
            }
        };
        var validatorXmInfo = (rule, value, callback) => {
            var name = this.basicForm.xmInfo;
            if (name && name.length > 2000) {
                callback(new Error('楼盘别名过长,请限制在2000字以内'));
            } else {
                callback();
            }
        };
        var validatorSubTitle = (rule, value, callback) => {
            var name = this.basicForm.subTitle;
            if (name && name.length > 20) {
                callback(new Error('楼盘别名过长,请限制在20字以内'));
            } else {
                callback();
            }
        };
        var validatorAddress = (rule, value, callback) => {
            var name = this.basicForm.subTitle;
            var map = this.$refs.map;
            var ids = map.ids;
            var address = map.basicMap.address_list.address;
            if (this.edit_status === 'check') {
                callback();
            } else if (!ids.provinceId && ids.provinceId !== 0) {
                callback(new Error('请选择省'));
            } else if (!ids.cityId && ids.cityId !== 0) {
                callback(new Error('请选择城市'));
            } else if (!ids.districtId && ids.districtId !== 0) {
                callback(new Error('请选择区'));
            } else if (address && address.length > 50) {
                callback(new Error('楼盘地址过长,请限制在50字以内'));
            } else {
                callback();
            }
        };
        var validatorCQdetail = (rule, value, callback) => {
            var detail = this.basicForm.chanquan;
            if (detail && detail.length > 200) {
                callback(new Error('产权描述过长,请限制在200字以内'));
            } else {
                callback();
            }
        };
        var validatorCQyear = (rule, value, callback) => {
            var year = this.basicForm.cqYear;
            var reg = /^\d+$/;
            if (year && !reg.test(year)) {
                callback(new Error('产权年限只能输入正整数'));
            } else {
                callback();
            }
        };
        return {
            self_name: 'basic-information',
            developerTags: [],
            investTags: [],
            brandTags: [],
            linkedTags: [],
            kaifashang:"",
            developer:"",
            developerList:[],
            developerListShow:false,
            invest:"",
            investList:[],
            investListShow:false,
            brand:"",
            brandList:[],
            brandListShow:false,
            all_funs: this.status,
            func: (this.status) && (this.status)[0],
            edit_status: (this.status) && this.status[1],
            ifDisabled: false,
            wuyeCheckList: [],
            jianzhuCheckList: [],
            xiangmuCheckList: [],
            zhuangxiuCheckList: [],
            basicForm: {
                name: '',
                subTitle: '',
                cqYear: '',
                chanquan: '',
                jianzhuCheck: [],
                xiangmuCheck: [],
                zhuangxiuCheck: [],
                wuyeCheck: [],
                kfs: '',
                wy: {
                    decoStd: '',
                    company: '',
                    wyf: '',
                    unit: '',
                    info: ''
                },
                unit: '',
                wyf: '',
                wyInfo: '',
                xmInfo: '',
                long: '',
                latitude: '',
                shenhe: '',
                relationList: []
            },
            rules: {
                name: [{
                    required: true, 
                    trigger: 'blur',
                    validator: validatorName
                }],
                subTitle: [{
                    trigger: 'blur',
                    validator: validatorSubTitle
                }],
                address: [{
                    required: true, 
                    trigger: 'blur',
                    validator: validatorAddress
                }, {
                    required: true,
                    trigger: 'change',
                    validator: validatorAddress
                }],
                    wuyeCheck: [
                    {
                        type: 'array',
                        required: true,
                        message: '请至少选择一个物业类型',
                        trigger: 'blur',
                        validator: validatorWuye
                    }
                    ],
                    wyf: [{
                        trigger: 'blur',
                        validator: validatorUnit
                    }],
                    wyInfo: [{
                        trigger: 'blur',
                        validator: validatorWyInfo
                    }],
                    xmInfo: [{
                        trigger: 'blur',
                        validator: validatorXmInfo
                    }],
                    kfs: [{
                        trigger: 'blur',
                        validator: validatorKfs
                    }],
                    wy: [{
                        trigger: 'blur',
                        validator: validatorWy
                    }],
                    basicYear: [{
                        trigger: 'blur',
                        validator: validatorCQyear
                    }],
                    chanquan: [{
                        trigger: 'blur',
                        validator: validatorCQdetail
                    }]
            },
            ui: enumConf,
            checkStatus: -1,
            searchResults: [],
            tagInput: "",
            loading: false,
            searchShow: false,
            louPanSearchTxt: "",
            louPanTimeToken: ""
        }
    },
    components: {
        BasicMap
    },
    beforeMount: function () {
        var that = this;

        if (that.edit_status === 'check') {
            that.ifDisabled = true;
        }

        $$buildingItem.on('getCurrentItem', function (data) {
            that.clearBasic();
            that.linkedTags = [];
            if(data.basic_info.relationList){
                data.basic_info.relationList.forEach(function(value){
                    that.linkedTags.push({
                        type: 'gray',
                        id: value.relationPid,
                        name: value.relationProjName,
                    });
                });
            }
            that.basicForm = window._.extend(that.basicForm, data.basic_info);
            that.basicForm.wy.company = that.basicForm.wy.company || '';
            that.basicForm.wy.wyf = that.basicForm.wy.wyf || '';
            that.basicForm.wy.unit = that.basicForm.wy.unit || '';
            that.basicForm.wy.info = that.basicForm.wy.info || '';
            that.wuyeCheckList = data.basic_info.propertyTypes;
            that.jianzhuCheckList = data.basic_info.constructTypes;
            that.xiangmuCheckList = data.basic_info.projFeatures;
            that.zhuangxiuCheckList = data.basic_info.projDecorations;
            that.checkStatus = data.basic_info.checkStatus;
            that.basicForm.shenhe = data.basic_info.audit || '';
            that.brandTags = data.basic_info.brandTags || [];
            that.investTags = data.basic_info.investTags || [];
            that.developerTags = data.basic_info.developerTags || [];
            if (!that.developerTags.length) {
                that.developer = that.basicForm.kfs;
            } else {
                that.developer = '';
            }
        });

        $$buildingItem.on('setPosition', function (data) {
            that.basicForm.long = data.geoLng;
            that.basicForm.latitude = data.geoLat;
        });

        $$buildingItem.on('setAddress', function (data) {
            this.basicForm.address_list= data;
        });
    },
    methods: {
        hasNot: function (tags, value) {
            var flag = true;
            var k;
            for (k of tags) {
                if (parseInt(k.id, 10) === parseInt(value.id, 10)) {
                    flag = false;
                    break;
                }
            }
            return flag;
        },
        chooseList:function(type, value){
            var self = this;
            switch(type)
            {
                case 'brand':
                    if (self.hasNot(self.brandTags, value)) {
                        self.brandTags.push(value);
                    }
                    self.brand = "";
                    self.brandListShow = false;
                    break;
                case "invest":
                    if (self.hasNot(self.investTags, value)) {
                        self.investTags.push(value);
                    }
                    self.invest = "";
                    self.investListShow = false;
                    break;
                case "developer":
                    if (self.hasNot(self.developerTags, value)) {
                        self.developerTags.push(value);
                    }
                    self.developer = "";
                    self.developerListShow = false;
                    break;
            }
        },
        suggestList:function(type){
            var self = this;
            var parm = {};
            switch(type)
            {
                case 'brand':
                    self.brandList.length = 0;
                    parm.name = self.brand;
                    $$buildingItem.suggestBrandList(parm,function(data){
                        if(parseInt(data[0].code) == 1&&data[0].data.length > 0)
                        {
                            data[0].data.forEach(function(item){
                                self.brandList.push({
                                    name: item.brandName,
                                    id: item.brandId
                                });
                            });
                            if(self.brand)
                                self.brandListShow = true;
                            else
                                self.brandListShow = false;
                        }
                    });
                    break;
                case 'invest':
                    self.investList.length = 0;
                    parm.name = self.invest;
                    $$buildingItem.suggestInvestList(parm,function(data){
                        if(parseInt(data[0].code) == 1&&data[0].data.length > 0)
                        {
                            data[0].data.forEach(function(item){
                                self.investList.push({
                                    id: item.investorId,
                                    name: item.investorName
                                });
                            });
                            if(self.invest)
                                self.investListShow = true;
                            else
                                self.investListShow = false;
                        }
                    });
                    break;
                case 'developer':
                    self.developerList.length = 0;
                    parm.name = self.developer;
                    $$buildingItem.suggestDeveloperList(parm,function(data){
                        if(parseInt(data[0].code) == 1&&data[0].data.length > 0)
                        {
                            data[0].data.forEach(function(item){
                                self.developerList.push({
                                    name: item.realestateDeveloperName,
                                    id: item.developerId
                                });
                            });
                            if(self.developer)
                                self.developerListShow = true;
                            else
                                self.developerListShow = false;
                        }
                    });
                    break;
            }
        },
        blurSuggest: function (type) {
            var that = this;
            var map = {
                developer: 'developerListShow',
                invest: 'investListShow',
                brand: 'brandListShow'
            };
            that[map[type]] = false;
        },
        handleClose:function(type,tag) {
                switch(type)
                {
                    case 1:
                        this.developerTags.splice(this.developerTags.indexOf(tag), 1);
                        break;
                    case 2:
                        this.investTags.splice(this.investTags.indexOf(tag), 1);
                        break;
                    case 3:
                        this.brandTags.splice(this.brandTags.indexOf(tag), 1);
                        break;
                }
        },
        clearBasic: function () {
            var that = this;
            that.basicForm = {
                name: '',
                subTitle: '',
                cqYear: '',
                chanquan: '',
                jianzhuCheck: [],
                xiangmuCheck: [],
                zhuangxiuCheck: [],
                wuyeCheck: [],
                kfs: '',
                wy: {
                    company: '',
                    wyf: '',
                    unit: '',
                    info: ''
                },
                unit: '',
                wyf: '',
                wyInfo: '',
                xmInfo: '',
                long: '',
                latitude: '',
                shenhe: '',
                relationList: []
            };
        },
        handleReset() {
            this.$refs.basicForm.resetFields();
        },
        handleCancle() {
        },
        linkloupanblur: function(){
            setTimeout(() => {
                this.searchShow = false;
            }, 200);
        },
        remoteMethod: function(){
            var that = this;
            if (this.louPanSearchTxt.trim() !== '') {
                if(that.louPanTimeToken){
                    clearTimeout(that.louPanTimeToken);
                }
                that.louPanTimeToken = setTimeout(() => {
                    var params = {
                        q_word: that.louPanSearchTxt,
                        city_id: that.basicForm.address_list.cityId
                    }
                    that.searchResults = [];

                    $$buildingItem.getLinkItem(params, function(data){
                        if(data && data.length){
                            that.searchResults = data;
                            that.searchShow = true;
                        }else{
                            that.searchShow = false;
                        }
                    });
                }, 200);
            } else {
                this.searchResults = [];
                this.searchShow = false;
            }
        },
        loupanChose: function(index){
            var temptag = this.searchResults.splice(index, 1);
            this.linkedTags.push({ name: temptag[0].name, type: 'gray', id: temptag[0].id });
            this.searchShow = false;
            this.louPanSearchTxt = "";
        },
        removeLinkedTags: function(index){
            this.linkedTags.splice(index, 1);
        },
        shenheEvent : function(type) {
            var that = this,txt= '';
            if(type==1){
                txt = '已通过';
            }  else {
                txt = '已驳回';
            }
            if ((that.basicForm.shenhe.length < 10 || that.basicForm.shenhe.length > 200) && type==2){
                this.$notify.error({
                    title: '驳回失败',
                    message: '审核意见控制在10~200字之内',
                    duration: 2000
                });
                return false;
            }
            var data = {
                'status' : type,
                'comment' : that.basicForm.shenhe
            }
            $$buildingItem.setAuditItem(data, function (data) {
                if (data.code === 200) {
                    that.$notify({
                        title: txt,
                        message: '',
                        type: 'success',
                        duration: 2000
                    });
                } else if (data.code === 405) {
                    that.$notify.error({
                        title: '驳回失败',
                        message: '已经通过的消息无法驳回',
                        duration: 2000
                    });
                } else {
                    that.$notify.error({
                        title: '操作失败',
                        message: '服务器错误,请联系相关管理员',
                        duration: 2000
                    });
                }
            });
        },
        handleSubmit(ev) {
            var that = this;
            this.$refs.basicForm.validate((valid) => {
                if (valid) {
                    var lpId = $$buildingItem.getPid();
                    that.basicForm.relationList = [];
                    that.linkedTags.forEach(function(value){
                        that.basicForm.relationList.push({
                            pid: parseInt(lpId),
                            relationPid: parseInt(value.id)
                        })
                    });
                    that.basicForm.projInvestor = format.objArrToString(that.investTags, 'id');
                    that.basicForm.projBrand = format.objArrToString(that.brandTags, 'id');
                    that.basicForm.projRealestateDeveloper = format.objArrToString(that.developerTags, 'id');
                    var data = {
                        basic: that.basicForm
                    };
                    var map = that.$refs.map;
                    $$buildingItem.setPosition(map.long, map.latitude);
                    _.extend(data.basic.address_list, map.ids);
                    data.basic.address_list.business_list = [];
                    data.basic.address_list.areaId.forEach(function (item, index) {
                        data.basic.address_list.business_list.push({
                            id: index,
                            name: item
                        });
                    });
                    $$buildingItem.updateItem(data, function(datas) {
                        if (datas.code === 200) {
                            that.$notify({
                                title: '发布成功',
                                message: '恭喜你发布成功',
                                type: 'success',
                                duration: 2000
                            });
                            var type = $$building.getType();
                            var lpId = $$buildingItem.getPid();
                            var path = '';
                            if (type === 'spider') {
                                path = 'spiderInfo';
                            } else {
                                path = 'buildInfo';
                            }
                            that.$router.push({
                                path: '/' + path + '?cityId=' + data.basic.address_list.cityId + '&loupanId=' + lpId,
                            });
                            $$buildingItem.getCurrentItem();
                        }
                    });
                }
                else {
                    this.$notify.error({
                        title: '提交失败',
                        message: '信息填写有误或不符合要求',
                        duration: 2000
                    });
                    return false;
                }
            })
        },
        checkChange: function(key) {
            this.basicForm.zhuangxiuCheck = [key.toString()];
        }
    }
};
