// let options = {
//   value:0,
//   a:20,//振幅
//   pos:[300,300],//水球图位置
//   r:160,//水球图半径
//   color:['#2E5199','#1567c8','#1593E7','#42B8F9']//水纹颜色
// };

// createBall(options);
let globaloptions = {}
/**
* 绘制水球图
*/
export function createBall(options) {
  //移动绘图坐标至水球图左边界点
  options.context.translate(options.pos[0],options.pos[1]);
  options.context.font = 'bold 12px Arial';
  options.context.textAlign='center';
  options.context.textBaseLine = 'baseline';
  //计算水球图绘图数据
  createParams(options);
  globaloptions = options;
  startAnim()
  //开启帧动画
  //requestAnimationFrame(startAnim);
}

//生成水波动画参数，位置坐标公式为 y = A * (wt + φ)
function createParams(options) {
  options.w = [];//存储水波的角速度
  options.theta = [];//存储每条水波的位移
  for(let i = 0; i < 4; i++){
    options.w.push(Math.PI /(100 + 20*Math.random()));
    options.theta.push(20*Math.random());
  }
}

//绘制水波线
function drawWaterLines(options) {
 let offset;
 let A = options.a;//正弦曲线振幅
 let y,x,w,theta;
 let r = options.r;
 //遍历每一条水纹理
 for(let line = 0; line < 4; line++){ 
   options.context.save();
   //每次绘制时水波的偏移距离
   theta = Math.random();
   offset = r + A / 2  -  (r*19/8 + A) * (options.value / 100 ) + line * r/12;
   //获取正弦曲线计算参数
   w = options.w[line];
   theta = options.theta[line];
   options.context.fillStyle = options.color[line];
   options.context.moveTo(0,0);
   options.context.beginPath(); 
   //以0.1为步长绘制正弦曲线
   for(x = 0; x <= 2*r; x+=0.1){
      y = A * Math.sin(w * x + theta) + offset;
      //绘制点
      options.context.lineTo(x,y);
   }
    //绘制为超出水球范围的封闭图形
    options.context.lineTo(x,r);
    options.context.lineTo(x - 2 * r,r);
    options.context.lineTo(0, A * Math.sin(theta) - options.height);
    options.context.closePath();
    //填充封闭图形得到一条水波
    options.context.fill();
    //截取水波范围，绘制文字（此处将在后文解释）
    options.context.clip();
    options.context.fillStyle = 'white';
    options.context.fillText(parseInt(options.value,10) + '%',options.r + 10,10);
    options.context.restore();
 }
}

//绘制最底层文字
function drawText1(options) {
  options.context.fillStyle = options.color[0];
  options.context.fillText(parseInt(options.value,10) + '%',options.r + 10,10);
}

//帧动画循环
function startAnim() {
  //用位移变化模拟水波
  globaloptions.theta = globaloptions.theta.map(item=>item-0.03);
  //用百分比进度计算水波的高度
  globaloptions.value += globaloptions.value > 100 ? 0:0.1;
  globaloptions.context.save();
  resetClip(globaloptions);//剪切绘图区
  drawText1(globaloptions);//绘制蓝色文字
  drawWaterLines(globaloptions);//绘制水波线
  globaloptions.context.restore();
  //requestAnimationFrame(startAnim);
}

/**设置水球范围为剪裁区域
*(本例中并没有水球以外的部分需要绘制，实际上这里不需要加入帧动画循环中，只需要在开头设置一次即可。)
*/
function resetClip(options) {
 let r = options.r;
 options.context.strokeStyle = '#2E5199';
 options.context.fillStyle = 'white';
 options.context.lineWidth = 1;
 options.context.beginPath();
 options.context.arc(r, 0, r + 2, 0, 2*Math.PI, false);
 options.context.closePath();
 options.context.fill();
 options.context.stroke();
 options.context.beginPath();
 options.context.arc(r, 0, r, 0, 2*Math.PI, true);
 options.context.clip();
}