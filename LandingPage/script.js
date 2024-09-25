document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (name && email) {
        alert(`Thank you, ${name}. We will contact you shortly at ${email}.`);
    } else {
        alert('Please fill out all fields.');
    }
});
// Получаем все секции и элементы меню
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

// Функция для отслеживания активной секции
function setActiveSection() {
    let index = sections.length;

    while(--index && window.scrollY + 50 < sections[index].offsetTop) {}

    navLinks.forEach((link) => link.classList.remove('active'));
    navLinks[index].classList.add('active');

    // Изменяем URL без перезагрузки страницы
    const currentSectionId = sections[index].id;
    history.replaceState(null, null, `#${currentSectionId}`);
}

// Отслеживаем прокрутку
window.addEventListener('scroll', setActiveSection);

// Вызываем функцию сразу при загрузке страницы, чтобы установить начальное состояние
setActiveSection();
