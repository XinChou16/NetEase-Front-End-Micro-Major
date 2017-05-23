window.onload = function(){
  
    getCourseList();
};


function $(id){
    return document.getElementById(id);
}
// 获取课程
function getCourseList() {
    var data = {
        pageNo:1,
        psize:20,
        type:10
    };
    var url = 'http://study.163.com/webDev/couresByCategory.htm';
    get(url,data,renderCourses);
    si2detail();
}

// AJAX get 方法
function get(url,data,callback) {

// 将请求参数从对象转换为&字符连接的字符串
  var urlLast = '';
  for(var key in data){
    urlLast += '&' + key + '=' + data[key];
  }
  url += '?' + urlLast.substr(1);
  console.log(url);
  
  // 创建一个新请求
  var xhr = new XMLHttpRequest();
  if(!xhr) return false;  

  // 监测代理状态，发送改变时，触发事件，执行相应的函数
  xhr.onreadystatechange = function () {
    if(xhr.readyState === XMLHttpRequest.DONE) {
      if(xhr.status === 200) {
        console.log('获取课程课表数据成功');
        var resTxt = JSON.parse(xhr.responseText);
        callback(resTxt);
      }else{
        console.log('获取数据失败,错误代码： ' + xhr.status);
      }
    }
  };
  // 创建一个请求，以备发送
  xhr.open('GET',url, true);
  // 发送请求
  xhr.send(null);
}

// AJAX get方法传入的回调函数 - 显示课程方法
function renderCourses(data) {
    console.log(data.totalCount);
    var cHTML = '';
    if (data.list[0].price === 0) {
        data.list[0].price = '免费';
    }else{
        data.list[0].price = '￥' + data.list[0].price;
    }

    cHTML += '<div class="courses"><div class="c-list" id="c-list"><div class="img"><img  src="';
    cHTML += data.list[0].middlePhotoUrl + '" alt="' ;
    cHTML += data.list[0].name + '"></div><div class="c-info" ><p class="title">';
    cHTML += data.list[0].name + '</p><p class="author">';
    cHTML += data.list[0].provider + '</p><p class="follow"><i class="person"></i><span>';
    cHTML += data.list[0].learnerCount + '</span></p><p class="money">';
    cHTML += data.list[0].price + '</p></div></div><div class="c-detail clearfix" style="display: none"><img class="img" src="';
    cHTML += data.list[0].bigPhotoUrl + '"><div class="c-det clearfix"><p class="title">';
    cHTML += data.list[0].name + '</p><div class="c-count"><i class="c-icon"></i>';
    cHTML += data.list[0].learnerCount + '<p class="c-provider">';
    cHTML += data.list[0].provider + '</p><p class="c-category">';
    cHTML += data.list[0].categoryName  + '</p></div></div><div class="c-desc clearfix"><p>';
    cHTML += data.list[0].description  + '</p></div></div>';
    $('list').innerHTML = cHTML;
}
function si2detail() {
    var simple = $('list').getElementsByTagName('div');
    simple[1].style.borderRightColor = 'red';
    console.log(simple[0].innerHTML);
    var detail = 1;
};



