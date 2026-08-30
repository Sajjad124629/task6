<template>
  <div class="min-h-screen bg-transparent text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
    <header class="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <CpuIcon class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-700 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              LogiSync
            </h1>
            <p class="text-xs text-slate-500 font-medium">Real-Time Multi-User Logic Circuit Lab</p>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <button @click="showCreateModal = true" class="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2">
            <PlusIcon class="w-4 h-4" />
            <span>Create New Room</span>
          </button>
        </div>
      </div>
    </header>

    <main class="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-10">
      <section class="vristo-card rounded-3xl p-8 border border-slate-200 relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div class="max-w-2xl space-y-4">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <UserCheckIcon class="w-3.5 h-3.5" />
            <span>Visual Identifier Setup</span>
          </div>

          <h2 class="text-3xl font-extrabold text-slate-800 tracking-tight">
            Collaborate remotely without passwords
          </h2>
          <p class="text-slate-600 text-sm leading-relaxed">
            Enter your display name below. If multiple users choose the same name (e.g. <span class="text-indigo-600 font-mono font-bold">John</span>), LogiSync automatically appends numerical indicators (<span class="text-emerald-600 font-mono font-bold">John 2</span>, <span class="text-emerald-600 font-mono font-bold">John 3</span>) in real-time sessions.
          </p>

          <div class="flex items-center space-x-3 pt-2">
            <div class="relative flex-1 max-w-sm">
              <UserIcon class="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input v-model.trim="userName" type="text" placeholder="Enter your display name (e.g., John)"
                     class="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
            </div>
            <div class="px-4 py-3 bg-slate-50 rounded-2xl text-xs text-slate-700 font-mono border border-slate-200 flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Identifier: <strong>{{ userName }}</strong></span>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-slate-800">Active Circuit Rooms</h3>
            <p class="text-xs text-slate-500">Select a room to join remote collaborators live</p>
          </div>

          <span class="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {{ activeRooms.length }} Active Session{{ activeRooms.length === 1 ? '' : 's' }}
          </span>
        </div>

        <div v-if="activeRooms.length === 0" class="col-span-full py-16 text-center bg-white/50 rounded-3xl border border-slate-200">
          <CpuIcon class="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 class="text-slate-700 font-bold mb-2">No Active Circuits</h3>
          <p class="text-sm text-slate-500 mb-6">Create a new logic lab to start designing circuits.</p>
          <button @click="showCreateModal = true" class="cursor-pointer px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition">
            Create Your First Room
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="room in activeRooms" :key="room.id" class="vristo-card vristo-card-hover rounded-2xl p-6 flex flex-col justify-between space-y-5">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-mono font-bold">
                  Grid: {{ room.gridSize }}px
                </span>
                <span class="flex items-center space-x-1.5 text-xs text-emerald-600 font-medium">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{{ room.userCount }} User{{ room.userCount === 1 ? '' : 's' }} Online</span>
                </span>
              </div>

              <h4 class="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition">{{ room.title }}</h4>
              <p class="text-xs text-slate-500 line-clamp-2">{{ room.description || 'Collaborative logic workspace.' }}</p>
            </div>

            <div v-if="room.activeUsers && room.activeUsers.length" class="flex items-center space-x-1 overflow-hidden py-1">
              <div v-for="(user, uIdx) in room.activeUsers.slice(0, 4)" :key="uIdx" 
                   class="w-7 h-7 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white uppercase shadow"
                   :title="user">
                {{ user.charAt(0) }}
              </div>
              <span v-if="room.activeUsers.length > 4" class="text-xs text-slate-500 font-mono ml-1">+{{ room.activeUsers.length - 4 }}</span>
            </div>

            <div class="flex items-center space-x-2">
              <button @click="joinRoom(room.id)" class="flex-1 py-2.5 bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2">
                <span>Connect to Room</span>
                <ArrowRightIcon class="w-4 h-4" />
              </button>
              <button @click.stop="deleteRoom(room.id, room.title)" class="p-2.5 bg-slate-100 hover:bg-rose-600 text-slate-500 hover:text-white rounded-xl transition" title="Delete Room">
                <Trash2Icon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div class="vristo-card bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-6">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="text-lg font-bold text-slate-800">Create New Circuit Room</h3>
          <button @click="showCreateModal = false" class="text-slate-400 hover:text-slate-700">
            <XIcon class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleCreateRoom" class="space-y-4">
          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-600">Room Title</label>
            <input v-model="newRoomTitle" type="text" placeholder="e.g., Logic Design Team A" required
                   class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-600">Grid Size (px)</label>
            <select v-model="newRoomGridSize" class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              <option :value="15">15px (Fine Grid)</option>
              <option :value="20">20px (Standard)</option>
              <option :value="30">30px (Wide)</option>
            </select>
          </div>

          <div class="pt-4 flex items-center space-x-3">
            <button type="button" @click="showCreateModal = false" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition">
              Cancel
            </button>
            <button type="submit" class="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition">
              Create & Join
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { router } from '@inertiajs/vue3';
import { Cpu as CpuIcon, Plus as PlusIcon, UserCheck as UserCheckIcon, User as UserIcon, ArrowRight as ArrowRightIcon, ExternalLink as ExternalLinkIcon, X as XIcon, Trash2 as Trash2Icon } from 'lucide-vue-next';

const props = defineProps({
  rooms: {
    type: Array,
    default: () => []
  },
  mercureUrl: {
    type: String,
    default: 'http://127.0.0.1:3000/.well-known/mercure'
  },
  defaultUserName: {
    type: String,
    default: 'John'
  }
});

const userName = ref(props.defaultUserName || 'John');
const showCreateModal = ref(false);
const newRoomTitle = ref('');
const newRoomGridSize = ref(20);
const clientToken = ref('');

onMounted(() => {
  let token = sessionStorage.getItem('logisync_client_token');
  if (!token) {
    token = 'token_' + Math.random().toString(36).substring(2, 10);
    sessionStorage.setItem('logisync_client_token', token);
  }
  clientToken.value = token;

  const url = new URL(props.mercureUrl);
  url.searchParams.append('topic', 'room/rooms_list');
  
  const eventSource = new EventSource(url);
  window.landingEventSource = eventSource; 
  
  eventSource.onopen = () => console.log('Mercure connected to room/rooms_list');
  eventSource.onerror = (e) => console.error('Mercure EventSource Error:', e);
  
  eventSource.onmessage = (event) => {
    try {
      console.log('Received Mercure Rooms Update:', event.data);
      const data = JSON.parse(event.data);
      if (data.rooms) {
        activeRooms.value = data.rooms;
        console.log('Updated activeRooms length:', activeRooms.value.length);
      }
    } catch (e) {
      console.error('Error parsing Mercure data:', e);
    }
  };
});

const activeRooms = ref(props.rooms);

function joinRoom(roomId) {
  const name = userName.value.trim() || 'John';
  router.get(`/room/${roomId}`, { userName: name, token: clientToken.value });
}

function handleCreateRoom() {
  const name = userName.value.trim() || 'John';
  router.post('/room/create', {
    title: newRoomTitle.value,
    gridSize: newRoomGridSize.value,
    userName: name,
    token: clientToken.value
  });
}

async function deleteRoom(roomId, title) {
  if (confirm(`Are you sure you want to delete room "${title}"?`)) {
    try {
      await fetch(`/room/${roomId}`, { method: 'DELETE' });
      router.reload();
    } catch (err) {
      console.error('Failed to delete room:', err);
    }
  }
}
</script>
