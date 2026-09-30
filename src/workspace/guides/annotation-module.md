---
layout: doc
title: Quick Annotation Tool Module Guide
---

# Quick Annotation Tool Module Guide

The Quick Annotation Tool is a browser-based painting interface for creating ground-truth segmentation masks on TIFF image stacks. These annotations serve as training data for U-Net segmentation models or can be used directly for mesh generation.

Since version 1.6.0 you no longer have to paint every slice by hand: annotate a class on some slices and let the tool interpolate the slices in between, or paint a few example strokes and let a pixel classifier suggest the rest.

For a conceptual overview, see [Annotation](/workspace/docs/modules/annotation/_module).

![Annotation module landing page](/guides/annotation-overview.png)
*The Annotation Tool module landing page showing step navigation and file selector*

---

## Quick Start

1. **Launch module**: click "Quick Annotation Tool" from the workspace hub
2. **Select an image**: choose a TIFF stack to annotate (new, resume, or edit)
3. **Create classes**: one per structure you want to label
4. **Paint**: label the structures on a few slices with brush, fill and eraser
5. **Fill the gaps**: interpolate each class between the slices you painted, or let the classifier suggest slices
6. **Save your work**: click "Save Progress" to continue later or "Create Annotation" when done

---

## Step-by-Step Guide

### Step 1: Data Selection

Choose your source image and annotation mode.

![Step 1 showing file selection options](/guides/annotation-step1.png)
*Step 1 with annotation mode selection and file chooser*

#### Input Options

| Mode | Description | When to Use |
|------|-------------|-------------|
| **New Annotation** | Start fresh on a raw TIFF image | Creating annotations from scratch |
| **Resume** | Continue an unfinished annotation | Returning to work in progress |
| **Edit** | Modify an existing completed annotation | Refining previous work |
| **Correct** | Open a segmentation result (inference or cleanup output) as labels over its raw stack; saving creates a new annotation | Fixing a prediction to train on it again ("Correct in Annotation" at the end of a segmentation run lands here) |

#### File Requirements

- **Format:** Multi-page TIFF (.tif or .tiff)
- **Bit Depth:** 8-bit or 16-bit grayscale
- **Channels:** Single channel (grayscale)

> **Tip:** Large files work but may affect performance. Consider splitting very large stacks.

> **Note (Resume/Edit/Correct):** all three modes need the original image behind the labels. The tool finds it automatically through the file's lineage, following the chain as far as needed; when it can't (an uploaded mask with no lineage, or a deleted source), a picker appears. The image you pick must match the annotation's width, height, and slice count.

For more details, see [Source Image](/workspace/docs/modules/annotation/step1-source-image).

**Click "Next" to proceed to the annotation interface.**

---

### Step 2: The Annotation Interface

![Annotation interface with canvas, slice controls and toolbar](/guides/annotation-interface.png)
*The annotation interface: canvas in the centre, slice and zoom controls around it, toolbar on the right*

| Area | Location | Purpose |
|------|----------|---------|
| **Header** | Top | Autosave toggle, "Save Progress" and "Create Annotation" |
| **Canvas** | Centre | The current slice with your annotations drawn on top |
| **Control bar** | Above the canvas | Slice navigation (buttons, numeric field) and zoom controls |
| **Slice slider** | Below the canvas | Scrub through the stack; the strip above it marks annotated slices |
| **Status bar** | Bottom | Cursor position in image pixels and the image dimensions |
| **Toolbar** | Right side | Tools, classes and suggestions (see below) |

#### Navigating the Stack

| Control | Action |
|---------|--------|
| **◀ / ▶ buttons, Left / Right arrow keys** | Previous / next slice |
| **Numeric field** | Type a slice number to jump there |
| **Slider** | Drag to scrub through the stack |
| **Marks above the slider** | Slices carrying the active class; click a mark to jump there |
| **, and . keys** | Jump to the previous / next slice annotated with the active class |

