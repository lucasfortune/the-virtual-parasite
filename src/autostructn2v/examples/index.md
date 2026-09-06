---
layout: doc
title: Examples
---

# AutoStructN2V Examples

Real-world examples demonstrating autoStructN2V on different types of microscopy data.

## Available Examples

<div class="doc-grid">

<a href="/autostructn2v/examples/electron-microscopy" class="doc-card">
  <h3>Electron Microscopy</h3>
  <p>Removing directional noise from EM volumes with the routed pipeline</p>
</a>

</div>

## Running the Examples

Each example includes:

- Instructions to obtain suitable data (the [PhantEM benchmark](https://doi.org/10.5281/zenodo.22084921) is openly available)
- Working configuration snippets
- What to expect, and tips for adapting to your own data

## Prerequisites

Before running these examples, make sure you have:

1. Installed autoStructN2V from source — see [Getting Started](/autostructn2v/docs/getting-started) (the package is not on PyPI)
2. A CUDA-capable GPU (recommended for training; mask discovery runs on CPU)
3. Read the [Getting Started](/autostructn2v/docs/getting-started) guide
