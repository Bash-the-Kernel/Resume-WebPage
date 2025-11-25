// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Algorithm Visualization Classes
class Graph {
    constructor(canvas, nodes, edges) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = nodes;
        this.edges = edges;
        this.nodeRadius = 20;
        this.visited = new Set();
        this.current = null;
        this.queue = [];
        this.stack = [];
        this.isRunning = false;
    }

    drawNode(node, color = '#e5e7eb', textColor = '#374151') {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, this.nodeRadius, 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = '#9ca3af';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        this.ctx.fillStyle = textColor;
        this.ctx.font = '14px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(node.id, node.x, node.y);
    }

    drawEdge(from, to, color = '#9ca3af') {
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.visited.clear();
        this.current = null;
        this.queue = [];
        this.stack = [];
        this.isRunning = false;
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw edges
        this.edges.forEach(edge => {
            const from = this.nodes.find(n => n.id === edge.from);
            const to = this.nodes.find(n => n.id === edge.to);
            this.drawEdge(from, to);
        });

        // Draw nodes
        this.nodes.forEach(node => {
            let color = '#e5e7eb';
            let textColor = '#374151';
            
            if (this.visited.has(node.id)) {
                color = '#10b981';
                textColor = '#fff';
            }
            if (this.current === node.id) {
                color = '#f59e0b';
                textColor = '#fff';
            }
            
            this.drawNode(node, color, textColor);
        });
    }

    getNeighbors(nodeId) {
        return this.edges
            .filter(edge => edge.from === nodeId)
            .map(edge => edge.to);
    }

    async dfs(startId) {
        if (this.isRunning) return;
        this.isRunning = true;
        this.clear();
        
        this.stack = [startId];
        
        while (this.stack.length > 0) {
            const currentId = this.stack.pop();
            
            if (!this.visited.has(currentId)) {
                this.current = currentId;
                this.visited.add(currentId);
                this.draw();
                
                await this.sleep(800);
                
                const neighbors = this.getNeighbors(currentId);
                for (let i = neighbors.length - 1; i >= 0; i--) {
                    if (!this.visited.has(neighbors[i])) {
                        this.stack.push(neighbors[i]);
                    }
                }
            }
        }
        
        this.current = null;
        this.draw();
        this.isRunning = false;
    }

    async bfs(startId) {
        if (this.isRunning) return;
        this.isRunning = true;
        this.clear();
        
        this.queue = [startId];
        
        while (this.queue.length > 0) {
            const currentId = this.queue.shift();
            
            if (!this.visited.has(currentId)) {
                this.current = currentId;
                this.visited.add(currentId);
                this.draw();
                
                await this.sleep(800);
                
                const neighbors = this.getNeighbors(currentId);
                neighbors.forEach(neighbor => {
                    if (!this.visited.has(neighbor) && !this.queue.includes(neighbor)) {
                        this.queue.push(neighbor);
                    }
                });
            }
        }
        
        this.current = null;
        this.draw();
        this.isRunning = false;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualizations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Sample graph data
    const nodes = [
        { id: 'A', x: 100, y: 80 },
        { id: 'B', x: 200, y: 50 },
        { id: 'C', x: 300, y: 80 },
        { id: 'D', x: 150, y: 150 },
        { id: 'E', x: 250, y: 150 },
        { id: 'F', x: 200, y: 220 }
    ];

    const edges = [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'D' },
        { from: 'B', to: 'C' },
        { from: 'B', to: 'E' },
        { from: 'D', to: 'E' },
        { from: 'E', to: 'F' },
        { from: 'C', to: 'F' }
    ];

    // Initialize DFS visualization
    const dfsCanvas = document.getElementById('dfsCanvas');
    const dfsGraph = new Graph(dfsCanvas, nodes, edges);
    dfsGraph.draw();

    const dfsBtn = document.getElementById('dfsBtn');
    dfsBtn.addEventListener('click', () => {
        if (!dfsGraph.isRunning) {
            dfsBtn.disabled = true;
            dfsBtn.textContent = 'Running...';
            dfsGraph.dfs('A').then(() => {
                dfsBtn.disabled = false;
                dfsBtn.textContent = 'Start DFS';
            });
        }
    });

    // Initialize BFS visualization
    const bfsCanvas = document.getElementById('bfsCanvas');
    const bfsGraph = new Graph(bfsCanvas, nodes, edges);
    bfsGraph.draw();

    const bfsBtn = document.getElementById('bfsBtn');
    bfsBtn.addEventListener('click', () => {
        if (!bfsGraph.isRunning) {
            bfsBtn.disabled = true;
            bfsBtn.textContent = 'Running...';
            bfsGraph.bfs('A').then(() => {
                bfsBtn.disabled = false;
                bfsBtn.textContent = 'Start BFS';
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.project-card, .skill-category, .timeline-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});