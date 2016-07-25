var startDate = new Date('2016-07-04');
var endDate = new Date('2016-07-23');

var commentList = [];
var curDate = startDate;
var curPage = 1;
var totalPage = 1;

var callFinish = false;
require('manage:widget/comment/commentMng/list/list.js').createWidget = function (s) {
  callFinish = true;
  curPage = s.curr_page;
  totalPage = s.page_count;
  if (curPage != totalPage) {
    alert('要升级了');
  }
  commentList = commentList.concat(s.comment_list);
  // console.log(s);
}
// require('wand:widget/common/order/orderlist_pager/pager.js').createWidget = function(s) {
//   curPage = s.content.curr_page;
//   totalPage = s.content.page_count;
//   callFinish = true;
//   console.log(s);
// }
function next(){
  if (!callFinish) {
    setTimeout(next,500);
  }
  // if (curPage < totalPage) {
  //   curPage += 1;
  //   getByDate();
  // }
  // else 
  if (curDate < endDate) {
    curDate = getTheNextNDate(1, curDate);
    // curPage = 1;
    getByDate();
  }
  else {
    // getUserType();
    printResult();
  }
}

var url = 'http://wmcrm.baidu.com/crm?qt=getcommentlist&start_time=sDate%2000:00:00&end_time=eDate%2023:59:59&bill_status=1&page_count=100';
function getByDate(){
  console.log(format('----- YYYY-MM-DD -----', curDate));
  var curDateStr = format('YYYY-MM-DD', curDate);
  var newUrl = url.replace('sDate', curDateStr).replace('eDate', curDateStr);//.replace('tPage',curPage);
  console.log(newUrl)
  $.get(newUrl, function(result){
    callFinish = false;
    document.write(result);
    setTimeout(next,500);
  });
}
getByDate();

var html = '<table>'
      + '<tr>'
        + '<th>订单ID</th>'
        + '<th>评论时间</th>'
        + '<th>配送时长</th>'

        + '<th>评论标签</th>'
        + '<th>评论内容</th>'

        + '<th>配送评分</th>'
        + '<th>菜品评分</th>'
        + '<th>综合计算得分</th>'
        + '<th>显示得分</th>'

        + '<th>好评菜品</th>'
        + '<th>差评菜品</th>'
      + '</tr>';

var badDishList;

function printResult(){
  // console.log(orderMap);
  var data;
  for (var i = 0; i < commentList.length ; i++) {
    data = commentList[i];
    html += '<tr>';

    html += '<td>' + data.order_id + '</td>'; // 订单ID
    html += '<td>' + data.audit_time + '</td>'; // 评论时间
    html += '<td>' + data.cost_time + '</td>'; // 配送时长

    
    html += '<td>' + getCommentLabels(data.comment_labels)+ '</td>'; // 评论标签
    html += '<td>' + data.content + '</td>'; // 评论内容
    
    html += '<td>' + data.service_score + '</td>'; // 配送评分
    html += '<td>' + data.dish_score + '</td>'; // 菜品评分
    html += '<td>' + data.cal_score + '</td>'; // 综合计算得分
    html += '<td>' + data.score + '</td>'; // 显示得分

    html += '<td>' + getRecommendDishes(data.recommend_dishes, data.dish_info)+ '</td>'; // 评论标签
    eval('badDishList  = ' + data.bad_dishes);
    html += '<td>' + getRecommendDishes(badDishList, data.dish_info)+ '</td>'; // 评论标签

    html += '</tr>';
  }
  html += '</table>';
  
  // console.log(html2);
  document.body.innerHTML = html;
}

function getCommentLabels (labelList) {
  var res = [];
  for (var i = 0; i < labelList.length; i++) {
    res.push(labelList[i].content);
  }
  return res.join(' ');
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

// 整形数据
for (var key in packageMap) {
  if (key.search(/[AB]/) != -1) {
    for (var opt in packageMap[key]) {
      for (var i = 0; i < packageMap[key][opt].length; i++) {
        packageMap[key][opt][i] = packageMap[key][opt][i].name;
      }
    }
  }
  else {
    for (var i = 0; i < packageMap[key].length; i++) {
      packageMap[key][i] = packageMap[key][i].name;
    }
  }
}

function  getRecommendDishes (recommendDishList, dishList) {
  // console.log(recommendDishList)
  var dishMap = {};
  var optionName;
  var name;
  for (var i = 0; i < dishList.length; i++) {
    name = reformName(dishList[i].name);
    if (name.search(/商务/) != -1) {
      optionName = name.replace(/(商务套餐|A| |B|_)/g,'').replace(/[)(]/g,'')
      name = name.replace(/_.*/g,'').replace(/ /g, '');
      // console.log(optionName, name)
      dishMap[name] = (dishMap[name] || []).concat(packageMap[name][optionName]);
    }
    else if (name.search(/一人餐/) != -1) {
      dishMap[name] = (dishMap[name] || []).concat(packageMap[name]);
    }
  }

  var res = [];
  for (var i = 0; i < recommendDishList.length; i++) {
    var name = reformName(recommendDishList[i]);
    if (dishMap[name]) {
      res = res.concat(dishMap[name]);
    }
    else {
      res.push(name);
    }
  }

  return res.join(' ');
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
