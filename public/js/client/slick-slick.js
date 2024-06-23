$('.slick-banner').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 2000,
    speed: 500, // thời gian chuyển slide
    cssEase: 'linear', // kiểu easing
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


$('.slick-item').slick({

    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    variableWidth: true,
    responsive: [
        {
            breakpoint: 1024, // kích thước màn hình cho điểm ngắt 'md'
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                arrows: false, // ẩn mũi tên ở kích thước màn hình 'md' hoặc nhỏ hơn

            }
        }, 
        {
            breakpoint: 768, // kích thước màn hình cho điểm ngắt 'md'
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                arrows: false,
            }
            ,
        },
        {
            breakpoint: 640, // kích thước màn hình cho điểm ngắt 'md'
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                arrows: false,
            }
            ,
        }
    ]
});