---
layout: doc
title: PhantEM
---

# PhantEM

Realism-validated synthetic benchmark pairs for denoising volumetric electron microscopy.

![PhantEM overview](/phantem/f1_overview.png)
*From a real acquisition to a validated benchmark pair: phantom rendered from the volume's own segmentation, noise fitted to its own background*

## The Problem

Denoising methods for volumetric EM are routinely evaluated on synthetic data whose resemblance to real data is **asserted rather than measured**. Real cryo-ET and FIB-SEM volumes have no clean counterpart to score against — and their noise is spatially correlated, anisotropic, and correlated between slices, none of which white noise reproduces. A benchmark built on unrealistic noise can invert the ranking of the very methods it is supposed to compare.

## The Solution

PhantEM generates benchmark pairs in which **both halves are anchored to a real acquisition**:

- **The clean volume** is a phantom rendered from a real tomogram's own segmentation — per-class intensities measured from the volume itself, tunable object populations, membrane bands, PSF.
- **The noise** is a parametric spectral model (anisotropy, banding, axial correlation) fitted to background crops of the same stack by a contamination-tolerant estimator.

The claim is deliberately **realism, not recreation**: the pairs are not reproductions of a specific stack's noise, but stacks with realistic noise and structure — close enough that *behavioral conclusions transfer*.

## Validation, Not Assertion

A three-claim protocol makes realism falsifiable:

| Claim | Test | Headline result |
|-------|------|-----------------|
| **C1 — Noise integrity** | Purity test separating clean from contaminated noise sources | p < 10⁻⁵ |
| **C2 — Structural integrity** | Corruption suite of 45 deliberate defects | 38/45 harmful corruptions detected |
| **C3 — Behavioral realism** | Denoisers must relate to the pair as they relate to the real stack | T1 residual behavior, T2 training transfer (within 2 dB), T3 ranking transfer (88% of pairwise orderings vs 63% under white noise) |

Every test ships a **negative control that must fail**: white noise at the correct amplitude is rejected in 30/30 cells, and a reduced axially-uncorrelated model in 27/30. Acceptance criteria were frozen before the tiers ran, and the scoreboard is reported failure-inclusive. On a seventh, **held-out** volume, denoiser rankings transfer through the pair (Kendall τ +0.67) while a white-noise benchmark nearly inverts them (τ −0.71).

![Benchmark gallery](/phantem/f3_gallery.png)
*The benchmark pairs: real slice, clean phantom, and noisy phantom for each volume*

## What You Get

- **Seven published pairs** (six development + one held-out) with clean/noisy stacks, labels, frozen configs, background crops, fitted noise models, and evaluation windows — on [Zenodo, DOI 10.5281/zenodo.22084921](https://doi.org/10.5281/zenodo.22084921) (CC-BY-4.0)
- **The renderer**: an interactive tuning workbench plus headless tools to build a matched phantom from *your own* tomogram + segmentation + background crop
- **The validation scripts** that scored the published pairs — rerunnable on yours

## Documentation

<div class="doc-grid">

<a href="/phantem/docs/getting-started" class="doc-card">
  <h3>Getting Started</h3>
  <p>Install the renderer and open your first volume</p>
</a>

<a href="/phantem/docs/user-guide/tuner-workbench" class="doc-card">
  <h3>Tuner Workbench</h3>
  <p>The interactive phantom-building UI</p>
</a>

<a href="/phantem/docs/tutorials/tune-your-own-volume" class="doc-card">
  <h3>Tutorial: Your Own Volume</h3>
  <p>From tomogram + labels + crop to a matched pair</p>
</a>

<a href="/phantem/docs/data" class="doc-card">
  <h3>The Benchmark Data</h3>
  <p>The seven pairs, sources, and licences</p>
</a>

</div>

## Concepts

| Concept | Description |
|---------|-------------|
| [Realism, Not Recreation](/phantem/docs/concepts/realism) | What PhantEM claims, and what it deliberately does not |
| [The Noise Model](/phantem/docs/concepts/noise-model) | Spectrum, banding, and axial correlation, fitted from background crops |
| [The Validation Protocol](/phantem/docs/concepts/validation-protocol) | C1/C2/C3, frozen criteria, negative controls |

## Availability

- **Code:** [github.com/lucasfortune/phantem](https://github.com/lucasfortune/phantem) (BSD-3-Clause, results at tag v1.1)
- **Data:** [Zenodo 10.5281/zenodo.22084921](https://doi.org/10.5281/zenodo.22084921) (CC-BY-4.0)
- **Paper:** preprint link coming soon
- PhantEM is the benchmark behind the [AutoStructN2V](/autostructn2v/) evaluation
