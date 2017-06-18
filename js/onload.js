window.onload = function(){
    
    // 1.1 关闭顶部通知条
    informBar.init();

    // 1.2	关注“网易教育产品部”登录
    follow();

    // 1.5	左侧内容区tab切换
    // 1.6	查看课程详情
    // 1.8	右侧“热门推荐”
    getCourseList();
    
};


function $(id){
  return document.getElementById(id);
}

function $$(selector){
  return [].slice.call(document.querySelectorAll(selector));
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



/**1.2	关注“网易教育产品部”登录
 * 1: 主函数，判断是否设置cookie
 * 2: 登录请求判断方法
 * 3: 登录返回数据参数方法
 */

// 1:主函数，判断是否设置cookie
function follow() {
    var btns = $('before-follow').getElementsByTagName('button');
    var inputs = $('login').getElementsByTagName('input');
    var followCookie = cookie.get('loginSuc');
    var shutDown = $$('.content .shutdown')[0];
    // console.log('followCookie = '+ followCookie);
    // 模拟失败情形
    // var followCookie = false;
    if(followCookie) {
        $('before-follow').style.display = 'none';
        $('after-follow').style.display = 'block';
    }

    shutDown.onclick = function(){
        $('login').style.display = 'none';
    }
    // btns绑定事件
    btns[0].onclick = function () {
        // 判断登录的cookie是否已经设置(loginSuc)
        if (!followCookie) {
            // 弹出登陆窗
            $('login').style.display = 'block';
            // 设置cookie
            inputs[2].onclick = login;
        }
    }  
}

// 2.登录请求判断方法
function login(){
    // 登录的数据为输入框的value值
    var inputs = $('login').getElementsByTagName('input');
    var url = 'http://study.163.com/webDev/login.htm';
    var loginData = {
        userName: inputs[0].value,
        password: inputs[1].value
    };

    get(url,loginData,loginDo);
}

// 3.登录返回数据参数方法
function loginDo(data){
    // 核心是对拿到的数据进行处理
    // 拿到的数据为1，表示匹配成功，匹配成功才设置cookie！
   if (data == 0) { //这里判断后面要改，因为，无法获取返回的数据为1！！
        $('login').style.display = 'none';
        cookie.set('loginSuc',true,5);
        $('before-follow').style.display = 'none';
        $('after-follow').style.display = 'block';
   }
}



/** 
 * 1.4 轮播模块
 */

var carousel = (function (){
   
    var timer;
    // 每次左移一个图片的距离
    function slideNext() {
        var slides = $$('.slide');
        var wrap = $$('.s-slide')[0];
        var imgIndex =1;
        
        timer = setInterval(function(){
            
            if(imgIndex >= slides.length){
            imgIndex = 1;
        }
            
            wrap.style.transform = 'translateX(' + imgIndex*(-100) + '%)';
            imgIndex++;
            
            showDot();
        },2000);
        
        stop(timer);
        show();
        run();
    }

    var index = 0;
    function showDot(){
        var dot = $$('.cursor');
    
        index++;//放在最后面，后出现bug
        if(index > 2) index=0;
        for(var i =0;i<3;i++){
            if( dot[i].className == 'cursor active'){
                 dot[i].className='cursor';
            }
        }

        dot[index].className+=' active';
    }

    function stop(timer){
        $$('.banner')[0].onmouseover = function(){
            clearInterval(timer);
        };
    }
    function run(){
        $$('.banner')[0].onmouseout = function(){
            slideNext();
        };
    }

    function show(){
        var dots = $$('.cursor');
        var wrap = $$('.s-slide')[0];
        dots.forEach(function(item,index){
            item.onclick = function(){
            wrap.style.transform = 'translateX(' + (index)*(-100) + '%)';
            showDot();
            }
        });
    } 

    slideNext();

})();


/** 1.5	左侧内容区tab切换
 *  1.6	查看课程详情
 *  1.8	右侧“热门推荐”
 * 获取课程数据函数模块
 * 1.
 */

// 1.获取课程方法
function getCourseList() {
    // 产品设计请求数据 
    var data1 = reqData(1,10,10);
    var data2 = reqData(2,10,10);
    var url1 = 'http://study.163.com/webDev/couresByCategory.htm';
    var url2 = 'http://study.163.com/webDev/hotcouresByCategory.htm';
    var productList = $('tabs').querySelectorAll('li')[0];
    var programList = $('tabs').querySelectorAll('li')[1];

    get(url1,data1,renderCoursesList);
    
    productList.addEventListener('click',function() {
        get(url1,data1,renderCoursesList);
        programList.removeAttribute('class','active');
        productList.setAttribute('class','active');
    },false)
    // get(url1,data,renderCoursesListDetail);
    get(url2,null,renderCoursesHot);
    switchProgram();
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

// 请求数据函数封装
function reqData(pageNo,psize,type) {
    return {
        pageNo: pageNo,
        psize: psize,
        type: type
    }
}

// 3.显示课程列表方法
function renderCoursesList(data) {
    var cHTML = '';
    // 每页的数据个数
    var pageSize = data.pagination.pageSize;
    // 当前页码
    var pageIndex = data.pagination.pageIndex;
    
    for (var i = pageSize*(pageIndex-1); i < pageSize*pageIndex; i++) {
        if (data.list[i].price === 0) {
            data.list[i].price = '免费';
        }else{
            data.list[i].price = '￥' + data.list[i].price;
        }

        // HTML代码拼接
        cHTML += '<div class="courses"><div class="c-list"id="c-list"><div class="c-wrap"><div class="img"><img src="';
        cHTML += data.list[i].middlePhotoUrl + '" alt="' ;
        cHTML += data.list[i].name + '"></div><div class="c-info"><p class="title">';
        cHTML += data.list[i].name + '</p><p class="author">';
        cHTML += data.list[i].provider + '</p><p class="follow"><i class="person"></i><span>';
        cHTML += data.list[i].learnerCount + '</span></p><p class="money">';
        cHTML += data.list[i].price + '</p></div></div></div><div class="c-detail clearfix"id="c-detail"style="display: none;"><img class="img"src="';
        cHTML += data.list[i].bigPhotoUrl + '"><div class="c-det clearfix"><p class="title">';
        cHTML += data.list[i].name + '</p><div class="c-count"><i class="c-icon"></i>';
        cHTML += data.list[i].learnerCount + '<p class="c-provider">';
        cHTML += data.list[i].provider + '</p><p class="c-category">';
        cHTML += data.list[i].categoryName  + '</p></div></div><div class="c-desc clearfix"><p>';
        cHTML += data.list[i].description  + '</p></div></div></div>';
    }

    $('list').innerHTML = cHTML;
    
    pageNumber(data);
    hoverC();
}

// 4.鼠标悬浮显示课程详细信息方法 - 功能未实现，，，
function hoverC() {
     
    // for (var i = 0; i < 3; i++) {
        var simple = $$('.c-list');
        var detail = $$('.c-detail');

        simple[0].addEventListener('mouseover',function() {
            simple[0].style.display = 'none';
            detail[0].style.display = 'block';
        },false) 
        detail[0].addEventListener('mouseout',function() {
            detail[0].style.display = 'none';
            simple[0].style.display = 'block';
        },false)

    // }

}

// 5.显示课程列表详细内容方法
function renderCoursesListDetail(data) {
    var cHTML = '';
    if (data.list[0].price === 0) {
        data.list[0].price = '免费';
    }else{
        data.list[0].price = '￥' + data.list[0].price;
    }

    cHTML += '<img class="img"src="';
    cHTML += data.list[0].middlePhotoUrl + '"><div class="c-det clearfix"><p class="title">' ;
    cHTML += data.list[0].name + '</p><div class="c-count"><i class="c-icon"></i>"3rf"<p class="c-provider">';
    cHTML += data.list[0].provider + '</p><p class="c-category">';
    cHTML += data.list[0].provider + '</p><p class="follow"><i class="person"></i><span>';
    cHTML += data.list[0].learnerCount + '</p></div></div><div class="c-desc clearfix"><p>';
    cHTML += data.list[0].description + '</p></div>';

    $('c-detail').innerHTML = cHTML;
}

// 6.点击编程语言切换显示课程
function switchProgram() {
    var programList = $('tabs').querySelectorAll('li')[1];
    var productList = $('tabs').querySelectorAll('li')[0];
    var url1 = 'http://study.163.com/webDev/couresByCategory.htm';
    var data2 = {
        pageNo:1,
        psize:20,
        type:20
    }; 
    programList.addEventListener('click',function() {
        get(url1,data2,renderCoursesList);
        programList.setAttribute('class','active');
        productList.removeAttribute('class','active');
    },false)
}

// 7.动态创建翻页页码
function pageNumber(data) {
    var page = $('page');
    var pageHTML = '<i class="before-page"></i>';
    var pageNo = data.pagination.totlePageCount;

    for(var i = 1; i < pageNo+1; i++){
        pageHTML += '<a href="javascript:;"><span>'
        pageHTML += i;
        pageHTML += '</span></a>'
    }
    pageHTML += '<i class="next-page"></i>';
    page.innerHTML = pageHTML;

    pageSwitch(pageNo);
    
    // 设置当前页码的颜色
    $('page').querySelectorAll('span')[0].style.color = '#39a030'
}

// 8.点击页码切换课程
function pageSwitch(pageNo) {
    var page = $('page')
    var curPageTxt = $('page').querySelectorAll('span');

        page.addEventListener('click',function(e) {
            e.target.style.color = '#39a030'
        },false)
   
}

// 9.显示右侧课程列表方法
function renderCoursesHot(data){
    var popHTML = '';

    for (var i = 0; i < data.length; i++) {
        // HTML代码拼接
        popHTML += '<li><a href="#"><img src="';
        popHTML += data[i].smallPhotoUrl + '" alt="';
        popHTML += data[i].name + '"><p>';
        popHTML += data[i].name + '</p><p class="follow"><i class="person"></i><span>';
        popHTML += data[i].learnerCount + '</span></p></a></li>';
    }

    $('pop-list').innerHTML = popHTML;
    $('pop-list').setInterval = popHTML;
    courseRoll();
}

// 10.右侧热门课程滚动显示
function courseRoll() {
    var popWrap = $('pop-wrap');
    var popList = $('pop-list');
    var oTop = 0;
    var roll;

    function scroll() {
        roll = setInterval(changeCourse,1000);
    };
    scroll();

    function changeCourse(){

        // 判断是否移动至最后一个
        if(oTop < -560){
            oTop = 0;
            popList.style.top = oTop  + 'px';
        }else{
            // 不是最后一个就滚动
            oTop += -70;
            popList.style.top = oTop  + 'px';
        }
    }

    function clearScroll(){
        popList.onmouseover = function(){
            clearInterval(roll);
        }
        popList.onmouseout = function(){
            scroll();
        }
    };
    clearScroll();

}



/** 1.7	右侧“机构介绍”中的视频介绍
 * 1.主函数，显示及隐藏视频介绍
 */

var showVideo = (function (){
    var picHolder = $$('.v-info')[0];
    var videoArea = $$('.v-mask')[0];
    var videoClose = $$('.close')[0];

    // 点击视频介绍图片显示视频浮层
    picHolder.onclick = function() {
        videoArea.style.display = 'block';
    }
    // 点击右上角关闭按钮隐藏视频浮层
    videoClose.onclick = function() {
        videoArea.style.display = 'none';
    }
})();

