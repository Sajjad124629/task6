<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
    <div class="vristo-card bg-white w-full max-w-3xl rounded-2xl p-6 border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
      <div class="flex items-center justify-between border-b border-slate-200 pb-4">
        <div class="flex items-center space-x-3">
          <div class="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <TableIcon class="w-6 h-6" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-slate-800">Truth Table Generator</h3>
            <p class="text-xs text-slate-500">Automated truth function evaluation for active circuit</p>
          </div>
        </div>
        <button @click="$emit('close')" class="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition">
          <XIcon class="w-5 h-5" />
        </button>
      </div>

      <div v-if="loading" class="py-12 flex flex-col items-center justify-center space-y-3">
        <Loader2Icon class="w-8 h-8 text-indigo-500 animate-spin" />
        <p class="text-sm text-slate-500">Computing boolean truth matrix...</p>
      </div>

      <div v-else class="flex-1 overflow-y-auto my-4 rounded-xl border border-slate-200">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 backdrop-blur">
              <th v-for="(header, idx) in tableData.headers" :key="idx" 
                  class="py-3 px-4 text-center border-r border-slate-200 last:border-0"
                  :class="isInputHeader(header) ? 'text-indigo-600 bg-indigo-50/50' : 'text-emerald-600 bg-emerald-50/50'">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rIdx) in tableData.rows" :key="rIdx" class="border-b border-slate-100 hover:bg-slate-50 transition">
              <td v-for="(val, cIdx) in row" :key="cIdx" class="py-2.5 px-4 text-center font-mono border-r border-slate-100 last:border-0">
                <span :class="val === 1 ? 'px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold' : 'px-2 py-0.5 rounded bg-slate-100 text-slate-500'">
                  {{ val }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between pt-3 border-t border-slate-200">
        <div class="text-xs text-slate-500 flex items-center space-x-3">
          <span class="inline-flex items-center"><span class="w-2 h-2 rounded-full bg-indigo-500 mr-1.5"></span> Inputs: {{ tableData.inputs ? tableData.inputs.length : 0 }}</span>
          <span class="inline-flex items-center"><span class="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span> Outputs: {{ tableData.outputs ? tableData.outputs.length : 0 }}</span>
        </div>
        <div class="flex items-center space-x-3">
          <button @click="exportCSV" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition flex items-center space-x-2">
            <DownloadIcon class="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button @click="$emit('close')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Table as TableIcon, X as XIcon, Loader2 as Loader2Icon, Download as DownloadIcon } from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
  loading: Boolean,
  tableData: {
    type: Object,
    default: () => ({ headers: [], rows: [], inputs: [], outputs: [] })
  }
});

defineEmits(['close']);

function isInputHeader(header) {
  return props.tableData.inputs?.includes(header);
}

function exportCSV() {
  if (!props.tableData.headers || props.tableData.headers.length === 0) return;
  
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += props.tableData.headers.join(",") + "\n";
  props.tableData.rows.forEach(row => {
    csvContent += row.join(",") + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `truth_table_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>
