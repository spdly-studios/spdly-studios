/**
 * Neural Network Visualization
 * 
 * Creates an interactive, living neural network background for the hero section.
 * Optimized for 60 FPS with performance-conscious rendering.
 * 
 * Features:
 * - Dynamic node system representing concepts
 * - Organic connection formation and dissolution
 * - Mouse interaction with gravitational effects
 * - Scroll-triggered parallax zoom
 * - Data pulse animations along connections
 * - Soft, premium aesthetic with glowing elements
 */

class NeuralNetwork {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d', { alpha: true });
    
    // Concepts represented as nodes
    this.concepts = [
      'Hardware',
      'Embedded Systems',
      'Satellites',
      'AI',
      'Product Design',
      'Wearables',
      'Robotics',
      'Startups',
      'Research',
      'Future Ideas'
    ];
    
    this.nodes = [];
    this.connections = [];
    this.pulses = [];
    this.mousePos = { x: 0, y: 0 };
    this.scrollProgress = 0;
    this.animationId = null;
    
    // Configuration
    this.config = {
      nodeCount: 10,
      connectionDistance: 280,
      nodeRadius: 3,
      nodeColor: { r: 139, g: 144, b: 160 },
      connectionColor: { r: 76, g: 175, b: 200 },
      pulseColor: { r: 229, g: 79, b: 77 },
      pullForce: 0.08,
      returnForce: 0.02,
      maxConnectionProbability: 0.35,
      nodeSpeed: 0.3
    };
    
    this.lastFrameTime = Date.now();
    this.deltaTime = 0;
    
