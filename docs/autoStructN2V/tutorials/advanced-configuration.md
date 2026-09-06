# Tutorial: Advanced Configuration

Tuning the extractor, using the review mode, adopting the publication recipe, and knowing what to leave alone.

## Tuning Philosophy

The shipped defaults are validated operating points. Tune the **measurement side** (it's free — seconds per attempt) before touching the **training side** (each attempt costs a run). And use the built-in diagnostics: `dmax`, `mask_rho2`, and the ASCII/plot views of the discovered mask tell you whether a change helped before any training.

## Extractor Tuning

### Background selection isn't finding real background

Symptoms: implausible ACF, a mask that mirrors the specimen's texture, or an unexpected abstain.

```python
extractor = AutoMaskExtractor(
    bg_side="light",             # 1st check: is the side right for this modality?
    bg_box=(0, 128, 0, 128),     # 2nd resort: point at a known-empty rectangle
    sigma=8,                     # 3rd: fix the structure/detrend scale manually
    struct_keep=30,              # or keep only the flattest 30% instead of Otsu
)
```

### The mask misses a visible noise direction

Lower one of the two thresholds — they answer different questions:

```python
AutoMaskExtractor(bg_side=..., spine_thresh=6.0)   # more sensitive certainty cut (default 8.0)
AutoMaskExtractor(bg_side=..., rho_floor=0.02)     # admit weaker correlations (default 0.05)
```

### The mask is large with faint tails

Raise the floor rather than capping:

```python
AutoMaskExtractor(bg_side=..., rho_floor=0.10)     # keep only correlations that matter
AutoMaskExtractor(bg_side=..., max_pixels=25)      # blunt cap, last resort
```

Watch `info["mask_rho2"]` across attempts: if raising the floor barely reduces it, the dropped pixels were dead weight — keep the higher floor.

## The Review Mode (`extractor_input='compare'`)

Before committing GPU time on precious data, run the pipeline in review mode: it executes the mask discovery on the raw stack *and* a denoised stack, writes a comparison figure, and halts without training.

```python
summary = run_pipeline({
    "input_data": "stack.tif",
    "mask": {"source": "extractor", "extractor": {
        "bg_side": "light",
        "extractor_input": "compare",
        "denoised_stack_path": "stack_n2v_denoised.tif",   # from a source='center' run
    }},
})
print(summary["halted"], summary["mask_review_dir"])
```

## Adopting the Publication Recipe

Package defaults are conservative; the paper's results come from `known_good_config.py`:

```python
from known_good_config import CONFIG
CONFIG["input_data"] = "/path/to/noisy_stack.tif"
run_pipeline(CONFIG)     # legacy-form config, auto-translated
```

The load-bearing deviations from package defaults, if you'd rather set them yourself: `normalize_method='zscore'`, `overlap_tile_pad=16`, N2V2 options (`remove_top_skip=True`, `use_blurpool=True`, `activation='relu'`), lr 1e-3 both branches, patch 64/256, batch 128/24, mask % 1.5/15, augmentation off in the StructN2V branch — and the **norm asymmetry** (`'batch'` / `'group'`), which is not optional; see [Architecture & Training Recipe](/autostructn2v/docs/concepts/architecture).

## What to Leave Alone

| Knob | Why not to touch it |
|------|---------------------|
| `norm_type` per branch | The asymmetry is a validated fix for two distinct failure modes (−13 dB / Pearson-collapse) |
| `masking_strategy` | UPS (3) is the publication setting; alternatives were tried and reverted |
| Router thresholds | Calibrated with a wide empty margin; not forwarded through `run_pipeline` for a reason |
| `use_aux_psnr_for_scheduling` | Scheduling on clean PSNR breaks the self-supervised claim of a run |
| StructN2V augmentation | Rotating patches breaks mask–noise alignment |

## Budget Knobs (safe to change)

- `num_epochs` — 100 is the validated budget; shrink for smoke tests, raising bought ~0 dB
- `patches_per_image`, `batch_size` — throughput/memory trade
- `patch_size` — auto-shrunk when a volume is too small anyway
- `early_stopping` — convenient for exploration; the paper trains the fixed budget

## Reproducing Paper Experiments

The `experiments/` directory maps 1:1 to the paper's sections (mask sweep, router table, real-ET comparison, split-sum SNR, leak validation, refinement and denoised-input ablations). The scripts expect `data/<volume>/{noisy.tif, clean.tif, eval_window.json}` at the repo root and write to `results/` — see the repository README's "Reproducing the paper" table.

## Related

- [Configuration](/autostructn2v/docs/user-guide/configuration) — the full reference
- [Noise Measurement & Routing](/autostructn2v/docs/concepts/noise-measurement) — what the phase-1 knobs mean
- [Troubleshooting](/autostructn2v/docs/troubleshooting)
