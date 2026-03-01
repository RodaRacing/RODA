# Roda Racing Landing (React + Vite + TypeScript + Tailwind)

Landing one-page para captar clientes de **preparación de motos** con CTA a WhatsApp y estructura premium editable para Roda Racing.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS

## Ejecutar

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
```

## Variables editables (en `src/App.tsx`)

- `WHATSAPP_URL`: URL completa de WhatsApp (con mensaje pre-cargado si quieres).
- `CONTACT_EMAIL`: correo para enlace `mailto:`.
- `LOGO_PATH`: ruta del logo (por defecto `/roda-logo.svg`).

## Nuevo: Chat IA normativa ITV

Se añadió un apartado de chat en la landing (`#chat-itv`) que ofrece respuestas orientativas sobre si una actuación puede considerarse reforma, consultando una base normativa estructurada basada en:

- Manual de Reformas de Vehículos.
- Procedimiento de Inspección de Estaciones ITV.

Archivos clave:

- `src/components/ITVChat.tsx`: interfaz del chat + lógica de respuesta.
- `src/data/itvKnowledge.ts`: base de conocimiento normativa y enlaces oficiales.

> Importante: el chat es orientativo y no sustituye la validación oficial en ITV para el caso concreto.

## Logo incluido

- Se agregó `public/roda-logo.svg` y ya está integrado en navbar + footer.
- Si quieres usar tu archivo original en PNG/JPG, súbelo a `public/` y cambia `LOGO_PATH`.

## Cómo reemplazar fotos reales de proyectos

- En la sección `projects` de `src/App.tsx` ya tienes 6 bloques listos.
- Cambia los placeholders por `<img src="..." />` cuando tengas fotos finales.

## Estructura principal

- `src/App.tsx`: landing one-page completa.
- `src/components/ITVChat.tsx`: chat IA normativa ITV.
- `src/data/itvKnowledge.ts`: fuentes y base de conocimiento normativa.
- `src/index.css`: Tailwind + estilos base (incluye scroll suave en anclas).
- `tailwind.config.js`: configuración Tailwind.
- `postcss.config.js`: integración Tailwind/PostCSS.

## Notas

- Diseño responsive mobile-first.
- Estética oscuro/grafito con acentos rojos racing.
- Sin UI kits pesados.
