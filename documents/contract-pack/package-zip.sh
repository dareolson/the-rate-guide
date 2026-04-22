#!/bin/bash
# Packages the Freelancer's Contract Pack for Gumroad delivery.
# Run from anywhere: bash documents/contract-pack/package-zip.sh
# Output: documents/contract-pack/Freelancers-Contract-Pack.zip

set -e

SRC="$(cd "$(dirname "$0")" && pwd)"
DOCX="$SRC/docx"
PDF="$SRC/pdf"
STAGING="/tmp/contract-pack-staging"
OUT="$SRC/Freelancers-Contract-Pack.zip"

# ── Clean staging area ───────────────────────────────────────────────────────
rm -rf "$STAGING"
mkdir -p "$STAGING/Freelancer's Contract Pack/contracts"
mkdir -p "$STAGING/Freelancer's Contract Pack/originals — do not edit"

# ── Copy the Plain English Guide (PDF) to root — read this first ─────────────
cp "$PDF/00-plain-english-guide.pdf" \
   "$STAGING/Freelancer's Contract Pack/READ ME FIRST — Plain English Guide.pdf"

# ── Copy editable Word docs to contracts/ ───────────────────────────────────
for f in "$DOCX"/*.docx; do
  name=$(basename "$f")
  # Skip the plain english guide — it's the explainer, not a template
  [[ "$name" == 00-* ]] && continue
  cp "$f" "$STAGING/Freelancer's Contract Pack/contracts/$name"
done

# ── Copy originals (same files, separate folder) ────────────────────────────
for f in "$DOCX"/*.docx; do
  name=$(basename "$f")
  [[ "$name" == 00-* ]] && continue
  cp "$f" "$STAGING/Freelancer's Contract Pack/originals — do not edit/$name"
done

# ── Zip it ───────────────────────────────────────────────────────────────────
rm -f "$OUT"
cd "$STAGING"
zip -r "$OUT" "Freelancer's Contract Pack" 2>/dev/null
cd - > /dev/null

# ── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo "✓ Zip created: $OUT"
echo ""
echo "Contents:"
unzip -l "$OUT" | grep -v "^Archive" | grep -v "^\-\-" | awk '{print $NF}' | grep -v "^$"
