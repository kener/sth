var startDate = new Date('2016-08-01');
var endDate = new Date('2016-08-07');

var curDate = endDate;
var orderMap = [];

getByDate(curDate, getTheNextNDate(1, curDate));
function getByDate(sDate, eDate) {
  var url = 'https://app-api.shop.ele.me/order/invoke/?method=order.getProcessedOrders';
  var data = {
    id: "0d0efdfc-2d3c-4496-ae33-30b79258839d",
    metas: {
      appName: "melody", 
      appVersion: "4.4.0",
      ksid: "j82G79J54WHSn4MgF8rIZnp47sormDackbuA"
    },
    method: "getProcessedOrders",
    ncp: "2.0.0",
    params: {
      restaurantId: 80080239, 
      offset: 0, 
      limit: 1000,
      query: {
        beginTime: (sDate - 0)/1000, 
        endTime: (eDate - 0)/1000,
        statuses: [], 
        payments: [], 
        refundStatuses: []
      },
      statuses: [],
      restaurantId: 80080239
    },
    service: "order"
  };

  console.log('------- ' + sDate + ' -------');
  $.ajax({
    type: "POST",     //提交方式
    contentType: "application/json; charset=utf-8",   //内容类型
    dataType: "json",     //类型
    url: url,
    data: JSON.stringify(data),
    success: function (res) { //如果执行成功，那么执行此方法
      mark(res);
      setTimeout(pollGet, 500);
    },
    error: function (err) { //如果执行不成功，那么执行此方法
      setTimeout(pollGet, 500);
    }
  });
}

function mark(res) {
  console.log(res);
  var list = res.result;
  for (var i = 0; i < list.length; i++) {
    orderMap.push(list[i]);
  }
}

function pollGet() {
  if (curDate > startDate) {
    var lastCurDate = curDate;
    curDate = getTheNextNDate(-1, curDate);
    // console.log(curDate);
    getByDate(curDate, lastCurDate);
  }
  else {
    printResult();
  }
}

var html = '<table>'
      + '<tr>'
        + '<th>订单ID</th>'
        + '<th>下单时间</th>'
        // + '<th>确认时间</th>'
        + '<th>完成时间</th>'

        + '<th>菜品金额</th>'
        + '<th>配送金额</th>'
        + '<th>订单总额</th>'
        + '<th>平台优惠</th>'
        + '<th>商家优惠</th>'
        + '<th>用户实付</th>'
        + '<th>佣金</th>'
        + '<th>商家实收</th>'

        + '<th>用户Id</th>'
        + '<th>订单预留名字</th>'
        + '<th>订单预留性别</th>'
        + '<th>订单预留电话</th>'
        + '<th>订单预留地址</th>'
        + '<th>用户类型</th>'
        + '<th>下单次数</th>'

        + '<th>纬度</th>'
        + '<th>经度</th>'
        + '<th>距离</th>'
        + '<th>配送时长</th>'
      + '</tr>';
var html2 = '<table>'
      + '<tr>'
        + '<th>订单ID</th>'
        + '<th>下单时间</th>'
        + '<th>完成时间</th>'

        + '<th>菜品原价</th>'
        + '<th>菜品数量</th>'
        + '<th>菜品总价</th>'
        + '<th>菜品名字</th>'
        + '<th>套餐类型</th>'

        + '<th>用户Id</th>'
        + '<th>订单预留名字</th>'
        + '<th>订单预留性别</th>'
        + '<th>订单预留电话</th>'
        + '<th>订单预留地址</th>'
        + '<th>用户类型</th>'
        + '<th>下单次数</th>'

        + '<th>纬度</th>'
        + '<th>经度</th>'
      + '</tr>';

