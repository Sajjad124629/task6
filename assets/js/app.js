import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import '../styles/app.css';

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.vue', { eager: true });
    const match = pages[`./Pages/${name}.vue`] 
               || pages[`./Pages/${name}/Index.vue`]
               || pages[`./Pages/${name}`];

    if (!match) {
      console.error(`Inertia page component "${name}" not found in assets/js/Pages.`);
      throw new Error(`Page component "${name}" not found.`);
    }

    return match.default || match;
  },
  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .mount(el);
  },
});