    this.init();
    this.setupEventListeners();
    this.animate();
  }
  
  init() {
    this.resizeCanvas();
    this.createNodes();
    this.setupConnections();
  }
  
  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
    this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.canvasWidth = this.canvas.offsetWidth;
    this.canvasHeight = this.canvas.offsetHeight;
  }
  
  createNodes() {
    this.nodes = [];
    
    for (let i = 0; i < this.config.nodeCount; i++) {
      const angle = (i / this.config.nodeCount) * Math.PI * 2;
      const distance = 150 + Math.random() * 150;
      
      const node = {
        x: this.canvasWidth / 2 + Math.cos(angle) * distance,
        y: this.canvasHeight / 2 + Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        concept: this.concepts[i % this.concepts.length],
        pulseStage: 0,
        isPulsing: false,
        originalX: 0,
        originalY: 0
      };
      
      // Store original position for reference
      node.originalX = node.x;
      node.originalY = node.y;
      
      this.nodes.push(node);
    }
  }
  
  setupConnections() {
    this.connections = [];
    
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const distance = this.distance(this.nodes[i], this.nodes[j]);
        
        if (distance < this.config.connectionDistance) {
          if (Math.random() < this.config.maxConnectionProbability) {
            this.connections.push({
              from: i,
              to: j,
              strength: 0,
              targetStrength: 1,
              pulseActive: false,
              pulseProgress: 0
            });
          }
        }
      }
    }
  }
  
  setupEventListeners() {
    document.addEventListener('mousemove', (e) => {
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;
    });
    
    window.addEventListener('scroll', () => {
      const heroSection = document.getElementById('hero');
      if (!heroSection) return;
      
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      const progress = Math.max(0, Math.min(1, -heroBottom / window.innerHeight));
      this.scrollProgress = progress;
    });
    
    window.addEventListener('resize', () => this.resizeCanvas());
  }
  
  distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  update() {
    // Update deltaTime for frame-rate independent animation
    const now = Date.now();
    this.deltaTime = (now - this.lastFrameTime) / 16.67; // Normalize to 60fps
    this.lastFrameTime = now;
    
    // Clamp deltaTime to prevent large jumps
    if (this.deltaTime > 3) this.deltaTime = 3;
    
    // Update nodes
    this.nodes.forEach((node, index) => {
      // Apply mouse attraction
      const mouseNode = {
        x: this.mousePos.x,
        y: this.mousePos.y
      };
      
      const mouseDist = this.distance(node, mouseNode);
      const attractionRadius = 300;
      
      if (mouseDist < attractionRadius) {
        const pull = this.config.pullForce * (1 - mouseDist / attractionRadius);
        const angle = Math.atan2(mouseNode.y - node.y, mouseNode.x - node.x);
        node.vx += Math.cos(angle) * pull * this.deltaTime;
        node.vy += Math.sin(angle) * pull * this.deltaTime;
      }
      
      // Apply return-to-center force (reduced by scroll)
      const returnScale = 1 - this.scrollProgress * 0.3;
      const centerPullX = (node.originalX - node.x) * this.config.returnForce * returnScale;
      const centerPullY = (node.originalY - node.y) * this.config.returnForce * returnScale;
      
      node.vx += centerPullX * this.deltaTime;
      node.vy += centerPullY * this.deltaTime;
      
      // Apply damping
      node.vx *= 0.95;
      node.vy *= 0.95;
      
      // Update position
      node.x += node.vx;
      node.y += node.vy;
      
      // Boundary containment (soft)
      const padding = 50;
      if (node.x < padding) node.x = padding;
      if (node.x > this.canvasWidth - padding) node.x = this.canvasWidth - padding;
      if (node.y < padding) node.y = padding;
      if (node.y > this.canvasHeight - padding) node.y = this.canvasHeight - padding;
    });
    
    // Update connections
    this.connections.forEach((conn) => {
      const fromNode = this.nodes[conn.from];
      const toNode = this.nodes[conn.to];
      const dist = this.distance(fromNode, toNode);
      
      // Dynamic connection strength based on distance
      if (dist < this.config.connectionDistance) {
        conn.targetStrength = Math.max(0.1, 1 - dist / this.config.connectionDistance);
      } else {
        conn.targetStrength = 0;
      }
      
      // Smoothly interpolate strength
      conn.strength += (conn.targetStrength - conn.strength) * 0.1 * this.deltaTime;
      
      // Occasional pulses
      if (Math.random() < 0.002 && conn.strength > 0.5) {
        conn.pulseActive = true;
        conn.pulseProgress = 0;
      }
      
      if (conn.pulseActive) {
        conn.pulseProgress += 0.04 * this.deltaTime;
        if (conn.pulseProgress > 1) {
          conn.pulseActive = false;
        }
      }
    });
    
    // Apply scroll zoom effect
    if (this.scrollProgress > 0) {
      this.nodes.forEach((node) => {
        const centerX = this.canvasWidth / 2;
        const centerY = this.canvasHeight / 2;
        
        const scale = 1 + this.scrollProgress * 0.3;
        node.x = centerX + (node.x - centerX) * scale;
        node.y = centerY + (node.y - centerY) * scale;
      });
    }
  }
  
  render() {
    // Clear canvas
    this.ctx.fillStyle = 'rgba(9, 9, 11, 0.02)';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Draw connections first (behind nodes)
    this.connections.forEach((conn) => {
      if (conn.strength > 0.01) {
        const fromNode = this.nodes[conn.from];
        const toNode = this.nodes[conn.to];
        
        // Base connection line
        const opacity = conn.strength * 0.3;
        this.ctx.strokeStyle = `rgba(76, 175, 200, ${opacity})`;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(fromNode.x, fromNode.y);
        this.ctx.lineTo(toNode.x, toNode.y);
        this.ctx.stroke();
        
        // Glowing line
        const glowOpacity = conn.strength * 0.15;
        this.ctx.strokeStyle = `rgba(76, 175, 200, ${glowOpacity})`;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(fromNode.x, fromNode.y);
        this.ctx.lineTo(toNode.x, toNode.y);
        this.ctx.stroke();
        
        // Draw pulse if active
        if (conn.pulseActive) {
          const pulseX = fromNode.x + (toNode.x - fromNode.x) * conn.pulseProgress;
          const pulseY = fromNode.y + (toNode.y - fromNode.y) * conn.pulseProgress;
          const pulseSize = 3 * (1 - conn.pulseProgress);
          
          this.ctx.fillStyle = `rgba(229, 79, 77, ${0.8 * (1 - conn.pulseProgress)})`;
          this.ctx.beginPath();
          this.ctx.arc(pulseX, pulseY, pulseSize, 0, Math.PI * 2);
          this.ctx.fill();
          
          // Glow
          this.ctx.strokeStyle = `rgba(229, 79, 77, ${0.4 * (1 - conn.pulseProgress)})`;
          this.ctx.lineWidth = 2;
          this.ctx.beginPath();
          this.ctx.arc(pulseX, pulseY, pulseSize * 2, 0, Math.PI * 2);
          this.ctx.stroke();
        }
      }
    });
    
    // Draw nodes
    this.nodes.forEach((node) => {
      const dist = this.distance(node, this.mousePos);
      const isNearMouse = dist < 300;
      
      // Base node
      const opacity = isNearMouse ? 0.8 : 0.5;
      this.ctx.fillStyle = `rgba(139, 144, 160, ${opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, this.config.nodeRadius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Glow
      if (isNearMouse) {
        const glowSize = 8;
        const gradient = this.ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowSize
        );
        gradient.addColorStop(0, 'rgba(76, 175, 200, 0.4)');
        gradient.addColorStop(1, 'rgba(76, 175, 200, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(node.x - glowSize, node.y - glowSize, glowSize * 2, glowSize * 2);
      }
    });
  }
  
  animate() {
    this.update();
    this.render();
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('neural-network-canvas');
  if (canvas) {
    window.neuralNetwork = new NeuralNetwork(canvas);
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.neuralNetwork) {
    window.neuralNetwork.destroy();
  }
});
