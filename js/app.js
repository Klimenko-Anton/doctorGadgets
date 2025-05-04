/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./src/js/files/functions.js
let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

// Уникализация массива
function uniqArray(array) {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
}

function addTouchClass() {
  // Добавление класса _touch для HTML, если мобильный браузер
  if (isMobile.any()) document.documentElement.classList.add('touch');
}

function getHash() {
  if (location.hash) { return location.hash.replace('#', ''); }
}

function menuOpen() {
  window.addEventListener("load", function () {
    document.addEventListener("click", function (e) {
      const targetElement = e.target;
      if (!targetElement.closest(".icon-menu")) return;
      if (targetElement.closest(".icon-menu")) {
        document.documentElement.classList.toggle("menu-open");
        document.documentElement.classList.toggle("lock");
        // targetElement.setAttribute("aria-label", "Открыть основное меню");
        // if (document.documentElement.classList.contains("menu-open")) {
        //   targetElement.setAttribute("aria-label", "Закрыть основное меню");
        // }
      }
    });
  });
}
// Показ шапки при скролле
function headerScroll() {
  // window.addEventListener("DOMContentLoaded", function () {
  //   const header = document.querySelector(".header");
  //   const headerHeight = header.offsetHeight;
  //   let distanse = 0;
  //   window.addEventListener("scroll", function () {
  //     const windowScroll = window.scrollY;
  //     if (windowScroll > headerHeight) {
  //       if (windowScroll > distanse) {
  //         header.classList.add("_header-hide");
  //         header.classList.remove("_header-show");
  //       } else {
  //         header.classList.remove("_header-hide");
  //         header.classList.add("_header-show");
  //       }
  //     } else {
  //       header.classList.remove("_header-hide");
  //       header.classList.remove("_header-show");
  //     }
  //     distanse = windowScroll;
  //   });
  // });
  const headerElement = document.querySelector(".header");

  const callback = function (entries, callback) {
    if (entries[0].isIntersecting) {
      headerElement.classList.remove("_header-scroll");
    } else {
      headerElement.classList.add("_header-scroll");
    }
  }
  const observerHeader = new IntersectionObserver(callback);
  observerHeader.observe(headerElement);
};

// Watcher 
function elementWatches() {
  const watchElements = document.querySelectorAll("[data-watch]");
  const observerSections = function (entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("_watching");
        observer.unobserve(entry.target);
      }
    });
  };
  watchElements.forEach(section => {
    let thresholdValue;
    if (section.dataset.watchThreshold) {
      thresholdValue = section.dataset.watchThreshold ? section.dataset.watchThreshold : 0;
    }
    if (section.dataset.watchParallax) {
      let parallaxValue = section.dataset.watchParallax ? section.dataset.watchParallax : 500;
      console.log(parallaxValue);
    }
    const observer = new IntersectionObserver(observerSections, {
      threshold: thresholdValue,
    });
    observer.observe(section);
  });
}
// Скролл к нужному блоку
function gotoScroll() {
  const gotoLinks = document.querySelectorAll("[data-goto]");
  if (gotoLinks.length) {
    gotoLinks.forEach(gotoLink => {
      gotoLink.addEventListener("click", onMenuLinkClick);
    });

    function onMenuLinkClick(e) {
      e.preventDefault();
      const gotoTargetLink = e.target;
      const gotoCurrentLink = gotoTargetLink.closest("[data-goto]").dataset.goto;
      if (gotoTargetLink.dataset.goto && document.querySelector(gotoTargetLink.dataset.goto)) {
        const gotoBlock = document.querySelector(gotoCurrentLink);
        const gotoLinkHeader = gotoTargetLink.hasAttribute("data-goto-header");
        const gotoLinkHeaderHeight = document.querySelector("header").offsetHeight;
        const gotoLinkOffsetTop = gotoTargetLink.hasAttribute("data-goto-top");
        const gotoLinkOffsetTopValue = gotoTargetLink.dataset.gotoTop ? gotoTargetLink.dataset.gotoTop : 0;
        let gotoTargetBlockPosition = gotoBlock.offsetTop;
        gotoTargetBlockPosition = gotoLinkHeader ? gotoTargetBlockPosition - gotoLinkHeaderHeight : gotoTargetBlockPosition;
        gotoTargetBlockPosition = gotoLinkOffsetTop ? gotoTargetBlockPosition - gotoLinkOffsetTopValue : gotoTargetBlockPosition;
        window.scrollTo({
          top: gotoTargetBlockPosition,
          behavior: "smooth",
        });
      }

      if (document.documentElement.classList.contains("menu-open")) {
        document.documentElement.classList.remove("menu-open", "lock")
      }

    };
  }
}

// Переключение темы сайта
//========================================================================================================================================================
function themeToggle() {
  const html = document.documentElement, mode = localStorage.getItem('mode') || 'auto';
  const getPreferredMode = () => matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  const switchMode = mode => {
    const newMode = mode === 'auto' ? getPreferredMode() : mode
    html.classList.remove('light', 'dark')
    html.classList.add(`${newMode}`)
    localStorage.setItem('mode', mode)
    document.querySelectorAll('[data-mode]').forEach(el => el.classList.toggle('_active-theme-btn', el.dataset.mode === mode))
  }

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('mode') === 'auto') switchMode('auto')
  })

  document.addEventListener('click', e => e.target.dataset.mode && switchMode(e.target.dataset.mode))
  switchMode(mode)
}
//========================================================================================================================================================

