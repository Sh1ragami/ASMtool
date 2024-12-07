<template>
  <div class="Home">
    <v-container fluid >
      <v-row>
        <v-col cols="12">
          <v-row v-resize="onResize" :style="style" >
            <v-col cols="6" v-for="menu in menus" v-bind:key="menu.key">
              <v-btn
                color="accent"
                block
                height='100%'
              >
                <v-icon :size="iconSize">{{menu.icon}}</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>

  export default {
    name: 'Home',
    data: () => ({
      menus: [
        { title: 'home', icon: 'mdi-home' },
        { title: 'currency', icon: 'mdi-currency-cny' },
        { title: 'gift', icon: 'mdi-gift' },
        { title: 'kaji', icon: 'mdi-washing-machine'},
      ],
      windowSize: {
        x: 0,
        y: 0,
      },
      iconSize: 0 
    }),

    mounted () {
      this.onResize()
    },

    computed: {
      style () {
        return 'height: ' + this.windowSize.y * 0.8 + 'px;'
      }
    },

    methods: {
      onResize () {
        this.windowSize = { x: window.innerWidth, y: window.innerHeight }
        this.iconSize = window.innerHeight * 0.1
      },
    },
    components: {
    },
  }
</script>
