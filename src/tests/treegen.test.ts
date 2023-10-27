import { TreegenStructure } from '../types';
import Treegen from '../Treegen';
import Node from '../Node';

describe('Treegen', () => {
  let structure: TreegenStructure = '\n';

  it('Should generate a file structure', () => {
    const dirPath = 'E:/project/herojs/packages/treegen/src';
    const expected = `root>index.ts
root>Node.ts
root>tests
root>tests>treegen.test.ts
root>Treegen.ts
root>types.ts
`;

    structure = Treegen.scanDir({ dirPath, ignoreRules: [/cli.ts/] });
    expect(structure).toBe(expected);
  });

  it('Should generate a file structure with file type marker (d::/f::)', () => {
    const dirPath = 'E:/project/herojs/packages/treegen/src';
    const expected = `root>f::index.ts
root>f::Node.ts
root>d::tests
root>tests>f::treegen.test.ts
root>f::Treegen.ts
root>f::types.ts
`;

    structure = Treegen.scanDir({
      dirPath,
      root: 'root',
      typeMarker: true,
      ignoreRules: [/cli.ts/],
    });
    expect(structure).toBe(expected);
  });

  let root: Node;

  it('Should generate tree from structure', () => {
    root = Treegen.generateTree({ structure });

    expect(root instanceof Node).toBe(true);
  });

  it('Should generate tree from a directory scan', () => {
    root = Treegen.generateTree({
      dirPath: './src',
      rootName: '~',
      useTypeMarker: true,
      ignoreRules: [/cli.ts/],
    });

    expect(root instanceof Node && root.name === '~').toBe(true);
  });

  it('Should return file tree', () => {
    const expected = `
~/
  index.ts
  Node.ts
  tests/
    treegen.test.ts
  Treegen.ts
  types.ts
`;
    root.buildTree({
      // treeCharacter: '.',
      indentCharacter: ' ',
      useTreeCharacter: false,
      useInDirCharacter: true,
      tabs: 2,
    });
    expect(root.getTree.trim()).toBe(expected.trim());
  });
});
