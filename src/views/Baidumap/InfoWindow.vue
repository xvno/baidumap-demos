<template>
  <div id="allmap" style="overflow: hidden; zoom: 1; position: relative">
    <div
      id="map"
      style="
        height: 100%;
        -webkit-transition: all 0.5s ease-in-out;
        transition: all 0.5s ease-in-out;
      "
    />
  </div>
</template>

<script>
export default {
  name: 'InfoWindow',
  data() {
    return {
      optsInfoWindow: {
        width: 200, // 信息窗口宽度
        height: 100, // 信息窗口高度
        title: '面积', // 信息窗口标题
        message: '',
      },
      infoWindow: null,
    };
  },
  created() {},

  async mounted() {
    const z = this;
    await this.loadAllLibsSync();

    const poi = new BMap.Point(116.403765, 39.91485); // 宇宙中心
    const map = new BMap.Map('map');
    z.map = map;

    map.centerAndZoom(poi, 13); //  设置中心点坐标和地图级别
    map.enableScrollWheelZoom(); //  启用鼠标滚动对地图放大缩小
    z.infoWindow = new BMap.InfoWindow('', z.optsInfoWindow);

    const pp = new BMap.Point(116.403765, 39.91485);
    const marker = new BMap.Marker(pp); // 创建标注
    map.addOverlay(marker); // 将标注添加到地图中
    console.log('pp: ', pp);

    const opts = {
      width: 200, // 信息窗口宽度
      height: 100, // 信息窗口高度
      title: '故宫博物院', // 信息窗口标题
      message: '这里是故宫',
    };

    const iwin = new BMap.InfoWindow('地址：北京市东城区', opts); // 创建信息窗口对象

    marker.addEventListener('click', () => {
      z.map.openInfoWindow(iwin, pp); // 开启信息窗口
    });
  },
  methods: {
    async loadAllLibsSync() {
      const arr = [
        // 'https://api.map.baidu.com/api?v=2.0&ak=t35wFVMYY4C4ZqCMh64qG4lpGkOgXbSy',
        'https://api.map.baidu.com/getscript?v=2.0&ak=t35wFVMYY4C4ZqCMh64qG4lpGkOgXbSy&services=&t=20200914160603',
        // 'https://api.map.baidu.com/api?type=webgl&v=1.0&ak=t35wFVMYY4C4ZqCMh64qG4lpGkOgXbSy',
        // 'https://api.map.baidu.com/getscript?type=webgl&v=1.0&ak=t35wFVMYY4C4ZqCMh64qG4lpGkOgXbSy&services=&t=20201104222554',
        'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js',
        // 'http://api.map.baidu.com/library/GeoUtils/1.2/src/GeoUtils_min.js',
      ];
      for (let i = 0; i < arr.length; i++) {
        console.log('url: ', arr[i]);
        await runItem(arr[i]);
      }

      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href =
        'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css';
      document.head.appendChild(cssLink);

      function runItem(src) {
        return new Promise((r, j) => {
          const scripts = document.createElement('script');
          scripts.src = src;
          document.head.appendChild(scripts);
          scripts.onload = function (e) {
            console.log(e);
            r();
          };
          setTimeout(() => {
            j();
          }, 10000);
        });
      }
    },
    clearAll() {
      for (let i = 0; i < this.overlays.length; i++) {
        this.map.removeOverlay(this.overlays[i]);
      }
      this.overlays.length = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
    #allmap {
      width: 100%;
      height: 900px;
      overflow: hidden;
    }
</style>
