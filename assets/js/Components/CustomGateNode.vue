<template>
  <div
    class="relative group flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none p-1">

    <button @click.stop="emitDelete" title="Delete Gate"
      class="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20">
      <XIcon class="w-3 h-3" />
    </button>

    <template v-if="isNotGate">
      <Handle type="target" position="left" id="in1" style="top: 36%; left: 0px;"
        class="!bg-white hover:!bg-rose-100 !w-3.5 !h-3.5 !border-[2.5px] !border-black shadow-sm z-10 !rounded-full" />
    </template>
    <template v-else-if="isGate || isOutput">
      <Handle type="target" position="left" id="in1" style="top: 24%; left: 0px;"
        class="!bg-white hover:!bg-rose-100 !w-3.5 !h-3.5 !border-[2.5px] !border-black shadow-sm z-10 !rounded-full" />
      <Handle type="target" position="left" id="in2" style="top: 48%; left: 0px;"
        class="!bg-white hover:!bg-rose-100 !w-3.5 !h-3.5 !border-[2.5px] !border-black shadow-sm z-10 !rounded-full" />
    </template>

    <div class="w-24 h-16 flex items-center justify-center pointer-events-none">
      <template v-if="isInput">
        <div class="pointer-events-auto flex items-center space-x-2">
          <button @click.stop="toggleInputVal"
            class="px-3 py-1.5 rounded-lg border-2 font-mono font-black text-xs transition-all shadow-md flex items-center space-x-1.5"
            :class="data.val === 1 ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-emerald-500/40' : 'bg-white border-slate-300 text-slate-700 hover:border-indigo-400'">
            <span class="w-2.5 h-2.5 rounded-full" :class="data.val === 1 ? 'bg-slate-950' : 'bg-rose-500'"></span>
            <span>{{ data.val === 1 ? 'ON (1)' : 'OFF (0)' }}</span>
          </button>
        </div>
      </template>

      <template v-else-if="isOutput">
        <div class="flex items-center space-x-2">
          <div
            class="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-lg"
            :class="data.outputVal === 1
              ? 'bg-yellow-400 border-yellow-200 text-slate-950 shadow-[0_0_20px_rgba(250,204,21,0.9)] scale-105'
              : 'bg-white border-slate-300 text-slate-300'">
            <ZapIcon class="w-5 h-5" :class="{ 'animate-pulse text-slate-950': data.outputVal === 1 }" />
          </div>
        </div>
      </template>

      <template v-else>
        <!-- AND GATE -->
        <svg v-if="gateName === 'AND'" viewBox="0 0 90 50" class="w-full h-full stroke-black fill-white stroke-[2.5]">
          <line x1="6" y1="14" x2="22" y2="14" />
          <circle cx="6" cy="14" r="3.5" class="fill-white stroke-black" />
          <line x1="6" y1="36" x2="22" y2="36" />
          <circle cx="6" cy="36" r="3.5" class="fill-white stroke-black" />
          <path d="M 22,6 L 40,6 A 19,19 0 0,1 40,44 L 22,44 Z" />
          <line x1="59" y1="25" x2="80" y2="25" />
          <circle cx="80" cy="25" r="3.5" class="fill-white stroke-black" />
        </svg>

        <!-- NAND GATE -->
        <svg v-else-if="gateName === 'NAND'" viewBox="0 0 90 50"
          class="w-full h-full stroke-black fill-white stroke-[2.5]">
          <line x1="6" y1="14" x2="22" y2="14" />
          <circle cx="6" cy="14" r="3.5" class="fill-white stroke-black" />
          <line x1="6" y1="36" x2="22" y2="36" />
          <circle cx="6" cy="36" r="3.5" class="fill-white stroke-black" />
          <path d="M 22,6 L 38,6 A 19,19 0 0,1 38,44 L 22,44 Z" />
          <circle cx="61" cy="25" r="4" class="fill-white stroke-black" />
          <line x1="65" y1="25" x2="82" y2="25" />
          <circle cx="82" cy="25" r="3.5" class="fill-white stroke-black" />
        </svg>

        <!-- OR GATE -->
        <svg v-else-if="gateName === 'OR'" viewBox="0 0 90 50"
          class="w-full h-full stroke-black fill-white stroke-[2.5]">
          <line x1="6" y1="14" x2="22" y2="14" />
          <circle cx="6" cy="14" r="3.5" class="fill-white stroke-black" />
          <line x1="6" y1="36" x2="22" y2="36" />
          <circle cx="6" cy="36" r="3.5" class="fill-white stroke-black" />
          <path d="M 20,6 Q 38,6 55,25 Q 38,44 20,44 Q 30,25 20,6 Z" />
          <line x1="55" y1="25" x2="80" y2="25" />
          <circle cx="80" cy="25" r="3.5" class="fill-white stroke-black" />
        </svg>

        <!-- NOR GATE -->
        <svg v-else-if="gateName === 'NOR'" viewBox="0 0 90 50"
          class="w-full h-full stroke-black fill-white stroke-[2.5]">
          <line x1="6" y1="14" x2="22" y2="14" />
          <circle cx="6" cy="14" r="3.5" class="fill-white stroke-black" />
          <line x1="6" y1="36" x2="22" y2="36" />
          <circle cx="6" cy="36" r="3.5" class="fill-white stroke-black" />
          <path d="M 20,6 Q 36,6 50,25 Q 36,44 20,44 Q 28,25 20,6 Z" />
          <circle cx="55" cy="25" r="4" class="fill-white stroke-black" />
          <line x1="59" y1="25" x2="82" y2="25" />
          <circle cx="82" cy="25" r="3.5" class="fill-white stroke-black" />
        </svg>

        <!-- XOR GATE -->
        <svg v-else-if="gateName === 'XOR'" viewBox="0 0 90 50"
          class="w-full h-full stroke-black fill-white stroke-[2.5]">
          <line x1="6" y1="14" x2="22" y2="14" />
          <circle cx="6" cy="14" r="3.5" class="fill-white stroke-black" />
          <line x1="6" y1="36" x2="22" y2="36" />
          <circle cx="6" cy="36" r="3.5" class="fill-white stroke-black" />
          <path d="M 16,6 Q 26,25 16,44" class="fill-none" />
          <path d="M 22,6 Q 40,6 57,25 Q 40,44 22,44 Q 32,25 22,6 Z" />
          <line x1="57" y1="25" x2="80" y2="25" />
          <circle cx="80" cy="25" r="3.5" class="fill-white stroke-black" />
        </svg>

        <!-- NOT GATE -->
        <svg v-else-if="gateName === 'NOT'" viewBox="0 0 90 50"
          class="w-full h-full stroke-black fill-white stroke-[2.5]">
          <line x1="6" y1="25" x2="22" y2="25" />
          <circle cx="6" cy="25" r="3.5" class="fill-white stroke-black" />
          <polygon points="22,6 52,25 22,44" />
          <circle cx="56" cy="25" r="4" class="fill-white stroke-black" />
          <line x1="60" y1="25" x2="80" y2="25" />
          <circle cx="80" cy="25" r="3.5" class="fill-white stroke-black" />
        </svg>
      </template>
    </div>

    <span class="text-[11px] font-semibold text-slate-700 mt-1 tracking-tight">
      {{ nodeTypeLabel }}
    </span>
    <template v-if="!isOutput">
      <Handle type="source" position="right" id="out" style="top: 36%; right: 0px;"
        class="!bg-white hover:!bg-rose-100 !w-3.5 !h-3.5 !border-[2.5px] !border-black shadow-sm z-10 !rounded-full" />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Handle } from '@vue-flow/core';