function printResult(){
  // console.log(orderMap);
  var deliverCost;
  var distance;
  for (var i = orderMap.length - 1; i >= 0 ; i--) {
    html += '<tr>';
    html += '<td>' + orderMap[i].id+ '</td>'; //订单Id
    html += '<td>' + format('YYYY-MM-DD hh:mm:ss', orderMap[i].activeTime * 1000) + '</td>';// 下单时间
    html += '<td>' + format('YYYY-MM-DD hh:mm:ss', (orderMap[i].orderTraceUpdatedAt || orderMap[i].activeTime) * 1000) + '</td>';// 完成时间
    
    deliverCost = - Math.round(orderMap[i].goodsTotal - orderMap[i].payAmount - orderMap[i].restaurantPart - orderMap[i].elemePart - orderMap[i].hongbao);
    deliverCost = deliverCost < 0 ? 0 : deliverCost;
    html += '<td>' + orderMap[i].goodsTotal + '</td>'; // 商品总价 26 33
    html += '<td>' + deliverCost + '</td>'; //  html += '<td>' + orderMap[i].deliveryFee + '</td>'; // 
    html += '<td>' + (orderMap[i].goodsTotal - 0 + deliverCost) + '</td>'; // 订单总额 26 33
    html += '<td>' + (orderMap[i].elemePart  - 0 + orderMap[i].hongbao) + '</td>'; // 平台补贴 1.5 3.7
    html += '<td>' + orderMap[i].restaurantPart + '</td>'; // 商家补贴 15.7 9
    html += '<td>' + orderMap[i].payAmount + '</td>'; // 用户实付 8.8 24.3
    html += '<td>' + orderMap[i].serviceFee + '</td>'; // 服务费 1.54 3.6
    html += '<td>' + orderMap[i].income + '</td>'; // 餐厅实收 8.76 20.4

   
    html += '<td>' + orderMap[i].userId + '</td>'; // 用户ID
    html += '<td>' + orderMap[i].consigneeName + '</td>'; // 名字
    html += '<td>' + (orderMap[i].consigneeName.indexOf('先生') != -1 ? '男' 
                     : (orderMap[i].consigneeName.indexOf('女士') != -1 ? '女' : '未知')) + '</td>'; // 性别
    html += '<td>' + orderMap[i].consigneePhones[0] + '</td>'; // 电话
    html += '<td>' + orderMap[i].consigneeAddress + '</td>'; // 地址
    html += '<td>' + (orderMap[i].times == 1 ? '新用户' : '复购用户') + '</td>'; // 第几次下单
    html += '<td>' + orderMap[i].times + '</td>'; // 第几次下单

    html += '<td>' + orderMap[i].consigneeGeoLocation.latitude + '</td>'; // 纬度
    html += '<td>' + orderMap[i].consigneeGeoLocation.longitude + '</td>'; // 经度
    distance = orderMap[i].distance.replace(/[m<]/g, '');
    if (distance.indexOf('k') != -1) {
      distance = distance.replace('k', '') * 1000
    }
    html += '<td>' + distance + '</td>'; // 距离
    html += '<td>' + Math.round(
              ((orderMap[i].orderTraceUpdatedAt || orderMap[i].activeTime) - orderMap[i].activeTime) / 60
            )  + '</td>'; // 完成时间

    html += '</tr>';

    joinProductsResult(orderMap[i]);  // 菜品单品
  }
  html += '</table>';
  html2 += '</table>';
  // console.log(html2);
  document.body.innerHTML = html + '<hr/>' + html2;
}


