var targetDay = getTheNextNDate(1,new Date(),'YYYY-MM-DD');
var now = new Date(format('YYYY-MM-DD', new Date()) + ' 15:00:00')
console.log('抢 ' + targetDay + ' at ' + now)
var promotionAreas = {};

var timeTicket;
var hasGet = {
  24295: false,
  24296: false,
  24297: false,
  24298: false,
  24299: false,
  24301: false,
  24593: false,
  24594: false
};
function goFresh () {
  $.get('http://waimaieapp.meituan.com/ad/v1/buy/getPromotionArea?_=' + (now - 0), function(res){console.log(res);return;
    if (res.msg != 'Success' || !res.data || !res.data.promotionAreas.length) {
      goFresh();
      return;
    }
    // clearInterval(timeTicket);
    var pList = res.data.promotionAreas;
    for (var i = 0; i < pList.length; i++) {
      promotionAreas[pList[i].id] = pList[i].positionInfo;
    }
    !hasGet[24296] && getPArea(24296);  // soho
    !hasGet[24295] && getPArea(24295);  // ？
    !hasGet[24297] && getPArea(24297);  // ？
    !hasGet[24298] && getPArea(24298);  // ？
    !hasGet[24299] && getPArea(24299);  // 南湖
    // !hasGet[24301] && getPArea(24301);  // 酒仙桥
    // !hasGet[24593] && getPArea(24593);  // 电子城下
    // !hasGet[24594] && getPArea(24594);  // 电子城上
  });
}
// timeTicket = setInterval(goFresh, 250);
goFresh()

//adSpreadArea:[[{"y":116504769,"x":39981020},{"y":116505944,"x":39981983},{"y":116505100,"x":39984245},{"y":116504769,"x":39984245},{"y":116504769,"x":39981020}]],

function getPArea(id) {
  var posList = promotionAreas[id];
  if (!posList) {
    return;
  }
  var tarPos = false;
  for (var i = 0; i < posList.length; i++) {
    if (posList[i].ableBuy) {
      console.log('【find】 ' + id + ' position:' + posList[i].position + ' price:' + posList[i].price);
      tarPos = posList[i];
      break;
    }
    else {
      console.log('pass ' + id + ' position:' + posList[i].position);
    }
  }
  if (tarPos) {
    hasGet[id] = true;
    $.ajax({
      type: "POST",     //提交方式
      url: 'http://waimaieapp.meituan.com/ad/v1/buy/buyPromotionArea',
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",   //内容类型
      dataType: "json",     //类型
      data: {
        areaId: id,
        priceId: tarPos.id,
        promotionDate: targetDay,
        adPosition: tarPos.position,
        orderPrice: tarPos.price,
        orderFrom:2
      },
      success: function (res) { //如果执行成功，那么执行此方法
        console.log(res);
        if (res.data.msg != "Success") {
          hasGet[id] = false;
        }
      },
      error: function (err) { //如果执行不成功，那么执行此方法
        console.log(err);
        hasGet[id] = false;
      }
    });
  }
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

function getTheNextNDate(n, startDate, formatter) {
  startDate = reformDate(startDate || today);
  startDate.setDate(startDate.getDate() + n);
  return formatter ? format(formatter, startDate) : startDate;
}

// $.ajax({
//     type: "POST",     //提交方式
//     url: 'http://waimaieapp.meituan.com/ad/v1/buy/buyPromotionArea',
//     contentType: "application/x-www-form-urlencoded; charset=UTF-8",   //内容类型
//     dataType: "json",     //类型
//     data: {
//       areaId:24593,
//       priceId:106274,
//       promotionDate:targetDay,
//       adPosition:20,
//       orderPrice:30,
//       orderFrom:2
//     },
//     success: function (res) { //如果执行成功，那么执行此方法
//       console.log(res)
//     },
//     error: function (err) { //如果执行不成功，那么执行此方法
//       console.log(err)
//     }
//   });