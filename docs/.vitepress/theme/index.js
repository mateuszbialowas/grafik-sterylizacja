import DefaultTheme from 'vitepress/theme'
import './custom.css'
import { onMounted } from 'vue'

export default {
  extends: DefaultTheme,
  setup() {
    onMounted(() => {
      document.querySelectorAll('a[href$="grafik-sterylizacja.html"]').forEach((el) => {
        el.setAttribute('download', 'grafik-sterylizacja.html')
      })
    })
  },
}
