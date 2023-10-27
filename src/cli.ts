#!/usr/bin/env node

import { Command, Option } from 'commander';
import * as fs from 'fs';
import packageJson from '../package.json';
import Treegen from './Treegen';
import { exit } from 'process';
import { IPrintTreeOptions, TreegenStructure } from './types';

/**
 * CLI tool for generating and visualizing directory tree structures.
 *
 * @command treegen
 * @description CLI tool for generating and visualizing directory tree structures.
 *
 * @version 1.0.0
 */
export class CLI {
  /**
   * Generate a directory tree structure and output to the console or a file.
   * @command generate-tree
   * @description Generate a directory tree structure and output to the console or a file.
   *
   * @param {object} options - Command options.
   * @param {TreegenStructure} options.structure - Directory tree structure.
   * @param {string} options.output - Output destination file path.
   * @param {string} options.dir - Directory path to scan.
   * @param {string} options.encoding - Encoding of file structure (default: 'utf-8').
   * @param {boolean} options.typeMarker - Include type markers in the structure (default: false).
   * @param {string} options.root - The name of the root directory in the structure (default: 'root').
  //  * @param {string} options.indent - Indentation configuration (e.g., 'spaces' or 'tabs').
   * @param {string} options.indentCharacter - The character to use for indentation (default: '-').
   * @param {number} options.tabs - The number of spaces to represent a single level of indentation (default: 4).
   * @param {string} options.treeCharacter - The character to use for tree representation (default: '|').
   * @param {boolean} options.useTreeCharacter - Whether to use the "tree-character" for tree representation (default: true).
   * @param {string} options.inDirCharacter - The character to use for indicating that we are inside a directory (default: '/').
   * @param {boolean} options.useInDirCharacter - Whether to use the "in-dir-character" for indicating that we are inside a directory (default: false).
   * @param {string[]} options.ignore - Patterns to ignore.
   */
  static generateTree(options: {
    structure?: TreegenStructure;
    output?: string;
    dir?: string;
    encoding?: string;
    typeMarker?: boolean;
    root?: string;
    indent?: string;
    indentCharacter?: string;
    tabs?: string;
    treeCharacter?: string;
    useTreeCharacter?: boolean;
    inDirCharacter?: string;
    useInDirCharacter?: boolean;
    ignore?: string[];
  }) {
    const {
      dir,
      encoding = 'utf-8',
      typeMarker,
      root: rootName,
      indent,
      indentCharacter,
      tabs,
      treeCharacter,
      useTreeCharacter,
      inDirCharacter,
      useInDirCharacter,
      ignore,
    } = options;

    try {
      let structure = options.structure;

      if (structure)
        structure = String(
          fs.readFileSync(structure, { encoding: encoding as any, flag: 'r' })
        ) as TreegenStructure;

      const root = Treegen.generateTree({
        dirPath: dir,
        structure,
        useTypeMarker: typeMarker,
        rootName,
        ignoreRules: ignore as any,
      });

      let destFilePath;
      let output: IPrintTreeOptions['output'] = options.output as IPrintTreeOptions['output'];

      if (output && typeof output === 'string') {
        destFilePath = output;
        output = 'file';
      }

      root.printTree({
        indent,
        indentCharacter,
        tabs: Number(tabs),
        treeCharacter,
        useTreeCharacter,
        inDirCharacter,
        useInDirCharacter,
        output,
        destFilePath,
      });
    } catch (error) {
      console.error(error, '❌');
      exit(1);
    }
  }

