---
layout: doc
title: AutoStructN2V
---

# AutoStructN2V

A two-stage self-supervised deep learning framework for microscopy image denoising that handles both random and structured noise patterns.

## The Problem

Traditional self-supervised denoising methods like Noise2Void work beautifully for random, pixel-independent noise. But many real microscopy images contain **structured noise** - patterns that repeat spatially across the image:

- Scan lines from electron microscopy
- Periodic stripes from camera sensors
- Wave-like artifacts from scanning mechanisms
- Fixed-pattern noise from detector imperfections

For structured noise, the core assumption of N2V breaks down. The network can "cheat" by learning the noise pattern from context rather than the true signal.

## The Solution

AutoStructN2V solves this by treating random and structured noise as separate challenges:

**Stage 1: Standard Noise2Void**
- Removes random, pixel-independent noise (shot noise, read noise, thermal noise)
- Uses classic blind-spot masking with random pixel selection

**Stage 2: Structured Noise2Void**
- Removes correlated, pattern-based noise (scan lines, periodic artifacts)
- Uses automatically-discovered spatial masks that target the noise pattern

```python
from autoStructN2V.pipeline import run_pipeline

results = run_pipeline({
    'input_dir': './noisy_images/',
    'output_dir': './results/',
    'run_stage1': True,  # Random noise
    'run_stage2': True   # Structured noise
})
```

## Key Features

- **Self-supervised** - No clean reference images required for training
- **Two-stage pipeline** - Comprehensive handling of random + structured noise
- **Automatic pattern discovery** - Autocorrelation analysis finds noise patterns
- **Flexible U-Net** - Resize convolution prevents checkerboard artifacts
- **ROI selection** - Intelligent patch sampling improves training efficiency
- **2.5D mode** - Volumetric data support using consecutive slice triplets

## Documentation

<div class="doc-grid">

<a href="/autostructn2v/docs/getting-started" class="doc-card">
  <h3>Getting Started</h3>
  <p>Installation and quick start guide</p>
</a>

<a href="/autostructn2v/docs/tutorials/basic-usage" class="doc-card">
  <h3>Basic Tutorial</h3>
  <p>Complete beginner walkthrough</p>
</a>

<a href="/autostructn2v/docs/user-guide/pipeline" class="doc-card">
  <h3>Pipeline Guide</h3>
  <p>Configure and run the full workflow</p>
</a>

<a href="/autostructn2v/docs/api-reference/pipeline" class="doc-card">
  <h3>API Reference</h3>
  <p>Complete module documentation</p>
</a>

<a href="/autostructn2v/examples/" class="doc-card">
  <h3>Examples</h3>
  <p>Real-world application examples</p>
</a>

</div>

## Concepts

Understanding the key ideas behind autoStructN2V:

| Concept | Description |
|---------|-------------|
| [Two-Stage Approach](/autostructn2v/docs/concepts/two-stage-approach) | How Stage 1 and Stage 2 work together |
| [Structural Mask Extraction](/autostructn2v/docs/concepts/structural-mask-extraction) | Automatic pattern discovery via autocorrelation |
| [Architecture](/autostructn2v/docs/concepts/architecture) | Flexible U-Net with resize convolution |
| [ROI Selection](/autostructn2v/docs/concepts/roi-selection) | Intelligent patch sampling strategy |

## Module Organization

The autoStructN2V package is organized into six core components:

| Component | Purpose |
|-----------|---------|
| **models/** | Neural network architectures (FlexibleUNet) |
| **datasets/** | Data loading with masking, augmentation, and ROI selection |
| **masking/** | Structural noise extraction and mask generation |
| **trainers/** | Training loops with early stopping and logging |
| **inference/** | Patch-based prediction for full images |
| **pipeline/** | Orchestration of the complete two-stage workflow |