The marks come in three kinds: **solid** marks are slices you painted yourself, **light** marks were filled by interpolation or an accepted suggestion and not edited since, and **hollow** marks hold a pending suggestion waiting for your review.

#### Zoom and Pan

| Control | Action |
|---------|--------|
| **Mouse wheel** | Zoom toward the cursor (10% to 1000%) |
| **+ / − buttons** | Zoom in / out |
| **Fit button** | Fit the whole slice into the view |
| **1:1 button** | Show the image at 100% |
| **Right-drag, middle-drag, or Space + drag** | Pan |

> **Tip:** The zoom and position are kept when you change slices. Zoom into a structure once, then step through the stack with the arrow keys and it stays in view. "Fit" resets the view.

---

### The Toolbar

The toolbar has three sections. The whole column scrolls when it does not fit the window.

![The toolbar with the Tools, Classes and Suggest sections](/guides/annotation-toolbar.png)
*The toolbar: Tools (drawing tools, history, brush size), Classes (overlay opacity and the class list) and the collapsible Suggest section*

#### Tools

| Tool | Shortcut | What it does |
|------|----------|--------------|
| **Brush** | B | Click and drag to paint with the active class |
| **Eraser** | E | Click and drag to erase back to background |
| **Fill** | F | Click inside a region to fill it with the active class. The region is the connected area sharing the clicked value: an enclosed patch of background, or a whole patch of another class |
| **Eyedropper** | Alt + click | Make the class under the cursor the active class (works with any tool) |

Below the tool buttons sits the **history row**: Undo (Ctrl+Z), Redo (Ctrl+Y or Ctrl+Shift+Z) and, after an interpolation run, "Revert interpolation". History is kept per slice, up to 20 steps.

The **Size** slider sets the brush and eraser diameter in image pixels (1 to 50); the `[` and `]` keys change it in steps of 5. The brush preview on the canvas shows exactly which pixels a click would paint.

> **Tip:** Outline a structure with a small brush, then fill it with one click of the fill tool.

For more details, see [Drawing Tools](/workspace/docs/modules/annotation/step2-tools) and [Brush Size](/workspace/docs/modules/annotation/step2-brush-size).

#### Classes

The section header holds four buttons: **show/hide all**, **lock/unlock all**, and **+** to add a class. The **Overlay** slider below it sets how opaque the annotations are drawn over the image; hold **V** to peek at the raw image with all overlays hidden.

Each row of the class list shows, from left to right:

| Element | Action |
|---------|--------|
| **Colour swatch** | Click to open a colour picker |
| **Name** | Click to make the class active; double-click to rename (Enter confirms, Escape cancels) |
| **"bg" badge** | Marks the background class used by the classifier (see Suggestions) |
| **Layers icon** | Interpolate this class between annotated slices (see below) |
| **Padlock** | Lock or unlock the class |
| **Eye** | Show or hide the class |
| **×** | Delete the class and all its pixels |

Number keys **1 to 9** select the first to ninth class.

**Protected classes.** A hidden class and a locked class are both protected: no brush, eraser or fill stroke changes their pixels. Hide a class to paint another class right up to and over it without damaging it. Lock a class once a structure is finished so later work on its neighbours cannot touch it; painting *with* a locked class is refused until you unlock it, and a locked class cannot be interpolated. Painting with a hidden class shows it again. The lock state, names and colours are saved with the annotation.

> **Tip:** Hide all, then show one class to inspect it alone. Lock all, then unlock one to work on a single structure safely.

For more details, see [Annotation Classes](/workspace/docs/modules/annotation/step2-classes).

#### Suggest

