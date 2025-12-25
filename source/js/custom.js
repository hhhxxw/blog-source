// 自定义炫酷脚本

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 添加鼠标跟随粒子效果
  initMouseParticles();
  
  // 添加标题打字机效果
  initTypingEffect();
  
  // 添加滚动视差效果
  initParallaxEffect();
  
  // 添加平滑滚动
  initSmoothScroll();
  
  // 添加页面切换动画
  initPageTransition();
});

// 鼠标跟随粒子效果
function initMouseParticles() {
  let particles = [];
  const maxParticles = 20;
  
  document.addEventListener('mousemove', function(e) {
    if (particles.length < maxParticles) {
      createParticle(e.clientX, e.clientY);
    }
  });
  
  function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'mouse-particle';
    const colors = ['#7B68EE', '#9370DB', '#BA55D3', '#DA70D6'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.cssText = `
      position: fixed;
      width: 5px;
      height: 5px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      left: ${x}px;
      top: ${y}px;
      box-shadow: 0 0 15px ${color}, 0 0 30px ${color};
    `;
    
    document.body.appendChild(particle);
    particles.push(particle);
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 2;
    const life = 20 + Math.random() * 10;
    let vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity;
    let opacity = 1;
    let currentLife = life;
    
    function animate() {
      currentLife--;
      opacity = currentLife / life;
      
      if (currentLife <= 0) {
        particle.remove();
        particles = particles.filter(p => p !== particle);
        return;
      }
      
      x += vx;
      y += vy;
      vy += 0.1; // 重力效果
      
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.opacity = opacity;
      
      requestAnimationFrame(animate);
    }
    
    animate();
  }
}

// 标题打字机效果
function initTypingEffect() {
  const siteTitle = document.querySelector('#site-title');
  if (!siteTitle) return;
  
  const originalText = siteTitle.textContent;
  siteTitle.textContent = '';
  siteTitle.style.borderRight = '2px solid #00b8ff';
  
  let index = 0;
  function typeWriter() {
    if (index < originalText.length) {
      siteTitle.textContent += originalText.charAt(index);
      index++;
      setTimeout(typeWriter, 100);
    } else {
      // 完成打字后闪烁光标
      setInterval(() => {
        siteTitle.style.borderRight = 
          siteTitle.style.borderRight === 'none' ? '2px solid #00b8ff' : 'none';
      }, 530);
    }
  }
  
  // 延迟启动打字效果
  setTimeout(typeWriter, 500);
}

// 滚动视差效果
function initParallaxEffect() {
  const parallaxElements = document.querySelectorAll('.post-header, #page-header');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(element => {
      if (element) {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
      }
    });
  });
}

// 平滑滚动
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// 页面切换动画
function initPageTransition() {
  // 如果是PJAX模式，添加页面切换动画
  if (typeof pjax !== 'undefined') {
    document.addEventListener('pjax:send', function() {
      document.body.style.opacity = '0.8';
      document.body.style.transform = 'scale(0.98)';
    });
    
    document.addEventListener('pjax:complete', function() {
      document.body.style.opacity = '1';
      document.body.style.transform = 'scale(1)';
    });
  }
}

// 添加卡片3D倾斜效果
document.querySelectorAll('.card-widget, .recent-post-item').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
  });
  
  card.addEventListener('mouseleave', function() {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// 添加数字递增动画
function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// 统计数字动画
document.addEventListener('DOMContentLoaded', function() {
  const stats = document.querySelectorAll('.site-uv, .site-pv, .page-pv');
  stats.forEach(stat => {
    const finalValue = parseInt(stat.textContent.replace(/,/g, ''));
    if (!isNaN(finalValue)) {
      animateValue(stat, 0, finalValue, 2000);
    }
  });
});

// 添加文章目录高亮
function initTocHighlight() {
  const tocLinks = document.querySelectorAll('#toc a');
  const sections = document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3');
  
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    tocLinks.forEach(link => {
      link.classList.remove('toc-active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('toc-active');
      }
    });
  });
}

// 初始化目录高亮
if (document.querySelector('#toc')) {
  initTocHighlight();
}

// 添加图片懒加载动画
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.6s ease-out';
      observer.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('img').forEach(img => {
  imageObserver.observe(img);
});

// 添加控制台提示
console.log('%c🚀 欢迎来到我的博客！', 'color: #7B68EE; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #9370DB;');
console.log('%c✨ 这个博客使用了Butterfly主题和自定义特效', 'color: #9370DB; font-size: 14px;');
console.log('%c💜 深色系主题，炫酷特效，极致体验', 'color: #BA55D3; font-size: 12px;');

// 添加星空背景效果
function initStarField() {
  const canvas = document.createElement('canvas');
  canvas.id = 'starfield';
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -2;
    opacity: 0.3;
  `;
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const stars = [];
  const starCount = 100;
  
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random()
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(147, 112, 219, ${star.opacity})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#9370DB';
      ctx.fill();
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// 初始化星空背景
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStarField);
} else {
  initStarField();
}

