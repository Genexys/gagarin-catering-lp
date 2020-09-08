import {forEachPolyfill} from './utils/polyfill-foreach';
import {initIe11Download} from './utils/init-ie11-download';
import {modules} from './modules/modules';
import {lazyLoading} from './modules/lazy-loading';

// Utils
// ---------------------------------
forEachPolyfill();
initIe11Download();


// Modules
// ---------------------------------
modules();
lazyLoading();

const ie11Download = (el) => {
  if (el.href === ``) {
    throw Error(`The element has no href value.`);
  }

  let filename = el.getAttribute(`download`);
  if (filename === null || filename === ``) {
    const tmp = el.href.split(`/`);
    filename = tmp[tmp.length - 1];
  }

  el.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.onloadstart = () => {
      xhr.responseType = `blob`;
    };
    xhr.onload = () => {
      navigator.msSaveOrOpenBlob(xhr.response, filename);
    };
    xhr.open(`GET`, el.href, true);
    xhr.send();
  });
};

const downloadLinks = document.querySelectorAll(`a[download]`);

const initIe11Download = () => {
  if (window.navigator.msSaveBlob) {
    if (downloadLinks.length) {
      downloadLinks.forEach((el) => {
        ie11Download(el);
      });
    }
  }
};

export {initIe11Download};

const forEachPolyfill = () => {
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
};

export {forEachPolyfill};

const body = document.querySelector(`body`);

const getScrollbarWidth = () => {
  const outer = document.createElement(`div`);
  outer.style.visibility = `hidden`;
  outer.style.overflow = `scroll`;
  outer.style.msOverflowStyle = `scrollbar`;
  body.appendChild(outer);
  const inner = document.createElement(`div`);
  outer.appendChild(inner);
  const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
  outer.parentNode.removeChild(outer);
  return scrollbarWidth;
};

const getBodyScrollTop = () => {
  return (
    self.pageYOffset ||
    (document.documentElement && document.documentElement.ScrollTop) ||
    (body && body.scrollTop)
  );
};

const disableScrolling = () => {
  const scrollWidth = getScrollbarWidth();
  body.setAttribute(`style`, `padding-right: ` + scrollWidth + `px;`);
  body.dataset.scrollY = `${getBodyScrollTop()}`;
  body.style.top = `-${body.dataset.scrollY}px`;
  body.classList.add(`scroll-lock`);
};

const enableScrolling = () =>{
  body.removeAttribute(`style`);
  body.classList.remove(`scroll-lock`);
  window.scrollTo(0, +body.dataset.scrollY);
};

export {enableScrolling, disableScrolling};

