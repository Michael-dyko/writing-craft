# AGENTS.md

Статический сайт «Ремесло» — база знаний по писательскому мастерству. Хостинг: GitHub Pages. Интерфейс и контент — на русском.

## Стек

React 19, TypeScript, Vite, React Router. Алиас `@/` → `src/`. Стили — CSS-модули и токены в `src/styles/`. Сервера, API и базы данных нет и не добавлять, пока явно не попросят.

## База знаний

Две коллекции:

- `content/notes/` — темы / теория
- `content/exercises/` — упражнения, вынесенные из тем

Контракт полей: `src/lib/content/schema.ts`. Обязательные: `title`, `summary`. Оси тегов: `module`, `areas`, `tasks`, `genres`, `stages`. У упражнения есть `parent: notes/<slug>`.

В теле темы упражнения вставляются маркером:

```text
:::exercise slug-uprazhneniya:::
```

`NoteBody` подставляет карточку упражнения на этом месте. То же упражнение доступно по `/exercises/<slug>`.

Читать файлы имеет право только `src/lib/content`. Не импортировать markdown из UI.

Повторные темы с похожими названиями не сливать и не удалять без явной просьбы: это разный текст.

## Коллекции

Новая полка = папка в `content/` + запись в `COLLECTIONS` + пункт в `collectionNav`. Маршруты: `/:collectionId` и `/:collectionId/:slug`.

Если снова придёт Notion-экспорт, конвертер: `python3 scripts/ingest-writing.py` (ожидает `content/Writing`).

## GitHub Pages

Workflow: `.github/workflows/pages.yml`. В CI `BASE_URL=/writing-craft/`. После сборки копируется `dist/404.html`. Не переключать на HashRouter без причины.

## CMS (потом)

Править markdown в `content/`. CMS сажать на те же файлы и ту же схему осей. Не заводить параллельный формат.

## UI

Типографика важнее декора. Не тащить UI-кит «по умолчанию». Бумажная палитра, шрифты Fraunces / Source Serif 4 / Source Sans 3. Тексты интерфейса — русские.

## Команды

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

Node 20+. Коммитить и пушить только если попросили.
