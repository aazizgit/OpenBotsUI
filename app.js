(() => {
const toast = document.getElementById('toast');
let timer;
const notify = message => {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 2200);
};
document.querySelectorAll('[data-message]').forEach(el => el.addEventListener('click', () => notify(el.dataset.message)));
document.querySelectorAll('[data-tab]').forEach(el => el.addEventListener('click', () => {
    const tab = el.dataset.tab;
    document.querySelectorAll('.nav-item').forEach(item => {
        const active = item.dataset.tab === tab;
        item.classList.toggle('active', active);
        if (active) item.setAttribute('aria-current','page');
        else item.removeAttribute('aria-current');
    });
    if (tab === 'Главная') window.scrollTo({top:0,behavior:'smooth'});
    else notify(`Раздел «${tab}» — демонстрационный прототип`);
}));
document.querySelectorAll('.heart').forEach(btn => btn.addEventListener('click', () => {
    btn.classList.toggle('is-favorite');
    btn.textContent = btn.classList.contains('is-favorite') ? '♥' : '♡';
    notify(btn.classList.contains('is-favorite') ? 'Добавлено в избранное' : 'Удалено из избранного');
}));

const track = document.getElementById('promoTrack');
const dotsContainer = document.getElementById('promoDots');
if (track) {
    const originalSlides = Array.from(track.children);
    const totalReal = originalSlides.length;
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
    track.appendChild(firstClone);
    track.insertBefore(lastClone, originalSlides[0]);
    const allSlides = track.children;
    const dots = dotsContainer.querySelectorAll('i');
    let currentIndex = 1;
    let autoTimer;
    let startX = 0, currentX = 0, isDragging = false;
    const getStepWidth = () => allSlides[0].offsetWidth + 20;
    const updateDots = () => {
        const realIndex = ((currentIndex - 1) + totalReal) % totalReal;
        dots.forEach((d, i) => d.classList.toggle('active', i === realIndex));
    };
    const goTo = (index, animate = true) => {
        if (!animate) track.style.transition = 'none';
        else track.style.transition = 'transform .45s cubic-bezier(.22,.61,.36,1)';
        track.style.transform = `translateX(-${index * getStepWidth()}px)`;
        currentIndex = index;
        updateDots();
    };
    const nextSlide = () => goTo(currentIndex + 1);
    const prevSlide = () => goTo(currentIndex - 1);
    const resetAutoTimer = () => { clearInterval(autoTimer); autoTimer = setInterval(nextSlide, 10000); };
    track.addEventListener('transitionend', () => {
        if (currentIndex === 0) goTo(totalReal, false);
        else if (currentIndex === totalReal + 1) goTo(1, false);
    });
    goTo(1, false);
    resetAutoTimer();
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; isDragging = true; track.style.transition = 'none'; }, {passive:true});
    track.addEventListener('touchmove', e => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        track.style.transform = `translateX(${-(currentIndex * getStepWidth()) + (currentX - startX)}px)`;
    }, {passive:true});
    track.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        const diff = currentX - startX;
        const threshold = getStepWidth() * 0.2;
        if (diff < -threshold) nextSlide();
        else if (diff > threshold) prevSlide();
        else goTo(currentIndex);
        resetAutoTimer();
    });
    track.addEventListener('mousedown', e => { startX = e.clientX; isDragging = true; track.style.transition = 'none'; e.preventDefault(); });
    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        currentX = e.clientX;
        track.style.transform = `translateX(${-(currentIndex * getStepWidth()) + (currentX - startX)}px)`;
    });
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        const diff = currentX - startX;
        const threshold = getStepWidth() * 0.2;
        if (diff < -threshold) nextSlide();
        else if (diff > threshold) prevSlide();
        else goTo(currentIndex);
        resetAutoTimer();
    });
    window.addEventListener('resize', () => goTo(currentIndex, false));
}
})();