import * as fs from 'fs';
import * as path from 'path';
import Node from './Node';
import { NodeType, TreegenStructure, TreegenStructureLine } from './types';

/**
 * The Treegen class provides functionality for generating and working with directory tree structures.
 */
export default class Treegen {
  /**
   * Determines whether a filename should be ignored based on a list of ignore rules.
   *
   * @param {string} filename - The name of the file to check.
   * @param {RegExp[]} ignoreRules - An array of regular expressions used to determine if the file should be ignored.
   * @returns {boolean} True if the filename should be ignored, false otherwise.
   */
  private static shouldIgnore(
    filename: string,
    ignoreRules: RegExp[] = []
  ): boolean {
    return ignoreRules.some((rule) => rule.test(filename));
  }

  /**
   * Recursively scans a directory and generates a Treegen structure representing its contents.
   *
   * @param {Object} options - Options for scanning the directory and generating the structure.
   * @param {string} options.dirPath - The path to the directory to scan. Default: './'
   * @param {string} options.root - The name of the root directory in the structure. Default: 'root'
   * @param {RegExp[]} options.ignoreRules - An array of regular expressions used to ignore specific files or directories.
   * @param {boolean} options.typeMarker - Indicates whether to include type markers in the structure for files and directories. Default: false
   * @returns {string} A Treegen structure representing the directory's contents.
   */
  static scanDir(options: {
    dirPath?: string;
    root?: string;
    ignoreRules?: RegExp[];
    typeMarker?: boolean;
  }): TreegenStructure {
    const {
      dirPath = './',
      root = 'root',
      ignoreRules = [],
      typeMarker = false,
    } = options;
    const files = fs.readdirSync(dirPath);
    let structure = '';

    for (const file of files) {
      if (Treegen.shouldIgnore(file, ignoreRules)) continue;

      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        structure += `${root}>${typeMarker ? 'd::' : ''}${file}\n`;
        structure += Treegen.scanDir({
          ...options,
          dirPath: filePath,
          root: `${root}>${file}`,
        });
      } else {
        structure += `${root}>${typeMarker ? 'f::' : ''}${file}\n`;
      }
    }

    return structure as TreegenStructure;
  }

  /**
   * Checks whether the provided structure is a valid Treegen structure.
   *
   * @param {string} structure - The Treegen structure to validate.
   * @param {string} root - The name of the root directory in the structure. Default: 'root'
   * @returns {boolean} True if the structure is valid, false otherwise.
   */
  static isValidStructure(structure: string, root: string = 'root'): boolean {
    const pattern = new RegExp(`^${root}>.+$`, 'gm');

    return pattern.test(structure);
  }

  /**
   * Generates a tree structure from a directory path or a provided Treegen structure.
   *
   * @param {Object} options - Options for generating the tree structure.
   * @param {string} options.dirPath - The path to the directory to scan.
   * @param {string} options.structure - A Treegen structure to use (optional).
   * @param {string} options.rootName - The name of the root directory in the structure. Default: 'root'
   * @param {boolean} options.useTypeMarker - Indicates whether to use type markers in the structure. Default: false
   * @returns {Node} The root Node of the generated tree structure.
   * @throws {TypeError} If the provided structure is not a valid Treegen structure.
   */
  static generateTree({
    dirPath,
    structure,
    rootName = 'root',
    useTypeMarker = false,
  }: {
    dirPath?: string;
    structure?: TreegenStructure;
    rootName?: string;
    useTypeMarker?: boolean;
  }): Node {
    if (!structure)
      structure = Treegen.scanDir({
        dirPath: dirPath,
        root: rootName,
        typeMarker: useTypeMarker,
      });

    if (!Treegen.isValidStructure(structure, rootName))
      throw new TypeError(
        'The given structure is not a valid Treegen structure'
      );

    const splitedStructure = structure
      .trim()
      .split('\n') as TreegenStructureLine[];
    const root = new Node(rootName, 'dir');

    for (let line of splitedStructure) {
      line = line.trim() as TreegenStructureLine;

      if (!line) continue;

      const parts = line.split('>');
      parts.shift();
      let currentNode = root;

      for (let partWithFileMarker of parts) {
        partWithFileMarker = partWithFileMarker.trim();

        if (!partWithFileMarker) continue;

        let part = partWithFileMarker;
        let nodeType: NodeType = 'any';

        if (partWithFileMarker.startsWith('f::')) {
          part = partWithFileMarker.substring(3);
          nodeType = 'file';
        } else if (partWithFileMarker.startsWith('d::')) {
          part = partWithFileMarker.substring(3);
          nodeType = 'dir';
        }

        let childNode = currentNode.children.find(
          (child) => child.name === part
        );
        if (!childNode) {
          childNode = new Node(part, nodeType);
          currentNode.addChild(childNode);
        }
        currentNode = childNode;
      }
    }

    return root;
  }
}
