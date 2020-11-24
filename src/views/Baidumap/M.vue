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
  name: 'M',
  data() {
    return {};
  },
  created() {},

  async mounted() {
    await this.loadAllLibsSync();

    // const poi = new BMap.Point(116.307852, 40.057031);
    const map = new BMap.Map('map');
    window.bmap = map;
    map.centerAndZoom(new BMap.Point(116.403765, 39.91485), 12); //  设置中心点坐标和地图级别
    map.enableScrollWheelZoom(); //  启用鼠标滚动对地图放大缩小

    // 鼠标绘制完成回调方法   获取各个点的经纬度
    const overlays = [];
    window.overlays = overlays;
    const styleOptions = {
      strokeColor: 'red', // 边线颜色。
      fillColor: '#CD3333', // 填充颜色。当参数为空时，圆形将没有填充效果。
      strokeWeight: 2, // 边线的宽度，以像素为单位。
      strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
      fillOpacity: 0.5, // 填充的透明度，取值范围0 - 1。
      strokeStyle: 'solid', // 边线的样式，solid或dashed。
    };

    // 实例化鼠标绘制工具
    const drawingManager = new BMapLib.DrawingManager(map, {
      isOpen: false, // 是否开启绘制模式
      enableDrawingTool: true, // 是否显示工具栏
      // drawingMode: BMAP_DRAWING_POLYGON, // 绘制模式  多边形
      drawingToolOptions: {
        anchor: BMAP_ANCHOR_TOP_RIGHT, // 位置
        offset: new BMap.Size(5, 5), // 偏离值
        // drawingModes: [BMAP_DRAWING_POLYGON],
      },
      polygonOptions: styleOptions, // 多边形的样式
      circleOptions: styleOptions,
      rectangleOptions: styleOptions,
      polylineOptions: styleOptions,
    });

    // 添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', overlayComplete);
    drawingManager.addEventListener('polygoncomplete', polygonComplete);

    function overlayComplete(e) {
      console.log('Overlay complete: ', e.overlays);
      overlays.push(e.overlay);
      window.eo = e.overlay;
      e.overlay.enableEditing();
    }

    function polygonComplete(e) {
      const path = e.overlay.getPath(); // Array<Point> 返回多边型的点数组
      console.info('路径点的数量: ', path.length);
      console.group('Area-----');
      console.log(BMapLib.GeoUtils.getPolygonArea(path), ' 平方米');
      console.groupEnd('-----Area');
      e.overlay.enableEditing();
    }

    function clearAll() {
      for (let i = 0; i < overlays.length; i++) {
        map.removeOverlay(overlays[i]);
      }
      overlays.length = 0;
    }
  },
  methods: {
    async loadAllLibsSync() {
      const arr = [
        'https://api.map.baidu.com/api?v=2.0&ak=t35wFVMYY4C4ZqCMh64qG4lpGkOgXbSy',
        'https://api.map.baidu.com/getscript?v=2.0&ak=t35wFVMYY4C4ZqCMh64qG4lpGkOgXbSy&services=&t=20200914160603',
        'https://api.map.baidu.com/api?type=webgl&v=1.0&ak=t35wFVMYY4C4ZqCMh64qG4lpGkOgXbSy',
        'https://api.map.baidu.com/getscript?type=webgl&v=1.0&ak=t35wFVMYY4C4ZqCMh64qG4lpGkOgXbSy&services=&t=20201104222554',
        'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js',
        'http://api.map.baidu.com/library/GeoUtils/1.2/src/GeoUtils_min.js',
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
