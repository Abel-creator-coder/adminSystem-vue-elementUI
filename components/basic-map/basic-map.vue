<template>
    <div>
        <div class="basic-info-div">
            <address-select v-model="ids" v-bind:disabled="ifDisabled" />
        </div>
        <div class="basic-info-div">
            <el-input type="textarea" v-model="basicMap.address_list.address" :disabled="edit_status === 'check'" placeholder="请输入楼盘详细地址"
                      class="basic-info-text" style="vertical-align: middle;margin-bottom: 10px;"></el-input>
            <div class="huxing-name-txt" v-if="basicMap.address_list.address != '' && edit_status !== 'check'" style="display: inline-block;vertical-align: middle;margin-left: 10px;color: #999;">
                当前已输入<em>{{basicMap.address_list.address.length}}</em>个字，您还可以输入<em>{{50-basicMap.address_list.address.length}}</em>个字。
            </div>
            <div class="huxing-name-txt" v-else>
                最多输入20个字
            </div>
        </div>
        <div class="basic-map" id="container">
        </div>
    </div>
</template>
<style scoped>
    .basic-info-div {
        overflow: hidden;
        margin-bottom: 10px;
    }

    .basic-info-div .basic-info-list {
        float: left;
        width: 180px;
        margin-right: 15px;
    }

    .basic-map {
        width: 520px;
        height: 200px;
        clear: both;
        margin-top: 10px;
    }
    .basic-info-text{
        width: 400px;
    }
</style>
<script>
    import addressSelect from '../../lib/vue/address-select.vue'
    import $$buildingItem from '../../model/building-item'
    import city from '../../script/city';
    export default{
        components: {
            addressSelect: addressSelect
        },
        props: ['status'],
        data(){
            return {
                self_name: 'basic-map',
                edit_status: (this.status) && this.status[0],
                ids: null,
                basicMap: {
                    address_list: {
                        business_listId: '',
                        address: ''
                    }
                },
                citysOptions: '',
                districtsOptions: '',
                areasOptions: '',
                long: '',
                latitude: '',
                ifDisabled: false
            }
        },
        methods: {
            getCity: function (id) {
                var that = this;
                city.getCity(id, function (data) {
                    that.city = data;
                });
            },
            getDistrict: function (id) {
                var that = this;
                city.getZone(id, function (data) {
                    that.district = data;
                });
            },
            getAreas: function (id) {
                var that = this;
                city.getArea(id, function (data) {
                    that.business_list = data;
                });
            }
        },
        beforeMount: function () {
            var that = this;
            $$buildingItem.on('getCurrentItem', function (data) {
                if (that.edit_status == 'check') {
                    that.ifDisabled = true;
                }
                data = data.basic_info;

                var areaId = [];
                data.address_list.business_list.forEach(function (item) {
                    if (item.name && parseInt(item.name, 10) !== NaN) {
                        areaId.push(parseInt(item.name, 10));
                    }
                });
                that.ids = {
                    provinceId: data.address_list.provinceId,
                    cityId: data.address_list.cityId,
                    districtId: data.address_list.districtId,
                    areaId: areaId
                };
                that.long = data.long;
                that.latitude = data.latitude;
                that.basicMap = data;
                data.address_list.ids = that.ids;
                that.basicMap.address_list.address = data.address_list.address || '';

                if (!window.AMap) {
                    return;
                }
                var map = new AMap.Map('container', {
                    resizeEnable: true,
                    zoom: 10,
                    center: [data.long || '116.3', data.latitude || '39.9']
                });
                AMap.plugin('AMap.Geocoder', function () {
                    var geocoder = new AMap.Geocoder({
                        city: "010"//城市，默认：“全国”
                    });
                    var marker = new AMap.Marker({
                        map: map,
                        bubble: true
                    })
                    var input = document.getElementById('basicAddress');
                    //var message = document.getElementById('message');
                    map.on('click', function (e) {
                        $$buildingItem.setPosition(e.lnglat.lng, e.lnglat.lat);
                        that.long = e.lnglat.lng;
                        that.latitude = e.lnglat.lat;
                        marker.setPosition(e.lnglat);
                        geocoder.getAddress(e.lnglat, function (status, result) {
                            if (that.ifDisabled) {
                                return false;
                            }
                            if (status == 'complete') {
                                that.basicMap.address_list.address = result.regeocode.formattedAddress;
                            }
                            else {
                                that.basicAddress = '无法获取地址';
                            }
                        })
                    })
                });
                $$buildingItem.on('selectLng', function (data) {
                    map.setZoomAndCenter(10, [data.geoLng, data.geoLat]);
                    that.long = data.geoLng;
                    that.latitude = data.geoLat;
                });
                if (that.ids.districtId) {
                    city.getZone(that.ids.cityId, function (data) {
                        data.forEach(function (item) {
                            if (item.id === that.ids.districtId) {
                                if (map && !that.long && !that.latitude) {
                                    map.setZoomAndCenter(10, [item.geoLng, item.geoLat]);
                                    that.long = item.geoLng;
                                    that.latitude = item.geoLat;
                                }
                            }
                        });
                    });
                } else if (that.ids.cityId) {
                    city.getCity(that.ids.provinceId, function (data) {
                        data.forEach(function (item) {
                            if (item.id === that.ids.cityId) {
                                if (map && !that.long && !that.latitude) {
                                    map.setZoomAndCenter(10, [item.geoLng, item.geoLat]);
                                    that.long = item.geoLng;
                                    that.latitude = item.geoLat;
                                }
                            }
                        });
                    });
                }
            });
        }
    }
</script>
