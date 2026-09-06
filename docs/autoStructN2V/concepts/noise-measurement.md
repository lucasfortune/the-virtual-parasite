# Noise Measurement & Routing

How ASN2V measures the noise autocorrelation on the raw stack, and how the router decides between StructN2V and plain N2V.

## Why Measure on Background?

The noise ACF must be measured where there is no signal, otherwise structure correlations masquerade as noise correlations. Real volumes usually contain such regions — resin, embedding medium, empty ice — and ASN2V finds them automatically.

## Phase 1: Automatic Background Selection

For each slice, the extractor computes a **structure map** (Gaussian gradient magnitude at scale `sigma`) and an intensity map. Background is then defined by two gates:

1. **Flatness** — an Otsu split on the log structure map keeps the flat side (`struct_keep='otsu'`; a fixed percentile is available).
2. **Intensity side** — the required `bg_side` input keeps only the bright (`'light'`), dark (`'dark'`), or either (`'off'`) side.

| `bg_side` | Use for |
|-----------|---------|
| `'light'` | Dense EM / COSEM data — bright resin, dark stained structures |
| `'dark'` | Fluorescence-like data — labeled structures glow on dark background |
| `'off'` | Flatness-only selection — correct for PhantEM synthetic volumes, and best on the tested real ET |

The background mask is eroded (`bg_erode=1`) to keep tiles off structure edges. If automatic selection fails on unusual data, `bg_box=(y0, y1, x0, x1)` overrides it with a manual rectangle.

### Purity-First Tiling

From the background mask, square tiles are selected purity-first: candidate tile sizes `[64, 48, 32, 24]` are crossed with candidate purities `[0.95, 0.85, 0.75, 0.6]`, and the highest purity that yields at least `min_tiles=4` tiles wins. Preferring pure (fully background) tiles over large ones keeps structure leakage out of the measurement.

### ACF Estimation

Each tile is detrended (Gaussian high-pass at `sigma`, so slow intensity ramps don't read as long-range correlation), its autocorrelation computed, and the tile ACFs averaged into one 21×21 ACF (`acf_crop=10`). `sigma='auto'` estimates the scale from the noise ACF half-width, clipped to [4, 12].

## Phase 2: The Router

From the raw ACF, `directional_metrics` computes:

- **Dmax** — the directional-magnitude statistic, read over arm rings at radii 2–9. It measures how much correlation concentrates along directions rather than spreading isotropically.
- **fold** ('2f'/'4f') and the dominant **axes**
- **coherence** — how consistently the direction holds across rings

### The Gates

| Gate | Condition | Route |
|------|-----------|-------|
| **Dmax** | `Dmax < 0.012` → `nondirectional` | N2V branch |
| **Coherence** | disabled in v1.0 (`threshold = 0.0`) | — |
| **Degenerate** | extracted mask ≤ 1 px | N2V branch |
| **Weak leak** | `mask_rho2` below `min_mask_rho2` (off by default) | N2V branch |

The **Dmax threshold 0.012** is the validated operating point: on the PhantEM benchmark, all directional-noise volumes score ≥ 0.020 and all white-noise controls ≤ 0.0021, so the threshold sits in the empty gap. The coherence gate ships disabled because real-ET directional noise is low-coherence; the synthetic-calibrated value (0.98) is kept in the code as reference only.

> **Note:** through `run_pipeline`, the router thresholds are fixed module constants. Only direct `AutoMaskExtractor(...)` use can override them.

## The Leak Statistic: mask_rho2 (Σρ²)

For a discovered mask, `mask_rho2` sums the squared correlations over the mask's off-center positions — an estimate of the fraction of the center pixel's noise variance the mask covers ("plugs"). It is reported in the diagnostics and is the right number to watch when tuning the [effect-size floor](/autostructn2v/docs/concepts/spine-mask-extraction): if raising the floor barely reduces `mask_rho2`, the dropped pixels were not contributing.

## Diagnostics You Get Back

`extractor.extract_mask(stack)` returns `(mask, info)`, where `info` includes the raw ACF, `dmax`, `dmax_thr`, `coherence`, the abstain `reason` (when routed to N2V), `mask_rho2`, and details of the background selection. `extractor.route(stack)` wraps the same into a `RouteDecision` object with `branch`, `mask`, `reason`, `metrics`, and a human-readable `message`.

## Related

- [The Routed Pipeline](/autostructn2v/docs/concepts/routed-pipeline)
- [Spine Mask Extraction](/autostructn2v/docs/concepts/spine-mask-extraction)
- [Masking API](/autostructn2v/docs/api-reference/masking)
