document.addEventListener('DOMContentLoaded', function() {
  // 获取所有可点击元素（导航栏、时间轴标签、控制点）
  const navElements = document.querySelectorAll(
    '.carousel-nav, .timeline-labels .label, .control-dots .dot'
  );
  // 获取所有轮播项
  const leftItems = document.querySelectorAll('.swiper-left .swiperItem');
  const rightItems = document.querySelectorAll('.swiper-right .swiperItems');
  
  // 点击任意导航元素切换轮播
  navElements.forEach(element => {
    element.addEventListener('click', function(e) {
      // 如果是导航栏链接，阻止默认跳转行为
      if (this.tagName === 'A') {
        e.preventDefault();
      }
      
      const targetIndex = parseInt(this.getAttribute('data-index'));
      if (isNaN(targetIndex)) return;
      
      // 更新所有导航的激活状态
      updateAllNavActiveState(targetIndex);
      // 更新轮播项显示状态
      updateCarouselItems(targetIndex);
    });
  });
  
  // 更新所有导航的激活状态（包括顶部导航、时间轴、控制点）
  function updateAllNavActiveState(activeIndex) {
    // 更新顶部导航激活状态
    document.querySelectorAll('.carousel-nav').forEach((nav, index) => {
      nav.classList.toggle('active', index === activeIndex);
    });
    
    // 更新时间轴标签激活状态
    document.querySelectorAll('.timeline-labels .label').forEach((label, index) => {
      label.classList.toggle('active', index === activeIndex);
    });
    
    // 更新控制点激活状态
    document.querySelectorAll('.control-dots .dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  }
  
  // 更新轮播项显示状态
  function updateCarouselItems(activeIndex) {
    // 重置所有轮播项
    leftItems.forEach(item => {
      item.className = 'swiperItem def';
    });
    rightItems.forEach(item => {
      item.className = 'swiperItems def';
    });
    
    // 计算相邻索引（循环切换）
    const total = leftItems.length;
    const prevIndex = (activeIndex - 1 + total) % total;
    const nextIndex = (activeIndex + 1) % total;
    
    // 设置当前项样式（居中显示）
    leftItems[activeIndex].className = 'swiperItem b';
    rightItems[activeIndex].className = 'swiperItems b';
    
    // 设置上一项样式（左侧）
    leftItems[prevIndex].className = 'swiperItem a';
    rightItems[prevIndex].className = 'swiperItems a';
    
    // 设置下一项样式（右侧）
    leftItems[nextIndex].className = 'swiperItem c';
    rightItems[nextIndex].className = 'swiperItems c';
  }
  
  // 自动轮播
  let currentIndex = 0;
  setInterval(() => {
    currentIndex = (currentIndex + 1) % leftItems.length;
    updateAllNavActiveState(currentIndex);
    updateCarouselItems(currentIndex);
  }, 5000);
});