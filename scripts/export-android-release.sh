#!/usr/bin/env sh
set -eu

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APK_DIR="$PROJECT_ROOT/android/app/build/outputs/apk/release"
META_FILE="$APK_DIR/output-metadata.json"
OUT_DIR="$PROJECT_ROOT/release/android"
APP_NAME="doux"

if [ ! -f "$META_FILE" ]; then
  echo "[error] Missing metadata file: $META_FILE"
  echo "[hint] Run Android release build first: npm run build:android"
  exit 1
fi

VERSION_NAME="$(sed -n 's/.*"versionName"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$META_FILE" | head -n 1)"

if [ -z "$VERSION_NAME" ]; then
  VERSION_NAME="0.0.0"
fi

mkdir -p "$OUT_DIR"

copied=0
for src in "$APK_DIR"/app-*-release.apk; do
  [ -e "$src" ] || continue

  filename="$(basename "$src")"
  abi="${filename#app-}"
  abi="${abi%-release.apk}"

  target="$OUT_DIR/${APP_NAME}-v${VERSION_NAME}-${abi}.apk"
  cp "$src" "$target"
  echo "[ok] $filename -> $(basename "$target")"
  copied=$((copied + 1))
done

if [ "$copied" -eq 0 ]; then
  echo "[error] No ABI split APKs found in: $APK_DIR"
  echo "[hint] Ensure split build is enabled and run: npm run build:android"
  exit 1
fi

echo "[done] Exported $copied APK(s) to: $OUT_DIR"
