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
})();