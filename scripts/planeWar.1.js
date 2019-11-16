
 /**
 * 工具区
 * 
 *  @function $$ 选择器;
 * 
 */

let $$ = (selector,all) =>{
      if(all){
            return document.querySelectorAll(selector);
      }
      return document.querySelector(selector);
}

let on = (ele,event_type,event_cb) =>{
      ele.addEventListener(event_type,event_cb);
}

let off = (ele,event_type,event_cb) =>{
      ele.removeEventListener(event_type,event_cb);
}

let removeClass = (ele,className) => { 
      let classList = ele.className.split(" ");
      let index = classList.indexOf(className);

      if(index === -1) return false;
      classList.splice(index,1);
      ele.className = classList.join(" ");
      return true;
}

/**
 * 变量选择 
 * @var options 按钮的载体 ul
 * 
 */

let options = $$("#options")



/**
 *  @class Engine => 引擎构造函数;
 *  @class MyWarPlane => 我的战机;
 */

class Engine{
      // 构造函数;
      constructor(){}
      init(options){
            // 获取需要的内容;
            // option_ele 所有按钮的载体;
            this.option_ele = options;
            this.option_children_ele = this.option_ele.children;
            this.bindEvent();
      }
      bindEvent(){
            // 给每个元素绑定事件;
            Array.from(this.option_children_ele)
            .forEach(item => {
                  on(item,"click",()=>{
                        this.startAnimate();
                  })
            })
      }
      startAnimate(){
            // 元素退场;
            this.option_ele.remove();

            // 创建并显示logo
            var logo = document.createElement("div");
            logo.className = "logo center";
            document.body.appendChild(logo);

            // 创建loding并显示loding     
            var loading = document.createElement("div");
            loading.className = "loading center";
            document.body.appendChild(loading);

            // 开启一个动画;
            let count = 0;
            let loading_timer = setInterval(()=>{
                 loading.style.backgroundImage = `url(./images/loading${count % 3 + 1}.png)`
                 count ++;
            },100)

            this.loading = loading;
            this.logo = logo;
            this.loading_timer = loading_timer;

            setTimeout(()=>{  
                  this.clear();
                  this.start();
            },1000)
      }
      clear(){
            this.loading.remove();
            this.logo.remove();
            clearInterval(this.loading_timer);
      }
      start(){
            myWarPlane.init();
            bullet.init();
      }
}     

class MyWarPlane{
      constructor(){};
      init(){
            this.plane = this.createPlane();
            // 在高频使用的函数之中尽量减少dom操作;
            this.planeOffsetWidth = this.plane.offsetWidth;
            this.planeOffsetHeight = this.plane.offsetHeight;
            this.main = $$("#main");
            this.main_offsetLeft = this.main.offsetLeft;
            this.main_width = this.main.offsetWidth;
            this.minLeft = this.main_offsetLeft;
            this.maxLeft = this.main_offsetLeft + this.main_width - this.planeOffsetWidth;
            // 为了方便子弹查看，创建的对外开放的位置属性;
            this.left = this.plane.offsetLeft;
            this.top = this.plane.offsetTop;

            // 为了在删除事件的时候可以访问到bind返回的函数,所以用变量存储函数地址方便删除事件;
            this.offCb = null;

            this.bindEvent();
      }
      bindEvent(){
            on(document,"mousemove",this.offCb =this.planeMove.bind(this));
      }
      createPlane(){
            let plane = document.createElement("div");
            plane.className = "myWarPlan center";
            document.body.appendChild(plane);
            return plane;
      }
      planeMove(evt){
            let e = evt || window.event;
            let { clientX ,clientY }  = e;

            let [nLeft , nTop ] = [ 
                                    clientX - this.planeOffsetWidth / 2,
                                    clientY - this.planeOffsetHeight / 2
                              ]
            // 判定是否存在名为 center 的  className,存在再删除,不存在就省略; 
            if(/center/.test(this.plane.className)){
                  removeClass(this.plane,"center");
            }
            // 边界检测 ;

            nLeft = nLeft > this.maxLeft ? this.maxLeft : nLeft;
            nLeft = nLeft < this.minLeft ? this.minLeft : nLeft;

            this.left = nLeft;
            this.top = nTop;

            this.plane.style.cssText += `;left:${nLeft}px;top:${nTop}px;`
      }
      planeDie(){
            this.plane.className += " me-die";
            off(document,"mousemove",this.offCb);
            setTimeout(()=>{
                  this.plane.remove();
                  this.main.innerHTML = "游戏结束";

                  setTimeout(()=>{
                        location.reload();
                  },3000)
            },3000)
      }
      fire(){
            
      }
}

class Bullet{
      constructor(){

      }
      init(){
        this.bulletTimer = null;
        this.bullet = this.createBullet();
        this.setBulletPosition();
        this.bulletMove();
      }
      createBullet(){
            let bullet = document.createElement("div");
            bullet.className = "bullet";
            document.body.appendChild(bullet);
            return bullet;
      }
      setBulletPosition(){
            let nLeft = myWarPlane.left + myWarPlane.planeOffsetWidth / 2 - this.bullet.offsetWidth / 2 ;
            let nTop = myWarPlane.top - this.bullet.offsetHeight;
            // 根据飞机定位子弹;
            this.bullet.style.left = nLeft  + "px";
            this.bullet.style.top = nTop + "px";
      }
      bulletMove(){
            this.bulletTimer = setInterval(()=>{
                  this.bullet.style.top = this.bullet.offsetTop - 10 + "px";
            },80)
      }
      bulletDie(){

      }
}



/**
 * 实例调用区域;
 * 
 *  */


let engin = new Engine();
engin.init(options);

let myWarPlane = new MyWarPlane();

let bullet = new Bullet();

