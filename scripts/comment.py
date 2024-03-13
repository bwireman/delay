#!/usr/bin/env python3
import sys

def clean_declaration(dec, export=True):
    func_replacement = "function"
    type_replacement = "type"
    if export:
        func_replacement = f"export {func_replacement}"
        type_replacement = f"export {type_replacement}"

    return dec.replace("pub fn", func_replacement).replace("pub opaque type", type_replacement)


def gen_comments(export=True):
    comments = dict()
    with open('./comments.tmp') as f:
        # cleanup and split lines
        comments_and_declaration = filter(bool, f.read().split('--'))
        comments_and_declaration = map(lambda v: v.split('\n'), comments_and_declaration)
        comments_and_declaration = filter(bool, comments_and_declaration)
        for line in comments_and_declaration:
            # cleanup + group comments and declarations
            lines = map(lambda v: v.strip(), line)
            lines = filter(bool, lines)
            lines = list(lines)
            if len(lines) <= 1:
                continue

            declaration = clean_declaration(lines[-1], export=export)
            full_comment = "\n".join(lines[:-1]).replace("///", "*")
            comments[declaration] = f"""
/**
{full_comment}
*/"""

    return comments


def write_comments(file_path, lines, start_line=None):
    out = ""
    found_start_line = start_line is None

    with open(file_path) as f:
        for line in f.readlines():
            if start_line is not None and not found_start_line and start_line in line:
                found_start_line = True

            if found_start_line:
                for declaration, comment in lines.items():
                    if line.startswith(declaration):
                        out += f"{comment}\n"
                        break

            out += line

    with open(file_path, "w") as f:
        f.write(out)


if __name__ == "__main__":
    path = sys.argv[1]
    export = path.endswith(".mts")
    start_line = None
    if len(sys.argv) > 2:
        start_line = sys.argv[2]

    comments = gen_comments(export=export)
    write_comments(path, comments, start_line=start_line)
