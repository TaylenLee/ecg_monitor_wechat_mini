const app = getApp()

function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

Page({
  data: {
    devices: [],
    connected: false,
    chs: [],
  },
  openBluetoothAdapter() {
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('openBluetoothAdapter success', res)
        this.startBluetoothDevicesDiscovery()
      },
      fail: (res) => {
        if (res.errCode === 10001) {
          wx.onBluetoothAdapterStateChange(function (res) {
            console.log('onBluetoothAdapterStateChange', res)
            if (res.available) {
              this.startBluetoothDevicesDiscovery()
            }
          })
        }
      }
    })
  },
  getBluetoothAdapterState() {
    wx.getBluetoothAdapterState({
      success: (res) => {
        console.log('getBluetoothAdapterState', res)
        if (res.discovering) {
          this.onBluetoothDeviceFound()
        } else if (res.available) {
          this.startBluetoothDevicesDiscovery()
        }
      }
    })
  },
  startBluetoothDevicesDiscovery() {
    if (this._discoveryStarted) {
      return
    }
    this._discoveryStarted = true
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: (res) => {
        console.log('startBluetoothDevicesDiscovery success', res)
        this.onBluetoothDeviceFound()
      },
    })
  },
  stopBluetoothDevicesDiscovery() {
    wx.stopBluetoothDevicesDiscovery()
  },
  onBluetoothDeviceFound() {
    wx.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        if (!device.name && !device.localName) {
          return
        }
        const foundDevices = this.data.devices
        const idx = inArray(foundDevices, 'deviceId', device.deviceId)
        const data = {}
        if (idx === -1) {
          data[`devices[${foundDevices.length}]`] = device
        } else {
          data[`devices[${idx}]`] = device
        }
        this.setData(data)
      })
    })
  },
  createBLEConnection(e) {
    const ds = e.currentTarget.dataset
    const deviceId = ds.deviceId
    const name = ds.name
    wx.createBLEConnection({
      deviceId,
      success: (res) => {
        this.setData({
          connected: true,
          name,
          deviceId,
        })
        this.getBLEDeviceServices(deviceId)
      }
    })
    this.stopBluetoothDevicesDiscovery()
  },
  closeBLEConnection() {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId
    })
    this.setData({
      connected: false,
      chs: [],
    })
  },
  getBLEDeviceServices(deviceId) {
    wx.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        for (let i = 0; i < res.services.length; i++) {
          if (res.services[i].isPrimary) {
            this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
            return
          }
        }
      }
    })
  },
  getBLEDeviceCharacteristics(deviceId, serviceId) {
    wx.getBLEDeviceCharacteristics({
      deviceId,
      serviceId,
      success: (res) => {
        console.log('getBLEDeviceCharacteristics success', res.characteristics)
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          if (item.properties.read) {
            wx.readBLECharacteristicValue({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
            })
          }
          if (item.properties.notify || item.properties.indicate) {
            wx.notifyBLECharacteristicValueChange({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
              state: true,
            })
          }
        }
      },
      fail(res) {
        console.error('getBLEDeviceCharacteristics', res)
      }
    })
    // 操作之前先监听，保证第一时间获取数据
    wx.onBLECharacteristicValueChange((characteristic) => {
      const idx = inArray(this.data.chs, 'uuid', characteristic.characteristicId)
      const data = {}
      if (idx === -1) {
        data[`chs[${this.data.chs.length}]`] = {
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        }
      } else {
        const hexVal=ab2hex(characteristic.value);
        data[`chs[${idx}]`] = {
          uuid: characteristic.characteristicId,
          value: hexVal
        }
        // this.setGlobalNewVal(hexVal);
        if(characteristic.serviceId == "00001522-1212-EFDE-1523-785FEABCD123"){//心电特征1522
          this.setGlobalNewEcgVal(hexVal);
        }
        if(characteristic.serviceId == "00001521-1212-EFDE-1523-785FEABCD123"){//心音数据1521
          console.log("get pcg data");
          this.setGlobalNewPcgVal(hexVal);
        }
      }
      // data[`chs[${this.data.chs.length}]`] = {
      //   uuid: characteristic.characteristicId,
      //   value: ab2hex(characteristic.value)
      // }
      this.setData(data)
    })
  },
  showInChart() {  //打开图表展示界面
    wx.navigateTo({
      url: '../index/index'
    });
  },
  setGlobalNewVal(hexVal){  //接收到蓝牙数据后，设置为最新全局数据（全局数据在app.js中定义）
    //设置为全局数据
    app.globalData.newBTVal=hexVal;
    app.globalData.newBTValCreateTime=new Date().getTime();
  },
  setGlobalNewEcgVal(hexVal){   //接收到蓝牙数据后，将其换算成对应的心电数据并存入ecg_data全局列表中（全局数据在app.js中定义）
    let nowTime = new Date().getTime();
    for (let i = 0; i < hexVal.length / 4; i++) { //按4个字符进行截取（每个字符代表4位，4个字符就是16位）
      let ydata = parseInt(hexVal.substring(i * 4, i * 4 + 4), 16);
      let xdata = new Date(nowTime + 2);
      if (ydata > 32767)
      {
        ydata -= 65536;
      }
      ydata = (ydata * 18.3) / 128.0 / 1000;
      xdata = this.getDateTimeStr(xdata);
      app.globalData.ecg_data.push({
        x: xdata,
        y: ydata,
      });
      // app.globalData.ecg_data.push(ydata);
    }
  },
  setGlobalNewPcgVal(hexVal){   //接收到蓝牙数据后，将其换算成对应的心音数据并存入ecg_data全局列表中（全局数据在app.js中定义）
    let nowTime = new Date().getTime();
    for (let i = 0; i < hexVal.length / 4; i++) { //按4个字符进行截取（每个字符代表4位，4个字符就是16位）
      let ydata = parseInt(hexVal.substring(i * 4, i * 4 + 4), 16);
      let xdata = new Date(nowTime + 2);
      if (ydata > 32767)
      {
        ydata -= 65536;
      }
      ydata = (ydata * 3.6) / 4096.0;
      xdata = this.getDateTimeStr(xdata);
      // console.log(xdata);
      app.globalData.pcg_data.push({
        x: xdata,
        y: ydata,
      });
      // app.globalData.pcg_data.push(ydata);
    }
    // console.log(app.globalData.pcg_data.length);
  },
  getDateTimeStr(timeMillis) { //根据timeMillis显示“hh:mm:ss”的时间格式
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
  
    // console.log(Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s );
    // console.log(h + ":" + m + ":" + s );
    return h + ":" + m + ":" + s;
  },
})
