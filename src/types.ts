/**
 * Represents an interface for building tree options.
 *
 * @interface
 */
export interface IBuildTreeOptions {
  indent?: string;
  indentCharacter?: string;
  level?: number;
  tabs?: number;
  treeCharacter?: string;
  useTreeCharacter?: boolean;
  inDirCharacter?: string;
  useInDirCharacter?: boolean;
}

/**
 * Represents an interface for printing tree options.
 *
 * @interface
 * @extends IBuildTreeOptions
 */
export interface IPrintTreeOptions extends IBuildTreeOptions {
  output?: 'console' | 'file';
  destFilePath?: string;
}

/**
 * Represents a line in the Treegen structure.
 *
 * @type {string}
 */
export type TreegenStructureLine =
  | `${string}${string extends '' ? '' : '>'}${string}`
  | '';

/**
 * Represents the structure of the Treegen.
 *
 * @type {string}
 */
export type TreegenStructure =
  `${TreegenStructureLine}${TreegenStructureLine extends ''
    ? ''
    : '\n'}${TreegenStructureLine}`;

/**
 * Represents a type of Node (file, directory, any).
 *
 * @type {string}
 */
export type NodeType = 'file' | 'dir' | 'any';

// TODO: Populate jsdoc for interfaces properties
