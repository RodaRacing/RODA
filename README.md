# Roda Racing Landing (React + Vite + TypeScript + Tailwind)

Landing one-page para captar clientes de **preparación de motos** con CTA a WhatsApp y estructura premium editable para Roda Racing.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Node + Express (API ITV para base documental compartida)

## Ejecutar (web + API)

```bash
npm install
npm run dev
```

Esto levanta:

- Frontend Vite en `http://localhost:5173`
- API ITV en `http://localhost:8787`

## Build de producción

```bash
npm run build
```

## Variables editables (en `src/App.tsx`)

- `WHATSAPP_URL`: URL completa de WhatsApp (con mensaje pre-cargado si quieres).
- `CONTACT_EMAIL`: correo para enlace `mailto:`.
- `LOGO_PATH`: ruta del logo (por defecto `/roda-logo.svg`).


## Segmento Trail/Touring Premium

Se añadió una sección específica con recomendaciones para motos trail y touring premium:

- enfoque por packs (Protection PRO, Touring Premium, Navigation & Utility),
- criterios de configuración por uso real,
- benchmark de patrones de mercado (catálogo por modelo, modularidad, confort/aerodinámica).

## Chat IA normativa ITV (con base persistida para todos los usuarios)

El chat `#chat-itv` ya no depende de subir PDFs en cada sesión:

- Los PDFs se suben una vez al backend.
- Se procesan y trocean.
- Se guardan en una base persistida en `server/data/itv-db.json`.
- Cualquier usuario consulta la misma base documental.


### Modo administrador (subida de PDFs)

El botón de subida ya no se muestra a usuarios normales.

Para verlo (solo administración):

- Añade `?admin=1` a la URL (ejemplo: `http://localhost:5173/?admin=1#chat-itv`), o
- En consola del navegador: `localStorage.setItem('itvAdminMode','1')` y recarga.

Para ocultarlo de nuevo: `localStorage.removeItem('itvAdminMode')`.

También puedes activar desde la interfaz con el botón **Acceso administración** dentro del chat.

- Clave por defecto: `roda-admin`
- Clave configurable por entorno: `VITE_ITV_ADMIN_KEY`

### Endpoints API

- `GET /api/itv/docs` → estado de documentos cargados.
- `POST /api/itv/upload` → subir PDFs (campo multipart: `pdfs`).
- `POST /api/itv/ask` → preguntar al asistente sobre reforma/no reforma.

## Estructura principal

- `src/App.tsx`: landing one-page completa.
- `src/components/ITVChat.tsx`: chat conectado a API compartida.
- `src/data/itvKnowledge.ts`: base normativa resumida + fuentes oficiales.
- `server/index.js`: API Express para carga/consulta de PDFs.
- `server/itvDb.js`: persistencia JSON de la base documental.
- `server/data/itv-db.json`: “base de datos” persistida (se crea automáticamente).

## Notas

- El chat ofrece respuestas orientativas; no sustituye validación oficial ITV.
- Diseño responsive mobile-first.
- Estética oscuro/grafito con acentos rojos racing.
- Sin UI kits pesados.
