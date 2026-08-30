<template>
  <div
    class="h-screen w-screen bg-transparent text-slate-800 flex flex-col overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
    <header
      class="h-16 border-b border-slate-200 bg-white/90 backdrop-blur px-6 flex items-center justify-between z-30 shrink-0">
      <div class="flex items-center space-x-4">
        <button @click="backToHome"
          class="p-2 text-slate-500 hover:text-slate-800 bg-slate-100/80 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          title="Back to Dashboard">
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <div class="flex items-center space-x-2">
          <div @click="backToHome"
            class="cursor-pointer w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow">
            <CpuIcon class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="text-sm font-bold text-slate-800 leading-tight">{{ room.title }}</h2>
            <div class="flex items-center space-x-2 text-[11px] text-slate-500">
              <span>ID: {{ room.id }}</span>
              <span>•</span>
              <span class="text-emerald-600 font-mono flex items-center">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                Live Stream Active
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center space-x-3 bg-slate-50/80 px-4 py-1.5 rounded-2xl border border-slate-200">
        <span class="text-xs font-semibold text-slate-500 flex items-center space-x-1">
          <UsersIcon class="w-4 h-4 text-indigo-600" />
          <span>Active Team:</span>
        </span>

        <div class="flex items-center space-x-2">
          <div v-for="user in activeUsers" :key="user.id"
            class="px-2.5 py-1 rounded-xl text-xs font-bold font-mono text-white flex items-center space-x-1.5 shadow"
            :style="{ backgroundColor: user.color || '#4361ee' }">
            <span class="w-2 h-2 rounded-full bg-white/80"></span>
            <span>{{ user.name }}</span>
            <span v-if="user.name === currentUser.name" class="text-[9px] opacity-90">(You)</span>
          </div>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <select v-model="selectedPreset" @change="loadPresetCircuit"
          class="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-sm">
          <option value="" disabled>Load Preset Circuit...</option>
          <option value="three-not-challenge">⭐ 3-Inverter (Only 2 NOTs)</option>
          <option value="half-adder">Half Adder Circuit</option>
          <option value="full-adder">1-Bit Full Adder</option>
        </select>

        <button @click="openTruthTableModal"
          class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-indigo-600 rounded-xl text-xs font-bold border border-slate-200 transition flex items-center space-x-2">
          <TableIcon class="w-4 h-4" />
          <span>Truth Table</span>
        </button>
        <button @click="exportCircuitPDF"
          class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2">
          <DownloadIcon class="w-4 h-4" />
          <span>Export PDF</span>
        </button>

        <button @click="confirmDeleteRoom"
          class="p-2 bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl text-xs font-bold border border-rose-100 transition"
          title="Delete Room">
          <Trash2Icon class="w-4 h-4" />
        </button>
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden relative">
      <aside
        class="w-64 border-r border-slate-200 bg-white/80 backdrop-blur p-4 flex flex-col space-y-6 shrink-0 overflow-y-auto">
        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Input Elements</h3>
          <div class="grid grid-cols-1 gap-2">
            <button draggable="true" @dragstart="onDragStartPanel($event, 'input-switch', 'Switch')"
              @click="addNode('input-switch', 'Switch')"
              class="p-3 bg-white hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-300 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-700 transition group shadow-sm">
              <div class="flex items-center space-x-2">
                <ToggleRightIcon class="w-4 h-4 text-emerald-500 group-hover:scale-110 transition" />
                <span>Toggle Switch</span>
              </div>
              <PlusIcon class="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
            </button>
          </div>
        </div>

        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Logic Gates</h3>
          <div class="grid grid-cols-2 gap-2">
            <!-- NOT Gate -->
            <button draggable="true" @dragstart="onDragStartPanel($event, 'gate-not', 'NOT Gate')"
              @click="addNode('gate-not', 'NOT Gate')"
              class="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl flex flex-col items-center justify-center transition group shadow-sm">
              <svg viewBox="0 0 60 30" class="w-10 h-5 stroke-slate-800 fill-white stroke-[2]">
                <line x1="2" y1="15" x2="15" y2="15" />
                <circle cx="2" cy="15" r="2" class="fill-white stroke-slate-800" />
                <polygon points="15,4 38,15 15,26" />
                <circle cx="41" cy="15" r="3" class="fill-white stroke-slate-800" />
                <line x1="44" y1="15" x2="58" y2="15" />
                <circle cx="58" cy="15" r="2" class="fill-white stroke-slate-800" />
              </svg>
              <span class="text-[10px] font-semibold text-slate-600 mt-1">NOT Gate</span>
            </button>

            <!-- AND Gate -->
            <button draggable="true" @dragstart="onDragStartPanel($event, 'gate-and', 'AND Gate')"
              @click="addNode('gate-and', 'AND Gate')"
              class="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl flex flex-col items-center justify-center transition group shadow-sm">
              <svg viewBox="0 0 60 30" class="w-10 h-5 stroke-slate-800 fill-white stroke-[2]">
                <line x1="2" y1="8" x2="15" y2="8" />
                <circle cx="2" cy="8" r="2" class="fill-white stroke-slate-800" />
                <line x1="2" y1="22" x2="15" y2="22" />
                <circle cx="2" cy="22" r="2" class="fill-white stroke-slate-800" />
                <path d="M 15,4 L 28,4 A 11,11 0 0,1 28,26 L 15,26 Z" />
                <line x1="39" y1="15" x2="58" y2="15" />
                <circle cx="58" cy="15" r="2" class="fill-white stroke-slate-800" />
              </svg>
              <span class="text-[10px] font-semibold text-slate-600 mt-1">AND Gate</span>
            </button>

            <!-- NAND Gate -->
            <button draggable="true" @dragstart="onDragStartPanel($event, 'gate-nand', 'NAND Gate')"
              @click="addNode('gate-nand', 'NAND Gate')"
              class="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl flex flex-col items-center justify-center transition group shadow-sm">
              <svg viewBox="0 0 60 30" class="w-10 h-5 stroke-slate-800 fill-white stroke-[2]">
                <line x1="2" y1="8" x2="15" y2="8" />
                <circle cx="2" cy="8" r="2" class="fill-white stroke-slate-800" />
                <line x1="2" y1="22" x2="15" y2="22" />
                <circle cx="2" cy="22" r="2" class="fill-white stroke-slate-800" />
                <path d="M 15,4 L 26,4 A 11,11 0 0,1 26,26 L 15,26 Z" />
                <circle cx="40" cy="15" r="3" class="fill-white stroke-slate-800" />
                <line x1="43" y1="15" x2="58" y2="15" />
                <circle cx="58" cy="15" r="2" class="fill-white stroke-slate-800" />
              </svg>
              <span class="text-[10px] font-semibold text-slate-600 mt-1">NAND Gate</span>
            </button>

            <!-- OR Gate -->
            <button draggable="true" @dragstart="onDragStartPanel($event, 'gate-or', 'OR Gate')"
              @click="addNode('gate-or', 'OR Gate')"
              class="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl flex flex-col items-center justify-center transition group shadow-sm">
              <svg viewBox="0 0 60 30" class="w-10 h-5 stroke-slate-800 fill-white stroke-[2]">
                <line x1="2" y1="8" x2="15" y2="8" />
                <circle cx="2" cy="8" r="2" class="fill-white stroke-slate-800" />
                <line x1="2" y1="22" x2="15" y2="22" />
                <circle cx="2" cy="22" r="2" class="fill-white stroke-slate-800" />
                <path d="M 15,4 Q 28,4 38,15 Q 28,26 15,26 Q 22,15 15,4 Z" />
                <line x1="38" y1="15" x2="58" y2="15" />
                <circle cx="58" cy="15" r="2" class="fill-white stroke-slate-800" />
              </svg>
              <span class="text-[10px] font-semibold text-slate-600 mt-1">OR Gate</span>
            </button>

            <!-- NOR Gate -->
            <button draggable="true" @dragstart="onDragStartPanel($event, 'gate-nor', 'NOR Gate')"
              @click="addNode('gate-nor', 'NOR Gate')"
              class="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl flex flex-col items-center justify-center transition group shadow-sm">
              <svg viewBox="0 0 60 30" class="w-10 h-5 stroke-slate-800 fill-white stroke-[2]">
                <line x1="2" y1="8" x2="15" y2="8" />
                <circle cx="2" cy="8" r="2" class="fill-white stroke-slate-800" />
                <line x1="2" y1="22" x2="15" y2="22" />
                <circle cx="2" cy="22" r="2" class="fill-white stroke-slate-800" />
                <path d="M 15,4 Q 26,4 34,15 Q 26,26 15,26 Q 20,15 15,4 Z" />
                <circle cx="37" cy="15" r="3" class="fill-white stroke-slate-800" />
                <line x1="40" y1="15" x2="58" y2="15" />
                <circle cx="58" cy="15" r="2" class="fill-white stroke-slate-800" />
              </svg>
              <span class="text-[10px] font-semibold text-slate-600 mt-1">NOR Gate</span>
            </button>

            <!-- XOR Gate -->
            <button draggable="true" @dragstart="onDragStartPanel($event, 'gate-xor', 'XOR Gate')"
              @click="addNode('gate-xor', 'XOR Gate')"
              class="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl flex flex-col items-center justify-center transition group shadow-sm">
              <svg viewBox="0 0 60 30" class="w-10 h-5 stroke-slate-800 fill-white stroke-[2]">
                <line x1="2" y1="8" x2="15" y2="8" />
                <circle cx="2" cy="8" r="2" class="fill-white stroke-slate-800" />
                <line x1="2" y1="22" x2="15" y2="22" />
                <circle cx="2" cy="22" r="2" class="fill-white stroke-slate-800" />
                <path d="M 11,4 Q 18,15 11,26" class="fill-none" />
                <path d="M 15,4 Q 28,4 38,15 Q 28,26 15,26 Q 22,15 15,4 Z" />
                <line x1="38" y1="15" x2="58" y2="15" />
                <circle cx="58" cy="15" r="2" class="fill-white stroke-slate-800" />
              </svg>
              <span class="text-[10px] font-semibold text-slate-600 mt-1">XOR Gate</span>
            </button>
          </div>
        </div>

        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Output Elements</h3>
          <div class="grid grid-cols-1 gap-2">
            <button draggable="true" @dragstart="onDragStartPanel($event, 'output-bulb', 'Bulb')"
              @click="addNode('output-bulb', 'Bulb')"
              class="p-3 bg-white hover:bg-yellow-50/80 border border-slate-200 hover:border-yellow-300 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-700 transition group shadow-sm">
              <div class="flex items-center space-x-2">
                <ZapIcon class="w-4 h-4 text-yellow-500 group-hover:scale-110 transition" />
                <span>Light Bulb</span>
              </div>
              <PlusIcon class="w-3.5 h-3.5 text-slate-400 group-hover:text-yellow-500" />
            </button>
          </div>
        </div>

        <!-- Options & Grid Settings -->
        <div class="pt-4 border-t border-slate-200 space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500">Canvas Options</h3>

          <div class="flex items-center justify-between text-xs text-slate-600">
            <span>Grid Size</span>
            <select v-model.number="gridSize" @change="onGraphChanged"
              class="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-700">
              <option :value="15">15px</option>
              <option :value="20">20px</option>
              <option :value="30">30px</option>
            </select>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-600">
            <span>Snap to Grid</span>
            <input v-model="snapToGrid" @change="onGraphChanged" type="checkbox"
              class="accent-indigo-500 w-4 h-4 rounded" />
          </div>

          <div class="pt-2 text-[11px] text-slate-500 leading-tight">
            💡 Select node or wire and press <kbd
              class="px-1 bg-slate-100 border border-slate-200 rounded font-mono text-slate-600">Delete</kbd> or hover
            gate to click <span class="text-rose-500 font-bold">✕</span> to delete.
          </div>
        </div>
      </aside>

      <!-- Main Vue Flow Canvas -->
      <main id="circuit-canvas-area" class="flex-1 relative bg-transparent">
        <VueFlow v-model:nodes="nodes" v-model:edges="edges" :snap-to-grid="snapToGrid"
          :snap-grid="[Number(gridSize), Number(gridSize)]" :delete-key-code="['Delete', 'Backspace']"
          @connect="onConnect" @node-drag-start="onNodeDragStart" @node-drag-stop="onNodeDragStop"
          @edges-change="onGraphChanged" @drop="onDrop" @dragover="onDragOver" class="w-full h-full">
          <template #node-custom="nodeProps">
            <CustomGateNode v-bind="nodeProps" @toggle-val="onToggleInput" @delete-node="deleteNode" />
          </template>

          <Background :key="gridSize" :gap="Number(gridSize)" :size="2" pattern-color="#64748b" />
          <Controls data-html2canvas-ignore="true" />
        </VueFlow>

        <div class="absolute inset-0 pointer-events-none z-50 overflow-hidden" data-html2canvas-ignore="true">
          <div v-for="(cursor, userName) in remoteCursors" :key="userName"
            class="absolute pointer-events-none flex flex-col items-start transition-all duration-150 ease-linear"
            :style="{ left: cursor.x + 'px', top: cursor.y + 'px', transform: 'translate(-2px, -2px)' }">
            <svg class="w-5 h-5 drop-shadow-md" viewBox="0 0 24 24" :fill="cursor.color || '#4361ee'" stroke="white"
              stroke-width="2" stroke-linejoin="round">
              <path
                d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.42a.5.5 0 0 0 .35-.85L5.5 3.21Z" />
            </svg>
            <span class="mt-1 ml-3 px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-md shadow-black/20"
              :style="{ backgroundColor: cursor.color || '#4361ee' }">
              {{ userName }}
            </span>
          </div>
        </div>
      </main>
    </div>


    <TruthTableModal :is-open="showTruthTable" :loading="truthTableLoading" :table-data="truthTableData"
      @close="showTruthTable = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

