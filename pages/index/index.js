import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
const LINE0 = '心电';
const LINE1 = '心率';
const LINE2 = '温度';
const LINE3 = '心音';
const chartMap = {}; //保存chart对象
const dataMap = {}; //保存数据对象
const sampleMap = {}; //保存采样参数数据
let g_dpr=1;  

function getDateTimeStr(timeMillis) { //根据timeMillis显示“hh:mm:ss”的时间格式
  var date = new Date(timeMillis);
  //年
  var Y = date.getFullYear();
  //月
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  //时
  var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  //分
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  //秒
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

  return h + ":" + m + ":" + s;
}

function initChart(canvas, width, height, dpr, lineName) { //初始化图表
  if(dpr!=undefined) g_dpr=dpr;   //这里使用g_dpr来设置，以防止dpr偶尔为undefined时导致程序出错
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: g_dpr 
  });
  canvas.setChart(chart);

  //初始化图表数据
  dataMap[lineName] = []; //保存line数据（用于实现一个队列）
  let queue_length=1800;  //心电队列长度

  sampleMap[lineName] = {
    sliceNum: 28,  // 每次更新图表移除28个数据点
    sampleFre: 512, // 心音采样频率为512Hz
  };

  //转化为图表使用的数据
  const xData = [],
    yData = [];
 
  for (let i = 0; i < queue_length; i++) { //默认初始化队列中的N条数据
    dataMap[lineName].push({
      x: '',
      y: 0,
    });
    //初始化图表使用数据
    xData.push('');
    yData.push(dataMap[lineName][i].y);
  }

  var option = {
    title: {
      text: [lineName],
      top: 10,
      bottom: 0,
      left: 'center',
      padding: 0,
    },
    legend: {
      show: false, 
    },
    grid: {
      containLabel: true,
      left: 10,
      right: 10,
      top: 40,
      bottom: 10,
    },
    tooltip: {
      show: false, //取消鼠标滑过的提示框
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData,
    },
    yAxis: {
      min:-2,
      max:1,
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [{
      name: lineName,
      type: 'line',
      smooth: true,
      data: yData,
      symbol: 'none', //取消折点圆圈
    }]
  };

  chart.setOption(option);
  chartMap[lineName] = chart;

  return chart;
}

function initPcgChart(canvas, width, height, dpr, lineName) { //初始化心音图表
  if(dpr!=undefined) g_dpr=dpr;   //这里使用g_dpr来设置，以防止dpr偶尔为undefined时导致程序出错
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: g_dpr 
  });
  canvas.setChart(chart);
  sampleMap[lineName] = {};
  sampleMap[lineName] = {
    sliceNum: 28,  // 每次更新图表移除28个数据点
    sampleFre: 500, // 心音采样频率为512Hz
  };
  //初始化图表数据
  dataMap[lineName] = []; //保存line数据（用于实现一个队列）
  let queue_length=1800;  //心音队列长度

  //转化为图表使用的数据
  const xData = [],
    yData = [];
 
  for (let i = 0; i < 300; i++) { //默认初始化队列中的N条数据
    dataMap[lineName].push({
      x: '',
      y: 71,
    });
    
    //初始化图表使用数据
    xData.push('');
    yData.push(dataMap[lineName][i].y);
  }
  for (let i = 0; i < 300; i++) { //默认初始化队列中的N条数据
    dataMap[lineName].push({
      x: '',
      y: 69,
    });
    
    //初始化图表使用数据
    xData.push('');
    yData.push(dataMap[lineName][i].y);
  }
  for (let i = 0; i < queue_length/6; i++) { //默认初始化队列中的N条数据
    dataMap[lineName].push({
      x: '',
      y: 72,
    });
    
    //初始化图表使用数据
    xData.push('');
    yData.push(dataMap[lineName][i].y);
  }
  for (let i = 0; i < 300; i++) { //默认初始化队列中的N条数据
    dataMap[lineName].push({
      x: '',
      y: 68,
    });
    
    //初始化图表使用数据
    xData.push('');
    yData.push(dataMap[lineName][i].y);
  }
  for (let i = 0; i < 300; i++) { //默认初始化队列中的N条数据
    dataMap[lineName].push({
      x: '',
      y: 71,
    });
    
    //初始化图表使用数据
    xData.push('');
    yData.push(dataMap[lineName][i].y);
  }
  for (let i = 0; i < 300; i++) { //默认初始化队列中的N条数据
    dataMap[lineName].push({
      x: '',
      y: 73,
    });
    
    //初始化图表使用数据
    xData.push('');
    yData.push(dataMap[lineName][i].y);
  }

  var option = {
    title: {
      text: [lineName],
      top: 10,
      bottom: 0,
      left: 'center',
      padding: 0,
    },
    legend: {
      show: false, 
    },
    grid: {
      containLabel: true,
      left: 10,
      right: 10,
      top: 40,
      bottom: 10,
    },
    tooltip: {
      show: false, //取消鼠标滑过的提示框
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData,
    },
    yAxis: {
      min:40,
      max:120,
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [{
      name: lineName,
      type: 'line',
      smooth: true,
      data: yData,
      symbol: 'none', //取消折点圆圈
    }]
  };

  chart.setOption(option);
  chartMap[lineName] = chart;

  return chart;
}

