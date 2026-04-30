# 👋 Hi, I'm Shivaprasad V

<div align="center">
  <img src="https://img.shields.io/badge/Embedded_Systems-Expert-blue?style=for-the-badge&logo=arduino" alt="Embedded Systems">
  <img src="https://img.shields.io/badge/Signal_Processing-Specialist-green?style=for-the-badge&logo=signal" alt="Signal Processing">
  <img src="https://img.shields.io/badge/CubeSat_ADCS-Developer-purple?style=for-the-badge&logo=satellite" alt="CubeSat ADCS">
  <img src="https://img.shields.io/badge/Real_Time_Systems-Engineer-orange?style=for-the-badge&logo=realtime" alt="Real-Time Systems">
</div>

<div align="center">
  <a href="https://github.com/SpDly14"><img src="https://img.shields.io/github/followers/SpDly14?style=social" alt="GitHub Followers"></a>
  <a href="https://github.com/SpDly14"><img src="https://img.shields.io/github/stars/SpDly14?style=social" alt="GitHub Stars"></a>
</div>

---

## 🚀 About Me

I'm a **System Design Engineer** specializing in **Embedded Systems**, **Signal Processing**, **CubeSat ADCS**, and **Real-Time Communication Systems**. I build end-to-end hardware–software systems — from PCB layout and firmware to telemetry pipelines and SDR communication links.

Based in Chennai, India, I focus on the hardware–signal boundary, creating systems that bridge the gap between physical hardware and digital signal processing.

### 🎯 Focus Areas

- **Embedded Systems Design** — Microcontroller programming, RTOS, real-time constraints
- **Digital Signal Processing** — FIR/IIR filters, frequency analysis, adaptive algorithms
- **CubeSat ADCS** — Attitude determination and control systems, reaction wheels, IMU fusion
- **SDR Communication** — Software-defined radio, GNU Radio, RF telemetry
- **Hardware-Software Co-Design** — System architecture, register-level optimization

---

## 🛠️ Tech Stack

### Hardware & Microcontrollers
- **Microcontrollers**: Arduino (ATmega328P), ESP32 (Dual-Core Xtensa LX6)
- **Sensors**: MPU6050 IMU, ADC modules
- **Communication**: UART Serial, I2C, SPI
- **RF Hardware**: ADALM Pluto SDR

### Programming Languages
- **Embedded C/C++** — Register-level programming, interrupt-driven systems
- **Python** — Data analysis, geospatial processing, digital twins
- **Arduino** — Rapid prototyping and hardware abstraction

### Frameworks & Libraries
- **FreeRTOS** — Real-time operating system, task scheduling, semaphores
- **GNU Radio** — SDR signal processing, modulation/demodulation
- **GeoPandas / Shapely** — Geospatial data analysis
- **NumPy / Matplotlib** — Numerical computing and visualization

### Communication Protocols
- **MQTT** — Real-time messaging, IoT communication
- **UART Serial** — High-throughput data transmission (up to 1 Mbps)
- **RF Telemetry** — CPFSK modulation, frequency hopping

---

## 📦 Featured Projects

### 🔌 Adaptive Signal-Driven FIR Filter System
**Real-time signal acquisition, adaptive filtering & output reconstruction on Arduino UNO**