(function () {
    var validator = new FormValidator('consult-form', [{
        name: 'name',
        display: 'required',
        rules: 'required'
    }, {
        name: 'phone',
        display: 'required',
        rules: 'required'
    }], function(errors, event) {
        if (errors.length > 0) {
            // Show the errors

            if (evt && evt.preventDefault) {
                evt.preventDefault();
            } else if (event) {
                event.returnValue = false;
            }
        }
    });
})();
const lazyLoading = () => {
  // Lazy loading img & background images using intersection observer
// Reference: https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/
// Using example: <img class="lazy" src="thumb.gif" data-src="real-img.jpg" data-srcset="real-img@1x.jpg 1x, real-img@2x.jpg 2x">
// Background image class usign example: <div class="lazy-background"> with added class ".visible" for styling
// Background image style attribute lazy loading example: <div data-bg="image.jpg">
// delete window.IntersectionObserver; // Fallback Testing

  document.addEventListener('DOMContentLoaded', function () {
    const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
    const lazyBackgrounds = [].slice.call(document.querySelectorAll('.lazy-background'));
    const lazyBackgroundsData = [].slice.call(document.querySelectorAll('[data-bg]'));

    if ('IntersectionObserver' in window) {
      const lazyImageObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.srcset = lazyImage.dataset.srcset;
            lazyImage.classList.remove('lazy');
            lazyImageObserver.unobserve(lazyImage);
          }
        });
      });
      lazyImages.forEach(function (lazyImage) {
        lazyImageObserver.observe(lazyImage);
      });
      const lazyBackgroundObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            lazyBackgroundObserver.unobserve(entry.target);
          }
        });
      });
      lazyBackgrounds.forEach(function (lazyBackground) {
        lazyBackgroundObserver.observe(lazyBackground);
      });
      const lazyBackgroundDataObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const lazyBackgroundData = entry.target;
            lazyBackgroundData.style.backgroundImage = 'url(' + lazyBackgroundData.dataset.bg + ')';
            lazyBackgroundDataObserver.unobserve(lazyBackgroundData);
          }
        });
      });
      lazyBackgroundsData.forEach(function (lazyBackgroundData) {
        lazyBackgroundDataObserver.observe(lazyBackgroundData);
      });
    } else {
      // Fallback
      lazyImages.forEach(function (lazyImage) {
        lazyImage.src = lazyImage.dataset.src;
        lazyImage.srcset = lazyImage.dataset.srcset;
      });
      lazyBackgrounds.forEach(function (lazyBackground) {
        lazyBackground.classList.add('visible');
      });
      lazyBackgroundsData.forEach(function (lazyBackgroundData) {
        lazyBackgroundData.style.backgroundImage = 'url(' + lazyBackgroundData.dataset.bg + ')';
      });
    }
  });
};

export {lazyLoading};

// import AOS from "aos"
// import "aos/dist/aos.css"

import Inputmask from '../vendor/jquery.inputmask.min';

import {validateForm} from "./validateForm";


