---
layout: doc
title: Electron Microscopy Example
---

# Electron Microscopy Denoising

::: warning Work in Progress
This example is currently being written. Check back soon for the complete guide.
:::

## Overview

Electron microscopy images often contain both random noise and structured artifacts like scan lines. This example demonstrates how autoStructN2V handles both types of noise in a single pipeline.

## The Challenge

EM images typically have:
- **Shot noise** - Random, pixel-independent noise from electron detection
- **Scan lines** - Horizontal stripes from the scanning process
- **Periodic artifacts** - Regular patterns from electronics or beam instability

Standard Noise2Void can remove the shot noise but leaves the scan lines intact.

## The Solution

AutoStructN2V's two-stage approach:

1. **Stage 1** removes the random shot noise
2. **Stage 2** automatically detects and removes the scan line pattern

## Example Code

```python
from autoStructN2V.pipeline import run_pipeline

config = {
    'input_dir': './em_images/',
    'output_dir': './denoised/',
    'run_stage1': True,
    'run_stage2': True,
    # EM-specific settings
    'patch_size': 64,
    'mode': '2d'
}

results = run_pipeline(config)
```

## Expected Results

Coming soon: Before/after comparisons and quality metrics.

## Adapting to Your Data

- Adjust `patch_size` based on your image resolution
- Use `mode: '2.5d'` for tomographic stacks
- See [Configuration](/autostructn2v/docs/user-guide/configuration) for all options