/*Модуль звездного рейтинга */
function formRating() {
  const ratings = document.querySelectorAll('.rating');
  if (ratings.length > 0) {
    initRatings();
  }
  // Основная функция
  function initRatings() {
    let ratingActive, ratingValue;
    // "Бегаем" по всем рейтингам на странице
    for (let index = 0; index < ratings.length; index++) {
      const rating = ratings[index];
      initRating(rating);
    }
    // Инициализируем конкретный рейтинг
    function initRating(rating) {
      initRatingVars(rating);

      setRatingActiveWidth();

      if (rating.classList.contains('rating_set')) {
        setRating(rating);
      }
    }
    // Инициализация переменных
    function initRatingVars(rating) {
      ratingActive = rating.querySelector('.rating__active');
      ratingValue = rating.querySelector('.rating__value');
    }
    // Изменяем ширину активных звезд
    function setRatingActiveWidth(index = ratingValue.innerHTML) {
      const ratingActiveWidth = index / 0.05;
      ratingActive.style.width = `${ratingActiveWidth}%`;
    }
    // Возможность указать оценку
    function setRating(rating) {
      const ratingItems = rating.querySelectorAll('.rating__item');
      for (let index = 0; index < ratingItems.length; index++) {
        const ratingItem = ratingItems[index];
        ratingItem.addEventListener("mouseenter", function (e) {
          // Обновление переменных
          initRatingVars(rating);
          // Обновление активных звезд
          setRatingActiveWidth(ratingItem.value);
        });
        ratingItem.addEventListener("mouseleave", function (e) {
          // Обновление активных звезд
          setRatingActiveWidth();
        });
        ratingItem.addEventListener("click", function (e) {
          // Обновление переменных
          initRatingVars(rating);

          if (rating.dataset.ajax) {
            // "Отправить" на сервер
            setRatingValue(ratingItem.value, rating);
          } else {
            // Отобразить указанную оценку
            ratingValue.innerHTML = index + 1;
            setRatingActiveWidth();
          }
        });
      }
    }
    async function setRatingValue(value, rating) {
      if (!rating.classList.contains('rating_sending')) {
        rating.classList.add('rating_sending');

        // // Отправка данных (value) на сервер
        // let response = await fetch('/files/product.json', {
        //   method: 'GET',

        //   body: JSON.stringify({
        //     userRating: value
        //   }),
        //   headers: {
        //     'content-type': 'application/json'
        //   }

        // });
        if (response.ok) {
          const result = await response.json();

          // Получаем новый рейтинг
          const newRating = result.newRating;

          // Вывод нового среднего результата
          ratingValue.innerHTML = newRating;

          // Обновление активных звезд
          setRatingActiveWidth();

          rating.classList.remove('rating_sending');
        } else {
          alert("Ошибка");

          rating.classList.remove('rating_sending');
        }
      }
    }
  }
}
//========================================================================================================================================================
function loopScroller() {
  const scroller = document.querySelectorAll(".scroller");
  if (scroller) {
    scroller.forEach(scrollerBlock => {
      scrollerBlock.setAttribute("data-scroll-animation", "true");
      const count = 4;  // Количество копий всех элементов
      const scrollerInner = scrollerBlock.querySelector(".scroller__inner");
      const scrollerContent = Array.from(scrollerInner.children);

      // Сначала добавляем оригинальные элементы (если они не добавлены)
      scrollerContent.forEach(contentScroller => {
        scrollerInner.append(contentScroller);
      });

      // Клонируем все элементы count раз
      for (let i = 0; i < count; i++) {
        scrollerContent.forEach(contentScroller => {
          const scrollerInnerClone = contentScroller.cloneNode(true);
          scrollerInnerClone.setAttribute("aria-hidden", "true");
          scrollerInner.append(scrollerInnerClone);
        });
      }
    });
  }
}
//========================================================================================================================================================
let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains('_slide')) {
    target.classList.add('_slide');
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty('height') : null;
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      !showmore ? target.style.removeProperty('overflow') : null;
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('_slide');
      // Создаем событие
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target: target
        }
      }));
    }, duration);
  }
}
let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains('_slide')) {
    target.classList.add('_slide');
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty('height') : null;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('_slide');
      // Создаем событие
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target: target
        }
      }));
    }, duration);
  }
}
let _slideToggle = (target, duration = 500) => {
  if (target.hidden) {
    return _slideDown(target, duration);
  } else {
    return _slideUp(target, duration);
  }
}
//========================================================================================================================================================
let bodyLockStatus = true;
let bodyLockToggle = (delay = 500) => {
  if (document.documentElement.classList.contains('lock')) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
}
let bodyUnlock = (delay = 500) => {
  let body = document.querySelector("body");
  if (bodyLockStatus) {
    let lock_padding = document.querySelectorAll("[data-lp]");
    setTimeout(() => {
      for (let index = 0; index < lock_padding.length; index++) {
        const el = lock_padding[index];
        el.style.paddingRight = '0px';
      }
      body.style.paddingRight = '0px';
      document.documentElement.classList.remove("lock");
    }, delay);
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
}
let bodyLock = (delay = 500) => {
  let body = document.querySelector("body");
  if (bodyLockStatus) {
    let lock_padding = document.querySelectorAll("[data-lp]");
    for (let index = 0; index < lock_padding.length; index++) {
      const el = lock_padding[index];
      el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
    }
    body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
    document.documentElement.classList.add("lock");

    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
}
//========================================================================================================================================================

// Спойлеры
function spollers() {
  const spollersArray = document.querySelectorAll('[data-spollers]');
  if (spollersArray.length > 0) {
    // Событие клика
    document.addEventListener("click", setSpollerAction);
    // Получение обычных слойлеров
    const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
      return !item.dataset.spollers.split(",")[0];
    });
    // Инициализация обычных слойлеров
    if (spollersRegular.length) {
      initSpollers(spollersRegular);
    }
    // Получение слойлеров с медиа-запросами
    let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach(mdQueriesItem => {
        // Событие
        mdQueriesItem.matchMedia.addEventListener("change", function () {
          initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
    // Инициализация
    function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach(spollersBlock => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add('_spoller-init');
          initSpollerBody(spollersBlock);
        } else {
          spollersBlock.classList.remove('_spoller-init');
          initSpollerBody(spollersBlock, false);
        }
      });
    }
    // Работа с контентом
    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      let spollerItems = spollersBlock.querySelectorAll('details');
      if (spollerItems.length) {
        //spollerItems = Array.from(spollerItems).filter(item => item.closest('[data-spollers]') === spollersBlock);
        spollerItems.forEach(spollerItem => {
          let spollerTitle = spollerItem.querySelector('summary');
          if (hideSpollerBody) {
            spollerTitle.removeAttribute('tabindex');
            if (!spollerItem.hasAttribute('data-open')) {
              spollerItem.open = false;
              spollerTitle.nextElementSibling.hidden = true;
            } else {
              spollerTitle.classList.add('_spoller-active');
              spollerItem.open = true;
            }
          } else {
            spollerTitle.setAttribute('tabindex', '-1');
            spollerTitle.classList.remove('_spoller-active');
            spollerItem.open = true;
            spollerTitle.nextElementSibling.hidden = false;
          }
        });
      }
    }
    function setSpollerAction(e) {
      const el = e.target;
      if (el.closest('summary') && el.closest('[data-spollers]')) {
        e.preventDefault();
        if (el.closest('[data-spollers]').classList.contains('_spoller-init')) {
          const spollerTitle = el.closest('summary');
          const spollerBlock = spollerTitle.closest('details');
          const spollersBlock = spollerTitle.closest('[data-spollers]');
          const oneSpoller = spollersBlock.hasAttribute('data-one-spoller');
          const scrollSpoller = spollerBlock.hasAttribute('data-spoller-scroll');
          const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
          if (!spollersBlock.querySelectorAll('._slide').length) {
            if (oneSpoller && !spollerBlock.open) {
              hideSpollersBody(spollersBlock);
            }

            !spollerBlock.open ? spollerBlock.open = true : setTimeout(() => { spollerBlock.open = false }, spollerSpeed);

            spollerTitle.classList.toggle('_spoller-active');
            _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);

            if (scrollSpoller && spollerTitle.classList.contains('_spoller-active')) {
              const scrollSpollerValue = spollerBlock.dataset.spollerScroll;
              const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
              const scrollSpollerNoHeader = spollerBlock.hasAttribute('data-spoller-scroll-noheader') ? document.querySelector('.header').offsetHeight : 0;

              //setTimeout(() => {
              window.scrollTo(
                {
                  top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
                  behavior: "smooth",
                }
              );
              //}, spollerSpeed);
            }
          }
        }
      }
      // Закрытие при клике вне спойлера
      if (!el.closest('[data-spollers]')) {
        const spollersClose = document.querySelectorAll('[data-spoller-close]');
        if (spollersClose.length) {
          spollersClose.forEach(spollerClose => {
            const spollersBlock = spollerClose.closest('[data-spollers]');
            const spollerCloseBlock = spollerClose.parentNode;
            if (spollersBlock.classList.contains('_spoller-init')) {
              const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
              spollerClose.classList.remove('_spoller-active');
              _slideUp(spollerClose.nextElementSibling, spollerSpeed);
              setTimeout(() => { spollerCloseBlock.open = false }, spollerSpeed);
            }
          });
        }
      }
    }
    function hideSpollersBody(spollersBlock) {
      const spollerActiveBlock = spollersBlock.querySelector('details[open]');
      if (spollerActiveBlock && !spollersBlock.querySelectorAll('._slide').length) {
        const spollerActiveTitle = spollerActiveBlock.querySelector('summary');
        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
        spollerActiveTitle.classList.remove('_spoller-active');
        _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
        setTimeout(() => { spollerActiveBlock.open = false }, spollerSpeed);
      }
    }
  }
}
//========================================================================================================================================================