export const modules = () => {
  var md = new MobileDetect(window.navigator.userAgent);
  let telInput = document.querySelectorAll('input[type="tel"]');

  let im = new Inputmask("+7(999)999-99-99", {
    showMaskOnHover: false,
    showMaskOnFocus: true,
  });

  im.mask(telInput);

  // AOS.init();

  const findPos = function (obj) {
    let curtop = 0;
    if (obj.offsetParent) {
      do {
        curtop += obj.offsetTop
      } while ((obj = obj.offsetParent));
      return [curtop]
    }
  };

  if (window.innerWidth > 1024) {
    $(".card-service__img").parallaxContent({
      shift: -150,
      duration: .5
    });

    $(".card-service__bg-text").parallaxContent({
      shift: 20
    });

    $(".parallax-img-up").parallaxContent({
      shift: -20
    });

    $(".parallax-img-down").parallaxContent({
      shift: 80
    });

    $(".parallax-img-down-fast").parallaxContent({
      shift: 180,
      duration: .5,

    });
  }

  const titlePage = document.querySelector(".title-page");
  let titlePageBox = titlePage.getBoundingClientRect();
  const cosmonaut1 = document.querySelector(".banner-cosmonaut");

  cosmonaut1.addEventListener('animationend', function () {
    cosmonaut1.classList.add('active');
  });

  cosmonaut1.style.left = titlePageBox.right - 150 + "px";

  window.addEventListener("resize", () => {
    titlePageBox = titlePage.getBoundingClientRect();
    cosmonaut1.style.left = titlePageBox.right - 150 + "px"
  });

  const getTabActionServices = function (container) {
    const parentBlock = document.querySelector(".services");
    const tabsConatiner = parentBlock.querySelector(".tabs");
    const tabsItems = tabsConatiner.querySelectorAll("button");
    const contentItems = parentBlock.querySelectorAll(".card-service");

    for (const item of tabsItems) {
      const tabId = item.dataset.tabId;
      item.addEventListener("click", function () {
        for (const content of contentItems) {
          const contentId = content.dataset.tabContent;
          const contentTop = content.getBoundingClientRect().y;
          if (tabId === contentId) {
            $([document.documentElement, document.body]).animate({
              scrollTop: findPos(content)
            }, 500);
          }
        }
      })
    }
  };

  getTabActionServices();

  const getTabActionAdvantages = function (container) {
    const parentBlock = document.querySelector(".advantages");

    if (parentBlock.querySelector(".tabs")) {
      const tabsConatiner = parentBlock.querySelector(".tabs");
      const tabsItems = tabsConatiner.querySelectorAll("button");
      const contentItems = parentBlock.querySelectorAll(".advantages__item");

      for (const item of tabsItems) {
        const tabId = item.dataset.tabId;
        item.addEventListener("click", function () {
          for (const content of contentItems) {
            const contentId = content.dataset.tabContent;
            const contentTop = content.getBoundingClientRect().y;
            if (tabId === contentId) {
              $([document.documentElement, document.body]).animate({
                scrollTop: findPos(content)
              }, 500);
            }
          }
        })
      }
    }
  };

  getTabActionAdvantages();

  const getScaleImg = function () {
    const imgServices = document.querySelectorAll(".card-service__img img");

    let prevRatio = 0;

    createObserver();

    function createObserver() {
      let observer;

      const buildThresholdList = function () {
        let thresholds = [];
        let numSteps = 20;

        for (let i = 1; i <= numSteps; i++) {
          let ratio = i / numSteps;
          thresholds.push(ratio)
        }

        thresholds.splice(5, 20);
        // console.log(thresholds)
        return thresholds
      };

      const handleIntersect = function (entries, observer) {
        entries.forEach(entry => {
          if (entry.intersectionRatio > prevRatio) {
            entry.target.style.transform = `scale(${1 + entry.intersectionRatio})`
            // console.log("true -", entry.intersectionRatio)
          } else {
            // console.log("flase -", entry.intersectionRatio)
            entry.target.style.transform = `scale(1.0)`
          }

          prevRatio = entry.intersectionRatio
        });
      };

      let options = {
        root: null,
        rootMargin: "0px",
        threshold: buildThresholdList()
      };

      observer = new IntersectionObserver(handleIntersect, options);

      for (const img of imgServices) {
        observer.observe(img);
      }

      // observer.observe(imgServices[0])
    }
  };

  if (md.os() !== 'iOS' || window.innerWidth > 1024) {
    getScaleImg();
  }


  // const galleryItems = document.querySelectorAll('.item-gallary')
  //
  // for (let item of galleryItems) {
  // 	$(item).fancybox({
  // 		caption: function (instance, item) {
  // 			console.log(
  // 				$(this)
  // 					.parent()
  // 					.find("figcaption")
  // 			);
  // 			return $(this)
  // 				.parent()
  // 				.find("figcaption")
  // 				.html()
  // 		}
  // 	})
  // }

  const configValidate = {
    email: {
      email: true,
    },
    name: {
      presence: true,

    },
    phone: {
      presence: true,
      format: {
        pattern: /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/
      }
    },
  };

  const configValidateEmail = {
    email: {
      email: true,
      presence: true,
    },
    name: {
      presence: true,
    },
    phone: {
      presence: true,
      format: {
        pattern: /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/
      }
    },
  };

  const requestForm = document.querySelector('#request-modal .modal-request__form');
  const requestFormEmail = document.querySelector('#request-modal-email .modal-request__form');
  const consultForm = document.querySelector('.consult-block__form');
  const consultFormModal = document.querySelector('.consult-form');

  validateForm(requestForm, configValidate);
  validateForm(requestFormEmail, configValidateEmail);
  validateForm(consultForm, configValidate);
  validateForm(consultFormModal, configValidate);

  document.querySelector('.up-to-form').addEventListener('click', function () {
    $.fancybox.open({
      src: '#consult-modal',
      type: 'inline',
      smallBtn: false,
      touch: false,

      afterClose: function () {

        for (const input of consultFormModal.querySelectorAll('.input-wrapper')) {
          input.classList.remove('input-wrapper--error');
        }

        // if (document.body.classList.contains('fancybox-active')) {
        // 	document.querySelector('.page').classList.remove('hidden')
        // }
      }
    });
  });

  const btns = document.querySelectorAll('.modal-btn');
  const btnsEmail = document.querySelectorAll('.modal-btn-email');

  const getOpenModal = function (btns, targetModal) {
    const formRequest = document.querySelector(`${targetModal} form`);
    const inputWrappers = formRequest.querySelectorAll('.input-wrapper');

    for (const btn of btns) {
      btn.addEventListener('click', function() {
        formRequest.querySelector('[type="hidden"]').value = this.dataset.typeEmail;

        $.fancybox.open({
          src: targetModal,
          type: 'inline',
          smallBtn: true,
          touch: false,

          // beforeShow: function () {
          // 	if (document.body.classList.contains('fancybox-active')) {
          // 		document.querySelector('.page').classList.add('hidden')
          // 	}
          // },
          afterClose: function () {
            formRequest.reset();

            for (const input of inputWrappers) {
              input.classList.remove('input-wrapper--error');
            }

            // if (document.body.classList.contains('fancybox-active')) {
            // 	document.querySelector('.page').classList.remove('hidden')
            // }
          }
        });

      });
    }
  };

  getOpenModal(btns, '#request-modal');
  getOpenModal(btnsEmail, '#request-modal-email');

};

