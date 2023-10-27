# Treegen CLI Documentation

The Treegen CLI is a command-line tool for generating and visualizing directory tree structures. It offers several commands with various options to perform tasks related to directory structures.

## Installation

Before using Treegen CLI, make sure to install it globally or as a local dependency within your project.

### Install globally (recommended)

```bash
npm install -g treegen
```

### Install locally (within your project)

```bash
npm install treegen
```

## Commands

The Treegen CLI provides the following commands:

### `scan-dir`

Scan a directory and output its structure.

```bash
treegen scan-dir [options]
```

**Options:**

- `-d, --dir <directory-path>`: Specify the directory path to scan (default: `./`).
- `--ignore <patterns...>`: Define patterns to ignore (default: `[]`).
- `--type-marker`: Include type markers in the structure (default: `false`).
- `--root <name>`: Set the name of the root directory in the structure (default: `'root'`).

### `validate`

Validate a treegen structure from a file.

```bash
treegen validate [options]
```

**Options:**

- `-f, --file <file-path>`: Specify the file path to validate the structure.
- `--encoding <encoding>`: Define the encoding of the file structure (default: `'utf-8'`).
- `--root <name>`: Set the name of the root directory in the structure (default: `'root'`).

### `generate-tree`

Generate a directory tree structure and output it to the console or a file.

```bash
treegen generate-tree [options]
```

**Options:**

- `-d, --dir <directory-path>`: Specify the directory path to scan.
- `-s, --structure <file-path>`: Use a predefined treegen structure from a file.
- `--encoding <encoding>`: Define the encoding of the file structure (default: `'utf-8'`).
- `-o, --output <file-path>`: Save the tree structure to a file.
- `--type-marker`: Include type markers in the structure (default: `false`).
- `--root <name>`: Set the name of the root directory in the structure (default: `'root'`).
- `--indent-character <char>`: Define the character used for indentation (default: `'-'`).
- `-t, --tabs <tabs>`: Define the number of spaces to represent a single level of indentation (default: `4`).
- `--tree-character <char>`: Define the character used for tree representation (default: `'|'`).
- `--use-tree-character`: Determine whether to use the "tree-character" for tree representation (default: `true`).
- `--in-dir-character <char>`: Define the character used for indicating that we are inside a directory (default: `'/'`).
- `--use-in-dir-character`: Determine whether to use the "in-dir-character" for indicating that we are inside a directory (default: `false`).

## Usage Examples

Here are some usage examples for the Treegen CLI commands:

### Scan a Directory

```bash
treegen scan-dir -d /path/to/directory --ignore .git node_modules -root mydir
```

This command scans the `/path/to/directory`, ignores `.git` and `node_modules`, includes type markers, and sets the root directory name to `mydir`.

### Validate a Structure

```bash
treegen validate -f structure.txt --encoding utf-8
```

This command validates the structure in the `structure.txt` file using UTF-8 encoding.

### Generate a Directory Tree

```bash
treegen generate-tree -d /path/to/directory -o tree_structure.txt --type-marker --indent-character '+' --tabs 2
```

This command generates a directory tree for `/path/to/directory`, includes type markers, and saves the structure to `tree_structure.txt`. It uses `+` for indentation and 2 spaces per level.