The Suggest section at the bottom of the toolbar is collapsed by default. It hosts the pixel classifier described under [Suggestions](#suggestions-pixel-classifier) below.

---

### Slice Interpolation

Interpolation fills the slices between the slices you painted, one class at a time. The slices on which a class already has pixels are its keyframes; every gap between two neighbouring keyframes is filled, as long as the keyframes are no further apart than the **max gap**. The two keyframe shapes are morphed into each other (shape-based interpolation on signed distance fields, the method ITK-SNAP uses), after aligning them by their centres so a structure that drifts sideways stays connected.

1. Paint the class on at least two slices. The spacing does not have to be regular: every 5th slice where a structure changes quickly, every 10th where it does not.
2. Click the **layers icon** in the class row. The dialog lists the annotated slices and previews which gaps will be filled and which will be skipped.
3. Set the **max gap** (default 10). Gaps wider than that are skipped, so two separate objects of the same class far apart in the stack are not bridged. Lower it if unrelated structures get connected; raise it if you annotated sparsely on purpose.
4. Click **Interpolate**.

Only empty pixels are filled. Pixels that already belong to another class are never overwritten, so the order in which you interpolate classes does not matter.

**Reviewing the result.** Step through the light marks above the slider. Every filled slice is one undo step, and "Revert interpolation" in the history row restores all slices of the last run at once. Painting on an interpolated slice turns it into a keyframe: if a gap looks wrong, correct one slice in the middle of it and run the interpolation again, and the gap becomes two shorter gaps.

> **Limit:** a structure that appears, ends, splits or merges between two keyframes is morphed smoothly, not topologically. Add a keyframe close to the event.

For more details, see [Slice Interpolation](/workspace/docs/modules/annotation/step2-interpolation).

---

### Suggestions (Pixel Classifier)

The classifier proposes the annotation of a slice from a few strokes, the way ilastik and Labkit do. You paint examples, the module trains a random forest on per-pixel texture features, and the prediction appears as a translucent suggestion you accept or correct.

**Background examples.** In this workspace the background is never a label: pixels you do not paint stay 0. The classifier still needs examples of what to leave empty, so one class is marked as the **background class** (it shows a "bg" badge). Its strokes are training examples only. When you create the final annotation, its pixels are written as 0 and the class is left out of the class list, so the Segmentation module never sees it. "Save Progress" keeps the strokes so you can continue later.

1. Open the **Suggest** section and click **Add background class**, or pick an existing class in the dropdown. Paint a few strokes on it: cytoplasm, resin, anything that is not a structure you want.
2. Paint a few strokes of each structure class. Strokes on several slices help, and they do not need to cover whole objects.
3. Click **Suggest slice** or press **S**. Training takes a few seconds the first time and again whenever you change the labels; predicting a slice takes about a second.
4. The suggestion appears at reduced opacity, stronger where the classifier is confident. It is only drawn where the slice is still empty, so it shows exactly what accepting would write.
5. Click **Accept** or press **A** to write the suggestion into the empty pixels as one undo step, or **Discard** to drop it. Then correct with brush, eraser and fill.

| Setting | Effect |
|---------|--------|
| **Background class** | Which class teaches the classifier what to leave empty; required |
| **Min confidence** | Pixels predicted below this confidence stay empty. Raise for cleaner but sparser suggestions, lower to fill more |
| **Smooth result** | A small median filter removes speckles from the prediction |
| **Range** | Suggest many slices at once. Pending suggestions show as hollow marks above the slider; step through them, accept or discard each, or use **Accept all** |

Pixels of other classes are never overwritten and locked classes gain no pixels. Accepted slices count as filled (light marks) until you paint on them, and they are not used for training, so the classifier keeps learning from your strokes rather than from its own output. Any label change makes the model stale; the next Suggest retrains automatically.

> **Limit:** the classifier looks at local texture and intensity. It is good at telling tissues apart (membranes, cytoplasm, dense organelles) and weak at object-level structure: thin membranes may come out broken and touching objects are not separated. Combine it with the fill tool and, for finished stacks, with the Segmentation Cleanup module.

For more details, see [Suggestions](/workspace/docs/modules/annotation/step2-suggest).

---

### Saving Your Work

Both save actions sit in the header and become available after your first stroke.

#### Save Progress

Save your work-in-progress (WIP) to continue later.

- **Resume:** the WIP file appears under "Unfinished annotations" in Step 1's source selector; further saves keep updating the same file
- Background-class strokes and pending state are kept, so you can pick up where you left off

#### Create Annotation

Finalize your annotation for use in training or mesh generation.

- **Use:** ready for Segmentation training, Segmentation Cleanup, or Mesh generation
- The background class, if any, is written as 0 and dropped from the class list
- If no pixels have been painted, a confirmation is asked before creating an empty annotation
- In **Edit** mode, saving never overwrites the original: it creates a new file

> **Note:** leaving the module or closing the tab with unsaved changes asks for confirmation first.

#### Autosave

The toggle next to "Save Progress" is on by default. Every 2 minutes, if anything changed, the tool runs "Save Progress" for you.

> **Tip:** Even with autosave enabled, remember to click "Create Annotation" when you're finished to mark the annotation as complete.

For more details, see [History & Autosave](/workspace/docs/modules/annotation/step2-history).

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **B / E / F** | Brush / eraser / fill tool |
| **Alt + click** | Pick the class under the cursor |
| **1 to 9** | Select the first to ninth class |
| **[ / ]** | Decrease / increase brush size |
| **V (hold)** | Peek at the raw image without overlays |
| **Ctrl+Z** | Undo |
| **Ctrl+Y / Ctrl+Shift+Z** | Redo |
| **Left / Right arrow** | Previous / next slice |
| **, / .** | Previous / next slice annotated with the active class |
| **S** | Suggest the current slice |
| **A** | Accept the suggestion on the current slice |
| **Space + drag** | Pan canvas |
| **Mouse wheel** | Zoom in / out |

On macOS, Cmd replaces Ctrl.

---

## Output Files

| File | Description |
|------|-------------|
| Final annotation | Multi-page TIFF with class labels as pixel values, tagged as an annotation; accepted by Segmentation, Segmentation Cleanup, Mesh Generation, and Stitching |
| Work-in-progress file | Saved by "Save Progress" or autosave; listed under "Unfinished annotations" in Step 1 |

**TIFF Format:**
- 8-bit grayscale
- Pixel value = class ID (0 = background, 1+ = classes)
- One page per slice in the stack

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Can't paint on canvas | No class selected, or the active class is locked | Select a class; unlock it with the padlock |
| A region refuses paint | The pixels belong to a hidden or locked class | Show or unlock that class first |
| Brush not visible | Class visibility turned off | Painting with the class shows it again, or click the eye icon |
| Interpolation skipped a gap | Keyframes further apart than the max gap | Raise the max gap, or annotate a slice in between |
| Interpolation bridged two separate objects | Max gap too large | Lower the max gap, or paint an empty keyframe between them |
| Suggest refuses to run | No background class set | Add or pick a background class in the Suggest section and paint a few strokes on it |
| Suggestion is empty or sparse | Min confidence too high, or too few examples | Lower the min confidence; paint more strokes on more slices |
| Undo not working | No actions to undo on this slice | Undo history is per slice; check other slices |
| Changes not saving | Network error or autosave disabled | Click "Save Progress" manually; check the console for errors |
| Lost my work | Browser closed without saving | Check "Unfinished annotations" in Step 1 for autosaved progress |

---

## Related Help Articles

**Module Overview:**
- [Quick Annotation Tool](/workspace/docs/modules/annotation/_module): module introduction and concepts

**Tools & Controls:**
- [Drawing Tools](/workspace/docs/modules/annotation/step2-tools): brush, eraser, fill, eyedropper, navigation and zoom
- [Brush Size](/workspace/docs/modules/annotation/step2-brush-size): size adjustment and shortcuts
- [Annotation Classes](/workspace/docs/modules/annotation/step2-classes): adding, protecting and managing classes
- [Slice Interpolation](/workspace/docs/modules/annotation/step2-interpolation): filling the slices between keyframes
- [Suggestions](/workspace/docs/modules/annotation/step2-suggest): the pixel classifier
- [History & Autosave](/workspace/docs/modules/annotation/step2-history): undo/redo and automatic saving

**Data:**
- [Source Image Selection](/workspace/docs/modules/annotation/step1-source-image): input requirements