// ТАБЫ
function tabs() {
  const tabs = document.querySelectorAll('[data-tabs]');
  let tabsActiveHash = [];

  if (tabs.length > 0) {
    const hash = getHash();
    if (hash && hash.startsWith('tab-')) {
      tabsActiveHash = hash.replace('tab-', '').split('-');
    }
    tabs.forEach((tabsBlock, index) => {
      tabsBlock.classList.add('_tab-init');
      tabsBlock.setAttribute('data-tabs-index', index);
      tabsBlock.addEventListener("click", setTabsAction);
      initTabs(tabsBlock);
    });

    // Получение слойлеров с медиа-запросами
    let mdQueriesArray = dataMediaQueries(tabs, "tabs");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach(mdQueriesItem => {
        // Подія
        mdQueriesItem.matchMedia.addEventListener("change", function () {
          setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
  }
  // Установка позиций заголовков
  function setTitlePosition(tabsMediaArray, matchMedia) {
    tabsMediaArray.forEach(tabsMediaItem => {
      tabsMediaItem = tabsMediaItem.item;
      let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]');
      let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
      let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
      let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');
      tabsTitleItems = Array.from(tabsTitleItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
      tabsContentItems = Array.from(tabsContentItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
      tabsContentItems.forEach((tabsContentItem, index) => {
        if (matchMedia.matches) {
          tabsContent.append(tabsTitleItems[index]);
          tabsContent.append(tabsContentItem);
          tabsMediaItem.classList.add('_tab-spoller');
        } else {
          tabsTitles.append(tabsTitleItems[index]);
          tabsMediaItem.classList.remove('_tab-spoller');
        }
      });
    });
  }
  // Работа с контентом
  function initTabs(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*');
    let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
    const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

    if (tabsActiveHashBlock) {
      const tabsActiveTitle = tabsBlock.querySelector('[data-tabs-titles]>._tab-active');
      tabsActiveTitle ? tabsActiveTitle.classList.remove('_tab-active') : null;
    }
    if (tabsContent.length) {
      //tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
      //tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsContent.forEach((tabsContentItem, index) => {
        tabsTitles[index].setAttribute('data-tabs-title', '');
        tabsContentItem.setAttribute('data-tabs-item', '');

        if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
          tabsTitles[index].classList.add('_tab-active');
        }
        tabsContentItem.hidden = !tabsTitles[index].classList.contains('_tab-active');
      });
    }
  }
  function setTabsStatus(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
    let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
    function isTabsAnamate(tabsBlock) {
      if (tabsBlock.hasAttribute('data-tabs-animate')) {
        return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
      }
    }
    const tabsBlockAnimate = isTabsAnamate(tabsBlock);
    if (tabsContent.length > 0) {
      const isHash = tabsBlock.hasAttribute('data-tabs-hash');
      tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsContent.forEach((tabsContentItem, index) => {
        if (tabsTitles[index].classList.contains('_tab-active')) {
          if (tabsBlockAnimate) {
            _slideDown(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = false;
          }
          if (isHash && !tabsContentItem.closest('.popup')) {
            setHash(`tab-${tabsBlockIndex}-${index}`);
          }
        } else {
          if (tabsBlockAnimate) {
            _slideUp(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = true;
          }
        }
      });
    }
  }
  function setTabsAction(e) {
    const el = e.target;
    if (el.closest('[data-tabs-title]')) {
      const tabTitle = el.closest('[data-tabs-title]');
      const tabsBlock = tabTitle.closest('[data-tabs]');
      if (!tabTitle.classList.contains('_tab-active') && !tabsBlock.querySelector('._slide')) {
        let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active');
        tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter(item => item.closest('[data-tabs]') === tabsBlock) : null;
        tabActiveTitle.length ? tabActiveTitle[0].classList.remove('_tab-active') : null;
        tabTitle.classList.add('_tab-active');
        setTabsStatus(tabsBlock);
      }
      e.preventDefault();
    }
  }
}
//========================================================================================================================================================

// Показать еще 
function showMore() {
  window.addEventListener("load", function (e) {
    const showMoreBlocks = document.querySelectorAll('[data-showmore]');
    let showMoreBlocksRegular;
    let mdQueriesArray;
    if (showMoreBlocks.length) {
      // Получение обычных объектов
      showMoreBlocksRegular = Array.from(showMoreBlocks).filter(function (item, index, self) {
        return !item.dataset.showmoreMedia;
      });
      // Инициализация обычных объектов
      showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;

      document.addEventListener("click", showMoreActions);
      window.addEventListener("resize", showMoreActions);

      // Получение объектов с медиа-запросами
      mdQueriesArray = dataMediaQueries(showMoreBlocks, "showmoreMedia");
      if (mdQueriesArray && mdQueriesArray.length) {
        mdQueriesArray.forEach(mdQueriesItem => {
          // Событие
          mdQueriesItem.matchMedia.addEventListener("change", function () {
            initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
          });
        });
        initItemsMedia(mdQueriesArray);
      }
    }
    function initItemsMedia(mdQueriesArray) {
      mdQueriesArray.forEach(mdQueriesItem => {
        initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
    function initItems(showMoreBlocks, matchMedia) {
      showMoreBlocks.forEach(showMoreBlock => {
        initItem(showMoreBlock, matchMedia);
      });
    }
    function initItem(showMoreBlock, matchMedia = false) {
      showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
      let showMoreContent = showMoreBlock.querySelectorAll('[data-showmore-content]');
      let showMoreButton = showMoreBlock.querySelectorAll('[data-showmore-button]');
      showMoreContent = Array.from(showMoreContent).filter(item => item.closest('[data-showmore]') === showMoreBlock)[0];
      showMoreButton = Array.from(showMoreButton).filter(item => item.closest('[data-showmore]') === showMoreBlock)[0];
      const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
      if (matchMedia.matches || !matchMedia) {
        if (hiddenHeight < getOriginalHeight(showMoreContent)) {
          _slideUp(showMoreContent, 0, showMoreBlock.classList.contains('_showmore-active') ? getOriginalHeight(showMoreContent) : hiddenHeight);
          showMoreButton.hidden = false;
        } else {
          _slideDown(showMoreContent, 0, hiddenHeight);
          showMoreButton.hidden = true;
        }
      } else {
        _slideDown(showMoreContent, 0, hiddenHeight);
        showMoreButton.hidden = true;
      }
    }
    function getHeight(showMoreBlock, showMoreContent) {
      let hiddenHeight = 0;
      const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore : 'size';
      const rowGap = parseFloat(getComputedStyle(showMoreContent).rowGap) ? parseFloat(getComputedStyle(showMoreContent).rowGap) : 0;
      if (showMoreType === 'items') {
        const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 3;
        const showMoreItems = showMoreContent.children;
        for (let index = 1; index < showMoreItems.length; index++) {
          const showMoreItem = showMoreItems[index - 1];
          const marginTop = parseFloat(getComputedStyle(showMoreItem).marginTop) ? parseFloat(getComputedStyle(showMoreItem).marginTop) : 0;
          const marginBottom = parseFloat(getComputedStyle(showMoreItem).marginBottom) ? parseFloat(getComputedStyle(showMoreItem).marginBottom) : 0;
          hiddenHeight += showMoreItem.offsetHeight + marginTop;
          if (index == showMoreTypeValue) break;
          hiddenHeight += marginBottom;
        }
        rowGap ? hiddenHeight += (showMoreTypeValue - 1) * rowGap : null;
      } else {
        const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 150;
        hiddenHeight = showMoreTypeValue;
      }
      return hiddenHeight;
    }

    function getOriginalHeight(showMoreContent) {
      let parentHidden;
      let hiddenHeight = showMoreContent.offsetHeight;
      showMoreContent.style.removeProperty('height');
      if (showMoreContent.closest(`[hidden]`)) {
        parentHidden = showMoreContent.closest(`[hidden]`);
        parentHidden.hidden = false;
      }
      let originalHeight = showMoreContent.offsetHeight;
      parentHidden ? parentHidden.hidden = true : null;
      showMoreContent.style.height = `${hiddenHeight}px`;
      return originalHeight;
    }
    function showMoreActions(e) {
      const targetEvent = e.target;
      const targetType = e.type;
      if (targetType === 'click') {
        if (targetEvent.closest('[data-showmore-button]')) {
          const showMoreButton = targetEvent.closest('[data-showmore-button]');
          const showMoreBlock = showMoreButton.closest('[data-showmore]');
          const showMoreContent = showMoreBlock.querySelector('[data-showmore-content]');
          const showMoreSpeed = showMoreBlock.dataset.showmoreButton ? showMoreBlock.dataset.showmoreButton : '500';
          const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
          if (!showMoreContent.classList.contains('_slide')) {
            showMoreBlock.classList.contains('_showmore-active') ? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight) : _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
            showMoreBlock.classList.toggle('_showmore-active');
          }
        }
      } else if (targetType === 'resize') {
        showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
        mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
      }
    }
  });
}
//========================================================================================================================================================

function dataMediaQueries(array, dataSetValue) {
  // Получение объектов с медиа-запросами
  const media = Array.from(array).filter(function (item, index, self) {
    if (item.dataset[dataSetValue]) {
      return item.dataset[dataSetValue].split(",")[0];
    }
  });
  // Инициализация объектов с медиа-запросами
  if (media.length) {
    const breakpointsArray = [];
    media.forEach(item => {
      const params = item.dataset[dataSetValue];
      const breakpoint = {};
      const paramsArray = params.split(",");
      breakpoint.value = paramsArray[0];
      breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
      breakpoint.item = item;
      breakpointsArray.push(breakpoint);
    });
    // Получаем уникальные брейкпоинты
    let mdQueries = breakpointsArray.map(function (item) {
      return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
    });
    mdQueries = uniqArray(mdQueries);
    const mdQueriesArray = [];

    if (mdQueries.length) {
      // Работаем с каждым брейкпоинтом
      mdQueries.forEach(breakpoint => {
        const paramsArray = breakpoint.split(",");
        const mediaBreakpoint = paramsArray[1];
        const mediaType = paramsArray[2];
        const matchMedia = window.matchMedia(paramsArray[0]);
        // Объекты с необходимыми условиями
        const itemsArray = breakpointsArray.filter(function (item) {
          if (item.value === mediaBreakpoint && item.type === mediaType) {
            return true;
          }
        });
        mdQueriesArray.push({
          itemsArray,
          matchMedia
        })
      });
      return mdQueriesArray;
    }
  }
}
;// CONCATENATED MODULE: ./src/js/files/modules.js
const flsModules = {};
;// CONCATENATED MODULE: ./src/js/libs/popup.js



// Клаcс Popup
class Popup {
  constructor(options) {
    let config = {
      logging: true,
      init: true,
      //Для кнопок
      attributeOpenButton: 'data-popup', // Атрибут для кнопки, вызывающей попап
      attributeCloseButton: 'data-close', // Атрибут для кнопки, закрывающей попап
      // Для посторонних объектов
      fixElementSelector: '[data-lp]', // Атрибут для элементов с левым паддингом (fixed)
      // Для объекта попапа
      youtubeAttribute: 'data-popup-youtube', // Атрибут для коду youtube
      youtubePlaceAttribute: 'data-popup-youtube-place', // Атрибут для вставки ролика youtube
      setAutoplayYoutube: true,
      // Смена классов
      classes: {
        popup: 'popup',
        // popupWrapper: 'popup__wrapper',
        popupContent: 'popup__content',
        popupActive: 'popup_show', // Добавляется для попапа, когда он открывается
        bodyActive: 'popup-show', // Добавляется для боди, когда попап открыт
      },
      focusCatch: true, // Фокус внутри попапа зациклен
      closeEsc: true, // Закрытие ESC
      bodyLock: true, // Блокировка скролла
      hashSettings: {
        location: true, // Хэш в адресной строке
        goHash: true, // Переход по наличию в адресной строке
      },
      on: { // События
        beforeOpen: function () { },
        afterOpen: function () { },
        beforeClose: function () { },
        afterClose: function () { },
      },
    }
    this.youTubeCode;
    this.isOpen = false;
    // Текущее окно
    this.targetOpen = {
      selector: false,
      element: false,
    }
    // Предыдущее открытое
    this.previousOpen = {
      selector: false,
      element: false,
    }
    // Последнее закрыто
    this.lastClosed = {
      selector: false,
      element: false,
    }
    this._dataValue = false;
    this.hash = false;

    this._reopen = false;
    this._selectorOpen = false;

    this.lastFocusEl = false;
    this._focusEl = [
      'a[href]',
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
      'button:not([disabled]):not([aria-hidden])',
      'select:not([disabled]):not([aria-hidden])',
      'textarea:not([disabled]):not([aria-hidden])',
      'area[href]',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex^="-"])'
    ];
    //this.options = Object.assign(config, options);
    this.options = {
      ...config,
      ...options,
      classes: {
        ...config.classes,
        ...options?.classes,
      },
      hashSettings: {
        ...config.hashSettings,
        ...options?.hashSettings,
      },
      on: {
        ...config.on,
        ...options?.on,
      }
    }
    this.bodyLock = false;
    this.options.init ? this.initPopups() : null
  }
  initPopups() {
    this.eventsPopup();
  }
  eventsPopup() {
    // Клик по всему документу
    document.addEventListener("click", function (e) {
      // Клик по кнопке "открыть"
      const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
      if (buttonOpen) {
        e.preventDefault();
        this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ?
          buttonOpen.getAttribute(this.options.attributeOpenButton) :
          'error';
        this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ?
          buttonOpen.getAttribute(this.options.youtubeAttribute) :
          null;
        if (this._dataValue !== 'error') {
          if (!this.isOpen) this.lastFocusEl = buttonOpen;
          this.targetOpen.selector = `${this._dataValue}`;
          this._selectorOpen = true;
          this.open();
          return;

        }

        return;
      }
      // Закрытие на пустом месте (popup__wrapper) и кнопки закрытия (popup__close) для закрытия
      const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
      if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
    }.bind(this));
    // Закрытие ESC
    document.addEventListener("keydown", function (e) {
      if (this.options.closeEsc && e.which == 27 && e.code === 'Escape' && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
      if (this.options.focusCatch && e.which == 9 && this.isOpen) {
        this._focusCatch(e);
        return;
      }
    }.bind(this))

    // Открытие по хэшу
    if (this.options.hashSettings.goHash) {
      // Проверка смены адресной строки
      window.addEventListener('hashchange', function () {
        if (window.location.hash) {
          this._openToHash();
        } else {
          this.close(this.targetOpen.selector);
        }
      }.bind(this))

      window.addEventListener('load', function () {
        if (window.location.hash) {
          this._openToHash();
        }
      }.bind(this))
    }
  }
  open(selectorValue) {
    if (bodyLockStatus) {
      // Если перед открытием попапа был режим lock
      this.bodyLock = document.documentElement.classList.contains('lock') && !this.isOpen ? true : false;

      // Если ввести значение селектора (селектор настраивается в options)
      if (selectorValue && typeof (selectorValue) === "string" && selectorValue.trim() !== "") {
        this.targetOpen.selector = selectorValue;
        this._selectorOpen = true;
      }
      if (this.isOpen) {
        this._reopen = true;
        this.close();
      }
      if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
      if (!this._reopen) this.previousActiveElement = document.activeElement;

      this.targetOpen.element = document.querySelector(this.targetOpen.selector);

      if (this.targetOpen.element) {
        // YouTube
        if (this.youTubeCode) {
          const codeVideo = this.youTubeCode;
          const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`
          const iframe = document.createElement('iframe');
          iframe.setAttribute('allowfullscreen', '');

          const autoplay = this.options.setAutoplayYoutube ? 'autoplay;' : '';
          iframe.setAttribute('allow', `${autoplay}; encrypted-media`);

          iframe.setAttribute('src', urlVideo);

          if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
            const youtubePlace = this.targetOpen.element.querySelector('.popup__text').setAttribute(`${this.options.youtubePlaceAttribute}`, '');
          }
          this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
        }
        if (this.options.hashSettings.location) {
          // Получение хеша и его выставление
          this._getHash();
          this._setHash();
        }

        // К открытию
        this.options.on.beforeOpen(this);
        // Создаем свое событие после открытия попапа
        document.dispatchEvent(new CustomEvent("beforePopupOpen", {
          detail: {
            popup: this
          }
        }));

        this.targetOpen.element.classList.add(this.options.classes.popupActive);
        document.documentElement.classList.add(this.options.classes.bodyActive);

        if (!this._reopen) {
          !this.bodyLock ? bodyLock() : null;
        }
        else this._reopen = false;

        this.targetOpen.element.setAttribute('aria-hidden', 'false');

        // Запомню это открытое окно. Оно будет последним открытым
        this.previousOpen.selector = this.targetOpen.selector;
        this.previousOpen.element = this.targetOpen.element;

        this._selectorOpen = false;

        this.isOpen = true;

        setTimeout(() => {
          this._focusTrap();
        }, 50);

        // После открытия
        this.options.on.afterOpen(this);
        // Создаем свое событие после открытия попапа
        document.dispatchEvent(new CustomEvent("afterPopupOpen", {
          detail: {
            popup: this
          }
        }));
      };
    }
  }
  close(selectorValue) {
    if (selectorValue && typeof (selectorValue) === "string" && selectorValue.trim() !== "") {
      this.previousOpen.selector = selectorValue;
    }
    if (!this.isOpen || !bodyLockStatus) {
      return;
    }
    // К закрытию
    this.options.on.beforeClose(this);
    // Создаем свое событие перед закрытием попапа
    document.dispatchEvent(new CustomEvent("beforePopupClose", {
      detail: {
        popup: this
      }
    }));

    // YouTube
    if (this.youTubeCode) {
      if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`))
        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = '';
    }
    this.previousOpen.element.classList.remove(this.options.classes.popupActive);
    // aria-hidden
    this.previousOpen.element.setAttribute('aria-hidden', 'true');
    if (!this._reopen) {
      document.documentElement.classList.remove(this.options.classes.bodyActive);
      !this.bodyLock ? bodyUnlock() : null;
      this.isOpen = false;
    }
    // Очистка адресной строки
    this._removeHash();
    if (this._selectorOpen) {
      this.lastClosed.selector = this.previousOpen.selector;
      this.lastClosed.element = this.previousOpen.element;

    }
    // После закрытия
    this.options.on.afterClose(this);
    // Создаем свое событие после закрытия попапа
    document.dispatchEvent(new CustomEvent("afterPopupClose", {
      detail: {
        popup: this
      }
    }));

    setTimeout(() => {
      this._focusTrap();
    }, 50);
  }
  // Получение хеша
  _getHash() {
    if (this.options.hashSettings.location) {
      this.hash = this.targetOpen.selector.includes('#') ?
        this.targetOpen.selector : this.targetOpen.selector.replace('.', '#')
    }
  }
  _openToHash() {
    let classInHash = document.querySelector(`.${window.location.hash.replace('#', '')}`) ? `.${window.location.hash.replace('#', '')}` :
      document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` :
        null;

    const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace('.', "#")}"]`);

    this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute) ?
      buttons.getAttribute(this.options.youtubeAttribute) :
      null;

    if (buttons && classInHash) this.open(classInHash);
  }
  // Установка хеша
  _setHash() {
    history.pushState('', '', this.hash);
  }
  _removeHash() {
    history.pushState('', '', window.location.href.split('#')[0])
  }
  _focusCatch(e) {
    const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
    const focusArray = Array.prototype.slice.call(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);

    if (e.shiftKey && focusedIndex === 0) {
      focusArray[focusArray.length - 1].focus();
      e.preventDefault();
    }
    if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }
  _focusTrap() {
    const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
    if (!this.isOpen && this.lastFocusEl) {
      this.lastFocusEl.focus();
    } else {
      focusable[0].focus();
    }
  }
}
// Запускаем и добавляем в объект модулей
flsModules.popup = new Popup({});
;// CONCATENATED MODULE: ./src/js/files/forms.js


function formsFieldsInit(options = { viewpass: false, maskTel: false, valid: false }) {
  document.body.addEventListener("focusin", function (e) {
    const targetElement = e.target;
    if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
      targetElement.parentElement.classList.add("_form-focus");
      targetElement.classList.add("_form-focus");
      formValidate.removeErrorClass(targetElement);
      formValidate.errorRemoveBlock(targetElement);
    }
  });
  document.body.addEventListener("focusout", function (e) {
    const targetElement = e.target;
    if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
      targetElement.parentElement.classList.remove("_form-focus");
      targetElement.classList.remove("_form-focus");
    }
    targetElement.hasAttribute("data-validate") ? formValidate.validateInput(targetElement) : null;
    // setTimeout(function () {
    //   if (targetElement.value.length === 0) {
    //     formValidate.removeErrorClass(targetElement);
    //     formValidate.errorRemoveBlock(targetElement);
    //   }
    // }, 5000);
  });
  if (options.viewpass) {
    document.addEventListener("click", function (e) {
      const targetElement = e.target;
      if (targetElement.closest(`[class*="__viewpass"]`)) {
        let inputPasswordType = targetElement.classList.contains("_viewpass-active") ? "password" : "text";
        targetElement.parentElement.querySelector("input").setAttribute("type", inputPasswordType);
        targetElement.classList.toggle("_viewpass-active");
      }
    });
  }
  if (options.maskTel) {
    const phoneInput = document.querySelectorAll("[data-tel-input]");
    if (phoneInput) {
      phoneInput.forEach(input => {
        input.addEventListener("input", onPhoneInput);
        input.addEventListener("keydown", onPhoneKeyDown);
        input.addEventListener("paste", onPhonePaste);
        input.addEventListener("focusin", onInputFocus);
        input.addEventListener("focusout", onInputFocusOut);
      });
    }
    function onPhoneInput(e) {
      const input = e.target;
      let inputNumbersValue = getInputNumbersValue(input);
      let formattedInputValue = "";
      let selecitonStart = input.selectionStart;
      if (!inputNumbersValue) {
        return input.value = "";
      }
      if (input.value.length != selecitonStart) {
        if (e.data && /\D/g.test(e.data)) {
          input.value = inputNumbersValue;
        }
        return;
      }
      if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
        input.setAttribute("maxlength", "18");
        // Русский номер телефона
        if (inputNumbersValue[0] == "8") {
          input.setAttribute("maxlength", "17");
        }
        if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
        let firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
        formattedInputValue = firstSymbols + " ";
        if (inputNumbersValue.length > 1) {
          formattedInputValue += "(" + inputNumbersValue.substring(1, 4);
        }
        if (inputNumbersValue.length >= 5) {
          formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
        }
        if (inputNumbersValue.length >= 8) {
          formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
        }
        if (inputNumbersValue.length >= 10) {
          formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
        }
      } else {
        input.setAttribute("maxlength", "12");
        // НЕ Русский номер телефона
        formattedInputValue = "+" + inputNumbersValue.substring(0, 11);
      }
      input.value = formattedInputValue;
    }
    function getInputNumbersValue(input) {
      return input.value.replace(/\D/g, "");
    };
    function onPhoneKeyDown(e) {
      const input = e.target;
      if (e.keyCode == 8 && getInputNumbersValue(input).length == 1) {
        input.value = "";
        if (input.hasAttribute("data-input-valid")) {
          formValidate.removeValidClass(input);
          formValidate.removeErrorClass(input);
        }
      }
    };
    function onPhonePaste(e) {
      const pasted = e.clipboardData || window.Clipboard;
      const input = e.target;
      const inputNumbersValue = getInputNumbersValue(input);
      if (pasted) {
        const pastedText = pasted.getData("Text");
        if (/\D/g.test(pastedText)) {
          input.value = inputNumbersValue;
        }
      };
    };
    function onInputFocus(e) {
      const input = e.target;
      if (input.dataset.inputLabel) {
        input.parentElement.insertAdjacentHTML("beforeend", `<div class="form__label-block">${input.dataset.inputLabel}</div>`);
      }
    };
    function onInputFocusOut(e) {
      const input = e.target;
      if (input.parentElement.querySelector('.form__label-block')) {
        input.parentElement.removeChild(input.parentElement.querySelector('.form__label-block'));
      }
    };
  }
  // if (options.valid) {
  //   const inputValid = document.querySelectorAll("[data-input-valid]");
  //   if (inputValid) {
  //     inputValid.forEach(inputValidEl => {
  //       inputValidEl.addEventListener("input", function () {
  //         if (inputValidEl.value !== "") {
  //           inputValidEl.classList.add("_input-valid", "_input-valid-success");
  //         } else {
  //           inputValidEl.classList.remove("_input-valid", "_input-valid-success");
  //           formValidate.removeErrorClass(inputValidEl);
  //         }

  //         if (inputValidEl.hasAttribute("data-min-length")) {
  //           const inputMinLength = inputValidEl.dataset.minLength;
  //           if (inputValidEl.value.length < inputMinLength) {
  //             inputValidEl.classList.remove("_input-valid-success");
  //             formValidate.addErrorClass(inputValidEl);
  //             if (inputValidEl.value == "") {
  //               formValidate.removeErrorClass(inputValidEl);
  //             }
  //           } else {
  //             inputValidEl.classList.add("_input-valid-success");
  //             formValidate.removeErrorClass(inputValidEl);
  //           }
  //         }

  //         if (inputValidEl.hasAttribute("data-tel-input")) {
  //           const inputPhoneMask = inputValidEl.getAttribute("maxlength");
  //           if (inputValidEl.value.length < inputPhoneMask) {
  //             inputValidEl.classList.remove("_input-valid-success");
  //             formValidate.addErrorClass(inputValidEl);
  //             if (inputValidEl.value.length == 0) {
  //               formValidate.removeErrorClass(inputValidEl);
  //             }
  //           } else {
  //             inputValidEl.classList.add("_input-valid-success");
  //             formValidate.removeErrorClass(inputValidEl);
  //           }
  //         }
  //       })

  //     })
  //   }
  // }

  if (options.valid) {
    const inputValid = document.querySelectorAll("[data-input-valid]");
    if (inputValid) {
      inputValid.forEach(inputValidEl => {
        inputValidEl.addEventListener("input", function () {
          if (inputValidEl.value !== "") {
            formValidate.addValidClass(inputValidEl);
            formValidate.addValidSuccessClass(inputValidEl);
          } else {
            formValidate.removeErrorClass(inputValidEl);
            formValidate.removeValidClass(inputValidEl);
            formValidate.removeValidSuccessClass(inputValidEl);
          }

          if (inputValidEl.hasAttribute("data-min-length")) {
            const inputMinLength = inputValidEl.dataset.minLength;
            if (inputValidEl.value.length < inputMinLength) {
              formValidate.removeValidSuccessClass(inputValidEl);
              formValidate.addErrorClass(inputValidEl);
              if (inputValidEl.value == "") {
                formValidate.removeErrorClass(inputValidEl);
              }
            } else {
              formValidate.addValidSuccessClass(inputValidEl);
              formValidate.removeErrorClass(inputValidEl);
            }
          }

          if (inputValidEl.hasAttribute("data-max-length")) {
            const inputMaxLength = inputValidEl.dataset.maxLength;
            if (inputValidEl.value.length > inputMaxLength) {
              formValidate.removeValidSuccessClass(inputValidEl);
              formValidate.addErrorClass(inputValidEl);
            } else {
              formValidate.addValidSuccessClass(inputValidEl);
              formValidate.removeErrorClass(inputValidEl);
              formValidate.addValidClass(inputValidEl);
            }
            if (inputValidEl.value == '') {
              formValidate.removeValidClass(inputValidEl);
              formValidate.removeValidSuccessClass(inputValidEl);
            }
          }

          if (inputValidEl.hasAttribute("data-tel-input")) {
            const inputPhoneMask = inputValidEl.getAttribute("maxlength");
            if (inputValidEl.value.length < inputPhoneMask) {
              formValidate.removeValidSuccessClass(inputValidEl);
              formValidate.addErrorClass(inputValidEl);
              if (inputValidEl.value == "") {
                formValidate.removeErrorClass(inputValidEl);
              }
            } else {
              inputValidEl.classList.add("_input-valid-success");
              formValidate.removeErrorClass(inputValidEl);
            }
          }
        })

      })
    }
  }

};
let formValidate = {
  getErrors(form) {
    let error = 0;
    const formRequired = form.querySelectorAll("[data-required]");
    formRequired.forEach(input => {
      error += this.validateInput(input);
    });

    // const passwordConfirm = form.querySelector('[data-required="pass-confirm"]');
    // if (passwordConfirm) {
    //   error += this.checkPasswordConfirm(passwordConfirm);
    // }

    return error;
  },

  // checkPasswordConfirm(input) {
  //   let error = 0;
  //   const passwordInput = input.closest('[data-pass-confirms]').querySelector('[data-pass-input]');

  //   if (passwordInput.value !== input.value) {
  //     this.errorAddBlock(input, `Пароли не совпадают`);
  //     this.addErrorClass(input);
  //     error++;
  //   }
  //   return error;
  // },

  validateInput(input) {
    let error = 0;
    if (input.dataset.required === "tel") {
      if (input.value.length < input.getAttribute("maxlength")) {
        formValidate.errorAddBlock(input, `Введите корректный номер телефона`);
        formValidate.addErrorClass(input);
        error++;
      }
    }
    if (input.dataset.maxLength) {
      if (input.value.length > input.dataset.maxLength) {
        formValidate.errorAddBlock(input, `Максимальное количество символов ${input.dataset.maxLength}`);
        formValidate.addErrorClass(input);
        error++;
      }
    }
    if (input.dataset.minLength) {
      if (input.value.length < input.dataset.minLength) {
        formValidate.errorAddBlock(input, `Минимальное количество символов ${input.dataset.minLength}`);
        formValidate.addErrorClass(input);
        error++;
      }
    }
    if (input.dataset.required === "email") {
      if (formValidate.emailTest(input)) {
        formValidate.errorAddBlock(input, `Введите корректный email`);
        formValidate.addErrorClass(input);
        error++;
      }
    } else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
      formValidate.addErrorClass(input);
      error++;
    }
    if (input.value === "") {
      formValidate.errorAddBlock(input, "Заполните это поле");
      formValidate.addErrorClass(input);
      error++;
    }
    return error;
  },
  addErrorClass(input) {
    input.parentElement.classList.add("_form-error");
    input.classList.add("_form-error");
  },
  removeErrorClass(input) {
    input.parentElement.classList.remove("_form-error");
    input.classList.remove("_form-error");
  },
  emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
  },
  errorAddBlock(input, text) {
    const errorBlock = input.parentElement.querySelector(".input-error");
    if (errorBlock) input.parentElement.removeChild(errorBlock);
    input.parentElement.insertAdjacentHTML("beforeend", `<div class="input-error">${text}</div>`)
  },
  errorRemoveBlock(input) {
    if (input.parentElement.querySelector(".input-error")) {
      input.parentElement.removeChild(input.parentElement.querySelector(".input-error"));
    }
  },
  addValidClass(input) {
    input.classList.add("_input-valid");
  },
  removeValidClass(input) {
    input.classList.remove("_input-valid");
  },
  addValidSuccessClass(input) {
    input.classList.add("_input-valid-success");
  },
  removeValidSuccessClass(input) {
    input.classList.remove("_input-valid-success");
  },
}
function formSubmit() {
  const forms = document.forms;
  if (forms.length) {
    for (const form of forms) {
      form.addEventListener("submit", function (e) {
        const form = e.target;
        formSubmitActions(form, e);
      });
    }
  }
  async function formSubmitActions(form, e) {
    const error = formValidate.getErrors(form);
    if (error === 0) {
      const ajax = form.hasAttribute("data-ajax");
      if (ajax) {
        e.preventDefault();
        const formAction = form.getAttribute("action") ? form.getAttribute("action").trim() : "#";
        const formMethod = form.getAttribute("method") ? form.getAttribute("method").trim() : "GET";
        const formData = new FormData(form);

        form.classList.add("_sending");

        const response = await fetch(formAction, {
          method: formMethod,
          body: formData
        });
        if (response.ok) {
          // let responseResult = await response.json();
          formSent(form);
          form.classList.remove("_sending");
        } else {
          form.setAttribute("data-response-error", "#response-error");
          if (flsModules.popup) {
            const popup = form.dataset.responseError;
            popup ? flsModules.popup.open(popup) : null;
          };
          form.removeAttribute("data-response-error");
          form.classList.remove("_sending");
        }
      } else if (form.hasAttribute("data-dev")) {
        e.preventDefault();
        formSent(form);
      }
    } else {
      e.preventDefault();
    }
  }

  function formSent(form, responseResult = '') {
    document.dispatchEvent(new CustomEvent("formSent", {
      detail: {
        form: form
      }
    }));
    if (flsModules.popup) {
      const popup = form.dataset.popupMessage;
      popup ? flsModules.popup.open(popup) : null;
    }
    form.reset();
  };
}

