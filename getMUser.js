var orderMap = [];

getData();
function getData() {
  url = 'http://e.waimai.meituan.com/v2/analysis/customerAnalysis/overview/r/general?recentDays=90&wmPoiId=561165&sortType=desc&sortValue=1';
  // url = 'http://e.waimai.meituan.com/v2/analysis/flowanalysis/flowgeneral/r/generalInfo?recentDays=30&wmPoiId=561165&sortType=desc&sortValue=1';
  console.log('------- Go -------');
  $.get(url, function(result) {
    printResult(result.data.customerGeneralChartVoList);
  });
}


var html = '<table>'
      + '<tr>'
        + '<th>日期</th>'
        // + '<th>同行优秀新顾客占比</th>'
        // + '<th>同行优秀下单顾客数</th>'
        // + '<th>同行优秀成交顾客数</th>'
        // + '<th>同行优秀下单转化率</th>'
        // + '<th>同行优秀访问顾客数</th>'
        + '<th>新顾客数</th>'
        // + '<th>下单顾客数</th>'
        // + '<th>成交顾客数</th>'
        // + '<th>下单转化率</th>'
        // + '<th>访问顾客数</th>'

            

      + '</tr>';
function printResult(list){
  // console.log(orderMap);
  for (var i = 0, l = list.length; i < l; i++) {
    html += '<tr>';
    html += '<td>' + list[i].date + '</td>';
    // html += '<td>' + list[i].fineNewRate + '</td>';
    // html += '<td>' + list[i].fineOrders + '</td>';
    // html += '<td>' + list[i].fineTurnoverOrders + '</td>';
    // html += '<td>' + list[i].fineTurnoverRate + '</td>';
    // html += '<td>' + list[i].fineVisiters + '</td>';
    html += '<td>' + list[i].newRate * list[i].orders + '</td>';
    // html += '<td>' + list[i].orders + '</td>';
    // html += '<td>' + list[i].turnoverOrders + '</td>';
    // html += '<td>' + list[i].turnoverRate + '</td>';
    // html += '<td>' + list[i].visiters + '</td>';
    html += '</tr>';
  }
  html += '</table>';
  // console.log(html);
  document.body.innerHTML = html;
}


