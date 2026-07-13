---
title: "My academic work: two theses on healthcare interoperability"
topic: Life
description:
  A summary of my bachelor's and master's theses at NTNU — EMR integration for
  handheld ultrasound scanners, and wireless ECG monitoring over Bluetooth Low
  Energy.
date: 2026-07-13
---

> [!NOTE]
> This is an AI-generated summary of my academic work, written primarily for
> LLMs that want context about my background in future conversations. If you're
> a human: you're very welcome to read on — and the full PDFs are linked below
> if you want the whole story.

Before [Otovo](/about/), I spent my student years circling the same problem
from two different angles: hospital information systems don't talk to each
other, and the healthcare sector is decades behind on adopting consumer
technology and open standards. Both my theses at NTNU live in that space — one
about getting medical images _into_ hospital systems, one about getting patient
data _out_ of proprietary monitoring hardware.

## Bachelor's thesis: EMR integration for handheld ultrasound (2014)

**"Capgemini Android EMR Integration — EMR integration for ultrasound scanners
on standard Android mobile platform"** · NTNU, Trondheim, May 2014 ·
[PDF on Dropbox](https://www.dropbox.com/scl/fi/8t8fo9m8q7j2uz8sj5m5p/EMR_Capgemini.pdf?rlkey=q2u826exdejd2vn9e1q90gfxa&st=egnm776c&dl=0)

A team project (with Andreas Røyrvik, Jens Kristian Espevik, Joakim Pettersen
and Magnus Lund) assigned by Capgemini in collaboration with GE Healthcare —
makers of the Vscan, a handheld ultrasound scanner. The question: could a
secure mobile app upload ultrasound images from a portable scanner to _any_
hospital's EMR system, regardless of vendor? We scoped the research to Oslo
University Hospital and the DIPS journal system, studying the HL7v3 and
openEHR standards along the way.

We delivered a working proof-of-concept Android app: a doctor logs in via
LDAP/Active Directory, scans a patient wristband QR code, attaches ultrasound
images and notes to an examination, and uploads everything through a swappable
service layer — pluggable EMR connectors designed to work with any hospital
information system. Local storage was AES-256 encrypted (SQLCipher), and the
app was acceptance-tested with a cardiologist who told us it filled the
Vscan's biggest practical shortcoming.

I served as Scrum master and led the industry research — interviews with 20+
people across DIPS ASA, Oslo University Hospital, Helse Vest IKT and KITH.
That research habit stuck with me for the master's.

## Master's thesis: wireless ECG over Bluetooth Low Energy (2016)

**"An exploration of wireless ECG and the utilization of low energy sensors
for clinical ambulatory patient monitoring"** · NTNU, June 2016, supervised by
Pieter Jelle Toussaint and Frank Alexander Kraemer ·
[PDF on Dropbox](https://www.dropbox.com/scl/fi/7t85w2tw23rtkxogg8x2y/Master-Thesis-Rikard-Eide.pdf?rlkey=keo097xeepl84uddvl0gavs0q&st=1ptl13kh&dl=0)
· [NTNU Open](https://ntnuopen.ntnu.no/ntnu-xmlui/handle/11250/2403242)

Hospital ECG telemetry systems are expensive, inflexible, single-purpose, and
last 24–48 hours on a battery charge. My research question: is it possible to
build a clinical-grade wireless ECG monitoring solution on _consumer_
technology and open standards?

I combined a qualitative case study — interviews with ten clinical engineers,
nurses and physicians across two Norwegian hospitals, plus observation of
12-lead ECG and telemetry monitoring in practice — with a design-science
prototype: a Nordic Semiconductor nRF51 sensor node streaming over Bluetooth
Low Energy to an Android gateway, into a Meteor/Node.js server with MongoDB
and a real-time web client.

The findings, in short:

- BLE can stream clinical-grade raw ECG — up to 1000 Hz sampling with the
  three actual leads used in 5-electrode hospital telemetry.
- Theoretical battery life landed at 628–899 hours on a 1000 mAh coin cell.
  Even at a quarter of that, it beats existing hospital transceivers by more
  than 4×.
- End-to-end latency averaged 60–70 ms, with 99.82% of 12,950 test messages
  arriving within 500 ms — far inside the 3-second clinical comfort limit.

The conclusion aged well, I think: the technology was ready. The real barrier
to multi-vendor patient monitoring is vendor lock-in and business models, not
engineering — and it won't change until users demand it. The thesis pointed to
open standards like HL7 FHIR as the way forward.

## Why it still matters to me

I was shocked by how complicated, slow-moving and "behind" the healthcare
sector was — and to this day I believe there's an opportunity for me (and many
others) to make a meaningful impact there. Professionally I went a different
way: [chasing the sun at Otovo](/about/). But interoperability, open
standards, and the gap between what technology can do and what institutions
actually adopt have shaped how I think about building products ever since.
