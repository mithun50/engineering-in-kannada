# Kannadafy: When Python Meets Kannada

*Transform your Python code into beautiful Kannada script with this quirky obfuscation tool*

![Python Version](https://img.shields.io/badge/python-3.6%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Introduction

Have you ever looked at your Python code and thought, "This looks too... readable"? Well, I've recently discovered a fascinating tool that adds a unique linguistic twist to your code. Meet **Kannadafy** – a quirky little tool that transforms ordinary Python scripts into an artistic jumble of Kannada characters while keeping them fully executable.

Created by Mithun Gowda B and Manvanth, Kannadafy represents a playful intersection of programming and linguistics. It's not meant to provide industrial-strength code protection but rather serves as a fun experiment that can help you learn about language encoding and Python internals.

## What Does Kannadafy Actually Do?

At its core, Kannadafy is an obfuscation tool. It takes your perfectly readable Python code like this:

```python
print("Hello, World!")
```

And transforms it into something that looks like this:

```python
exec("".join(map(chr,[int("".join(str({'ಅ': 0,
 'ಅ:': 14,
 'ಅಂ': 13,
 'ಆ': 1,
 'ಇ': 2,
 'ಈ': 3,
 'ಉ': 4,
 'ಊ': 5,
 'ಋ': 6,
 'ಎ': 7,
 'ಏ': 8,
 'ಐ': 9,
 'ಒ': 10,
 'ಓ': 11,
 'ಔ': 12,
 'ಕ': 15,
...
```

The amazing part? The obfuscated script still runs perfectly fine! The tool maps each character in your Python code to Kannada letters and wraps everything in an `exec()` function that the Python interpreter can understand.

## Why Would Anyone Want This?

Good question! While Kannadafy doesn't provide industrial-strength security (and doesn't claim to), it offers several interesting use cases:

1. **Learning Experience**: It's a hands-on way to understand character encoding, script mapping, and Python's `exec()` functionality.

2. **Puzzle Creation**: Create code puzzles for fellow programmers or students.

3. **Just for Fun**: Sometimes coding is about exploration and creativity rather than pure utility.

4. **Cultural Appreciation**: It introduces users to the beautiful Kannada script, potentially sparking interest in this ancient language.

## Getting Started with Kannadafy

If you're intrigued enough to try Kannadafy yourself, getting started is quite simple:

### Installation

```bash
# Via pip (coming soon)
pip install Kannadafy

# Or directly from GitHub
git clone https://github.com/mithun50/Kannadafy.git
cd Kannadafy
pip install .
```

### Basic Usage

The command-line interface makes it easy to transform your Python scripts:

```bash
python -m Kannadafy -i input_script.py -o obfuscated_script.py
```

You can also integrate Kannadafy directly into your Python code:

```python
from Kannadafy import obfuscate

input_file = "input_script.py"
output_file = "obfuscated_script.py"

obfuscate(input_file, output_file)
```

## Behind the Scenes: How Kannadafy Works

The magic happens in three main steps:

1. Kannadafy reads your Python script and processes each character.
2. It maps these characters to corresponding Kannada letters using a predefined dictionary.
3. The transformed code is wrapped in an `exec()` function and chunked into readable blocks.

When you run the obfuscated script, Python's interpreter does all the heavy lifting of translating the Kannada-encoded instructions back into executable operations.

## Important Note: One-Way Trip

It's worth emphasizing that Kannadafy is designed as a one-way process. Once your code is transformed into its Kannada version, there's no built-in way to convert it back to the original source. Make sure to keep a backup of your original code if you need it later!

## Why Kannada?

You might wonder why the creators chose Kannada specifically. As a South Indian language with a beautiful script, Kannada offers visually distinctive characters that create an interesting aesthetic when used for code obfuscation. Plus, it reflects the creators' cultural background and adds a unique touch to the world of programming tools.

## Final Thoughts

Kannadafy reminds us that programming isn't just about solving problems efficiently—it's also about creativity and fun. While you probably wouldn't want to use it for your production code, it's a delightful experiment that bridges the gap between computer science and linguistics.

Whether you're curious about character encoding, looking for a fun way to challenge yourself or fellow programmers, or simply appreciate the aesthetic of seeing your Python code transformed into beautiful Kannada script, Kannadafy offers a unique experience worth exploring.

Give it a try, and watch your Python code transform into something that looks like ancient mystical instructions. Just remember to keep a backup of your original code—unless you enjoy extra puzzles!

---

*Want to try Kannadafy? Visit [GitHub](https://github.com/mithun50/Kannadafy) to get started.*
