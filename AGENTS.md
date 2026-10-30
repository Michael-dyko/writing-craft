# AGENTS.md

Статический сайт «Ремесло» — база знаний по писательскому мастерству. Хостинг: GitHub Pages. Интерфейс и контент — на русском.

## Стек

React 19, TypeScript, Vite, React Router. Алиас `@/` → `src/`. Стили — CSS-модули и токены в `src/styles/`. Сервера, API и базы данных нет и не добавлять, пока явно не попросят.

## База знаний

Контент — markdown в `content/<коллекция>/`, шапка с полями. Это не строгий YAML: двоеточия в тексте можно не экранировать. Контракт полей: `src/lib/content/schema.ts`.

Обязательные поля: `title`, `summary`. Остальные: `slug`, `tags`, `category`, `difficulty` (`beginner | intermediate | advanced`), `related`, `order`, `draft`.

Читать файлы имеет право только `src/lib/content`. Страницы и компоненты берут данные через `getEntries` / `getEntry` / `searchEntries`. Не импортировать markdown из UI.

Черновики (`draft: true`) видны в `npm run dev`, в продакшен-сборке скрыты.

## Коллекции

Сейчас: `techniques`, `exercises`, `glossary`, `articles`. Новая полка = папка в `content/` + запись в `COLLECTIONS` + подписи в `src/lib/content/labels.ts`. Маршруты уже универсальные: `/:collectionId` и `/:collectionId/:slug`.

## GitHub Pages

Workflow: `.github/workflows/pages.yml`. В CI `BASE_URL=/writing-craft/`. После сборки `dist/index.html` копируется в `dist/404.html` — это нужно для прямых ссылок SPA. Не переключать на HashRouter без причины. Не ломать `basename` у роутера.

## CMS (потом)

Редактирование сейчас — правки файлов в `content/`. Когда понадобится локальный UI, сажать CMS (предпочтительно Keystatic) поверх тех же файлов и той же схемы. Не заводить параллельный формат контента.

## UI

Типографика важнее декорa. Не тащить UI-кит «по умолчанию». Сохранять тёплую бумажную палитру и шрифты Fraunces / Source Serif 4 / Source Sans 3. Тексты интерфейса — русские.

## Команды

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build    # tsc + vite; должен проходить перед PR
npm run preview
```

Node 20+. Коммитить и пушить только если попросили.