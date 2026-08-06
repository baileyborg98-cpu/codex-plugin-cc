#!/usr/bin/env bash
# Convert recorded webm -> silent H.264 MP4, then AUDIT the poster frames.
# Usage: OUT=/path/to/exportdir N=10 ./finish-export.sh
set -euo pipefail
: "${OUT:?set OUT}" ; : "${N:?set N}"
FF=$(python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())")
TRIM=${TRIM:-0.85}   # trims most of the static hold; frame 0 stays the target slide

mkdir -p "$OUT/audit"
# zero-pad to 2 digits: seq -w won't pad when N is single-digit
for i in $(seq 1 "$N"); do
  n=$(printf "%02d" "$i")
  "$FF" -y -loglevel error -ss "$TRIM" -i "$OUT/webm/slide-$n.webm" \
    -c:v libx264 -pix_fmt yuv420p -r 30 -crf 18 -movflags +faststart -an \
    "$OUT/videos/slide-$n.mp4"
  # poster-frame audit: frame 0 of each MP4 must be that slide, never slide 1
  "$FF" -y -loglevel error -i "$OUT/videos/slide-$n.mp4" -frames:v 1 "$OUT/audit/frame0-$n.png"
done
echo "MP4s written. Review $OUT/audit/frame0-*.png — each must show its own slide."