import CustomGateNode from '@/Components/CustomGateNode.vue';
import TruthTableModal from '@/Components/TruthTableModal.vue';
import { evaluateCircuit, generateTruthTable } from '@/Utils/LogicEngine.js';
import { PRESET_CIRCUITS } from '@/Utils/PresetCircuits.js';

import {
  ArrowLeft as ArrowLeftIcon, Cpu as CpuIcon, Users as UsersIcon, Table as TableIcon,
  Download as DownloadIcon, ToggleRight as ToggleRightIcon, Zap as ZapIcon, Plus as PlusIcon, Trash2 as Trash2Icon
} from 'lucide-vue-next';

const props = defineProps({
  room: Object,
  currentUser: Object,
  mercureUrl: String
});

function normalizeNodes(rawNodes = []) {
  return rawNodes.map(n => {
    const rawType = n.data?.gateType || n.type || 'gate-and';
    return {
      ...n,
      type: 'custom',
      data: {
        val: 0,
        outputVal: 0,
        ...n.data,
        gateType: rawType
      }
    };
  });
}

const nodes = ref(normalizeNodes(props.room.graph?.nodes || []));
const edges = ref(props.room.graph?.edges || []);
const activeUsers = ref(props.room.users ? Object.values(props.room.users) : []);
const gridSize = ref(props.room.gridSize || 20);
const snapToGrid = ref(props.room.snapToGrid ?? true);
const selectedPreset = ref('');

