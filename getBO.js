var startDate = new Date('2016-06-27');
var endDate = new Date('2016-07-03');

var orderList = [];   // 订单数据
var curDate = startDate;
var curPage = 1;
var totalPage = 1;

var callFinish = false;
require('wand:widget/common/order/map/map.js').createWidget = function (s) {
  orderList.push(s);
}
require('wand:widget/common/order/orderlist_pager/pager.js').createWidget = function(s) {
  curPage = s.content.curr_page;
  totalPage = s.content.page_count;
  callFinish = true;
  console.log(s);
}
function next(){
  if (!callFinish) {
    setTimeout(next,500);
  }
  if (curPage < totalPage) {
    curPage += 1;
    getByDate();
  }
  else if (curDate < endDate) {
    curDate = getTheNextNDate(1, curDate);
    curPage = 1;
    getByDate();
  }
  else {
    getUserType();
    //printResult();
  }
}
var url = 'http://wmcrm.baidu.com/crm?qt=orderlist&order_status=0&start_time=sDate&end_time=eDate&pay_type=2&is_asap=0&&page=tPage';
function getByDate(){
  console.log(curDate);
  var curDateStr = format('YYYY-MM-DD', curDate);
  var newUrl = url.replace('sDate', curDateStr).replace('eDate', curDateStr).replace('tPage',curPage);
  console.log(newUrl)
  $.get(newUrl, function(result){
    callFinish = false;
    document.write(result);
    setTimeout(next,500);
  });
}
getByDate();


var userMap = {};
var orderListIdx = 0;
function getUserType() {
  var userId = orderList[orderListIdx].data.pass_uid;
  console.log(userId);
  if (userMap[userId]) {
    nextUser();
    return;
  }
  $.ajax({
    type: "GET",     //提交方式
    contentType: "application/json; charset=utf-8",   //内容类型
    dataType: "json",     //类型
    url: 'http://wmcrm.baidu.com/crm',
    data: {
      qt:'userorderlist',
      user_id:userId,
      shop_id:565782
    },
    success: function (result) { //如果执行成功，那么执行此方法
      userMap[userId] = {
        firstOrderId: result.data.order_list[result.data.order_list.length - 1].order_id
      };
      setTimeout(nextUser, 200);
    },
    error: function (err) { //如果执行不成功，那么执行此方法
      setTimeout(nextUser, 200);
    }
  });
}

function nextUser() {
  if (orderListIdx < orderList.length - 1) {
    orderListIdx++;
    getUserType();
  }
  else {
    printResult();
  }
}



var html = '<table>'
      + '<tr>'
        // + '<th>城市</th>'
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

        + '<th>订单预留名字</th>'
        + '<th>订单预留性别</th>'
        + '<th>订单预留电话</th>'
        + '<th>订单预留地址</th>'

        + '<th>地址单元</th>'
        + '<th>地址详情</th>'
        + '<th>纬度</th>'
        + '<th>经度</th>'
        + '<th>距离</th>'
        + '<th>配送时长</th>'

        + '<th>外卖使用次数</th>'
        + '<th>订单预留备注</th>'

        + '<th>百度账户ID</th>'
        + '<th>百度账户名</th>'
        + '<th>百度账户电话</th>'
        + '<th>用户类型</th>'
      + '</tr>';
var html2 = '<table>'
      + '<tr>'
        + '<th>订单ID</th>'
        + '<th>下单时间</th>'
        + '<th>完成时间</th>'

        + '<th>菜品原价</th>'
        + '<th>菜品现价</th>'
        + '<th>菜品数量</th>'
        + '<th>菜品总价</th>'
        + '<th>菜品名字</th>'
        + '<th>套餐类型</th>'

        + '<th>订单预留名字</th>'
        + '<th>订单预留性别</th>'
        + '<th>订单预留电话</th>'
        + '<th>订单预留地址</th>'

        + '<th>地址单元</th>'
        + '<th>地址详情</th>'
        + '<th>纬度</th>'
        + '<th>经度</th>'

        + '<th>百度账户ID</th>'
        + '<th>百度账户名</th>'
        + '<th>百度账户电话</th>'
        + '<th>用户类型</th>'
      + '</tr>';
