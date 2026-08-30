

export const PRESET_CIRCUITS = [
  {
    id: 'three-not-challenge',
    title: '3-Inverter Challenge (Only 2 NOT Gates)',
    description: 'Calculates ~X, ~Y, ~Z for inputs X, Y, Z using ONLY 2 NOT gates + AND/OR gates (No XOR/NAND/NOR).',
    graph: getThreeNotChallengeGraph()
  },
  {
    id: 'half-adder',
    title: 'Half Adder Circuit',
    description: 'Computes Sum (XOR) and Carry (AND) for two binary inputs A and B.',
    graph: getHalfAdderGraph()
  },
  {
    id: 'full-adder',
    title: '1-Bit Full Adder Circuit',
    description: 'Computes Sum and Carry-Out using two Half Adders and an OR gate.',
    graph: getFullAdderGraph()
  }
];

function getThreeNotChallengeGraph() {
  const nodes = [
    // 3 Inputs: X, Y, Z
    { id: 'in_x', type: 'custom', position: { x: 50, y: 120 }, data: { label: 'Input X', gateType: 'input-switch', val: 0 } },
    { id: 'in_y', type: 'custom', position: { x: 50, y: 320 }, data: { label: 'Input Y', gateType: 'input-switch', val: 1 } },
    { id: 'in_z', type: 'custom', position: { x: 50, y: 520 }, data: { label: 'Input Z', gateType: 'input-switch', val: 0 } },

    // Pairwise ANDs for Majority: X·Y, Y·Z, Z·X
    { id: 'and_xy', type: 'custom', position: { x: 220, y: 80 }, data: { label: 'X AND Y', gateType: 'gate-and' } },
    { id: 'and_yz', type: 'custom', position: { x: 220, y: 200 }, data: { label: 'Y AND Z', gateType: 'gate-and' } },
    { id: 'and_zx', type: 'custom', position: { x: 220, y: 320 }, data: { label: 'Z AND X', gateType: 'gate-and' } },
    
    // OR of X, Y, Z: P1 = (X OR Y) OR Z
    { id: 'or_xy_in', type: 'custom', position: { x: 220, y: 440 }, data: { label: 'X OR Y', gateType: 'gate-or' } },
    { id: 'or_xyz', type: 'custom', position: { x: 380, y: 460 }, data: { label: 'P1 (X OR Y OR Z)', gateType: 'gate-or' } },

    // Majority P2 = (X·Y) OR (Y·Z) OR (Z·X)
    { id: 'or_p2_1', type: 'custom', position: { x: 380, y: 140 }, data: { label: 'P2 Part 1', gateType: 'gate-or' } },
    { id: 'or_p2_final', type: 'custom', position: { x: 520, y: 180 }, data: { label: 'P2 Majority', gateType: 'gate-or' } },

    // *** NOT GATE #1 ***: N1 = NOT(P2)
    { id: 'not_1', type: 'custom', position: { x: 670, y: 180 }, data: { label: 'NOT Gate #1 (N1)', gateType: 'gate-not' } },

    // P3 = X·Y·Z
    { id: 'and_p3', type: 'custom', position: { x: 380, y: 280 }, data: { label: 'P3 = X·Y·Z', gateType: 'gate-and' } },

    // Signal B = P3 OR (P1 AND N1)
    { id: 'and_p1_n1', type: 'custom', position: { x: 800, y: 320 }, data: { label: 'P1 AND N1', gateType: 'gate-and' } },
    { id: 'or_b', type: 'custom', position: { x: 940, y: 300 }, data: { label: 'Signal B', gateType: 'gate-or' } },

    // *** NOT GATE #2 ***: N2 = NOT(B)
    { id: 'not_2', type: 'custom', position: { x: 1080, y: 300 }, data: { label: 'NOT Gate #2 (N2)', gateType: 'gate-not' } },

    // Common term N1 AND N2
    { id: 'term_n1_n2', type: 'custom', position: { x: 1240, y: 300 }, data: { label: 'N1 AND N2', gateType: 'gate-and' } },

    // --- Output ~X ---
    { id: 'or_yz', type: 'custom', position: { x: 1240, y: 80 }, data: { label: 'Y OR Z', gateType: 'gate-or' } },
    { id: 'term_x1', type: 'custom', position: { x: 1400, y: 80 }, data: { label: 'N1 AND (Y OR Z)', gateType: 'gate-and' } },
    { id: 'term_x2', type: 'custom', position: { x: 1400, y: 180 }, data: { label: 'N2 AND (Y AND Z)', gateType: 'gate-and' } },
    { id: 'or_x_mid', type: 'custom', position: { x: 1560, y: 120 }, data: { label: 'Term X Mid', gateType: 'gate-or' } },
    { id: 'or_x_final', type: 'custom', position: { x: 1700, y: 160 }, data: { label: 'Final ~X', gateType: 'gate-or' } },
    { id: 'out_not_x', type: 'custom', position: { x: 1860, y: 160 }, data: { label: 'Output ~X', gateType: 'output-bulb' } },

    // --- Output ~Y ---
    { id: 'or_xz', type: 'custom', position: { x: 1240, y: 440 }, data: { label: 'X OR Z', gateType: 'gate-or' } },
    { id: 'term_y1', type: 'custom', position: { x: 1400, y: 440 }, data: { label: 'N1 AND (X OR Z)', gateType: 'gate-and' } },
    { id: 'term_y2', type: 'custom', position: { x: 1400, y: 540 }, data: { label: 'N2 AND (X AND Z)', gateType: 'gate-and' } },
    { id: 'or_y_mid', type: 'custom', position: { x: 1560, y: 480 }, data: { label: 'Term Y Mid', gateType: 'gate-or' } },
    { id: 'or_y_final', type: 'custom', position: { x: 1700, y: 520 }, data: { label: 'Final ~Y', gateType: 'gate-or' } },
    { id: 'out_not_y', type: 'custom', position: { x: 1860, y: 520 }, data: { label: 'Output ~Y', gateType: 'output-bulb' } },

    // --- Output ~Z ---
    { id: 'term_z1', type: 'custom', position: { x: 1400, y: 680 }, data: { label: 'N1 AND (X OR Y)', gateType: 'gate-and' } },
    { id: 'term_z2', type: 'custom', position: { x: 1400, y: 780 }, data: { label: 'N2 AND (X AND Y)', gateType: 'gate-and' } },
    { id: 'or_z_mid', type: 'custom', position: { x: 1560, y: 720 }, data: { label: 'Term Z Mid', gateType: 'gate-or' } },
    { id: 'or_z_final', type: 'custom', position: { x: 1700, y: 760 }, data: { label: 'Final ~Z', gateType: 'gate-or' } },
    { id: 'out_not_z', type: 'custom', position: { x: 1860, y: 760 }, data: { label: 'Output ~Z', gateType: 'output-bulb' } }
  ];

  const edges = [
    // Inputs to Pairwise ANDs
    { id: 'e1', source: 'in_x', sourceHandle: 'out', target: 'and_xy', targetHandle: 'in1' },
    { id: 'e2', source: 'in_y', sourceHandle: 'out', target: 'and_xy', targetHandle: 'in2' },
    { id: 'e3', source: 'in_y', sourceHandle: 'out', target: 'and_yz', targetHandle: 'in1' },
    { id: 'e4', source: 'in_z', sourceHandle: 'out', target: 'and_yz', targetHandle: 'in2' },
    { id: 'e5', source: 'in_z', sourceHandle: 'out', target: 'and_zx', targetHandle: 'in1' },
    { id: 'e6', source: 'in_x', sourceHandle: 'out', target: 'and_zx', targetHandle: 'in2' },

    // P1 = X OR Y OR Z
    { id: 'e7', source: 'in_x', sourceHandle: 'out', target: 'or_xy_in', targetHandle: 'in1' },
    { id: 'e8', source: 'in_y', sourceHandle: 'out', target: 'or_xy_in', targetHandle: 'in2' },
    { id: 'e7b', source: 'or_xy_in', sourceHandle: 'out', target: 'or_xyz', targetHandle: 'in1' },
    { id: 'e8b', source: 'in_z', sourceHandle: 'out', target: 'or_xyz', targetHandle: 'in2' },

    // P2 Majority = (X·Y) OR (Y·Z) OR (Z·X)
    { id: 'e9', source: 'and_xy', sourceHandle: 'out', target: 'or_p2_1', targetHandle: 'in1' },
    { id: 'e10', source: 'and_yz', sourceHandle: 'out', target: 'or_p2_1', targetHandle: 'in2' },
    { id: 'e11', source: 'or_p2_1', sourceHandle: 'out', target: 'or_p2_final', targetHandle: 'in1' },
    { id: 'e12', source: 'and_zx', sourceHandle: 'out', target: 'or_p2_final', targetHandle: 'in2' },

    // N1 = NOT(P2)
    { id: 'e13', source: 'or_p2_final', sourceHandle: 'out', target: 'not_1', targetHandle: 'in1' },

    // P3 = X·Y·Z
    { id: 'e14', source: 'and_xy', sourceHandle: 'out', target: 'and_p3', targetHandle: 'in1' },
    { id: 'e15', source: 'in_z', sourceHandle: 'out', target: 'and_p3', targetHandle: 'in2' },

    // Signal B = P3 OR (P1 AND N1)
    { id: 'e16', source: 'or_xyz', sourceHandle: 'out', target: 'and_p1_n1', targetHandle: 'in1' },
    { id: 'e17', source: 'not_1', sourceHandle: 'out', target: 'and_p1_n1', targetHandle: 'in2' },
    { id: 'e18', source: 'and_p3', sourceHandle: 'out', target: 'or_b', targetHandle: 'in1' },
    { id: 'e19', source: 'and_p1_n1', sourceHandle: 'out', target: 'or_b', targetHandle: 'in2' },

    // N2 = NOT(B)
    { id: 'e20', source: 'or_b', sourceHandle: 'out', target: 'not_2', targetHandle: 'in1' },

    // Common term N1 AND N2
    { id: 'e_n1n2_1', source: 'not_1', sourceHandle: 'out', target: 'term_n1_n2', targetHandle: 'in1' },
    { id: 'e_n1n2_2', source: 'not_2', sourceHandle: 'out', target: 'term_n1_n2', targetHandle: 'in2' },

    // --- Wiring ~X ---
    { id: 'e21', source: 'in_y', sourceHandle: 'out', target: 'or_yz', targetHandle: 'in1' },
    { id: 'e22', source: 'in_z', sourceHandle: 'out', target: 'or_yz', targetHandle: 'in2' },
    { id: 'e23', source: 'not_1', sourceHandle: 'out', target: 'term_x1', targetHandle: 'in1' },
    { id: 'e24', source: 'or_yz', sourceHandle: 'out', target: 'term_x1', targetHandle: 'in2' },
    { id: 'e25', source: 'not_2', sourceHandle: 'out', target: 'term_x2', targetHandle: 'in1' },
    { id: 'e26', source: 'and_yz', sourceHandle: 'out', target: 'term_x2', targetHandle: 'in2' },
    { id: 'e29', source: 'term_x1', sourceHandle: 'out', target: 'or_x_mid', targetHandle: 'in1' },
    { id: 'e30', source: 'term_x2', sourceHandle: 'out', target: 'or_x_mid', targetHandle: 'in2' },
    { id: 'e31', source: 'or_x_mid', sourceHandle: 'out', target: 'or_x_final', targetHandle: 'in1' },
    { id: 'e32', source: 'term_n1_n2', sourceHandle: 'out', target: 'or_x_final', targetHandle: 'in2' },
    { id: 'e33', source: 'or_x_final', sourceHandle: 'out', target: 'out_not_x', targetHandle: 'in1' },

    // --- Wiring ~Y ---
    { id: 'ey1', source: 'in_x', sourceHandle: 'out', target: 'or_xz', targetHandle: 'in1' },
    { id: 'ey2', source: 'in_z', sourceHandle: 'out', target: 'or_xz', targetHandle: 'in2' },
    { id: 'ey3', source: 'not_1', sourceHandle: 'out', target: 'term_y1', targetHandle: 'in1' },
    { id: 'ey4', source: 'or_xz', sourceHandle: 'out', target: 'term_y1', targetHandle: 'in2' },
    { id: 'ey5', source: 'not_2', sourceHandle: 'out', target: 'term_y2', targetHandle: 'in1' },
    { id: 'ey6', source: 'and_zx', sourceHandle: 'out', target: 'term_y2', targetHandle: 'in2' },
    { id: 'ey7', source: 'term_y1', sourceHandle: 'out', target: 'or_y_mid', targetHandle: 'in1' },
    { id: 'ey8', source: 'term_y2', sourceHandle: 'out', target: 'or_y_mid', targetHandle: 'in2' },
    { id: 'ey9', source: 'or_y_mid', sourceHandle: 'out', target: 'or_y_final', targetHandle: 'in1' },
    { id: 'ey10', source: 'term_n1_n2', sourceHandle: 'out', target: 'or_y_final', targetHandle: 'in2' },
    { id: 'ey11', source: 'or_y_final', sourceHandle: 'out', target: 'out_not_y', targetHandle: 'in1' },

    // --- Wiring ~Z ---
    { id: 'ez3', source: 'not_1', sourceHandle: 'out', target: 'term_z1', targetHandle: 'in1' },
    { id: 'ez4', source: 'or_xy_in', sourceHandle: 'out', target: 'term_z1', targetHandle: 'in2' },
    { id: 'ez5', source: 'not_2', sourceHandle: 'out', target: 'term_z2', targetHandle: 'in1' },
    { id: 'ez6', source: 'and_xy', sourceHandle: 'out', target: 'term_z2', targetHandle: 'in2' },
    { id: 'ez7', source: 'term_z1', sourceHandle: 'out', target: 'or_z_mid', targetHandle: 'in1' },
    { id: 'ez8', source: 'term_z2', sourceHandle: 'out', target: 'or_z_mid', targetHandle: 'in2' },
    { id: 'ez9', source: 'or_z_mid', sourceHandle: 'out', target: 'or_z_final', targetHandle: 'in1' },
    { id: 'ez10', source: 'term_n1_n2', sourceHandle: 'out', target: 'or_z_final', targetHandle: 'in2' },
    { id: 'ez11', source: 'or_z_final', sourceHandle: 'out', target: 'out_not_z', targetHandle: 'in1' }
  ];

  return { nodes, edges };
}

