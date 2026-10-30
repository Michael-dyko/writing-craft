# Ремесло

Веб-приложение — база знаний по писательскому мастерству. Статический фронтенд на React, контент лежит в markdown-файлах и собирается вместе с сайтом. Хостинг — GitHub Pages.

Сайт после публикации: `https://michael-dyko.github.io/writing-craft/`

## Стек

- React 19 + TypeScript + Vite
- React Router
- База знаний: markdown в `content/notes` и `content/exercises`
- GitHub Actions → GitHub Pages

Отдельной базы данных нет. Позже поверх тех же файлов можно посадить локальную CMS.

## Локальный запуск

Нужен Node 20+.

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## База знаний

```text
content/
  notes/        темы / теория
  exercises/    упражнения, вынесенные из тем
```

Оси тегов (можно комбинировать в фильтрах):

- `module` — модуль (главная полка)
- `areas` — область
- `tasks` — задача
- `genres` — жанр
- `stages` — этап работы

В теме упражнение вставляется так:

```text
:::exercise slug-uprazhneniya:::
```

У файла упражнения поле `parent: notes/<slug-temy>`.

Читает контент только `src/lib/content`.

## GitHub Pages

1. **Settings → Pages → Source:** GitHub Actions
2. Пуш в `main`

Сборка идёт с `BASE_URL=/writing-craft/`. Для прямых ссылок SPA копируется `404.html`.