const { fitView, screenToFlowCoordinate } = useVueFlow();

const showTruthTable = ref(false);
const truthTableLoading = ref(false);
const truthTableData = ref({ headers: [], rows: [], inputs: [], outputs: [] });

const currentVersion = ref(props.room.version || 1);
const isDraggingNode = ref(false);
let syncTimeout = null;
let mercureEventSource = null;
let heartbeatInterval = null;

onMounted(() => {
  if ((!nodes.value || nodes.value.length === 0) && props.room.title?.includes('3-Inverter')) {
    selectedPreset.value = 'three-not-challenge';
    loadPresetCircuit();
  } else {
    nodes.value = normalizeNodes(nodes.value);
    runLogicEngine();
  }
  startMercureSubscription();

  heartbeatInterval = setInterval(() => {
    fetch(`/room/${props.room.id}/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: props.currentUser.name })
    }).catch(err => console.error('Heartbeat failed:', err));
  }, 10000);
});

onUnmounted(() => {
  sendLeaveBeacon();
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  if (mercureEventSource) {
    mercureEventSource.close();
  }
});

function sendLeaveBeacon() {
  const url = `/room/${props.room.id}/leave?userName=${encodeURIComponent(props.currentUser.name)}`;
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url);
  } else {
    fetch(url, { method: 'POST', keepalive: true });
  }
}

function runLogicEngine() {
  const result = evaluateCircuit(nodes.value, edges.value);

  // Update node values in-place so Vue Flow doesn't unmount or hide custom gate components
  result.nodes.forEach(resNode => {
    const existing = nodes.value.find(n => n.id === resNode.id);
    if (existing) {
      if (!existing.data) existing.data = {};
      existing.data.outputVal = resNode.data?.outputVal ?? 0;
      if (!existing.data.gateType) {
        existing.data.gateType = resNode.data?.gateType || resNode.type || 'gate-and';
      }
    }
  });

  edges.value = result.edges;
}

function startMercureSubscription() {
  const mercureEndpoint = props.mercureUrl || 'https://mercure-hl26.onrender.com/.well-known/mercure';
  const url = new URL(mercureEndpoint, window.location.origin);
  url.searchParams.append('topic', `room/${props.room.id}`);

  mercureEventSource = new EventSource(url);
  mercureEventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.deleted) {
        mercureEventSource.close();
        router.get('/');
        return;
      }

      if (isDraggingNode.value) return;

      if (data.users) {
        activeUsers.value = data.users;
      }

      if (data.graph && data.version > currentVersion.value) {
        currentVersion.value = data.version;
        nodes.value = normalizeNodes(data.graph.nodes);
        edges.value = data.graph.edges;
        if (data.gridSize) gridSize.value = Number(data.gridSize);
        if (data.snapToGrid !== undefined) snapToGrid.value = Boolean(data.snapToGrid);
        runLogicEngine();
      }
    } catch (err) {
      console.error('Mercure parse error:', err);
    }
  };
}

function onNodeDragStart() {
  isDraggingNode.value = true;
}

function onNodeDragStop() {
  isDraggingNode.value = false;
  onGraphChanged();
}

function onDragStartPanel(event, gateType, label) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', JSON.stringify({ gateType, label }));
    event.dataTransfer.effectAllowed = 'move';
  }
}

function onDragOver(event) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
}

function onDrop(event) {
  event.preventDefault();
  const data = event.dataTransfer?.getData('application/vueflow');
  if (!data) return;

  try {
    const { gateType, label } = JSON.parse(data);
    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    });

    addNodeAtPosition(gateType, label, position);
  } catch (err) {
    console.error('Drop parsing error', err);
  }
}

function addNodeAtPosition(gateType, label, position) {
  let finalPos = { ...position };
  if (snapToGrid.value) {
    finalPos.x = Math.round(finalPos.x / gridSize.value) * gridSize.value;
    finalPos.y = Math.round(finalPos.y / gridSize.value) * gridSize.value;
  }

  const id = `node_${Date.now()}`;
  const newNode = {
    id,
    type: 'custom',
    position: finalPos,
    data: {
      label,
      gateType,
      val: 0,
      outputVal: 0
    }
  };
  nodes.value = [...nodes.value, newNode];
  onGraphChanged();
}

function pushStateSync() {
  clearTimeout(syncTimeout);
  syncTimeout = setTimeout(async () => {
    try {
      const res = await fetch(`/room/${props.room.id}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: props.currentUser.name,
          graph: {
            nodes: nodes.value,
            edges: edges.value
          },
          options: {
            gridSize: gridSize.value,
            snapToGrid: snapToGrid.value
          }
        })
      });
      const data = await res.json();
      if (data.version) {
        currentVersion.value = data.version;
      }
    } catch (err) {
      console.error('Sync failed:', err);
    }
  }, 100);
}

