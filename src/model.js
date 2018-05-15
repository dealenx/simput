// ----------------------------------------------------------------------------
// Color palettes
// ----------------------------------------------------------------------------

const materialPalette = [
  '#8dd3c7',
  '#ffffb3',
  '#bebada',
  '#fb8072',
  '#80b1d3',
  '#fdb462',
  '#b3de69',
  '#fccde5',
  '#d9d9d9',
  '#bc80bd',
  '#ccebc5',
  '#ffed6f',
  '#51574a',
  '#447c69',
  '#74c493',
  '#8e8c6d',
  '#e4bf80',
  '#e9d78e',
  '#e2975d',
  '#f19670',
  '#e16552',
  '#c94a53',
  '#be5168',
  '#a34974',
  '#993767',
  '#65387d',
  '#4e2472',
  '#9163b6',
  '#e279a3',
  '#e0598b',
  '#7c9fb0',
  '#5698c4',
  '#9abf88',
];

const cellPalette = [
  '#1b9e77',
  '#d95f02',
  '#7570b3',
  '#e7298a',
  '#66a61e',
  '#e6ab02',
  '#a6761d',
  '#666666',
];

const rodPalette = [
  '#e41a1c',
  '#377eb8',
  '#4daf4a',
  '#984ea3',
  '#ff7f00',
  '#ffff33',
  '#a65628',
  '#f781bf',
  '#999999',
];

const mapPalette = [
  '#e41a1c',
  '#377eb8',
  '#4daf4a',
  '#984ea3',
  '#ff7f00',
  '#ffff33',
  '#a65628',
  '#f781bf',
  '#999999',
];

// ----------------------------------------------------------------------------
// Model definition
// ----------------------------------------------------------------------------

