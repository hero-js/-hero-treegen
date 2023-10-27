# Treegen - Directory Tree Structure Generator

Treegen is a TypeScript package that provides functionality for generating and working with directory tree structures. It includes a command-line interface (CLI) for scanning directories, validating directory structures, and generating tree visualizations.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![TypeScript](https://img.shields.io/badge/language-TypeScript-blue.svg)

## Features

- **Scan Directory**: Scan a directory and output its structure.
- **Validate Structure**: Validate directory structures from a file.
- **Generate Tree Visualization**: Generate directory tree structures and customize the appearance.

## Installation

To use Treegen in your TypeScript project, you can install it via npm:

```bash
npm install -g treegen
```

## Usage

Treegen can be used both programmatically and via the command line. Below are the available commands and their usage.

### CLI Commands

#### Scan a Directory and Output Its Structure

```bash
treegen scan-dir -d <directory-path>
```

- `-d, --dir`: The directory path to scan.

#### Validate Directory Structure

```bash
treegen validate -f <file-path>
```

- `-f, --file`: The file path to validate the directory structure.

#### Generate Tree Visualization

```bash
treegen generate-tree -d <directory-path> -s <structure-file>
```

- `-d, --dir`: The directory path to scan.
- `-s, --structure`: The file containing the directory structure.

For more options and customizations, refer to the [cli documentation](CLI_DOC.md).

### Programmatically

Treegen can also be used programmatically in your TypeScript projects. Here's an example of how to use it:

```typescript
import { Treegen, Node } from 'treegen';

// Create a Treegen instance
const treegen = new Treegen();

// Scan a directory and generate a tree structure
const structure = treegen.scanDir('/path/to/directory');

// Validate a directory structure from a file
const isValid = treegen.isValidStructure(structure);

// Generate a tree visualization
const rootNode = treegen.generateTree({ structure });
rootNode.printTree();
```

## Examples

Here are some example outputs based on the provided code and the CLI commands:

### Example 1: Scanning a Directory and Outputting Its Structure

```bash
$ treegen scan-dir -d /path/to/directory
```

**Output:**

```
root>index.ts
root>Node.ts
root>tests
root>tests>treegen.test.ts
root>Treegen.ts
root>types.ts
```

### Example 2: Validating a Directory Structure

```bash
# The content of structure.txt looks like the previous output of example 1.
$ treegen validate -f structure.txt
```

**Output:**

```
The structure is valid. ✅
```

### Example 3: Generating a Tree Visualization

```bash
$ treegen generate-tree -d /path/to/directory -s structure.txt
```

**Output:**

```
root
|----cli.ts
|----index.ts
|----Node.ts
|----tests
|    |----treegen.test.ts
|----Treegen.ts
|----types.ts
```

Please note that the actual output may vary based on the structure of your directory or the content of the `structure.txt` file. The above examples are for illustration purposes and should reflect the expected behavior of your CLI commands.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG](CHANGELOG.md) for details on changes and new features.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING](https://github.com/hero-js/hero/blob/main/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Contact

If you have any questions or feedback, feel free to reach out to [yasfp.pro@gmail.com].