import { Zap as ZapIcon, X as XIcon } from 'lucide-vue-next';

const props = defineProps({
  id: String,
  type: String,
  selected: Boolean,
  data: {
    type: Object,
    default: () => ({ label: '', val: 0, outputVal: 0, gateType: '' })
  }
});

const emit = defineEmits(['toggle-val', 'delete-node']);

const fullType = computed(() => {
  const gt = props.data?.gateType || props.type || '';
  return gt.toLowerCase();
});

const isInput = computed(() => fullType.value.includes('input') || fullType.value.includes('switch'));
const isOutput = computed(() => fullType.value.includes('output') || fullType.value.includes('bulb') || fullType.value.includes('led'));
const isGate = computed(() => !isInput.value && !isOutput.value);
const isNotGate = computed(() => fullType.value.includes('not'));

const nodeTypeLabel = computed(() => {
  if (isInput.value) return 'Switch';
  if (isOutput.value) return 'Light Bulb';
  if (props.data?.label) return props.data.label;
  return gateName.value + ' Gate';
});

const gateName = computed(() => {
  const t = fullType.value;
  if (t.includes('nand')) return 'NAND';
  if (t.includes('nor')) return 'NOR';
  if (t.includes('xor')) return 'XOR';
  if (t.includes('and')) return 'AND';
  if (t.includes('or')) return 'OR';
  if (t.includes('not')) return 'NOT';
  return 'AND';
});

function toggleInputVal() {
  const newVal = props.data.val === 1 ? 0 : 1;
  props.data.val = newVal;
  emit('toggle-val', { id: props.id, val: newVal });
}

function emitDelete() {
  emit('delete-node', props.id);
}
</script>
