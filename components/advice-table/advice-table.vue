<template>
    <div>
    <el-table
      :data="tableData"
      style="width: 100%" 
      align="center" border>
      <el-table-column
        property="createTime"
        label="时间"
        align="center"
        show-overflow-tooltip
        width="180">
      </el-table-column>
      <el-table-column
        property="auditorName"
        label="处理人"
        width="150"
        show-overflow-tooltip
        align="left">
      </el-table-column>
      <el-table-column
        property="status"
        label="状态"
        width="100"
        show-overflow-tooltip
        align="center">
      </el-table-column>
      <el-table-column
        property="provinceName"
        label="省"
        align="left"
        show-overflow-tooltip
        width="120">
      </el-table-column>
      <el-table-column
        property="cityName"
        label="市"
        align="left"
        show-overflow-tooltip
        width="100">
      </el-table-column>
      <el-table-column
        property="projectName"
        label="所属楼盘"
        min-width="150"
        show-overflow-tooltip
        align="center">
      </el-table-column>
      <el-table-column
        property="from"
        label="来源"
        align="center"
        show-overflow-tooltip
        width="120">
      </el-table-column>
      <el-table-column
        inline-template
        label="操作"
        width="200"
        align="center" fixed="right" v-if="handle">
        <div>
            <el-button v-if="row.status === '待审核'" type="text" v-on:click="edit(row.id)">审核</el-button>
            <el-button v-else type="text" v-on:click="check(row.id)">查看</el-button>
        </div>
      </el-table-column>
    </el-table>
    <el-dialog :title="title" class="detail-form" v-model="detail">
        <div class="wrap">
            <div class="line">
                <span class="source" style="font-size: 14px;line-height: 22px;color:#666666;">反馈来源:&nbsp;&nbsp;<span><span><a :href="detailData.url" target="_blank" style="font-size: 14px;line-height: 22px;color:#20A0FF;">{{detailData.url}}</a></span>
            </div>
            <div class="line">
                <span class="source source-half" style="font-size: 14px;line-height: 22px;color:#666666;">联系方式:&nbsp;&nbsp;{{detailData.contact}}</span>&nbsp;&nbsp;
                <span class="source source-half" style="font-size: 14px;line-height: 22px;color:#666666;">反馈时间:&nbsp;&nbsp;{{detailData.createTime}}</span>
            </div>
            <!-- <el-input type="textarea" :disabled="true":autosize="{ minRows: 6}" v-model="detailData.content" class="detail" style="margin-top: 10px;"></el-input> -->
            <div style="background-color: #f8f8f8;border:1px solid #d8d8d8;text-align: left;margin-top: 10px;"><span style="padding: 10px;display: inline-block;line-height: 20px;word-wrap: break-word;color: rgb(102, 102, 102);">{{detailData.content}}</span></div>
            <div v-if="type === 'edit'" class="detail-button">
                <el-button type="primary" class="button-primary button-check" @click="accept(detailData.id)">采纳</el-button>
                <el-button type="danger" class="button-primary button-abort" @click="abort(detailData.id)" style="margin-left: 8px;">驳回</el-button>
            </div>
            <div v-else class="detail-button">
                <el-button type="primary" class="button-primary button-check" @click="detail = false">知道了</el-button>
            </div>
            <div v-if="type === 'edit'" class="change-type">
                <div class="change" @click="openChange" style="color: #666666;">不是我的锅?点此转发反馈至正确的位置</div>
                <div class="change" @click="openChange" style="color: #666666;">（例如：楼盘后台、入驻系统、论坛、广告系统等）</div>
            </div>
        </div>
    </el-dialog>
    <el-dialog title="这个反馈应该归属：" class="change-type-dialog" v-model="typeDialog">
        <div>
            <el-radio-group v-model="typeRadio"  v-for="item in radioGroup" class="basic-checkbox">
                <el-radio :label="item.key" >{{item.value}}</el-radio>
            </el-radio-group>
            <div class="change-button">
                <el-button type="primary" class="button-primary button-check" @click="submitChange()">提交</el-button>
                <el-button type="primary" class="button-primary button-abort" @click="typeDialog = false">取消</el-button>
            </div>
        </div>
    </el-dialog>
    </div>
  </template>
