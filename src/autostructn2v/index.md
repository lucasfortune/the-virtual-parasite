---
layout: doc
title: AutoStructN2V
---

# AutoStructN2V

Automated structural noise discovery and routed self-supervised denoising for volumetric electron microscopy.

## The Problem

Self-supervised denoising methods like Noise2Void work beautifully for random, pixel-independent noise. But many real microscopy volumes contain **structured noise** — spatially correlated patterns such as:

- Scan lines and streaks from electron microscopy
- Periodic stripes from camera sensors and detector readout
- Directional artifacts from tomographic reconstruction

For structured noise, the core assumption of N2V breaks down: neighboring pixels share correlated noise, and the network can "cheat" by copying it from context instead of removing it. Structured Noise2Void (StructN2V) fixes this with a structural mask — but that mask traditionally has to be specified **by hand**, from expert reading of autocorrelation plots.

## The Solution

ASN2V replaces the expert with a measurement:

1. **Measure** — the noise autocorrelation (ACF) is measured directly on the raw volume through automatic background selection. Takes seconds, no training.
2. **Route** — a calibrated routing decision, taken **before any training**, determines whether structured masking is warranted at all (directionality statistic Dmax against a validated threshold).
3. **Extract** — when it is, the mask is discovered under explicit design rules: sign-agnostic one-pixel-wide line summaries of the significant ACF features, with an effect-size floor.
4. **Train once** — exactly one model is trained: StructN2V with the discovered mask, or plain N2V when the noise carries no usable directional structure (the same mechanism with a single-pixel mask).

```python
from autoStructN2V.pipeline import run_pipeline

summary = run_pipeline({
    "input_data": "/path/to/noisy_stack.tif",
    "output_dir": "./results",
    "mask": {"source": "extractor",
             "extractor": {"bg_side": "light"}},
})
# summary["branch"], summary["route_reason"], summary["denoised_stack"]
```

## Key Features

- **Self-supervised** — no clean reference images required
- **Measurement before training** — the mask and routing decision are available in seconds, on CPU, before any GPU time is spent
- **Safe fallback** — noise without usable directional structure routes to plain N2V automatically; abstaining is an informative outcome, not an error
- **One training run** — no multi-stage orchestration; cost comparable to plain N2V
- **Validated** — on the [PhantEM benchmark](https://doi.org/10.5281/zenodo.22084921), the discovered masks match an oracle mask built from the true noise under identical design rules

## Documentation

<div class="doc-grid">

<a href="/autostructn2v/docs/getting-started" class="doc-card">
  <h3>Getting Started</h3>
  <p>Installation and the two quickstarts</p>
</a>

<a href="/autostructn2v/docs/tutorials/basic-usage" class="doc-card">
  <h3>Basic Tutorial</h3>
  <p>Complete walkthrough on benchmark data</p>
</a>

<a href="/autostructn2v/docs/user-guide/pipeline" class="doc-card">
  <h3>Pipeline Guide</h3>
  <p>Configure and run the routed workflow</p>
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
| [The Routed Pipeline](/autostructn2v/docs/concepts/routed-pipeline) | Measure → route → train exactly one model |
| [Noise Measurement & Routing](/autostructn2v/docs/concepts/noise-measurement) | Automatic background selection, the ACF, and the Dmax gate |
| [Spine Mask Extraction](/autostructn2v/docs/concepts/spine-mask-extraction) | Sign-agnostic line summaries with an effect-size floor |
| [Architecture & Training Recipe](/autostructn2v/docs/concepts/architecture) | The N2V2-style U-Net and the frozen publication recipe |

## Package Organization

| Component | Purpose |
|-----------|---------|
| **masking/autoextract/** | The method proper: measurement, router, spine mask extraction |
| **pipeline/** | Routed runner, configuration, data splitting |
| **models/** | Network architectures (FlexibleUNet, N2V2 options) |
| **datasets/** | Patch sampling with blind-spot masking |
| **trainers/** | Training loop with early stopping and logging |
| **inference/** | Patch-based prediction for full stacks |

## Availability

- **Code:** [github.com/lucasfortune/asn2v](https://github.com/lucasfortune/asn2v) (BSD-3-Clause, results tagged v1.0)
- **No installation needed:** ASN2V also runs in the browser as part of the [BioMed Workspace](/workspace/) — upload a stack and get the full routed run through the same vendored v1.0 code path
- **Benchmark data:** [PhantEM on Zenodo](https://doi.org/10.5281/zenodo.22084921) (CC-BY-4.0)
- **Paper:** preprint link coming soon
