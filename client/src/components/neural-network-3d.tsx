import { useState, useEffect } from 'react';

// Advanced Neural Network Animation with CSS and SVG
function NeuralNetworkAnimation() {
  const [animationState, setAnimationState] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationState(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Generate network layers and nodes
  const layers = [
    { nodes: 4, y: 15 },
    { nodes: 6, y: 35 },
    { nodes: 8, y: 55 },
    { nodes: 6, y: 75 },
    { nodes: 3, y: 95 }
  ];

  const allNodes = layers.flatMap((layer, layerIndex) =>
    Array.from({ length: layer.nodes }, (_, nodeIndex) => ({
      x: 15 + layerIndex * 17.5,
      y: layer.y - (layer.nodes * 3) + nodeIndex * 6,
      layer: layerIndex,
      index: nodeIndex,
      id: `node-${layerIndex}-${nodeIndex}`
    }))
  );

  // Generate connections between adjacent layers
  const connections: Array<{ id: string; path: string; delay: number }> = [];
  for (let layerIndex = 0; layerIndex < layers.length - 1; layerIndex++) {
    const currentNodes = allNodes.filter(n => n.layer === layerIndex);
    const nextNodes = allNodes.filter(n => n.layer === layerIndex + 1);
    
    currentNodes.forEach(startNode => {
      nextNodes.forEach(endNode => {
        // Create spline-like connections with some randomness
        if (Math.random() > 0.2) {
          const midX = (startNode.x + endNode.x) / 2;
          const midY = (startNode.y + endNode.y) / 2 + (Math.random() - 0.5) * 8;
          connections.push({
            id: `conn-${startNode.id}-${endNode.id}`,
            path: `M ${startNode.x} ${startNode.y} Q ${midX} ${midY} ${endNode.x} ${endNode.y}`,
            delay: Math.random() * 3
          });
        }
      });
    });
  }

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full max-w-4xl max-h-96">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
            </linearGradient>

            {/* Animated gradient for flowing connections */}
            <linearGradient id="flowGradient">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="30%" stopColor="#6366f1" stopOpacity="0.8">
                <animate attributeName="stop-opacity" 
                  values="0;0.8;0" 
                  dur="2s" 
                  repeatCount="indefinite" />
              </stop>
              <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.6">
                <animate attributeName="stop-opacity" 
                  values="0;0.6;0" 
                  dur="2s" 
                  begin="0.5s"
                  repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="transparent" />
              
              <animateTransform
                attributeName="gradientTransform"
                attributeType="XML"
                type="translate"
                values="-100 0;100 0;-100 0"
                dur="3s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>

          {/* Render connections with flowing animation */}
          {connections.map((connection) => (
            <g key={connection.id}>
              <path
                d={connection.path}
                stroke="url(#connectionGradient)"
                strokeWidth="0.3"
                fill="none"
                opacity="0.4"
              />
              <path
                d={connection.path}
                stroke="url(#flowGradient)"
                strokeWidth="0.5"
                fill="none"
                style={{
                  animation: `neuralFlow 3s ease-in-out infinite ${connection.delay}s`
                }}
              />
            </g>
          ))}

          {/* Render nodes */}
          {allNodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.layer === 0 || node.layer === layers.length - 1 ? 1.2 : 1}
                fill="url(#nodeGradient)"
                opacity="0.8"
                style={{
                  animation: `neuralPulse 2s ease-in-out infinite ${node.index * 0.2}s`
                }}
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={0.4}
                fill="#ffffff"
                opacity="0.9"
                style={{
                  animation: `neuralGlow 1.5s ease-in-out infinite ${node.index * 0.1}s`
                }}
              />
            </g>
          ))}

          {/* Data flow indicators */}
          {[0, 1, 2, 3].map((layerIndex) => (
            <circle
              key={`flow-${layerIndex}`}
              cx={15 + layerIndex * 17.5}
              cy={50}
              r="0.8"
              fill="#00ff88"
              opacity="0"
              style={{
                animation: `dataFlow 4s ease-in-out infinite ${layerIndex * 0.5}s`
              }}
            />
          ))}
        </svg>

        {/* Activity indicators */}
        <div className="absolute bottom-4 left-4 flex space-x-2">
          {['Processing', 'Learning', 'Optimizing', 'Ready'].map((status, i) => (
            <div
              key={status}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-500 ${
                i === animationState 
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' 
                  : 'bg-gray-500/10 text-gray-500 border border-gray-600/20'
              }`}
            >
              {status}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main Neural Network Component
export function NeuralNetwork3D() {
  return <NeuralNetworkAnimation />;
}