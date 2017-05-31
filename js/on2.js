window.onload = function(){
  
    // getCourseList();
    // login();
    informBar.init();
    follow.init();
};


function $(id){
    return document.getElementById(id);
}

/**1.1 关闭顶部通知条
 * 1: cookie方法封装
 * 2: 关闭顶部通知条方法 informBar()
 *  2.1 初始化事件
 *  2.2: 给通知条添加绑定事件 closeInformBar()
 *  2.3: 页面加载判断是否设置cookie
 */

// 1: cookie方法封装
var cookie = { 

    get: function (name) {
        var name = encodeURIComponent(name) + '=',
            cookie = document.cookie,
            begin = cookie.indexOf(name);
        
        // 查找name的起始的索引值
        if (begin > -1) {
            var end = cookie.indexOf(';', begin);
            if (end == -1) end = cookie.length;
            // 提取出value的值
            var value = cookie.substring(begin + name.length,end);
            
            // 返回查询到cookie的value值
            return decodeURIComponent(value);
        } else{
            return '';
        }
    },

    set: function (name,value,expires) {
            var name = encodeURIComponent(name);
            var value = encodeURIComponent(value);
            // name,value是必须传入的参数
            var nessInfo = name + '=' + value;

            var now = new Date();
            // getDate(0)是获取到天数的方法
            now.setDate(now.getDate() + expires);
            // 过期时间和路径可有可无，这里用三元操作符进行判断，也可以用if判断
            var expires = (expires instanceof Number) ? '' : ';expires=' + now.toGMTString();

            document.cookie = nessInfo + expires;
        }
}

// 2: 关闭顶部通知条方法 informBar()
var informBar = {

    // 2.1: 初始化事件
    init: function() {
        this.closeInformBar();
        this.loadShutDown('isShutDown');
    },

    // 2.2: 给通知条添加绑定事件
    closeInformBar: function() {
        $('shutDown').onclick = function(){
            cookie.set('isShutDown',true,10);
            // console.log(document.cookie);
            $('inform').style.display = 'none';
        }
    },

    //2.3: 页面加载判断是否设置cookie
    loadShutDown: function() {
        var isSetCookie = cookie.get(name);
        if (isSetCookie == 'true') {
            $('inform').style.display = 'none';
        }
    }
}


/**1.2	关注“网易教育产品部”/登录
 * 1：初始化事件
 * 2: 判断是否设置cookie
 * 3: 登录请求判断方法
 * 4: 登录返回数据参数方法
 */

var follow = {

    // 1.初始化事件
    init: function() {
        this.btnFollow();
        // this.login();
    },

    // 2.判断是否设置cookie
    btnFollow: function() {
        var btns = $('before-follow').getElementsByTagName('button');
        var inputs = $('login').getElementsByTagName('input');
        var followCookie = cookie.get('loginSuc');
        console.log('followCookie = '+ followCookie);
        // 模拟失败情形
        // var followCookie = false;
        if(followCookie) {
            $('before-follow').style.display = 'none';
            $('after-follow').style.display = 'block';
        }
        // btns绑定事件
        btns[0].onclick = function () {
            // 判断登录的cookie是否已经设置(loginSuc)
            if (!followCookie) {
                // 弹出登陆窗
                $('login').style.display = 'block';
                // 设置cookie
                inputs[2].onclick = this.login();
            }
        }  
    },

    // 3.登录请求判断方法
    login: function() {
        // 登录的数据为输入框的value值
        var inputs = $('login').getElementsByTagName('input');
        var loginData = {
            userName: inputs[0].value,
            password: inputs[1].value
        };
        var url = 'http://study.163.com/webDev/login.htm';

        get(url,loginData,this.loginDo());
    },

    // 4.登录返回数据参数方法
    loginDo: function(data) {
        // 核心是对拿到的数据进行处理
        // 拿到的数据为1，表示匹配成功，匹配成功才设置cookie！
        if (data == 0) { //这里判断后面要改，因为，无法获取返回的数据为1！！
            $('login').style.display = 'none';
            cookie.set('loginSuc',true,5);
            $('before-follow').style.display = 'none';
            $('after-follow').style.display = 'block';
        }
    }
}





/** 获取课程数据函数模块
 * 1.getCourseList()
 * 2.get(url,data,callback) 
 * 3.renderCoursesList(data)
 * 4.si2detail()
 * 5.renderCoursesHot(data)
 * 6.login()
 * 7.loginDo
 */

// 1.获取课程方法
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

// 2.AJAX get 方法封装
function get(url,data,callback) {

  // 将请求参数从对象转换为&字符连接的字符串
  var data = data || {};
  if(data.length === 0) return false;
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

// 3.显示课程列表方法
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

// 4.鼠标悬浮显示课程详细信息方法
function si2detail() {
    var simple = $('list').getElementsByTagName('div');
    simple[1].style.borderRightColor = 'red';
    console.log(simple[0].innerHTML);
    var detail = 1;
};

// 5.显示右侧课程列表方法
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

