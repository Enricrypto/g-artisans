# G·Artisans — Technical Requirements Document
## Landing Page · Captación de Productores Fundadores

| | |
|---|---|
| **Versión** | v1.1 — Junio 2026 |
| **Preparado por** | Enrique Ibarra & Antonio Rapozo |
| **Para** | Alternative Green Energy Holdco S.L. · G·Artisans |
| **Stack** | Next.js 14 · Vercel · Airtable · Resend |
| **Idiomas** | Español (principal) · Inglés (secundario) |
| **Estado** | Draft — Pendiente de aprobación del cliente |

---

## Changelog

| Versión | Fecha | Cambios |
|---|---|---|
| v1.0 | Junio 2026 | Versión inicial |
| v1.1 | Junio 2026 | Añadidos: esquema Airtable, especificación de APIs, seguridad, páginas legales, tipografía y tokens de diseño, estructura i18n, gestión de errores, Git workflow, staging, 404, /apply/success |

---

## Índice

1. [Introducción y contexto](#1-introducción-y-contexto)
2. [Arquitectura de páginas](#2-arquitectura-de-páginas)
3. [Formulario de solicitud de productor](#3-formulario-de-solicitud-de-productor)
4. [Especificación de APIs](#4-especificación-de-apis)
5. [Base de datos — Airtable](#5-base-de-datos--airtable)
6. [Email — Resend](#6-email--resend)
7. [SEO y GEO](#7-seo-y-geo)
8. [Analytics y seguimiento](#8-analytics-y-seguimiento)
9. [Internacionalización (ES / EN)](#9-internacionalización-es--en)
10. [Diseño — Tokens y tipografía](#10-diseño--tokens-y-tipografía)
11. [Componentes compartidos](#11-componentes-compartidos)
12. [Páginas legales](#12-páginas-legales)
13. [Páginas de estado](#13-páginas-de-estado)
14. [Diseño responsive y accesibilidad](#14-diseño-responsive-y-accesibilidad)
15. [Seguridad](#15-seguridad)
16. [Infraestructura y despliegue](#16-infraestructura-y-despliegue)
17. [Entregables y criterios de aceptación](#17-entregables-y-criterios-de-aceptación)
18. [Fuera de alcance — v1](#18-fuera-de-alcance--v1)

---

## 1. Introducción y contexto

La landing page de G·Artisans es la primera pieza de comunicación pública del proyecto. Su objetivo es captar los 50 productores fundadores que formarán la base del marketplace cuando se construya en la Fase 2.

No es una web genérica. Es una herramienta de captación con marca propia, mensaje claro y un sistema que convierta visitas en solicitudes de productores reales. La plataforma está dirigida a productores de toda la Unión Europea, con el mercado español como punto de entrada principal. La web se construye en español e inglés desde el primer día.

### 1.1 Objetivos del proyecto

- Establecer la presencia digital de G·Artisans antes del lanzamiento del marketplace, con alcance a toda la Unión Europea
- Captar un mínimo de 50 productores fundadores registrados mediante formulario de solicitud
- Comunicar claramente la propuesta de valor de la plataforma a productores sostenibles
- Posicionar G·Artisans en búsquedas orgánicas y en respuestas de IA (GEO) desde el día uno
- Recoger datos estructurados de productores interesados para el proceso de onboarding

### 1.2 Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js con App Router | 14.x |
| Lenguaje | TypeScript | 5.x |
| Estilos | Tailwind CSS | 3.x |
| Hosting | Vercel | — |
| Base de datos | Airtable | REST API v0 |
| Email | Resend | 3.x |
| i18n | next-intl | 3.x |
| Analytics | Google Analytics 4 | — |
| Fuentes | Cormorant Garamond + Jost | Google Fonts |
| Iconos | Lucide React | latest |
| Formularios | React Hook Form + Zod | latest |
| Dominio | A confirmar por el cliente | — |

### 1.3 Estructura del proyecto

```
g-artisans/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Homepage
│   │   ├── about/page.tsx
│   │   ├── artisans/page.tsx
│   │   ├── marketplace/page.tsx
│   │   ├── apply/
│   │   │   ├── page.tsx
│   │   │   └── success/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── privacidad/page.tsx
│   │   ├── aviso-legal/page.tsx
│   │   └── cookies/page.tsx
│   ├── api/
│   │   ├── apply/route.ts
│   │   ├── contact/route.ts
│   │   ├── spots/route.ts
│   │   └── notify/route.ts           # Marketplace email waitlist
│   ├── globals.css
│   └── layout.tsx                    # Root layout
├── components/
│   ├── ui/                           # Primitivos reutilizables
│   ├── sections/                     # Secciones de página
│   ├── forms/                        # Formularios
│   └── layout/                       # Header, Footer, etc.
├── messages/
│   ├── es.json
│   └── en.json
├── lib/
│   ├── airtable.ts
│   ├── resend.ts
│   ├── validations.ts
│   └── utils.ts
├── middleware.ts                     # next-intl routing
├── i18n.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── .env.local                        # Ver sección 16
```

### 1.4 Variables de entorno

Todas las variables de entorno deben estar configuradas en Vercel (Production, Preview y Development).

```bash
# Airtable
AIRTABLE_API_KEY=pat_xxxxxxxxxxxx
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=hola@g-artisans.com
RESEND_INTERNAL_EMAIL=equipo@g-artisans.com

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# App
NEXT_PUBLIC_APP_URL=https://g-artisans.com
NEXT_PUBLIC_MAX_SPOTS=50
```

> **Seguridad:** Las variables sin prefijo `NEXT_PUBLIC_` son exclusivamente server-side y nunca se exponen al cliente. Nunca commitear `.env.local` al repositorio. El archivo `.env.example` con las claves vacías sí se versiona.

---

## 2. Arquitectura de páginas

La web consta de 6 páginas públicas + 3 páginas legales + 2 páginas de estado, más los componentes compartidos.

### Mapa del sitio completo

```
/                       →  Homepage (ES)
/en                     →  Homepage (EN)

/about                  →  Sobre G·Artisans (ES)
/en/about               →  About G·Artisans (EN)

/artisans               →  Productores & Artesanos (ES)
/en/artisans            →  Artisans & Producers (EN)

/marketplace            →  El Marketplace - próximamente (ES)
/en/marketplace         →  The Marketplace - coming soon (EN)

/apply                  →  Formulario de solicitud (ES) ⭐
/apply/success          →  Confirmación de envío (ES)
/en/apply               →  Application form (EN) ⭐
/en/apply/success       →  Application submitted (EN)

/contact                →  Contacto (ES)
/en/contact             →  Contact (EN)

/privacidad             →  Política de privacidad (ES)
/en/privacy             →  Privacy Policy (EN)
/aviso-legal            →  Aviso legal (ES)
/en/legal               →  Legal notice (EN)
/cookies                →  Política de cookies (ES)
/en/cookies             →  Cookie Policy (EN)

/404                    →  Página no encontrada
/500                    →  Error del servidor
```

---

### 2.1 Homepage ( `/` )

**Meta SEO:**
- Title ES: `G·Artisans — Marketplace de productores sostenibles Made in Europe`
- Title EN: `G·Artisans — Sustainable Artisan Marketplace Made in Europe`
- Description ES: `Únete a G·Artisans, la plataforma de referencia para productores sostenibles y artesanos europeos. Distribuye tus productos a compradores que valoran lo auténtico.`
- Description EN: `Join G·Artisans, the reference platform for sustainable producers and European artisans. Reach buyers who value authentic, handmade products.`

**Secciones en orden:**

#### Hero
| Campo | Detalle |
|---|---|
| Contenido | Headline + subheadline + CTA primario + imagen o ilustración hero |
| Headline ES | `Tu taller, en el escaparate que merece.` |
| Headline EN | `Your craft, in the marketplace it deserves.` |
| CTA primario | `Quiero ser productor` / `I want to join` → `/apply` |
| CTA secundario | `Saber más` / `Learn more` → ancla a sección Cómo funciona |
| Mobile | Imagen reducida, texto centrado, CTAs full-width apilados |
| Animación | `fade-in` de 300ms en texto. Sin animaciones pesadas. |
| LCP | La imagen hero debe ser el LCP. Usar `priority` en `next/image`. |

#### Cómo funciona
| Campo | Detalle |
|---|---|
| Pasos | 1. Te registras · 2. Verificamos tu producción · 3. Tu tienda está activa · 4. Vendes |
| Formato | Step cards: número de paso + icono + título + descripción corta (máx. 2 líneas) |
| Ancla HTML | `id="como-funciona"` para el CTA secundario del hero |

#### Social proof
| Campo | Detalle |
|---|---|
| Contenido | 2–3 testimonios de productores (quotes + nombre + categoría) |
| Formato | Cards con avatar circular, nombre, categoría y cita en comillas |
| Fallback v1 | Si no hay testimonios reales: estadísticas del sector sostenible en España con fuente citada |

#### Features — Por qué G·Artisans
| Campo | Detalle |
|---|---|
| Features | Distribución digital · Verificación de sostenibilidad · Panel propio · Pagos automatizados · Visibilidad SEO y GEO · Comunidad de productores europeos |
| Formato | Grid 2×3 en desktop, columna única en mobile. Icono Lucide + título + descripción ≤ 2 líneas. |

#### About (bloque)
| Campo | Detalle |
|---|---|
| Contenido | Párrafo de misión (≤ 3 líneas) + imagen o ilustración de fondo |
| CTA | `Conoce el proyecto` / `Learn more about us` → `/about` |

#### FAQs
| Campo | Detalle |
|---|---|
| Formato | Acordeón accesible (expand/collapse con ARIA) |
| Preguntas mínimas | 8 preguntas orientadas al productor (ver listado en sección 2.1.1) |
| Schema | `FAQPage` Schema markup — requisito de aceptación |
| Ancla HTML | `id="faqs"` |

##### 2.1.1 FAQs — Listado inicial

Las preguntas están redactadas para responder exactamente las queries que un productor haría a una IA (GEO). Deben responder también a las preguntas más frecuentes de productores en la UE.

**ES:**
1. ¿Cuánto cuesta unirme a G·Artisans como productor?
2. ¿Qué tipo de productores y artesanos acepta G·Artisans?
3. ¿Cómo funciona el proceso de verificación de sostenibilidad?
4. ¿Puedo unirme si soy productor de otro país de la UE?
5. ¿Cuándo se lanza el marketplace para compradores?
6. ¿Qué comisión cobra G·Artisans por cada venta?
7. ¿Qué pasa con mis datos al registrarme?
8. ¿Puedo darme de baja una vez registrado?

**EN:**
1. How much does it cost to join G·Artisans as a producer?
2. What type of producers and artisans does G·Artisans accept?
3. How does the sustainability verification process work?
4. Can I join if I am a producer from another EU country?
5. When does the marketplace launch for buyers?
6. What commission does G·Artisans charge per sale?
7. What happens to my data when I register?
8. Can I unsubscribe after registering?

---

### 2.2 Página About ( `/about` )

**Meta SEO:**
- Title ES: `Sobre G·Artisans — La plataforma sostenible Made in Europe`
- Title EN: `About G·Artisans — The sustainable Made in Europe platform`
- Description ES: `Conoce la historia, misión y valores de G·Artisans. Una plataforma creada para dar distribución digital a los mejores productores sostenibles de Europa.`
- Description EN: `Discover the story, mission and values of G·Artisans. A platform created to give digital distribution to Europe's best sustainable producers.`

| Sección | Contenido |
|---|---|
| Hero interior | Imagen de fondo + headline de misión |
| Misión y visión | 2 párrafos: qué es G·Artisans y a dónde va |
| Historia | Origen del proyecto, por qué existe |
| El equipo | Foto + nombre + rol (placeholder hasta recibir datos del cliente) |
| Valores | Grid de 4–6 valores con icono e descripción corta |
| CTA final | `Únete como productor` / `Join as a producer` → `/apply` |

---

### 2.3 Página Artisans ( `/artisans` )

**Meta SEO:**
- Title ES: `Artesanos y productores sostenibles europeos — G·Artisans`
- Title EN: `European sustainable artisans and producers — G·Artisans`
- Description ES: `Descubre las categorías de productores de G·Artisans: moda sostenible, cuero, joyería, cerámica, cosmética natural y mucho más. Made in Europe.`
- Description EN: `Discover G·Artisans producer categories: sustainable fashion, leather, jewellery, ceramics, natural cosmetics and more. Made in Europe.`

| Sección | Contenido |
|---|---|
| Hero interior | Headline + descripción del tipo de productor ideal |
| Grid de categorías | 7 categorías con avatar + nombre + descripción corta |
| Perfil del productor ideal | Quién encaja en G·Artisans (checklist visual) |
| Beneficios para el productor | Lista de ventajas concretas |
| CTA | `¿Eres productor? Únete` / `Are you a producer? Join us` → `/apply` |

**Categorías:**

| Categoría ES | Categoría EN | Descripción ES |
|---|---|---|
| Moda sostenible | Sustainable fashion | Mujer, hombre, niño, bebé, lencería, novia |
| Maestros del cuero | Leather masters | Bolsos, cinturones, calzado artesanal |
| Alpargatas | Espadrilles | Fabricantes tradicionales de esparto |
| Joyería artesanal | Artisan jewellery | Plata, piedras naturales, técnicas tradicionales |
| Cerámica artesana | Artisan ceramics | Vajilla, decoración, piezas únicas |
| Cosmética natural | Natural cosmetics | Orgánica, tintes, tratamientos sin químicos |
| Hogar sostenible | Sustainable home | Ropa de cama, decoración, mobiliario eco |

---

### 2.4 Página Marketplace ( `/marketplace` )

**Meta SEO:**
- Title ES: `Marketplace sostenible Made in Europe — G·Artisans (Próximamente)`
- Title EN: `Sustainable Marketplace Made in Europe — G·Artisans (Coming Soon)`
- Description ES: `El marketplace de referencia para productos sostenibles y artesanales europeos. Próximamente en G·Artisans.`
- Description EN: `The reference marketplace for sustainable and handmade European products. Coming soon to G·Artisans.`

| Sección | Contenido |
|---|---|
| Hero | Badge `Próximamente` / `Coming Soon` + headline + descripción |
| Qué será | 3–4 features clave del marketplace futuro |
| Categorías preview | Grid de categorías (mismo componente que /artisans) |
| Formulario waitlist | Email → Airtable tabla `Compradores_Interesados` |
| CTA productores | `¿Eres productor? Únete ahora` → `/apply` |

> **Nota:** No mostrar precios, comisiones ni fechas exactas de lanzamiento. Sólo información confirmada.

---

### 2.5 Página Apply ( `/apply` ) ⭐

**Meta SEO:**
- Title ES: `Únete como productor fundador — G·Artisans`
- Title EN: `Join as a founding producer — G·Artisans`
- Description ES: `Solicita tu plaza como uno de los 50 productores fundadores de G·Artisans. Plazas limitadas.`
- Description EN: `Apply for your spot as one of G·Artisans' 50 founding producers. Limited spots available.`

| Sección | Contenido |
|---|---|
| Hero interior | Headline motivador + descripción breve del proceso + contador de plazas |
| Formulario | Ver sección 3 — especificación completa |
| Sidebar desktop | Beneficios de ser productor fundador + icono de urgencia |
| Post-envío | Ver sección 2.7 — `/apply/success` |

**Contador de plazas disponibles:**

| Campo | Detalle |
|---|---|
| Fuente | `GET /api/spots` → devuelve `{ available: number, total: 50 }` |
| Display | `X de 50 plazas disponibles` / `X of 50 spots available` |
| Actualización | En cada carga de página (SSR). Sin polling en tiempo real. |
| Cache | Revalidar cada 60 segundos con ISR (`revalidate: 60`) |
| Fallback | Si la API falla: ocultar el contador. Nunca mostrar dato incorrecto. |
| Cierre | Si `available === 0`: ocultar formulario, mostrar mensaje de lista de espera |

---

### 2.6 Página Contact ( `/contact` )

**Meta SEO:**
- Title ES: `Contacto — G·Artisans`
- Title EN: `Contact — G·Artisans`
- Description ES: `Ponte en contacto con el equipo de G·Artisans para cualquier consulta sobre la plataforma.`
- Description EN: `Get in touch with the G·Artisans team for any questions about the platform.`

| Sección | Contenido |
|---|---|
| Hero interior | Título + descripción |
| Formulario | Nombre · Email · Asunto · Mensaje · Botón enviar |
| Información | Email directo visible + redes sociales |
| Tiempo respuesta | `Respondemos en 24–48 horas` / `We reply within 24–48 hours` |
| Destino | API `/api/contact` → email interno (no a Airtable) |

---

## 3. Formulario de solicitud de productor

El formulario de `/apply` es el elemento más crítico de la landing. Cada envío crea un registro en Airtable y dispara dos emails automáticos.

### 3.1 Campos del formulario

| Campo | ID en código | Tipo | Obligatorio | Validación |
|---|---|---|---|---|
| Nombre completo | `fullName` | text input | ✅ | Mín. 2 caracteres. Sólo letras, espacios y guiones. |
| Email | `email` | email input | ✅ | Formato RFC 5322 válido. |
| Teléfono | `phone` | tel input | ✅ | Formato E.164 internacional. Prefijo país seleccionable. |
| Web (si tiene) | `website` | url input | No | Si se rellena: debe empezar por `https://`. |
| Instagram | `instagram` | text input | No | Texto libre. Se normaliza quitando `@` antes de guardar. |
| Descripción del oficio | `craftDescription` | textarea | ✅ | Mín. 50 · Máx. 500 caracteres. Contador visible en tiempo real. |
| Categoría principal | `category` | select | ✅ | Ver opciones en 3.1.1 |
| País de producción | `country` | select | ✅ | Ver opciones en 3.1.2 |
| ¿Cómo nos conociste? | `referral` | select | No | Ver opciones en 3.1.3 |
| Acepto política de privacidad | `privacyAccepted` | checkbox | ✅ | Debe estar marcado. Enlaza a `/privacidad`. |
| _honeypot_ | `_gotcha` | hidden text | — | Si tiene valor, descartar silenciosamente el envío. |

##### 3.1.1 Opciones de categoría

```
moda          → Moda sostenible / Sustainable fashion
cuero         → Maestros del cuero / Leather masters
alpargatas    → Alpargatas / Espadrilles
joyeria       → Joyería artesanal / Artisan jewellery
ceramica      → Cerámica artesana / Artisan ceramics
cosmetica     → Cosmética natural / Natural cosmetics
hogar         → Hogar sostenible / Sustainable home
otra          → Otra / Other
```

##### 3.1.2 Opciones de país

```
ES → España / Spain
PT → Portugal
FR → Francia / France
IT → Italia / Italy
DE → Alemania / Germany
NL → Países Bajos / Netherlands
BE → Bélgica / Belgium
PL → Polonia / Poland
SE → Suecia / Sweden
DK → Dinamarca / Denmark
AT → Austria
FI → Finlandia / Finland
GR → Grecia / Greece
HU → Hungría / Hungary
CZ → República Checa / Czech Republic
RO → Rumanía / Romania
EU → Otro país UE / Other EU country
```

##### 3.1.3 Opciones de referral

```
instagram     → Instagram
google        → Google / Búsqueda online
recommendation → Recomendación de alguien / Word of mouth
press         → Prensa / Press
event         → Feria o evento / Fair or event
other         → Otro / Other
```

### 3.2 Validación con Zod

```typescript
// lib/validations.ts
import { z } from 'zod';

export const applySchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  website: z.string().url().optional().or(z.literal('')),
  instagram: z.string().max(50).optional(),
  craftDescription: z.string().min(50).max(500),
  category: z.enum(['moda','cuero','alpargatas','joyeria','ceramica','cosmetica','hogar','otra']),
  country: z.enum(['ES','PT','FR','IT','DE','NL','BE','PL','SE','DK','AT','FI','GR','HU','CZ','RO','EU']),
  referral: z.enum(['instagram','google','recommendation','press','event','other']).optional(),
  privacyAccepted: z.literal(true),
  _gotcha: z.string().max(0).optional(), // honeypot
});

export type ApplyFormData = z.infer<typeof applySchema>;
```

### 3.3 Comportamiento del formulario

| Aspecto | Especificación |
|---|---|
| Librería | React Hook Form + Zod resolver |
| Validación client-side | `onChange` + `onBlur`. Mensajes de error inline bajo cada campo. |
| Validación server-side | Zod en API route antes de escribir en Airtable |
| Envío | `POST /api/apply` · Content-Type: `application/json` · Sin recarga de página |
| Loading state | Botón deshabilitado + spinner (`aria-busy="true"`) durante el envío |
| Éxito | Mostrar mensaje inline de éxito + redirección a `/apply/success` a los 2 segundos |
| Error 400 | Mostrar mensajes de validación específicos por campo |
| Error 429 | Mostrar mensaje: `Has enviado demasiadas solicitudes. Por favor, espera unos minutos.` |
| Error 500 | Mostrar mensaje genérico + email de contacto como alternativa |
| Anti-spam | Honeypot field `_gotcha` oculto con CSS (no `display:none`, no `visibility:hidden` — usar `position: absolute; left: -9999px`) |
| Rate limiting | Máx. 3 envíos por IP por hora (ver sección 4.1) |

### 3.4 Mensajes de error — i18n

Todos los mensajes de error deben estar en `messages/es.json` y `messages/en.json`.

```json
// Ejemplo messages/es.json — sección formulario
{
  "form": {
    "errors": {
      "fullName": {
        "required": "El nombre es obligatorio",
        "min": "El nombre debe tener al menos 2 caracteres"
      },
      "email": {
        "required": "El email es obligatorio",
        "invalid": "Introduce un email válido"
      },
      "phone": {
        "required": "El teléfono es obligatorio",
        "invalid": "Introduce un teléfono válido"
      },
      "craftDescription": {
        "required": "Describe tu oficio",
        "min": "La descripción debe tener al menos 50 caracteres",
        "max": "La descripción no puede superar los 500 caracteres"
      },
      "category": { "required": "Selecciona una categoría" },
      "country": { "required": "Selecciona tu país de producción" },
      "privacyAccepted": { "required": "Debes aceptar la política de privacidad" },
      "generic": "Ha ocurrido un error. Por favor, inténtalo de nuevo o escríbenos a hola@g-artisans.com",
      "rateLimit": "Has enviado demasiadas solicitudes. Por favor, espera unos minutos."
    },
    "submit": "Enviar solicitud",
    "submitting": "Enviando...",
    "success": "¡Solicitud enviada con éxito! Te redirigimos en unos segundos."
  }
}
```

---

## 4. Especificación de APIs

### 4.1 `POST /api/apply`

Recibe la solicitud del formulario de productor, valida los datos, guarda en Airtable y dispara los emails.

**Request:**
```
POST /api/apply
Content-Type: application/json

{
  "fullName": "María García",
  "email": "maria@taller.es",
  "phone": "+34612345678",
  "website": "https://mariagarcia.es",
  "instagram": "@mariaceramica",
  "craftDescription": "Ceramista con 10 años de experiencia...",
  "category": "ceramica",
  "country": "ES",
  "referral": "instagram",
  "privacyAccepted": true,
  "_gotcha": ""
}
```

**Responses:**

| Código | Situación | Body |
|---|---|---|
| `200` | Solicitud guardada y emails enviados | `{ "success": true, "id": "recXXXXXX" }` |
| `400` | Validación fallida | `{ "success": false, "errors": { "campo": "mensaje" } }` |
| `429` | Rate limit superado | `{ "success": false, "error": "Too many requests" }` |
| `500` | Error interno | `{ "success": false, "error": "Internal server error" }` |

**Lógica interna:**
```
1. Verificar honeypot (_gotcha vacío)
2. Rate limit check (3 req/hora por IP)
3. Validar body con Zod (applySchema)
4. Verificar si las plazas están disponibles (spots < MAX_SPOTS)
5. Crear registro en Airtable tabla Productores_Solicitudes
6. Enviar email de confirmación al productor (Resend)
7. Enviar email de notificación interna (Resend)
8. Responder 200
```

---

### 4.2 `GET /api/spots`

Devuelve el número de plazas disponibles.

**Response:**
```json
{
  "available": 37,
  "total": 50,
  "full": false
}
```

| Código | Situación |
|---|---|
| `200` | OK |
| `500` | Error consultando Airtable |

**Cache:** ISR `revalidate: 60` segundos.

---

### 4.3 `POST /api/contact`

Recibe el formulario de contacto general y envía un email interno.

**Request:**
```json
{
  "name": "Juan López",
  "email": "juan@email.com",
  "subject": "Consulta sobre el marketplace",
  "message": "Hola, me gustaría saber más sobre..."
}
```

**Responses:**

| Código | Situación |
|---|---|
| `200` | Email enviado |
| `400` | Validación fallida |
| `429` | Rate limit (máx. 5 req/hora por IP) |
| `500` | Error interno |

---

### 4.4 `POST /api/notify`

Registra emails de compradores interesados en el marketplace (desde `/marketplace`).

**Request:**
```json
{
  "email": "comprador@email.com",
  "locale": "es"
}
```

**Responses:**

| Código | Situación |
|---|---|
| `200` | Email guardado en Airtable `Compradores_Interesados` |
| `400` | Email inválido |
| `409` | Email ya registrado |
| `429` | Rate limit |
| `500` | Error interno |

---

## 5. Base de datos — Airtable

### 5.1 Base: `G-Artisans-Landing`

#### Tabla: `Productores_Solicitudes`

| Nombre del campo | Tipo Airtable | Obligatorio | Notas |
|---|---|---|---|
| `Nombre` | Single line text | ✅ | `fullName` del formulario |
| `Email` | Email | ✅ | |
| `Telefono` | Phone number | ✅ | Formato E.164 |
| `Web` | URL | No | |
| `Instagram` | Single line text | No | Sin @ (normalizado) |
| `Descripcion_Oficio` | Long text | ✅ | |
| `Categoria` | Single select | ✅ | Opciones: moda, cuero, alpargatas, joyeria, ceramica, cosmetica, hogar, otra |
| `Pais` | Single select | ✅ | Códigos ISO 3166-1 alpha-2 |
| `Como_Nos_Conocio` | Single select | No | |
| `Estado` | Single select | ✅ | Pendiente / Aprobado / Rechazado / En revisión |
| `Idioma_Formulario` | Single select | ✅ | es / en |
| `Fecha_Solicitud` | Date | ✅ | Auto: timestamp de creación |
| `IP_Hash` | Single line text | — | Hash SHA-256 de la IP. No se guarda la IP en claro. |
| `Notas_Internas` | Long text | No | Para uso del equipo G·Artisans |

**Valor por defecto de `Estado`:** `Pendiente`

#### Tabla: `Compradores_Interesados`

| Nombre del campo | Tipo Airtable | Notas |
|---|---|---|
| `Email` | Email | |
| `Idioma` | Single select | es / en |
| `Fecha_Registro` | Date | Auto |

### 5.2 Rate limiting y Airtable

La API de Airtable tiene un límite de **5 peticiones/segundo por base**. Para evitar errores 429:

- Implementar retry con backoff exponencial (máx. 3 intentos)
- No hacer múltiples llamadas concurrentes a Airtable desde la misma route
- Cachear la respuesta de `/api/spots` con ISR (60s)

```typescript
// lib/airtable.ts — ejemplo retry
async function airtableRequest(fn: () => Promise<any>, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      if (err.statusCode === 429 && i < retries - 1) {
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
        continue;
      }
      throw err;
    }
  }
}
```

---

## 6. Email — Resend

### 6.1 Configuración

| Campo | Valor |
|---|---|
| Proveedor | Resend |
| Dominio remitente | `g-artisans.com` (requiere verificación DNS) |
| From producer | `G·Artisans <hola@g-artisans.com>` |
| From internal | `G·Artisans <no-reply@g-artisans.com>` |
| Reply-to | `hola@g-artisans.com` |

### 6.2 Email de confirmación al productor

**ES:**
- Asunto: `Tu solicitud en G·Artisans ha sido recibida ✓`

**EN:**
- Asunto: `Your G·Artisans application has been received ✓`

Contenido mínimo:
- Confirmación de recepción con nombre del productor
- Resumen de los datos enviados (nombre, email, categoría, país)
- Próximos pasos: "Revisaremos tu solicitud y te contactaremos en los próximos 5–7 días hábiles"
- Email de contacto en caso de duda
- Firma con logo G·Artisans

### 6.3 Email de notificación interna

- Asunto: `Nueva solicitud de productor: {Nombre} — {Categoría} — {País}`
- Todos los campos del formulario en formato legible
- Enlace directo al registro en Airtable
- Fecha y hora de envío
- Idioma en que se completó el formulario

### 6.4 Email de waitlist (compradores)

**ES:**
- Asunto: `Te avisaremos cuando G·Artisans abra sus puertas`

**EN:**
- Asunto: `We'll let you know when G·Artisans opens`

---

## 7. SEO y GEO

### 7.1 SEO técnico

| Elemento | Especificación |
|---|---|
| Meta tags | Title + description únicos por página y por idioma. Open Graph completo. Twitter Card. |
| Schema markup | `Organization` (homepage) · `FAQPage` (FAQs) · `WebSite` con `SearchAction` · `BreadcrumbList` en páginas interiores |
| Sitemap | `sitemap.xml` autogenerado con `next-sitemap`. Incluye URLs ES y EN. Excluye `/api/` y páginas de estado. |
| robots.txt | `Allow: /` excepto `Disallow: /api/` · `Sitemap: https://g-artisans.com/sitemap.xml` |
| Canonical | Auto-generadas por Next.js. Español: `https://g-artisans.com/artisans`. Inglés: `https://g-artisans.com/en/artisans`. |
| Core Web Vitals | LCP < 2.5s · FID/INP < 200ms · CLS < 0.1 |
| Imágenes | `next/image` con `sizes` y `priority` en LCP. WebP por defecto. |
| Fuentes | `next/font/google` con `display: swap`. Preload de Cormorant Garamond y Jost. |

### 7.2 Open Graph por página

```typescript
// Ejemplo homepage — app/[locale]/layout.tsx o page.tsx
export const metadata: Metadata = {
  title: 'G·Artisans — Marketplace de productores sostenibles Made in Europe',
  description: 'Únete a G·Artisans...',
  openGraph: {
    title: 'G·Artisans — Marketplace de productores sostenibles Made in Europe',
    description: 'Únete a G·Artisans...',
    url: 'https://g-artisans.com',
    siteName: 'G·Artisans',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'G·Artisans' }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'G·Artisans',
    description: '...',
    images: ['/og-image.jpg'],
  },
};
```

La imagen OG (`/og-image.jpg`) debe ser 1200×630px con la marca aplicada. Una por idioma si es posible.

### 7.3 Keywords principales

| Tipo | Keywords |
|---|---|
| Primarias ES | "marketplace productores sostenibles España" · "plataforma artesanos sostenibles" · "vender productos artesanales online España" |
| Primarias EN | "sustainable artisan marketplace Europe" · "handmade sustainable marketplace EU" · "sell handmade products online Europe" |
| Long tail ES | "cómo vender productos artesanales España" · "marketplace moda sostenible España" |
| Long tail EN | "how to sell handmade products online Europe" · "sustainable fashion marketplace EU" |
| GEO ES | "marketplace sostenible España recomendado" · "mejor plataforma artesanos sostenibles España" |
| GEO EN | "best sustainable artisan marketplace Europe" · "EU handmade marketplace recommendation" |

### 7.4 GEO — Generative Engine Optimization

Objetivo: aparecer como respuesta cuando alguien pregunta a ChatGPT, Perplexity o Google AI Overviews sobre marketplaces sostenibles en España o Europa.

| Estrategia | Implementación |
|---|---|
| Respuestas directas | Las FAQs responden preguntas exactas que haría un artesano a una IA, en primera persona |
| Autoridad temática | Página `/artisans` con contenido semántico rico sobre cada categoría. Descripción detallada de qué hace cada tipo de productor. |
| Datos citables | Incluir estadísticas del sector sostenible en España/UE con fuentes (para que los LLMs puedan citar a G·Artisans) |
| Estructura | Contenido con `h2`, `h3` claros, listas y tablas — los LLMs leen HTML estructurado |
| Cobertura geográfica | Mencionar explícitamente "España", "Europa", "Unión Europea", "Made in Europe" en textos clave |

---

## 8. Analytics y seguimiento

### 8.1 Google Analytics 4

| Campo | Detalle |
|---|---|
| Propiedad | Nueva propiedad GA4 para `g-artisans.com` |
| Implementación | `@next/third-parties/google` — carga diferida, no bloquea render |
| Consentimiento | GA4 se inicializa sólo si el usuario acepta cookies de analítica (cookie banner) |

**Eventos personalizados a implementar:**

| Evento | Trigger | Parámetros |
|---|---|---|
| `form_start` | Usuario interactúa con el primer campo de `/apply` | `form_id: 'apply'` |
| `form_submit` | Usuario pulsa "Enviar solicitud" | `form_id: 'apply'` |
| `form_success` | API devuelve 200 | `form_id: 'apply', category, country` |
| `form_error` | API devuelve error | `form_id: 'apply', error_type` |
| `cta_click` | Click en cualquier botón CTA principal | `cta_text, cta_location` |
| `language_switch` | Usuario cambia de ES a EN o viceversa | `from_locale, to_locale` |
| `waitlist_signup` | Email registrado en `/marketplace` | — |
| `faq_expand` | Usuario abre una FAQ | `faq_question` |

**Conversiones:**
- Principal: `form_success` en `/apply`
- Secundaria: `waitlist_signup` en `/marketplace`

### 8.2 Google Search Console

| Campo | Detalle |
|---|---|
| Verificación | Meta tag `google-site-verification` en `<head>` del layout raíz |
| Sitemap | Enviado en go-live: `https://g-artisans.com/sitemap.xml` |
| Monitorización | Posiciones de keywords · Errores de indexación · Core Web Vitals · Cobertura |

---

## 9. Internacionalización (ES / EN)

### 9.1 Estructura de URLs

| Idioma | URLs |
|---|---|
| Español (defecto) | `/` · `/about` · `/artisans` · `/marketplace` · `/apply` · `/apply/success` · `/contact` · `/privacidad` · `/aviso-legal` · `/cookies` |
| Inglés | `/en` · `/en/about` · `/en/artisans` · `/en/marketplace` · `/en/apply` · `/en/apply/success` · `/en/contact` · `/en/privacy` · `/en/legal` · `/en/cookies` |

### 9.2 Configuración de next-intl

**`i18n.ts`:**
```typescript
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}));
```

**`middleware.ts`:**
```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed', // ES en raíz, EN con prefijo /en
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

### 9.3 Estructura de archivos de traducción

```json
// messages/es.json — estructura
{
  "nav": {
    "home": "Inicio",
    "artisans": "Artesanos",
    "marketplace": "Marketplace",
    "about": "Sobre nosotros",
    "contact": "Contacto",
    "apply": "Únete como productor"
  },
  "home": {
    "hero": {
      "headline": "Tu taller, en el escaparate que merece.",
      "subheadline": "...",
      "cta_primary": "Quiero ser productor",
      "cta_secondary": "Saber más"
    },
    "how_it_works": { ... },
    "features": { ... },
    "faqs": { ... }
  },
  "apply": {
    "hero": { ... },
    "form": { ... },
    "success": { ... }
  },
  "form": {
    "fields": { ... },
    "errors": { ... }
  },
  "footer": { ... },
  "legal": { ... },
  "common": {
    "loading": "Cargando...",
    "error": "Ha ocurrido un error",
    "back": "Volver",
    "spots": "{available} de {total} plazas disponibles"
  }
}
```

### 9.4 Responsabilidades de traducción

| Contenido | Responsable |
|---|---|
| Textos de interfaz (labels, botones, errores, nav) | Equipo técnico |
| Textos editoriales (hero copy, about, artisans descriptions) | Cliente (G·Artisans) |
| FAQs en inglés | Cliente (G·Artisans) |
| Páginas legales en inglés | Cliente (con revisión legal) |
| Emails en inglés | Equipo técnico (con revisión del cliente) |

> **Blocker:** Los textos editoriales en inglés deben estar disponibles antes del inicio del sprint de desarrollo o el sitio se lanzará en español únicamente, con la versión inglesa en fase de staging hasta recibir el contenido.

---

## 10. Diseño — Tokens y tipografía

> Los valores de esta sección están definidos y aprobados en el brand book de G·Artisans. **No modificar sin aprobación del cliente.**

### 10.1 Logotipo

| Elemento | Especificación |
|---|---|
| Símbolo | Letra `G` en Cormorant Garamond 300, encerrada en un círculo con borde fino naranja (`#C4532A`) |
| Wordmark | `G·ARTISANS` en Cormorant Garamond 400, letter-spacing amplio (~6px), color `#1A2E20` |
| Tagline | `MADE IN EUROPE · SUSTAINABLE · HANDCRAFTED` en Jost 400 uppercase, letter-spacing 3px, color `#7A7A6E` |
| Versión completa | Símbolo + wordmark + tagline, apilados y centrados |
| Versión compacta | `G·ARTISANS` sin tagline (uso en header y footer) |
| Versión oscura | Símbolo y wordmark sobre fondo `#1A2E20`. Círculo en naranja `#C4532A`. Texto en `#F5F0E8`. |
| Versión clara | Símbolo con círculo en `#8A6820`. Texto `#1A2E20`. Sobre fondos claros o `#F5F0E8`. |
| Formato entrega | SVG (todas las variantes) + PNG 1x/2x/3x |
| Espacio mínimo | Padding igual al alto de la `G` en todos los lados |
| Uso incorrecto | No deformar, no cambiar colores, no añadir efectos, no usar sobre fondos que no contrasten |

### 10.2 Paleta de colores

Paleta de 6 colores definida. Concepto: **Brasil vintage** — naranja cálido desteñido + verde selva oscuro sobre blanco limpio.

| Token CSS | Nombre | HEX | Uso principal |
|---|---|---|---|
| `--color-naranja` | Naranja | `#C4532A` | CTA primario, acentos, links activos, bordes del logotipo |
| `--color-papaya` | Papaya | `#E8754A` | Hover de naranja, gradientes, énfasis secundario |
| `--color-selva` | Selva | `#2A5240` | CTA secundario, badges verdes, iconos, header background oscuro |
| `--color-menta` | Menta | `#C8DDB8` | Texto sobre fondos oscuros (Selva/Noche), badges suaves |
| `--color-linho` | Linho | `#F5F0E8` | Fondos de secciones alternadas, cards, inputs |
| `--color-noche` | Noche | `#1A2E20` | Color de texto principal, fondos oscuros |
| `--color-white` | Blanco | `#FFFFFF` | Fondo principal de la web |
| `--color-muted` | Muted | `#7A7A6E` | Texto secundario, labels, placeholders |
| `--color-rule` | Rule | `#E4DDD4` | Bordes, separadores, divisores |
| `--color-naranja-soft` | Naranja soft | `#FAE8DF` | Backgrounds de callouts naranjas, etiquetas |
| `--color-selva-soft` | Selva soft | `#D2E8D8` | Backgrounds de callouts verdes, etiquetas |

#### Uso de colores en componentes

| Componente | Background | Texto | Borde |
|---|---|---|---|
| Botón primario | `#C4532A` | `#FFFFFF` | — |
| Botón primario hover | `#E8754A` | `#FFFFFF` | — |
| Botón secundario | `#2A5240` | `#FFFFFF` | — |
| Botón outline naranja | `transparent` | `#C4532A` | `#C4532A` |
| Botón outline verde | `transparent` | `#2A5240` | `#2A5240` |
| Etiqueta "Made in Europe" | `#C4532A` | `#FFFFFF` | — |
| Etiqueta "Orgánico" | `#2A5240` | `#C8DDB8` | — |
| Etiqueta "Hecho a mano" | `#FAE8DF` | `#7A2A10` | — |
| Etiqueta "Sostenible" | `#D2E8D8` | `#1A3A28` | — |
| Etiqueta "Segunda vida" | `#F5F0E8` | `#1A2E20` | `#E4DDD4` |
| Card de producto | `#FFFFFF` | `#1A2E20` | `#E4DDD4` |
| Sección alternada | `#F5F0E8` | `#1A2E20` | — |
| Header | `#FFFFFF` | `#1A2E20` | `#E4DDD4` (bottom) |
| Footer | `#1A2E20` | `#F5F0E8` | — |

#### Contraste — verificación WCAG AA

| Combinación | Ratio | WCAG AA (4.5:1) |
|---|---|---|
| `#1A2E20` sobre `#FFFFFF` | ~15:1 | ✅ |
| `#FFFFFF` sobre `#C4532A` | ~4.6:1 | ✅ |
| `#FFFFFF` sobre `#2A5240` | ~7.8:1 | ✅ |
| `#C4532A` sobre `#FFFFFF` | ~4.6:1 | ✅ |
| `#C8DDB8` sobre `#2A5240` | ~4.5:1 | ✅ |
| `#7A7A6E` sobre `#FFFFFF` | ~4.6:1 | ✅ (texto grande) |

### 10.3 Tipografía

Dos fuentes únicas. Sin excepciones.

| Rol | Fuente | Peso | Size desktop | Size mobile | Notas |
|---|---|---|---|---|---|
| Display H1 | Cormorant Garamond | 300 | 56–72px | 36–48px | Línea de apertura de secciones hero |
| Display H2 | Cormorant Garamond | 300 | 36–44px | 26–32px | Títulos de sección |
| Display H3 | Cormorant Garamond | 300 | 24–28px | 20–24px | Subtítulos |
| Accent / Italic | Cormorant Garamond | 300 italic | Igual al contexto | Igual | `"en el escaparate"` — énfasis editorial en naranja |
| Body | Jost | 300 | 16px / lh 1.85 | 15px / lh 1.75 | Texto de párrafos |
| Body small | Jost | 300 | 14px / lh 1.75 | 13px | Descripciones secundarias |
| Label / UI | Jost | 400 | 10–11px / letter-spacing 3px / uppercase | igual | Etiquetas, badges, sección tags |
| Botones | Jost | 400 | 11px / letter-spacing 2.5px / uppercase | igual | Todos los botones |
| Wordmark header | Cormorant Garamond | 300–400 | 16px / letter-spacing 5px | 14px | `G·ARTISANS` en nav |

#### Ejemplo de uso combinado (del brand book)

```
Display:  "Tu taller,"           → Cormorant Garamond 300, 56px, #1A2E20
Accent:   "en el escaparate"     → Cormorant Garamond 300 italic, 56px, #C4532A
Display:  "que merece."          → Cormorant Garamond 300, 56px, #1A2E20
Body:     "G·Artisans conecta…"  → Jost 300, 16px, #4A4A42
Button:   "QUIERO SER PRODUCTOR" → Jost 400 uppercase, 11px, letter-spacing 2.5px
```

### 10.4 Botones

Cuatro variantes definidas. Todas con `border-radius: 40px` (pill shape).

| Variante | BG | Texto | Border | Uso |
|---|---|---|---|---|
| Primary (naranja) | `#C4532A` | `#FFFFFF` | — | CTA principal. `ÚNETE COMO PRODUCTOR` |
| Secondary (verde) | `#2A5240` | `#FFFFFF` | — | CTA secundario. `EXPLORAR CATÁLOGO` |
| Outline naranja | `transparent` | `#C4532A` | 1.5px `#C4532A` | Acción terciaria. `SABER MÁS` |
| Outline oscuro | `transparent` | `#1A2E20` | 1.5px `#1A2E20` | Acción neutra. `VER PRODUCTORES` |

**Especificación de botón:**
```css
.btn {
  font-family: 'Jost', sans-serif;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  border-radius: 40px;
  padding: 12px 28px;
  transition: opacity 0.2s, background-color 0.2s;
}
.btn:hover { opacity: 0.88; }
.btn-primary { background: #C4532A; color: #FFFFFF; }
.btn-secondary { background: #2A5240; color: #FFFFFF; }
.btn-outline-orange { background: transparent; color: #C4532A; border: 1.5px solid #C4532A; }
.btn-outline-dark { background: transparent; color: #1A2E20; border: 1.5px solid #1A2E20; }
```

### 10.5 Etiquetas (badges/tags)

Pill shape. `border-radius: 20px`. `font-size: 9–10px`. `letter-spacing: 1.5px`. `text-transform: uppercase`.

| Etiqueta | BG | Texto |
|---|---|---|
| Made in Europe | `#C4532A` | `#FFFFFF` |
| Orgánico | `#2A5240` | `#C8DDB8` |
| Hecho a mano | `#FAE8DF` | `#7A2A10` |
| Sostenible | `#D2E8D8` | `#1A3A28` |
| Segunda vida | `#F5F0E8` + border `#E4DDD4` | `#1A2E20` |

### 10.6 Cards de producto

Border radius `12px`. Border `0.5px solid #E4DDD4`. Background `#FFFFFF`.

| Elemento | Especificación |
|---|---|
| Imagen/header | Height fija `88–90px`. Background con gradiente de la categoría. |
| Nombre producto | Cormorant Garamond 400, 17–18px, `#1A2E20` |
| Subtítulo (origen · material) | Jost 300, 10px, letter-spacing 1.5px, uppercase, `#7A7A6E` |
| Badge | Etiqueta según categoría, alineada abajo izquierda |
| Padding body | `12px 14px` |

**Colores de header por categoría:**
```
Joyería artesanal  → gradiente #FAE8DF → #F5F0E8
Alpargatas         → gradiente #D2E8D8 → #F5F0E8
Cerámica           → gradiente #C4532A → #E8754A (sólido naranja)
Moda sostenible    → gradiente #F5F0E8 → #FFFFFF
Cuero              → gradiente #E8D5C4 → #F5F0E8
Cosmética          → gradiente #D2E8D8 → #C8DDB8
Hogar              → gradiente #F0E8D0 → #F5F0E8
```

### 10.7 Tailwind config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        naranja: {
          DEFAULT: '#C4532A',
          papaya: '#E8754A',
          soft: '#FAE8DF',
        },
        selva: {
          DEFAULT: '#2A5240',
          menta: '#C8DDB8',
          soft: '#D2E8D8',
        },
        linho: '#F5F0E8',
        noche: '#1A2E20',
        muted: '#7A7A6E',
        rule: '#E4DDD4',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['Jost', 'sans-serif'],
      },
      borderRadius: {
        pill: '40px',
        badge: '20px',
        card: '12px',
      },
      letterSpacing: {
        ui: '3px',
        btn: '2.5px',
        badge: '1.5px',
        wordmark: '5px',
      },
      maxWidth: {
        content: '1280px',
      },
    },
  },
  plugins: [],
};

export default config;
```

### 10.8 Preview de la landing (referencia visual)

La sección hero de la landing tiene el siguiente layout (validado en brand book):

```
┌─────────────────────────────────────────────────────────┐
│ G·ARTISANS          CÓMO FUNCIONA  PRODUCTORES  CONTACTO │  ← header sticky
├─────────────────────────────────────────────────────────┤
│                                    ┌───────────────────┐│
│ [PLATAFORMA PARA ARTESANOS         │ ÚNETE A LOS       ││
│  EUROPEOS]  ← badge verde          │ PRIMEROS          ││
│                                    │ PRODUCTORES       ││
│ Tu taller,                         │                   ││
│ en el escaparate   ← italic naranja│ [Nombre / Taller] ││
│ que merece.                        │ [Email de contacto││
│                                    │ [País · Categoría]││
│ G·Artisans conecta productores...  │                   ││
│                                    │ [RESERVAR MI PLAZA││
│ [QUIERO SER PRODUCTOR] ← btn orange│  ← btn naranja    ││
│                                    │ Apertura limitada ││
│                                    │ a 50 productores  ││
└────────────────────────────────────┴───────────────────┘│
```

**Nota de maquetación:** El formulario sidebar en desktop está en una card con fondo `#F5F0E8`, borde `0.5px solid #E4DDD4`. En mobile el formulario baja al 100% del ancho debajo del copy.

---

## 11. Componentes compartidos

### 11.1 Header / Navegación

| Campo | Detalle |
|---|---|
| Logo | SVG inline de G·Artisans. Enlaza a `/` (o `/en` si locale es EN). |
| Links | Inicio · Artesanos · Marketplace · Sobre nosotros · Contacto |
| CTA | Botón `Únete como productor` / `Join as a producer` → `/apply`. Naranja. Siempre visible. |
| Selector idioma | `ES \| EN`. Toggle que cambia el locale preservando la ruta actual. |
| Mobile | Hamburger (Lucide `Menu`). Panel lateral con todos los links + CTA + selector idioma. |
| Sticky | `position: sticky; top: 0`. Fondo blanco con `box-shadow` sutil tras scroll (JS `scrollY > 0`). |
| Accesibilidad | `<nav aria-label="Navegación principal">`. Menú móvil con `aria-expanded` y `aria-controls`. |

### 11.2 Footer

| Columna | Contenido |
|---|---|
| 1 (izquierda) | Logo G·Artisans · Tagline · Descripción breve (≤ 2 líneas) · Iconos redes sociales |
| 2 | Navegación principal con `<nav aria-label="Navegación footer">` |
| 3 | Para productores: `/apply` · `/artisans` |
| 4 (derecha) | Legal: `/privacidad` · `/aviso-legal` · `/cookies` |
| Bottom bar | `© 2026 G·Artisans · Alternative Green Energy Holdco S.L.` + selector idioma |

### 11.3 Cookie banner

| Campo | Detalle |
|---|---|
| Requisito legal | Obligatorio por RGPD y LSSI española |
| Librería | `@cookie-consent/next` o `vanilla-cookieconsent` adaptado a Next.js |
| Opciones | Aceptar todas · Solo necesarias · Configurar preferencias |
| GA4 | Se inicializa únicamente tras aceptación de cookies de analítica |
| Posición | Inferior de la pantalla, `position: fixed`. Sin bloquear el contenido. |
| Persistencia | Preferencia guardada en `localStorage` (clave: `ga-cookie-consent`) |
| i18n | Textos en ES y EN según el locale activo |

---

## 12. Páginas legales

Las páginas legales son obligatorias por el RGPD, la LSSI y la normativa española. Deben estar disponibles antes del go-live.

> **Aviso:** El contenido de estas páginas debe ser redactado o revisado por un profesional legal. El equipo técnico implementa la estructura y el diseño; el contenido legal es responsabilidad del cliente.

### 12.1 Política de privacidad ( `/privacidad` / `/en/privacy` )

Contenido mínimo obligatorio:
- Identidad y datos del responsable del tratamiento (Alternative Green Energy Holdco S.L. · CIF B02873743)
- Datos que se recogen y con qué finalidad
- Base legal del tratamiento (consentimiento / interés legítimo)
- Destinatarios de los datos (Airtable, Resend, Vercel, Google Analytics)
- Derechos del usuario (acceso, rectificación, supresión, portabilidad, oposición)
- Plazo de conservación de los datos
- Cómo ejercer los derechos (email de contacto)
- Derecho a reclamar ante la AEPD (Agencia Española de Protección de Datos)

### 12.2 Aviso legal ( `/aviso-legal` / `/en/legal` )

Contenido mínimo obligatorio:
- Datos identificativos de la empresa (razón social, CIF, domicilio, email)
- Condiciones de uso del sitio web
- Propiedad intelectual e industrial
- Limitación de responsabilidad
- Legislación aplicable y jurisdicción

### 12.3 Política de cookies ( `/cookies` / `/en/cookies` )

Contenido mínimo:
- Qué son las cookies
- Tipos de cookies utilizadas (propias / de terceros · sesión / persistentes)
- Tabla de cookies: nombre, proveedor, finalidad, duración
- Cómo desactivar las cookies
- Enlace al panel de configuración del cookie banner

**Cookies utilizadas en v1:**

| Cookie | Proveedor | Finalidad | Duración |
|---|---|---|---|
| `_ga` | Google Analytics | Identificar usuarios únicos | 2 años |
| `_ga_XXXX` | Google Analytics | Persistir el estado de sesión | 2 años |
| `ga-cookie-consent` | G·Artisans | Guardar preferencia de cookies | 1 año |

---

## 13. Páginas de estado

### 13.1 Página de éxito ( `/apply/success` / `/en/apply/success` )

Se muestra tras el envío exitoso del formulario de productor.

| Campo | Detalle |
|---|---|
| Acceso | Sólo accesible tras un envío exitoso. Redirige a `/apply` si se accede directamente. |
| Implementación | Pasar estado con `router.push('/apply/success')` tras `form_success`. Usar `sessionStorage` para validar acceso. |
| Contenido ES | Título: `¡Solicitud recibida!` · Mensaje de confirmación con nombre del productor · Próximos pasos · Botón volver al inicio |
| Contenido EN | Title: `Application received!` · Same structure |
| GA4 | Registrar evento `form_success` en esta página (no en el API, para evitar dobles en SSR) |

### 13.2 Página 404

| Campo | Detalle |
|---|---|
| Archivo | `app/not-found.tsx` (Next.js App Router) |
| Contenido | Mensaje amigable · Enlace a inicio · Enlace a `/apply` |
| SEO | `noindex, nofollow` |

### 13.3 Página 500

| Campo | Detalle |
|---|---|
| Archivo | `app/error.tsx` (error boundary de Next.js) |
| Contenido | Mensaje de error genérico · Botón "Volver a intentarlo" · Email de contacto |
| Logging | Errores enviados a Vercel Logs (automático) |

---

## 14. Diseño responsive y accesibilidad

### 14.1 Breakpoints

| Nombre | Rango | Comportamiento |
|---|---|---|
| Mobile | < 640px | Columna única · Tipografía escala ×0.85 · CTAs full-width |
| Mobile L | 640px – 768px | Columna única · Tipografía normal |
| Tablet | 768px – 1024px | 2 columnas en grids · Menú hamburger |
| Desktop | 1024px – 1280px | Layout completo · Header expandido |
| Desktop XL | > 1280px | Max-width 1280px centrado |

### 14.2 Accesibilidad — WCAG 2.1 AA

| Requisito | Implementación |
|---|---|
| Contraste de color | Mín. 4.5:1 texto normal · 3:1 texto grande · Verificar con aXe o Lighthouse |
| Foco visible | `focus-visible:outline` en todos los elementos interactivos. No usar `outline: none` sin alternativa. |
| Alt text | Todas las `<img>` y `next/image` con `alt` descriptivo. Imágenes decorativas: `alt=""`. |
| HTML semántico | `<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, `<footer>` correctamente estructurados. Un solo `<h1>` por página. |
| ARIA | `aria-label` en botones icono · `aria-expanded` en acordeón FAQs · `aria-required` en campos obligatorios · `aria-describedby` para errores |
| Formulario | Cada campo con `<label>` asociado por `for`/`id`. Errores anunciados con `role="alert"` o `aria-live="polite"`. |
| Navegación por teclado | Todo el contenido interactivo accesible con Tab/Enter/Escape. Menú móvil cierra con Escape. |
| Skip link | `<a href="#main-content" class="sr-only focus:not-sr-only">Saltar al contenido</a>` como primer elemento del body. |
| Idioma | `<html lang="es">` / `<html lang="en">` según el locale. |

---

## 15. Seguridad

### 15.1 Headers de seguridad

Configurar en `next.config.js`:

```javascript
// next.config.js
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://www.google-analytics.com",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};
```

### 15.2 Protección de APIs

| Medida | Implementación |
|---|---|
| Rate limiting | Librería `@upstash/ratelimit` con Redis (Vercel KV) o implementación en memoria con `Map` para v1 |
| Honeypot | Campo `_gotcha` oculto en el formulario. Si tiene valor, descartar sin procesar. |
| Validación server-side | Zod en todas las API routes, aunque el cliente ya valide |
| Sanitización | Todos los inputs de texto pasados por `String.trim()` antes de guardar |
| IP hashing | Guardar `SHA-256(ip)` en Airtable — nunca la IP en claro |
| CORS | API routes sólo aceptan peticiones desde el mismo origen (`NEXT_PUBLIC_APP_URL`) |

### 15.3 Gestión de secretos

- Variables de entorno **nunca** en el código fuente
- `.env.local` en `.gitignore`
- `.env.example` con claves vacías sí en el repositorio
- Rotación de claves de Airtable y Resend si se sospecha compromiso
- Acceso al repositorio de GitHub limitado a los miembros del equipo

---

## 16. Infraestructura y despliegue

### 16.1 Git workflow

| Rama | Propósito | Deploy |
|---|---|---|
| `main` | Producción. Sólo merges desde `staging`. | `https://g-artisans.com` |
| `staging` | Pre-producción. Merges desde feature branches aprobadas. | `https://staging.g-artisans.com` (Vercel Preview) |
| `feature/*` | Desarrollo de features. Una rama por tarea. | Vercel Preview automático (URL única) |
| `fix/*` | Correcciones de bugs. | Vercel Preview automático |

**Reglas:**
- No se hace push directo a `main` ni a `staging`
- Todo merge requiere Pull Request con al menos 1 aprobación
- Los tests deben pasar antes de hacer merge
- Mensajes de commit en inglés, formato: `feat:`, `fix:`, `docs:`, `chore:`

### 16.2 Entornos

| Entorno | URL | Variables |
|---|---|---|
| Local | `http://localhost:3000` | `.env.local` |
| Preview | URL única por PR (Vercel) | Variables de Vercel (entorno Preview) |
| Staging | `https://staging.g-artisans.com` | Variables de Vercel (entorno Preview) con datos de test |
| Producción | `https://g-artisans.com` | Variables de Vercel (entorno Production) |

### 16.3 Vercel config

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["cdg1"],
  "redirects": [
    { "source": "/home", "destination": "/", "permanent": true }
  ]
}
```

> La región `cdg1` corresponde a Europa Occidental (París). Esto garantiza latencia mínima para usuarios en España y la UE, y almacenamiento de datos en la UE (RGPD).

### 16.4 Propiedad de cuentas

Todas las cuentas y servicios deben estar registrados a nombre de G·Artisans / Alternative Green Energy Holdco S.L.:

| Servicio | Propietario | Acceso equipo técnico |
|---|---|---|
| GitHub | G·Artisans | Colaboradores |
| Vercel | G·Artisans | Miembro del equipo |
| Airtable | G·Artisans | Editor |
| Google Analytics | G·Artisans | Editor |
| Google Search Console | G·Artisans | Propietario |
| Resend | G·Artisans | Admin |
| Dominio (DNS) | G·Artisans | — |

---

## 17. Entregables y criterios de aceptación

### 17.1 Entregables

- [ ] Código fuente TypeScript en repositorio GitHub privado propiedad del cliente
- [ ] 6 páginas públicas en producción (ES y EN): `/`, `/about`, `/artisans`, `/marketplace`, `/apply`, `/contact`
- [ ] Páginas de estado: `/apply/success`, `/404`, `/500`
- [ ] 3 páginas legales (ES y EN): `/privacidad`, `/aviso-legal`, `/cookies`
- [ ] Formulario de solicitud completo conectado a Airtable con validación client-side y server-side
- [ ] Emails automáticos en ES y EN: confirmación al productor + notificación interna
- [ ] Selector de idioma ES/EN funcional con `next-intl`
- [ ] hreflang tags y sitemap bilingüe (`sitemap.xml`)
- [ ] Cookie banner RGPD-compliant en ES y EN
- [ ] GA4 configurado con eventos personalizados documentados
- [ ] Google Search Console verificado y sitemap enviado
- [ ] Headers de seguridad en `next.config.js`
- [ ] Rate limiting en todas las API routes
- [ ] OG images (1200×630px) en ES y EN
- [ ] `.env.example` con todas las variables necesarias documentadas
- [ ] Documentación de accesos a todos los servicios entregada al cliente
- [ ] 14 días de corrección de bugs post-lanzamiento sin coste adicional

### 17.2 Criterios de aceptación

| # | Criterio | Verificación |
|---|---|---|
| 1 | Formulario ES | Envío completo: formulario → Airtable → email confirmación productor → email notificación interno |
| 2 | Formulario EN | Mismo flujo en `/en/apply` con todos los textos en inglés |
| 3 | Responsive | Todas las páginas correctas en: 375px (iPhone SE) · 768px (iPad) · 1280px (Desktop) |
| 4 | Performance | Lighthouse ≥ 90 en Performance, SEO y Accessibility en homepage (ES y EN) |
| 5 | SEO | Todas las páginas indexadas en Search Console sin errores. Sitemap validado. |
| 6 | hreflang | Verificar con `hreflang Tags Testing Tool` que ES y EN están correctamente enlazadas |
| 7 | Analytics | GA4 registra `page_view` y `form_success` correctamente verificado en GA4 DebugView |
| 8 | Cookie banner | GA4 **no** se inicializa si el usuario rechaza cookies. Verificado en Network tab. |
| 9 | Seguridad | Headers de seguridad verificados con `securityheaders.com`. Score A como mínimo. |
| 10 | Legal | `/privacidad`, `/aviso-legal`, `/cookies` accesibles desde el footer. Contenido aprobado por cliente. |
| 11 | Contador | `/api/spots` devuelve datos correctos. Fallback funciona cuando la API falla. |
| 12 | Rate limiting | Un mismo IP no puede enviar más de 3 formularios en 1 hora |
| 13 | Velocidad | LCP < 2.5s medido con WebPageTest desde Madrid en conexión 4G |
| 14 | 404 | Cualquier URL inexistente devuelve la página 404 con navegación funcional |
| 15 | Accesibilidad | Sin errores críticos en aXe DevTools. Navegación completa por teclado funcional. |

---

## 18. Fuera de alcance — v1

Los siguientes elementos no forman parte de este contrato y serán presupuestados en fases posteriores.

| Elemento | Fase |
|---|---|
| Construcción del marketplace completo | Fase 2 |
| Panel privado del productor | Fase 2 |
| Sistema de pagos con Stripe Connect | Fase 2 |
| Verificación KYC de productores (ComplyCube) | Fase 2 |
| Lector de tejidos y diccionario de fibras | Fase 2 |
| Armario Sostenible (segunda mano) | Fase 2+ |
| Sistema de valoraciones y reviews | Fase 2+ |
| Blog o sección de contenido editorial | Fase 2+ |
| App móvil nativa | Fase 3+ |
| Idiomas adicionales más allá de ES/EN | A definir |
| Traducción automática del contenido editorial | — (responsabilidad del cliente) |
| Gestión de redes sociales | Servicio separado |
| Campañas de publicidad de pago | Servicio separado |

---

## Aprobación del documento

Este TRD establece el alcance técnico acordado para la landing page de G·Artisans v1. Cualquier requisito no listado aquí que surja durante el desarrollo será evaluado como solicitud de cambio y puede implicar ajuste de plazo y presupuesto. Los cambios de alcance requieren acuerdo escrito de ambas partes antes de comenzar el trabajo.

**Firma de aprobación del cliente:** _______________________________ &nbsp;&nbsp; **Fecha:** _____ / _____ / _______

---

*G·Artisans · Technical Requirements Document v1.1 · ES/EN · Junio 2026 · Confidencial*
*Alternative Green Energy Holdco S.L. · CIF B02873743 · El Paso, Santa Cruz de Tenerife*
