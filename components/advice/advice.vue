<template>
    <div class="container">
        <select-component/>
        <table-component/>
        <paging-component/>
    </div>
</template>
<style scoped>
    .container {
        font-size: 14px;
        min-width: 1000px;
    }
</style>
<script>
    import SelectComponent from '../advice-select/advice-select.vue'
    import TableComponent from '../advice-table/advice-table.vue'
    import PagingComponent from '../advice-paging/advice-paging.vue'
    import buildingModel from '../../model/building'
    export default {
        data() {
            return {
                msg: 'hello vue'
            }
        },
        activated: function () {
            var type = this.$route.params.adviceType;
            buildingModel.setType('advice', type);
        },
        components: {
            'select-component': SelectComponent,
            'table-component': TableComponent,
            'paging-component': PagingComponent
        }
    }
</script>
