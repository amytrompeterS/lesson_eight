import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#4ade80',
          secondary: '#38bdf8',
          background: '#07111f',
          surface: '#0f172a',
          'surface-variant': '#1e293b',
        },
      },
    },
  },
})
