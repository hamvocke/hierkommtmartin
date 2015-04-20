#! /bin/env python

import time, sys

def clear():
    """Clear screen, return cursor to top left"""
    sys.stdout.write('\033[2J')
    sys.stdout.write('\033[H')
    sys.stdout.flush()

asciiString = """
Martin
Martin
Martin
"""

def pad(padding, string):
    return "\n".join([" "*padding + s for s in string.splitlines()])

def printWithOffset(padding):
    clear()
    print(pad(padding, asciiString))
    time.sleep(0.07)

for i in range(0, 30):
    printWithOffset(i)

for i in range(0, 30):
    printWithOffset(30-i)
