// gscrInterface.js

export function initializeSlotPanel() {
    const slots = document.querySelectorAll('.slot');
    slots.forEach(slot => slot.addEventListener('click', () => updateActiveSlot(parseInt(slot.dataset.key))));
}

export function updateActiveSlot(activeSlot) {
    const slots = document.querySelectorAll('.slot');
    slots.forEach(slot => slot.classList.remove('active'));
    const selectedSlot = document.querySelector(`.slot[data-key="${activeSlot}"]`);
    if (selectedSlot) {
        selectedSlot.classList.add('active');
    }
}
