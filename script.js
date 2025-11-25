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
        this.nodeRadius = 15;
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
        this.ctx.font = '12px Inter';
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
        
        this.edges.forEach(edge => {
            const from = this.nodes.find(n => n.id === edge.from);
            const to = this.nodes.find(n => n.id === edge.to);
            this.drawEdge(from, to);
        });

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
                
                await this.sleep(600);
                
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
                
                await this.sleep(600);
                
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

class BinarySearch {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.array = [2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78];
        this.target = 23;
        this.left = 0;
        this.right = this.array.length - 1;
        this.mid = -1;
        this.isRunning = false;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const boxWidth = 30;
        const boxHeight = 30;
        const startX = 10;
        const startY = 100;
        
        this.array.forEach((val, i) => {
            let color = '#e5e7eb';
            if (i >= this.left && i <= this.right) color = '#ddd6fe';
            if (i === this.mid) color = '#f59e0b';
            if (val === this.target && i === this.mid) color = '#10b981';
            
            this.ctx.fillStyle = color;
            this.ctx.fillRect(startX + i * boxWidth, startY, boxWidth, boxHeight);
            this.ctx.strokeStyle = '#9ca3af';
            this.ctx.strokeRect(startX + i * boxWidth, startY, boxWidth, boxHeight);
            
            this.ctx.fillStyle = '#374151';
            this.ctx.font = '12px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(val, startX + i * boxWidth + boxWidth/2, startY + boxHeight/2 + 4);
        });
        
