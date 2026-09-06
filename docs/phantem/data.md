# The Benchmark Data

Seven published, fully scored benchmark pairs on Zenodo: [DOI 10.5281/zenodo.22084921](https://doi.org/10.5281/zenodo.22084921), CC-BY-4.0.

## The Volumes

Six development volumes spanning FIB-SEM and cryo-ET, plus one held-out volume:

| Volume | Modality | nm/px | Shape (z×y×x) | Classes | Source |
|--------|----------|-------|----------------|---------|--------|
| `jurkat1` | FIB-SEM | 4.0 | 500×250×500 | 21 | OpenOrganelle jrc_jurkat-1 |
| `macrophage2` | FIB-SEM | 4.0 | 256×256×256 | 13 | OpenOrganelle jrc_macrophage-2 |
| `Brno` | cryo-ET | 0.784 | 120×657×652 | 14 | CZ CryoET DP 10301 (EMPIAR-11756) |
| `C.eleg` | cryo-ET | 1.348 | 57×428×513 | 6 | CZ CryoET DP 10477 (EMPIAR-12049) |
| `Enco` | cryo-ET | 2.638 | 40×202×321 | 9 | CZ CryoET DP 10438 |
| `S.pombe` | cryo-ET | 1.349 | 33×400×787 | 8 | CZ CryoET DP 10000 (EMPIAR-10988) |
| `heldout` (25jul29a_Position_3) | cryo-ET | 1.4985 | — | 5 | CZ CryoET DP 10456 |

The paper's ML tier ran on `macrophage2`, `Brno`, `jurkat1`.

## What Each Development Volume Contains

| File | Content |
|------|---------|
| `clean.tif` / `noisy.tif` | The canonical frozen-config pair (float32, full depth) — behind every quantitative result |
| `clean_v2.tif` / `noisy_v2.tif` | A second, visually-tuned configuration (config-sensitivity check; the gallery figure) |
| `labels.tif` | The segmentation the phantom was rendered from |
| `config_frozen.json` / `config_visual.json` | The exact render configs — every stack is reproducible |
| `noise_crop.npy` + `noise_crop.noisefit.json` | The background crop and its fitted v4 noise model |
| `eval_window.json` | The scoring region (`z_block`, `y_window`, `x_window`) + `nm_per_px`, deployed sd, structure axis |

## The Held-Out Volume

`heldout/` differs by design: a single frozen config (floor-matched sd), a `noise_crop.tif`, `crop_provenance.json`, an evaluation window spanning the whole working volume, and labels combining deposited masks (membrane, lysosome, mitochondrion) with rasterized oriented pick points (ribosomes, microtubules). Its `run5_records/` folder preserves the **pre-registration**, the even/odd half-sum reference volumes (Noise2Noise argument), and every score file of the held-out study — the τ +0.67 vs −0.71 result is fully traceable.

## Scores

`scores/` carries the published validation runs: T1/T2 score files for the canonical (run 2) and visually-tuned (run 3) configurations, the production noise-refit report, and `installed_versions.txt` (careamics 0.3.2, torch 2.9.1+cu128, bm3d 4.0.3).

## Licences & Attribution

| Item | Licence |
|------|---------|
| The deposit (pairs, configs, crops, scores) | CC-BY-4.0 |
| PhantEM code | BSD-3-Clause |
| cryo-ET source data (CZ CryoET Data Portal) | CC0 |
| OpenOrganelle FIB-SEM source data | CC-BY-4.0 |

Source accessions, for citing the underlying acquisitions: CryoET Data Portal datasets 10301 (run RN-14070), 10477 (RN-33585), 10438 (RN-15937), 10000 (RN-242), 10456 (run 25jul29a_Position_3); OpenOrganelle jrc_jurkat-1 (DOI 10.25378/janelia.13114259) and jrc_macrophage-2 (DOI 10.25378/janelia.13117745).

## Citing

Please cite the PhantEM paper (preprint link coming soon) and the data DOI [10.5281/zenodo.22084921](https://doi.org/10.5281/zenodo.22084921). Code: [github.com/lucasfortune/phantem](https://github.com/lucasfortune/phantem), results at tag v1.1.
