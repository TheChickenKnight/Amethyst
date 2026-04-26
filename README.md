# Amethyst
### Portable Edge Server & Local AI Inference Platform

> A fully self-hosted Raspberry Pi 4B edge server running production microservices and a zero-cloud AI audio inference pipeline — all within the constrained compute of a $35 device.

[![Platform](https://img.shields.io/badge/Platform-Raspberry%20Pi%204B-c51a4a?logo=raspberry-pi)](https://www.raspberrypi.com/)
[![OS](https://img.shields.io/badge/OS-Debian%20Linux-red?logo=debian)](https://www.debian.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-Node.js-yellow?logo=node.js)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://python.org)
[![Status](https://img.shields.io/badge/Status-Production-brightgreen)]()

---

## What It Is

Amethyst is a personal edge computing platform provisioned from scratch on a Raspberry Pi 4B. It does two things simultaneously:

1. **Edge Server** — Hosts and manages multiple live microservices (Discord bot backends, game servers) with real process supervision and uptime management on bare Debian Linux.

2. **Local AI Inference Platform** — Runs a fully on-device audio AI pipeline: live microphone capture → speech-to-text transcription → small language model (SLM) inference → structured output. No cloud. No API calls. No latency from a remote server.

The flagship application is **real-time lecture note generation** — audio captured live, transcribed on-device, structured into notes by a local SLM, all running within the Pi's 4GB RAM and 1.8GHz CPU.

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Raspberry Pi 4B                    │
│                  Debian Linux                       │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │          Audio AI Pipeline                   │   │
│  │                                              │   │
│  │   mic.js          stt.js          SLM        │   │
│  │  [Live Audio] → [Speech-to-Text] → [Inference│   │
│  │   Capture]     [Transcription]    → Structured│   │
│  │                                    Output]   │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────┐  ┌──────────────────────────┐  │
│  │  Discord Bots   │  │    Game Server           │  │
│  │  (Microservice) │  │    (Microservice)        │  │
│  └─────────────────┘  └──────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │  Linux Runtime Layer                         │   │
│  │  SSH · Port Forwarding · Static IP           │   │
│  │  User Permissions · Process Supervision      │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
             ▲                        ▲
        [Local Network]         [Port-forwarded
                                  Services]
```

---

## Key Components

### `mic.js` — Live Audio Capture
Handles real-time microphone input from the Pi's audio interface, streaming raw audio data into the transcription pipeline with minimal buffering overhead to maintain real-time throughput.

### `stt.js` — Speech-to-Text Transcription
On-device transcription of the live audio stream. Converts spoken audio into text entirely locally — no Whisper API, no Google STT, no cloud dependency.

### `player.js` — Audio Playback & Pipeline Control
Manages audio playback and pipeline state, coordinating the flow between capture, transcription, and inference stages.

### `history.json` — Session & State Persistence
Stores conversation/session history across pipeline runs, enabling the SLM to maintain context across a lecture session without relying on external storage.

---

## Infrastructure Setup

Everything provisioned from scratch — no pre-configured images, no managed services:

- **OS Installation** — Debian Linux flashed and configured directly on the Pi 4B
- **Networking** — Static IP assignment, SSH configuration, and port forwarding for remote access and externally-accessible services
- **User & Permissions** — Linux user management, `sudo` policies, and service-level access control
- **Process Supervision** — Multiple production services running concurrently with uptime monitoring and live state management
- **Resource Budgeting** — All workloads (AI pipeline + microservices) engineered to coexist within 4GB RAM and the Pi's thermal/power constraints

---

## The AI Pipeline

The audio inference pipeline is the core technical achievement of Amethyst. Every component runs **100% on-device**:

```
Live Mic Input
     │
     ▼
 mic.js
 (Real-time audio capture)
     │
     ▼
 stt.js
 (On-device speech-to-text transcription)
     │
     ▼
 SLM Inference
 (Small Language Model, selected for Pi-class hardware)
     │
     ▼
 Structured Output
 (Formatted lecture notes → history.json)
```

**The constraint challenge:** Making real-time AI inference work on a Pi 4B requires deliberate tradeoffs — model quantization, careful memory allocation, and pipeline scheduling to avoid I/O blocking between the audio capture and inference stages.

---

## Tech Stack

| Layer                  | Technology                        |
|------------------------|-----------------------------------|
| Hardware               | Raspberry Pi 4B (4GB RAM)         |
| Operating System       | Debian Linux                      |
| Audio Capture & Pipeline | Node.js (`mic.js`, `stt.js`, `player.js`) |
| AI / SLM Inference     | Python + on-device SLM            |
| Networking             | SSH, static IP, port forwarding   |
| State / History        | JSON (`history.json`)             |
| Microservices          | Discord bot backends, game server |

---

## Getting Started

### Prerequisites
- Raspberry Pi 4B (2GB+ RAM recommended, 4GB for full pipeline)
- Debian/Raspberry Pi OS (64-bit recommended)
- Node.js 18+
- Python 3.10+
- USB microphone or Pi-compatible audio interface

### Installation

```bash
# Clone the repo
git clone https://github.com/TheChickenKnight/Amethyst.git
cd Amethyst

# Install Node.js dependencies
npm install

# (Set up Python environment for SLM inference)
pip install -r requirements.txt
```

### Running the Audio Pipeline

```bash
node mic.js      # Start audio capture
node stt.js      # Start transcription pipeline
```

> Model weights and service configuration files are not included in this repo. See project notes for setup details.

---

## Why This Project

Running AI inference on a Pi 4B is a real constraint-engineering problem — not a cloud task you can throw resources at. Amethyst demonstrates:

- **Edge AI** — On-device SLM inference with zero cloud dependency, the same model deployment pattern used in IoT, embedded systems, and privacy-sensitive applications
- **Linux systems skills** — Bare-metal provisioning, process management, and network configuration that underlie real production deployments
- **Microservice operations** — Running and maintaining multiple concurrent services on a single resource-constrained device, mirroring the discipline of embedded and edge DevOps

Optionally, the local LLM can be replaced by api calls to my home computer, allowing for further automation from anywhere.
---

## License

MIT