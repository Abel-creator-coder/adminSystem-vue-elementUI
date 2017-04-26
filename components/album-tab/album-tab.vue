<template>
<div class="album-tab">
    <el-tabs @tab-click="tabClick" active-name="0">
        <el-tab-pane v-bind:label="tabUi[index].value+'('+tab[index].count+')'"  v-bind:name="tabUi[index].key+''" v-for="(item, index) in tabUi" :class="disabledClass">
            <el-row :gutter="20" style="margin-right: -15px;">
            <span>
            <el-col style="text-align: right;">
                <button class="addImg" v-if="edit_status !== 'check'" @click="dialogVisible = true" style="background-color:#f7ba2a;border: none; ">上传图片</button>
                <button class="delNums" v-if="edit_status !== 'check'" @click="delNums" style="margin-left: 10px;">批量删除</button>
                <el-dialog  class="dialog-wrap" title="上传图片" v-model="dialogVisible" size="tiny">
                    <el-upload :action="uploadurl"  :on-preview="handlePreview" :on-remove="handleRemove" :multiple="false" :before-upload="beforeupload">
                        <span>选择图片</span>
                        <el-button size="small" type="primary">浏览</el-button>
                        <div class="el-upload__tip" slot="tip">上传图片支持jpeg、png、jpg格式，单张大小为50K-2.5M，最小尺寸900*600(或600*900)，推荐尺寸1200*900(或900*1200)</div>
                        <span>{{uploadpic}}</span>
                    </el-upload>
                    <span>上传到</span>
                    <el-select v-model="uploadtype">
                        <el-option
                        v-for="item in options"
                        :label="item.value"
                        :value="item.key">
                        </el-option>
                    </el-select>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="danger" @click.native="addPhoto">开始上传</el-button>
                        <el-button @click.native="closeUpload">取消</el-button>
                    </span>
                </el-dialog>
            </el-col>
            </span>
        </el-row>
        <el-row :gutter="20" v-if="img.length == 0" class="noCotent">
        <el-col :span="24"><span>暂无数据！</span></el-col>
        </el-row>
        <el-row :gutter="20" v-for="(item, index) in img" v-if="index % 3==0 && img.length != 0">
            <el-col :span="8" v-if="img[index]">
                <el-card>
                    <a :href="imgDomainPour + img[index].imgUrl" target="_blank">
                    <img class="img" alt="" v-bind:src="imgDomain + img[index].imgUrl" v-if="img[index].imgUrl">
                    </a>
                    <input type="checkbox" v-if="edit_status !== 'check'" class="checkDel" v-bind:value="img[index].imgId"  v-model="checkList"/>
                    <button class="cover" v-if="(img[index].isCover !== 1) && edit_status !== 'check'" v-bind:value="img[index].imgId" @click="setCover">设为封面</button>
                    <button class="left" v-bind:value="img[index].imgId"  @click="changeImg" v-if="!(index==0&&currentPage==1) && (edit_status === 'index')"></button>
                    <button class="right" v-if="(edit_status === 'index') && (index < img.length - 1)"  v-bind:value="img[index].imgId" @click="changeImg"></button>
                    <button class="del" v-if="edit_status !== 'check'"v-bind:value="img[index].imgId" @click="delSingle(img[index])"></button>
                    <div class="change-type" v-if="edit_status === 'spider'">
                        <el-select v-model="img[index].photoType">
                            <el-option v-for="item2 in tabUi" :label.once="item2.value" :value.once="item2.key"  @click.native="changeType(img[index].photoId, item2.key, img[index].photoType)">
                            </el-option>
                        </el-select>
                    </div>
                </el-card>
             </el-col>
            <el-col :span="8" v-if="img[index+1]">
                <el-card>
                    <a :href="imgDomainPour + img[index + 1].imgUrl" target="_blank">
                    <img class="img" alt="" v-bind:src="imgDomain + img[index+1].imgUrl" v-if="img[index+1].imgUrl">
                    </a>
                    <input type="checkbox" v-if="edit_status !== 'check'" class="checkDel" v-bind:value="img[index+1].imgId"  v-model="checkList"/>
                    <button class="cover" v-if="(img[index + 1].isCover !== 1) && edit_status !== 'check'" v-bind:value="img[index+1].imgId" @click="setCover">设为封面</button>
                    <button class="left" v-if="edit_status === 'index'" v-bind:value="img[index+1].imgId"  @click="changeImg"></button>
                    <button class="right"v-if="edit_status === 'index' && (index + 1 < img.length - 1)" v-bind:value="img[index+1].imgId" @click="changeImg"></button>
                    <button class="del" v-if="edit_status !== 'check'" v-bind:value="img[index+1].imgId" @click="delSingle(img[index + 1])"></button>
                    <div class="change-type" v-if="edit_status === 'spider'">
                        <el-select v-model="img[index + 1].photoType">
                            <el-option v-for="item2 in tabUi" :label.once="item2.value" :value.once="item2.key"  @click.native.prevent="changeType(img[index + 1].photoId, item2.key, img[index + 1].photoType)">
                            </el-option>
                        </el-select>
                    </div>
                    </el-card>
             </el-col>
             <el-col :span="8" v-if="img[index+2]">
                <el-card>
                    <a :href="imgDomainPour + img[index + 2].imgUrl" target="_blank">
                    <img class="img" alt="" v-bind:src="imgDomain + img[index+2].imgUrl">
                    </a>
                    <input type="checkbox" v-if="edit_status !== 'check'" class="checkDel" v-bind:value="img[index+2].imgId"  v-model="checkList"/>
                     <button class="cover" v-if="(img[index + 2].isCover !== 1) && edit_status !== 'check'"v-bind:value="img[index+2].imgId" @click="setCover">设为封面</button>
                     <button class="left" v-if="edit_status === 'index'" v-bind:value="img[index+2].imgId"  @click="changeImg"></button>
                     <button class="right"v-if="edit_status === 'index' && (index + 2 < img.length - 1)" v-bind:value="img[index+2].imgId" @click="changeImg"></button>
                     <button class="del" v-if="edit_status !== 'check'" v-bind:value="img[index+2].imgId" @click="delSingle(img[index + 2])"></button>
                    <div class="change-type" v-if="edit_status === 'spider'">
                        <el-select v-model="img[index + 2].photoType">
                            <el-option v-for="item2 in tabUi" :label.once="item2.value" :value.once="item2.key"  @click.native.prevent="changeType(img[index + 2].photoId, item2.key, img[index + 2].photoType)">
                            </el-option>
                        </el-select>
                    </div>
                </el-card>
             </el-col>                
        </el-row>
        <div class="block">
        <el-pagination
          @current-change="currentChange"
          :current-page="currentPage"
          :page-size="9"
          layout="total , prev, pager, next, jumper"
          :total="totalImg"
          >
        </el-pagination>
        </div>
        </el-tab-pane>
    </el-tabs>
        <el-form v-if="edit_status === 'check'" :model="form2" label-width="100px" class="shenhe-form">
           <el-form-item label="审核意见">
                <el-input type="textarea" :autosize="{ minRows: 4}" :value="form2.shenhe" v-model="form2.shenhe" placeholder="请输入审核理由"
                      class="sh-left w400" :disabled="checkStatus !== 0"></el-input>
                <div class="jj-txt" v-if="form2.shenhe != ''">
                    当前已输入<em>{{form2.shenhe.length}}</em>个字，您还可以输入<em>{{200-form2.shenhe.length}}</em>个字。
                </div>
                <div class="jj-txt" v-else>
                    可输入200字(最少10个字)
                </div>
           </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSubmit(1)":disabled="checkStatus === 3 || checkStatus === 1">通过</el-button>
                <el-button type="primary" @click="handleSubmit(2)":disabled="checkStatus === 3 || checkStatus === 2 || checkStatus === 1">驳回</el-button>
              </el-form-item>
        </el-form>
    </div>
