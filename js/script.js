// 3D旋转图与轮播图联动系统 - 60度轮播触发版
document.addEventListener('DOMContentLoaded', function() {
    // ===== 全局变量 =====
    let currentSlide = 0;
    let carouselActive = false;
    let carouselInterval;
    const ROTATION_THRESHOLD = 60; // 每60度触发一次轮播
    let lastTriggerAngle = 0;      // 记录上一次触发轮播的角度
    
    // ===== 3D旋转配置 =====
    var radius = 240;
    var autoRotate = true;
    var rotateSpeed = -40;
    var imgWidth = 120;
    var imgHeight = 170;
    
    // ===== 获取DOM元素 =====
    const obox = document.getElementById('drag-container');
    const ospin = document.getElementById('spin-container');
    const ground = document.getElementById('ground');
    const slides = document.querySelector('.carousel-slides');
    const slideCount = document.querySelectorAll('.carousel-slide').length;
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const rotationStatus = document.getElementById('rotation-status');
    
    // 检查必需元素是否存在
    if (!obox || !ospin || !ground || !slides || slideCount === 0) {
        console.error("关键元素缺失，无法初始化3D轮播系统");
        return;
    }
    
    // 获取所有3D元素
    var aImg = ospin.getElementsByTagName('img');
    var aVid = ospin.getElementsByTagName('video');
    var aEle = [...aImg, ...aVid];
    
    // ===== 轮播图函数 =====
    function updateCarousel() {
        slides.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }
    
    function startCarousel() {
        if (carouselActive) return;
        
        carouselActive = true;
        if (rotationStatus) rotationStatus.textContent = "轮播中";
        
        carouselInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slideCount;
            updateCarousel();
        }, 6500);
    }
    
    function stopCarousel() {
        clearInterval(carouselInterval);
        carouselActive = false;
        if (rotationStatus) rotationStatus.textContent = "旋转中...";
    }
    
    // ===== 3D旋转初始化 =====
    function init(delayTime) {
        ospin.style.width = imgWidth + "px";
        ospin.style.height = imgHeight + "px";
        ground.style.width = radius * 3 + "px";
        ground.style.height = radius * 3 + "px";
        
        for (var i = 0; i < aEle.length; i++) {
            const angle = i * (360 / aEle.length);
            aEle[i].style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
            aEle[i].style.transition = "transform 1s";
            aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
            
            aEle[i].addEventListener('click', function() {
                const index = Array.from(aEle).indexOf(this);
                currentSlide = index % slideCount;
                updateCarousel();
                resetCarouselInterval();
            });
        }
        
        if (autoRotate) {
            var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
            ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
        }
    }
    
    // ===== 应用3D变换 =====
    function applyTranform(forceApply = false) {
        // 限制垂直旋转角度
        if(tY > 180) tY = 180;
        if(tY < 0) tY = 0;
        
        // 应用旋转
        obox.style.transform = `rotateX(${-tY}deg) rotateY(${tX}deg)`;
        
        // 检测是否达到60度的倍数
        const normalizedTX = (tX % 360 + 360) % 360;
        
        // 计算当前角度与上次触发角度的差值
        const angleDiff = Math.abs(normalizedTX - lastTriggerAngle);
        
        // 如果旋转超过60度，触发轮播切换
        if (angleDiff >= ROTATION_THRESHOLD) {
            // 切换到下一张轮播图
            currentSlide = (currentSlide + 1) % slideCount;
            updateCarousel();
            
            // 更新最后触发角度（保持在同一60度区间内）
            lastTriggerAngle = Math.floor(normalizedTX / ROTATION_THRESHOLD) * ROTATION_THRESHOLD;
            
            // 重置轮播定时器
            resetCarouselInterval();
        }
        
        if (forceApply || autoRotate) {
            ospin.style.animationPlayState = autoRotate ? 'running' : 'paused';
        }
    }
    
    function playSpin(yes) {
        ospin.style.animationPlayState = yes ? 'running' : 'paused';
    }
    
    // ===== 事件处理 =====
    var sX, sY, nX, nY, desX = 0,
        desY = 0,
        tX = 0,
        tY = 10;
    
    // 自定义鼠标/触摸事件处理
    function setupEventListeners() {
        if (mobilecheck()) {
            obox.ontouchstart = function(e) {
                clearInterval(obox.timer);
                e = e || window.event;
                sX = e.touches[0].clientX;
                sY = e.touches[0].clientY;
                
                stopCarousel();
                playSpin(false);
                
                this.ontouchmove = function(e) {
                    e = e || window.event;
                    nX = e.touches[0].clientX;
                    nY = e.touches[0].clientY;
                    desX = nX - sX;
                    desY = nY - sY;
                    tX += desX * 0.1;
                    tY += desY * 0.1;
                    applyTranform();
                    sX = nX;
                    sY = nY;
                }
                
                this.ontouchend = function(e) {
                    this.ontouchmove = this.ontouchend = null;
                    obox.timer = setInterval(function() {
                        desX *= 0.95;
                        desY *= 0.95;
                        tX += desX * 0.1;
                        tY += desY * 0.1;
                        applyTranform();
                        
                        if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
                            clearInterval(obox.timer);
                            if (autoRotate) playSpin(true);
                        }
                    }, 17);
                }
            }
        } else {
            let isDragging = false;
            
            obox.onmousedown = function(e) {
                isDragging = true;
                clearInterval(obox.timer);
                e.preventDefault();
                sX = e.clientX;
                sY = e.clientY;
                
                stopCarousel();
                playSpin(false);
                
                document.onmousemove = function(e) {
                    if (!isDragging) return;
                    nX = e.clientX;
                    nY = e.clientY;
                    desX = nX - sX;
                    desY = nY - sY;
                    tX += desX * 0.15;
                    tY += desY * 0.08;
                    applyTranform();
                    sX = nX;
                    sY = nY;
                }
                
                document.onmouseup = function(e) {
                    isDragging = false;
                    document.onmousemove = null;
                    document.onmouseup = null;
                    
                    obox.timer = setInterval(function() {
                        desX *= 0.92;
                        desY *= 0.92;
                        tX += desX * 0.1;
                        tY += desY * 0.1;
                        applyTranform();
                        
                        if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
                            clearInterval(obox.timer);
                            if (autoRotate) playSpin(true);
                        }
                    }, 13);
                }
            }
            
            obox.onwheel = function(e) {
                e.preventDefault();
                var d = e.deltaY / 20;
                radius = Math.max(150, Math.min(350, radius + d));
                init(1);
            };
            
            document.addEventListener('keydown', handleKeyDown);
        }
    }
    
    // 键盘控制函数
    function handleKeyDown(e) {
      switch(e.key) {
          case 'ArrowLeft':
              tX -= 15;
              applyTranform(true);
              break;
          case 'ArrowRight':
              tX += 15;
              applyTranform(true);
              break;
          case 'ArrowUp':
              tY = Math.max(tY - 5, 0);
              applyTranform(true);
              break;
          case 'ArrowDown':
              tY = Math.min(tY + 5, 180);
              applyTranform(true);
              break;
          case ' ': // 空格键控制轮播
              if (carouselActive) stopCarousel();
              else startCarousel();
              break;
          case '+': // 增加旋转速度
              rotateSpeed = Math.min(-20, rotateSpeed + 10); // 加速
              init();
              break;
          case '-': // 降低旋转速度
              rotateSpeed = Math.max(-100, rotateSpeed - 5); // 减速
              init();
              break;
      }
    }
    
    // ===== 轮播图导航 =====
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slideCount) % slideCount;
            updateCarousel();
            resetCarouselInterval();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slideCount;
            updateCarousel();
            resetCarouselInterval();
        });
    }
    
    if (indicators.length > 0) {
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
                resetCarouselInterval();
            });
        });
    }
    
    function resetCarouselInterval() {
        stopCarousel();
        startCarousel();
    }
    
    // ===== 系统初始化 =====
    function initSystem() {
        init();
        setupEventListeners();
        
        // 设置初始触发角度
        lastTriggerAngle = Math.floor((tX % 360 + 360) % 360 / ROTATION_THRESHOLD) * ROTATION_THRESHOLD;
        
        // 初始启动轮播
        startCarousel();
        
        updateCarousel();
        
        console.log("3D轮播系统初始化完成 - 60度触发模式");
    }
    
    // 移动设备检测函数
    function mobilecheck() {
        var check = false;
        (function(a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(极客|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|极客3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }
    
    // 启动系统
    initSystem();
  });
  