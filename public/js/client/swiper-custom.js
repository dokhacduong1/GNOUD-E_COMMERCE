var galleryThumbs = new Swiper(".gallery-thumbs", {
  spaceBetween: 10,
  slidesPerView: 6, 
  slidesPerGroup: 6, // Add this line
  direction: 'vertical',
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
 
  on: {
    click: function () {
      var activeIndex = galleryTop.activeIndex;
      const imageActive = this.slides[activeIndex].getAttribute('data-image');
      const img = document.querySelector('.swiper-container.gallery-top .swiper-wrapper img');
      const loader = document.querySelector('.swiper-container.gallery-top .swiper-wrapper .loader');
      loader.style.display = "block";
      img.src = imageActive;
    },
  },
  breakpoints: {
    // when window width is >= 320px
    575:{
      direction: 'vertical',
    },
    0: {
      direction: "horizontal",
      pagination: {
        el: '.swiper-pagination1',
        clickable: true,
      },
      slidesPerView: 5, 
      slidesPerGroup: 5, // Add this line
    
   
    },
  },
});

var galleryTop = new Swiper(".gallery-top", {
  spaceBetween: 10,
  direction: 'vertical',
  thumbs: {
    swiper: galleryThumbs,
  },

});