<template>
  <div id="allmap" style="overflow: hidden; zoom: 1; position: relative">
    <div
      id="map"
      style="
        height: 100%;
        width: 50%;
        display: inline-block;
        -webkit-transition: all 0.5s ease-in-out;
        transition: all 0.5s ease-in-out;
      "
    />
    <div
      id="detail"
      style="height: 100%; width: 50%; display: inline-block; padding: 2em"
    >
      <el-table :data="polygonTable">
        <el-table-column prop="name" label="名" />
        <el-table-column prop="area" label="面积" />
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="viewPolygon(scope.row)">
              查看
            </el-button>

            <el-button v-if="scope.row.isHidden" type="text" size="small" @click="hidePolygon(scope.row)">
              显示
            </el-button>
            <el-button v-else type="text" size="small">
              隐藏
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'M',
  data() {
    return {
      defaultFillColor: '#CD3333',
      hoverFillColor: '#008CFF', // 'HSLA(240, 70%, 81%, 0.7)',
      /**
       * 消息窗
       */
      optsInfoWindow: {
        width: 200, // 信息窗口宽度
        height: 100, // 信息窗口高度
        title: '面积', // 信息窗口标题
        message: ''
      },
      polygonTable: []
    };
  },
  created() {},

  async mounted() {
    const z = this;
    window.dt = z.polygonTable;
    await this.loadAllLibsSync();

    const poi = new BMap.Point(116.403765, 39.91485); // 宇宙中心
    const map = new BMap.Map('map');
    z.map = map;
    map.centerAndZoom(poi, 12); //  设置中心点坐标和地图级别
    map.enableScrollWheelZoom(); //  启用鼠标滚动对地图放大缩小

    const styleOptions = {
      strokeColor: 'red', // 边线颜色。
      fillColor: z.defaultFillColor, // 填充颜色。当参数为空时，圆形将没有填充效果。
      strokeWeight: 2, // 边线的宽度，以像素为单位。
      strokeOpacity: 0.8, // 边线透明度，取值范围 0 - 1。
      fillOpacity: 0.5, // 填充的透明度，取值范围 0 - 1。
      strokeStyle: 'solid' // 边线的样式，solid或dashed。
    };

    // 实例化鼠标绘制工具
    const drawingManager = new BMapLib.DrawingManager(map, {
      isOpen: false, // 是否开启绘制模式
      enableDrawingTool: true, // 是否显示工具栏
      // drawingMode: BMAP_DRAWING_POLYGON, // 绘制模式  多边形
      drawingToolOptions: {
        anchor: BMAP_ANCHOR_TOP_RIGHT, // 位置
        offset: new BMap.Size(5, 5), // 偏离值
        drawingModes: [BMAP_DRAWING_POLYGON]
      },
      polygonOptions: styleOptions // 多边形的样式
    });

    // 绘制完成
    drawingManager.addEventListener('polygoncomplete', polygonComplete);

    function polygonComplete(p) {
      const path = p.getPath(); // Array<Point>
      const area = BMapLib.GeoUtils.getPolygonArea(path);
      console.log('p: ', p);
      console.log(`${area} 平方米`);
      /**
       * 开启对刚绘制的多边形的编辑
       */
      p.enableEditing();

      /**
       * 增加鼠标事件监听: over, out, click, rightclick
       */
      p.addEventListener('mouseover', mouseOverHandler);
      p.addEventListener('mouseout', mouseOutHandler);
      p.addEventListener(
        'click',
        showInfo.bind({
          opt: z.optsInfoWindow,
          map: z.map
        })
      );
      p.addEventListener('lineupdate', lineupdateHandler);
      // add data to this.data
      // this.data.ba
      // const data = z.polygonTable.find((i) => i.name === p.ba) || null;
      const poly = spliceTarget(p.ba);

      if (!poly) {
        z.polygonTable = [...z.polygonTable, {
          name: p.ba,
          area: area.toFixed(2),
          isHidden: false
        }];
      }
    }
    /**
     * name: 按 name--ba 搜索 polyton
     * zis: 如果提供了 this, 就替换当前 polygonTable
     */
    function spliceTarget(name, zis) {
      let ret = null;
      const newTable = [];
      z.polygonTable.forEach((i) => {
        if (i.name === name) {
          ret = i;
        } else {
          newTable.push(i);
        }
      });
      if (ret && zis) {
        zis.polygonTable = newTable;
      }
      return ret;
    }

    function lineupdateHandler(e) {
      console.log('ee: ', e); // 每个图形元素的 ba 值是独一无二的, 可以根据这个来查找
      const target = e.currentTarget;
      const area = BMapLib.GeoUtils.getPolygonArea(target.getPath());
      // console.log('面积改变: ', area);
      const poly = spliceTarget(target.ba, z);

      if (poly) {
        z.polygonTable = [...z.polygonTable, {
          ...poly,
          ...{
            name: target.ba,
            area: area.toFixed(2),
          }
        }];
      }
    }
    function mouseOverHandler(e) {
      e.target.setFillColor(z.hoverFillColor);
    }

    function mouseOutHandler(e) {
      e.target.setFillColor(z.defaultFillColor);
    }

    /**
     * 绑定单击 polygon 的动作
     */
    function showInfo(e) {
      console.log('showInfo: e: ', e);
      const area = BMapLib.GeoUtils.getPolygonArea(e.target.getPath());
      // 注意此处的 this 指向, 是定义处 bind 的对象.
      const iwin = new BMap.InfoWindow(`${area.toFixed(2)} 平方米`, this.opt);
      this.map.openInfoWindow(iwin, e.point);
    }

    const menu = new BMap.ContextMenu();
    const txtMenuItem = [
      {
        text: '删除',
        callback(ee) {
          if (ee.target && ee.target.Lb === 'overlay') {
            ee.target.remove();
          } else {
            console.log('Invalid remove');
          }
        }
      }
    ];
    for (let i = 0; i < txtMenuItem.length; i++) {
      menu.addItem(
        new BMap.MenuItem(txtMenuItem[i].text, txtMenuItem[i].callback, 100)
      );
    }
    map.addContextMenu(menu);
  },
  methods: {
    async loadAllLibsSync() {
      const arr = [
        'https://api.map.baidu.com/getscript?v=2.0&ak=t35wFVMYY4C4ZqCMh64qG4lpGkOgXbSy&services=&t=20200914160603',
        'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js',
        'http://api.map.baidu.com/library/GeoUtils/1.2/src/GeoUtils_min.js'
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
        return new Promise((s, j) => {
          const scripts = document.createElement('script');
          scripts.src = src;
          document.head.appendChild(scripts);
          scripts.onload = function (e) {
            console.log(e);
            s();
          };
          setTimeout(() => {
            j();
          }, 10000);
        });
      }
    },
    hidePolygon(row) {
      // todo
      console.log(row);
    },
    viewPolygon(row) {
      // todo
      console.log(row);
    }
  }
};
</script>

<style lang="scss" scoped>
    #allmap {
      width: 100%;
      height: 900px;
      overflow: hidden;
    }
</style>
