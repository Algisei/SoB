// menu.js

export function initializeMenu(onScrollsMaker, onRestart) {
    document.getElementById('resume').addEventListener('click', () => {
        toggleMenu(false);
    });

    document.getElementById('scrollsMaker').addEventListener('click', () => {
        toggleMenu(false);
        // onScrollsMaker();
        showScrollsMaker();
    });

    document.getElementById('restart').addEventListener('click', onRestart);
}

export function toggleMenu(isPaused) {
    document.getElementById('menu').style.display = isPaused ? 'block' : 'none';
}

