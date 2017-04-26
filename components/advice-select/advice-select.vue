<template>
    <div class="select-container">
        <div class="select-line1">
            <div class="loupan-inline">
                <span>省&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;份：</span>
                <el-select v-model="province"> <el-option v-for="item in news.provinceDate" :label.once="item.name" :value.once="item.id"  @click.native.prevent="getCity(item.id)">
                    </el-option>
                </el-select>
            </div>
            <div class="loupan-inline" style="margin-left: 30px;">
                <span>城&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;市：</span>
                <el-select v-model="city">
                    <el-option v-for="item in ne" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="loupan-name loupan-inline" style="margin-left: 30px;">
                <span class="loupan-id">楼盘名称：</span>
                <el-input class="loupan-name-con" placeholder="请输入楼盘名称" :number="true" v-model="projectName">
                </el-input>
            </div>
            <div class="loupan-inline query-btn hidden"> 查询</div>
        </div>
        <div class="select-line2">
            <div class="loupan-source loupan-inline">
                <span>来&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;源：</span>
                <el-select v-model="source">
                    <el-option v-for="item in select.moduleList" :label="item.value" :value="item.key">
                    </el-option>
                </el-select>
            </div>
            <div class="loupan-responsible loupan-inline" style="margin-left: 30px;">
                <span class="loupan-id">状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态：</span>
                <el-select v-model="status">
                    <el-option v-for="item in select.statusList" :label="item.value" :value="item.key">
                    </el-option>
                </el-select>
            </div>
            <div class="loupan-date" style="margin-left: 30px;display: inline-block;">
                <span class="loupan-id">反馈时间：</span>
                <el-date-picker
                v-model="date"
                type="daterange"
                placeholder="选择日期范围"
                :picker-options="pickerOptions"
                style="width: 220px">
                </el-date-picker>
            </div>
            <div class="loupan-inline query-btn" v-on:click="query">查询</div>
        </div>
    </div>
</template>
<style scoped>
    .hidden {
        visibility: hidden;
    }
    .select-container .loupan-source .el-select {
        width: 120px;
    }
    .select-container .info-content {
        width: auto;
    }
    
    .select-container .select-line1,
    .select-container .select-line2 {
        /*margin: 20px;
        display: flex;
        justify-content: space-between;*/
        margin-top: 20px;
        margin-bottom: 20px;
    }
    
    .select-container .loupan-inline {
        display: inline-block;
    }
    
    
    .select-container .el-select {
        width: 120px;
        display: inline-block;
    }
    
    .select-container .el-input {
        display: inline-block;
    }
    
    .select-container .loupan-id-con {
        width: 130px;
    }
    
    .select-container .loupan-name-con {
        width: 220px;
    }
    
    .select-container .loupan-responsible-con {
        width: 110px;
    }
    
    .select-container .el-input__inner {
        height: 35px;
        padding: 10px 0 10px 15px;
    }
    
    .select-container .el-select .el-input .el-input__icon {
        font-size: 16px;
    }
    
    .select-container .el-select-dropdown__item {
        padding: 0;
        width: 120px;
        height: 30px;
        line-height: 30px;
        padding-left: 15px;
    }
    .select-container .query-btn {
        padding: 10px 15px;
        background: #4db3ff;
        color: #fff;
        border-radius: 5px;
        cursor: pointer;
        margin-left: 22px;
        text-align: center;
        width: 60px;
    }
    .select-container .query-btn:hover {
        background: #20a0ff;
    }
</style>
<script>
import city from '../../script/city';
import enumConf from '../../lib/enum.json';
import buildingModel from '../../model/building';
export default {
    data() {
        return {
            self_name: 'building-select',
            select: {
                moduleList: [
                ],
                sourceList: [
                    {
                        label: '全部',
                    },
                    {
                        label: '爬虫',
                    },
                    {
                        label: '开发商',
                    },
                    {
                        label: '个人线索',
                    }
                ],
                statusList: enumConf.stateStatus
            },
            citySelect: '',
            province: '',
            city: '',
            source: '',
            status: '',
            projectName: '',
            startTime: '',
            endTime: '',
            date: '',
            type: 'error',
            pickerOptions: {
                disabledDate(time) {
                    return Date.now() < time;
                }
            },
            moduleType: enumConf.fromType,
            news: {
                provinceDate: []
            },
            ne: []
        }
    },
    beforeMount : function(){
        var _self = this;
        _self.type = _self.$route.params.adviceType;
        city.getProvince(function (data) {
            _self.select.moduleList = _self.select.moduleList.concat(_self.moduleType);
            _self.news.provinceDate = JSON.parse(JSON.stringify(data));
            _self.news.provinceDate.unshift({
                id: 0,
                name: '全部'
            });
        });
    },
    watch: {
        '$route': function (to, from) {
            var _self = this;
            _self.type = _self.$route.params.adviceType;
            _self.query();
        }
    },
    methods : {
        getCity: function (val){
            var _self = this;
            _self.ne = '', _self.city = '';
            city.getCity(val, function(data){
                _self.ne = JSON.parse(JSON.stringify(data));
                _self.ne.unshift({
                    id: 0,
                    name: '全部'
                });
            });
        },
        formatDate: function () {
            var that = this;
            if (that.date.length > 0) {
                that.date.forEach(function (item, index) {
                    if (index === 0) {
                        that.startTime = item ? item.getTime() : '';
                    } else if (index === 1) {
                        that.endTime = item ? item.getTime() : '';
                    }
                });
            }
        },
        query:function(){
            this.formatDate();
            var queryCondition = {
                "query":{
                    "type": this.type,
                    "province": this.province,
                    "city": this.city,
                    "status": this.status,
                    "from": this.source,
                    "projectName": this.projectName,
                    "startTime": this.startTime,
                    "endTime": this.endTime
                }
            };
            buildingModel.setSearchBuildingParams(queryCondition);
        }
    }
}
</script>