<style scoped>
    .source {
        font-size: 18px;
    }
    .source-half {
        width: 50%;
        display: inline-block;
    }
    .change-button {
        margin: 20px 0 0 0;
    }
    .change-type {
        margin: 15px 0 0 0;
    }
    .change-type .change {
        margin: 0 0 5px 0;
        color: #38a7ef;
        cursor: pointer;
    }
    .change .change-title {
        font-size: 18px;
    }
    .detail-button {
        margin: 20px 0 0 0;
    }
    .detail-form {
        text-align: center;
    }
    .detail-form .wrap {
        width: 800px;
    }
    .detail-form .line {
        text-align: left;
        font-size: 0;
    }
    .detail {
        margin: 20px 0 0 0;
    }
    .cancle-button {
        margin: 20px 0 0 0;
    }
    .el-button {
        padding:6px 10px;
        background:#E5E9F2;
        border: none;
        border-radius:3px;
        cursor:pointer;
        margin-left:3px;
        color: #333; 
        font-size: 14px;
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    }
    .el-button:hover {
        background:#D3DCE6;
        color: #333;
    } 
    .button-check {
        padding:6px 10px;
        background:#E5E9F2;
        border: none;
        border-radius:3px;
        cursor:pointer;
        margin-left:3px;
        color: #333; 
        font-size: 14px;
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    }
    .button-check:hover {
        background:#D3DCE6;
        color: #333;
    } 
    .button-primary {
        color: #fff;
        background-color: #20a0ff;
        border-color: #20a0ff;
        padding: 8px 15px;
        font-size: 16px;
    }
    .button-primary:hover {
        background: #4db3ff;
        border-color: #4db3ff;
        color: #fff;
    }
    .button-abort {
        background-color: #ff4949;
    }
    .button-abort:hover {
        background: #ff6d6d;
        border-color: #ff6d6d;
        color: #fff;
    }
</style>
<script>
import buildingModel from '../../model/building'
import buildingItemModel from '../../model/building-item'
import advice from '../../model/advice'
export default {
    data() {
        return {
            self_name: 'building-table',
            detail: false,
            typeDialog: false,
            tableData: [],
            typeRadio: '',
            radioGroup: [{
                key: 1,
                value: '楼盘审核后台'
            }, {
                key: 2,
                value: '入驻系统'
            }],
            detailData: [
                {
                    url: '',
                    contact: '',
                    content: ''
                }
            ],
            loupanId: '',
            targetId: '',
            type: '',
            title: '内容纠错-反馈详情',
            handle:false
        }
    },
    beforeMount : function() {
        var _self = this;
        var type = this.$route.params.adviceType;
        if (type === 'advice') {
            _self.title = '意见建议-反馈详情';
        } else {
            _self.title = '内容纠错-反馈详情';
        }
        buildingModel.on('searchBuilding', function (data) {
            _self.tableData = data.page.checkInfoList;
            if(_self.tableData.length == 0)
            {
                _self.handle = false;
            }
            else
            {
                _self.handle = true;

            }
        });
    },
    watch: {
        '$route': function (to, from) {
            var _self = this;
            var type = this.$route.params.adviceType;
            if (type === 'advice') {
                _self.title = '意见建议-反馈详情';
            } else {
                _self.title = '内容纠错-反馈详情';
            }
        }
    },
    methods: {
        getDetail: function (id) {
            var that = this;
            buildingModel.getAdvice({id: id}, function (data) {
                if (data.code === 200) {
                    that.detailData = data.data;
                    that.detail = true;
                } else {
                    that.$notify.error({
                        title: '查询失败',
                        message: '获取数据失败,请联系管理员',
                        duration: 2000
                    });
                }
            });
        },
        check: function (id) {
            var that = this;
            that.type = 'check';
            that.getDetail(id);
        },
        edit: function (id) {
            var that = this;
            that.type = 'edit';
            that.getDetail(id);
        },
        accept: function (id) {
            var that = this;
            advice.accept(id, function (res) {
                if (res.code === 200) {
                    that.$notify({
                        title: '操作成功',
                        message: '成功采纳一条内容',
                        type: 'success',
                        duration: 2000
                    });
                } else {
                    that.$notify({
                        title: '操作失败',
                        message: '服务器错误，请联系管理员',
                        type: 'error',
                        duration: 2000
                    });
                }
                that.detail = false;
            });
        },
        abort: function (id) {
            var that = this;
            advice.abort(id, function (res) {
                if (res.code === 200) {
                    that.$notify({
                        title: '操作成功',
                        message: '成功驳回一条内容',
                        type: 'success',
                        duration: 2000
                    });
                } else {
                    that.$notify({
                        title: '操作失败',
                        message: '服务器错误，请联系管理员',
                        type: 'error',
                        duration: 2000
                    });
                }
                that.detail = false;
            });
        },
        openChange: function () {
            var that = this;
            that.typeDialog = true;
            that.typeRadio = '';
        },
        submitChange: function () {
            var that = this;
            var params = {
                type: that.typeRadio,
                id: that.detailData.id
            };
            if (params.type === '') {
                that.$notify({
                    title: '操作失败',
                    message: '请选择一个要归属的平台',
                    type: 'error',
                    duration: 2000
                });
                return;
            }
            advice.change(params, function (res) {
                if (res.code === 200) {
                    that.$notify({
                        title: '修改成功',
                        message: '成功修改归属',
                        type: 'success',
                        duration: 2000
                    });
                } else {
                    that.$notify({
                        title: '修改失败',
                        message: '服务器错误，请联系管理员',
                        type: 'error',
                        duration: 2000
                    });
                }
                that.typeDialog = false;
                that.detail = false;
            });
        }
    }
}
</script>
