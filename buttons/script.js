const mainButton = document.getElementById('mainButton');
const roundButtonWrapper = document.querySelector('.round-button-wrapper');
const splitButtons = document.querySelectorAll('.split-button');

function resetButtons() {
    mainButton.style.opacity = '1';
    splitButtons.forEach(button => {
        button.style.transform = '';
    });
    roundButtonWrapper.removeEventListener('mouseleave', resetButtons);
}

roundButtonWrapper.addEventListener('mouseenter', () => {
    roundButtonWrapper.addEventListener('mouseleave', resetButtons);
});
