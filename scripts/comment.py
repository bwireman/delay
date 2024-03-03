#!/usr/bin/env python3

lines = dict()
with open('./comments.tmp') as x:
    y = filter(bool, x.read().split('--'))
    y = [v.split('\n') for v in y]
    y = filter(bool, y)
    for l in y:
        ll = [v.strip() for v in l if v]
        if len(ll) <= 1:
            continue

        full_comment = "\n".join(ll[:-1]).replace("///", "*")
        lines[ll[-1]] = f"""
/**
{full_comment}
*/"""

out = ""
with open('./dist/delay.d.ts') as x:
    for line in x.readlines():
        for func, comment in lines.items():
            if line.startswith(func):
                out += comment
                out += "\n"
                break
        out += line

print(out)