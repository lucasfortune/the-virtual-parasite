import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Virtual Parasites',
  description: 'PhD Research Hub - Data-driven mechanical models of T. brucei',

  // Base URL for GitHub Pages deployment
  base: '/the-virtual-parasite/',

  // Source directory containing content
  srcDir: '.',

  // Exclude development files from build
  srcExclude: ['**/dev/**', '**/node_modules/**', '**/.vitepress/**', '**/README.md'],

  // Clean URLs (no .html extension)
  cleanUrls: true,

  // Rewrite paths to create clean URL structure
  rewrites: {
    // Main pages
    'src/index.md': 'index.md',
    'src/workspace/index.md': 'workspace/index.md',
    'src/autostructn2v/index.md': 'autostructn2v/index.md',

    // Workspace custom content - tutorials
    'src/workspace/tutorials/index.md': 'workspace/tutorials/index.md',
    'src/workspace/tutorials/getting-started.md': 'workspace/tutorials/getting-started.md',
    'src/workspace/tutorials/first-segmentation.md': 'workspace/tutorials/first-segmentation.md',
    'src/workspace/tutorials/denoising-workflow.md': 'workspace/tutorials/denoising-workflow.md',

    // Workspace custom content - guides
    'src/workspace/guides/index.md': 'workspace/guides/index.md',
    'src/workspace/guides/best-practices.md': 'workspace/guides/best-practices.md',

    // AutoStructN2V custom content - examples
    'src/autostructn2v/examples/index.md': 'autostructn2v/examples/index.md',
    'src/autostructn2v/examples/electron-microscopy.md': 'autostructn2v/examples/electron-microscopy.md',

    // Workspace docs: docs/manual/** -> workspace/docs/**
    'docs/manual/:path*': 'workspace/docs/:path*',

    // AutoStructN2V docs: docs/autoStructN2V/** -> autostructn2v/docs/**
    'docs/autoStructN2V/:path*': 'autostructn2v/docs/:path*',
  },

  // Head tags
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#EB1F17' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Virtual Parasites Research Hub' }],
    ['meta', { property: 'og:description', content: 'PhD Research Hub - Data-driven mechanical models of T. brucei' }],
  ],

  // Theme configuration
  themeConfig: {
    // Site logo - T. brucei parasite icon
    logo: '/tbrucei-icon-main.svg',
    siteTitle: 'Virtual Parasites',

    // Global navigation bar
    nav: [
      { text: 'Home', link: '/' },
      { text: 'BioMed Workspace', link: '/workspace/' },
      { text: 'AutoStructN2V', link: '/autostructn2v/' },
      // External link - URL to be provided later
      // { text: 'About', link: 'https://example.com/research-group', target: '_blank' }
    ],

    // Context-aware sidebars
    sidebar: {
      // Workspace sidebar
      '/workspace/': [
        {
          text: 'Workspace',
          items: [
            { text: 'Overview', link: '/workspace/' },
          ]
        },
        {
          text: 'Tutorials',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/workspace/tutorials/' },
            { text: 'Getting Started', link: '/workspace/tutorials/getting-started' },
            { text: 'First Segmentation', link: '/workspace/tutorials/first-segmentation' },
            { text: 'Denoising Workflow', link: '/workspace/tutorials/denoising-workflow' },
          ]
        },
        {
          text: 'Guides',
          collapsed: true,
          items: [
            { text: 'Overview', link: '/workspace/guides/' },
            { text: 'Best Practices', link: '/workspace/guides/best-practices' },
          ]
        },
        {
          text: 'Modules',
          collapsed: false,
          items: [
            {
              text: 'U-Net Segmentation',
              collapsed: true,
              items: [
                { text: 'Module Overview', link: '/workspace/docs/modules/segmentation/_module' },
                { text: 'Data Upload', link: '/workspace/docs/modules/segmentation/step1' },
                { text: 'Workflow Options', link: '/workspace/docs/modules/segmentation/step1-workflow-choice' },
                { text: 'Raw Images', link: '/workspace/docs/modules/segmentation/step1-raw-images' },
                { text: 'Annotations', link: '/workspace/docs/modules/segmentation/step1-annotations' },
                { text: 'Config File', link: '/workspace/docs/modules/segmentation/step1-config-file' },
                { text: 'Model File', link: '/workspace/docs/modules/segmentation/step1-model-file' },
                { text: 'Patch Size', link: '/workspace/docs/modules/segmentation/config-patch-size' },
                { text: 'Batch Size', link: '/workspace/docs/modules/segmentation/config-batch-size' },
                { text: 'Learning Rate', link: '/workspace/docs/modules/segmentation/config-learning-rate' },
                { text: 'Patches per Image', link: '/workspace/docs/modules/segmentation/config-patches-per-image' },
                { text: 'Augmentation', link: '/workspace/docs/modules/segmentation/config-augmentation' },
                { text: 'Number of Features', link: '/workspace/docs/modules/segmentation/config-num-features' },
                { text: 'Number of Layers', link: '/workspace/docs/modules/segmentation/config-num-layers' },
                { text: 'Number of Epochs', link: '/workspace/docs/modules/segmentation/config-num-epochs' },
                { text: 'Training Progress', link: '/workspace/docs/modules/segmentation/step3' },
                { text: 'Loss Curves', link: '/workspace/docs/modules/segmentation/step3-loss-curves' },
                { text: 'Dice Score', link: '/workspace/docs/modules/segmentation/step3-dice-score' },
                { text: 'Running Inference', link: '/workspace/docs/modules/segmentation/step4' },
                { text: 'Inference Data', link: '/workspace/docs/modules/segmentation/step4-inference-data' },
              ]
            },
            {
              text: 'Deep Learning Denoising',
              collapsed: true,
              items: [
                { text: 'Module Overview', link: '/workspace/docs/modules/denoising-dl/_module' },
                { text: '2D vs 2.5D Mode', link: '/workspace/docs/modules/denoising-dl/step1-mode' },
                { text: 'Denoising Methods', link: '/workspace/docs/modules/denoising-dl/step1-method' },
                { text: 'autoStructN2V Explained', link: '/workspace/docs/modules/denoising-dl/autostructn2v-detail' },
                { text: 'Workflow Options', link: '/workspace/docs/modules/denoising-dl/step1-workflow' },
                { text: 'Input Image Stack', link: '/workspace/docs/modules/denoising-dl/step1-input' },
                { text: 'Config File', link: '/workspace/docs/modules/denoising-dl/step1-import-config' },
                { text: 'Model Weights', link: '/workspace/docs/modules/denoising-dl/step1-import-model' },
                { text: 'Configuration Overview', link: '/workspace/docs/modules/denoising-dl/step2-overview' },
                { text: 'Patch Size', link: '/workspace/docs/modules/denoising-dl/step2-patch-size' },
                { text: 'Patches per Image', link: '/workspace/docs/modules/denoising-dl/step2-patches-per-image' },
                { text: 'Batch Size', link: '/workspace/docs/modules/denoising-dl/step2-batch-size' },
                { text: 'Mask Percentage', link: '/workspace/docs/modules/denoising-dl/step2-mask-percentage' },
                { text: 'Features', link: '/workspace/docs/modules/denoising-dl/step2-features' },
                { text: 'Layers', link: '/workspace/docs/modules/denoising-dl/step2-num-layers' },
                { text: 'Learning Rate', link: '/workspace/docs/modules/denoising-dl/step2-learning-rate' },
                { text: 'Epochs', link: '/workspace/docs/modules/denoising-dl/step2-epochs' },
                { text: 'Early Stopping', link: '/workspace/docs/modules/denoising-dl/step2-early-stopping' },
                { text: 'Augmentation', link: '/workspace/docs/modules/denoising-dl/step2-augmentation' },
                { text: 'Resize Convolution', link: '/workspace/docs/modules/denoising-dl/step2-resize-conv' },
                { text: 'Upsampling Mode', link: '/workspace/docs/modules/denoising-dl/step2-upsampling-mode' },
                { text: 'Masking Strategy', link: '/workspace/docs/modules/denoising-dl/step2-masking-strategy' },
                { text: 'ROI Selection', link: '/workspace/docs/modules/denoising-dl/step2-roi-selection' },
                { text: 'Adaptive Thresholding', link: '/workspace/docs/modules/denoising-dl/step2-mask-extractor-adaptive' },
                { text: 'Base Percentile', link: '/workspace/docs/modules/denoising-dl/step2-mask-extractor-base-percentile' },
                { text: 'Percentile Decay', link: '/workspace/docs/modules/denoising-dl/step2-mask-extractor-percentile-decay' },
                { text: 'Max Masked Pixels', link: '/workspace/docs/modules/denoising-dl/step2-mask-extractor-max-pixels' },
                { text: 'Run Denoising', link: '/workspace/docs/modules/denoising-dl/step3-overview' },
                { text: 'N2V Training', link: '/workspace/docs/modules/denoising-dl/step3-n2v' },
                { text: 'autoStructN2V Training', link: '/workspace/docs/modules/denoising-dl/step3-autostructn2v' },
                { text: 'Loss Curves', link: '/workspace/docs/modules/denoising-dl/step3-loss' },
                { text: 'Best Validation Loss', link: '/workspace/docs/modules/denoising-dl/step3-best-val-loss' },
                { text: 'Process Additional Data', link: '/workspace/docs/modules/denoising-dl/step4-overview' },
                { text: 'Select Data', link: '/workspace/docs/modules/denoising-dl/step4-data' },
              ]
            },
            {
              text: 'Filter Denoising',
              collapsed: true,
              items: [
                { text: 'Module Overview', link: '/workspace/docs/modules/denoising-filter/_module' },
                { text: 'Input Image Stack', link: '/workspace/docs/modules/denoising-filter/step1-input' },
                { text: 'Denoising Methods', link: '/workspace/docs/modules/denoising-filter/step2-methods' },
                { text: 'Gaussian Parameters', link: '/workspace/docs/modules/denoising-filter/step2-gaussian' },
                { text: 'NLM Parameters', link: '/workspace/docs/modules/denoising-filter/step2-nlm' },
              ]
            },
            {
              text: 'Quick Annotation',
              collapsed: true,
              items: [
                { text: 'Module Overview', link: '/workspace/docs/modules/annotation/_module' },
                { text: 'Source Image', link: '/workspace/docs/modules/annotation/step1-source-image' },
                { text: 'Drawing Tools', link: '/workspace/docs/modules/annotation/step2-tools' },
                { text: 'Brush Size', link: '/workspace/docs/modules/annotation/step2-brush-size' },
                { text: 'Classes', link: '/workspace/docs/modules/annotation/step2-classes' },
                { text: 'History & Autosave', link: '/workspace/docs/modules/annotation/step2-history' },
              ]
            },
            {
              text: 'Mesh Generation',
              collapsed: true,
              items: [
                { text: 'Module Overview', link: '/workspace/docs/modules/mesh/_module' },
                { text: 'Segmentation Data', link: '/workspace/docs/modules/mesh/step1-segmentation-data' },
                { text: 'Output Options', link: '/workspace/docs/modules/mesh/step2-output-options' },
              ]
            },
            {
              text: '3D Visualization',
              collapsed: true,
              items: [
                { text: 'Module Overview', link: '/workspace/docs/modules/visualization/_module' },
                { text: 'Mesh Data', link: '/workspace/docs/modules/visualization/step1-mesh-data' },
                { text: 'Controls', link: '/workspace/docs/modules/visualization/step2-controls' },
              ]
            },
            {
              text: 'Image Viewer',
              collapsed: true,
              items: [
                { text: 'Module Overview', link: '/workspace/docs/modules/imageviewer/_module' },
                { text: 'Image Stack', link: '/workspace/docs/modules/imageviewer/step1-image-stack' },
                { text: 'Viewer Controls', link: '/workspace/docs/modules/imageviewer/step2-ui-controls' },
              ]
            },
            {
              text: 'File Browser',
              collapsed: true,
              items: [
                { text: 'Module Overview', link: '/workspace/docs/modules/file-browser/_module' },
                { text: 'Uploading Files', link: '/workspace/docs/modules/file-browser/upload' },
                { text: 'File Categories', link: '/workspace/docs/modules/file-browser/categories' },
                { text: 'File Operations', link: '/workspace/docs/modules/file-browser/file-operations' },
                { text: 'Batch Operations', link: '/workspace/docs/modules/file-browser/batch-operations' },
                { text: 'Search & Filter', link: '/workspace/docs/modules/file-browser/search' },
                { text: 'Tree Navigation', link: '/workspace/docs/modules/file-browser/tree-navigation' },
                { text: 'Backup & Restore', link: '/workspace/docs/modules/file-browser/workspace-backup' },
              ]
            },
          ]
        },
      ],

      // AutoStructN2V sidebar
      '/autostructn2v/': [
        {
          text: 'AutoStructN2V',
          items: [
            { text: 'Overview', link: '/autostructn2v/' },
            { text: 'Getting Started', link: '/autostructn2v/docs/getting-started' },
          ]
        },
        {
          text: 'Concepts',
          collapsed: false,
          items: [
            { text: 'Two-Stage Approach', link: '/autostructn2v/docs/concepts/two-stage-approach' },
            { text: 'Architecture', link: '/autostructn2v/docs/concepts/architecture' },
            { text: 'Structural Mask Extraction', link: '/autostructn2v/docs/concepts/structural-mask-extraction' },
            { text: 'ROI Selection', link: '/autostructn2v/docs/concepts/roi-selection' },
          ]
        },
        {
          text: 'User Guide',
          collapsed: false,
          items: [
            { text: 'Pipeline', link: '/autostructn2v/docs/user-guide/pipeline' },
            { text: 'Configuration', link: '/autostructn2v/docs/user-guide/configuration' },
            { text: 'Training', link: '/autostructn2v/docs/user-guide/training' },
            { text: 'Inference', link: '/autostructn2v/docs/user-guide/inference' },
          ]
        },
        {
          text: 'Tutorials',
          collapsed: false,
          items: [
            { text: 'Basic Usage', link: '/autostructn2v/docs/tutorials/basic-usage' },
            { text: 'Custom Masks', link: '/autostructn2v/docs/tutorials/custom-masks' },
            { text: 'Advanced Configuration', link: '/autostructn2v/docs/tutorials/advanced-configuration' },
          ]
        },
        {
          text: 'API Reference',
          collapsed: true,
          items: [
            { text: 'Pipeline', link: '/autostructn2v/docs/api-reference/pipeline' },
            { text: 'Models', link: '/autostructn2v/docs/api-reference/models' },
            { text: 'Datasets', link: '/autostructn2v/docs/api-reference/datasets' },
            { text: 'Masking', link: '/autostructn2v/docs/api-reference/masking' },
            { text: 'Trainers', link: '/autostructn2v/docs/api-reference/trainers' },
            { text: 'Inference', link: '/autostructn2v/docs/api-reference/inference' },
            { text: 'Utilities', link: '/autostructn2v/docs/api-reference/utils' },
          ]
        },
        {
          text: 'Examples',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/autostructn2v/examples/' },
            { text: 'Electron Microscopy', link: '/autostructn2v/examples/electron-microscopy' },
          ]
        },
        {
          text: 'Troubleshooting',
          link: '/autostructn2v/docs/troubleshooting'
        },
      ],
    },

    // Social links
    socialLinks: [

    ],

    // Search
    search: {
      provider: 'local'
    },

    // Footer
    footer: {
      message: 'Part of DFG Priority Programme SPP2332 "Physics of Parasitism"',
      copyright: 'Copyright 2026'
    },
  },
})
