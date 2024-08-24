const swiper = new Swiper(".swiper-products", {
  slidesPerView: 6, 
  slidesPerGroup: 6, // Add this line
  spaceBetween: 20,
  // Optional parameters
  direction: "horizontal",



  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next-custom",
    prevEl: ".swiper-button-prev-custom",
  },
  dots: false,
  // And if we need scrollbar
  scrollbar: {
    el: ".swiper-scrollbar",
    draggable: true,
  },
  breakpoints: {
    0:{
      slidesPerGroup: 2,
      slidesPerView: 2,
    },
    1024:{
      slidesPerView: 6, 
      slidesPerGroup: 6, // Add this line
    }
  }
});