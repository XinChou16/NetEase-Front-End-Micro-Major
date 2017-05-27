window.onload = function(){
  
    // getCourseList();
    login();
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
    var url1 = 'http://study.163.com/webDev/couresByCategory.htm';
    var url2 = 'http://study.163.com/webDev/hotcouresByCategory.htm';

    // get(url1,data,renderCoursesList);
    get(url2,null,renderCoursesHot);
    si2detail();
}

// AJAX get 方法
function get(url,data,callback) {

  // 将请求参数从对象转换为&字符连接的字符串
  var data = data || {};
  if(data.length ===0) return false;
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
        console.log('获取数据成功');
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

// 显示课程列表
function renderCoursesList(data) {
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

// 鼠标悬浮显示课程详细信息
function si2detail() {
    var simple = $('list').getElementsByTagName('div');
    simple[1].style.borderRightColor = 'red';
    console.log(simple[0].innerHTML);
    var detail = 1;
};

// 显示右侧课程列表
function renderCoursesHot(data){
    var popHTML = '';

    // HTML代码拼接
    popHTML += '<li><a href="#"><img src="';
    popHTML += data[0].smallPhotoUrl + '" alt="';
    popHTML += data[0].name + '"><p>';
    popHTML += data[0].name + '</p><p class="follow"><i class="person"></i><span>';
    popHTML += data[0].learnerCount + '</span></p></a></li>';

    $('pop-list').innerHTML = popHTML;
}

// 登录请求判断
function login(){
    var loginData = {
        userName: 'studyOnline' ,
        password: 'study.163.com'
    };
    var url = 'http://study.163.com/webDev/login.htm';
    get(url,loginData,loginDo);
}

// 登录返回数据参数
function loginDo(data){
    console.log(data);
    console.log(1);
}

