#!/usr/bin/env bash
# webm -> silent H.264 MP4 for the reel, then pull frame 0 so the cover can be
# checked. Frame 0 must be scene 1 fully composed, never a half painted page.
#
#   OUT=/path/to/export ./finish-reel.sh
#
# TRIM drops the recorder's preroll. The exporter holds a static, composed
# scene 1 for HOLD_MS before the reel starts, so a trim shorter than that hold
# still lands on a good frame.
set -euo pipefail

OUT="${OUT:?set OUT to the export dir}"
TRIM="${TRIM:-0.60}"
FF="${FF:-$(python3 -c 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())')}"

mkdir -p "$OUT/videos" "$OUT/audit"

"$FF" -y -loglevel error -ss "$TRIM" -i "$OUT/webm/reel.webm" \
  -c:v libx264 -pix_fmt yuv420p -r 30 -crf 18 -movflags +faststart -an \
  "$OUT/videos/reel.mp4"

"$FF" -y -loglevel error -i "$OUT/videos/reel.mp4" -frames:v 1 "$OUT/audit/frame0.png"

"$FF" -y -loglevel error -i "$OUT/videos/reel.mp4" -vf "select='not(mod(n\,90))'" \
  -vsync 0 "$OUT/audit/beat-%02d.png"

python3 - "$OUT/videos/reel.mp4" <<'PY'
import subprocess, sys, json, shutil
exe = shutil.which('ffprobe')
if exe:
    out = subprocess.run([exe,'-v','quiet','-print_format','json','-show_format',sys.argv[1]],
                         capture_output=True, text=True).stdout
    print('duration', json.loads(out)['format']['duration'], 'seconds')
PY

ls -la "$OUT/videos/reel.mp4"
