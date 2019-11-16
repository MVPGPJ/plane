
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

let randomInt = (min , max)=>{
      return min + Math.round(Math.random() * (max - min));
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
 *  @class Bullet => 子弹;
 */

class Engine{
      // 构造函数;
      constructor(){}
      init(options){
            // 获取需要的内容;
            // option_ele 所有按钮的载体;
            this.hard = null;
            this.enemyList = [];
            this.option_ele = options;
            this.option_children_ele = this.option_ele.children;
            this.bindEvent();
      }
      bindEvent(){
            // 给每个元素绑定事件;
            Array.from(this.option_children_ele)
            .forEach((item,index)=> {
                  on(item,"click",()=>{
                        this.hard = index;
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
            myWarPlane
            .init()
            .fire(this.hard);

            // window.enemy1 = new Enemy("smallEnemy");
            // window.enemy2 = new Enemy("middleEnemy");
            // window.enemy3 = new Enemy("bossEnemy");

            // new Enemy("smallEnemy");
            // 创建敌机;
            setInterval(()=>{
                  Math.random() > 0.5 ? new Enemy("smallEnemy") : "";
            },500)

            setInterval(()=>{
                  Math.random() > 0.2 ? new Enemy("middleEnemy") : "";
            },3000)

            setInterval(()=>{
                  Math.random() > 0.5 ? new Enemy("bossEnemy")  : "";
            },10000)
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
            // 子弹发射的定时器;
            this.fireTimer = null;
            // 子弹的数组;
            this.bulletList = [];

            this.bindEvent();

            // 为了连缀来返回一个当前的实例对象;
            return this;
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
      fire(hard){
            let dely = 100;
            switch(hard){
                  case 0 : dely = 500;break;
                  case 1 : dely = 300;break;
                  case 2 : dely = 200;break;
                  case 3 : dely = 80;break;
            }

            this.fireTimer = setInterval(()=>{
                  let bullet = new Bullet().init();
                  this.bulletList.push(bullet);
            },dely)
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
      
        // 为了避免重复的dom操作所以在此直接获取数据以便使用;
        this.bullet_width = this.bullet.offsetWidth;
        this.bullet_height = this.bullet.offsetHeight;

        this.bullet_left = this.bullet.offsetLeft;
        this.bullet_top = this.bullet.offsetTop;

        this.alive = true;
            
        return this;
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
                  if(this.bullet.offsetTop < 10){
                        this.bulletDie();
                        return 0;
                  }
                  this.bullet_top =  this.bullet.offsetTop - 20;
                  this.bullet.style.top = this.bullet_top + "px";
            },50)
      }
      bulletDie(){
            this.bullet.className += " bullet-die";
            clearInterval(this.bulletTimer);
            setTimeout(()=>{
                  this.bullet.remove();
            },500)
            // 删除子弹记录;
            let index = myWarPlane.bulletList.indexOf(this);
            myWarPlane.bulletList.splice(index,1);
            this.alive = false;
      }
}

class Enemy{
      constructor(type) {
            this.strategy = {
                  "smallEnemy" : {
                        className : "enemy-small",
                        hp : 1,
                        speed : 10,
                        cd : 500 ,
                        dely : 1000,
                        dieName : "small-die"
                  } ,
                  "middleEnemy" : {
                        className : "enemy-middle",
                        hp : 5,
                        speed : 5,
                        cd : 3000,
                        dely : 1500,
                        dieName : "middle-die"

                  } ,
                  "bossEnemy" : {
                        className : "enemy-boss",
                        hp : 40,
                        speed : 1,
                        cd : 10000,
                        dely : 3000,
                        dieName : "boss-die"
                  }
            }
            this.init(type);
      }
      init(type){
            // 将策略赋予到本实例上;
            Object.assign(this,this.strategy[type]);
            this.enemy = this.createEnemy();
            this.setEnemyPosition();

            // 方便使用;
            this.enemy_top = this.enemy.offsetTop;
            this.enemy_left = this.enemy.offsetLeft;
            this.enemy_height = this.enemy.offsetHeight;
            this.enemy_width = this.enemy.offsetWidth;

            this.enemyMove();


      }
      createEnemy(){
            let div = document.createElement("div");
            div.className = this.className;
            document.body.appendChild(div);
            return div;
      }
      setEnemyPosition(){
          // 最大值最小值;
          let max = myWarPlane.minLeft + myWarPlane.main_width - this.enemy.offsetWidth;
          let left = randomInt(myWarPlane.minLeft,max);

          this.enemy.style.left = left + "px";
          this.enemy.style.top = 0;
      }
      enemyMove(){
          this.enemyTimer = setInterval(()=>{
            if(this.enemy.offsetTop > 600){
                  clearInterval(this.enemyTimer);
                  this.enemy.remove();
                  return false;
            }

            this.enemy_top = this.enemy.offsetTop + this.speed;

            this.enemy.style.top = this.enemy_top  + "px"

            this.collision();
          },50)
      }
      enemyDie(){
            clearInterval(this.enemyTimer);
            this.enemy.className += " " + this.dieName;
            setTimeout(()=>{
                  this.enemy.remove();
            },this.dely)
      }
      collision(){
            // 碰撞检测;
            let {bulletList} = myWarPlane;
            bulletList.some( bullet => {
                  if(!bullet.alive) return ; 
                  let mint = bullet.bullet_top > this.enemy_top - bullet.bullet_height;
                  let maxt = bullet.bullet_top < this.enemy_top + this.enemy_height;
                  if( mint &&  maxt){
                        // console.log("top碰撞");
                        let minl = bullet.bullet_left > this.enemy_left - bullet.bullet_width;
                        let maxl = bullet.bullet_left < this.enemy_left + this.enemy_width; 
                        if( minl && maxl){
                              // 子弹碰撞了 ;
                              bullet.bulletDie();
                              this.hp --;
                              if(this.hp <= 0){
                                    this.enemyDie();
                              }
                              return true;
                        }
                  }
                  return false;
            })
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

