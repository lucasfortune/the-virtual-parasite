# Tutorial: Tune Your Own Volume

From a tomogram, its segmentation, and a background crop to a matched clean/noisy pair — with the quality gates that keep the result honest.

## What You Need

1. **A tomogram** — the intensity stack (`.tif`, `.mrc`, or `.npy`)
2. **A segmentation** of that same volume, same shape (integer labels, 0 = background). Rough is fine to start; per-class *shapes* come from the labels, per-class *appearance* is measured and tuned
3. **A background crop** — a signal-free region of the same stack (the noise source). Its cleanliness is checked, not assumed
4. **The pixel size** in nm/px

> A segmentation-free volume is not a dead end — segment first (for T. brucei-scale problems, the [BioMed Workspace](/workspace/) U-Net module is one way), then come back.

## Step 1: Open in the Workbench

```bash
cd renderer_code
python tuner_server.py --port 8765
```

Enter the tomogram, labels, crop, and nm/px, press **Open**. The first open fits the noise model from the crop (~2–3 min) and caches it as a sidecar.

**Gate 1 — the C1 badge.** If the crop fails the cleanliness checks (static structure, non-Gaussian marginal), pick a cleaner region. Fitting from a contaminated crop poisons everything downstream.

## Step 2: Verify the Inputs

Run the **C2 · input integrity** panel:

- **Test M** — is the label stack aligned with the tomogram? (sub-voxel shift recovery)
- **Test S** — is there leftover structure the labels miss?
- **Test R** — do per-class residuals look like noise?

**Gate 2:** fix misalignment before tuning — it silently corrupts every class measurement.

## Step 3: Tune Per Class

For each class, working on a representative slice:

1. Start from the measured intensity (the workbench pre-fills mean/sd from the tomogram)
2. Add **object populations** where the real class shows granularity — tune coverage, contrast, size (nm), clustering until the rendered texture matches the real slice by eye and in the metrics panel
3. Add a **membrane band** where the real class shows a bright/dark border against neighbours (thickness in nm, contrast, neighbour subset)
4. Use the **smooth field** for slow intensity variation inside a class

Flip between the real slice and the renders often; the spectral descriptors in the metrics panel catch what the eye misses (too-fine texture reads as a high-band excess).

## Step 4: Save and Scorecard

Save the config, then run the fast scorecard on the evaluation window:

```bash
python validation/tune_check.py <volume> my_cfg.json
```

Iterate steps 3–4 until the scorecard's statistics sit inside the envelope-based criterion.

## Step 5: Render the Full Pair + Controls

```bash
python validation/ws_render_stacks.py <volume>
```

This writes `clean.tif`, `noisy.tif`, and the negative controls (`white.tif`, `v1ctrl.tif`).

## Step 6: Validate

```bash
python validation/ws_t1.py <volume>          # classical tier, minutes
python validation/ws_t2_careamics.py         # ML tier, GPU (optional)
```

**Gate 3:** your pair's T1 cells should pass where the controls fail. A pair that scores like white noise is not ready to benchmark anything.

## What "Done" Looks Like

- C1 badge green, C2 tests passing
- Scorecard statistics inside the frozen criterion on the evaluation window
- T1 cells passing where `white.tif` and `v1ctrl.tif` fail
- A saved `config` that regenerates the pair deterministically

## Related

- [Tuner Workbench](/phantem/docs/user-guide/tuner-workbench) — every control in detail
- [Rendering & Validation Scripts](/phantem/docs/user-guide/rendering-and-validation)
- [The Validation Protocol](/phantem/docs/concepts/validation-protocol) — what the gates test
