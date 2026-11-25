#!/bin/bash
# Genera las 30 imagenes del sitio a partir de las 18 que entrego la clienta.
# Uso: build-img.sh <ffmpeg> <carpeta-origen> <carpeta-destino>
set -e
FF="$1"; SRC="$2"; OUT="$3"
# fuente destino ancho alto offset-vertical calidad [filtros-extra] [pix_fmt]
gen(){ A="($3/$4)"
 "$FF" -hide_banner -loglevel error -y -i "$SRC/$1.jpg" \
  -vf "crop='if(gt(iw/ih,$A),ih*$A,iw)':'if(gt(iw/ih,$A),ih,iw/$A)':'(iw-ow)/2':'(ih-oh)*$5',scale=$3:$4:flags=lanczos${7:-}" \
  -pix_fmt "${8:-yuvj420p}" -q:v "$6" "$OUT/$2.jpg"; }
# La fogata lleva las luces altas bajadas: Chrome compone en verde el nucleo de
# la llama bajo una capa translucida, y en 4:4:4 el artefacto se nota menos.
FOGATA=",curves=all='0/0 0.35/0.33 0.7/0.63 1/0.86',eq=saturation=0.88"
F444="yuvj444p"

# Hero ancho (escritorio) y vertical (movil, <=760px)
gen kiosco-palmera      hero-alojamiento    2000 1000 0.70 4
gen palmera-3           hero-pasadia        2000 1000 0.45 4
gen palmera-restaurante hero-restaurante    2000 1000 0.42 4
gen palmera-fogata      hero-eventos        2000 1000 0.46 4 "$FOGATA" "$F444"
gen kiosco-palmera      hero-alojamiento-sm 1100 1430 0.52 5
gen palmera-3           hero-pasadia-sm     1100 1430 0.50 5
gen palmera-restaurante hero-restaurante-sm 1100 1430 0.46 5
gen palmera-fogata      hero-eventos-sm     1100 1430 0.50 5 "$FOGATA" "$F444"
# El hotel
gen imagen     about-casa    900 1200 0.42 5
gen espacios-1 about-detalle 760 1013 0.40 5
# Los espacios
gen piscina-2      esp-piscina 820 1093 0.30 5
gen terraza-1      esp-sol     820 1093 0.50 5
gen playa          esp-playa   820 1093 0.50 5
gen kiosco-palmera esp-casa    820 1093 0.35 5
# Planes
gen palmera1       plan-hospedaje  1300 867 0.78 5
gen piscina        plan-pasadia    1300 867 0.50 5
gen palmera-2      plan-cumpleanos 1300 867 0.65 5
gen palmera-fogata plan-eventos    1300 867 0.52 5 "$FOGATA" "$F444"
# Restaurante
gen palmera-restaurante resto-terraza 1800 1100 0.58 5
gen palmar           plato-principal 900 1125 0.55 5
gen palmar-1         plato-brindis   900 1125 0.42 5
gen postre-palmar    plato-postre    900 1125 0.50 5
gen terraza-palmar   plato-fruta     900 1125 0.50 5
gen cocteles-palmera plato-coctel    900 1125 0.45 5
# Galeria
gen palmera-3  g1-jardin   900 1125 0.62 5
gen piscina    g2-piscina  900 1125 0.26 5
gen palmera1   g3-palmeras 900 1125 0.35 5
gen playa      g4-playa   1300  867 0.50 5
gen playa-heic g5-mar     1300  867 0.75 5
gen terraza-1  g6-rooftop 1300  731 0.60 5
echo "30 imagenes generadas en $OUT"
