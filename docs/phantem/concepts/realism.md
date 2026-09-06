# Realism, Not Recreation

What PhantEM claims, what it deliberately does not, and why that distinction gives the benchmark its teeth.

## The Gap PhantEM Fills

To score a denoiser you need a clean/noisy pair. Real cryo-ET and FIB-SEM volumes have no clean counterpart, so the field falls back on synthetic benchmarks — usually clean structures plus white Gaussian noise. But real EM noise is **spatially correlated, anisotropic, and correlated between slices**. A denoiser that exploits (or is broken by) those properties scores differently on white noise than on real data, and the benchmark's verdicts stop transferring. On PhantEM's held-out test, a white-noise benchmark nearly *inverted* the true ranking of seven denoisers (Kendall τ −0.71).

## Both Halves Anchored to a Real Acquisition

- **Clean half:** a phantom rendered from the real tomogram's own segmentation. Per-class grey statistics are measured from the volume itself; tunable object populations, smooth fields, and membrane bands add texture; a PSF matches the imaging blur. Rendering is layer-cached, zero-sum, and deterministic.
- **Noisy half:** the clean phantom plus noise drawn from a parametric spectral model **fitted to background crops of the same stack** — power spectrum with anisotropy, a banding term, and axial (between-slice) correlation. See [The Noise Model](/phantem/docs/concepts/noise-model).

Nothing simulates image formation. That is a deliberate scope decision, and it is what the name of this page means:

> **The pairs are not reproductions of a specific stack's noise. They are stacks with realistic noise and structure — close enough that behavioral conclusions about denoisers transfer.**

## Why Not Just Simulate the Microscope?

Full image-formation simulation needs ground-truth 3D density, electron-optical parameters, and detector models — inputs that are themselves uncertain, and whose realism would again be asserted rather than measured. PhantEM inverts the burden: make the *output* measurably realistic, and *test* that realism with falsifiable claims (see [The Validation Protocol](/phantem/docs/concepts/validation-protocol)).

## Three Design Principles

1. **Every test ships a negative control that must fail.** White noise at the correct amplitude is rejected in 30/30 cells; the reduced "v1" axially-uncorrelated model in 27/30. A test that cannot fail proves nothing.
2. **Closeness is judged against measured real-vs-real variation** — the envelope of how much two real acquisitions of the same kind differ, not an arbitrary tolerance.
3. **Acceptance criteria were frozen before the tiers ran**, and the scoreboard is reported failure-inclusive: the strict criterion passes 9 of 30 cells (17 at the loosest relaxation that still rejects every white-noise cell), with each miss diagnosed and mapped to a model consequence.

Three noise-model revisions were each **forced by a measurement**, the last one moving exactly the statistic it was predicted to move.

## What This Means for You

- If you evaluate denoisers on EM data: the pairs give you scored, validated ground truth whose verdicts have been shown to transfer to real data.
- If you develop generators: the validation protocol is reusable — the claims, controls, and frozen criteria apply to any synthetic-pair generator, not just this one.

## Related

- [The Validation Protocol](/phantem/docs/concepts/validation-protocol)
- [The Benchmark Data](/phantem/docs/data)