  /**
   * Validate treegen structure from a file.
   * @command validate
   * @description Validate treegen structure from a file.
   * 
   * @param {object} options - Command options.
   * @param {string} options.file - File path to validate structure.
   * @param {string} options.encoding - Encoding of file structure. (default: "utf-8")
   * @param {string} options.root - The name of the root directory in the structure. (default: "root")
   */
  static validateStructure(options: {
    file: string;
    encoding: string;
    root: string;
  }) {
    try {
      const { file, encoding, root } = options;

      const structure = String(fs.readFileSync(file, { encoding: encoding as any, flag: 'r' }));

      const isValid = Treegen.isValidStructure(structure, root);

      if (isValid) {
        console.log('The structure is valid. ✅');
      } else {
        console.error('The structure is not valid. ❌');
      }
    } catch (error) {
      console.error(error, '❌');
      exit(1);
    }
  }
  /**
   * Scan a directory and output its structure.
   * @command scan-dir
   * @description Scan a directory and output its structure.
   *
   * @param {object} options - Command options.
   * @param {string} options.dir - Directory path to scan. (default: "./")
   * @param {Array<string>} options.ignore - Patterns to ignore. (default: [])
   * @param {boolean} options.typeMarker - Include type markers in the structure. (default: false)
   * @param {string} options.root - The name of the root directory in the structure. (default: "root")
   */
  static scanDir(options: {
    dir: string;
    ignore: string[];
    typeMarker: boolean;
    root: string;
  }) {
    const { dir, ignore, typeMarker, root } = options;

    try {
      const structure = Treegen.scanDir({
        dirPath: dir,
        ignoreRules: ignore,
        typeMarker,
        root,
      });

      console.log(structure);
    } catch (error) {
      console.error(error, '❌');
      exit(1);
    }
  }
}

const cli = new Command();

cli
  .name('treegen')
  .description(
    'CLI tool for generating and visualizing directory tree structures.'
  )
  .version(packageJson.version, '-v, --version', 'Output the current version');

cli
  .command('scan-dir')
  .description('Scan a directory and output the structure.')
  .addOption(
    new Option('-d, --dir <directory-path>', 'Directory path to scan.').default(
      './'
    )
  )
  .addOption(
    new Option('--ignore <reg-exp-patterns...>', 'Patterns to ignore.').default(
      []
    )
  )
  .addOption(
    new Option(
      '--type-marker',
      'Include type markers in the structure.'
    ).default(false)
  )
  .addOption(
    new Option(
      '--root <name>',
      'The name of the root directory in the structure.'
    ).default('root')
  )
  .action(CLI.scanDir);

cli
  .command('validate')
  .description('Validate treegen structure from a file.')
  .addOption(
    new Option('-f, --file <file-path>', 'File path to validate structure.')
  )
  .addOption(
    new Option('--encoding <encoding>', 'Encoding of file structure')
      .choices(['utf-8'])
      .default('utf-8')
  )
  .addOption(
    new Option(
      '--root <name>',
      'The name of the root directory in the structure.'
    ).default('root')
  )
  .action(CLI.validateStructure);

cli
  .command('generate-tree')
  .description(
    'Generate a directory tree structure and output to the console or a file.'
  )
  .addOption(
    new Option('-d, --dir <directory-path>', 'Directory path to scan.')
  )
  .addOption(
    new Option('-s, --structure <file-path>', 'File to treegen structure.')
  )
  .addOption(
    new Option('--encoding <encoding>', 'Encoding of file structure')
      .choices(['utf-8'])
      .default('utf-8')
  )
  .addOption(
    new Option(
      '-o, --output <file-path>',
      'File path to save the tree structure.'
    )
  )
  .addOption(
    new Option(
      '--type-marker',
      'Include type markers in the structure.'
    ).default(false)
  )
  .addOption(
    new Option(
      '--root <name>',
      'The name of the root directory in the structure.'
    ).default('root')
  )
  .addOption(
    new Option(
      '--indent-character <char>',
      'The character to use for indentation.'
    ).default('-')
  )
  .addOption(
    new Option(
      '-t, --tabs <tabs>',
      'The number of spaces to represent a single level of indentation. Used to repeat the indentation character.'
    ).default(4)
  )
  .addOption(
    new Option(
      '--tree-character <char>',
      'The character to use for tree representation.'
    ).default('|')
  )
  .addOption(
    new Option(
      '--use-tree-character',
      'Whether to use the "tree-character" for tree representation.'
    ).default(true)
  )
  .addOption(
    new Option(
      '--in-dir-character <char>',
      'The character to use for indicating that we are inside a directory (conditional based on useTypeMarker option of Treegen.generateTree and typeMarker of Treegen.scanDir).'
    ).default('/')
  )
  .addOption(
    new Option(
      '--use-in-dir-character',
      'Whether to use the "in-dir-character" for indicating that we are inside a directory (conditional based on useTypeMarker option of Treegen.generateTree and typeMarker of Treegen.scanDir).'
    ).default(false)
  )
  .addOption(
    new Option(
      '--ignore <reg-exp-patterns...>',
      'Patterns that match the file(s) to ignore.'
    ).default([])
  )
  .action(CLI.generateTree);

cli.parse(process.argv);
