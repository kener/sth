var orderMap = [];

getData();
function getData() {
  url = 'http://e.waimai.meituan.com/v2/analysis/flowanalysis/flowgeneral/r/generalInfo?recentDays=30&wmPoiId=561165&sortType=desc&sortValue=1';
  console.log('------- Go -------');
  $.get(url, function(result) {
    printResult(result.data.flowGeneralChartVoList);
  });
}


var html = '<table>'
      + '<tr>'
        + '<th>日期</th>'
        + '<th>曝光次数</th>'
        + '<th>曝光人数</th>'
        + '<th>访问次数</th>'
        + '<th>访问人数</th>'
        + '<th>下单数量</th>'
        + '<th>下单人数</th>'
        + '<th>下单转化率</th>'
        + '<th>访问转化率</th>'
      + '</tr>';
function printResult(list){
  // console.log(orderMap);
  
  for (var i = 0, l = list.length; i < l; i++) {
    html += '<tr>';
    html += '<td>' + list[i].date + '</td>';
    html += '<td>' + list[i].exposureCnt + '</td>';
    html += '<td>' + list[i].exposureNum + '</td>';
    html += '<td>' + list[i].visitCnt + '</td>';
    html += '<td>' + list[i].visitNum + '</td>';
    html += '<td>' + list[i].orderCnt + '</td>';
    html += '<td>' + list[i].orderNum + '</td>';
    html += '<td>' + list[i].orderRate + '</td>';
    html += '<td>' + list[i].visitRate + '</td>';
    html += '</tr>';
  }
  html += '</table>';
  // console.log(html);
  document.body.innerHTML = html;
}


