<template>
    <div class="basic-information">
        <el-form :model="basicForm" :rules="rules" ref="basicForm" label-width="100px">
            <el-form-item label="楼盘名" prop="name">
                <el-input v-model="basicForm.name" placeholder="请输入楼盘名" class="basic-info-input"
                          :disabled="ifDisabled"></el-input>
                <div class="huxing-name-txt" v-if="basicForm.name != '' && edit_status !== 'check'">
                    当前已输入<em>{{basicForm.name.length}}</em>个字，您还可以输入<em>{{20-basicForm.name.length}}</em>个字。
                </div>
                <div class="huxing-name-txt" v-else>
                    最多输入20个字
                </div>
            </el-form-item>
            <el-form-item label="楼盘别名" prop="subTitle">
                 <el-input v-model="basicForm.subTitle" placeholder="请输入楼盘别名" class="basic-info-input"
                          :disabled="ifDisabled"></el-input>
                <div class="huxing-name-txt" v-if="basicForm.subTitle != '' && edit_status !== 'check'">
                    当前已输入<em>{{basicForm.subTitle.length}}</em>个字，您还可以输入<em>{{20-basicForm.subTitle.length}}</em>个字。
                </div>
                <div class="huxing-name-txt" v-else>
                    最多输入20个字
                </div>
            </el-form-item>
            <el-form-item label="关联楼盘" v-if="edit_status === 'index'">
                <el-input v-model="louPanSearchTxt" placeholder="请通过楼盘名称搜索" class="basic-info-input"
                          :disabled="ifDisabled" @change="remoteMethod"  @blur="linkloupanblur"></el-input>
                <div class="linkLouPan-select-dropdown" v-show="searchShow">
                    <ul>
                        <li v-for="(item,index) in searchResults" @click="loupanChose(index)">{{item.name}}</li>
                    </ul>
                </div>
                <div class="linkLouPan-name-txt">
                   （用于同一楼盘不同期数或不同物业类型新建详情页后，与旧的楼盘详情页产生关联作用；且默认为单向关联）
                </div>
                <el-tag
                v-for="(tag, index) in linkedTags"
                :closable="!ifDisabled"
                :type="tag.type"
                class="loupan-tags"
                @close="removeLinkedTags(index)">
                {{tag.name}}
                </el-tag>
            </el-form-item>
            <el-form-item label="楼盘地址" required prop="address">
                <BasicMap ref="map" v-bind:status="[edit_status]" :disabled="ifDisabled"/>
            </el-form-item>
            <el-form-item label="物业类型" prop="wuyeCheck">
                <el-checkbox-group v-model="basicForm.wuyeCheck" v-for="item in ui.propertyTypes"
                                   class="basic-checkbox">
                    <el-checkbox class="checkbox" :label="item.key+''" :disabled="ifDisabled">{{item.value}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="产权年限" prop="basicYear">
                <div class="left">
                    <el-input v-model="basicForm.cqYear" class="basic-year" :number="true"
                              :disabled="ifDisabled"></el-input>
                </div>
                <div class="left basic-year-info">年</div>
                </td>
            </el-form-item>
            <el-form-item label="产权描述" prop="chanquan">
                <el-input type="textarea"  :autosize="{ minRows: 4}"  v-model="basicForm.chanquan" placeholder="请输入产权描述"
                          class="basic-textarea" :disabled="ifDisabled" style="width: 600px;">
                </el-input>
                <div class="jj-txt" v-if="basicForm.chanquan != '' && edit_status !== 'check'">
                    当前已输入<em>{{basicForm.chanquan.length}}</em>个字，您还可以输入<em>{{200-basicForm.chanquan.length}}</em>个字。
                </div>
                <div class="jj-txt" v-else>
                    可输入200字
                </div>
            </el-form-item>
            <el-form-item label="建筑类型" prop="jianzhuCheck">
                <el-checkbox-group v-model="basicForm.jianzhuCheck" v-for="item in ui.constructTypes"
                                   class="basic-checkbox">
                    <el-checkbox class="checkbox" :label="item.key+''" :disabled="ifDisabled">{{item.value}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="项目特色" prop="xiangmuCheck">
                <el-checkbox-group v-model="basicForm.xiangmuCheck" v-for="item in ui.projFeatures"
                                   class="basic-checkbox project-character">
                    <el-checkbox class="checkbox" :label="item.key+''" :disabled="ifDisabled">{{item.value}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="装修情况" prop="zhuangxiuCheck">
                <el-checkbox-group v-model="basicForm.zhuangxiuCheck" v-for="item in ui.projDecorations" class="basic-checkbox">
                    <el-checkbox class="checkbox" :label="item.key+''" :disabled="ifDisabled">{{item.value}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="装修标准" prop="wy">
                <el-input v-model="basicForm.wy.decoStd" class="basic-info-input" :disabled="ifDisabled"></el-input>
                <span class="decorateUnit">元/平米</span>
            </el-form-item>
            <div v-if="edit_status === 'index'">
            <el-form-item label="开发商" prop="" class="withLabel" style="color: #5e6d82;">
                <el-input placeholder="请通过开发商名称搜索" v-model="developer" class="basic-info-input" :disabled="ifDisabled" @change="suggestList('developer')" @blur="blurSuggest('developer')">></el-input>
                <ul class="searchWrap" :class="{ listShow: developerListShow,listHide:!developerListShow }">
                    <li class="searchList" v-for="item in developerList"><span class="searchListContent" @mousedown="chooseList('developer', item)">{{item.name}}</span></li>
                </ul>
            </el-form-item>
            <div class="labelWrap">
                <el-tag :closable="true" :close-transition="false" class="labelContent" @close="handleClose(1,tag)" :key="tag" v-for="tag in developerTags">{{tag.name}}</el-tag>
                
            </div>
            <el-form-item label="投资商" prop="" class="withLabel" style="color: #5e6d82;">
                <el-input placeholder="请通过投资商名称搜索" v-model="invest" class="basic-info-input" :disabled="ifDisabled" @change="suggestList('invest')" @blur="blurSuggest('invest')"></el-input>
                <ul class="searchWrap" :class="{ listShow: investListShow,listHide:!investListShow }">
                    <li class="searchList" v-for="item in investList"><span class="searchListContent" @mousedown="chooseList('invest',item)">{{item.name}}</span></li>
                </ul>
            </el-form-item>
            <div class="labelWrap">
               <el-tag :closable="true" :close-transition="false" class="labelContent" @close="handleClose(2,tag)" :key="tag" v-for="tag in investTags">{{tag.name}}</el-tag>
            </div>
            <el-form-item label="品牌名称" prop="bd" class="withLabel" style="color: #5e6d82;">
                <el-input placeholder="请通过品牌商名称搜索" v-model="brand" class="basic-info-input" :disabled="ifDisabled" @change="suggestList('brand')" @blur="blurSuggest('brand')"></el-input>
                <ul class="searchWrap" :class="{ listShow: brandListShow, listHide:!brandListShow }">
                    <li class="searchList" v-for="item in brandList"><span class="searchListContent" @mousedown="chooseList('brand',item)">{{item.name}}</span></li>
                </ul>
            </el-form-item>
            <div class="labelWrap">
                <el-tag :closable="true" :close-transition="false" class="labelContent" @close="handleClose(3,tag)" :key="tag" v-for="tag in brandTags">{{tag.name}}</el-tag>
            </div>
            </div>
            <el-form-item label="开发商" prop="kfs" v-if="edit_status !== 'index'">
            <el-input v-model="basicForm.kfs" class="basic-info-input" :disabled="ifDisabled"></el-input>
            </el-form-item>
            <el-form-item label="物业公司" prop="wy">{{basicForm.wy.comany}}
                <el-input v-model="basicForm.wy.company" class="basic-info-input" :disabled="ifDisabled"></el-input>
            </el-form-item>
            <el-form-item label="物业费" prop="wyf">
                <div class="left">
                    <el-input class="basic-year" v-model="basicForm.wy.wyf" :disabled="ifDisabled">
                </div>
                <div class="left">
                    <el-select v-model="basicForm.wy.unit" :disabled="ifDisabled" style="width: 140px;">
                        <el-option label="元/平方米.月" value="0"></el-option>
                        <el-option label="元/套.月" value="1"></el-option>
                        <el-option label="元/户.年" value="2"></el-option>
                    </el-select>
                </div>
            </el-form-item>
            <el-form-item label="物业费描述" prop="wyInfo">
                <el-input type="textarea"  :autosize="{ minRows: 4}"  v-model="basicForm.wy.info" placeholder="请输入物业费描述"
                          class="basic-textarea" :disabled="ifDisabled" style="width: 600px;">
                </el-input>
                <div class="jj-txt" v-if="basicForm.wy.info != '' && edit_status !== 'check'">
                    当前已输入<em>{{basicForm.wy.info.length}}</em>个字，您还可以输入<em>{{200-basicForm.wy.info.length}}</em>个字。
                </div>
                <div class="jj-txt" v-else>
                    可输入200字                
                </div>
            </el-form-item>
            <el-form-item label="项目简介" prop="xmInfo">
                <el-input type="textarea" :autosize="{ minRows: 4}" v-model="basicForm.xmInfo" placeholder="请输入项目简介"
                          class="basic-textarea" :disabled="ifDisabled" style="width: 600px;">
                </el-input>
                <div class="jj-txt" v-if="basicForm.xmInfo != '' && edit_status !== 'check'">
                    当前已输入<em>{{basicForm.xmInfo.length}}</em>个字，您还可以输入<em>{{2000-basicForm.xmInfo.length}}</em>个字。
                </div>
                <div class="jj-txt" v-else>
                    可输入2000字
                </div>
            </el-form-item>
            <el-form-item label="审核理由" prop="shenhe" v-if="edit_status=='check'">
                <el-input type="textarea"  :autosize="{ minRows: 4}" :disabled="checkStatus !== 0"  v-model="basicForm.shenhe" placeholder="请输入审核理由"
                          class="basic-textarea" style="width: 600px;">
                </el-input>
                <div class="jj-txt" v-if="basicForm.shenhe != ''">
                    当前已输入<em>{{basicForm.shenhe.length}}</em>个字，您还可以输入<em>{{200-basicForm.shenhe.length}}</em>个字。
                </div>
                <div class="jj-txt2" v-else>
                    可输入200字(最少10个字)
                </div>
            </el-form-item>
            <el-form-item label=" " style="margin: 0 0 0 0;">
                <div v-if="edit_status === 'check'">
                <el-button type="primary" :disabled="checkStatus === 1 || checkStatus === 3" @click.native.prevent="shenheEvent(1)">通过</el-button>
                <el-button type="primary":disabled="checkStatus === 2 || checkStatus === 3 || checkStatus === 1" @click.native.prevent="shenheEvent(2)">驳回</el-button>
                </div>
                <div v-else>
                <el-button type="primary" v-if="edit_status === 'spider'" @click.native.prevent="handleSubmit">保存</el-button>
                <el-button type="primary" v-else @click.native.prevent="handleSubmit">一键发布</el-button>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>
<style scoped src="./basic-information.css">
</style>
<script src="./basic-information.js">
</script>