</template>

<style scoped>
    .change-type {
        position: absolute;
        left: 0;
        bottom: 22px;
        width: 125px;
    }
    .dialog-wrap {
        text-align: left;
    }
    .album-tab .masker{
        position: relative;
    }
    .album-tab .masker:after{
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 50px;
        width: 100%;
        min-height: 40px;
        background: #666;
        opacity: 0.2;
    }
    .w400{
        width:400px;
    }
    .jj-txt{
        float:left;
        margin:70px 0 0 10px;
        color:red;
    }
    .sh-left{
        float:left;
    }
    .shenhe-form{
        margin-top:30px;
    }
    .el-row {
        min-width: 810px;
    }
    .album-tab{
        font-family:微软雅黑, arial;
    }
    .album-tab .el-tabs__item{
        color:inherit;
        border:1px solid #bbbbbb;
    }
    .album-tab  .el-tabs__item.is-active {
        color:inherit;
        background-color:#fff;
    }
    .album-tab .el-tabs__active-bar{
        background-color:#d6d2d6;
        height:0;
    }
    .album-tab .el-card{
        position:relative;
        border:none;
        box-shadow:none;
    }
    .album-tab .el-card__body{
        padding:20px;
    }
    .album-tab .img{
        width:209px;
        height:227px;
    }
    .album-tab .el-card__body .el-checkbox{
        position:absolute;
        top:30px;
        left:30px;
    }
    .album-tab .el-card__body .el-button{
        position:absolute;
        top:170px;
        left:70px;
    }
    .album-tab .left{
        position:absolute;
        top:218px;
        left:151px;
        width:25px;
        height:25px;
        padding:0;
        background:url("./images/left.png") no-repeat center center;
        border-style:none;
        background-color:#e4e4e4;
        opacity:0.8;
    }
    .album-tab .left:hover{
        opacity:1;
    }
    .album-tab .right{
        position:absolute;
        top:218px;
        left:176px;
        width:25px;
        height:25px;
        background:url("./images/right.png") no-repeat center center;
        border-style:none;
        background-color:#e4e4e4;
        opacity:0.8;
    }
    .album-tab .right:hover{
        opacity:1;
    }
    .album-tab .el-button-primary:first-child{
        background-color:red;
        border-color:red;
    }
    .album-tab .el-button-primary:nth-child(2){
        background-color:#738ffe;
        border-color:#4e6cef;
    }
    .album-tab .el-pagination{
        float:right;
    }
    .album-tab .el-dialog__header{
        border-bottom:1px solid #efefef;
        padding-bottom:7px;
        padding-top:10px;
    }
    .album-tab .el-button-primary:nth-child(2){
        background-color:#f6f6f6;
        border-color:#e8e8e8;
        font-size:14px;
        color:black;
    }
    .album-tab .el-button-small{
        padding:9px 30px;
    }
    .album-tab .el-dialog--tiny{
        width:500px;
    }
    .album-tab .el-upload__tip{
        white-space:normal;
        margin-bottom:10px;
        line-height:18px;
    }
    .album-tab .el-upload{
        margin-bottom:5px;
    }
    .album-tab .el-dialog__body{
        padding:15px 20px;
    }
    .album-tab .el-tabs--border-card .el-tabs__item.is-active{
        border:1px solid #d3dce6;
    }
    .album-tab .el-select{
        display:inline-block;
        margin-right:5px;
    }
    .album-tab .el-input__inner{
        height:31px;
        width:106px;
    }
    .el-select-dropdown{
        z-index:1050!important;
    }
    .album-tab .checkDel{
        position:absolute;
        top:29px;
        left:29px;
        width:15px;
        height:15px;
    }
    .album-tab .del{
        position:absolute;
        top:218px;
        left:201px;
        width:25px;
        height:25px;
        background:url("./images/dustbin.png") no-repeat center center;
        border-style:none;
        background-color:#e4e4e4;
        opacity:0.8;
    }
    .album-tab .del:hover{
        opacity:1;

    }
    .album-tab .delNums{
        font-size:14px;
        padding:9px 17px;
        margin-right: 5px;
        background-color:#f6f6f6;
        border-style:none;
        border:1px solid #e8e8e8;
    }
    .album-tab .addImg{
        font-size:14px;
        color:white;
        padding:9px 17px;
        background-color:red;
        border-style:none;
        border:1px solid red;
    }
    .album-tab .noCotent{
        width:817px;
        height:50px;
        font-size:14px;
    }
    .album-tab .el-tabs__header{
        background-color:white;
    }
    .album-tab .el-tabs__item{
        background-color:#eff2f7;
    }
    .album-tab .cover{
        position:absolute;
        top:190px;
        left:90px;
        padding:3px 9px;
        background-color:#e4e4e4;
        opacity:0.8;
        border-style:none;
        　　-webkit-appearance:none;
    }
    .album-tab .cover:hover{
        opacity:1;
    }
