#!/usr/bin/env ts-node

import { Command, Option } from 'commander';
import * as fs from 'fs';
import packageJson from '../package.json';
import Treegen from './Treegen';
import { exit } from 'process';
import { TreegenStructure } from './types';

/* -------------------------------------------------------------------------- */
/*                                  Commands                                  */
/* -------------------------------------------------------------------------- */
const program = new Command();

program
  .name('treegen')
  .description(
    'CLI tool for generating and visualizing directory tree structures.'
  )
  .version(packageJson.version, '-v, --version', 'Output the current version');

program
  .command('scan-dir')
  .description('Scan a directory and output the structure.')
  .addOption(
    new Option('-d, --dir <path>', 'Directory path to scan.').default('./')
  )
  .addOption(
    new Option('--ignore <patterns...>', 'Patterns to ignore.').default([])
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
  .action(scanDir);

program
  .command('validate')
  .description('Validate treegen structure from a file.')
  .addOption(
    new Option('-f, --file <path>', 'File path to validate structure.')
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
  .action(validateStructure);

program
  .command('generate-tree')
  .description(
    'Generate a directory tree structure and output to the console or a file.'
  )
  .addOption(new Option('-d, --dir <path>', 'Directory path to scan.'))
  .addOption(new Option('-s, --structure <path>', 'File to treegen structure.'))
  .addOption(
    new Option('--encoding <encoding>', 'Encoding of file structure')
      .choices(['utf-8'])
      .default('utf-8')
  )
  .addOption(
    new Option('-o, --output <path>', 'File path to save the tree structure.')
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
    ).default('true')
  )
  .action(generateTree);

program.parse(process.argv);

/* -------------------------------------------------------------------------- */
/*                             Commands Functions                             */
/* -------------------------------------------------------------------------- */

function generateTree(options: any) {
  const {
    dir,
    encoding,
    typeMarker,
    root: rootName,
    indent,
    indentCharacter,
    tabs,
    treeCharacter,
    useTreeCharacter,
    inDirCharacter,
    useInDirCharacter,
  } = options;

  try {
    let structure = options.structure;

    if (structure)
    structure = String(
      fs.readFileSync(structure, { encoding, flag: 'r' })
    ) as TreegenStructure;

    const root = Treegen.generateTree({
      dirPath: dir,
      structure,
      useTypeMarker: typeMarker,
      rootName,
    });

    let destFilePath;
    let output = options.output;

    if (output && typeof output === 'string') {
      destFilePath = output;
      output = 'file';
    }

    root.printTree({
      indent,
      indentCharacter,
      tabs,
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

function validateStructure(options: any) {
  try {
    const { file, encoding, root } = options;

    const structure = String(fs.readFileSync(file, { encoding, flag: 'r' }));

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

function scanDir(options: any) {
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