;// CONCATENATED MODULE: ./node_modules/ymaps/dist/ymaps.esm.js
var ymaps$1 = {
  load: function load() {
    var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '//api-maps.yandex.ru/2.1/?lang=en_RU';

    var getNsParamValue = function getNsParamValue() {
      var results = src.match(/[\\?&]ns=([^&#]*)/);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    if (!this.promise) {
      this.promise = new Promise(function (resolve, reject) {
        var scriptElement = document.createElement('script');
        scriptElement.onload = resolve;
        scriptElement.onerror = reject;
        scriptElement.type = 'text/javascript';
        scriptElement.src = src;
        document.body.appendChild(scriptElement);
      }).then(function () {
        var ns = getNsParamValue();

        if (ns && ns !== 'ymaps') {
          (0, eval)("var ymaps = ".concat(ns, ";"));
        }

        return new Promise(function (resolve) {
          return ymaps.ready(resolve);
        });
      });
    }

    return this.promise;
  }
};

/* harmony default export */ const ymaps_esm = (ymaps$1);

;// CONCATENATED MODULE: ./src/js/files/maps.js


ymaps_esm
  .load('https://api-maps.yandex.ru/2.1/?lang=ru_RU')
  .then(maps => {
    const mapContainer = document.querySelector(".maps__map");
    const map = new maps.Map(mapContainer, {
      center: [55.744343696512445, 37.563334526384324],
      zoom: 15,
    });
    map.controls.remove('geolocationControl'); // удаляем геолокацию
    map.controls.remove('searchControl'); // удаляем поиск
    map.controls.remove('trafficControl'); // удаляем контроль трафика
    map.controls.remove('typeSelector'); // удаляем тип
    map.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
    map.controls.remove('zoomControl'); // удаляем контрол зуммирования
    map.controls.remove('rulerControl'); // удаляем контрол правил
    map.behaviors.disable(['scrollZoom']); // отключаем скролл карты (опционально)
  })
  .catch(error => console.log('Failed to load Yandex Maps', error));
;// CONCATENATED MODULE: ./src/js/libs/dynamic_adapt.js
// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

class DynamicAdapt {
  constructor(type) {
    this.type = type
  }
  init() {
    // массив объектов
    this.оbjects = []
    this.daClassname = '_dynamic_adapt_'
    // массив DOM-елементов
    this.nodes = [...document.querySelectorAll('[data-da]')]

    // наполнение оbjects объектами
    this.nodes.forEach((node) => {
      const data = node.dataset.da.trim()
      const dataArray = data.split(',')
      const оbject = {}
      оbject.element = node
      оbject.parent = node.parentNode
      оbject.destination = document.querySelector(`${dataArray[0].trim()}`)
      оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767'
      оbject.place = dataArray[2] ? dataArray[2].trim() : 'last'
      оbject.index = this.indexInParent(оbject.parent, оbject.element)
      this.оbjects.push(оbject)
    })

    this.arraySort(this.оbjects)

    // массив уникальных медиа-запросов
    this.mediaQueries = this.оbjects
      .map(({ breakpoint }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
      .filter((item, index, self) => self.indexOf(item) === index)

    // навешивание слушателя на медиа-запрос
    // и вызов обработчика при первом запуске
    this.mediaQueries.forEach((media) => {
      const mediaSplit = media.split(',')
      const matchMedia = window.matchMedia(mediaSplit[0])
      const mediaBreakpoint = mediaSplit[1]

      //массив объектов с соответствующим брейкпоинтом
      const оbjectsFilter = this.оbjects.filter(({ breakpoint }) => breakpoint === mediaBreakpoint)
      matchMedia.addEventListener('change', () => {
        this.mediaHandler(matchMedia, оbjectsFilter)
      })
      this.mediaHandler(matchMedia, оbjectsFilter)
    })
  }
  // Основная функция
  mediaHandler(matchMedia, оbjects) {
    if (matchMedia.matches) {
      оbjects.forEach((оbject) => {
        // оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.moveTo(оbject.place, оbject.element, оbject.destination)
      })
    } else {
      оbjects.forEach(({ parent, element, index }) => {
        if (element.classList.contains(this.daClassname)) {
          this.moveBack(parent, element, index)
        }
      })
    }
  }
  // Функция перемещения
  moveTo(place, element, destination) {
    element.classList.add(this.daClassname)
    if (place === 'last' || place >= destination.children.length) {
      destination.append(element)
      return
    }
    if (place === 'first') {
      destination.prepend(element)
      return
    }
    destination.children[place].before(element)
  }
  // Функция возврата
  moveBack(parent, element, index) {
    element.classList.remove(this.daClassname)
    if (parent.children[index] !== undefined) {
      parent.children[index].before(element)
    } else {
      parent.append(element)
    }
  }
  // Функция получения индекса внутри родительского элемента
  indexInParent(parent, element) {
    return [...parent.children].indexOf(element)
  }
  // Функция сортировки массива по breakpoint и place
  // по возрастанию для this.type = min
  // по убыванию для this.type = max
  arraySort(arr) {
    if (this.type === 'min') {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0
          }
          if (a.place === 'first' || b.place === 'last') {
            return -1
          }
          if (a.place === 'last' || b.place === 'first') {
            return 1
          }
          return 0
        }
        return a.breakpoint - b.breakpoint
      })
    } else {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0
          }
          if (a.place === 'first' || b.place === 'last') {
            return 1
          }
          if (a.place === 'last' || b.place === 'first') {
            return -1
          }
          return 0
        }
        return b.breakpoint - a.breakpoint
      })
      return
    }
  }
}
const da = new DynamicAdapt("max");
da.init();
;// CONCATENATED MODULE: ./src/js/files/script.js
window.addEventListener("load", function () {
  document.addEventListener('click', documentActions);
});

