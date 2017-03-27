
// 获取DOM节点函数
var $ = function(id){
  return document.getElementById(id);
};

// 关闭顶部提示条
function cookiesave(n, v, mins, dn, path) {
    if (n) {

        if (!mins) {
          mins = 365 * 24 * 60
        };
        if (!path) {
          path = "/"
        };
        var date = new Date();

        date.setTime(date.getTime() + (mins * 60 * 1000));

        var expires = "; expires=" + date.toGMTString();

        if (dn) dn = "domain=" + dn + "; ";
        document.cookie = n + "=" + v + expires + "; " + dn + "path=" + path;
    }
}
// 获取cookie
function cookieget(n) {
      var name = n + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') c = c.substring(1, c.length);
          if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
      }
      return "";
  }
// 点击关闭函数
  function closeclick() {
      $('note').style.display = 'none';
      cookiesave('closeclick', 'closeclick', '', '', '');
  }
// 点击a标签时,使提示条隐藏起来,即实现消失的效果.
  function clickclose() {
      if (cookieget('closeclick') == 'closeclick') {
          $('note').style.display = 'none';
      } else {
          $('note').style.display = 'block';
      }
  }

// ajax 'get'方法
function get(url, options, callback) {
  var pairs = [];
  for(var name in options){
    if (!options.hasOwnProperty(name)) continue;
    if(typeof options[name]=='function') continue;
    var value = options[name].toString();
    name = encodeURIComponent(name);
    value = encodeURIComponent(value);
    pairs.push(name + '=' + value);
  }
  var newOptions = pairs.join('&');
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if (xhr.readyState==4) {
      if((xhr.status>=200 && xhr.status<300)|| xhr.status==304){
        console.log('成功获取数据');
        var data = JSON.parse(xhr.responseText);
        if (typeof callback == 'function') {
          callback(data,options);
        }
      }else{
        console.log('Request was unsuccessful:' + xhr.status);
        return '';
      }
    }
  }
  xhr.open('get', url+'?'+newOptions, true);
  xhr.send(null);
}


/* Cookie读取函数 */
function getCookies(name){
  var cookieName = encodeURIComponent(name) + "=",
      cookieStart = document.cookie.indexOf(cookieName),
      cookieValue = null,
      cookieEnd;

  if (cookieStart > -1){
      cookieEnd = document.cookie.indexOf(";", cookieStart);
      if (cookieEnd == -1){
          cookieEnd = document.cookie.length;
      }
      cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
  }

  return cookieValue;
}

/* Cookie设置函数 */
function setCookie(name, value, expires, path, domain, secure) {
    var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    if (expires instanceof Date) {
        cookieText += "; expires=" + expires.toGMTString();
    }

    if (path) {
        cookieText += "; path=" + path;
    }

    if (domain) {
        cookieText += "; domain=" + domain;
    }

    if (secure) {
        cookieText += "; secure";
    }

    document.cookie = cookieText;
    }


/* 获取课程卡片 */
function getCourse(data){
  var card =document.createElement('div');
  card.setAttribute('class','courses');
  var price;
  if (data.price=='0') {
    price='免费';
  }
  else{
    price='￥' + data.price;
  }
  var html='<div class="img"><img width="223px" height="124px" src=';
  html+=data.middlePhotoUrl;
  html+='></div><div class="c-info"><p class="title">';
  html+=data.name;
  html+='</p><p class="author">'+data.provider;
  html+='</p><div class="follow"><i class="person"></i>';
  html+=data.learnerCount;
  html+='</div><p class="money">'+ price;
  html+='</p></div><div class="c-detail"><img width="223px" height="124px" src=';
  html+=data.middlePhotoUrl;
  html+='><div class="c-det"><p class="title">';
  html+=data.name;
  html+='</p><div class="c-count"><i class="c-icon"></i>';
  html+=data.learnerCount+'人在学';
  html+='<p class="c-provider">'+'发布者：'+data.provider;
  html+='</p><p class="c-category">'+'分类：'+data.categoryName;
  html+='</p></div></div><div class="c-desc clearfix"><p>';
  html+=data.description;
  html+='</p></div></div>';
  courses.innerHTML=html;
  return card;
}

/* 获取左侧课程
  data为Ajax中返回的课程数据
  list为课程数据的数组。
*/
function getCourses(data,options){
  var courseNode=document.querySelector('.cont-left .cont');
  for (var i = 0; i < data.list.length; i++) {
    courseNode.insertBefore(getCourse(data.list[i]),courseNode.firstChild);
  }
}

