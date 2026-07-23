/**
 * work-data.js — Reconstructed full portfolio projects list
 */

const WORK_DATA = [
  {
    "id": "fir-filter",
    "title": "Adaptive Signal-Driven FIR Filter System",
    "overview": "The Adaptive Signal-Driven FIR Filter System is a real-time digital signal processing platform developed to perform continuous signal acquisition, adaptive filtering, and output reconstruction on resource-constrained embedded hardware.",
    "tagline": "The Adaptive Signal-Driven FIR Filter System is a real-time digital signal processing platform developed to perform continuous signal acquisition, adaptive filtering, and output re",
    "category": "Digital Signal Processing",
    "hero": "assets/projects/fir-filter/hero.jpg",
    "thumb": "assets/projects/fir-filter/thumb.jpg",
    "results": "",
    "architecture": "``` Input Signal â†“ Analog Signal Acquisition â†“ ADC Sampling (Interrupt-Driven, 40 kHz) â†“ Circular Buffer â†“ Frequency Analysis â†“ Adaptive Filter Configuration â†“ FIR Filtering â†“ Output Reconstruction â†“ Serial Monitoring (1 Mbps) ```",
    "sourceFile": "knowledge-base/project-adaptive-filter.md",
    "url": "",
    "status": "Completed",
    "tags": [
      "Digital Signal Processing",
      "Embedded Systems",
      "Real-Time Systems",
      "Signal Acquisition",
      "Embedded Firmware",
      "Instrumentation"
    ],
    "objectives": [
      "Design a real-time signal acquisition system.",
      "Implement interrupt-driven Analog-to-Digital Conversion.",
      "Achieve high sampling frequency on an Arduino Uno.",
      "Develop an adaptive FIR filtering system.",
      "Automatically estimate the dominant input frequency.",
      "Dynamically configure filter parameters.",
      "Maintain continuous non-blocking signal processing.",
      "Optimize processor utilization and minimize processing latency.",
      "Reconstruct filtered analog output in real time."
    ],
    "challenges": [
      "High-speed ADC sampling and maintaining deterministic timing",
      "Interrupt synchronization and circular buffer management",
      "Processor limitations and memory constraints",
      "Real-time FIR execution and frequency estimation",
      "Latency optimization and output reconstruction"
    ],
    "future": [
      "FFT-based automatic frequency estimation",
      "Dynamic coefficient generation",
      "Higher-order adaptive filters and IIR filter support",
      "ARM Cortex-M or DSP processor implementation",
      "DMA-based sampling",
      "Graphical visualization software",
      "Multi-channel signal processing",
      "Hardware DAC output"
    ],
    "stack": [
      {
        "category": "Hardware",
        "items": [
          " Arduino Uno"
        ]
      },
      {
        "category": "Software",
        "items": [
          " Embedded C/C++",
          "Arduino IDE"
        ]
      },
      {
        "category": "Engineering Concepts",
        "items": [
          " Digital Signal Processing",
          "Finite Impulse Response Filters",
          "Adaptive Filtering",
          "Interrupt Programming",
          "Register-Level Programming",
          "Circular Buffers",
          "Analog-to-Digital Conversion",
          "Embedded Systems",
          "Real-Time Systems",
          "Signal Processing"
        ]
      }
    ],
    "metrics": [
      {
        "label": "Microcontroller",
        "value": "Arduino Uno"
      },
      {
        "label": "Signal Input",
        "value": "Analog signal source"
      },
      {
        "label": "Signal Output",
        "value": "PWM / DAC-equivalent output reconstruction"
      },
      {
        "label": "Communication",
        "value": "USB Serial Interface"
      },
      {
        "label": "Maximum Supported Order",
        "value": "10th Order"
      },
      {
        "label": "Typical Real-Time Operation",
        "value": "4th Order"
      },
      {
        "label": "Sampling Frequency",
        "value": "40 kHz"
      },
      {
        "label": "Serial Communication Speed",
        "value": "1 Mbps"
      },
      {
        "label": "Input Latency",
        "value": "~17 ms"
      },
      {
        "label": "Frequency Accuracy",
        "value": "±4 Hz"
      },
      {
        "label": "Processor Utilization",
        "value": "~18%"
      }
    ],
    "images": []
  },
  {
    "id": "aksharaksha",
    "title": "AkshaRaksha â€” Disaster-Resilient Satellite Communication Ecosystem",
    "overview": "AkshaRaksha is a disaster-resilient satellite communication ecosystem designed to restore communication during natural disasters and emergency situations when conventional terrestrial communication infrastructure becomes unavailable or severely degraded.",
    "tagline": "AkshaRaksha is a disaster-resilient satellite communication ecosystem designed to restore communication during natural disasters and emergency situations when conventional terrestr",
    "category": "Space Systems Engineering",
    "hero": "assets/projects/aksharaksha/hero.jpg",
    "thumb": "assets/projects/aksharaksha/thumb.jpg",
    "results": "",
    "architecture": "",
    "sourceFile": "knowledge-base/project-aksharaksha.md",
    "url": "",
    "status": "Ongoing",
    "tags": [
      "Space Systems Engineering",
      "Satellite Communications",
      "Embedded Systems",
      "Emergency Communication",
      "Distributed Systems",
      "IoT",
      "Ground Infrastructure",
      "Mobile Computing",
      "Cloud Computing"
    ],
    "objectives": [
      "Develop a disaster-resilient communication ecosystem.",
      "Design affordable emergency communication devices.",
      "Develop CubeSat-based communication architecture.",
      "Build emergency communication protocols.",
      "Create Android-based emergency applications.",
      "Design an Emergency Operations Center (EOC).",
      "Build mission planning infrastructure.",
      "Develop satellite digital twins.",
      "Implement reliable telemetry.",
      "Build scalable cloud infrastructure.",
      "Enable communication when terrestrial networks fail."
    ],
    "challenges": [
      "Affordable satellite communication and low-power embedded devices",
      "Reliable long-range communication and disaster-resilient networking",
      "Satellite communication latency and message reliability",
      "Emergency prioritization and ground infrastructure scalability",
      "Hardware miniaturization and regulatory compliance"
    ],
    "future": [],
    "stack": [
      {
        "category": "Hardware",
        "items": [
          " ESP32-C3",
          "LoRa Transceiver",
          "GPS Module",
          "Lithium Battery",
          "OLED Display",
          "Status Indicators"
        ]
      },
      {
        "category": "Software",
        "items": [
          " Embedded C/C++",
          "Android",
          "Kotlin",
          "Firebase",
          "Python",
          "Web Technologies",
          "ROS (future integration)"
        ]
      },
      {
        "category": "Engineering Concepts",
        "items": [
          " CubeSat Engineering",
          "Satellite Communication",
          "Embedded Systems",
          "Disaster Management",
          "Distributed Systems",
          "Digital Twin",
          "Telemetry",
          "Wireless Communication",
          "Cloud Computing",
          "Mission Planning"
        ]
      }
    ],
    "metrics": [
      {
        "label": "Device ID",
        "value": "Identifies the transmitting node"
      },
      {
        "label": "Timestamp",
        "value": "Time of message"
      },
      {
        "label": "GPS Coordinates",
        "value": "Victim location"
      },
      {
        "label": "Emergency Level",
        "value": "Priority classification"
      },
      {
        "label": "Message Type",
        "value": "SOS / status / acknowledgment"
      },
      {
        "label": "Device Health",
        "value": "Battery, signal strength"
      },
      {
        "label": "Authentication",
        "value": "Security credential"
      }
    ],
    "images": []
  },
  {
    "id": "optical-am",
    "title": "AM Optical Communication Link",
    "overview": "The AM Optical Communication Link is an analog optical communication system developed to demonstrate the transmission of information through light using Double Sideband Full Carrier (DSB-FC) Amplitude Modulation. The project investigates the complete communication chain: signal modulation â†’ optical transmission â†’ photodetection â†’ signal conditioning â†’ demodulation â†’ performance evaluation.",
    "tagline": "The AM Optical Communication Link is an analog optical communication system developed to demonstrate the transmission of information through light using Double Sideband Full Carrie",
    "category": "Communication Systems",
    "hero": "assets/projects/optical-am/hero.jpg",
    "thumb": "assets/projects/optical-am/thumb.jpg",
    "results": "",
    "architecture": "",
    "sourceFile": "knowledge-base/project-am-optical-comms.md",
    "url": "",
    "status": "Completed",
    "tags": [
      "Communication Systems",
      "Analog Communication",
      "Optical Wireless Communication",
      "Signal Processing",
      "Electronics"
    ],
    "objectives": [
      "Design an amplitude modulation transmitter.",
      "Develop an optical transmission system.",
      "Design an optical receiver.",
      "Recover transmitted information through demodulation.",
      "Study signal behaviour throughout the communication channel.",
      "Evaluate transmission quality under different operating conditions.",
      "Understand practical limitations of optical communication."
    ],
    "challenges": [
      "Optical alignment and ambient light interference",
      "Weak received signals requiring amplification",
      "Noise reduction and component sensitivity",
      "Bandwidth limitations and stable demodulation"
    ],
    "future": [
      "Digital optical communication and pulse modulation techniques",
      "Laser-based communication and automatic gain control",
      "Adaptive filtering and error detection techniques",
      "Higher bandwidth optical sources",
      "Long-range free-space optical communication",
      "Visible Light Communication (VLC)",
      "Optical communication using LEDs for data networking"
    ],
    "stack": [
      {
        "category": "Hardware",
        "items": [
          " Optical transmitter",
          "Optical receiver",
          "Analog electronic components",
          "Signal conditioning circuits"
        ]
      },
      {
        "category": "Engineering Concepts",
        "items": [
          " Analog Communication",
          "Amplitude Modulation",
          "Double Sideband Full Carrier (DSB-FC)",
          "Optical Wireless Communication",
          "Signal Conditioning",
          "Demodulation",
          "Analog Electronics",
          "Communication Systems"
        ]
      }
    ],
    "metrics": [],
    "images": []
  },
  {
    "id": "echo-lync",
    "title": "Echo Lync â€” Hybrid Crowd-Sourced Localization System",
    "overview": "Echo Lync is a hybrid localization system designed to estimate the location of users without relying entirely on GPS. The project combines RSSI-based ranging with a crowd-sourced positioning framework to provide scalable location estimation in environments where GPS is unavailable, unreliable, or inaccurate.",
    "tagline": "Echo Lync is a hybrid localization system designed to estimate the location of users without relying entirely on GPS. The project combines RSSI-based ranging with a crowd-sourced p",
    "category": "Wireless Communication",
    "hero": "assets/projects/echo-lync/hero.jpg",
    "thumb": "assets/projects/echo-lync/thumb.jpg",
    "results": "",
    "architecture": "",
    "sourceFile": "knowledge-base/project-echo-lync.md",
    "url": "",
    "status": "Completed",
    "tags": [
      "Wireless Communication",
      "Indoor Positioning",
      "Mobile Computing",
      "Distributed Systems",
      "Android Development",
      "Embedded Systems",
      "Location Intelligence"
    ],
    "objectives": [
      "Develop a GPS-independent localization system.",
      "Combine RSSI-based ranging with crowd-sourced observations.",
      "Design a scalable localization architecture.",
      "Build an Android application for end users.",
      "Implement real-time location estimation.",
      "Develop backend infrastructure for collaborative positioning.",
      "Improve localization accuracy through distributed sensing.",
      "Minimize deployment cost by using existing wireless devices.",
      "Support both indoor and outdoor navigation scenarios."
    ],
    "challenges": [
      "RSSI instability and multipath propagation",
      "Signal attenuation and environmental noise",
      "Dynamic environments and backend synchronization",
      "Device heterogeneity and battery optimization",
      "Network latency and position estimation uncertainty"
    ],
    "future": [
      "Bluetooth Low Energy integration",
      "Ultra-Wideband (UWB) support",
      "Machine learning-based localization",
      "Sensor fusion with IMU",
      "Adaptive environmental calibration",
      "Dynamic radio map generation",
      "Privacy-preserving collaborative localization",
      "Multi-floor positioning",
      "Edge-based localization processing",
      "Seamless indoor-outdoor transition"
    ],
    "stack": [
      {
        "category": "Hardware",
        "items": [
          " ESP8266",
          "Wi-Fi communication devices",
          "Android smartphones"
        ]
      },
      {
        "category": "Software",
        "items": [
          " Android (Java)",
          "Python",
          "Firebase / Backend Services",
          "Database Systems"
        ]
      },
      {
        "category": "Engineering Concepts",
        "items": [
          " Hybrid Localization",
          "RSSI-Based Ranging",
          "Crowd-Sourced Localization",
          "Wireless Communication",
          "Indoor Positioning Systems",
          "Distributed Systems",
          "Mobile Computing",
          "Real-Time Localization",
          "Backend Synchronization",
          "Location Intelligence"
        ]
      }
    ],
    "metrics": [],
    "images": []
  },
  {
    "id": "forix",
    "title": "Forix â€” Developer Productivity System",
    "overview": "Forix is a desktop productivity platform designed to improve software development workflows through intelligent project management, automated file monitoring, secure version management, and workspace analytics. The application combines project organization, automated backups, duplicate detection, encryption, and activity monitoring into a unified desktop environment.",
    "tagline": "Forix is a desktop productivity platform designed to improve software development workflows through intelligent project management, automated file monitoring, secure version manage",
    "category": "Desktop Application",
    "hero": "assets/projects/forix/hero.jpg",
    "thumb": "assets/projects/forix/thumb.jpg",
    "results": "",
    "architecture": "``` Project Workspace â†“ Real-Time File Monitoring â†“ Event Detection â†“ Version Management â†“ Duplicate Detection â†“ Encrypted Storage â†“ Database â†“ Analytics Dashboard â†“ User Interface ```",
    "sourceFile": "knowledge-base/project-forix.md",
    "url": "",
    "status": "Completed",
    "tags": [
      "Desktop Application",
      "File Management",
      "Productivity Software",
      "System Utilities",
      "Cybersecurity"
    ],
    "objectives": [
      "Develop a desktop application for project management.",
      "Monitor project folders in real time.",
      "Automatically detect file changes.",
      "Maintain historical project snapshots.",
      "Support project rollback and recovery.",
      "Detect duplicate files.",
      "Secure stored data through encryption.",
      "Visualize project activity.",
      "Improve developer productivity."
    ],
    "challenges": [
      "Efficient real-time file monitoring",
      "Managing large numbers of file events",
      "Preventing unnecessary snapshots",
      "Secure encryption implementation",
      "Database synchronization and storage optimization",
      "User interface responsiveness for large projects"
    ],
    "future": [
      "Git integration and cloud synchronization",
      "Multi-device project management and plugin architecture",
      "AI-assisted project insights and automatic documentation generation",
      "Team collaboration features and conflict resolution tools",
      "Advanced project analytics and cross-platform synchronization"
    ],
    "stack": [
      {
        "category": "Software",
        "items": [
          " Python",
          "PyQt",
          "SQLite",
          "SHA-256",
          "AES-256"
        ]
      },
      {
        "category": "Engineering Concepts",
        "items": [
          " Desktop Application Development",
          "Event-Driven Programming",
          "File System Monitoring",
          "Version Management",
          "Cryptography",
          "Database Systems",
          "Productivity Software",
          "Software Architecture"
        ]
      }
    ],
    "metrics": [],
    "images": []
  },
  {
    "id": "imita",
    "title": "Imita â€” Real-Time Facial Motion Capture & Character Animation System",
    "overview": "Imita is a real-time facial motion capture and expression transfer system designed to accurately track human facial movements and map them onto a digital 3D character. The project aims to provide a lightweight, accessible alternative to professional facial motion capture systems by utilizing standard webcams and computer vision algorithms instead of expensive motion capture hardware.",
    "tagline": "Imita is a real-time facial motion capture and expression transfer system designed to accurately track human facial movements and map them onto a digital 3D character. The project ",
    "category": "Computer Vision",
    "hero": "assets/projects/imita/hero.jpg",
    "thumb": "assets/projects/imita/thumb.jpg",
    "results": "",
    "architecture": "``` Webcam â†“ Frame Acquisition â†“ Face Detection â†“ Facial Landmark Detection â†“ Expression Analysis â†“ Head Pose Estimation â†“ Eye & Lip Tracking â†“ Animation Mapping â†“ 3D Character ```",
    "sourceFile": "knowledge-base/project-imita.md",
    "url": "",
    "status": "Ongoing",
    "tags": [
      "Computer Vision",
      "Artificial Intelligence",
      "Human-Computer Interaction",
      "Facial Motion Capture",
      "3D Animation"
    ],
    "objectives": [
      "Develop a real-time facial tracking system.",
      "Detect facial landmarks with high precision.",
      "Track complete facial expressions.",
      "Track eye movement and blinking.",
      "Capture lip movement for speech animation.",
      "Estimate head orientation.",
      "Map facial movements onto a 3D character.",
      "Maintain smooth real-time animation.",
      "Operate efficiently on low-end hardware.",
      "Build a modular animation pipeline."
    ],
    "challenges": [
      "Stable facial tracking and expression accuracy",
      "Lighting variation and occlusion handling",
      "Low-latency processing and motion jitter reduction",
      "Smooth animation mapping and hardware limitations",
      "Multi-expression blending and cross-platform compatibility"
    ],
    "future": [
      "Full-body motion capture integration and hand tracking integration",
      "Emotion-aware animation blending and multi-person tracking",
      "Mobile version and neural facial reconstruction",
      "Blendshape generation and VR integration",
      "Live streaming support",
      "Plugin support for Blender, Unity, and Unreal Engine"
    ],
    "stack": [
      {
        "category": "Software",
        "items": [
          " Python",
          "Computer Vision Libraries",
          "Machine Learning Models",
          "OpenGL / 3D Rendering"
        ]
      },
      {
        "category": "Engineering Concepts",
        "items": [
          " Computer Vision",
          "Facial Landmark Detection",
          "Motion Capture",
          "Facial Animation",
          "Expression Recognition",
          "Head Pose Estimation",
          "Human-Computer Interaction",
          "Real-Time Graphics",
          "Artificial Intelligence"
        ]
      }
    ],
    "metrics": [],
    "images": []
  },
  {
    "id": "neurella",
    "title": "Neurella â€” Multilingual AI Voice Assistant",
    "overview": "Neurella is a multilingual AI voice assistant designed to enable natural, conversational interaction between users and artificial intelligence through both voice and text. The project integrates speech recognition, natural language processing, text-to-speech synthesis, and configurable AI prompting into a unified assistant capable of adapting to multiple use cases without requiring modifications to the underlying application.",
    "tagline": "Neurella is a multilingual AI voice assistant designed to enable natural, conversational interaction between users and artificial intelligence through both voice and text. The proj",
    "category": "Artificial Intelligence",
    "hero": "assets/projects/neurella/hero.jpg",
    "thumb": "assets/projects/neurella/thumb.jpg",
    "results": "",
    "architecture": "``` User â†“ Voice or Text Input â†“ Speech Recognition â†“ Prompt Processing â†“ Large Language Model â†“ Response Generation â†“ Text-to-Speech â†“ Voice Output ```",
    "sourceFile": "knowledge-base/project-neurella.md",
    "url": "",
    "status": "Completed",
    "tags": [
      "Artificial Intelligence",
      "Natural Language Processing",
      "Voice Computing",
      "Desktop Applications",
      "Human-Computer Interaction"
    ],
    "objectives": [
      "Develop a multilingual AI voice assistant.",
      "Integrate speech-to-text functionality.",
      "Integrate text-to-speech synthesis.",
      "Enable both voice and text interaction.",
      "Support multiple languages.",
      "Develop a configurable prompt-driven architecture.",
      "Minimize application-specific hardcoding.",
      "Create a reusable conversational AI platform."
    ],
    "challenges": [
      "Speech recognition accuracy and handling background noise",
      "Managing conversation flow and maintaining low response latency",
      "Supporting multiple languages and prompt engineering",
      "Voice synthesis quality and integration of multiple AI services"
    ],
    "future": [
      "Long-term conversational memory and offline speech recognition",
      "Offline language models and vision-based interaction",
      "Emotion recognition and personal knowledge base integration",
      "Smart home integration and plugin architecture",
      "Workflow automation and multi-agent AI collaboration"
    ],
    "stack": [
      {
        "category": "Software",
        "items": [
          " Python",
          "Speech-to-Text Engine",
          "Text-to-Speech Engine",
          "Large Language Models",
          "Prompt Engineering"
        ]
      },
      {
        "category": "Engineering Concepts",
        "items": [
          " Artificial Intelligence",
          "Natural Language Processing",
          "Conversational AI",
          "Speech Recognition",
          "Speech Synthesis",
          "Human-Computer Interaction",
          "Multilingual Computing",
          "AI System Design"
        ]
      }
    ],
    "metrics": [],
    "images": []
  },
  {
    "id": "nimble",
    "title": "Nimble â€” Vision-Based Hand Tracking & Gesture Recognition System",
    "overview": "Nimble is a vision-based hand tracking and gesture recognition system designed to enable natural interaction between users and computers using only a standard webcam. The project replaces conventional input devices by allowing users to control the mouse cursor and execute commands through real-time hand movements and gestures.",
    "tagline": "Nimble is a vision-based hand tracking and gesture recognition system designed to enable natural interaction between users and computers using only a standard webcam. The project r",
    "category": "Computer Vision",
    "hero": "assets/projects/nimble/hero.jpg",
    "thumb": "assets/projects/nimble/thumb.jpg",
    "results": "",
    "architecture": "``` Webcam â†“ Frame Acquisition â†“ Hand Detection â†“ Hand Landmark Tracking â†“ Gesture Recognition â†“ Cursor Mapping â†“ Operating System Control â†“ User Interaction ```",
    "sourceFile": "knowledge-base/project-nimble.md",
    "url": "",
    "status": "Ongoing",
    "tags": [
      "Computer Vision",
      "Machine Learning",
      "Human-Computer Interaction",
      "Gesture Recognition",
      "Real-Time Systems"
    ],
    "objectives": [
      "Detect human hands in real time.",
      "Track hand landmarks continuously.",
      "Estimate finger positions.",
      "Track cursor movement.",
      "Recognize hand gestures.",
      "Execute operating system actions.",
      "Minimize interaction latency.",
      "Operate efficiently on low-end hardware.",
      "Build a modular gesture recognition pipeline."
    ],
    "challenges": [
      "Stable hand tracking under movement.",
      "Lighting variation and shadow effects.",
      "Background clutter interference.",
      "Finger occlusion.",
      "Cursor jitter from tracking noise.",
      "Gesture ambiguity between similar poses.",
      "Low-latency processing requirements.",
      "Screen coordinate calibration."
    ],
    "future": [
      "Multi-hand interaction support.",
      "3D hand tracking using depth-aware models.",
      "Adaptive gesture learning from user behavior.",
      "Custom gesture creation interface for users.",
      "VR and AR environment integration.",
      "Multi-monitor support with gesture-based display switching.",
      "AI-assisted gesture recognition for improved accuracy.",
      "Haptic feedback integration for supported devices."
    ],
    "stack": [],
    "metrics": [],
    "images": []
  },
  {
    "id": "oeur",
    "title": "OEUR â€” Wireless Occupancy Estimation via RSSI Signal Processing",
    "overview": "Wireless Occupancy Estimation via RSSI Signal Processing (OEUR) is a device-free occupancy sensing system that estimates the number of people present in an indoor environment by analyzing fluctuations in Wi-Fi Received Signal Strength Indicator (RSSI) measurements between two ESP8266 devices.",
    "tagline": "Wireless Occupancy Estimation via RSSI Signal Processing (OEUR) is a device-free occupancy sensing system that estimates the number of people present in an indoor environment by an",
    "category": "Research",
    "hero": "assets/projects/oeur/hero.jpg",
    "thumb": "assets/projects/oeur/thumb.jpg",
    "results": "",
    "architecture": "``` ESP8266 Transmitter â”‚ â”‚ Wi-Fi Signal â–¼ Indoor Environment (Humans influence propagation) â”‚ â–¼ ESP8266 Receiver â”‚ RSSI Sampling â†’ Serial Transmission â†’ Python Processing Pipeline â”‚ Filtering â†’ Feature Extraction â†’ Classification â†’ Occupancy Prediction ```",
    "sourceFile": "knowledge-base/project-oeur.md",
    "url": "",
    "status": "Research Completed (Expandable)",
    "tags": [
      "Research",
      "Signal Processing",
      "Wireless Sensing",
      "Machine Learning",
      "Communication Systems"
    ],
    "objectives": [
      "Develop a completely sensorless occupancy estimation system using commodity Wi-Fi hardware (ESP8266).",
      "Collect high-frequency RSSI measurements and design a robust statistical filtering pipeline.",
      "Extract meaningful signal features and classify occupancy states with high accuracy.",
      "Demonstrate feasibility without machine vision, minimize deployment cost, and preserve user privacy."
    ],
    "challenges": [],
    "future": [
      "Multi-room occupancy estimation",
      "Multi-channel RSSI fusion",
      "CSI (Channel State Information) integration",
      "Deep learning classifiers",
      "Transfer learning across environments",
      "Automatic calibration",
      "Edge processing on embedded devices",
      "Real-time cloud dashboard",
      "Multi-floor deployments"
    ],
    "stack": [],
    "metrics": [
      {
        "label": "Environment",
        "value": "Indoor room, static transmitter, static receiver"
      },
      {
        "label": "Sampling Frequency",
        "value": "50 Hz"
      },
      {
        "label": "Recording Duration",
        "value": "300 seconds"
      },
      {
        "label": "Samples per Recording",
        "value": "15,000"
      },
      {
        "label": "Conditions",
        "value": "Controlled occupancy levels, consistent placement"
      },
      {
        "label": "Classification Accuracy",
        "value": "**89.47%**"
      }
    ],
    "images": []
  },
  {
    "id": "pawsitive",
    "title": "Pawsitive â€” Intelligent Smart Dog Collar & Companion Ecosystem",
    "overview": "Pawsitive is an intelligent wearable ecosystem designed to improve the safety, health, and well-being of companion dogs through real-time sensing, behavioral monitoring, and seamless interaction with a companion mobile application. The project combines embedded hardware, wireless communication, sensor technology, mobile software, and cloud connectivity into a unified pet care platform.",
    "tagline": "Pawsitive is an intelligent wearable ecosystem designed to improve the safety, health, and well-being of companion dogs through real-time sensing, behavioral monitoring, and seamle",
    "category": "Internet of Things (IoT)",
    "hero": "assets/projects/pawsitive/hero.jpg",
    "thumb": "assets/projects/pawsitive/thumb.jpg",
    "results": "",
    "architecture": "``` Smart Collar â†“ Embedded Controller (ESP32) â†“ Sensor Acquisition (IMU + Microphone) â†“ Behavior Analysis â†“ Bluetooth Low Energy (BLE) Communication â†“ Mobile Application â†“ Cloud Services (Future) â†“ Owner Dashboard ```",
    "sourceFile": "knowledge-base/project-pawsitive.md",
    "url": "",
    "status": "Ongoing",
    "tags": [
      "Internet of Things (IoT)",
      "Embedded Systems",
      "Wearable Technology",
      "Mobile Applications",
      "Animal Health Monitoring"
    ],
    "objectives": [
      "Design a lightweight wearable smart collar.",
      "Develop modular embedded hardware.",
      "Monitor movement and activity in real time.",
      "Detect behavioral patterns from sensor data.",
      "Establish wireless communication with mobile devices via Bluetooth Low Energy.",
      "Build a companion mobile application.",
      "Improve pet safety and health monitoring.",
      "Support future expansion through modular hardware and software architecture."
    ],
    "challenges": [
      "Compact hardware design suitable for a wearable collar.",
      "Minimizing power consumption for extended battery life.",
      "Comfortable wearable construction for daily dog use.",
      "Reliable Bluetooth Low Energy communication.",
      "Sensor integration in a small form factor.",
      "Battery life optimization.",
      "Embedded firmware efficiency on constrained hardware.",
      "Mobile application synchronization and responsiveness."
    ],
    "future": [
      "GPS tracking module integration.",
      "Heart rate and pulse oximetry monitoring.",
      "Body temperature sensing.",
      "AI-based behavioral analysis and anomaly detection.",
      "Veterinary health reports and trend analysis.",
      "Cloud synchronization for long-term data storage.",
      "Over-the-air (OTA) firmware updates.",
      "Geofencing with owner alerts.",
      "Activity history analytics dashboard.",
      "Multi-pet management from a single application.",
      "Emergency alert system for unusual behavior.",
      "Machine learning-based anomaly detection."
    ],
    "stack": [],
    "metrics": [],
    "images": []
  },
  {
    "id": "robotic-arm",
    "title": "Industrial 6-DOF Robotic Arm",
    "overview": "The Industrial 6-DOF Robotic Arm is a heavy-duty robotic manipulation system developed to study industrial robotic mechanisms, multi-axis motion control, and embedded automation. The project focuses on designing a six-degree-of-freedom robotic arm capable of performing coordinated and repeatable movements while being controlled through a custom-developed software interface.",
    "tagline": "The Industrial 6-DOF Robotic Arm is a heavy-duty robotic manipulation system developed to study industrial robotic mechanisms, multi-axis motion control, and embedded automation. T",
    "category": "Robotics",
    "hero": "assets/projects/robotic-arm/hero.jpg",
    "thumb": "assets/projects/robotic-arm/thumb.jpg",
    "results": "",
    "architecture": "``` Python Control Software â†“ Serial Communication â†“ Arduino Motion Controller â†“ Servo Motor Driver â†“ Six Servo Motors â†“ Robotic Arm â†’ Multi-Axis Motion ```",
    "sourceFile": "knowledge-base/project-robotic-arm.md",
    "url": "",
    "status": "Completed",
    "tags": [
      "Robotics",
      "Mechatronics",
      "Embedded Systems",
      "Motion Control",
      "Industrial Automation"
    ],
    "objectives": [
      "Design a six-degree-of-freedom robotic manipulator.",
      "Develop a stable aluminium structural frame.",
      "Integrate high-torque servo motors for each joint.",
      "Build an Arduino-based motion controller.",
      "Develop a Python-based graphical control interface.",
      "Implement synchronized multi-axis motion.",
      "Support manual and automated robotic movements.",
      "Study motion coordination and industrial automation principles."
    ],
    "challenges": [
      "Mechanical stability and joint synchronization",
      "Servo calibration and motion smoothness",
      "Control latency and structural rigidity",
      "Load distribution and cable management",
      "Software synchronization and multi-axis coordination"
    ],
    "future": [
      "Forward kinematics implementation",
      "Inverse kinematics solver and trajectory planning",
      "Motion interpolation and computer vision integration",
      "End-effector tool attachments",
      "ROS2 integration",
      "Force and torque sensing",
      "Closed-loop position feedback",
      "Autonomous object manipulation",
      "Collision detection and digital twin simulation"
    ],
    "stack": [
      {
        "category": "Hardware",
        "items": [
          " Arduino",
          "Aluminium structural frame",
          "High-torque metal servo motors",
          "Mechanical linkages",
          "Power supply system"
        ]
      },
      {
        "category": "Software",
        "items": [
          " Python",
          "Arduino IDE",
          "Serial Communication"
        ]
      },
      {
        "category": "Engineering Concepts",
        "items": [
          " Industrial Robotics",
          "Six-Degree-of-Freedom Manipulation",
          "Motion Control",
          "Embedded Systems",
          "Mechatronics",
          "Servo Control",
          "Multi-Axis Synchronization",
          "Human-Machine Interface",
          "Industrial Automation"
        ]
      }
    ],
    "metrics": [],
    "images": []
  },
  {
    "id": "rtos-multicore",
    "title": "RTOS-Based Multi-Core Embedded System",
    "overview": "The RTOS-Based Multi-Core Embedded System is a real-time embedded platform developed to study multitasking, task scheduling, inter-task communication, and concurrent execution on a dual-core ESP32 microcontroller.",
    "tagline": "The RTOS-Based Multi-Core Embedded System is a real-time embedded platform developed to study multitasking, task scheduling, inter-task communication, and concurrent execution on a",
    "category": "Embedded Systems",
    "hero": "assets/projects/rtos-multicore/hero.jpg",
    "thumb": "assets/projects/rtos-multicore/thumb.jpg",
    "results": "",
    "architecture": "``` Python Monitoring Application â†“ MQTT Broker â†“ Wi-Fi Communication â†“ ESP32 (Dual-Core) â†“ FreeRTOS Scheduler â†“ Multiple Concurrent Tasks â†“ System Outputs ```",
    "sourceFile": "knowledge-base/project-rtos-multicore.md",
    "url": "",
    "status": "Completed",
    "tags": [
      "Embedded Systems",
      "Real-Time Systems",
      "Internet of Things (IoT)",
      "Concurrent Programming",
      "Distributed Systems"
    ],
    "objectives": [
      "Develop a multi-tasking embedded application.",
      "Utilize both processing cores of the ESP32.",
      "Implement task scheduling using FreeRTOS.",
      "Synchronize concurrent tasks using semaphores.",
      "Integrate MQTT communication.",
      "Establish communication between embedded hardware and Python applications.",
      "Evaluate task latency and communication performance.",
      "Study deterministic execution in real-time systems."
    ],
    "challenges": [
      "Task synchronization and resource sharing",
      "Race condition prevention and priority management",
      "Context switching and communication latency",
      "Network reliability and memory management",
      "Concurrent debugging and real-time scheduling"
    ],
    "future": [
      "Queue-based inter-task communication and event groups for synchronization",
      "Dynamic task creation and real-time performance profiling",
      "OTA firmware updates and secure MQTT communication",
      "Cloud integration and multi-device communication",
      "Hardware interrupt integration and fault-tolerant task recovery"
    ],
    "stack": [
      {
        "category": "Hardware",
        "items": [
          " ESP32 Dual-Core Microcontroller"
        ]
      },
      {
        "category": "Software",
        "items": [
          " FreeRTOS",
          "Embedded C/C++",
          "Python",
          "MQTT"
        ]
      },
      {
        "category": "Engineering Concepts",
        "items": [
          " Real-Time Operating Systems",
          "Multi-Core Processing",
          "Concurrent Programming",
          "Task Scheduling",
          "Context Switching",
          "Semaphores",
          "Synchronization",
          "MQTT Communication",
          "Distributed Systems",
          "Embedded Systems"
        ]
      }
    ],
    "metrics": [
      {
        "label": "Microcontroller",
        "value": "ESP32 Dual-Core Processor"
      },
      {
        "label": "Communication",
        "value": "Wi-Fi"
      },
      {
        "label": "Host System",
        "value": "Computer running Python monitoring application"
      },
      {
        "label": "Task Switching Latency",
        "value": "< 1 millisecond"
      },
      {
        "label": "Task Switching Latency",
        "value": "< 1 millisecond"
      },
      {
        "label": "Communication Latency",
        "value": "~10 milliseconds"
      }
    ],
    "images": []
  },
  {
    "id": "shoreline-analysis",
    "title": "Automated Shoreline Analysis System",
    "overview": "The Automated Shoreline Analysis System is a Python-based geospatial processing platform developed to automate the analysis of shoreline changes using satellite imagery and GIS datasets. The project eliminates repetitive manual workflows by integrating preprocessing, shoreline extraction, spatial analysis, statistical computation, and automated report generation into a single processing pipeline.",
    "tagline": "The Automated Shoreline Analysis System is a Python-based geospatial processing platform developed to automate the analysis of shoreline changes using satellite imagery and GIS dat",
    "category": "Geospatial Engineering",
    "hero": "assets/projects/shoreline-analysis/hero.jpg",
    "thumb": "assets/projects/shoreline-analysis/thumb.jpg",
    "results": "",
    "architecture": "``` Input Geospatial Data â†“ Data Validation â†“ Preprocessing â†“ Shoreline Extraction â†“ Spatial Analysis â†“ Statistical Computation â†“ Intermediate Outputs â†“ Automated Report Generation â†“ Final Results ```",
    "sourceFile": "knowledge-base/project-shoreline-analysis.md",
    "url": "",
    "status": "Completed",
    "tags": [
      "Geospatial Engineering",
      "Remote Sensing",
      "GIS",
      "Automation",
      "Python Development",
      "Environmental Monitoring"
    ],
    "objectives": [
      "Develop an automated shoreline analysis workflow.",
      "Process geospatial datasets with minimal manual intervention.",
      "Detect shoreline variations across multiple datasets.",
      "Generate statistical summaries automatically.",
      "Produce standardized reports.",
      "Create intermediate outputs for validation.",
      "Reduce processing time and improve repeatability of shoreline analysis."
    ],
    "challenges": [
      "Processing large geospatial datasets and managing coordinate reference systems",
      "Maintaining processing consistency and automating complex GIS workflows",
      "Organizing intermediate outputs and handling diverse input datasets",
      "Optimizing execution time and ensuring reproducible analysis"
    ],
    "future": [
      "Interactive graphical interface and web-based dashboard",
      "Cloud-based processing and parallel computation for large datasets",
      "Machine learning-based shoreline extraction",
      "Automatic satellite imagery acquisition",
      "Multi-temporal shoreline visualization and change prediction models",
      "Real-time environmental monitoring integration",
      "Support for additional geospatial data formats"
    ],
    "stack": [
      {
        "category": "Software",
        "items": [
          " Python",
          "Geographic Information Systems (GIS)",
          "Geospatial Processing Libraries",
          "Automated Reporting Tools"
        ]
      },
      {
        "category": "Engineering Concepts",
        "items": [
          " Remote Sensing",
          "Shoreline Analysis",
          "GIS Automation",
          "Spatial Analysis",
          "Geospatial Data Processing",
          "Environmental Monitoring",
          "Workflow Automation",
          "Statistical Analysis",
          "Batch Processing"
        ]
      }
    ],
    "metrics": [],
    "images": []
  },
  {
    "id": "slope-sign-mod",
    "title": "Delay-Based Slope Sign Modulator and Demodulator",
    "overview": "The Delay-Based Slope Sign Modulator and Demodulator is an analog communication system developed to explore an alternative method of signal modulation based on the slope characteristics of an input waveform rather than conventional amplitude, frequency, or phase modulation techniques.",
    "tagline": "The Delay-Based Slope Sign Modulator and Demodulator is an analog communication system developed to explore an alternative method of signal modulation based on the slope characteri",
    "category": "Communication Systems",
    "hero": "assets/projects/slope-sign-mod/hero.jpg",
    "thumb": "assets/projects/slope-sign-mod/thumb.jpg",
    "results": "",
    "architecture": "``` Input Signal â†“ Delay Network â†“ Comparator â†“ Slope Sign Generation (Binary) â†“ Transmission â†“ Slope Sign Detection â†“ Signal Reconstruction â†“ Recovered Output ```",
    "sourceFile": "knowledge-base/project-slope-modulator.md",
    "url": "",
    "status": "Completed",
    "tags": [
      "Communication Systems",
      "Analog Communication",
      "Signal Processing",
      "Electronic Systems"
    ],
    "objectives": [
      "Study slope-based modulation techniques.",
      "Design a delay-based modulator.",
      "Implement a corresponding demodulator.",
      "Compare delayed and original signals.",
      "Analyze waveform transitions.",
      "Reconstruct the transmitted signal.",
      "Evaluate system performance under different operating conditions.",
      "Understand the advantages and limitations of slope-based communication."
    ],
    "challenges": [
      "Selecting an appropriate delay",
      "Comparator threshold stability and timing synchronization",
      "Accurate waveform reconstruction and noise immunity",
      "High-frequency operation and maintaining signal integrity"
    ],
    "future": [
      "Digital implementation of slope modulation",
      "Adaptive delay selection and noise filtering techniques",
      "FPGA implementation and high-speed comparator circuits",
      "Error correction methods and automatic threshold adjustment",
      "DSP-based waveform reconstruction",
      "Performance comparison with Delta Modulation and Differential PCM"
    ],
    "stack": [
      {
        "category": "Hardware",
        "items": [
          " Analog comparator circuits",
          "Delay network",
          "Signal generator",
          "Analog electronic components"
        ]
      },
      {
        "category": "Engineering Concepts",
        "items": [
          " Analog Communication",
          "Signal Processing",
          "Comparator Circuits",
          "Delay Networks",
          "Waveform Analysis",
          "Signal Reconstruction",
          "Analog Electronics",
          "Communication Systems"
        ]
      }
    ],
    "metrics": [],
    "images": []
  },
  {
    "id": "stellar-crest",
    "title": "Stellar Crest â€” CubeSat ADCS Prototype",
    "overview": "Stellar Crest was a laboratory-scale CubeSat engineering prototype developed to study, design, implement, and validate the fundamental subsystems required in a modern small satellite. Rather than focusing solely on attitude stabilization, Stellar Crest aimed to simulate a complete satellite subsystem architecture â€” including attitude determination, attitude control, telemetry, command handling, ground station software, software-defined radio communication, and digital twin simulation.",
    "tagline": "Stellar Crest was a laboratory-scale CubeSat engineering prototype developed to study, design, implement, and validate the fundamental subsystems required in a modern small satelli",
    "category": "Embedded Systems",
    "hero": "assets/projects/stellar-crest/hero.jpg",
    "thumb": "assets/projects/stellar-crest/thumb.jpg",
    "results": "",
    "architecture": "",
    "sourceFile": "knowledge-base/project-stellar-crest.md",
    "url": "",
    "status": "Completed",
    "tags": [
      "Embedded Systems",
      "Aerospace Systems Engineering",
      "CubeSat Engineering",
      "ADCS",
      "Sensor Fusion",
      "Control Systems",
      "SDR",
      "Digital Twin"
    ],
    "objectives": [
      "Design a modular CubeSat architecture.",
      "Develop a three-axis attitude determination system.",
      "Build a three-axis reaction wheel stabilization platform.",
      "Implement real-time sensor fusion.",
      "Develop a cascaded PID-based attitude controller.",
      "Create a digital twin for visualization and controller validation.",
      "Design a telemetry and command architecture.",
      "Build a custom ground station.",
      "Explore software-defined radio communication.",
      "Validate subsystem interaction through real-time experiments."
    ],
    "challenges": [
      "IMU drift and sensor noise",
      "PID tuning and mechanical vibration",
      "Reaction wheel balancing and embedded timing constraints",
      "Communication latency and SDR synchronization",
      "Reliable telemetry and real-time visualization"
    ],
    "future": [],
    "stack": [
      {
        "category": "Hardware",
        "items": [
          " ESP32",
          "MPU6050",
          "Reaction wheel assemblies",
          "Motor drivers",
          "ADALM Pluto SDR"
        ]
      },
      {
        "category": "Software",
        "items": [
          " C",
          "C++",
          "Python",
          "GNU Radio",
          "Custom Ground Station Software",
          "Digital Twin Software"
        ]
      },
      {
        "category": "Engineering Concepts",
        "items": [
          " CubeSat Engineering",
          "ADCS",
          "Sensor Fusion",
          "Complementary Filter",
          "Cascaded PID Control",
          "Reaction Wheel Dynamics",
          "Software Defined Radio",
          "CPFSK Modulation",
          "Frequency Hopping",
          "Embedded Systems",
          "Real-Time Systems",
          "Telemetry Systems"
        ]
      }
    ],
    "metrics": [
      {
        "label": "Timestamp",
        "value": "System time"
      },
      {
        "label": "Roll / Pitch / Yaw",
        "value": "Orientation angles"
      },
      {
        "label": "Angular velocity",
        "value": "Per-axis rates"
      },
      {
        "label": "Reaction wheel speeds",
        "value": "Current RPM per wheel"
      },
      {
        "label": "Controller status",
        "value": "Active / inactive"
      },
      {
        "label": "Sensor status",
        "value": "Healthy / fault"
      },
      {
        "label": "Error flags",
        "value": "Active error codes"
      },
      {
        "label": "Hardware",
        "value": "ADALM Pluto SDR"
      },
      {
        "label": "Software",
        "value": "GNU Radio"
      },
      {
        "label": "Operating Frequency",
        "value": "862 – 868 MHz"
      },
      {
        "label": "Modulation",
        "value": "CPFSK (Continuous Phase Frequency Shift Keying)"
      },
      {
        "label": "Frequency Hopping",
        "value": "256-channel cryptographically secure pseudo-random hopping algorithm"
      }
    ],
    "images": []
  },
  {
    "id": "tack-n-go",
    "title": "Tack n Go â€” Real-Time Bus Tracking System",
    "overview": "Tack n Go is a real-time public transportation tracking platform developed to improve the visibility and accessibility of bus location information for passengers and transport operators. The system enables continuous GPS tracking of buses, real-time synchronization through a cloud backend, and live map visualization within an Android application.",
    "tagline": "Tack n Go is a real-time public transportation tracking platform developed to improve the visibility and accessibility of bus location information for passengers and transport oper",
    "category": "Android Development",
    "hero": "assets/projects/tack-n-go/hero.jpg",
    "thumb": "assets/projects/tack-n-go/thumb.jpg",
    "results": "",
    "architecture": "``` Driver Application â†“ GPS Location Acquisition â†“ Internet Connection â†“ Firebase Firestore â†“ Real-Time Synchronization â†“ Passenger Application â†“ Live Map Visualization ```",
    "sourceFile": "knowledge-base/project-tack-n-go.md",
    "url": "",
    "status": "Completed",
    "tags": [
      "Android Development",
      "Mobile Computing",
      "GPS Navigation",
      "Cloud Computing",
      "Internet of Things (IoT)",
      "Real-Time Systems"
    ],
    "objectives": [
      "Develop a real-time vehicle tracking platform.",
      "Build an Android application for drivers.",
      "Continuously transmit GPS location.",
      "Synchronize location data through a cloud backend.",
      "Display live vehicle locations on maps.",
      "Support multiple buses simultaneously.",
      "Design a simple workflow for transport operators.",
      "Minimize location update latency."
    ],
    "challenges": [
      "Continuous GPS acquisition and battery optimization",
      "Network interruptions and real-time synchronization",
      "Managing multiple vehicles simultaneously",
      "Cloud database design and map update performance",
      "User-friendly interface design"
    ],
    "future": [
      "Estimated Time of Arrival (ETA) prediction",
      "Traffic-aware route optimization and passenger notifications",
      "Offline caching and driver analytics dashboard",
      "Fleet management portal and route history visualization",
      "Geofencing and emergency alerts",
      "AI-based arrival prediction"
    ],
    "stack": [
      {
        "category": "Hardware",
        "items": [
          " Android Smartphones"
        ]
      },
      {
        "category": "Software",
        "items": [
          " Android (Java)",
          "Firebase Firestore",
          "Google Maps SDK"
        ]
      },
      {
        "category": "Engineering Concepts",
        "items": [
          " Mobile Application Development",
          "GPS Positioning",
          "Real-Time Systems",
          "Cloud Computing",
          "Database Synchronization",
          "Internet of Things (IoT)",
          "Location-Based Services",
          "Fleet Tracking"
        ]
      }
    ],
    "metrics": [
      {
        "label": "Location Update Frequency",
        "value": "Continuous (real-time)"
      },
      {
        "label": "Synchronization",
        "value": "Firebase Firestore real-time listeners"
      },
      {
        "label": "Multi-Vehicle Support",
        "value": "Yes — independent data streams"
      }
    ],
    "images": []
  },
  {
    "id": "tws",
    "title": "Together We Solve (TWS) â€” Global Social Impact & Community Collaboration Platform",
    "overview": "Together We Solve (TWS) is a community-driven digital platform designed to encourage, recognize, and scale positive social impact through technology. The platform enables individuals, organizations, and communities to collaborate on meaningful initiatives, complete verified tasks, contribute to social causes, and build a measurable record of real-world impact.",
    "tagline": "Together We Solve (TWS) is a community-driven digital platform designed to encourage, recognize, and scale positive social impact through technology. The platform enables individua",
    "category": "Full-Stack Development",
    "hero": "assets/projects/tws/hero.jpg",
    "thumb": "assets/projects/tws/thumb.jpg",
    "results": "",
    "architecture": "",
    "sourceFile": "knowledge-base/project-tws.md",
    "url": "",
    "status": "Ongoing",
    "tags": [
      "Full-Stack Development",
      "Social Technology",
      "Community Platforms",
      "Gamification",
      "Cloud Computing",
      "Human-Centered Design"
    ],
    "objectives": [
      "Build a global community collaboration platform.",
      "Encourage real-world social impact.",
      "Create a transparent verification system.",
      "Reward meaningful community contributions.",
      "Develop a gamified progression system.",
      "Foster long-term user engagement.",
      "Build trust through evidence-based verification.",
      "Create a scalable platform for individuals and organizations."
    ],
    "challenges": [
      "Preventing fraudulent submissions and building a fair verification process",
      "Maintaining long-term engagement and scaling community moderation",
      "Balancing gamification with meaningful impact",
      "Managing large user communities and designing a trustworthy reputation system"
    ],
    "future": [
      "AI-assisted proof verification",
      "Organization accounts and community events",
      "Local community discovery and real-world reward partnerships",
      "Mobile application and public impact analytics",
      "AI-powered task recommendations and volunteer opportunity matching",
      "Global multilingual support"
    ],
    "stack": [
      {
        "category": "Software",
        "items": [
          " Full-Stack Web Development",
          "Cloud Database",
          "Authentication Systems",
          "Real-Time Backend",
          "Responsive Web Technologies"
        ]
      },
      {
        "category": "Engineering Concepts",
        "items": [
          " Social Platform Design",
          "Gamification",
          "Reputation Systems",
          "Community Management",
          "Workflow Verification",
          "Human-Centered Design",
          "Scalable Software Architecture"
        ]
      }
    ],
    "metrics": [],
    "images": []
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = WORK_DATA;
}
