<template>
    <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="loupanPageInfo.itemCount">
        </el-pagination>
    </div>
</template>
<style scoped>
    .block {
        float: right;
        margin-top: 20px;
    }
    .block .el-pager li.active {
        border-color: #8492A6;
        background-color: #8492A6;
    }
    .block .el-pager li:hover {
        color: #8492A6;
    }
    .block .el-pager li.active:hover {
        color: #fff;
    }
    .block .el-pagination button:hover {
        color: #324057;
    }
    .block .el-pagination button.disabled:hover {
        color: #e4e4e4;
    }
    .block .el-pager li,.block .el-pagination button,.block .el-pagination span {
        font-size: 14px;
    }
</style>
<script>
    import buildingModel from '../../model/building'
    export default {
        data() {
            return {
                self_name: 'building-paging',
                loupanPageInfo: {},
                currentPage:1,
                pageSize:10
            }
        },
        beforeMount: function () {
            var _self = this;
            buildingModel.on('searchBuilding', function (data) {
                _self.loupanPageInfo = data.page;
                _self.currentPage = data.page.pageIndex;
            });
        },
        methods: {
            handleCurrentChange: function (val) {
                buildingModel.setSearchBuildingParams({
                    "page": {
                        "pageNum": val
                    }
                });
            }
        }
    }
</script>