/* 课程Tab 切换*/
function changeCourses(options,url2){
  var oTab= document.querySelector('.cont-left .head');
  var oCourses=document.querySelector('.cont-left .cont');
  var tabs=oTab.getElementsByTagName('li');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].index=i;
    tabs[i].onclick=function(){
      for (var i = 0; i < tabs.length; i++) {
        tabs[i].className="";
        oCourses.innerHTML='';
      }
      this.className="active";
      options.type=tabs[this.index].getAttribute('data-type');
      get(url2,options,getCourses);
    };
  }
}

/* 获取右侧热门课程列表 */
function getHotCourse(courseData){
  var course=create('div');
  var html='<div class="pop-info clearfix"><img width="50px" height="50px" src=';
  html+=courseData.smallPhotoUrl;
  html+='><div class="pop-des"><p class="t-inline">';
  html+=courseData.name;
  html+='</p><span><i class="c-icon"></i>';
  html+=courseData.learnerCount;
  html+='</span></div></div>';
  course.innerHTML=html;
  return course;
}
function autoCourses(element,num,data){
  var next=num<data.length-1?num+1:0;
  var prev;
  if (element.firstChild.nodeType==1) {
    prev=element.firstChild;
  }else{
    prev=element.childNodes[1];
  }
  element.appendChild(getHotCourse(data[next]));
  element.removeChild(prev);
}
function getHotCourses(data){
  var TopCourses = document.querySelector('.cont-left .n-pop');
  for (var i = 0; i < 10; i++) {
    TopCourses.appendChild(getHotCourse(data[i]));
  }
  setInterval(function(){
    autoCourses(TopCourses,i,data);
    i=i<data.length-1?i+1:0;
  },5000);
}


/* 设置视频播放及关闭 */
function setVideo(url){
  var videoMask = document.querySelector('.side .video .v-mask');
  var closeBtn=videoMask.querySelector('.side .v-mask .v-video .close');
  var video=document.getElementById('myvideo');
  var videoOn=document.querySelector('.side .v-video .close');
  var videoPause=document.querySelector('.side .v-mask .pause');
  videoOn.onclick=function(){
    videoMask.style.display='block';
    video.setAttribute('src',url);
  };
  closeBtn.onclick=function(){
    videoMask.style.display='none';
    video.pause();
  };
  videoPause.onclick=function(){
    if (video.paused) {
      video.play();
    }else{
      video.pause();
    }
  };
}

window.onload = function() {

  // 图片轮播部分

    var banner = $('banner');
    var lis = $('img').getElementsByTagName('li');
    var order = $('order');
    closeclick;

    //根据上面图片的数量创建相应个数的焦点
    for (i = 0; i < lis.length; i++) {
        var newLi = document.createElement('li');
        order.appendChild(newLi);
    }
    //获取焦点事件源，并将第一个添加类（class="on"）
    var orderLis = order.getElementsByTagName('li');
    orderLis[0].className = 'on';

    //设置轮播运动函数
    var num = 0;
    var xh = null;

    function play(num) {
        for (i = 0; i < lis.length; i++) {
            lis[i].className = '';
            orderLis[i].className = '';
        }
        lis[num].className = 'on';
        orderLis[num].className = 'on';
    }
    //自动播放
    function autoPlay() {
        xh = setInterval(function() {
            num++;
            if (num >= lis.length) {
                num = 0;
            } // 循环播放
            play(num);
        }, 3000);
    }
    autoPlay();

    //添加鼠标移入暂停，移出继续轮播事件
    banner.onmouseover = function() {
        clearInterval(xh);
        xh = null;
    }
    banner.onmouseout = function() {
        autoPlay();
    }

    //鼠标移到哪个焦点，就显示那个对应的图片
    for (i = 0; i < orderLis.length; i++) {
        //给每个orderLis添加index属性，利用它记忆每个orderLis自己的索引号
        orderLis[i].index = i;
        orderLis[i].onmouseover = function() {
            //让全局变量num等于此时显示的图片的索引号，防止鼠标离开后继续播放
            num = this.index;
            play(this.index);
        }
    }


    // TAB选项卡
    var tabs = $('tabs').getElementsByTagName('li');
    var ul = $('list').getElementsByTagName('ul');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].index = i;
      tabs[i].onmouseover = function(){
        for (var i = 0; i < tabs.length; i++) {
          tabs[i].className = ul[i].className = '';
        }
        this.className = ul[this.index].className = 'active';
      }
    }


var url1='http://study.163.com/webDev/couresByCategory.htm';
options={
  pageNo:1,
  psize:20,
  type:10
};
get(url1,options,getCourses);
changeCourses(options,url1);

var url2='http://study.163.com/webDev/hotcouresByCategory.htm';
get(url2,'',getHotCourses);


setVideo('http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4');


}