[![Embedded C](https://img.shields.io/badge/Embedded_C-Arduino-blue)](https://www.arduino.cc/)
[![DSP](https://img.shields.io/badge/DSP-Signal_Processing-green)](https://en.wikipedia.org/wiki/Digital_signal_processing)

A real-time digital signal processing system built on Arduino UNO that performs continuous signal acquisition, adaptive FIR filtering, and output reconstruction. The system automatically identifies input signal characteristics and dynamically reconfigures filter parameters.

**Key Metrics:**
- Sampling Rate: 40 kHz
- Serial Throughput: 1 Mbps
- Input Latency: ~17 ms
- CPU Utilization: ~18%
- Frequency Accuracy: ±4 Hz

**Tech Stack:** Arduino UNO (ATmega328P), Embedded C, Interrupt-Driven ADC, Circular Buffering, FIR Filter Design, UART Serial

---

### 🛰️ Stellar Crest — CubeSat ADCS Prototype
**Attitude Determination & Control System with SDR telemetry, digital twin, and custom ground station**

[![ESP32](https://img.shields.io/badge/ESP32-RTOS-blue)](https://www.espressif.com/)
[![FreeRTOS](https://img.shields.io/badge/FreeRTOS-Real_Time-green)](https://www.freertos.org/)
[![SDR](https://img.shields.io/badge/SDR-GNU_Radio-purple)](https://www.gnuradio.org/)

A functional CubeSat ADCS prototype using ESP32, MPU6050, and three reaction wheels for three-axis attitude control. The system incorporates a full SDR communication link, a real-time digital twin for simulation and validation, and a custom ground station for telemetry visualization.

**Key Metrics:**
- IMU Sample Rate: 50 Hz
- RF Band: 862–868 MHz
- Modulation: CPFSK
- Frequency Hopping: 256-channel CSPRNG
- Control Axes: 3-axis

**Tech Stack:** ESP32, MPU6050 IMU, FreeRTOS, Cascaded PID, GNU Radio, CPFSK Modulation, Python Digital Twin

---

### 💡 AM Optical Communication Link
**DSB-FC optical transmitter-receiver system with experimental noise and bandwidth analysis**

[![Analog](https://img.shields.io/badge/Analog-Modulation-orange)](https://en.wikipedia.org/wiki/Amplitude_modulation)
[![Optical](https://img.shields.io/badge/Optical-LED_LDR-yellow)](https://en.wikipedia.org/wiki/Optical_communication)

A hardware implementation of a DSB-FC (Double Sideband Full Carrier) amplitude modulation optical communication link. The system includes a transmitter stage for modulation and optical emission, and a receiver stage for photodetection, signal conditioning, and demodulation.

**Key Metrics:**
- Modulation: DSB-FC
- Medium: Optical (LED/LDR)
- Validation: Experimental

**Tech Stack:** Carrier Generator, AM Modulator, LED Driver, Photodetector (LDR), Amplifier Stage, Envelope Detector

---

### 📊 Delay-Based Slope Sign Modulator & Demodulator
**Prototype SSM/SSD system using delay-based signal comparison across frequency and waveform conditions**

[![Modulation](https://img.shields.io/badge/Modulation-SSM_SSD-blue)](https://en.wikipedia.org/wiki/Modulation)
[![Signal Processing](https://img.shields.io/badge/Signal_Processing-Prototype-green)](https://en.wikipedia.org/wiki/Signal_processing)

A hardware prototype implementing slope sign modulation (SSM) and demodulation using a delay-based signal comparison approach. The modulator encodes binary data based on signal slope polarity; the demodulator reconstructs the signal by comparing delayed versions.

**Key Metrics:**
- Method: Delay-Based Comparison
- Validation: Multi-Frequency

**Tech Stack:** Delay Network, Comparator Stage, Logic Encoder, Slope Sign Detector, Signal Reconstructor

---

### ⚡ RTOS-Based Multi-Core Embedded System
**Dual-core task scheduling with semaphore synchronization and MQTT-bridged Python integration**

[![ESP32](https://img.shields.io/badge/ESP32-Dual_Core-blue)](https://www.espressif.com/)
[![FreeRTOS](https://img.shields.io/badge/FreeRTOS-Semaphore-green)](https://www.freertos.org/)
[![MQTT](https://img.shields.io/badge/MQTT-Real_Time-orange)](https://mqtt.org/)

A dual-core RTOS application on ESP32 implementing concurrent task execution with semaphore-based synchronization across cores. The system integrates an MQTT communication bridge to a Python host for real-time data exchange and monitoring.

**Key Metrics:**
- Task Switch Latency: <1 ms
- MQTT Comm Delay: ~10 ms
- Cores: Dual (ESP32)
- Sync Mechanism: Semaphore

**Tech Stack:** ESP32 (Dual-Core Xtensa LX6), FreeRTOS, Semaphores, Task Pinning, MQTT over Wi-Fi, Python MQTT Client

---

### 🗺️ Automated Shoreline Analysis System
**Python-based geospatial tool for automated shoreline change detection and statistical reporting**

[![Python](https://img.shields.io/badge/Python-Geospatial-blue)](https://www.python.org/)
[![GeoPandas](https://img.shields.io/badge/GeoPandas-Shapely-green)](https://geopandas.org/)

A Python automation tool for shoreline change analysis using geospatial datasets. The system processes input geographic data, computes shoreline change metrics, generates intermediate analysis outputs, and produces formatted statistical reports.

**Key Metrics:**
- Execution: Fully Automated
- Output: Reports + Stats
- Input: Geospatial Data

**Tech Stack:** Python, GeoPandas, Shapely, NumPy, Matplotlib, PDF/CSV Reports, GeoJSON Outputs

---

## 📈 GitHub Stats

<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=SpDly14&show_icons=true&theme=dark&hide_border=true" alt="GitHub Stats">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=SpDly14&theme=dark&hide_border=true" alt="GitHub Streak">
</div>

<div align="center">
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=SpDly14&layout=compact&theme=dark&hide_border=true" alt="Top Languages">
</div>

---

## 🌐 Portfolio

Check out my full portfolio at **[spdly.is-a.dev](https://spdly.is-a.dev)**

---

## 📬 Get In Touch

<div align="center">
  <a href="mailto:spdly.studios@gmail.com">
    <img src="https://img.shields.io/badge/Email-spdly.studios@gmail.com-red?style=for-the-badge&logo=gmail" alt="Email">
  </a>
  <a href="https://linkedin.com/in/spdly">
    <img src="https://img.shields.io/badge/LinkedIn-spdly-blue?style=for-the-badge&logo=linkedin" alt="LinkedIn">
  </a>
  <a href="https://github.com/SpDly14">
    <img src="https://img.shields.io/badge/GitHub-SpDly14-white?style=for-the-badge&logo=github" alt="GitHub">
  </a>
</div>

---

<div align="center">
  <img src="https://komarev.com/ghpvc/?username=SpDly14&style=for-the-badge" alt="Profile Views">
</div>

<div align="center">
  <sub>Built with ❤️ by Shivaprasad V</sub>
</div>
