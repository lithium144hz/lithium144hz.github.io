# lithium144hz — 2D Animator Portfolio

Минималистичный сайт-портфолио на английском языке для GameDev аниматора.

## Структура сайта:
- **Hero**: Имя `lithium144hz`, специализация (Spine 2D, Aseprite, Unity), быстрые кнопки.
- **Showreel**: Блок под главное видео с демонстрацией анимаций (сейчас пустой плейсхолдер).
- **Selected Work**: Сетка карточек с категориями (`Spine 2D`, `Frame-by-Frame / Pixel`, `Art & Assets`). Все превью оставлены пустыми плейсхолдерами `[ Placeholder ]`.
- **Skills & Pipeline**: Краткий список используемого софта и задач.
- **Contact**: Минималистичные плашки для связи (Telegram, Email, Discord, GitHub).

---

## Как посмотреть сайт локально:
Открой файл `index.html` двойным кликом в браузере:
`C:\Users\ZOzik\.gemini\antigravity\scratch\lithium144hz-portfolio\index.html`

---

## Как заменять плейсхолдеры на свои работы:

В файле `index.html` каждая карточка выглядит так:

```html
<article class="work-card" data-category="spine" 
         data-title="Название проекта" 
         data-type="image"
         data-src="images/my_animation.gif"
         data-desc="Описание анимации или персонажа.">
  <div class="card-thumb">
    <!-- Вместо плейсхолдера ставишь свою картинку или GIF -->
    <img src="images/my_animation.gif" alt="Превью">
    <span class="card-pill">Spine 2D</span>
  </div>
  <div class="card-info">
    <h3 class="card-title">Название проекта</h3>
    <p class="card-meta">Spine 2D • Skeletal Rigging</p>
  </div>
</article>
```

- Если работа — видео (MP4 / WebM), укажи `data-type="video"` и в `data-src` путь к видео.
- Все файлы картинок и гифок клади в созданную папку `images/`.
