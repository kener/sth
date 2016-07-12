var startDate = new Date('2016-06-01');
var endDate = new Date('2016-06-02');

var orderMap = [];

getByDate(startDate, endDate);
function getByDate(sDate, eDate) {
  url = 'https://app-api.shop.ele.me/stats/invoke/?method=goodsStats.getGoodsSalesStats';
  var data = {
    id: "ed580149-d8ea-4c84-9f6f-8bdadd31cb78",
    metas: {
      appName: "melody",
      appVersion: "4.4.0",
      ksid: "j82G79J54WHSn4MgF8rIZnp47sormDackbuA"
    },
    method: "getGoodsSalesStats",
    ncp: "2.0.0",
    params: {
      goodsSalesQuery: {
        asc: false,
        beginDate: "2016-06-20",
        endDate: "2016-06-20",
        focused: false,
        limit: 10,
        newDish: false,
        orderBy: "COUNT",
        page: 1
      },
      shopId: 80080239
    },
    service: "goodsStats"
  };
  console.log('------- Go -------');

  $.ajax({
    type: "POST",     //提交方式
    contentType: "application/json; charset=utf-8",   //内容类型
    dataType: "json",     //类型
    url: url,
    data: JSON.stringify(data),
    success: function (result) { //如果执行成功，那么执行此方法
      mark(result);return;
      printResult();
    },
    error: function (err) { //如果执行不成功，那么执行此方法
      setTimeout(pollGet, 500);
    }
  });
}

function mark(result) {
  console.log(result);return;
  var list = result.wmOrderList;
  var orderId;

  for (var i = 0; i < list.length; i++) {
    //orderId = list[i].wm_order_id_view_str;
    orderMap.push({
      orderTime: list[i].order_time_fmt,
      orderId: list[i].wm_order_id_view_str,
      userId : list[i].user_id,
      recipientAddress: list[i].recipient_address,
      recipientName: list[i].recipient_name,
      recipientPhone: list[i].recipient_phone,
      isFirstOrder : list[i].is_poi_first_order
    });
  }
}

var html = '<table>'
      + '<tr>'
        + '<th>订单编号</th>'
        + '<th>下单时间</th>'
        + '<th>用户Id</th>'
        + '<th>用户名</th>'
        + '<th>用户类型</th>'
        + '<th>电话</th>'
        + '<th>地址</th>'
      + '</tr>';
function printResult(){
  // console.log(orderMap);
  for (var i = orderMap.length - 1; i >= 0 ; i--) {
    html += '<tr>';
    html += '<td>' + orderMap[i].orderId+ '</td>';//561160000000000
    html += '<td>' + orderMap[i].orderTime + '</td>';
    html += '<td>' + orderMap[i].userId + '</td>';
    html += '<td>' + orderMap[i].recipientName + '</td>';
    html += '<td>' + (orderMap[i].isFirstOrder ? '新用户' : '复购用户') + '</td>';
    html += '<td>' + orderMap[i].recipientPhone + '</td>';
    html += '<td>' + orderMap[i].recipientAddress + '</td>';
    html += '</tr>';
  }
  html += '</table>';
  // console.log(html);
  document.body.innerHTML = html;
}



