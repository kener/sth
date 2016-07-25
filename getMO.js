var startDate = new Date('2016-07-18');
var endDate = new Date('2016-07-23');

var curDate = endDate;
var url;
var curPage;
var pageCount;
var orderMap = [];

getByDate(curDate, curDate);
function getByDate(sDate, eDate) {
  sDate = format('YYYY-MM-DD', sDate);
  eDate = format('YYYY-MM-DD', eDate);
  url = 'http://e.waimai.meituan.com/v2/order/history/r/query?wmOrderPayType=-2&wmOrderStatus=-2&sortField=1'
            + '&startDate=' + sDate
            + '&endDate=' +  eDate
            + '&pageNum=';
  curPage = 1;
  pageCount;


  console.log('------- ' + sDate + ' -------');
  $.get(url + curPage, function(result){
    pageCount = result.pageCount;
    console.log(pageCount - curPage);
    mark(result);
    setTimeout(pollGet, 500);
  });
}

function mark(result) {
  var list = result.wmOrderList;
  var orderId;
  var completeTime;
  for (var i = 0; i < list.length; i++) {
    //orderId = list[i].wm_order_id_view_str;
    completeTime = list[i].latestDeliveryTime || list[i].order_time;
    orderMap.push({
      orderTime: list[i].order_time_fmt,
      orderCompleteTime: format('YYYY-MM-DD hh:mm:ss', new Date(completeTime * 1000)),
      deliveryTime: Math.round((completeTime - list[i].order_time) / 60),
      orderId: list[i].wm_order_id_view_str,
      userId : list[i].user_id,
      recipientAddress: list[i].recipient_address,
      recipientName: list[i].recipient_name,
      recipientPhone: list[i].recipient_phone,
      isFirstOrder : list[i].is_poi_first_order,
      sex: list[i].recipient_name.indexOf('先生') != -1 ? '男' 
           : (list[i].recipient_name.indexOf('女士') != -1 ? '女' : '未知'),
      lat: list[i].address_latitude / 1000000,
      lng: list[i].address_longitude / 1000000,
      details: list[i].cartDetailVos[0].details
    });
  }
}

function pollGet() {
  if (++curPage <= pageCount) {
    $.get(url + curPage, function(result){
      console.log(pageCount - curPage);
      mark(result);
      setTimeout(pollGet, 500);
    })
  }
  else if (curDate > startDate) {
    curDate = getTheNextNDate(-1, curDate);
    // console.log(curDate);
    getByDate(curDate, curDate);
  }
  else {
    printResult();
  }
}

var html = '<table>'
      + '<tr>'
        + '<th>订单编号</th>'
        + '<th>下单时间</th>'
        + '<th>完成时间</th>'
        + '<th>用户Id</th>'
        + '<th>用户名</th>'
        + '<th>性别</th>'
        + '<th>用户类型</th>'
        + '<th>电话</th>'
        + '<th>地址</th>'
        + '<th>纬度</th>'
        + '<th>经度</th>'
        + '<th>配送时长</th>'
      + '</tr>';
var html2 = '<table>'
      + '<tr>'
        + '<th>订单编号</th>'
        + '<th>下单时间</th>'
        + '<th>完成时间</th>'

        + '<th>菜品原价</th>'
        + '<th>菜品现价</th>'
        + '<th>菜品数量</th>'
        + '<th>菜品总价</th>'
        + '<th>菜品名字</th>'
        + '<th>套餐类型</th>'

        + '<th>用户Id</th>'
        + '<th>用户名</th>'
        + '<th>性别</th>'
        + '<th>用户类型</th>'
        + '<th>电话</th>'
        + '<th>地址</th>'
        + '<th>纬度</th>'
        + '<th>经度</th>'
      + '</tr>';
