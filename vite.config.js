import reactRefresh from '@vitejs/plugin-react-refresh'

/**
 * https://vitejs.dev/config/
 * @type { import('vite').UserConfig }
 */
export default {
  plugins: [reactRefresh()],
  server: {
    host: 'localhost',
    port: 3000,
    hmr: {
      host: 'localhost',
      port: 80,
    },
    open: true
  }
}
