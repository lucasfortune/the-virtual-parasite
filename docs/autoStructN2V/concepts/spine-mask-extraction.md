# Spine Mask Extraction

How ASN2V turns a measured noise ACF into a StructN2V mask, under explicit design rules.

## Design Goals

A StructN2V mask tells the network which neighboring pixels share correlated noise with the center, so their values are blanked alongside it during blind-spot training. A good mask must:

- cover the correlations that actually carry noise variance,
- stay **minimal** — every masked pixel costs the network context,
- be symmetric under 180° rotation (correlation is symmetric), and
- be reproducible from the measurement, without hand-drawing.

## The Spine Algorithm

`extract_spine_mask(acf_raw, thresh=8.0, rho_floor=0.05, ...)` builds the mask in five steps:

1. **Radial z-map.** The ACF is converted to a z-score map against the radial noise level, so each lag carries a statistical certainty, not just a magnitude.
2. **Sign-agnostic significance cut.** A two-sided cut |z| ≥ `spine_thresh` (default 8.0, in noise-sigmas) keeps significant features — **positive and negative correlations alike**. Anti-correlated lags (common in reconstruction artifacts) carry noise information too; a positive-only rule would miss them.
3. **One spine per feature.** Each connected significant feature is summarized by a one-pixel-wide line along its weighted-PCA principal axis — a *line summary*, not a filled region. This is what keeps the mask minimal by construction.
4. **Connect and symmetrize.** Spines are ray-connected to the center, and the result symmetrized under 180° rotation.
5. **Effect-size floor.** Pixels whose absolute correlation |ρ| falls below `rho_floor` (shipped operating point **0.05**) are dropped, no matter how statistically certain they are.

The output kernel is tightened to its center-symmetric bounding rectangle.

## Certainty vs Effect Size: Two Different Questions

| Knob | Question it answers | Default |
|------|--------------------|---------|
| `spine_thresh` (\|z\|) | "Are we sure this correlation exists?" | 8.0 |
| `rho_floor` (\|ρ\|) | "Is this correlation big enough to matter?" | 0.05 |

With enough background tiles, even tiny correlations become statistically significant — a correlation of 0.01 is "real" but contributes almost nothing to the noise, so masking it costs context for no gain. A pixel must pass **both** thresholds to stay in the mask.

On the PhantEM benchmark, the floor is what closes the gap to the oracle: the floored spine matches a floored oracle mask built from the true noise (five-seed mean Pearson 0.668 vs 0.667), and the same floor even *cures* the oracle's own over-masking on long-correlation volumes.

## Optional Budget

`max_pixels` adds a hard cap: if the spine exceeds it, the weakest pixels (lowest |ρ|) are pruned in symmetric pairs, keeping the mask connected and 180°-symmetric. It ships unset — prefer raising `rho_floor`, which removes pixels by relevance rather than count. Watch `mask_rho2` when capping: a large drop means the cap is cutting into meaningful correlations.

## The Legacy Region Style

`mask_style='region'` keeps the older positive-only region extraction (ridge enhancement, threshold, thinning, value pruning). It survives as an **ablation arm** — in the paper's mask sweep it underperforms the spine (region masks are several times larger for less coverage per pixel). The spine is the method.

## Related

- [Noise Measurement & Routing](/autostructn2v/docs/concepts/noise-measurement) — where the ACF comes from
- [Masking API](/autostructn2v/docs/api-reference/masking) — function-level reference
- [Advanced Configuration tutorial](/autostructn2v/docs/tutorials/advanced-configuration) — tuning the thresholds
