---
layout: doc
title: BioMed Workspace
---

# BioMed Workspace

A web-based platform for biomedical image processing that brings advanced machine learning to researchers without requiring programming expertise.

<div class="launch-cta">
  <a href="#" target="_blank">
    Launch Workspace (Coming Soon)
  </a>
</div>

## What Can You Do?

The Biomedical Image Processing Workspace provides a complete pipeline from raw microscopy data to publication-ready visualizations.

### Process Microscopy Images

Whether you work with confocal microscopy, light-sheet imaging, or electron microscopy data, the workspace handles the computational heavy lifting.

### Train Deep Learning Models

Train U-Net segmentation models and Noise2Void denoising models on your specific samples - no coding required. The step-by-step workflows guide you through each stage.

### Generate 3D Meshes

Convert segmented image stacks into 3D surface meshes for visualization, analysis, or 3D printing. Output formats include OBJ, STL, and Three.js JSON.

## Processing Modules

| Module | Description |
|--------|-------------|
| [U-Net Segmentation](/workspace/docs/modules/segmentation/_module) | Train and run semantic segmentation models |
| [Deep Learning Denoising](/workspace/docs/modules/denoising-dl/_module) | Self-supervised denoising with N2V and autoStructN2V |
| [Filter Denoising](/workspace/docs/modules/denoising-filter/_module) | Classical Gaussian and Non-Local Means filtering |
| [Quick Annotation](/workspace/docs/modules/annotation/_module) | Browser-based annotation tool for ground truth creation |
| [Mesh Generation](/workspace/docs/modules/mesh/_module) | Convert segmentations to 3D polygon meshes |
| [3D Visualization](/workspace/docs/modules/visualization/_module) | Interactive mesh viewer with clipping planes |
| [Image Viewer](/workspace/docs/modules/imageviewer/_module) | Browse TIFF image stacks |
| [File Browser](/workspace/docs/modules/file-browser/_module) | Manage your workspace files and exports |

## Get Started

<div class="doc-grid">

<a href="./guides/" class="doc-card">
  <h3>Overview</h3>
  <p>Step-by-step guides and best practices</p>
</a>

<a href="./guides/getting-started" class="doc-card">
  <h3>Getting Started</h3>
  <p>Welcome to the Biomedical Image Processing Workspace.</p>
</a>

<a href="./guides/info-help" class="doc-card">
  <h3>Info & Help Panel</h3>
  <p>Find the information you need directly in the Workspace</p>
</a>

</div>

## For Different Research Approaches

### For Practical Imaging Work

The workspace removes the technical barriers to applying machine learning to your microscopy data. Built-in test data lets you explore features before uploading your own samples. Parameters are explained in context, and sensible defaults work for most cases.

### For Computational and Quantitative Work

The workspace provides a transparent ML pipeline with full access to training dynamics and results. Monitor loss curves, validation metrics, and training progress in real-time. Results export in standard formats (TIFF, PyTorch, OBJ/STL) compatible with downstream analysis.