function getHalfAdderGraph() {
  return {
    nodes: [
      { id: 'a', type: 'custom', position: { x: 100, y: 100 }, data: { label: 'Input A', gateType: 'input-switch', val: 1 } },
      { id: 'b', type: 'custom', position: { x: 100, y: 250 }, data: { label: 'Input B', gateType: 'input-switch', val: 1 } },
      { id: 'xor', type: 'custom', position: { x: 300, y: 100 }, data: { label: 'XOR Gate', gateType: 'gate-xor' } },
      { id: 'and', type: 'custom', position: { x: 300, y: 250 }, data: { label: 'AND Gate', gateType: 'gate-and' } },
      { id: 'sum', type: 'custom', position: { x: 500, y: 100 }, data: { label: 'Sum', gateType: 'output-bulb' } },
      { id: 'carry', type: 'custom', position: { x: 500, y: 250 }, data: { label: 'Carry', gateType: 'output-bulb' } }
    ],
    edges: [
      { id: 'e1', source: 'a', sourceHandle: 'out', target: 'xor', targetHandle: 'in1' },
      { id: 'e2', source: 'b', sourceHandle: 'out', target: 'xor', targetHandle: 'in2' },
      { id: 'e3', source: 'a', sourceHandle: 'out', target: 'and', targetHandle: 'in1' },
      { id: 'e4', source: 'b', sourceHandle: 'out', target: 'and', targetHandle: 'in2' },
      { id: 'e5', source: 'xor', sourceHandle: 'out', target: 'sum', targetHandle: 'in1' },
      { id: 'e6', source: 'and', sourceHandle: 'out', target: 'carry', targetHandle: 'in1' }
    ]
  };
}

