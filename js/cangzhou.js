// 1. 粒子背景效果
(function() {
    let canvas = document.createElement("canvas");
    canvas.id = "particle-canvas";
    document.body.prepend(canvas);
    
    // 粒子画布样式
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "-1";
    canvas.style.pointerEvents = "none";

    // 初始化画布尺寸
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let ctx = canvas.getContext("2d");
    let particles = [];
    let pcount = 120;
    let actions = ["right", "up", "left", "down", "around"];
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
            this.vx = 0.3 + Math.random() * 0.6;
            this.size = 1 + this.vx * 1.5;
        }

        update() {
            switch (actions[action]) {
                case "right":
                    this.x += this.vx * 0.8;
                    if (this.x > canvas.width) this.x = 0;
                    break;
                case "left":
                    this.x -= this.vx * 0.8;
                    if (this.x < 0) this.x = canvas.width;
                    break;
                case "up":
                    this.y -= this.vx * 0.8;
                    if (this.y < 0) this.y = canvas.height;
                    break;
                case "down":
                    this.y += this.vx * 0.8;
                    if (this.y > canvas.height) this.y = 0;
                    break;
                case "around":
                    let deg = Math.atan2((this.y - canvas.height / 2), (this.x - canvas.width / 2));
                    let r = Math.sqrt(Math.pow(this.x - canvas.width / 2, 2) + Math.pow(this.y - canvas.height / 2, 2));
                    this.x = r * Math.cos(deg + this.vx / 200) + canvas.width / 2;
                    this.y = r * Math.sin(deg + this.vx / 200) + canvas.height / 2;
                    break;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(230, 184, 0, ${0.3 * this.vx})`;
            ctx.fill();
        }
    }

    // 初始化粒子
    for (let i = 0; i < pcount; i++) {
        particles.push(new Particle());
    }

    // 粒子动画循环
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
})();

// 2. 地图核心逻辑：石家庄地图+赵州标黄
document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.getElementById('map_1');
    const loadingElement = document.getElementById('loading');

    if (!mapContainer) {
        console.error('地图容器未找到');
        if (loadingElement) loadingElement.innerHTML = '<div class="loading-text">地图容器未找到</div>';
        return;
    }

    // 初始化ECharts实例
    let myChart = echarts.init(mapContainer);
    
    // 石家庄地图配置
    const SHIJIAZHUANG_CENTER = [114.54, 38.02]; // 石家庄中心坐标
    const SHIJIAZHUANG_ZOOM = 7.5; // 石家庄地图缩放级别

    // 赵州（赵县）数据
    const ZHAOZHOU_NAME = '赵县'; // 地图中标准名称
    const ZHAOZHOU_COORDS = [114.75, 37.76]; // 赵州中心坐标

    // 加载石家庄地图并高亮赵州
    async function loadMap() {
        try {
            loadingElement.style.display = 'flex';
            
            // 加载石家庄市行政区划数据（含所有区县）
            const response = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/130100_full.json');
            const geoJSON = await response.json();

            // 注册石家庄地图
            echarts.registerMap('石家庄市', geoJSON);

            // 获取所有区县名称
            const districts = geoJSON.features.map(feature => feature.properties.name);

            // 地图配置项
            const option = {
                title: {
                    text: '石家庄市地图 - 赵州位置标注',
                    left: 'center',
                    textStyle: {
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: '#8B4513',
                        fontFamily: 'zhangcao, sans-serif'
                    },
                    subtext: '赵州（赵县）为黄色高亮区域',
                    subtextStyle: {
                        fontSize: 16,
                        color: '#5D4037'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        // 赵州特殊提示
                        if (params.name === ZHAOZHOU_NAME) {
                            return `<strong>${params.name}</strong><br/>赵州故里，文化名城<br/>包含赵州桥等世界文化遗产`;
                        }
                        return `<strong>${params.name}</strong><br/>石家庄市辖区县`;
                    }
                },
                series: [
                    {
                        name: '石家庄区县',
                        type: 'map',
                        map: '石家庄市',
                        roam: true, // 允许缩放和平移
                        zoom: SHIJIAZHUANG_ZOOM,
                        center: SHIJIAZHUANG_CENTER,
                        scaleLimit: { min: 6, max: 10 },
                        label: {
                            show: true,
                            fontSize: 12,
                            color: '#3E2723'
                        },
                        // 区县样式（赵州标黄，其他灰色）
                        itemStyle: {
                            borderColor: '#8B4513',
                            borderWidth: 1,
                            areaColor: '#E0E0E0' // 默认灰色
                        },
                        // 高亮样式（鼠标悬停）
                        emphasis: {
                            itemStyle: {
                                areaColor: '#635a4bff'
                            },
                            label: {
                                fontSize: 14,
                                fontWeight: 'bold'
                            }
                        },
                        // 数据：仅赵州标黄
                        data: districts.map(name => ({
                            name: name,
                            itemStyle: name === ZHAOZHOU_NAME 
                                ? { areaColor: 'rgba(255, 235, 59, 0.8)', borderColor: '#FF8F00', borderWidth: 2 } 
                                : null
                        }))
                    },
                    // 赵州中心点标记（红色涟漪效果）
                    {
                        name: '赵州位置',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        symbol: 'circle',
                        symbolSize: 15,
                        zlevel: 2,
                        rippleEffect: {
                            period: 3,
                            scale: 5,
                            color: '#FF8F00'
                        },
                        itemStyle: {
                            color: '#E65100',
                            shadowBlur: 10,
                            shadowColor: '#FF8F00'
                        },
                        data: [{
                            name: '赵州',
                            value: ZHAOZHOU_COORDS,
                            label: {
                                show: true,
                                formatter: '赵州',
                                position: 'right',
                                color: '#E65100',
                                fontWeight: 'bold'
                            }
                        }]
                    }
                ]
            };

            // 设置地图配置
            myChart.setOption(option);
            
            // 隐藏加载动画
            loadingElement.style.display = 'none';

        } catch (error) {
            console.error('地图加载失败:', error);
            loadingElement.innerHTML = '<div class="loading-text">地图加载失败，请刷新重试</div>';
        }
    }

    // 加载地图
    loadMap();

    // 窗口大小变化时重新调整地图
    window.addEventListener('resize', function() {
        myChart.resize();
    });
});