function documentActions(e) {
  const targetElement = e.target;

  if (targetElement.closest('.services-header__button')) {
    targetElement.closest('.services-header').classList.toggle("_active-dropdown");
    document.documentElement.classList.toggle('_show-dropdown');
  }
  if (!targetElement.closest('.services-header__button') && !document.querySelector('.services-header')) {
    document.documentElement.classList.remove('_show-dropdown');
    document.querySelector('.services-header').classList.remove("_active-dropdown");
  }
}
;// CONCATENATED MODULE: ./src/js/app.js


// myFunctions.addTouchClass();
// Бургер меню
menuOpen();
//========================================================================================================================================================

// Переключение темы сайта
// myFunctions.themeToggle();

// показ шапки при скролле
// myFunctions.headerScroll();

//========================================================================================================================================================
// Wathcer
// myFunctions.elementWatches();
//========================================================================================================================================================

// Скролл к нужному блоку
// myFunctions.gotoScroll();

//========================================================================================================================================================

// Табы
tabs();
//========================================================================================================================================================

// Spollers
// myFunctions.spollers();

//========================================================================================================================================================
// Scroller
// myFunctions.loopScroller();

//========================================================================================================================================================

// Звездный рейтинг
// myFunctions.formRating();
//========================================================================================================================================================


//====Показать еще ====================================================================================================================================================
showMore();

//========================================================================================================================================================



formsFieldsInit({
  viewpass: false,
  maskTel: true,
  valid: false,
});

// Отправка формы
formSubmit();

// import "./files/select.js";

//Quantity
// import "./files/quantity.js";
//========================================================================================================================================================


// Подключение Range Slider --------------------------------------------------------------
// Документация https://refreshless.com/nouislider/
// import "./files/range.js";
//========================================================================================================================================================
// Слайдер свайпер
// import "./files/swiper.js";

// Динамический адаптив



/******/ })()
;