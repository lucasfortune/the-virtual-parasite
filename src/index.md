---
layout: home

hero:
  name: "Virtual Parasites"
  text: "Data-Driven Mechanical Models"
  tagline: Building high-resolution structural models of parasites to understand their biophysics
  image:
    src: /tbrucei-icon-main.svg
    alt: T. brucei parasite
  actions:
    - theme: brand
      text: BioMed Workspace
      link: /workspace/
    - theme: alt
      text: AutoStructN2V
      link: /autostructn2v/
    - theme: alt
      text: PhantEM
      link: /phantem/

features:
  - icon:
      src: /icon-denoising.svg
    title: Advanced Denoising
    details: Self-supervised denoising that measures the noise first and routes automatically between structured and plain blind-spot training
  - icon:
      src: /icon-segmentation.svg
    title: Semantic Segmentation
    details: Deep learning workflows for pixel-level annotation of electron tomography volumes using U-Net architecture
  - icon:
      src: /icon-3d-model.svg
    title: 3D Structural Models
    details: Complete models of T. brucei cytoskeleton amenable for finite element analysis
  - icon:
      src: /icon-open-science.svg
    title: Open Science
    details: Open code releases and a validated open benchmark (PhantEM on Zenodo) — workflows, data, and models available to collaborators
---

<div class="research-section">

## The Research

The parasitic life cycle involves a multitude of physical interactions with the host microenvironment during stages of motility and adhesion. This requires optimal adaptation of the mechanical properties of the parasite to its environment.

The shape and elasticity of unicellular parasites such as *Trypanosoma brucei* are largely defined by their cytoskeleton, including a subpellicular array of microtubule filaments that forms a corset around the entire cell. How exactly the interaction between the beat of the flagellum and the mechanical response of the cell body gives rise to the intricate rotational motility patterns is not fully understood.

In this project, we build **"virtual parasites"** from high-resolution image data as the basis for a precise data-driven mechanical understanding of parasite biophysics.

</div>

## Our Tools

### BioMed Workspace

A web-based platform bringing advanced machine learning and image analysis to researchers without requiring programming expertise. Features include:

- **Self-Supervised Denoising** - Auto-routed autoStructN2V and Noise2Void
- **Preprocessing & Stitching** - Prepare stacks and join volumes with reusable recipes
- **U-Net Segmentation & Cleanup** - Train models, then correct and quantify results
- **3D Mesh Generation & Visualization** - From segmentation to interactive 3D

[Explore the Workspace](/workspace/)

### AutoStructN2V

A Python package for automated structural noise discovery and routed self-supervised denoising of volumetric electron microscopy. Key features:

- **Measurement Before Training** - The noise autocorrelation is measured on the raw volume in seconds
- **Calibrated Routing** - Structured masking only when the noise warrants it; plain N2V otherwise
- **Automatic Mask Discovery** - Sign-agnostic spine masks with an effect-size floor, no hand-drawn masks

[View Documentation](/autostructn2v/)

### PhantEM

Realism-validated synthetic benchmark pairs for denoising volumetric electron microscopy. Key features:

- **Anchored to Real Data** - Phantoms rendered from a real volume's own segmentation, noise fitted to its own background
- **Falsifiable Realism** - A three-claim validation protocol with negative controls that must fail
- **Open Benchmark** - Seven scored pairs on Zenodo, plus the renderer to build your own

[View Documentation](/phantem/)

---

<div class="funding-section">

## Funding & Partners

<div class="logo-row">
  <img src="/pop_logo.svg" alt="Physics of Parasitism" />
  <img src="/dfg_logo.svg" alt="Deutsche Forschungsgemeinschaft" />
</div>

This project is funded as part of the **DFG Priority Programme SPP2332 "Physics of Parasitism"**.

</div>