function printResult(){
  // console.log(orderMap);
  for (var i = orderMap.length - 1; i >= 0 ; i--) {
    html += '<tr>';
    html += '<td>' + orderMap[i].orderId+ '</td>';//561160000000000
    html += '<td>' + orderMap[i].orderTime + '</td>';
    html += '<td>' + orderMap[i].orderCompleteTime + '</td>';
    html += '<td>' + orderMap[i].userId + '</td>';
    html += '<td>' + orderMap[i].recipientName + '</td>';
    html += '<td>' + orderMap[i].sex + '</td>';
    html += '<td>' + (orderMap[i].isFirstOrder ? '新用户' : '复购用户') + '</td>';
    html += '<td>' + orderMap[i].recipientPhone + '</td>';
    html += '<td>' + orderMap[i].recipientAddress + '</td>';
    html += '<td>' + orderMap[i].lat + '</td>';
    html += '<td>' + orderMap[i].lng + '</td>';
    html += '<td>' + orderMap[i].deliveryTime + '</td>';
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

  tpl += '<td>' + data.orderId+ '</td>';
  tpl += '<td>' + data.orderTime + '</td>';
  tpl += '<td>' + data.orderCompleteTime + '</td>';
  tpl += 'PRODUCT_HOLDER';
  tpl += '<td>' + data.userId + '</td>';
  tpl += '<td>' + data.recipientName + '</td>';
  tpl += '<td>' + data.sex + '</td>';
  tpl += '<td>' + (data.isFirstOrder ? '新用户' : '复购用户') + '</td>';
  tpl += '<td>' + data.recipientPhone + '</td>';
  tpl += '<td>' + data.recipientAddress + '</td>';
  tpl += '<td>' + data.lat + '</td>';
  tpl += '<td>' + data.lng + '</td>';

  tpl += '</tr>';

  var products = data.details;
  var pContent;
  var name;
  for (var i = 0; i < products.length; i++) {
    if (products[i].food_name.search(/(商务|一人餐|免费饮料)/) != -1) {
      // 规格，套餐
      getAttrsResult(products[i], tpl);
    }
    else {
      name = reformName(products[i].food_name);
      if (!name) {
        continue;
      }
      pContent = '';
      pContent += '<td>' + products[i].origin_food_price + '</td>'; // 原价
      pContent += '<td>' + products[i].food_price + '</td>'; // 现价
      pContent += '<td>' + products[i].count + '</td>'; // 数量
      pContent += '<td>' + products[i].food_price * products[i].count + '</td>'; // 总价
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
  
  var name = product.food_name;
  var list;
  var optionName;
  if (name.search(/[AB]/) != -1) {
    optionName = reformName(name.replace(/(商务套餐|A| |B|)/g,'').replace(/[)(（）]/g,''))
    name = reformName(name.replace(/\(.*\)/g,'').replace(/ /g, ''));

    list = packageMap[name][optionName];
  }
  else if (name.search(/免费饮料/) != -1) {
    optionName = reformName(name.replace(/(免费饮料百搭套餐| )/g,'').replace(/[)(（）]/g,''));
    name = reformName(name.replace(/\(.*\)/g,'').replace(/ /g, ''));

    list = packageMap[name][optionName];
    list[2].name = ['清炒西兰花', '彩色时蔬', '什锦烩蔬菜'][randomIdx++ % 3];
    list[3].name = ['屈臣氏香草味苏打水', '怡泉+C柠檬味汽水', '健怡可乐', 'DReena特丽娜果肉饮料'][randomIdx2++ % 4];
  }
  else {
    name = reformName(product.food_name)
    list = packageMap[name];
  }

  var discount = product.food_price / product.origin_food_price;

  for (var i = 0; i < list.length; i++) {
    aContent = '';
    aContent += '<td>' + (list[i].price).toFixed(2) + '</td>'; // 原价
    aContent += '<td>' + (list[i].price * discount).toFixed(2) + '</td>'; // 现价
    aContent += '<td>' + product.count + '</td>'; // 数量
    aContent += '<td>' + (list[i].price * discount * product.count).toFixed(2) + '</td>'; // 总价
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
