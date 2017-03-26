
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
function get() {

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

    //给焦点添加实时监控事件，鼠标移到哪个焦点，就显示那个对应的图片
    for (i = 0; i < orderLis.length; i++) {
        //万物皆对象，遍历出的所有orderLis都是一个个单独的对象，给每个orderLis添加index属性，利用它记忆每个orderLis自己的索引号
        orderLis[i].index = i;
        orderLis[i].onmouseover = function() {
            //让全局变量num等于此时显示的图片的索引号，防止鼠标离开后继续播放不正常的事情发生
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



}
