import { and, nand, nor, not, or, xor } from 'lgates';

export function evaluateCircuit(nodes, edges) {
  const nodeValues = {};
  
  nodes.forEach(node => {
    const type = (node.data?.gateType || node.type || '').toLowerCase();
    if (type.includes('input') || type.includes('switch') || type.includes('button') || type.includes('clock')) {
      nodeValues[node.id] = node.data?.val ?? 0;
    }
  });

  const maxPasses = Math.max(nodes.length * 2, 20);
  
  for (let pass = 0; pass < maxPasses; pass++) {
    let changed = false;

    nodes.forEach(node => {
      const type = (node.data?.gateType || node.type || '').toLowerCase();
      
      if (type.includes('input') || type.includes('switch') || type.includes('button') || type.includes('clock')) {
        return;
      }

      const inputs = edges.filter(e => e.target === node.id).map(e => nodeValues[e.source] ?? 0);
      const computedVal = computeGateLogic(type, inputs);

      if (nodeValues[node.id] !== computedVal) {
        nodeValues[node.id] = computedVal;
        changed = true;
      }
    });

    if (!changed) break;
  }

  const updatedEdges = edges.map(edge => {
    const sourceSignal = nodeValues[edge.source] ?? 0;
    const isHigh = sourceSignal === 1;
    return {
      ...edge,
      class: isHigh ? 'wire-glowing-high' : 'wire-glowing-low',
      style: {
        stroke: isHigh ? '#dc2626' : '#334155',
        strokeWidth: isHigh ? '4.5px' : '3px'
      },
      data: { ...(edge.data || {}), signal: sourceSignal },
      animated: isHigh
    };
  });

  const updatedNodes = nodes.map(node => ({
    ...node,
    data: {
      ...(node.data || {}),
      outputVal: nodeValues[node.id] ?? 0
    }
  }));

  return { nodes: updatedNodes, edges: updatedEdges, nodeValues };
}

function computeGateLogic(type, inputs) {
  if (inputs.length === 0) return 0;
  
  if (inputs.length === 1 && !type.includes('not')) {
    return inputs[0]; 
  }

  if (type.includes('not'))  return not(inputs[0] ?? 0);
  if (type.includes('nand')) return nand(...inputs);
  if (type.includes('nor'))  return nor(...inputs);
  if (type.includes('xor'))  return xor(...inputs);
  if (type.includes('and'))  return and(...inputs);
  if (type.includes('or'))   return or(...inputs);

  return inputs[0] ?? 0; 
}


export function generateTruthTable(nodes, edges) {
  const inputs = nodes.filter(n => {
    const t = (n.data?.gateType || n.type || '').toLowerCase();
    return t.includes('input') || t.includes('switch') || t.includes('button');
  }).map(n => ({ id: n.id, label: n.data?.label || n.id })).sort((a, b) => a.label.localeCompare(b.label));

  const outputs = nodes.filter(n => {
    const t = (n.data?.gateType || n.type || '').toLowerCase();
    return t.includes('output') || t.includes('bulb') || t.includes('led');
  }).map(n => ({ id: n.id, label: n.data?.label || n.id })).sort((a, b) => a.label.localeCompare(b.label));

  if (inputs.length === 0) {
    return { headers: ['Status'], rows: [['No input components placed in circuit']], inputs: [], outputs: [] };
  }
  if (inputs.length > 8) {
    return { headers: ['Warning'], rows: [['Truth table size too large (>8 inputs)']], inputs: inputs.map(i => i.label), outputs: outputs.map(o => o.label) };
  }

  const combinations = 1 << inputs.length;
  const rows = [];

  for (let i = 0; i < combinations; i++) {
    const simNodes = nodes.map(n => {
      const cloned = JSON.parse(JSON.stringify(n));
      const idx = inputs.findIndex(inp => inp.id === cloned.id);
      if (idx !== -1) {
        const bit = (i >> (inputs.length - 1 - idx)) & 1;
        if (!cloned.data) cloned.data = {};
        cloned.data.val = bit;
      }
      return cloned;
    });

    const result = evaluateCircuit(simNodes, edges);
    
    const row = [];
    inputs.forEach(inp => {
      const idx = inputs.findIndex(x => x.id === inp.id);
      const bit = (i >> (inputs.length - 1 - idx)) & 1;
      row.push(bit);
    });
    
    outputs.forEach(out => {
      row.push(result.nodeValues[out.id] ?? 0);
    });
    rows.push(row);
  }

  return {
    headers: [...inputs.map(i => i.label), ...outputs.map(o => o.label)],
    rows,
    inputs: inputs.map(i => i.label),
    outputs: outputs.map(o => o.label)
  };
}
