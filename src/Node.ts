import * as fs from 'fs';
import { IBuildTreeOptions, IPrintTreeOptions, NodeType } from './types';

/**
 * Represents a Node in the Treegen structure.
 */
export default class Node {
  children: Node[] = [];

  private tree = '';

  /**
   * Constructor for the Node class.
   *
   * @constructor
   * @param {string} name - The name of the Node.
   * @param {NodeType} nodeType - The type of the Node.
   */
  constructor(public name: string, public nodeType: NodeType = 'any') {}

  /**
   * Get the generated tree.
   *
   * Must be called after Node.buildTree
   *
   * @readonly
   */
  get getTree() {
    return this.tree;
  }

  /**
   * Add a child Node to the current Node.
   *
   * @param {Node} child - The child Node to add.
   */
  addChild(child: Node) {
    this.children.push(child);
  }

  /**
   * Generate the indentation for the tree structure.
   *
   * @param {number} level - The level of indentation.
   * @param {string} treeIndent - The tree indent characters.
   * @returns {string} The generated indentation.
   */
  private genIndent(level: number, treeIndent: string) {
    return `${level > 0 ? treeIndent : ''}`;
  }

  /**
   * Build the tree structure starting from the current Node.
   *
   * @param {IBuildTreeOptions} options - Options for building the tree.
   * @param {string} options.indent - Never fill in.
   * @param {string} options.indentCharacter - The character to use for indentation. Default: '-'
   * @param {number} options.level - The current level of the Node in the tree structure. The first node must always be level 0
   * @param {number} options.tabs - The number of spaces to represent a single level of indentation. Used to repeat the indentation character. Default: 4
   * @param {string} options.treeCharacter - The character to use for tree representation. Default: '|'
   * @param {boolean} options.useTreeCharacter - Whether to use the 'treeCharacter' for tree representation. Default: true
   * @param {string} options.inDirCharacter - The character to use for indicating that we are inside a directory (conditional based on useTypeMarker option of Treegen.generateTree and typeMarker of Treegen.scanDir). Default: '/'
   * @param {boolean} options.useInDirCharacter - Whether to use the 'inDirCharacter' for indicating that we are inside a directory (conditional based on useTypeMarker option of Treegen.generateTree and typeMarker of Treegen.scanDir). Default: true
   */
  buildTree(options: IBuildTreeOptions = {}) {
    const {
      level = 0,
      indentCharacter = '-',
      tabs = 4,
      treeCharacter = '|',
      useTreeCharacter = true,
      inDirCharacter = '/',
      useInDirCharacter = true,
    } = options;

    const indent =
      options.indent +
      `${useTreeCharacter ? treeCharacter : ''}` +
      indentCharacter.repeat(tabs);

    this.tree +=
      `${this.genIndent(level, indent)}${this.name}` +
      `${useInDirCharacter && this.nodeType === 'dir' ? inDirCharacter : ''}` +
      '\n';

    for (const child of this.children) {
      child.buildTree({
        ...options,
        indent: this.genIndent(
          level,
          options.indent +
            `${useTreeCharacter ? treeCharacter : ''}` +
            ' '.repeat(tabs)
        ),
        level: level + 1,
      });

      this.tree += child.getTree;
    }
  }

  /**
   * Print the generated tree structure to the console or a file.
   *
   * @param {IPrintTreeOptions} options - Options for printing the tree.
   * @param {string} options.destFilePath - The path to the file where the tree structure should be saved (when 'output' is 'file'). Default: './structure.txt'
   * @param {string} options.output - Determines where the tree structure should be printed, either 'console' or 'file'. Default: 'console'
   */
  printTree(options: IPrintTreeOptions = {}) {
    const { destFilePath = './structure.txt', output = 'console' } = options;
    this.buildTree(options);

    if (output === 'file') {
      fs.writeFileSync(destFilePath, this.getTree);
      console.log('Treegen: tree generate ✅');
    } else console.log(this.getTree);
  }
}