function joinProductsResult(data) {
  var tpl = '';
  tpl += '<tr>';

  tpl += '<td>' + data.id + '</td>'; // 订单ID
  tpl += '<td>' + format('YYYY-MM-DD hh:mm:ss', data.activeTime * 1000)  + '</td>'; // 下单时间: 1466478926
  tpl += '<td>' + format('YYYY-MM-DD hh:mm:ss', (data.orderTraceUpdatedAt || data.activeTime) * 1000) + '</td>'; // 完成时间 "1466482903"
  
  tpl += 'PRODUCT_HOLDER';
  
  tpl += '<td>' + data.userId + '</td>'; // 用户ID
  tpl += '<td>' + data.consigneeName + '</td>'; // 订单预留名字
  tpl += '<td>' + (data.consigneeName.indexOf('先生') != -1 ? '男' 
                  : (data.consigneeName.indexOf('女士') != -1 ? '女' : '未知')) + '</td>'; // 订单预留性别
  tpl += '<td>' + data.consigneePhones[0] + '</td>'; // 订单预留电话
  tpl += '<td>' + data.consigneeAddress + '</td>'; // 订单预留地址

  tpl += '<td>' + (data.times == 1 ? '新用户' : '复购用户') + '</td>'; // 第几次下单
  tpl += '<td>' + data.times + '</td>'; // 第几次下单

  
  tpl += '<td>' + data.consigneeGeoLocation.latitude + '</td>'; // 纬度
  tpl += '<td>' + data.consigneeGeoLocation.longitude + '</td>'; // 经度

  tpl += '</tr>';


  //----
  var products = data.groups[0].items;
  var pContent;
  var name;
  for (var i = 0; i < products.length; i++) {
    if (products[i].name.search(/(商务|一人餐|免费饮料)/) != -1) {
      // 规格，套餐
      getAttrsResult(products[i], tpl);
    }
    else {
      name = reformName(products[i].name);
      if (!name) {
        continue;
      }
      pContent = '';
      pContent += '<td>' + products[i].price + '</td>'; // 原价
      pContent += '<td>' + products[i].quantity + '</td>'; // 数量
      pContent += '<td>' + products[i].price * products[i].quantity + '</td>'; // 总价
      pContent += '<td>' + name + '</td>'; // 名字
      pContent += '<td>单点</td>'; // 类型
      html2 += tpl.replace('PRODUCT_HOLDER', pContent);
    }
  }  
}