function onGraphChanged() {
  runLogicEngine();
  pushStateSync();
}

function deleteNode(nodeId) {
  nodes.value = nodes.value.filter(n => n.id !== nodeId);
  edges.value = edges.value.filter(e => e.source !== nodeId && e.target !== nodeId);
  onGraphChanged();
}

function onToggleInput({ id, val }) {
  const node = nodes.value.find(n => n.id === id);
  if (node) {
    if (!node.data) node.data = {};
    node.data.val = val;
  }
  onGraphChanged();
}

function onConnect(params) {
  const newEdge = {
    id: `e_${params.source}_${params.target}_${Date.now()}`,
    source: params.source,
    target: params.target,
    sourceHandle: params.sourceHandle,
    targetHandle: params.targetHandle
  };
  edges.value = [...edges.value, newEdge];
  onGraphChanged();
}

function addNode(gateType, label) {
  const id = `node_${Date.now()}`;

  let x = 250 + Math.random() * 80;
  let y = 150 + Math.random() * 80;

  if (snapToGrid.value) {
    x = Math.round(x / gridSize.value) * gridSize.value;
    y = Math.round(y / gridSize.value) * gridSize.value;
  }

  const newNode = {
    id,
    type: 'custom',
    position: { x, y },
    data: {
      label,
      gateType,
      val: 0,
      outputVal: 0
    }
  };
  nodes.value = [...nodes.value, newNode];
  onGraphChanged();
}