module.exports = {
  scripts: [
    // 'https://unpkg.com/@doe-casl/verain-view@1.1.1/dist/simput-external-vera.js',
    'simput-external-vera.js',
  ],
  defaultActiveView: 'Specifications',
  order: ['Specifications', 'Materials', 'Grids'],
  views: {
    Specifications: {
      label: 'Specifications',
      attributes: ['coreSpec', 'assemblySpec', 'baffleSpec'],
      hooks: [
        {
          type: 'copyToExternal',
          src: 'data.Specifications.0.assemblySpec.pitch.value.0',
          dst: 'viz.cellPitch',
        },
        {
          type: 'copyToExternal',
          src: 'data.Specifications.0.assemblySpec.grid.value.0',
          dst: 'viz.assemblyGridSize',
        },
        {
          type: 'copyToExternal',
          src: 'data.Specifications.0.coreSpec.grid.value.0',
          dst: 'viz.coreGridSize',
        },
        {
          type: 'copyToExternal',
          src: 'data.Specifications.0.coreSpec.height.value.0',
          dst: 'viz.core.height',
        },
      ],
    },
    Materials: {
      label: 'Materials',
      attributes: ['material'],
      size: -1,
      readOnly: true,
      hooks: [
        { type: 'copyParameterToViewName', attribute: 'material.name' },
        { type: 'specsToExternal' },
        { type: 'materialsToExternal' },
        { type: 'addNextView', viewName: 'Materials', nextViewName: 'Cells' },
      ],
    },
    Cells: {
      label: 'Cells',
      attributes: ['cell'],
      hooks: [
        { type: 'copyParameterToViewName', attribute: 'cell.name' },
        { type: 'cellsToExternal' },
        { type: 'updateMaterialUsed' },
        { type: 'addNextView', viewName: 'Cells', nextViewName: 'Rods' },
        {
          type: 'copy',
          src: 'data.Specifications.0.assemblySpec.pitch.value.0',
          dst: 'cell.pitch',
        },
      ],
      size: -1,
      readOnly: true,
    },
    Rods: {
      label: 'Rods',
      attributes: ['rodInfo', 'rodStack'],
      size: -1,
      readOnly: true,
      hooks: [
        { type: 'copyParameterToViewName', attribute: 'rodInfo.name' },
        { type: 'updateCellUsed' },
        {
          type: 'copy',
          src: 'data.Specifications.0.coreSpec.height.value.0',
          dst: 'rodInfo.height',
        },
        { type: 'rodsToExternal' },
        { type: 'addNextView', viewName: 'Rods', nextViewName: 'Maps' },
      ],
    },
    Maps: {
      label: 'Rod maps',
      attributes: ['mapInfo', 'rodMap'],
      size: -1,
      readOnly: true,
      hooks: [
        { type: 'updateRodUsed' },
        { type: 'mapsToExternal' },
        { type: 'copyParameterToViewName', attribute: 'mapInfo.name' },
        {
          type: 'addNextView',
          viewName: 'Maps',
          insertAfter: 'Grids',
          nextViewName: 'Core',
        },
      ],
    },
    Grids: {
      label: 'Grids',
      attributes: ['spacer'],
      size: -1,
      readOnly: true,
      hooks: [{ type: 'copyParameterToViewName', attribute: 'spacer.name' }],
    },
    Core: {
      label: 'Core map',
      children: ['CoreAssemblyMap', 'CoreControlInsertMap', 'CoreDetectorMap'],
      hooks: [{ type: 'coreToExternal' }],
    },
    CoreAssemblyMap: {
      label: 'Assemblies',
      attributes: ['coreMapInfo', 'coreMap'],
      hooks: [{ type: 'coreToExternal' }],
    },
    CoreControlInsertMap: {
      label: 'Controls and Inserts',
      attributes: ['coreMapInfo', 'coreMap'],
      hooks: [{ type: 'coreToExternal' }],
    },
    CoreDetectorMap: {
      label: 'Detectors',
      attributes: ['coreMapInfo', 'coreMap'],
      hooks: [{ type: 'coreToExternal' }],
    },
  },
  definitions: {
    coreSpec: {
      label: 'Core Specifications',
      parameters: [
        {
          id: 'title',
          type: 'string',
          size: 1,
          label: 'Title',
        },
        {
          id: 'grid',
          type: 'int',
          size: 1,
          default: 15,
          label: 'Size',
          help: 'Size of the grid for the core',
        },
        {
          id: 'apitch',
          type: 'float',
          size: 1,
          default: 21.5,
          label: 'Assembly pitch',
          help: 'Default assembly spacing in core maps, in cm',
        },
        {
          id: 'height',
          type: 'float',
          size: 1,
          default: 400,
          label: 'Core height',
          help: 'Height of the core, in cm.',
        },
      ],
    },
    assemblySpec: {
      label: 'Assembly Specifications',
      parameters: [
        {
          id: 'grid',
          type: 'int',
          size: 1,
          default: 17,
          label: 'Size',
          help: 'Size of the grid for an assembly',
        },
        {
          id: 'pitch',
          type: 'float',
          size: 1,
          default: 1.26,
          label: 'Cell pitch',
          help: 'Default cell pitch in assemblies, in cm',
        },
      ],
    },
    baffleSpec: {
      label: 'Baffle Specifications',
      parameters: [
        {
          id: 'thick',
          type: 'float',
          size: 1,
          default: 0,
          label: 'Thickness',
        },
        {
          id: 'gap',
          type: 'float',
          size: 1,
          default: 0,
          label: 'Gap',
        },
        {
          id: 'material',
          type: 'int',
          size: 1,
          ui: 'enum',
          domain: {
            dynamic: true,
            external: 'materialEnum',
          },
          label: 'Material',
        },
      ],
    },
    material: {
      label: 'Material definition',
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          default: 'New Material',
          label: 'Name',
        },
        {
          id: 'color',
          propType: 'Color',
          label: 'Associated color',
          default: [204 / 255, 235 / 255, 197 / 255],
          domain: {
            palette: materialPalette,
          },
        },
        {
          id: 'density',
          type: 'float',
          size: 1,
          default: 1,
          label: 'Density',
        },
        {
          id: 'thexp',
          type: 'float',
          size: 1,
          default: 1,
          label: 'Thermal Expansion Coefficient',
        },
        {
          id: 'fractions',
          ui: 'map',
          label: 'Material fractions (material:fraction)',
        },
      ],
    },
    cell: {
      label: 'Cell definition',
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          default: 'New Cell',
          label: 'Name',
        },
        {
          id: 'pitch',
          type: 'float',
          size: 1,
          default: 0,
          label: 'Contact radius/pitch',
          domain: {
            readOnly: true,
          },
        },
        {
          id: 'color',
          propType: 'Color',
          label: 'Associated color',
          default: [204 / 255, 235 / 255, 197 / 255],
          domain: {
            palette: cellPalette,
          },
        },
        {
          id: 'cell',
          propType: 'CellEditor',
          size: 1,
          default: {
            name: 'Cell name',
            radii: [],
            mats: [],
          },
          domain: {
            dynamic: true,
            external: 'viz',
          },
          label: 'Cell',
        },
      ],
    },
    rodInfo: {
      label: 'Rod description',
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          default: 'New Rod',
          label: 'Name',
        },
        {
          id: 'color',
          propType: 'Color',
          label: 'Associated color',
          default: [204 / 255, 235 / 255, 197 / 255],
          domain: {
            palette: rodPalette,
          },
        },
        {
          id: 'height',
          type: 'string',
          size: 1,
          default: '',
          label: 'Rod height',
          domain: {
            readOnly: true,
          },
        },
        {
          id: 'offset',
          type: 'float',
          size: 1,
          default: 0,
          label: 'Rod offset',
        },
      ],
    },
    rodStack: {
      label: 'Axial definition',
      parameters: [
        {
          id: 'rod',
          propType: 'RodEditor',
          size: 1,
          default: {
            stack: [],
          },
          domain: {
            dynamic: true,
            external: 'viz',
          },
          label: 'Rod',
        },
      ],
    },
    mapInfo: {
      label: 'Rod map',
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          default: 'Assembly',
          label: 'Name',
        },
        {
          id: 'color',
          propType: 'Color',
          label: 'Associated color',
          default: [204 / 255, 235 / 255, 197 / 255],
          domain: {
            palette: mapPalette,
          },
        },
      ],
    },
    rodMap: {
      label: 'Layout definition',
      parameters: [
        {
          id: 'map',
          propType: 'AssemblyEditor',
          size: 1,
          default: {
            emptyItem: '0',
            grid: [],
          },
          domain: {
            dynamic: true,
            external: 'viz',
          },
          label: 'Rod Map',
        },
      ],
    },
    spacer: {
      label: 'Spacer grid',
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          label: 'Name',
        },
        {
          id: 'height',
          type: 'float',
          size: 1,
          default: 3.8,
          label: 'Height',
        },
        {
          id: 'mass',
          type: 'float',
          size: 1,
          default: 1000,
          label: 'Mass',
        },
        {
          id: 'loss',
          type: 'float',
          size: 1,
          default: 0.9,
          label: 'Loss',
        },
        {
          id: 'axisPositions',
          type: 'float',
          layout: '-1',
          default: 0,
          label: 'Axial positions',
        },
      ],
    },
    coreMapInfo: {
      label: 'Core map description',
      parameters: [
        {
          id: 'title',
          type: 'string',
          size: 1,
          label: 'Title',
        },
      ],
    },
    coreMap: {
      label: 'Layout',
      parameters: [
        {
          id: 'map',
          propType: 'CoreEditor',
          size: 1,
          default: {
            emptyItem: '0',
            grid: [],
          },
          domain: {
            dynamic: true,
            external: 'viz',
          },
        },
      ],
    },
  },
};