function initTemperChart(canvas, width, height, dpr, lineName) { //初始化体温图表
  if(dpr!=undefined) g_dpr=dpr;   //这里使用g_dpr来设置，以防止dpr偶尔为undefined时导致程序出错
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: g_dpr 
  });
  canvas.setChart(chart);

  //初始化图表数据
  dataMap[lineName] = []; //保存line数据（用于实现一个队列）
  let queue_length=10;  //体温队列长度

  //转化为图表使用的数据
  const xData = [],
    yData = [];
 
  for (let i = 0; i < queue_length; i++) { //默认初始化队列中的N条数据
    dataMap[lineName].push({
      x: '',
      y: 36.5,
    });
    //初始化图表使用数据
    xData.push('');
    yData.push(dataMap[lineName][i].y);
  }

  var option = {
    title: {
      text: [lineName],
      top: 10,
      bottom: 0,
      left: 'center',
      padding: 0,
    },
    legend: {
      show: false, 
    },
    grid: {
      containLabel: true,
      left: 10,
      right: 10,
      top: 40,
      bottom: 10,
    },
    tooltip: {
      show: false, //取消鼠标滑过的提示框
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData,
    },
    yAxis: {
      min:35,
      max:40,
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [{
      name: lineName,
      type: 'line',
      smooth: true,
      data: yData,
      symbol: 'none', //取消折点圆圈
    }]
  };

  chart.setOption(option);
  chartMap[lineName] = chart;

  return chart;
}

function showDataByLineName(lineName, newValArr) { //刷新显示lineName对应的图表数据
  const chart = chartMap[lineName];
  if (chart==undefined||chart==null) return; //如果还没有初始化好，则退出

  const data=dataMap[lineName];
  let tempData = [...data, ...newValArr]; //合并两个数据数组（相当于从队列右侧进入队列）
  tempData.splice(0, newValArr.length); //去除掉多的数据（相当于从队列左侧退出队列）
  for(let i=0;i<data.length;i++){  //替换原有数据
    data[i]=tempData[i];
  }

  //转化为图表使用的数据
  const xData = [],
    yData = [];
  for (let i = 0; i < data.length; i++) {
    xData.push(data[i].x);
    yData.push(data[i].y);
  }

  //设置图表数据
  chart.setOption({
    xAxis: {
      data: xData
    },
    series: [{
      data: yData
    }]
  })
}

Page({
  data: {
    line0: {
      onInit: (...param) => {
        return initChart(...param, LINE0);
      }
    },
    line1: {
      onInit: (...param) => {
        return initPcgChart(...param, LINE1);
      }
    },
    line2: {
      onInit: (...param) => {
        return initTemperChart(...param, LINE2);
      }
    },
    line3: {
      onInit: (...param) => {
        return initChart(...param, LINE3);
      }
    },
  },

  onLoad() {
    //定义数据监听处理算法
    // setInterval(function updataEcgChart() {
    //   if(!(chartMap[LINE0]&&chartMap[LINE1]&&chartMap[LINE2]&&chartMap[LINE3])) return;  //所有chart未初始化好之前均不往后执行

    //   const hexVal = app.globalData.newBTVal;
    //   if(hexVal==null) return;
    //   const newBTValCreateTimeStr = getDateTimeStr(app.globalData.newBTValCreateTime);

    //   const length = hexVal.length; //数据长度
    //   const physiologyData = hexVal.substring(0, length); //生理数据
    //   //处理生理数据
    //   const newValArr = [];
    //   for (let i = 0; i < physiologyData.length / 4; i++) { //按4个字符进行截取（每个字符代表4位，4个字符就是16位）
    //     let ydata = parseInt(physiologyData.substring(i * 4, i * 4 + 4), 16)
    //     if (ydata > 32767)
    //     {
    //       ydata -= 65536;
    //     }
    //     ydata = (ydata * 18.3) / 128.0 / 1000
    //     console.log(ydata);
    //     newValArr.push({
    //       x: newBTValCreateTimeStr,
    //       y: ydata,  //将16进制数转化为10进制
    //     });
    //   }

    //   showDataByLineName(LINE0, newValArr);

    //   //使用后设为空
    //   app.globalData.newBTVal=null;
    //   app.globalData.newBTValCreateTime=-1;
    // }, 100);

    //实时更新心电数据图表显示
    setInterval(function updataEcgChart() {
      if(!(chartMap[LINE0])) return;  //等待Pcgchart未初始化完成
      const sliceNum = sampleMap[LINE0].sliceNum;
      const EcgCahrtData = app.globalData.ecg_data.slice(0,42);
      app.globalData.ecg_data.splice(0,42);
      if(EcgCahrtData==null) return;
      //更新图表显示
      showDataByLineName(LINE0, EcgCahrtData);
    }, 10);

    //实时更新心音数据图表显示
    setInterval(function updataPcgChart() {
      if(!(chartMap[LINE1])) return;  //等待Pcgchart未初始化完成
      const sliceNum = sampleMap[LINE1].sliceNum;
      const PcgCahrtData = app.globalData.pcg_data.slice(0,42);
      app.globalData.pcg_data.splice(0,42);
      if(PcgCahrtData==null) return;
      //更新图表显示
      showDataByLineName(LINE1, PcgCahrtData);
    }, 10);
    //Math.round(sampleMap[LINE1].sliceNum/sampleMap[LINE1].sampleFre)
  }
});