var packageMap = {
  '商务套餐A': {
    '意大利香草烤鸡': [
                      {name: '意大利香草烤鸡', price: 21.9 * 31.9 / 34.7},
                      {name: '彩色时蔬', price: 8.9 * 31.9 / 34.7},
                      {name: '米饭', price: 3.9 * 31.9 / 34.7}
                    ],
    '法兰西奶油白葡萄酒烩鸡肉': [
                      {name: '法兰西奶油白葡萄酒烩鸡肉', price: 23.9 * 33.9 / 36.7},
                      {name: '彩色时蔬', price: 8.9 * 33.9 / 36.7},
                      {name: '米饭', price: 3.9 * 33.9 / 36.7}
                    ],
    '马来西亚黄咖喱鸡': [
                      {name: '马来西亚黄咖喱鸡', price: 25.9 * 35.9 / 38.7},
                      {name: '彩色时蔬', price: 8.9 * 35.9 / 38.7},
                      {name: '米饭', price: 3.9 * 35.9 / 38.7}
                    ]
  },
  '商务套餐B': {
    '匈牙利古拉什烩牛肉': [
                      {name: '匈牙利古拉什烩牛肉', price: 30.9 * 39.9 / 42.7},
                      {name: '清炒西兰花', price: 7.9 * 39.9 / 42.7},
                      {name: '米饭', price: 3.9 * 39.9 / 42.7}
                    ],
    '新加坡浓香咖喱虾': [
                      {name: '新加坡浓香咖喱虾', price: 32.9 * 41.9 / 44.7},
                      {name: '清炒西兰花', price: 7.9 * 41.9 / 44.7},
                      {name: '米饭', price: 3.9 * 41.9 / 44.7}
                    ]
  },
  '免费饮料百搭套餐': {
    '意大利香草烤鸡': [
                      {name: '意大利香草烤鸡', price: 21.9 * 34.8 / 39.7},
                      {name: '米饭', price: 3.9 * 34.9 / 39.7},
                      {name: '配菜', price: 8.9 * 34.9 / 39.7},
                      {name: '饮料', price: 5 * 34.9 / 39.7}
                    ],
    '法兰西奶油白葡萄酒烩鸡肉': [
                      {name: '法兰西奶油白葡萄酒烩鸡肉', price: 23.9 * 36.8 / 41.7},
                      {name: '米饭', price: 3.9 * 36.8 / 41.7},
                      {name: '配菜', price: 8.9 * 36.8 / 41.7},
                      {name: '饮料', price: 5 * 36.8 / 41.7}
                    ],
    '马来西亚黄咖喱鸡': [
                      {name: '马来西亚黄咖喱鸡', price: 25.9 * 38.8 / 43.7},
                      {name: '米饭', price: 3.9 * 38.8 / 43.7},
                      {name: '配菜', price: 8.9 * 38.8 / 43.7},
                      {name: '饮料', price: 5 * 38.8 / 43.7}
                    ],
    '匈牙利古拉什烩牛肉': [
                      {name: '匈牙利古拉什烩牛肉', price: 30.9 * 43.8 / 47.7},
                      {name: '米饭', price: 3.9 * 43.8 / 47.7},
                      {name: '配菜', price: 8.9 * 43.8 / 47.7},
                      {name: '饮料', price: 5 * 43.8 / 47.7}
                    ],
    '新加坡浓香咖喱虾': [
                      {name: '新加坡浓香咖喱虾', price: 32.9 * 45.8 / 49.7},
                      {name: '米饭', price: 3.9 * 45.8 / 49.7},
                      {name: '配菜', price: 8.9 * 45.8 / 49.7},
                      {name: '饮料', price: 5 * 45.8 / 49.7}
                    ]
  },
  '完美素食主义套餐': [
    {name: '配汤', price: 8.9 * 26.5 / 29.6},
    {name: '配菜', price: 7.9 * 26.5 / 29.6},
    {name: '彩色时蔬', price: 8.9 * 26.5 / 29.6},
    {name: '米饭', price: 3.9 * 26.5 / 29.6}
  ],
  '素食主义套餐': [
    {name: '配菜', price: 7.9 * 26.5 / 29.6},
    {name: '彩色时蔬', price: 8.9 * 26.5 / 29.6},
    {name: '米饭', price: 3.9 * 26.5 / 29.6}
  ],
  '马来西亚黄咖喱鸡套餐': [
    {name: '马来西亚黄咖喱鸡', price: 24.9 * 42.5 / 45.6},
    {name: '米饭', price: 3.9 * 42.5 / 45.6},
    {name: '配菜', price: 8.9 * 42.5 / 45.6},
    {name: '配汤', price: 7.9 * 42.5 / 45.6}
  ],
  '匈牙利古拉什烩牛肉套餐': [
    {name: '匈牙利古拉什烩牛肉', price: 30.9 * 49.5 / 51.6},
    {name: '米饭', price: 3.9 * 49.5 / 51.6},
    {name: '配菜', price: 8.9 * 49.5 / 51.6},
    {name: '配汤', price: 7.9 * 49.5 / 51.6},
  ],
  '新加坡浓香咖喱虾套餐': [
    {name: '新加坡浓香咖喱虾', price: 30.9 * 49.5 / 51.6},
    {name: '米饭', price: 3.9 * 49.5 / 51.6},
    {name: '配菜', price: 8.9 * 49.5 / 51.6},
    {name: '配汤', price: 7.9 * 49.5 / 51.6}
  ],
  '防反帝蓝衣军团一人餐': [
    {name: '欧式传统松仁南瓜汤', price: 11 * 50 / 50},
    {name: '意大利香草烤鸡', price: 22 * 50 / 50},
    {name: '彩色时蔬', price: 9 * 50 / 50},
    {name: '米饭', price: 3 * 50 / 50},
    {name: '屈臣氏香草味苏打水', price: 5 * 50 / 50}
  ],
  '东道主高卢雄鸡一人餐': [
    {name: '法兰西经典奶油蘑菇汤', price: 12 * 51 / 52},
    {name: '法兰西奶油白葡萄酒烩鸡肉', price: 24 * 51 / 52},
    {name: '清炒西兰花', price: 8 * 51 / 52},
    {name: '米饭', price: 3 * 51 / 52},
    {name: '怡泉+C柠檬味汽水', price: 5 * 51 / 52}
  ],
  '后普斯卡什时代一人餐': [
    {name: '欧式传统松仁南瓜汤', price: 11 * 54 / 57},
    {name: '匈牙利古拉什烩牛肉', price: 31 * 54 / 57},
    {name: '清炒西兰花', price: 8 * 54 / 57},
    {name: '米饭', price: 3 * 54 / 57},
    {name: '健怡可乐', price: 4 * 54 / 57}
  ]
}

