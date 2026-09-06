# The Validation Protocol

Three falsifiable claims, frozen acceptance criteria, and negative controls that must fail.

## Overview

| Claim | Question | Test |
|-------|----------|------|
| **C1 — Noise integrity** | Is the fitted noise model built from clean noise? | Purity checks on the background crop (static z-mean excess, marginal skew/kurtosis) |
| **C2 — Structural integrity** | Do the phantom's structures faithfully follow the inputs? | A corruption suite: 45 deliberate input/render defects, detection required for the harmful ones |
| **C3 — Behavioral realism** | Do denoisers relate to the pair as they relate to the real stack? | Three tiers: T1, T2, T3 (below) |

C3 carries the realism burden; C1 and C2 make sure it is tested on sound inputs.

## C3: The Three Tiers

### T1 — Residual Behavior

Classical denoisers (median-3, Gaussian-1, NLM, BM3D) run on the real stack and on the pair. Their residuals are compared on five statistics: residual sd, three spectral band fractions (0.005–0.08, 0.08–0.2, 0.2–0.5 cyc/px), and adjacent-slice correlation — judged against a **measured real-vs-real envelope** under a criterion frozen in advance:

> amplitude gap(sd) ≤ 0.2 log₂ · band-character gaps ≤ max(2 × envelope, 0.2) · axial |Δzr1| ≤ max(0.05, envelope)

### T2 — Training Transfer

Networks (N2V, structN2V) **trained on the real stack** must transfer to the pair within **2 dB** of pair-trained models. If the pair's noise were meaningfully different, transfer would break.

### T3 — Ranking Transfer

The benchmark's actual job: denoiser *orderings* must be preserved. On the development volumes, **88% of pairwise orderings** are preserved through the pairs, versus **63% under white noise**.

## The Controls That Must Fail

- **White noise at the correct amplitude:** rejected in **30/30** cells
- **The reduced v1 model** (no axial correlation): rejected in **27/30** cells

If the protocol accepted these, it would prove nothing. It doesn't.

## Failure-Inclusive Reporting

The strict T1 criterion passes **9 of 30** cells; at the loosest relaxation that still rejects every white-noise cell, **17 of 30**. Every miss is diagnosed and mapped to a model consequence — three noise-model revisions were each forced by such a measurement, the last moving exactly the statistic it was predicted to move.

![Validation scoreboard](/phantem/f6_scoreboard.png)
*The failure-inclusive T1 scoreboard across volumes and denoisers, with the negative controls*

## The Held-Out Test

A seventh volume, untouched during development, closed the loop under a **pre-registered protocol**. Real-data quality was measured against an even/odd frame-split half-data reference (the Noise2Noise argument), giving a ground-truth-free ranking of seven denoisers on real data:

| Benchmark | Pairwise orderings preserved | Kendall τ |
|-----------|------------------------------|-----------|
| **PhantEM pair** | 10 of 12 | **+0.67** |
| White-noise pair | 2 of 14 | **−0.71** |

The same conclusion in one line: the PhantEM pair predicts how denoisers rank on real data; a white-noise benchmark nearly inverts it.

## Running the Tiers Yourself

The scripts that produced the published scoreboard ship in `validation/`:

```bash
python validation/ws_render_stacks.py            # step 1: render pairs + negative controls
python validation/ws_t1.py                       # step 2: classical tier
python validation/ws_t2_careamics.py             # step 3: ML tier (careamics + torch needed)
```

`ws_common.py` holds the volume registry, evaluation windows, metrics, and the frozen `verdict()`. `phantom_qc.py` is the C2 corruption suite; `tune_check.py` gives a fast per-volume scorecard while tuning.

## Related

- [Realism, Not Recreation](/phantem/docs/concepts/realism) — why the protocol is designed this way
- [The Benchmark Data](/phantem/docs/data) — the published, scored pairs
