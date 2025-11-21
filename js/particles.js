document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext("2d");
  
  // 设置画布尺寸
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  // 初始化尺寸
  resizeCanvas();
  
  // 窗口大小改变时重新设置尺寸
  window.addEventListener('resize', resizeCanvas);
  
  const particles = [];
  const pcount = 300;
  const actions = ["right", "up", "left", "down", "around"];
  let action = 0;
  
  // 点击切换粒子运动模式
  document.body.addEventListener("click", function() {
    action = (action + 1) % actions.length;
  });
  
  // 粒子类
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = Math.random();
    }
    
    update() {
      switch (actions[action]) {
        case "right":
          this.x += this.vx * 3;
          if (this.x > canvas.width) {
            this.x = 0;
          }
          break;
        case "left":
          this.x -= this.vx * 3;
          if (this.x < 0) {
            this.x = canvas.width;
          }
          break;
        case "up":
          this.y -= this.vx * 3;
          if (this.y < 0) {
            this.y = canvas.height;
          }
          break;
        case "down":
          this.y += this.vx * 3;
          if (this.y > canvas.height) {
            this.y = 0;
          }
          break;
        case "around":
          const deg = Math.atan2((this.y - canvas.height / 2), (this.x - canvas.width / 2));
          const r = Math.sqrt(Math.pow(this.x - canvas.width / 2, 2) + Math.pow(this.y - canvas.height / 2, 2));
          this.x = r * Math.cos(deg + this.vx / 200) + canvas.width / 2;
          this.y = r * Math.sin(deg + this.vx / 200) + canvas.height / 2;
          break;
      }
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 1 + this.vx, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${this.vx})`;
      ctx.fill();
    }
  }
  
  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 确保粒子数量足够
    while (particles.length < pcount) {
      particles.push(new Particle());
    }
    
    // 更新并绘制所有粒子
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    requestAnimationFrame(animate);
  }
  
  // 开始动画
  animate();
});