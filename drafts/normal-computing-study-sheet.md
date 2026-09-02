---
title: "Normal Computing and the semiconductor stack: a one-page study sheet"
topic: Tech
description:
  Interview prep notes on where Normal Computing sits in the AI hardware
  stack, who its competitors are, and the chip-design vocabulary (EDA, RTL,
  verification, tape-out, compute-in-memory) needed to talk about it with
  confidence.
date: 2026-09-02
draft: true
---

> [!NOTE] Internal notes
> - Written by Claude Code on 2026-09-02 from two sources on the Desktop: the
>   four-page "Normal Computing Overview.pdf" and the transcript of The Wall
>   Street Skinny short "The TRUTH about the Semiconductor Trade" (2026-08-30).
>   The five-layer cake is on the short's whiteboard, not in the transcript.
>   The short borrowed it from Jensen Huang's Nvidia post "AI Is a 5-Layer
>   Cake" (2026-03-10). The layer one-liners in the table are quoted from there.
> - Everything under "Competitors" and the funding figures came from web
>   searches, not from the two files. Links at the bottom.
> - The PDF says CN101 taped out in June 2025. The press release is dated
>   August 2025. Say "mid-2025" if asked.
> - Decide whether this stays a private study sheet or becomes a post. If it
>   becomes a post, cut the "questions to ask" section.