export const validateForm = function (form, configValidate) {

  const constraints = configValidate;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    handleFormSubmit(form);
  });

  const inputs = form.querySelectorAll("input, textarea, select");

  for (let i = 0; i < inputs.length; ++i) {

    inputs.item(i).addEventListener("change", function (ev) {
      const errors = validate(form, constraints) || {};
      showErrorsForInput(this, errors[this.name]);
    });
  }

  function handleFormSubmit(form, input) {
    var errors = validate(form, constraints);
    showErrors(form, errors || {});
    if (!errors) {
      showSuccess();
    }
  }

  function showErrors(form, errors) {
    form.querySelectorAll("input[name], select[name]").forEach(function (input) {
      showErrorsForInput(input, errors && errors[input.name]);
    });
  }

  function showErrorsForInput(input, errors) {

    var formGroup = closestParent(input.parentElement, "input-wrapper");

    resetFormGroup(formGroup);
    if (errors) {
      formGroup.classList.add("input-wrapper--error");
    } else {
      formGroup.classList.add("input-wrapper--success");
    }
  }

  function closestParent(child, className) {

    if (!child || child === document) {
      return null;
    }
    if (child.classList.contains(className)) {
      return child;
    } else {
      return closestParent(child.parentNode, className);
    }
  }

  function resetFormGroup(formGroup) {
    formGroup.classList.remove("input-wrapper--error");
    formGroup.classList.remove("input-wrapper--success");
  }

  async function showSuccess() {
    const data = new FormData(form);

   await fetch(form.getAttribute('action'), {
      method: form.getAttribute('method'),
      body: data,
    })
      .then(async response => {
        return response.text();
      })
      .then(async text => {
        $.fancybox.close();

        form.reset();

        $.fancybox.open({
          src: '#thanx-modal',
          type: 'inline',
        });

        setTimeout(() => {
          $.fancybox.close();
        }, 2000);
      }).catch(error => {
      console.error(error);
    });

    // $.ajax({
    //     type: form.getAttribute('method'),
    //     url: form.getAttribute('method'),
    //     dataType: 'text',
    //     data: data,
    //     success: function success(data) {
    //         $.fancybox.close()
    //
    //         $.fancybox.open({
    //             src: '#thanx-modal',
    //             type: 'inline'
    //         });
    //
    //         setTimeout(() => {
    //             $.fancybox.close()
    //         }, 2000)
    //
    //     },
    //     error: function error(xhr, ajaxOptions, thrownError) {
    //         console.log(xhr.status);
    //         console.log(thrownError);
    //     }
    // });
  }
};
