# The Routed Pipeline

ASN2V's core design: measure first, decide before training, train exactly one model.

## From Two Stages to One Decision

Earlier designs of this method (and this documentation) used a two-stage orchestration: train a plain N2V model, extract a mask from its residuals, then train a second StructN2V model. That architecture is retired. The published v1.0 replaces it with a **routed decision taken before any training**:

```
raw stack
   └─► AutoMaskExtractor (measures the noise on the RAW stack)
          └─► RouteDecision
                 ├─► StructN2V branch (discovered spine mask)   [directional noise]
                 └─► N2V branch (1×1 center kernel)             [no usable structure]
   └─► train exactly ONE model with the branch's recipe
   └─► predict: denoise the full stack
```

Two properties make this work:

1. **The measurement does not need a trained model.** The noise ACF is measured on automatically selected background regions of the raw stack — regions with no biological structure to confuse the measurement. This takes seconds on CPU.
2. **Abstaining routes instead of halting.** Every abstain reason (`nondirectional`, `isotropic`, `degenerate`, `weak_leak`) becomes a route to the N2V branch. Plain N2V is mechanically the same blind-spot training with a single-pixel mask, so the pipeline always produces a model and a denoised stack.

## Why Route At All?

Structured masking only helps when the noise actually has directional correlation. Applying a structural mask to unstructured noise removes useful context from the network without any benefit. The router's job is to detect, from the measured ACF, whether the structured treatment is warranted — using the directionality statistic **Dmax** against a threshold of **0.012**, validated on the PhantEM benchmark (positives ≥ 0.020, white-noise controls ≤ 0.0021; the threshold sits in the empty gap between them).

Routing to plain N2V is therefore an informative measurement result: *this noise does not need structured masking*.

## The Three Mask Sources

Baselines run through the same pipeline, differing only in where the mask comes from:

| `mask.source` | What trains | Role |
|---------------|-------------|------|
| `'extractor'` | The routed branch with the discovered mask | **The method** |
| `'center'` | N2V with a 1×1 (or `center_size`) kernel | Plain-N2V baseline |
| `'file'` | StructN2V with a `.npy` kernel you provide | Manual-mask baseline / frozen kernels |

## Cost

One training run, comparable to plain N2V, plus a few seconds of measurement. The retired two-stage flow took roughly twice as long.

## What Happened to Abstain-as-Halt?

Nothing halts on abstain anymore. The only non-training path left is the explicit review mode `extractor_input='compare'`, which stops after mask discovery so you can inspect the extractor's inputs and outputs without spending GPU time (see [Pipeline](/autostructn2v/docs/user-guide/pipeline)).

## Related

- [Noise Measurement & Routing](/autostructn2v/docs/concepts/noise-measurement) — how the ACF is measured and the gates applied
- [Spine Mask Extraction](/autostructn2v/docs/concepts/spine-mask-extraction) — how the mask is built when the route is StructN2V
- [Pipeline user guide](/autostructn2v/docs/user-guide/pipeline) — running it