A study sheet for a job interview with [Normal Computing](https://normalcomputing.com).
The goal is to place the company on a map of the AI industry, know who it
competes with, and be able to use the chip-design vocabulary without
hesitating.

## The five-layer cake

The model comes from Jensen Huang's Nvidia post
[AI Is a 5-Layer Cake](https://blogs.nvidia.com/blog/ai-5-layer-cake/)
(March 2026): "When you look at AI industrially, it resolves into a five-layer
stack." The Wall Street Skinny short reuses it and zooms in on layer two, which
splits into memory and logic.

| Layer | What it is | Example players | Where Normal Computing fits |
| --- | --- | --- | --- |
| 5. Applications | Products built on top of models. "Where economic value is created" | Cursor, Perplexity, vertical AI startups | Not present |
| 4. Models | Foundation model labs that train and serve models. "AI models understand many kinds of information: language, biology, chemistry, physics, finance, medicine and the physical world itself" | OpenAI, Anthropic, Google DeepMind, Meta | Target workloads: diffusion models and long-context transformer decoding. Also trains its own post-trained models for EDA |
| 3. Infrastructure | "Land, power delivery, cooling, construction, networking and the systems that orchestrate tens of thousands of processors into one machine" | AWS, Azure, Google Cloud, CoreWeave, Foxconn and Wistron for rack assembly | Customer. Normal's PCIe cards install into existing air-cooled servers, with forward-deployed engineers doing the install |
| 2. Chips | "Processors designed to transform energy into computation efficiently at massive scale." Splits into memory (HBM) and logic (GPUs, ASICs), plus the supply chain behind them | Memory: SK Hynix, Micron, Samsung. Logic: Nvidia, AMD, Broadcom | **Here, twice.** Normal ASICs is a fabless logic-chip designer. Normal EDA sells design software to the other companies on this layer |
| 1. Energy | "Intelligence generated in real time requires power generated in real time." Generation, grid and utilities feeding data centers | Utilities, power producers, grid and cooling equipment | Indirect. The pitch is cutting the energy cost of inference, so Normal sells against this layer's constraint |

## Layer two up close: the chip supply chain

The short walks through what happens when a data-center buyer orders a chip
from Nvidia, AMD or Broadcom. Normal appears in the first two rows and nowhere
else.

| Step | Who | Notes |
| --- | --- | --- |
| **Design software (EDA)** | Cadence, Synopsys (Siemens EDA is the third incumbent the short skips) | **Normal EDA plays here.** Its agents run on top of these toolchains today and are building replacements for parts of them |
| **Chip designer (fabless)** | Nvidia, AMD, Broadcom | **Normal ASICs plays here.** CN101 is its first chip. Like Nvidia, Normal designs and outsources manufacturing |
| Fab | TSMC | Makes about 90% of cutting-edge logic chips. Hence Taiwan's geopolitical weight |
| Wafers | Shin-Etsu, Sumco | Tokyo-listed, roughly half of world supply |
| Deposition | Applied Materials, Lam Research | Lays down the thin film the circuit is built from |
| Photoresist | Tokyo Electron (machine), Shin-Etsu and JSR (chemical) | The light-sensitive stencil. JSR was taken private by a Japanese state fund in 2024 |
| Lithography | ASML | The only supplier of leading-edge machines. China has built one a tier down |
| Repeat | | The cycle above runs about 80 times per wafer |
| Dicing | Disco | Cuts the wafer into individual chips |
| Memory (HBM) | Micron, SK Hynix | Mounted next to the GPU |
| Substrate | Ajinomoto (ABF film) | The MSG company |
| Inspection and test | KLA (inspection), Advantest and Teradyne (electrical test) | Runs throughout, not only at the end |
| Rack assembly | Foxconn, Wistron | Compute trays, switch trays, networking, liquid cooling. A rack is about $6M. "Nvidia doesn't sell chips, they sell racks" |

## Where Normal Computing sits

Normal describes itself as "an applied AI company solving the hardest problems
in AI and silicon". It has two products and a flywheel between them.

- **Normal EDA** is a set of AI agents for front-end chip work: auditing specs
  for ambiguity, generating test plans, SystemVerilog stimulus and RTL,
  debugging waveforms and closing coverage. It integrates with existing
  simulators, coverage tools, source control and compute farms. Customers are
  "the world's largest semiconductor companies", reportedly more than half of
  the top ten by revenue.
- **Normal ASICs** are inference chips built on "new device physics". They use
  thermal noise as a computational resource, do the heaviest operations inside
  memory, and run asynchronously. The first target is long-context decoding,
  then diffusion workloads. They ship as PCIe cards for standard air-cooled
  servers, a deliberate contrast with the liquid-cooled Nvidia rack.
- **The flywheel.** EDA earns revenue and trust from incumbents now. The chip
  is the long-term bet. Each proves the other, and the in-house EDA de-risks
  the in-house tape-outs. The Samsung-led round and the Pangyo office fit,
  since Samsung is both a chip designer and a foundry.

| Fact | Value |
| --- | --- |
| Latest round | $50M led by Samsung Catalyst, March 2026 |
| Other investors on the PDF | Brevan Howard, ArcTern, Galvanize, Eric Schmidt, First Spark, Drive, Celesta |
| First chip | CN101, "world's first thermodynamic computing chip", taped out mid-2025 |
| Efficiency claim | 10 to 100x AI inference per dollar and per watt |
| Capacity claim | Transformer attention in memory for ~500B-parameter models at rack scale |
| Team background | TensorFlow, Meta Probability, Google X, Palantir, NVIDIA and Apple CPU/GPU IP, Graphcore, Los Alamos NISQ |
| Offices | New York, San Francisco, London, Copenhagen, Pangyo |
| Public funding | UK ARIA, Scaling Compute programme |

## Competitors

The PDF names none. The short names Cadence and Synopsys, which are the
incumbents Normal EDA integrates with today and increasingly competes against.
The rest is from web research.

- **AI agents for EDA.** Synopsys, Cadence and Siemens all launched autonomous
  design and verification agents around DAC 2026. Cadence's is called
  ChipStack. Among startups, ChipAgents is the best funded, with a claimed
  $134M Series A total and its own fine-tuned model. Silimate does AI
  debugging and PPA prediction. Cognichip and Agentrys are smaller. Normal's
  stated differentiation is formal grounding of specs, continual learning on
  customer data, and models that run on the customer's own machines.
- **Physics-based compute.** Extropic is the direct rival on the thermodynamic
  story. It builds "thermodynamic sampling units" from probabilistic bits and
  claims very large energy gains on diffusion-style workloads. Expect a
  question on the difference. Normal's answer in the PDF is compute-in-memory
  plus transformer attention, not only sampling.
- **Inference ASICs generally.** Groq, Cerebras, Etched, d-Matrix and the
  hyperscalers' in-house chips such as Google's TPU. Broadcom builds many of
  those custom ASICs, which is why it sits next to Nvidia in the short.

## Vocabulary

| Term | What it is | Why it matters here |
| --- | --- | --- |
| EDA | Electronic design automation. The software used to design, simulate and verify chips. "CAD for silicon." Flow: spec, architecture, RTL, verification, synthesis, place-and-route, signoff, tape-out | Normal EDA's market. Cadence and Synopsys are the duopoly |
| Logic vs memory chips | Logic computes (CPU, GPU, ASIC). Memory stores (DRAM, HBM) | The two halves of layer two. Normal's chip blurs the line by computing inside memory |
| RTL | Register-transfer level. The source code of a chip, in Verilog, SystemVerilog or VHDL. Describes the logic between storage registers each clock cycle | One of the artifacts Normal EDA generates |
| SystemVerilog, stimulus | A language for both design and test. Stimulus is the set of inputs a testbench feeds into a design in simulation | Normal EDA generates stimulus from specs |
| Verification, coverage | Proving the RTL matches the spec. Usually more than half of a chip project's effort. Coverage measures how much of the design the tests exercised. "Closing coverage" means hitting the target | The core of the Normal EDA pitch |
| Spec auditing, autoformalization | Specs are ambiguous prose. Autoformalization turns them into a structured, machine-checkable representation before anything is generated | The PDF calls this structured form "the Ontology" |
| Waveform | Signal values over time, output by simulation. Engineers read waveforms to find bugs | Normal has an AI-native waveform debugger with MCP support so agents can drive it |
| Synthesis, simulation, signoff | Synthesis turns RTL into a gate-level netlist. Simulation runs RTL against stimulus. Signoff is the final timing, power and manufacturing checks | Normal is building its own "AI-native simulation and synthesis engines" |
| Tape-out | Sending the finished design to the fab. Expensive and irreversible. Silicon returns months later | "We taped out CN101" is a credibility marker |
| PPA | Power, performance, area. The three metrics every chip decision trades off | What Silimate predicts; what all EDA optimizes |
| ASIC, fabless, IP | An ASIC is a chip built for one job, unlike a general-purpose GPU. Fabless means designing chips and outsourcing manufacturing. IP means reusable design blocks | Normal is fabless. "CPU and GPU IP at NVIDIA and Apple" refers to such blocks |
| Analog and mixed-signal | Circuits that work with continuous voltages rather than only 0 and 1 | Normal's chips are analog compute-in-memory. Historically hard to productize; Mythic is a cautionary tale |
| Compute-in-memory, the memory wall | Moving data between HBM and the compute die costs more energy than the arithmetic. Processing-in-memory does the math where the data lives | The physics argument behind Normal ASICs. Links to the short's HBM section |
| The long-context wall | During decoding, attention rereads a growing cache of prior tokens. Memory traffic, not math, becomes the bottleneck | Normal's first workload is long-context decoding |
| Thermodynamic, stochastic computing | Generative models need huge amounts of random sampling. Instead of simulating randomness digitally, let thermal noise supply it. "Noise as a resource" | Normal's core claim. Extropic's term is pbits |
| NISQ | Noisy intermediate-scale quantum. Computing reliably on noisy hardware | Team background at Los Alamos. Same skill, different physics |
| Diffusion workloads | Image and video generation, and newer diffusion language models. They iteratively denoise, so they are sampling-heavy | Normal's roadmap target for data centers |
| Inference vs training | Training builds the model. Inference runs it. Inference volume dwarfs training | Normal targets inference per dollar per watt |
| HBM | High-bandwidth memory stacked next to the GPU. Micron, SK Hynix, Samsung | The bottleneck compute-in-memory tries to sidestep |
| PCIe accelerator card | Plugs into a standard server slot. Air-cooled means no liquid-cooling retrofit | Lowers Normal's adoption barrier |
| Forward-deployed engineer | The Palantir model: engineers install and adapt the product at the customer's site | Several of Normal's operators came from Palantir |
| Post-training on local infrastructure | Fine-tuning models on customer data and running them on the customer's own machines | Chip designs are among the most secret IP anywhere. On-prem is a selling point |
| ARIA | The UK's Advanced Research and Invention Agency | Funds part of Normal's chip work via its Scaling Compute programme |

## Questions to ask them

- How much of revenue today is EDA versus silicon, and how does that shift?
- Which foundry and process node does CN101 use, and what comes back first?
- How do you see Cadence and Synopsys shipping their own agents?
- What does a customer engagement look like from first contact to production?

## Sources

- [Normal Computing raises $50M led by Samsung Catalyst](https://www.prnewswire.com/news-releases/normal-computing-raises-50m-led-by-samsung-catalyst-to-accelerate-silicon-design-and-solve-ai-hardware-energy-crisis-302724819.html)
- [Normal Computing announces tape-out of CN101](https://www.normalcomputing.com/blog/normal-computing-announces-tape-out-of-worlds-first-thermodynamic-computing-chip)
- [Scaling Thermodynamic Compute, Normal Computing blog](https://www.normalcomputing.com/blog/scaling-thermodynamic-compute)
- [SiliconANGLE on the $50M round](https://siliconangle.com/2026/03/25/normal-computing-raises-50m-tackle-soaring-energy-demands-ai-chips/)
- [Autonomous chip design agents at DAC 2026](https://nerdleveltech.com/autonomous-chip-design-agents-synopsys-cadence-siemens)
- [Cadence unveils ChipStack AI agent, EE Times](https://www.eetimes.com/cadence-unveils-chipstack-ai-agent-for-agentic-chip-design-and-verification/)
- [Forbes: Could EDA AI startups be the new Claude of chip design?](https://www.forbes.com/sites/karlfreund/2026/08/03/could-eda-ai-startups-be-the-new-claude-of-chip-design/)
- [Silimate CEO pioneers AI debugger, Stanford Daily](https://stanforddaily.com/2026/03/11/silimate-ceo-pioneers-ai-debugger/)
- [Thermodynamic computers go with the energy flow, Quanta](https://www.quantamagazine.org/thermodynamic-computers-go-with-the-energy-flow-20260715/)
- [Extropic](https://extropic.ai/)
- [The Wall Street Skinny: The TRUTH about the Semiconductor Trade](https://www.youtube.com/watch?v=WDaLN0cN_Jk)
- [Jensen Huang: AI Is a 5-Layer Cake, Nvidia blog](https://blogs.nvidia.com/blog/ai-5-layer-cake/)
