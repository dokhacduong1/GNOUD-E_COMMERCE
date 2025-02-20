const modalFilters = document.querySelectorAll('.modal-custom');

modalFilters.forEach(modalFilter => {
    const bgModal = modalFilter.querySelector('.bg-overview-close');
    const closeModals = modalFilter.querySelectorAll('.modal_close, .modal-close');

    closeModals.forEach(closeModal => {
        closeModal.addEventListener('click', () => {
            modalFilter.classList.add('hidden');
        });
    });

    document.addEventListener('click', event => {
        if (bgModal?.contains(event.target)) {
            modalFilter.classList.add('hidden');
        }
    });
});