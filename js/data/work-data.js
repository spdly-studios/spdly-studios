/**
 * work-data.js — All project/work entries
 * Depends on: nothing
 *
 * Each entry is a self-contained object consumed by:
 *   - pages/home.js   (renders the grid cards)
 *   - pages/work.js   (renders the full detail page)
 *
 * Image paths are root-relative: "assets/projects/<slug>/..."
 * Add a new project by appending an object to WORK_DATA.
 */

const WORK_DATA = [
  {
    id: 'fir-filter',
    title: 'Adaptive Signal-Driven FIR Filter System',
    tagline: 'Real-time signal acquisition, adaptive filtering & output reconstruction on Arduino UNO',
    category: 'Embedded Systems',
    tags: ['Embedded C', 'Arduino', 'DSP', 'ADC', 'Signal Processing'],
    thumb: 'assets/projects/fir-filter/thumb.jpg',
    hero:  'assets/projects/fir-filter/hero.jpg',
    metrics: [
      { label: 'Sampling Rate',      value: '40 kHz'  },
      { label: 'Serial Throughput',  value: '1 Mbps'  },
      { label: 'Input Latency',      value: '~17 ms'  },
      { label: 'CPU Utilization',    value: '~18%'    },
      { label: 'Frequency Accuracy', value: '±4 Hz'   },
      { label: 'Max Filter Order',   value: '10th'    }
    ],
    overview: 'A real-time digital signal processing system built on Arduino UNO that performs continuous signal acquisition, adaptive FIR filtering, and output reconstruction. The system automatically identifies input signal characteristics and dynamically reconfigures filter parameters — all without blocking the main execution loop.',
    objectives: [
      'Achieve continuous 40 kHz interrupt-driven ADC sampling',
      'Implement circular buffering for non-blocking data flow',
      'Auto-detect signal cutoff frequency and configure filter coefficients dynamically',
      'Maintain low CPU utilization while sustaining high-throughput serial output',
      'Support manual override of filter parameters'
    ],
    stack: [
      { category: 'Microcontroller', items: ['Arduino UNO (ATmega328P)'] },
      { category: 'Language',        items: ['Embedded C', 'C++'] },
      { category: 'Techniques',      items: ['Interrupt-Driven ADC', 'Circular Buffering', 'Register-Level Optimization', 'FIR Filter Design', 'Frequency Analysis'] },
      { category: 'Communication',   items: ['UART Serial @ 1 Mbps'] }
    ],
    architecture: 'The system uses interrupt-driven ADC at 40 kHz — each conversion triggers an ISR that writes samples into a circular buffer. A background task reads from the buffer, applies the FIR filter coefficients, and streams reconstructed output over UART. A frequency estimation module periodically analyzes the signal to update cutoff frequency and recompute coefficients on the fly.',
    challenges: [
      'Achieving 40 kHz ADC sampling required direct register manipulation — the Arduino HAL was too slow',
      'Maintaining <18% CPU overhead while running simultaneous ADC, filtering, and serial tasks',
      'Implementing stable real-time frequency estimation without dedicated FFT hardware',
      'Ensuring circular buffer integrity under interrupt preemption'
    ],
    results: 'The system achieved all target metrics: 40 kHz sampling, 1 Mbps UART throughput, ~17 ms latency, ±4 Hz frequency accuracy, and only ~18% CPU utilization. Supports filter orders up to 10th, with 4th order used during real-time validation.',
    future: [
      'Port to ARM Cortex-M4 with hardware FPU for higher-order filters',
      'Add FFT-based spectral display over serial',
      'Extend to multi-channel acquisition'
    ],
    images: [
      { src: 'assets/projects/fir-filter/setup.jpg',    caption: 'Hardware setup — Arduino UNO with signal generator and oscilloscope' },
      { src: 'assets/projects/fir-filter/output.jpg',   caption: 'Filtered output vs input waveform comparison' },
      { src: 'assets/projects/fir-filter/diagram.jpg',  caption: 'System architecture block diagram' }
    ]
  },

  {
    id: 'stellar-crest',
    title: 'Stellar Crest — CubeSat ADCS Prototype',
    tagline: 'Attitude Determination & Control System with SDR telemetry, digital twin, and custom ground station',
    category: 'Space Systems',
    tags: ['ESP32', 'RTOS', 'PID Control', 'SDR', 'GNU Radio', 'Telemetry', 'Python'],
    thumb: 'assets/projects/stellar-crest/thumb.jpg',
    hero:  'assets/projects/stellar-crest/hero.jpg',
    metrics: [
      { label: 'IMU Sample Rate', value: '50 Hz'            },
      { label: 'RF Band',         value: '862–868 MHz'      },
      { label: 'Modulation',      value: 'CPFSK'            },
      { label: 'Freq Hopping',    value: '256-channel CSPRNG' },
      { label: 'Control Axes',    value: '3-axis'           },
      { label: 'Digital Twin',    value: 'Real-time'        }
    ],
    overview: 'A functional CubeSat ADCS prototype using ESP32, MPU6050, and three reaction wheels for three-axis attitude control. The system incorporates a full SDR communication link, a real-time digital twin for simulation and validation, and a custom ground station for telemetry visualization, command uplink, and event logging.',
    objectives: [
      'Acquire IMU data at 50 Hz with complementary-filter attitude estimation',
      'Implement cascaded PID for 3-axis stabilization using reaction wheels',
      'Build SDR communication link with frequency hopping for RF resilience',
      'Develop real-time digital twin for controller tuning and deployment validation',
      'Create custom ground station with telemetry dashboard and command uplink'
    ],
    stack: [
      { category: 'Hardware',       items: ['ESP32', 'MPU6050 IMU', '3× Reaction Wheels', 'ADALM Pluto SDR (×2)'] },
      { category: 'Firmware',       items: ['Embedded C/C++', 'FreeRTOS', 'Complementary Filter', 'Cascaded PID'] },
      { category: 'RF & SDR',       items: ['GNU Radio', 'CPFSK Modulation', '256-channel CSPRNG Freq Hopping'] },
      { category: 'Ground Station', items: ['Python', 'Telemetry Parser', 'Command Uplink', 'Event Logger'] },
      { category: 'Simulation',     items: ['Python Digital Twin', 'Real-time State Mirror'] }
    ],
    architecture: 'The flight computer (ESP32) runs FreeRTOS tasks for IMU acquisition, attitude estimation, PID computation, and actuator command. A separate RF task handles framed telemetry transmission over the SDR link. The ground station receives, demodulates, and parses telemetry in GNU Radio, then feeds a Python dashboard for real-time display. The digital twin mirrors the physical system state for offline validation.',
    challenges: [
      'Achieving stable 3-axis control with coupled reaction wheel dynamics',
      'Implementing CSPRNG-based frequency hopping synchronized between Pluto devices',
      'Building a low-latency digital twin that accurately mirrors physical system behavior',
      'Managing concurrent FreeRTOS tasks with bounded jitter on ESP32\'s dual cores'
    ],
    results: 'Successfully demonstrated 3-axis attitude stabilization on the prototype. SDR link functional at 862–868 MHz with CPFSK modulation and 256-channel frequency hopping. Ground station reliably displayed telemetry with command uplink response. Digital twin validated controller tuning before hardware deployment.',
    future: [
      'Integrate magnetorquer as redundant actuator',
      'Add Kalman filter to replace complementary filter',
      'Test closed-loop ADCS in reduced-gravity environment',
      'Add sun-sensor for absolute attitude reference'
    ],
    images: [
      { src: 'assets/projects/stellar-crest/hardware.jpg', caption: 'ADCS prototype with reaction wheel assembly' },
      { src: 'assets/projects/stellar-crest/gs.jpg',       caption: 'Custom ground station telemetry dashboard' },
      { src: 'assets/projects/stellar-crest/sdr.jpg',      caption: 'GNU Radio SDR communication flow graph' },
      { src: 'assets/projects/stellar-crest/twin.jpg',     caption: 'Real-time digital twin simulation view' }
    ]
  },

  {
    id: 'optical-am',
    title: 'AM Optical Communication Link',
    tagline: 'DSB-FC optical transmitter-receiver system with experimental noise and bandwidth analysis',
    category: 'Communication Systems',
    tags: ['Analog', 'Modulation', 'Signal Conditioning', 'Optical', 'DSB-FC'],
    thumb: 'assets/projects/optical-am/output-dso.png',
    hero:  'assets/projects/optical-am/output-dso.png',
    metrics: [
      { label: 'Modulation',  value: 'DSB-FC'        },
      { label: 'Medium',      value: 'Optical (LED/LDR)' },
      { label: 'Validation',  value: 'Experimental'  }
    ],
    overview: 'A hardware implementation of a DSB-FC (Double Sideband Full Carrier) amplitude modulation optical communication link. The system includes a transmitter stage for modulation and optical emission, and a receiver stage for photodetection, signal conditioning, and demodulation — experimentally validated under various noise and bandwidth conditions.',
    objectives: [
      'Implement DSB-FC AM modulation in hardware',
      'Transmit modulated signal over optical medium',
      'Design receiver with envelope detection and signal conditioning',
      'Evaluate performance under noise injection and bandwidth limiting'
    ],
    stack: [
      { category: 'Transmitter', items: ['Carrier Generator', 'AM Modulator', 'LED Driver Stage'] },
      { category: 'Receiver',    items: ['Photodetector (LDR)', 'Amplifier Stage', 'Envelope Detector', 'Low-Pass Filter'] },
      { category: 'Validation',  items: ['Oscilloscope Analysis', 'Noise Injection Testing', 'Bandwidth Sweep'] }
    ],
    architecture: 'The transmitter generates a carrier and modulates it with the baseband signal to produce DSB-FC AM. The modulated signal drives an LED for optical emission. The receiver uses a photodetector to convert the optical signal back to electrical, then conditions it through amplification, envelope detection, and low-pass filtering to recover the baseband.',
    challenges: [
      'Maintaining linear modulation index across signal amplitude variations',
      'Minimizing ambient light interference on photodetection',
      'Designing wideband amplifier without introducing significant distortion'
    ],
    results: 'System successfully transmitted and recovered audio-range baseband signals over the optical link. Performance evaluated under varying noise conditions and bandwidth constraints with documented SNR characteristics.',
    future: [
      'Extend to OFDM-based optical link for higher data rates',
      'Implement coherent detection for improved noise performance',
      'Test with photodiode for faster response than LDR'
    ],
    images: [
      { src: 'assets/projects/optical-am/setup.jpg',       caption: 'Transmitter and receiver hardware on breadboard' },
      { src: 'assets/projects/optical-am/output-dso.png',  caption: 'Modulated and demodulated waveforms on oscilloscope' }
    ]
  },

  {
    id: 'slope-sign-mod',
    title: 'Delay-Based Slope Sign Modulator & Demodulator',
    tagline: 'Prototype SSM/SSD system using delay-based signal comparison across frequency and waveform conditions',
    category: 'Communication Systems',
    tags: ['Modulation', 'Analog', 'Signal Processing', 'Prototype'],
    thumb: 'assets/projects/slope-sign-mod/thumb.jpg',
    hero:  'assets/projects/slope-sign-mod/hero.jpg',
    metrics: [
      { label: 'Method',     value: 'Delay-Based Comparison' },
      { label: 'Validation', value: 'Multi-Frequency'        }
    ],
    overview: 'A hardware prototype implementing slope sign modulation (SSM) and demodulation using a delay-based signal comparison approach. The modulator encodes binary data based on signal slope polarity; the demodulator reconstructs the signal by comparing delayed versions to determine slope sign.',
    objectives: [
      'Implement slope sign detection using analog delay circuit',
      'Encode and decode binary data using slope polarity',
      'Evaluate behavior across varying input frequencies and waveform shapes'
    ],
    stack: [
      { category: 'Modulator',   items: ['Delay Network', 'Comparator Stage', 'Logic Encoder'] },
      { category: 'Demodulator', items: ['Delay Network', 'Slope Sign Detector', 'Signal Reconstructor'] }
    ],
    architecture: 'The modulator delays the input signal by a fixed time constant and compares it to the original — the sign of the difference encodes the slope. The demodulator reverses this by applying the same delay and comparison to recover the original slope sign sequence, reconstructing the baseband signal.',
    challenges: [
      'Choosing delay constant that works across target frequency range',
      'Handling ambiguity near zero crossings',
      'Maintaining consistent behavior across triangle, sine, and square waveform inputs'
    ],
    results: 'System demonstrated correct SSM encoding and decoding across multiple waveform types and frequency conditions. Performance documented under varying operating points.',
    future: [
      'Implement digitally for precise delay control',
      'Evaluate BER performance under additive noise'
    ],
    images: [
      { src: 'assets/projects/slope-sign-mod/setup.jpg',    caption: 'Hardware prototype — modulator and demodulator stages' },
      { src: 'assets/projects/slope-sign-mod/waveform.jpg', caption: 'Slope sign encoded and recovered signal waveforms' }
    ]
  },

  {
    id: 'rtos-multicore',
    title: 'RTOS-Based Multi-Core Embedded System',
    tagline: 'Dual-core task scheduling with semaphore synchronization and MQTT-bridged Python integration',
    category: 'Embedded Systems',
    tags: ['ESP32', 'FreeRTOS', 'MQTT', 'Python', 'Multi-Core', 'Real-Time'],
    thumb: 'assets/projects/rtos-multicore/thumb.jpg',
    hero:  'assets/projects/rtos-multicore/hero.jpg',
    metrics: [
      { label: 'Task Switch Latency', value: '<1 ms'     },
      { label: 'MQTT Comm Delay',     value: '~10 ms'    },
      { label: 'Cores',               value: 'Dual (ESP32)' },
      { label: 'Sync Mechanism',      value: 'Semaphore' }
    ],
    overview: 'A dual-core RTOS application on ESP32 implementing concurrent task execution with semaphore-based synchronization across cores. The system integrates an MQTT communication bridge to a Python host for real-time data exchange and monitoring.',
    objectives: [
      'Implement multi-core RTOS task scheduling on ESP32',
      'Use semaphores for cross-core resource synchronization',
      'Establish MQTT link between ESP32 and Python for real-time messaging',
      'Achieve <1 ms task switching latency with stable concurrent execution'
    ],
    stack: [
      { category: 'Hardware',       items: ['ESP32 (Dual-Core Xtensa LX6)'] },
      { category: 'RTOS',           items: ['FreeRTOS', 'Semaphores', 'Task Pinning (Core 0 / Core 1)'] },
      { category: 'Communication',  items: ['MQTT over Wi-Fi', 'Python MQTT Client'] }
    ],
    architecture: 'Tasks are pinned to specific cores — real-time control tasks on Core 1, communication tasks on Core 0. Shared resources are protected by binary semaphores. An MQTT broker bridges the ESP32 to a Python process for telemetry and command exchange at ~10 ms latency.',
    challenges: [
      'Preventing priority inversion in semaphore-protected shared data',
      'Balancing task load across cores without starving lower-priority tasks',
      'Ensuring MQTT reconnection logic doesn\'t block real-time tasks'
    ],
    results: 'Achieved <1 ms task switching latency with stable dual-core operation. MQTT link functional with ~10 ms round-trip delay. System ran continuously without deadlock or resource contention under test.',
    future: [
      'Add watchdog supervisor task for fault recovery',
      'Extend MQTT interface to cloud dashboard',
      'Add inter-task message queues for higher-throughput data sharing'
    ],
    images: [
      { src: 'assets/projects/rtos-multicore/arch.jpg',    caption: 'Task allocation and synchronization architecture diagram' },
      { src: 'assets/projects/rtos-multicore/monitor.jpg', caption: 'Python MQTT monitor receiving ESP32 telemetry' }
    ]
  },

  {
    id: 'shoreline-analysis',
    title: 'Automated Shoreline Analysis System',
    tagline: 'Python-based geospatial tool for automated shoreline change detection and statistical reporting',
    category: 'Data & Analysis',
    tags: ['Python', 'Geospatial', 'Automation', 'Remote Sensing', 'Data Analysis'],
    thumb: 'assets/projects/shoreline-analysis/thumb.jpg',
    hero:  'assets/projects/shoreline-analysis/hero.jpg',
    metrics: [
      { label: 'Execution', value: 'Fully Automated'   },
      { label: 'Output',    value: 'Reports + Stats'   },
      { label: 'Input',     value: 'Geospatial Data'   }
    ],
    overview: 'A Python automation tool for shoreline change analysis using geospatial datasets. The system processes input geographic data, computes shoreline change metrics, generates intermediate analysis outputs, and produces formatted statistical reports — all without manual intervention.',
    objectives: [
      'Automate end-to-end shoreline change detection from raw geospatial input',
      'Generate statistical summaries of shoreline displacement over time',
      'Produce structured reports and intermediate outputs for review'
    ],
    stack: [
      { category: 'Language',  items: ['Python'] },
      { category: 'Libraries', items: ['GeoPandas', 'Shapely', 'NumPy', 'Matplotlib'] },
      { category: 'Output',    items: ['PDF/CSV Reports', 'GeoJSON Outputs', 'Statistical Charts'] }
    ],
    architecture: 'The pipeline ingests multi-temporal geospatial datasets, extracts shoreline vectors, computes positional change metrics (erosion/accretion), applies statistical analysis across the dataset, and outputs formatted reports with visualizations.',
    challenges: [
      'Handling variable data quality and coordinate system inconsistencies across datasets',
      'Automated classification of erosion vs accretion zones',
      'Generating readable reports from raw computational outputs'
    ],
    results: 'System successfully automated the full analysis workflow, producing repeatable, documented outputs from raw geospatial inputs without manual steps.',
    future: [
      'Integrate with satellite imagery APIs for live data ingestion',
      'Add time-series animation of shoreline change',
      'Deploy as a CLI tool with configurable parameters'
    ],
    images: [
      { src: 'assets/projects/shoreline-analysis/map.jpg',   caption: 'Shoreline change map output — erosion and accretion zones' },
      { src: 'assets/projects/shoreline-analysis/chart.jpg', caption: 'Statistical summary chart from automated report' }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = WORK_DATA;
}
