# Tutorial: Evaluate a Denoiser

Use the published benchmark pairs to score a denoising method with real ground truth — the way the ASN2V paper did.

## Why These Pairs

Each pair gives you a `noisy.tif` whose noise is validated-realistic and a `clean.tif` that is its exact ground truth. Scores computed on them have been shown to **transfer**: on the held-out volume, rankings through a PhantEM pair matched the real-data ranking (Kendall τ +0.67) where a white-noise benchmark inverted it (τ −0.71).

## Step 1: Get the Data

Download volumes from [Zenodo 10.5281/zenodo.22084921](https://doi.org/10.5281/zenodo.22084921). Per development volume you get `clean.tif`, `noisy.tif`, `labels.tif`, the frozen config, the background crop + fitted noise model, and `eval_window.json`. See [The Benchmark Data](/phantem/docs/data) for the volume table.

A minimal representative subset: one FIB-SEM-like volume (`macrophage2`) and one cryo-ET volume (`S.pombe` or `C.eleg`). The ML-tier volumes in the paper were `macrophage2`, `Brno`, `jurkat1`.

## Step 2: Denoise the Noisy Stack

Run your method on `noisy.tif` exactly as a user would — self-supervised methods train on it directly:

```python
import tifffile
noisy = tifffile.imread("macrophage2/noisy.tif")
denoised = my_denoiser(noisy)                      # your method here
tifffile.imwrite("macrophage2_mymethod.tif", denoised.astype("float32"))
```

Never let a method see `clean.tif` — it exists only for scoring.

## Step 3: Score Inside the Evaluation Window

`eval_window.json` defines the region the published scores use (`z_block`, `y_window`, `x_window`) — chosen to avoid boundary effects and non-representative regions. Score inside it:

```python
import json, numpy as np, tifffile

win   = json.load(open("macrophage2/eval_window.json"))
clean = tifffile.imread("macrophage2/clean.tif")
den   = tifffile.imread("macrophage2_mymethod.tif")

z0, z1 = win["z_block"]; y0, y1 = win["y_window"]; x0, x1 = win["x_window"]
c = clean[z0:z1, y0:y1, x0:x1].ravel()
d = den[z0:z1, y0:y1, x0:x1].ravel()

pearson = np.corrcoef(c, d)[0, 1]      # the benchmark's primary metric
print(f"Pearson vs ground truth: {pearson:.3f}")
```

Pearson correlation is scale-free (denoisers often change the grey scale); add PSNR/SSIM after matching scales if you want them.

## Step 4: Anchor Against Known Baselines

The deposit's `scores/` folder carries the published T1/T2 runs, so you can place your number next to scored baselines run on identical data. For orientation from the ASN2V paper's five-seed means on the six development volumes: plain N2V reaches ~0.582 mean Pearson, the routed ASN2V 0.668, and the oracle-masked ceiling 0.667.

## Step 5 (Optional): Robustness Checks

- **Multiple seeds** — training-based methods vary; the ASN2V evaluation used five seeds per cell and found the *baseline*, not the method, carrying most of the variance
- **The `_v2` pairs** — each development volume ships a second, visually-tuned configuration; agreement across both configs guards against tuning-specific conclusions
- **The held-out volume** — untouched during PhantEM's development; the cleanest test set

## Reporting

When publishing scores on PhantEM, state: volume set, config used (frozen vs `_v2`), the evaluation window (use the shipped one), metric, and seeds. Cite the data DOI ([10.5281/zenodo.22084921](https://doi.org/10.5281/zenodo.22084921)).

## Related

- [The Benchmark Data](/phantem/docs/data)
- [The Validation Protocol](/phantem/docs/concepts/validation-protocol) — why these pairs can be trusted
- [AutoStructN2V](/autostructn2v/) — the denoiser developed and evaluated on this benchmark
