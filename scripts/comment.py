#!/usr/bin/env python3

import sys

def clean_declaration(dec, export=True):
    if export:
        return dec.replace("pub fn", "export function").replace("pub opaque type", "export type")
    return dec.replace("pub fn", "function").replace("pub opaque type", "type")

def gen_comments(export=True):
    lines = dict()
    with open('./comments.tmp') as x:
        y = filter(bool, x.read().split('--'))
        y = [v.split('\n') for v in y]
        y = filter(bool, y)
        for l in y:
            ll = [v.strip() for v in l if v]
            if len(ll) <= 1:
                continue

            declaration = clean_declaration(ll[-1], export=export)
            full_comment = "\n".join(ll[:-1]).replace("///", "*")
            lines[declaration] = f"""
/**
{full_comment}
*/"""

    return lines

def write_comments(path, lines, start_line=None):
    out = ""
    found_start_line = start_line is None

    with open(path) as x:
        for line in x.readlines():
            if start_line and not found_start_line and start_line in line:
                found_start_line = True

            if found_start_line:
                for func, comment in lines.items():
                    if line.startswith(func):
                        out += comment
                        out += "\n"
                        break
            out += line

    with open(path, "w") as f:
        f.write(out)


if __name__ == "__main__":
    path = sys.argv[1]
    export = path.endswith(".ts")
    comments = gen_comments(export=export)
    start_line = None
    if len(sys.argv) > 2:
        start_line = sys.argv[2]

    write_comments(path, comments, start_line=start_line)
