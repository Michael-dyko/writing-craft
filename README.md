# Ремесло

Веб-приложение — база знаний по писательскому мастерству. Статический фронтенд на React, контент лежит в markdown-файлах и собирается вместе с сайтом. Хостинг — GitHub Pages.

Сайт после публикации: `https://michael-dyko.github.io/writing-craft/`

## Стек

- React 19 + TypeScript + Vite
- React Router (клиентские маршруты)
- База знаний: markdown с YAML-frontmatter в `content/`
- GitHub Actions → GitHub Pages

Отдельной базы данных нет. Приложение читает файлы на этапе сборки. Позже поверх тех же файлов можно посадить локальную CMS — слой `src/lib/content` для этого и отделён от UI.

## Локальный запуск

Нужен Node 20+.

```bash
npm install
npm run dev
```

Сборка и проверка продакшен-бандла:

```bash
npm run build
npm run preview
```

## База знаний

Заметки живут здесь:

```text
content/
  techniques/   приёмы
  exercises/    упражнения
  glossary/     словарь
  articles/     статьи
```

Каждый файл — markdown. Вверху обязательны поля (это не строгий YAML: двоеточия в тексте можно не экранировать):

```yaml
---
title: Показывать, а не рассказывать
slug: show-dont-tell          # можно не писать: возьмётся имя файла
summary: Коротко, зачем эта заметка.
tags: [описание, сцена]
category: сцена
difficulty: beginner          # beginner | intermediate | advanced
related:                      # id вида раздел/slug или просто slug
  - exercises/gesture-instead-of-adjective
order: 10
draft: false                  # true — видно только в dev
---
```

Дальше обычный markdown. После сохранения страница обновляется в `npm run dev`.

Читает контент только `src/lib/content`. Страницы не импортируют файлы напрямую: когда понадобится CMS, меняется этот слой, а не весь UI.

## GitHub Pages

В репозитории уже есть workflow: `.github/workflows/pages.yml`.

Один раз в настройках репозитория:

1. **Settings → Pages → Build and deployment → Source:** GitHub Actions
2. Запушьте `main`

Actions соберёт сайт с `BASE_URL=/writing-craft/` и выложит артефакт. Для SPA после сборки копируется `404.html`, чтобы прямые ссылки вроде `/techniques/show-dont-tell` открывались.

Если появится свой домен и корень сайта станет `/`, в workflow уберите `BASE_URL` или поставьте `/`.

## Что дальше с CMS

Сейчас правки — это правки файлов в `content/`. Этого достаточно, чтобы принять вашу папку с материалами и разложить её по полкам.

Когда захочется редактировать базу локально в UI, разумный следующий шаг — **Keystatic** (или Decap CMS) поверх тех же markdown-файлов и того же frontmatter. Схему полей не придётся выдумывать заново: она уже зафиксирована в `src/lib/content/schema.ts`.