function getFullAdderGraph() {
  return {
    nodes: [
      { id: 'a', type: 'custom', position: { x: 80, y: 100 }, data: { label: 'Input A', gateType: 'input-switch', val: 1 } },
      { id: 'b', type: 'custom', position: { x: 80, y: 220 }, data: { label: 'Input B', gateType: 'input-switch', val: 0 } },
      { id: 'cin', type: 'custom', position: { x: 80, y: 340 }, data: { label: 'Carry In', gateType: 'input-switch', val: 1 } },
      { id: 'xor1', type: 'custom', position: { x: 260, y: 120 }, data: { label: 'XOR 1', gateType: 'gate-xor' } },
      { id: 'and1', type: 'custom', position: { x: 260, y: 240 }, data: { label: 'AND 1', gateType: 'gate-and' } },
      { id: 'xor2', type: 'custom', position: { x: 440, y: 140 }, data: { label: 'XOR 2', gateType: 'gate-xor' } },
      { id: 'and2', type: 'custom', position: { x: 440, y: 280 }, data: { label: 'AND 2', gateType: 'gate-and' } },
      { id: 'or_cout', type: 'custom', position: { x: 620, y: 260 }, data: { label: 'OR Carry', gateType: 'gate-or' } },
      { id: 'sum', type: 'custom', position: { x: 620, y: 140 }, data: { label: 'Sum Out', gateType: 'output-bulb' } },
      { id: 'cout', type: 'custom', position: { x: 780, y: 260 }, data: { label: 'Carry Out', gateType: 'output-bulb' } }
    ],
    edges: [
      { id: 'e1', source: 'a', sourceHandle: 'out', target: 'xor1', targetHandle: 'in1' },
      { id: 'e2', source: 'b', sourceHandle: 'out', target: 'xor1', targetHandle: 'in2' },
      { id: 'e3', source: 'a', sourceHandle: 'out', target: 'and1', targetHandle: 'in1' },
      { id: 'e4', source: 'b', sourceHandle: 'out', target: 'and1', targetHandle: 'in2' },
      { id: 'e5', source: 'xor1', sourceHandle: 'out', target: 'xor2', targetHandle: 'in1' },
      { id: 'e6', source: 'cin', sourceHandle: 'out', target: 'xor2', targetHandle: 'in2' },
      { id: 'e7', source: 'xor1', sourceHandle: 'out', target: 'and2', targetHandle: 'in1' },
      { id: 'e8', source: 'cin', sourceHandle: 'out', target: 'and2', targetHandle: 'in2' },
      { id: 'e9', source: 'and1', sourceHandle: 'out', target: 'or_cout', targetHandle: 'in1' },
      { id: 'e10', source: 'and2', sourceHandle: 'out', target: 'or_cout', targetHandle: 'in2' },
      { id: 'e11', source: 'xor2', sourceHandle: 'out', target: 'sum', targetHandle: 'in1' },
      { id: 'e12', source: 'or_cout', sourceHandle: 'out', target: 'cout', targetHandle: 'in1' }
    ]
  };
}