</style>
<script>
    import $$upload from '../../lib/upload';
    import $$albumModel from '../../model/album';
    import $$buildingItem from '../../model/building-item';
    
    import imgDomain from '../../model/proxy/domain-img';
    import imgDomainPour from '../../model/proxy/domain-img-pour';
    import enumConf from '../../lib/enum.json';
    export default{
        props:['status'],
        data() {
            return {
                imgDomain: imgDomain,
                imgDomainPour: imgDomainPour,
                self_name: 'album-tab',
                activeName: 'first',
                edit_status: (this.status) && this.status[1],
                dataCache: null,
                disabledClass: '',
                checked: false,
                watermark: false,
                dialogVisible: false,
                curTabId : 0,
                type: "",
                form2 : {
                    shenhe : ''
                },
                img: [],
                imgMemory: {
                    status: 0,
                    memory: []
                },
                checkList: [],
                tab: [
                    { "count": 0, "type": 0},
                    { "count": 0, "type": 1},
                    { "count": 0, "type": 2},
                    { "count": 0, "type": 3},
                    { "count": 0, "type": 4},
                    { "count": 0, "type": 5},
                    { "count": 0, "type": 6},
                    { "count": 0, "type": -1}
                ],
                tabUi: enumConf.photoType,
                totalPage: 100,
                currentPage: 1,
                totalImg: 1,
                label: "1111",
                options: enumConf.photoType,
                uploadurl: '',
                uploadpic: '',
                uploadtype: '',
                newPicUrl: '',
                checkStatus: -1
            };
        },
        beforeMount: function () {
            var _self = this;
            if (this.edit_status === 'check') {
                //this.disabledClass = 'masker';
            }
            _self.tabUi = JSON.parse(JSON.stringify(_self.tabUi));
            _self.options = JSON.parse(JSON.stringify(_self.options));

            if (_self.edit_status === 'index') {
                _self.tabUi.pop();
                _self.options.pop();
            }

            $$albumModel.on('getAlbumList', (data) => {
                data = data.album;
                var type = _self.type;
                _self.dataCache = data;
                var beforePage = _self.currentPage;

                _self.tab = data.albumTabList;
                if (data.albumData[type] && data.albumData[type].thisPageList && data.albumData[type].pageInfo) {
                    _self.img = data.albumData[type].thisPageList;
                    _self.totalPage = data.albumData[type].pageInfo.totalPage;
                    _self.currentPage = data.albumData[type].pageInfo.curPage;
                    _self.totalImg = data.albumData[type].pageInfo.totalImg;
                    _self.checkStatus = data.albumData[type].pageInfo.checkStatus;
                    _self.form2.shenhe = data.albumData[type].pageInfo.audit || '';
                }
                _self.currentChange(beforePage);
            });

            _self.type = "0";
        },
        methods:{
            handleSubmit : function(type) {
                var that = this,txt= '';
                if(type==1){
                    txt = '已通过';
                }  else {
                    txt = '已驳回';
                }
                if ((that.form2.shenhe.length < 10 || that.form2.shenhe.length > 200) && type==2){
                    this.$notify.error({
                        title: '驳回失败',
                        message: '审核意见控制在10~200字之内',
                        duration: 2000
                    });
                    return false;
                }
                if (this.img && this.img.length) {
                    this.curTabId = this.img[0].photoType;
                }
                var data = {
                    'photoStyle' : this.curTabId,
                    'status' : type,
                    'comment' : that.form2.shenhe
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
            changeType: function (id, targetType, beforeType) {
                $$albumModel.changeType(id, targetType);
            },
            uploadHeader: () => {},
            handleRemove: (file, fileList) => {},
            handlePreview: (file) => {},
            beforeupload: function (file) {
                var that = this;
                // 直接reject 覆盖eleme的上传
                return new Promise(function (resolve, reject) {
                    $$upload('xc', file, function(res) { 
                        if (res.error) {
                            that.$notify.error({
                                title: '上传图片失败!',
                                message: res.error,
                                duration: 2000
                            });
                            return;
                        }
                        that.uploadpic = res.uploadPath;
                        that.newPicUrl = res.fullPath;
                    })
                })
            },
            addPhoto: function(){
                var that = this;
                if (that.uploadpic === '') {
                    that.$message({
                        type: 'warning',
                        message: "选择上传图片"
                    });
                    return false;
                }
                if (that.uploadtype === '') {
                    that.$message({
                        type: 'warning',
                        message: "选择上传类型"
                    });
                    return false;
                }
                var data = {
                    photoType: that.uploadtype,
                    photoUrl: that.uploadpic
                }
                $$albumModel.addPhoto(data, function() {
                    var type = that.uploadtype;
                    var data = that.dataCache;
                    data.albumData[type].thisPageList.unshift({
                        imgUrl: that.newPicUrl,
                        imgShowStatus: 1,
                        imgId: Math.random()
                    });
                    that.closeUpload();
                    $$albumModel.getAlbumList();
                })
            },
            closeUpload: function() {
                this.newPicUrl = "";
                this.uploadpic = "";
                // this.uploadtype = 0;
                this.dialogVisible = false;
            },
            currentChange: function (currentPage) {
                var _self = this;
                var ar = [];
                var data = _self.dataCache;
                var type = _self.type;
                var pages = data.albumData[type].thisPageList;
                ar = pages.slice((currentPage - 1) * 9, currentPage * 9);
                if (!ar.length && pages.length) {
                    var left = pages.length % 9;
                    var num = parseInt(pages.length / 9, 10);
                    currentPage = left === 0 ? num : num + 1;
                    ar = pages.slice((currentPage - 1) * 9, currentPage * 9);
                }
                _self.currentPage = currentPage;
                _self.img = ar;
            },
            tabClick: function(evt) {
                var _self = this;
                _self.type = evt.name;
                var type = _self.type;
                var data = _self.dataCache;
                if (data.albumData[type] && data.albumData[type].thisPageList && data.albumData[type].pageInfo) {
                    _self.img = data.albumData[type].thisPageList;
                    _self.totalPage = data.albumData[type].pageInfo.totalPage;
                    _self.currentPage = data.albumData[type].pageInfo.curPage;
                    _self.totalImg = data.albumData[type].pageInfo.totalImg;
                    _self.checkStatus = data.albumData[type].pageInfo.checkStatus;
                    _self.form2.shenhe = data.albumData[type].pageInfo.audit || '';
                }
                _self.currentChange(1);
            },
            delSingle: function (item) {
                var _self = this;
                var text = '确定要删除图片?';
                if (item.isCover && item.isCover === 1) {
                    text = '（当前图片是封面图）'+ text;
                }
                if (item.imgId) {
                    _self.$confirm(text, '提示', {
                        type: 'warning'
                    }).then(function () {
                        var delArr = [item.imgId];
                        //_self.vm_removeImgs({
                        //    ids: delArr
                        //});
                        $$albumModel.delAlbumList(delArr, function (data) {
                            if (data.code === 200) {
                                _self.$notify({
                                    title: '删除成功',
                                    message: '删除成功',
                                    type: 'success',
                                    duration: 2000
                                });
                            } else {
                                _self.$notify.error({
                                    title: '删除失败',
                                    message: '删除失败',
                                    type: 'success',
                                    duration: 2000
                                });
                            }
                        })
                        _self.checkList = [];
                    }).catch(function () {
                        _self.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            changeImg: function (evt) {
                var _self = this;
                if (evt.target.value && evt.target._prevClass) {
                    this.checkList.push(evt.target.value);
                    this.checkList.push(evt.target._prevClass);
                    _self.vm_moveImgs({
                        ids: _self.checkList
                    });
                    $$albumModel.setAlbumPosition(_self.checkList[0], ['left', 'right'].indexOf(_self.checkList[1]), function (res) {
                        if (res.code === 200) {
                            _self.$notify({
                                title: '改变顺序成功',
                                message: '改变顺序成功',
                                type: 'success',
                                duration: 2000
                            });
                        } else {
                            _self.$notify.error({
                                title: '改变顺序失败',
                                message: res.msg,
                                duration: 2000
                            });
                        }
                    });
                    _self.checkList = [];
                }
            },
            delNums: function (evt) {
                var _self = this;
                var text = '确定要删除图片?';
                _self.img.forEach(function (item, index) {
                    if (_self.checkList.indexOf(item.imgId) !== -1 && item.isCover && item.isCover === 1) {
                        text = '（批量删除中包含该类别的封面图）' + text;
                    }
                });
                _self.$confirm(text, '提示', {
                    type: 'warning'
                }).then(function () {
                    if (_self.checkList == "") {
                        alert("请选择删除项！");
                    } 
                    else {
                        //_self.vm_removeImgs({
                        //    ids: _self.checkList
                        //});
                        _self.checked = false;
                        $$albumModel.delAlbumList(_self.checkList, function (data) {
                            if (data.code === 200) {
                                _self.$notify({
                                    title: '删除成功',
                                    message: '删除成功',
                                    type: 'success',
                                    duration: 2000
                                });
                            } else {
                                _self.$notify.error({
                                    title: '删除失败',
                                    message: '删除失败',
                                    type: 'success',
                                    duration: 2000
                                });
                            }
                        });
                        _self.checkList = [];
                    }
                }).catch(function () {
                    _self.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            setCover: function (evt) {
                var _self = this;
                $$albumModel.setAlbumCover(evt.target.value , (res) => {
                    if (res.code === 200) {
                        this.$notify({
                            title: '设置封面成功',
                            message: '设置封面成功',
                            type: 'success',
                            duration: 2000
                        });
                        $$albumModel.getAlbumList();
                        _self.img.forEach(function (item, index) {
                            if (_self.img[index].photoId.toString() === evt.target.value) {
                                _self.img[index].isCover = 1;
                            } else {
                                _self.img[index].isCover = 0;
                            }
                        });
                    } else {
                        this.$notify.error({
                            title: '设置封面失败',
                            message: res.msg,
                            duration: 2000
                        });
                    }
                });
            },
            //viewModel函数
            vm_removeImgs: function (params) {
                var _self = this;
                //内存中运算,最后直接操作data
                var img = _self.img;
                var del = params.ids;
                var ar = [];
                var status = 0;//0状态为未找到
                for(let i in img) {
                    status = 0;//重置
                    for(let j in del){
                        if (!status && (img[i].imgId === params.ids[j]) ) {
                            status = 1;
                            break;
                        }
                        else if (!status && (img[i].imgId !== params.ids[j]) ){
                            status = 0;
                        }
                    }
                    //根据状态执行
                    if(status == 0) {
                        ar.push(img[i]);
                    }
                    else if (status == 1) {
                    }
                }
                _self.img = ar;
                _self.currentChange(1);
                _self.totalImg -= params.ids.length;
            },
            vm_moveImgs: function (params) {
                let _self = this;
                //内存中运算,最后直接操作data
                var img = _self.img;
                var mov = params.ids[0];//只会转移一个
                var d = params.ids[1];//转移方向
                var cacheBlock;
                var flagBlock;
                var j = 0;
                for (let i in img) {
                    if (img[i].imgId === mov) {
                        flagBlock = j;
                        break;
                    }
                    j++;
                }

                if ((d === 'left') &&  (flagBlock !== 0) && (img[flagBlock-1].imgShowStatus)) {
                    cacheBlock = img[flagBlock-1];
                    img[flagBlock-1] = img[flagBlock];
                    img[flagBlock] = cacheBlock;
                }
                else if ((d === 'right')  && (flagBlock !== j-1) && img[flagBlock+1]&& (img[flagBlock+1].imgShowStatus)) {
                    cacheBlock = _self.img[flagBlock];
                    img[flagBlock] = img[flagBlock+1];
                    img[flagBlock+1] = cacheBlock;
                }
                else {
                    console.log('不能交换');
                    return false;
                }
                _self.img = img;
            }
        }
    };
</script>
