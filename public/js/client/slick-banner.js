$('.slick-banner').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed:2000,
    autoplay: true,
    arrows: true, // hiển thị mũi tên ở kích thước màn hình lớn
    responsive: [
        {
            breakpoint: 768, // kích thước màn hình cho điểm ngắt 'md'
            settings: {
                arrows: false, // ẩn mũi tên ở kích thước màn hình 'md' hoặc nhỏ hơn
            }
        }
    ]
  });