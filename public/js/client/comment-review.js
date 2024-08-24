document.addEventListener('DOMContentLoaded', () => {
    const toggleElementHeight = (element, expandedHeight, collapsedHeight) => {

        element.style.height = element.classList.toggle('action') ? `${expandedHeight}px` : collapsedHeight;
    };

    const toggleIcons = (element, iconClass1, iconClass2) => {
        element.querySelector(iconClass1).classList.toggle('hidden');
        element.querySelector(iconClass2).classList.toggle('hidden');
    };

    const buttonShowComment = document.querySelectorAll('.button-show-comment');
    buttonShowComment.forEach(button => {
        button.addEventListener('click', () => {
            const boxDescription = button.closest('.item-comment').querySelector('.description-comment');
            toggleElementHeight(boxDescription, boxDescription.scrollHeight, '7.6rem');
            toggleIcons(button, '.cong', '.tru');
            boxDescription.querySelector('.child-desc').classList.toggle('accordion-description-gradient');
        });

        const desc = button.closest('.item-comment').querySelector('.description-comment');
        if (desc.scrollHeight <= 76) {
            button.remove();
        }
    });

    const buttonShowDivMobile = document.querySelector('.ratting-comment .box-ratting  .icon-button');
    if (buttonShowDivMobile) {
        buttonShowDivMobile.addEventListener('click', () => {
            const boxComment = document.querySelector('.ratting-comment .comment-mobile');
            toggleElementHeight(boxComment, boxComment.scrollHeight+10, '0px');
            toggleIcons(buttonShowDivMobile, '.cong', '.tru');
        });
    }
});