        this.ctx.fillStyle = '#374151';
        this.ctx.font = '14px Inter';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Target: ${this.target}`, 10, 30);
        this.ctx.fillText(`Left: ${this.left}, Right: ${this.right}, Mid: ${this.mid}`, 10, 50);
    }

    async search() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.left = 0;
        this.right = this.array.length - 1;
        this.mid = -1;
        
        while (this.left <= this.right) {
            this.mid = Math.floor((this.left + this.right) / 2);
            this.draw();
            await this.sleep(800);
            
            if (this.array[this.mid] === this.target) {
                this.draw();
                break;
            } else if (this.array[this.mid] < this.target) {
                this.left = this.mid + 1;
            } else {
                this.right = this.mid - 1;
            }
        }
        
        this.isRunning = false;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class SortingVisualizer {
    constructor(canvas, algorithm) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.algorithm = algorithm;
        this.array = [64, 34, 25, 12, 22, 11, 90, 88, 76, 50, 42];
        this.comparing = [];
        this.sorted = [];
        this.isRunning = false;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const barWidth = 25;
        const maxHeight = 150;
        const maxVal = Math.max(...this.array);
        
        this.array.forEach((val, i) => {
            const height = (val / maxVal) * maxHeight;
            let color = '#e5e7eb';
            if (this.comparing.includes(i)) color = '#f59e0b';
            if (this.sorted.includes(i)) color = '#10b981';
            
            this.ctx.fillStyle = color;
            this.ctx.fillRect(i * barWidth + 10, 200 - height, barWidth - 2, height);
            
            this.ctx.fillStyle = '#374151';
            this.ctx.font = '10px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(val, i * barWidth + 10 + barWidth/2, 220);
        });
    }

    async mergeSort(arr = this.array, start = 0) {
        if (arr.length <= 1) return arr;
        
        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);
        
        const sortedLeft = await this.mergeSort(left, start);
        const sortedRight = await this.mergeSort(right, start + mid);
        
        return await this.merge(sortedLeft, sortedRight, start);
    }

    async merge(left, right, start) {
        const result = [];
        let i = 0, j = 0;
        
        while (i < left.length && j < right.length) {
            this.comparing = [start + i, start + left.length + j];
            this.draw();
            await this.sleep(400);
            
            if (left[i] <= right[j]) {
                result.push(left[i]);
                i++;
            } else {
                result.push(right[j]);
                j++;
            }
        }
        
        result.push(...left.slice(i), ...right.slice(j));
        
        for (let k = 0; k < result.length; k++) {
            this.array[start + k] = result[k];
            this.sorted.push(start + k);
        }
        
        this.comparing = [];
        this.draw();
        return result;
    }

    async quickSort(arr = this.array, low = 0, high = this.array.length - 1) {
        if (low < high) {
            const pi = await this.partition(arr, low, high);
            await this.quickSort(arr, low, pi - 1);
            await this.quickSort(arr, pi + 1, high);
        }
    }

    async partition(arr, low, high) {
        const pivot = arr[high];
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            this.comparing = [j, high];
            this.draw();
            await this.sleep(300);
            
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                this.draw();
                await this.sleep(300);
            }
        }
        
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        this.sorted.push(i + 1);
        this.comparing = [];
        this.draw();
        return i + 1;
    }

    async sort() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.comparing = [];
        this.sorted = [];
        this.array = [64, 34, 25, 12, 22, 11, 90, 88, 76, 50, 42];
        
        if (this.algorithm === 'merge') {
            await this.mergeSort();
        } else if (this.algorithm === 'quick') {
            await this.quickSort();
        }
        
        this.sorted = Array.from({length: this.array.length}, (_, i) => i);
        this.draw();
        this.isRunning = false;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class DataStructureVisualizer {
    constructor(canvas, type) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.type = type;
        this.data = [];
        this.isRunning = false;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.type === 'stack') {
            this.drawStack();
        } else if (this.type === 'queue') {
            this.drawQueue();
        } else if (this.type === 'heap') {
            this.drawHeap();
        }
    }

    drawStack() {
        const boxWidth = 60;
        const boxHeight = 30;
        const startX = 150;
        const startY = 200;
        
        this.data.forEach((val, i) => {
            this.ctx.fillStyle = '#ddd6fe';
            this.ctx.fillRect(startX, startY - (i + 1) * boxHeight, boxWidth, boxHeight);
            this.ctx.strokeStyle = '#9ca3af';
            this.ctx.strokeRect(startX, startY - (i + 1) * boxHeight, boxWidth, boxHeight);
            
            this.ctx.fillStyle = '#374151';
            this.ctx.font = '14px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(val, startX + boxWidth/2, startY - (i + 1) * boxHeight + boxHeight/2 + 4);
        });
        
        this.ctx.fillStyle = '#374151';
        this.ctx.font = '12px Inter';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Stack (LIFO)', 10, 30);
    }

    drawQueue() {
        const boxWidth = 40;
        const boxHeight = 30;
        const startX = 20;
        const startY = 100;
        
        this.data.forEach((val, i) => {
            this.ctx.fillStyle = '#fef3c7';
            this.ctx.fillRect(startX + i * boxWidth, startY, boxWidth, boxHeight);
            this.ctx.strokeStyle = '#9ca3af';
            this.ctx.strokeRect(startX + i * boxWidth, startY, boxWidth, boxHeight);
            
            this.ctx.fillStyle = '#374151';
            this.ctx.font = '12px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(val, startX + i * boxWidth + boxWidth/2, startY + boxHeight/2 + 4);
        });
        
        this.ctx.fillStyle = '#374151';
        this.ctx.font = '12px Inter';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Queue (FIFO)', 10, 30);
        this.ctx.fillText('Front →', 10, 50);
    }

    drawHeap() {
        if (this.data.length === 0) return;
        
        const levels = Math.floor(Math.log2(this.data.length)) + 1;
        const nodeRadius = 20;
        const levelHeight = 40;
        
        this.data.forEach((val, i) => {
            const level = Math.floor(Math.log2(i + 1));
            const posInLevel = i - (Math.pow(2, level) - 1);
            const nodesInLevel = Math.pow(2, level);
            
            const x = (this.canvas.width / (nodesInLevel + 1)) * (posInLevel + 1);
            const y = 50 + level * levelHeight;
            
            // Draw edges to children
            const leftChild = 2 * i + 1;
            const rightChild = 2 * i + 2;
            
            if (leftChild < this.data.length) {
                const childLevel = Math.floor(Math.log2(leftChild + 1));
                const childPosInLevel = leftChild - (Math.pow(2, childLevel) - 1);
                const childNodesInLevel = Math.pow(2, childLevel);
                const childX = (this.canvas.width / (childNodesInLevel + 1)) * (childPosInLevel + 1);
                const childY = 50 + childLevel * levelHeight;
                
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(childX, childY);
                this.ctx.strokeStyle = '#9ca3af';
                this.ctx.stroke();
            }
            
            if (rightChild < this.data.length) {
                const childLevel = Math.floor(Math.log2(rightChild + 1));
                const childPosInLevel = rightChild - (Math.pow(2, childLevel) - 1);
                const childNodesInLevel = Math.pow(2, childLevel);
                const childX = (this.canvas.width / (childNodesInLevel + 1)) * (childPosInLevel + 1);
                const childY = 50 + childLevel * levelHeight;
                
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(childX, childY);
                this.ctx.strokeStyle = '#9ca3af';
                this.ctx.stroke();
            }
            
            // Draw node
            this.ctx.beginPath();
            this.ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
            this.ctx.fillStyle = '#dcfce7';
            this.ctx.fill();
            this.ctx.strokeStyle = '#9ca3af';
            this.ctx.stroke();
            
            this.ctx.fillStyle = '#374151';
            this.ctx.font = '12px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(val, x, y);
        });
        
        this.ctx.fillStyle = '#374151';
        this.ctx.font = '12px Inter';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('Min Heap', 10, 10);
    }

    async demo() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.data = [];
        
        if (this.type === 'stack') {
            const values = [10, 20, 30, 40];
            for (let val of values) {
                this.data.push(val);
                this.draw();
                await this.sleep(600);
            }
            for (let i = 0; i < 2; i++) {
                this.data.pop();
                this.draw();
                await this.sleep(600);
            }
        } else if (this.type === 'queue') {
            const values = [1, 2, 3, 4, 5];
            for (let val of values) {
                this.data.push(val);
                this.draw();
                await this.sleep(600);
            }
            for (let i = 0; i < 3; i++) {
                this.data.shift();
                this.draw();
                await this.sleep(600);
            }
        } else if (this.type === 'heap') {
            const values = [4, 8, 12, 16, 20, 24, 28];
            for (let val of values) {
                this.data.push(val);
                this.heapifyUp(this.data.length - 1);
                this.draw();
                await this.sleep(800);
            }
        }
        
        this.isRunning = false;
    }

    heapifyUp(index) {
        if (index === 0) return;
        const parentIndex = Math.floor((index - 1) / 2);
        if (this.data[index] < this.data[parentIndex]) {
            [this.data[index], this.data[parentIndex]] = [this.data[parentIndex], this.data[index]];
            this.heapifyUp(parentIndex);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize visualizations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Sample graph data
    const nodes = [
        { id: 'A', x: 80, y: 60 },
        { id: 'B', x: 160, y: 40 },
        { id: 'C', x: 240, y: 60 },
        { id: 'D', x: 120, y: 120 },
        { id: 'E', x: 200, y: 120 },
        { id: 'F', x: 160, y: 180 }
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
    if (dfsCanvas) {
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
    }

    // Initialize BFS visualization
    const bfsCanvas = document.getElementById('bfsCanvas');
    if (bfsCanvas) {
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
    }

    // Initialize Binary Search visualization
    const binarySearchCanvas = document.getElementById('binarySearchCanvas');
    if (binarySearchCanvas) {
        const binarySearch = new BinarySearch(binarySearchCanvas);
        binarySearch.draw();
        
        const binarySearchBtn = document.getElementById('binarySearchBtn');
        binarySearchBtn.addEventListener('click', () => {
            if (!binarySearch.isRunning) {
                binarySearchBtn.disabled = true;
                binarySearchBtn.textContent = 'Running...';
                binarySearch.search().then(() => {
                    binarySearchBtn.disabled = false;
                    binarySearchBtn.textContent = 'Start Binary Search';
                });
            }
        });
    }

    // Initialize Merge Sort visualization
    const mergeSortCanvas = document.getElementById('mergeSortCanvas');
    if (mergeSortCanvas) {
        const mergeSort = new SortingVisualizer(mergeSortCanvas, 'merge');
        mergeSort.draw();
        
        const mergeSortBtn = document.getElementById('mergeSortBtn');
        mergeSortBtn.addEventListener('click', () => {
            if (!mergeSort.isRunning) {
                mergeSortBtn.disabled = true;
                mergeSortBtn.textContent = 'Running...';
                mergeSort.sort().then(() => {
                    mergeSortBtn.disabled = false;
                    mergeSortBtn.textContent = 'Start Merge Sort';
                });
            }
        });
    }

    // Initialize Quick Sort visualization
    const quickSortCanvas = document.getElementById('quickSortCanvas');
    if (quickSortCanvas) {
        const quickSort = new SortingVisualizer(quickSortCanvas, 'quick');
        quickSort.draw();
        
        const quickSortBtn = document.getElementById('quickSortBtn');
        quickSortBtn.addEventListener('click', () => {
            if (!quickSort.isRunning) {
                quickSortBtn.disabled = true;
                quickSortBtn.textContent = 'Running...';
                quickSort.sort().then(() => {
                    quickSortBtn.disabled = false;
                    quickSortBtn.textContent = 'Start Quick Sort';
                });
            }
        });
    }

    // Initialize Stack visualization
    const stackCanvas = document.getElementById('stackCanvas');
    if (stackCanvas) {
        const stack = new DataStructureVisualizer(stackCanvas, 'stack');
        stack.draw();
        
        const stackBtn = document.getElementById('stackBtn');
        stackBtn.addEventListener('click', () => {
            if (!stack.isRunning) {
                stackBtn.disabled = true;
                stackBtn.textContent = 'Running...';
                stack.demo().then(() => {
                    stackBtn.disabled = false;
                    stackBtn.textContent = 'Demo Stack';
                });
            }
        });
    }

    // Initialize Queue visualization
    const queueCanvas = document.getElementById('queueCanvas');
    if (queueCanvas) {
        const queue = new DataStructureVisualizer(queueCanvas, 'queue');
        queue.draw();
        
        const queueBtn = document.getElementById('queueBtn');
        queueBtn.addEventListener('click', () => {
            if (!queue.isRunning) {
                queueBtn.disabled = true;
                queueBtn.textContent = 'Running...';
                queue.demo().then(() => {
                    queueBtn.disabled = false;
                    queueBtn.textContent = 'Demo Queue';
                });
            }
        });
    }

    // Initialize Heap visualization
    const heapCanvas = document.getElementById('heapCanvas');
    if (heapCanvas) {
        const heap = new DataStructureVisualizer(heapCanvas, 'heap');
        heap.draw();
        
        const heapBtn = document.getElementById('heapBtn');
        heapBtn.addEventListener('click', () => {
            if (!heap.isRunning) {
                heapBtn.disabled = true;
                heapBtn.textContent = 'Running...';
                heap.demo().then(() => {
                    heapBtn.disabled = false;
                    heapBtn.textContent = 'Demo Heap';
                });
            }
        });
    }
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