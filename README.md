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

## Chat IA normativa ITV (funcionando con PDFs)

El apartado `#chat-itv` ahora permite **subir PDFs reales** y consultar su contenido en el navegador.

### Cómo usarlo

1. Entra al bloque “Chat ITV IA” de la landing.
2. Pulsa **Subir PDFs** y selecciona:
   - Manual de Reformas de Vehículos (PDF).
   - Procedimiento de Inspección de Estaciones ITV (PDF).
3. Haz tu pregunta (ejemplo: “¿Cambiar el escape se considera reforma?”).
4. El chat devolverá:
   - veredicto orientativo,
   - coincidencias en base resumida oficial,
   - coincidencias encontradas en tus PDFs (con referencia de página).

### Dónde subir los PDFs

No necesitas subirlos al servidor: se cargan desde el propio chat y se procesan localmente en el navegador.

## Archivos clave del chat ITV

- `src/components/ITVChat.tsx`: interfaz del chat, carga de PDF y lógica de búsqueda.
- `src/data/itvKnowledge.ts`: base normativa resumida + fuentes oficiales.

> Importante: el chat es orientativo y no sustituye la validación oficial en ITV para un caso concreto.

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
