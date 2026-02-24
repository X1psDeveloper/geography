// Основной JavaScript файл
document.addEventListener('DOMContentLoaded', function() {
  console.log('ГеоАкадемия 7.0 загружена!');
  
  // Анимация появления элементов
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .topic-card, .news-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1
    });
    
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  };
  
  // Инициализация анимаций
  animateOnScroll();
  
  // Плавная прокрутка для якорных ссылок
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Подсветка активного пункта меню
  const highlightCurrentMenu = () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      
      if (linkPath === currentPath || 
          (currentPath.includes(linkPath) && linkPath !== '/')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };
  
  highlightCurrentMenu();
  
  // Обработка форм с подтверждением
  document.querySelectorAll('form[data-confirm]').forEach(form => {
    form.addEventListener('submit', function(e) {
      const message = this.getAttribute('data-confirm');
      if (message && !confirm(message)) {
        e.preventDefault();
      }
    });
  });
  
  // Показать/скрыть пароль в формах входа
  const togglePasswordButtons = document.querySelectorAll('.toggle-password');
  togglePasswordButtons.forEach(button => {
    button.addEventListener('click', function() {
      const input = this.previousElementSibling;
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);
      this.classList.toggle('fa-eye');
      this.classList.toggle('fa-eye-slash');
    });
  });
  
  // Обработка всплывающих уведомлений
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.5s';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 500);
    }, 5000);
  });
  
  // Инициализация карусели (если есть)
  const initCarousel = () => {
    const carousel = document.querySelector('.carousel');
    if (carousel) {
      let currentIndex = 0;
      const items = carousel.querySelectorAll('.carousel-item');
      const totalItems = items.length;
      
      if (totalItems > 1) {
        setInterval(() => {
          items[currentIndex].classList.remove('active');
          currentIndex = (currentIndex + 1) % totalItems;
          items[currentIndex].classList.add('active');
        }, 5000);
      }
    }
  };
  
  initCarousel();
  
  // Кнопка "Наверх"
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '↑';
  scrollToTopBtn.className = 'scroll-to-top';
  scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--secondary);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
  `;
  
  document.body.appendChild(scrollToTopBtn);
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.style.opacity = '1';
      scrollToTopBtn.style.transform = 'scale(1)';
    } else {
      scrollToTopBtn.style.opacity = '0';
      scrollToTopBtn.style.transform = 'scale(0)';
    }
  });
  
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Динамическая подгрузка контента
  const lazyLoadImages = () => {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          
          if (src) {
            img.src = src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  };
  
  lazyLoadImages();
});