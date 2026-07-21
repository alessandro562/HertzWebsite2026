#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# HERTZ · migrazione LAYER CONTENUTO dal sito legacy al nuovo
# Next.js. Copia SOLO gli asset e i dati durevoli — nessun design.
#
# USO:
#   1. crea prima il nuovo progetto Next.js (vedi REBUILD_PLAN, Fase 2)
#   2. dalla root del REPO LEGACY:
#        bash scripts/migrate-content.sh "/percorso/hertz-next"
#
# Path con spazi (es. ~/Desktop/Hertz Website) → SEMPRE tra virgolette.
# ─────────────────────────────────────────────────────────────
set -euo pipefail

DEST="${1:?Uso: bash migrate-content.sh <percorso-progetto-next>}"
SRC="$(pwd)"

echo "→ sorgente legacy : $SRC"
echo "→ destinazione    : $DEST"

mkdir -p "$DEST/public/assets" "$DEST/public/uploads" "$DEST/public/media"

echo "→ copio le foto (assets/ uploads/ media/) ..."
cp -R "$SRC/assets/."  "$DEST/public/assets/"
cp -R "$SRC/uploads/." "$DEST/public/uploads/"
cp -R "$SRC/media/."   "$DEST/public/media/"

# poster/hero singoli fuori cartella (se presenti)
[ -f "$SRC/hertz x numa 1.png" ] && cp "$SRC/hertz x numa 1.png" "$DEST/public/assets/hertz-x-numa-1.png" || true

echo "→ copio favicon / icone ..."
[ -f "$SRC/favicon.ico" ] && cp "$SRC/favicon.ico" "$DEST/public/favicon.ico" || true

# font Helvetica Neue (decidi in Fase 0 se tenerli o passare a
# Bricolage/JetBrains: NON copiarli ciecamente, sono ~15 file OTF)
echo "→ font legacy in assets/fonts/ NON copiati di default."
echo "  Se confermi Helvetica Neue: cp -R \"$SRC/assets/fonts/.\" \"$DEST/public/fonts/\""

echo ""
echo "✔ Asset copiati. Riepilogo:"
echo "  foto assets/  : $(find "$DEST/public/assets"  -type f | wc -l | tr -d ' ')"
echo "  foto uploads/ : $(find "$DEST/public/uploads" -type f | wc -l | tr -d ' ')"
echo "  foto media/   : $(find "$DEST/public/media"   -type f | wc -l | tr -d ' ')"
echo ""
echo "PROSSIMO PASSO MANUALE:"
echo "  • copia content/events.ts e content/artists.ts nel nuovo progetto"
echo "  • verifica i // TODO:bio in artists.ts contro hertz-artist.js legacy"
echo "  • NON copiare nessun .html / .jsx / hertz-system.css legacy: è design da buttare"
