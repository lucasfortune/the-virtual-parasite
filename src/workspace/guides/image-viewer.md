---
layout: doc
title: Image Viewer Module Guide
---

# Image Viewer Module Guide

The Image Viewer module lets you browse and inspect TIFF image stacks with two viewing modes: a detailed gallery view for examining individual slices, and a thumbnail grid for quick navigation through the entire stack.

For a conceptual overview, see [Image Viewer](/workspace/docs/modules/imageviewer/_module).

![Image Viewer module showing gallery mode with slice navigation](/guides/imageviewer-overview.png)
*The Image Viewer in gallery mode displaying a slice with zoom and navigation controls*

---

## Quick Start

1. **Launch module** — Click "Image Viewer" from the workspace hub
2. **Select a file** — Choose a TIFF stack from your workspace or module results
3. **Browse slices** — Use the slider or Previous/Next buttons to navigate
4. **Switch modes** — Toggle between Gallery and Thumbnail views

---

## Step-by-Step Guide

### Step 1: Image Selection

Select the TIFF stack you want to view.

![Step 1 showing file selection with validation result](/guides/imageviewer-step1.png)
*Step 1 file selection with validation status display*

#### Input Options

| Source | Description | When to Use |
|--------|-------------|-------------|
| **Workspace Files** | TIFF files uploaded to your workspace | Viewing raw data or uploaded images |
| **Segmentation Results** | Output from the Segmentation module | Inspecting inference results |
| **DL Denoising Results** | Output from Deep Learning Denoising | Reviewing denoised images |
| **Filter Denoising Results** | Output from Filter Denoising | Reviewing filter-denoised images |

#### Automatic File Loading

If you navigate to the Image Viewer from another module (e.g., after running inference), the output file is automatically selected and you'll proceed directly to Step 2.

#### File Requirements

- **Format:** Multi-page TIFF (.tif or .tiff)
- **Bit Depth:** 8-bit or 16-bit grayscale
- **Channels:** Single channel (grayscale)

#### Validation Display

After selecting a file, the validation display shows:

| Information | Example |
|-------------|---------|
| **Dimensions** | 512 x 512 pixels |
| **Slice Count** | 256 slices |
| **Data Type** | 8-bit unsigned |

> **Note:** The "Next" button is disabled until a valid file is selected and validated.

For more details, see [Image Stack Selection](/workspace/docs/modules/imageviewer/step1-image-stack).

**Click "Next: View Image" to proceed to Step 2.**

---

### Step 2: View Image

Browse and inspect your image stack using the viewer controls.

![Step 2 showing the full viewer interface with toolbar and controls](/guides/imageviewer-step2.png)
*Full viewer interface with toolbar, viewing area, and controls*

#### Toolbar

The toolbar at the top provides mode switching and file information:

| Element | Description |
|---------|-------------|
| **← Change File** | Return to Step 1 to select a different file |
| **Gallery / Thumbnails** | Toggle between viewing modes |
| **Filename** | Currently loaded file name |
| **Slice Count** | Total number of slices (e.g., "256 slices") |

#### Gallery Mode (Default)

Gallery mode displays a single slice at full resolution with zoom and pan capabilities.

![Gallery mode with zoom and navigation controls labeled](/guides/imageviewer-gallery.png)
*Gallery mode with zoom controls and slice navigation slider*

**Slice Navigation**

| Control | Action |
|---------|--------|
| **◀ Previous** | Go to previous slice |
| **Next ▶** | Go to next slice |
| **Slice Indicator** | Shows current position (e.g., "25/100") |
| **Slider** | Drag to jump to any slice |

**Zoom Controls**

| Control | Action |
|---------|--------|
| **− (Minus)** | Zoom out by 25% |
| **+ (Plus)** | Zoom in by 25% |
| **Reset** | Return to 100% zoom, centered |
| **Zoom Display** | Shows current zoom level (25% – 400%) |
| **Mouse Wheel** | Scroll up to zoom in, scroll down to zoom out |

**Panning**

When zoomed in beyond 100%:
- **Click and drag** the image to pan around
- Cursor changes to a grab hand to indicate panning is available
- Panning is disabled at 100% zoom or below

> **Tip:** Use the mouse wheel to quickly zoom in on areas of interest, then click and drag to pan around the image.

#### Thumbnail Mode

Thumbnail mode displays all slices as a scrollable grid of previews.

![Thumbnail mode showing grid of slice previews](/guides/imageviewer-thumbnails.png)
*Thumbnail mode with scrollable grid of slice previews*

**Features:**

- **Grid Layout** — Responsive grid that adjusts to panel width
- **Lazy Loading** — Thumbnails load as you scroll (better performance for large stacks)
- **Slice Numbers** — Each thumbnail shows its slice number
- **Click to View** — Click any thumbnail to open that slice in Gallery mode

> **Tip:** Use Thumbnail mode to get an overview of your entire stack, then click a slice to examine it in detail in Gallery mode.

For more details, see [Viewer Controls](/workspace/docs/modules/imageviewer/step2-ui-controls).

---

## Mouse and Keyboard Controls

| Input | Action | Mode |
|-------|--------|------|
| **Mouse Wheel** | Zoom in/out | Gallery |
| **Click + Drag** | Pan (when zoomed > 100%) | Gallery |
| **Click Thumbnail** | Open slice in Gallery mode | Thumbnail |
| **Drag Slider** | Jump to slice | Gallery |

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "Next" button disabled | No file selected or validation failed | Select a valid TIFF file |
| Slice not loading | Network issue or file error | Wait for loading or try refreshing |
| Can't pan the image | Zoom level at 100% or below | Zoom in first, then pan |
| Thumbnails loading slowly | Large stack with many slices | Normal behavior; thumbnails load as you scroll |
| File not appearing in list | Wrong file type or location | Ensure file is a TIFF in your workspace |

---

## Related Help Articles

**Module Overview:**
- [Image Viewer](/workspace/docs/modules/imageviewer/_module) — Module introduction and features

**Step-by-Step:**
- [Image Stack Selection](/workspace/docs/modules/imageviewer/step1-image-stack) — File selection and validation
- [Viewer Controls](/workspace/docs/modules/imageviewer/step2-ui-controls) — Gallery, thumbnail, and navigation controls

