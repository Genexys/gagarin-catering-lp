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