function loadPresetCircuit() {
  if (!selectedPreset.value) return;
  const preset = PRESET_CIRCUITS.find(p => p.id === selectedPreset.value);
  if (preset) {
    nodes.value = normalizeNodes(preset.graph.nodes);
    edges.value = preset.graph.edges;
    onGraphChanged();
  }
}

async function confirmDeleteRoom() {
  if (confirm(`Are you sure you want to delete room "${props.room.title}"?`)) {
    try {
      await fetch(`/room/${props.room.id}`, { method: 'DELETE' });
      router.get('/');
    } catch (err) {
      console.error('Delete room error:', err);
    }
  }
}

async function openTruthTableModal() {
  showTruthTable.value = true;
  truthTableLoading.value = true;

  try {
    setTimeout(() => {
      truthTableData.value = generateTruthTable(nodes.value, edges.value);
      truthTableLoading.value = false;
    }, 50);
  } catch (err) {
    console.error('Truth table generation error:', err);
    truthTableLoading.value = false;
  }
}

async function exportCircuitPDF() {
  const element = document.getElementById('circuit-canvas-area');
  if (!element) return;

  try {
    fitView({ padding: 0.2, duration: 200 });
    await new Promise(resolve => setTimeout(resolve, 250));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#fdfbf7',
      ignoreElements: (node) => {
        return node.hasAttribute && node.hasAttribute('data-html2canvas-ignore');
      }
    });

    const dataUrl = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    const imgWidth = 280;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.setFillColor(253, 251, 247);
    pdf.rect(0, 0, 297, 210, 'F');
    pdf.addImage(dataUrl, 'PNG', 8, 20, imgWidth, imgHeight);

    pdf.setTextColor(30, 41, 59);
    pdf.setFontSize(14);
    pdf.text(`LogiSync Circuit Diagram: ${props.room.title}`, 10, 12);
    pdf.setFontSize(9);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Exported by ${props.currentUser.name} on ${new Date().toLocaleString()}`, 10, 202);

    pdf.save(`LogiSync_Circuit_${props.room.id}.pdf`);
  } catch (err) {
    console.error('PDF export failed:', err);
    alert('PDF Export Failed: ' + (err.message || err.toString()));
  }
}

function backToHome() {
  sendLeaveBeacon();
  router.get('/');
}
</script>