function printResult(){
  // console.log(orderMap);
  var data;
  for (var i = 0; i < orderList.length ; i++) {
    data = orderList[i].data;
    html += '<tr>';

    // html += '<td>' + data.city_name + '</td>'; // 城市
    html += '<td>' + data.order_id + '</td>'; // 订单ID
    html += '<td>' + format('YYYY-MM-DD hh:mm:ss', data.create_time * 1000)  + '</td>'; // 订单创建时间: 1466478926
    // html += '<td>' + data.confirm_time + '</td>'; // 订单确认时间 "1466479012"
    html += '<td>' + format('YYYY-MM-DD hh:mm:ss', data.finished_time * 1000) + '</td>'; // 订单完成时间 "1466482903"
    
    html += '<td>' + data.content.product_price + '</td>'; // 菜品价格 40 60
    html += '<td>' + data.content.send_price + '</td>'; // 配送价格 5
    html += '<td>' + data.content.real_total_price + '</td>'; // 订单价格 45 65
    html += '<td>' + data.content.discount_display.baidu_rate + '</td>'; // 平台优惠 4 7
    html += '<td>' + data.content.discount_display.shop_rate + '</td>'; // 商家优惠 21 29
    html += '<td>' + data.content.total_price + '</td>'; // 用户实付 20 29
    html += '<td>' + data.content.discount_porduct_price + '</td>'; // 佣金 6 9
    html += '<td>' + data.content.total_price_after_discount + '</td>'; // 商家实收 13 22

    html += '<td>' + data.user_real_name + '</td>'; // 订单预留名字
    html += '<td>' + (data.sex == 1 ? '男' : '女') + '</td>'; // 订单预留性别
    html += '<td>' + data.user_phone + '</td>'; // 订单预留电话
    html += '<td>' + data.user_address + '</td>'; // 订单预留地址
    
    html += '<td>' + data.ext.user_address_component + '</td>'; // 地址单元
    html += '<td>' + data.ext.user_address_detail + '</td>'; // 地址详情
    var loc = pixelToLngLat(data.ext.user_address_lng, data.ext.user_address_lat, 18);
    html += '<td>' + loc[1] + '</td>'; // 纬度
    html += '<td>' + loc[0] + '</td>'; // 经度
    html += '<td>' + data.ext.shop_user_distance + '</td>'; // 距离
    // html += '<td>' + data.curr_delivery_time + '</td>'; // 配送时间
    html += '<td>' + Math.round((data.finished_time - data.create_time) / 60)  + '</td>';

    html += '<td>' + data.complete_order_count + '</td>'; // 用户完成订单数
    html += '<td>' + data.user_note + '</td>'; // 订单预留备注

    html += '<td>' + data.pass_uid + '</td>'; // 百度账户ID
    html += '<td>' + data.pass_name + '</td>'; // 百度账户名
    html += '<td>' + data.pass_phone + '</td>'; // 百度账户电话
    html += '<td>' + (userMap[data.pass_uid].firstOrderId != data.order_id ? '复购用户' : '新用户') + '</td>'; // 用户类别

    html += '</tr>';

    joinProductsResult(data);  // 菜品单品
  }
  html += '</table>';
  html2 += '</table>';
  // console.log(html2);
  document.body.innerHTML = html + '<hr/>' + html2;
}

function joinProductsResult(data) {
  var tpl = '';
  tpl += '<tr>';

  tpl += '<td>' + data.order_id + '</td>'; // 订单ID
  tpl += '<td>' + format('YYYY-MM-DD hh:mm:ss', data.create_time * 1000)  + '</td>'; // 订单创建时间: 1466478926
  tpl += '<td>' + format('YYYY-MM-DD hh:mm:ss', data.finished_time * 1000) + '</td>'; // 订单完成时间 "1466482903"
  
  tpl += 'PRODUCT_HOLDER';

  tpl += '<td>' + data.user_real_name + '</td>'; // 订单预留名字
  tpl += '<td>' + (data.sex == 1 ? '男' : '女') + '</td>'; // 订单预留性别
  tpl += '<td>' + data.user_phone + '</td>'; // 订单预留电话
  tpl += '<td>' + data.user_address + '</td>'; // 订单预留地址
  
  tpl += '<td>' + data.ext.user_address_component + '</td>'; // 地址单元
  
  tpl += '<td>' + data.ext.user_address_detail + '</td>'; // 地址详情
  
  var loc = pixelToLngLat(data.ext.user_address_lng, data.ext.user_address_lat, 18);
  tpl += '<td>' + loc[1] + '</td>'; // 纬度
  tpl += '<td>' + loc[0] + '</td>'; // 经度
  
  tpl += '<td>' + data.pass_uid + '</td>'; // 百度账户ID
  tpl += '<td>' + data.pass_name + '</td>'; // 百度账户名
  tpl += '<td>' + data.pass_phone + '</td>'; // 百度账户电话

  tpl += '<td>' + (userMap[data.pass_uid].firstOrderId != data.order_id ? '复购用户' : '新用户') + '</td>'; // 用户类别

  tpl += '</tr>';

  var products = data.content.products;
  var pContent;
  var name;
  for (var i = 0; i < products.length; i++) {
    if (products[i].have_attr == '1' || products[i].name.indexOf('一人餐') != -1) {
      // 规格，套餐
      getAttrsResult(products[i], tpl);
    }
    else {
      name = reformName(products[i].name);
      if (!name) {
        continue;
      }
      pContent = '';
      pContent += '<td>' + products[i].origin_price + '</td>'; // 原价
      pContent += '<td>' + products[i].current_price + '</td>'; // 现价
      pContent += '<td>' + products[i].number + '</td>'; // 数量
      pContent += '<td>' + products[i].total_price + '</td>'; // 总价
      pContent += '<td>' + name + '</td>'; // 名字
      pContent += '<td>单点</td>'; // 类型
      html2 += tpl.replace('PRODUCT_HOLDER', pContent);
    }
  }  
}

