document.addEventListener('DOMContentLoaded', function() {
  const b = document.querySelector(".b");
  const d = document.getElementsByClassName("d");
  const rightTop = document.getElementById("rightTop");
  const weaponTitle = document.getElementById("weaponTitle");
  const weaponDescription = document.getElementById("weaponDescription");
  let time;
  let index = 0;
  
  // 更新后的兵器描述数据（十八般兵器）
  const weaponData = [
      {
          title: "汉代",
          description: "扇鼓雏形出现，起源于乞讨者的谋生工具与演唱行为，乞讨者手执扇鼓即兴编唱词求施舍，为早期原始形态。"
      },
      {
          title: "明代",
          description: "扇鼓已在北京地区出现，逐渐从民间乞讨表演向民间艺术形式过渡，开始在城乡间传播。"
      },
      {
          title: "清代",
          description: "扇鼓进入盛行期，不仅在民间普及，宫廷也将其纳入节庆仪式，农历除夕击打太平鼓（扇鼓一类）祈福太平安定；各地流派逐渐形成，如京西太平鼓、赵州扇鼓等开始扎根地域文化。"
      },
      {
          title: "近现代",
          description: "扇鼓作为民间非物质文化遗产得到保护与传承，2007年赵州扇鼓被列为河北省级非遗，各地通过节庆表演、艺术改编等形式延续其生命力。"
      }
  ];
  
  // 更新右侧内容
  function updateRightContent() {
      const weapon = weaponData[index];
      // 设置右侧图片
      rightTop.style.backgroundImage = `url('images/${index + 1}.png')`;
      weaponTitle.textContent = weapon.title;
      weaponDescription.textContent = weapon.description;
  }
  
  // 重置所有图片样式
  function resetImages() {
      for(let i = 0; i < d.length; i++) {
          d[i].className = "d";
      }
  }
  
  // 设置当前图片为活跃状态
  function setActiveImage() {
      resetImages();
      d[index].className = "d dd";
  }
  
  // 自动轮播函数
  function startSlideShow() {
      time = setInterval(function() {
          setActiveImage();
          // 设置左侧背景图片
          b.style.backgroundImage = `url('images/${index + 1}.jpg')`;
          
          // 更新右侧内容
          updateRightContent();
          
          // 循环索引
          index++;
          if(index >= d.length) {
              index = 0;
          }
      }, 3000); // 适当延长轮播时间
  }
  
  // 为每个缩略图添加鼠标移动事件
  for(let i = 0; i < d.length; i++) {
      d[i].addEventListener('mouseenter', function() {
          // 停止自动轮播
          clearInterval(time);
          // 设置左侧背景图片
          b.style.backgroundImage = `url('images/${i + 1}.jpg')`;
          // 重置图片样式并设置当前为活跃
          resetImages();
          d[i].className = "d dd";
          // 更新索引
          index = i;
          // 更新右侧内容
          updateRightContent();
          // 重新开始自动轮播
          startSlideShow();
      });
  }
  
  // 初始化轮播
  updateRightContent(); // 初始化右侧内容
  startSlideShow();
});
