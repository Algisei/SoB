// Обновление активного слота
function updateActiveSlot() {
    const slots = document.querySelectorAll('.slot');
    slots.forEach(slot => slot.classList.remove('active'));
    document.querySelector(`.slot[data-key="${mode === 10 ? 0 : mode}"]`).classList.add('active');
}
