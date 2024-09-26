const modalFilters = document.querySelectorAll('.modal-custom');

modalFilters.forEach(modalFilter => {
    const bgModal = modalFilter.querySelector('.bg-overview-close');
  
    const closeModal = modalFilter.querySelector('.modal_close');
    closeModal.addEventListener('click', function() {
      
        modalFilters.forEach(modalFilter => {
            modalFilter.classList.add('hidden');
        });
    });
    document.addEventListener('click', function(event) {
        const isClickInside = bgModal.contains(event.target);
        if (isClickInside) {
            modalFilter.classList.add('hidden');
        }
    });
    
});

