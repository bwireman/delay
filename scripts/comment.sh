# #!/usr/bin/env bash
# set -e

cat src/delay.gleam | grep pub -B 3 | grep -v "\}" | grep -v import | sed 's/pub fn/export function/g' | sed -E 's/\(.*//g' | sed 's/pub opaque type/export type/g' > comments.tmp

./scripts/comment.py > ./dist/delay.d.ts.tmp
mv ./dist/delay.d.ts.tmp ./dist/delay.d.ts


# for i in $(seq 1 10);
# do
#     echo $i
#     sed -i '/function/i ' dist/delay.js
# done


rm *.tmp