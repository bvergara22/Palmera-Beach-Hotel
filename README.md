# Palmera Beach Hotel — sitio web

Sitio estático (HTML + CSS + JS, sin build) reconstruido a partir de los dos videos
de pantalla del sitio original (modo claro y oscuro), del Instagram
[@palmerabhotel](https://www.instagram.com/palmerabhotel/) y de la ficha de Google del hotel.

```
index.html
assets/
  css/styles.css
  js/i18n.js      ← diccionario ES / EN
  js/main.js      ← menú, carrusel, idioma, WhatsApp, GSAP
  img/*.jpg|svg
README.md
```

## Cómo verlo

Abrir `index.html` directamente en el navegador, o servirlo:

```bash
cd "C:\Users\Contact Center\palmera-beach-hotel"
npx serve .      # o: python -m http.server
```

No hay dependencias que instalar. GSAP, ScrollTrigger y las fuentes se cargan por CDN.

## Stack

| Qué | Con qué |
|---|---|
| Marcado | HTML5 semántico, una sola página |
| Estilos | CSS puro con custom properties (sin framework) |
| Animación | GSAP 3.12.5 + ScrollTrigger (cdnjs) |
| Tipografías | Playfair Display (títulos) + Poppins (texto) |
| Idiomas | diccionario propio en `assets/js/i18n.js` |
| Conversión | WhatsApp (`wa.me/573161002891`) |

## Tema claro / oscuro

Automático, **sin botón**, como se pidió: los tokens viven en `:root` y se
redefinen dentro de `@media (prefers-color-scheme: dark)`. El sitio sigue el
tema del sistema operativo.

## Colores de marca

Tomados del logo de Instagram (muestreo del PNG):

| Token | Valor | Uso |
|---|---|---|
| `--brand` | `#296B8C` | azul del logo — menú, botones, acentos |
| `--brand-dark` | `#1B5172` | hover y degradados |
| `--brand-deep` | `#123B52` | fondos profundos |
| `--brand-light` | `#5F9CB8` | acento en modo oscuro |
| `--brand-pale` | `#CFE2EB` | líneas y fondos suaves |
| `--cream` | `#FFF7D6` | crema del logo — texto sobre azul, botones |
| `--cream-deep` | `#F0E3B8` | hover de los botones crema |

## Idiomas (ES / EN)

- Cada texto traducible lleva `data-i18n="clave"` (texto plano) o
  `data-i18n-html="clave"` (permite `<br>`).
- El diccionario está en `assets/js/i18n.js` (`window.PALMERA_I18N`), con las
  mismas 86 claves en `es` y en `en`.
- El selector ES / EN está en el header y dentro del menú. La elección se guarda
  en `localStorage` (`palmera-lang`) y actualiza `<html lang>` y la meta description.
- Los mensajes de WhatsApp también se traducen (claves `wa.*`).

**Para agregar un texto:** poner `data-i18n="seccion.clave"` en el HTML y la
misma clave en los dos idiomas del diccionario.

## Menú a pantalla completa

El botón de 3 barras abre un panel que cubre toda la pantalla con el azul de la
marca (`--brand` + dos degradados radiales). Entra con un `clip-path` animado de
arriba hacia abajo y las opciones aparecen escalonadas. Incluye numeración
`01…05`, datos de contacto, el selector de idioma y el botón "Cotizar ahora".
Cierra con la X, con `Esc` o al elegir una opción.

## WhatsApp

Todos los llamados a la acción abren WhatsApp con el mensaje ya escrito, con
**tipo de servicio + número de personas** (y fechas si se eligieron en la barra
de reserva):

```
Hola Palmera Beach Hotel, quiero cotizar.
• Servicio: Pasadía
• Fechas: 20/12/2026 a 23/12/2026
• Personas: 4
```

## Imágenes

Son las que entregó la clienta (carpeta "Fotos palmera web"). Las originales
vienen de teléfono, en vertical y en HEIC/PNG/JPEG; se convirtieron a JPEG y se
recortaron por destino: 2000×1000 para el hero, 3:4 para "Los espacios" y el
bloque del hotel, 2:1 para los planes y 4:5 / 3:2 para la galería.

El texto del hero va sobre la foto, así que el `.hero-scrim` lleva un refuerzo
lateral sobre la columna del texto. El contraste del crema (`#FFF7D6`) contra la
imagen oscurecida se midió celda por celda (rejilla de 60) en las cuatro fotos:
el peor caso queda entre **6,3:1 y 8,7:1**, por encima del mínimo AA de 4,5:1.
Si se cambia una foto del hero conviene volver a medirlo, sobre todo si tiene
zonas muy claras en la mitad izquierda.

## Correcciones de la clienta ya aplicadas

Del documento compartido:

- [x] Cambio de idioma en la página → selector ES / EN
- [x] Carrusel de 4 slides en el hero con sus copys (Alojamiento, Pasadía, Restaurante, Eventos)
- [x] Botón renombrado a **"Cotizar ahora"**
- [x] Mensaje predeterminado de WhatsApp con tipo de servicio + número de personas
- [x] Texto nuevo en "Cómo llegar": *"Estamos en Manzanillo del Mar, al norte de Cartagena, sigue el mapa y en minutos estás frente al mar."*
- [x] Servicios: a 30 m de la playa · rooftop / terraza · restaurante Pal-Mar · piscina · wifi · parqueadero
- [x] Footer sin los enlaces de navegación (solo logo y copyright)
- [x] Cierre: *"El Caribe te espera. Nosotros también."* + botón **"Reserva ahora"**
- [x] Colores del logo y sus variantes
- [x] Favicon: una "P" blanca, sin fondo; la pestaña dice solo "Palmera Beach Hotel"

## Pendientes (dependen de la clienta)

- **Dirección exacta.** En el documento el campo "Dirección:" quedó en blanco.
  Por ahora queda la de Google: *Vía Manzanillo del Mar, Cartagena de Indias, Bolívar*.
- **Teléfono.** Google muestra `300 544 1946`; en el sitio y en Instagram aparece
  `+57 316 100 2891`. Confirmar cuál es el de reservas (está en `index.html` y en
  la constante `WA_NUMBER` de `assets/js/main.js`).
- **Precios.** Solo está el "desde $150.000 COP por noche" de alojamiento;
  faltan los de pasadía, cumpleaños y eventos.
- **Reseñas.** Hay 2 de las 201 de Google; conviene sumar 2 o 3 más.
- **RNT.** El número `276009` del footer está tomado del video; verificarlo.
- **Deploy.** Al subirlo, cambiar la URL de `og:url` y agregar un `og:image` real.
