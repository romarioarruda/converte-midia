<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-toolbar-title>Conversor de imagens</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-form>
          <v-file-input
            label="Escolha um formato de imagens" accept="image/*" outlined multiple chips
            append-icon="mdi-send" v-model="files"
            @click:append="processImages"/>
        </v-form>

        <div class="area-progress">
          <v-progress-circular
          v-if="showProgress"
          :rotate="360"
          :size="90"
          :width="15"
          :value="progress"
          color="teal"
          >
            <span>{{ progress }}%</span>
          </v-progress-circular>
          <span v-if="showProgress && progress !== 100">Processando...
            <v-progress-circular
              :width="3"
              size="20"
              color="green"
              indeterminate
            ></v-progress-circular>
          </span>
          <span v-else-if="progress === 100">Concluído</span>
        </div>

        <span v-if="responseBackend" v-html="responseBackend"></span>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'App',

  data () {
    return {
      files: [],
      responseBackend: '',
      progress: 0,
      showProgress: false
    }
  },

  methods: {
    processImages () {
      this.showProgress = true
      const paths = this.files.map(f => f.path)
      const total = paths.length
      let cont = 0

      ipcRenderer.send('converteImages', paths)
      ipcRenderer.on('converteImages', (event, resp) => {
        cont++
        if (this.responseBackend) {
          this.responseBackend += `${resp}<br>`
        } else {
          this.responseBackend = `${resp}<br>`
        }
        this.progress = Math.round(cont / total * 100)
      })
    },

    resetValues () {
      this.progress = 0
      this.responseBackend = ''
      this.showProgress = false
    }
  },

  watch: {
    files () {
      if (this.files.length) {
        this.resetValues()
      }
    },

    progress () {
      if (this.progress === 100) {
        this.files = []
      }
    }
  }
}
</script>
<style scoped>
.area-progress {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-bottom: 20px;
}
</style>