var randomIdx = Math.round(Math.random()*100);
var randomIdx2 = Math.round(Math.random()*100);
function  getAttrsResult (product, tpl) {
  var aContent = '';
  
  var name = product.name;
  var list;
  var optionName;
  if (name.search(/[AB]/) != -1) {
    optionName = reformName(name.replace(/(商务套餐|A| |B|-)/g,'')); //商务套餐B-匈牙利古拉什烩牛肉
    name = reformName(name.replace(/-.*/g,''));

    list = packageMap[name][optionName];
  }
  else if (name.search(/免费饮料/) != -1) {
    optionName = reformName(name.replace(/(免费饮料百搭套餐| |-)/g,''));
    name = reformName(name.replace(/-.*/g,''));

    list = packageMap[name][optionName];
    list[2].name = ['清炒西兰花', '彩色时蔬', '什锦烩蔬菜'][randomIdx++ % 3];
    list[3].name = ['屈臣氏香草味苏打水', '怡泉+C柠檬味汽水', '健怡可乐', 'DReena特丽娜果肉饮料'][randomIdx2++ % 4];
  }
  else if (name.search(/完美素食主义套餐/) != -1) {
    name = reformName(name);
    list = packageMap[name];
    list[0].name = ['法兰西经典奶油蘑菇汤', '欧式传统松仁南瓜汤'][randomIdx++ % 2];
    list[1].name = ['清炒西兰花', '什锦烩蔬菜'][randomIdx2++ % 2];
  }
  else if (name.search(/素食主义套餐/) != -1) {
    name = reformName(name);
    list = packageMap[name];
    list[0].name = ['清炒西兰花', '什锦烩蔬菜'][randomIdx2++ % 2];
  }
  else {
    name = reformName(name);
    list = packageMap[name];
    list[2].name = ['清炒西兰花', '什锦烩蔬菜'][randomIdx++ % 2];
    list[3].name = ['法兰西经典奶油蘑菇汤', '欧式传统松仁南瓜汤'][randomIdx2++ % 2];
  }


  for (var i = 0; i < list.length; i++) {
    aContent = '';
    aContent += '<td>' + (list[i].price).toFixed(2) + '</td>'; // 原价
    aContent += '<td>' + product.quantity + '</td>'; // 数量
    aContent += '<td>' + (list[i].price * product.quantity).toFixed(2) + '</td>'; // 总价
    aContent += '<td>' + list[i].name + '</td>'; // 名字
    aContent += '<td>' + name + '</td>'; // 类型
    html2 += tpl.replace('PRODUCT_HOLDER', aContent);
  }
} 

function reformName(str) {
  if (str.search(/(新品|关注|国宴|食材|同乐)/) != -1) {
    return '';
  }
  else if (str.indexOf('米饭') != -1) {
    return '米饭'
  }
  return str.replace('【新】', '').replace(/（.*）/g, '').replace(/(330|200|300|ml|【|】|\'|新客专项|折扣|抢|新菜|盒)/g, '');
}

function reformDate(d) {
  return new Date(typeof d == 'string' ? d.replace(/-/g, '/') : d);
}
// 日期脚手架
function format(formatter, d) {
  d = reformDate(d);
  // return moment(d).format(formatter);
  var o = {
    'M+': d.getMonth() + 1, //month
    'D+': d.getDate(),    //day
    'h+': d.getHours(),   //hour
    'm+': d.getMinutes(), //minute
    's+': d.getSeconds(), //second
    'q+': Math.floor((d.getMonth() + 3) / 3),  //quarter
    'S': d.getMilliseconds() //millisecond
  }
  if (/(Y+)/.test(formatter)) {
    formatter = formatter.replace(
      RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if(new RegExp('('+ k +')').test(formatter)) {
      formatter = formatter.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00'+ o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return formatter;
}

function addWeek(formatter, d) {
  return getWeek(d) + format(formatter, d);
}

function getWeek(d) {
  // d = moment(d);
  d = reformDate(d);
  var str = '日一二三四五六'.charAt(d.getDay());
  if (d < last2Sun || d > nextSun) {
    str = '星期' + str;
  }
  else if (d > last2Sun && d < lastSun) {
    str = '上周' + str;
  }
  else if (d > thisSun && d < nextSun) {
    str = '下周' + str;
  }
  else {
    str = '周' + str;
  }

  return str;
}

function getTheNextNDate(n, startDate, formatter) {
  startDate = reformDate(startDate || today);
  startDate.setDate(startDate.getDate() + n);
  return formatter ? format(formatter, startDate) : startDate;
}
