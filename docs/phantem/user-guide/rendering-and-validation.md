# Rendering & Validation Scripts

The headless side of PhantEM: batch rendering, the render config, and the validation tiers.

## The Render Config

One JSON per volume describes the whole phantom. Top-level keys:

| Key | Content |
|-----|---------|
| `source`, `measure_on` | Which volume the config belongs to / measures from |
| `nm_per_px` | Pixel size |
| `psf_sigma` | Imaging blur |
| `zero_sum` | The zero-sum rendering invariant |
| `noise` | `{enabled, gain, sd, params, seed}` — the fitted noise model + amplitude |
| `classes` | Per label id: `{intensity, smooth{}, objects[]}` — the tuned populations |
| `provenance` | Per label id: where the class's appearance comes from (e.g. `"self"`) |

The published pairs ship their configs (`config_frozen.json` behind every quantitative result; `config_visual.json` for the visually-tuned `_v2` gallery variants), so every published stack is exactly reproducible.

## Rendering Stacks

```bash
python validation/ws_render_stacks.py [vol ...] [--configs configs_v2]
```

Renders `clean.tif`/`noisy.tif` per volume **plus the negative controls**: `white.tif` (white noise at the correct amplitude) and `v1ctrl.tif` (the reduced axially-uncorrelated model). The controls are not optional extras — the [validation protocol](/phantem/docs/concepts/validation-protocol) requires them to fail.

The engine (`renderer_code/render_layers.py`) is layer-cached, deterministic, and ROI-exact: a cropped render is bit-identical to the same region of a full-frame render. `--selftest` verifies these invariants, with controls proving the load-bearing checks can fail.

## Noise Fitting (Production Budget)

```bash
python renderer_code/noise_fit.py path/to/crop.npy    # fit + C1 checks + sidecar cache
python validation/ws_refit.py                          # production-budget refits + axial diagnostics
```

The workbench uses a fast budget (~2–3 min); production fits (maxiter 1200, ~12–19 min) are what the published configs carry.

## The Validation Tiers

```bash
python validation/ws_t1.py [vol ...]        # T1: median3 / gauss1 / NLM / BM3D residual behavior
python validation/ws_t2_careamics.py        # T2+T1 ML tier: N2V, structN2V (careamics 0.3.2 pinned)
python validation/tune_check.py <vol> cfg.json   # fast per-volume scorecard while tuning
python validation/phantom_qc.py             # C2 corruption suite
```

`ws_common.py` is the shared backbone: the volume registry with per-volume evaluation windows, the metrics, and the **frozen `verdict()`** implementing the acceptance criterion:

> amplitude gap(sd) ≤ 0.2 log₂ · band-character gaps (low/mid/high: 0.005–0.08, 0.08–0.2, 0.2–0.5 cyc/px) ≤ max(2 × envelope, 0.2) · axial |Δzr1| ≤ max(0.05, envelope)

## Typical Workflow

1. **Tune** in the [workbench](/phantem/docs/user-guide/tuner-workbench) until the metrics panel looks right; save the config
2. **Scorecard**: `tune_check.py <vol> my_cfg.json` — window-only, fast iteration
3. **Render** the full stacks + controls: `ws_render_stacks.py`
4. **Validate**: `ws_t1.py` (minutes), then `ws_t2_careamics.py` if you need the ML tier (GPU, hours)
5. Check the controls failed and your pair's cells against the frozen criterion

## Environment Pins

The published scores were produced with `careamics 0.3.2`, `torch 2.9.1+cu128`, `bm3d 4.0.3` (recorded in the deposit's `installed_versions.txt`). Matching the CAREamics pin matters if you want numbers comparable to the paper's ML tier.

## Related

- [The Validation Protocol](/phantem/docs/concepts/validation-protocol) — what the tiers test and why
- [The Benchmark Data](/phantem/docs/data) — the published inputs and scores
