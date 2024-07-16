const filterRow = document.querySelector('.filter-row');

if (filterRow) {
    filterRow.addEventListener('click', function() {
        const modalRow = document.querySelector('.modal-custom');
        if (modalRow) {
            console.log('filter-row.js');
            modalRow.classList.remove('hidden');
        
        }
    })
   
}