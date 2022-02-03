# pip install fonttools
ttf=$1
pyftsubset $ttf \
  --text-file=fonts.lst \
  --layout-features='*' \
  --flavor=woff2 \
  --output-file=src/flags.woff2