var packageMap = {
  '商务套餐A': {
    '意大利香草烤鸡': [
                      {name: '意大利香草烤鸡', price: 22 * 32 / 34},
                      {name: '彩色时蔬', price: 9 * 32 / 34},
                      {name: '米饭', price: 3 * 32 / 34}
                    ],
    '法兰西奶油葡萄酒烩鸡': [
                      {name: '法兰西奶油白葡萄酒烩鸡肉', price: 24 * 34 / 36},
                      {name: '彩色时蔬', price: 9 * 34 / 36},
                      {name: '米饭', price: 3 * 34 / 36}
                    ],
    '马来西亚黄咖喱鸡': [
                      {name: '马来西亚黄咖喱鸡', price: 26 * 36 / 38},
                      {name: '彩色时蔬', price: 9 * 36 / 38},
                      {name: '米饭', price: 3 * 36 / 38}
                    ]
  },
  '商务套餐B': {
    '匈牙利古拉什烩牛肉': [
                      {name: '匈牙利古拉什烩牛肉', price: 31 * 40 / 42},
                      {name: '清炒西兰花', price: 8 * 40 / 42},
                      {name: '米饭', price: 3 * 40 / 42}
                    ],
    '新加坡浓香咖喱虾': [
                      {name: '新加坡浓香咖喱虾', price: 33 * 42 / 44},
                      {name: '清炒西兰花', price: 8 * 42 / 44},
                      {name: '米饭', price: 3 * 42 / 44}
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

function  getAttrsResult (product, tpl) {
  var aContent = '';
  
  var name = reformName(product.name);

  var list;
  if (name.search(/[AB]/) != -1) {
    name = reformName(product.dish_name);
    list = packageMap[name][product.dish_attrs[0].option_value];
  }
  else {
    list = packageMap[name];
  }
  var discount = product.current_price / product.origin_price;

  for (var i = 0; i < list.length; i++) {
    aContent = '';
    aContent += '<td>' + (list[i].price).toFixed(2) + '</td>'; // 原价
    aContent += '<td>' + (list[i].price * discount).toFixed(2) + '</td>'; // 现价
    aContent += '<td>' + product.number + '</td>'; // 数量
    aContent += '<td>' + (list[i].price * discount * product.number).toFixed(2) + '</td>'; // 总价
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


var EARTHRADIUS = 6370996.81;
var MCBAND = [12890594.86,8362377.87,5591021,3481989.83,1678043.12,0]
var LLBAND = [75,60,45,30,15,0];
var MC2LL = [[1.410526172116255e-008,8.983055096488720e-006,-1.99398338163310,2.009824383106796e+002,-1.872403703815547e+002,91.60875166698430,-23.38765649603339,2.57121317296198,-0.03801003308653,1.733798120000000e+007],[-7.435856389565537e-009,8.983055097726239e-006,-0.78625201886289,96.32687599759846,-1.85204757529826,-59.36935905485877,47.40033549296737,-16.50741931063887,2.28786674699375,1.026014486000000e+007],[-3.030883460898826e-008,8.983055099835780e-006,0.30071316287616,59.74293618442277,7.35798407487100,-25.38371002664745,13.45380521110908,-3.29883767235584,0.32710905363475,6.856817370000000e+006],[-1.981981304930552e-008,8.983055099779535e-006,0.03278182852591,40.31678527705744,0.65659298677277,-4.44255534477492,0.85341911805263,0.12923347998204,-0.04625736007561,4.482777060000000e+006],[3.091913710684370e-009,8.983055096812155e-006,0.00006995724062,23.10934304144901,-0.00023663490511,-0.63218178102420,-0.00663494467273,0.03430082397953,-0.00466043876332,2.555164400000000e+006],[2.890871144776878e-009,8.983055095805407e-006,-0.00000003068298,7.47137025468032,-0.00000353937994,-0.02145144861037,-0.00001234426596,0.00010322952773,-0.00000323890364,8.260885000000000e+005]];
var LL2MC = [[-0.00157021024440, 1.113207020616939e+005, 1.704480524535203e+015, -1.033898737604234e+016, 2.611266785660388e+016,-3.514966917665370e+016,2.659570071840392e+016,-1.072501245418824e+016,
           1.800819912950474e+015,82.5],
          [8.277824516172526e-004,1.113207020463578e+005,6.477955746671608e+008,-4.082003173641316e+009,
           1.077490566351142e+010,-1.517187553151559e+010,1.205306533862167e+010,-5.124939663577472e+009,
           9.133119359512032e+008,67.5],
          [0.00337398766765,1.113207020202162e+005,4.481351045890365e+006,-2.339375119931662e+007,
           7.968221547186455e+007,-1.159649932797253e+008,9.723671115602145e+007,-4.366194633752821e+007,
           8.477230501135234e+006,52.5],
          [0.00220636496208,1.113207020209128e+005,5.175186112841131e+004,3.796837749470245e+006,9.920137397791013e+005,
           -1.221952217112870e+006,1.340652697009075e+006,-6.209436990984312e+005,1.444169293806241e+005,37.5],
          [-3.441963504368392e-004,1.113207020576856e+005,2.782353980772752e+002,2.485758690035394e+006,6.070750963243378e+003,
           5.482118345352118e+004,9.540606633304236e+003,-2.710553267466450e+003,1.405483844121726e+003,22.5],
          [-3.218135878613132e-004,1.113207020701615e+005,0.00369383431289,8.237256402795718e+005,0.46104986909093,
           2.351343141331292e+003,1.58060784298199,8.77738589078284,0.37238884252424,7.45]];
           

function pixelToLngLat(x, y, zoom) {
    return convertMC2LL([x / Math.pow(2, zoom - 18), y / Math.pow(2, zoom - 18)]);
}

function lngLatToPixel(lng, lat, zoom) {
    var mercator = convertLL2MC([lng, lat]);
    var x = mercator[0] * Math.pow(2, zoom - 18);
    var y = mercator[1] * Math.pow(2, zoom - 18);
    return [Math.ceil(x), Math.ceil(y)];
}

function convertLL2MC(point) {
    var temp,factor;
    point[0] = getLoop(point[0], -180, 180);
    point[1] = getRange(point[1], -74, 74);
    temp = point.slice(0);
    for(var i = 0; i < LLBAND.length; i ++){
      if(temp[1] >= LLBAND[i]){
        factor = LL2MC[i];
        break;
      }
    }
    if(!factor){
      for(var i = LLBAND.length-1; i >= 0; i--){
        if(temp[1] <= - LLBAND[i]){
          factor = LL2MC[i];
          break;
        }
      }
    }
    var mc = convertor(point, factor);
    var point = [mc[0].toFixed(2), mc[1].toFixed(2)];
    return point;
}
function convertMC2LL(point) {
    var temp, factor;
    temp = [Math.abs(point[0]), Math.abs(point[1])];
    for (var i = 0; i < MCBAND.length; i ++){
      if (temp[1] >= MCBAND[i]){
        factor = MC2LL[i];
        break;
      }
    }
    var lnglat = convertor(point, factor);
    var point = [lnglat[0].toFixed(6),lnglat[1].toFixed(6)];
    return point; 
}
function convertor(fromPoint, factor) {
    if (!fromPoint || !factor) {
      return;
    }
    var x = factor[0] + factor[1] * Math.abs(fromPoint[0]);
    var temp = Math.abs(fromPoint[1]) / factor[9];
    var y = factor[2] + 
            factor[3] * temp +
            factor[4] * temp * temp +
            factor[5] * temp * temp * temp +
            factor[6] * temp * temp * temp * temp +
            factor[7] * temp * temp * temp * temp * temp + 
            factor[8] * temp * temp * temp * temp * temp * temp;
    x *= (fromPoint[0] < 0 ? -1 : 1);
    y *= (fromPoint[1] < 0 ? -1 : 1);
    return [x, y];
}

function getRange(v, a, b) {
    if(a!=null){
      v=Math.max(v,a);
    }
    if(b!=null){
      v=Math.min(v,b);
    }
    return v
}

function getLoop(v, a, b) {
    while(v>b){
      v-=b-a
    }
    while(v<a){
      v+=b-a
    }
    return v;
}

// console.log(lngLatToPixel(116.404, 39.915, 18));
// console.log(pixelToLngLat(12958175, 4825924, 18));
