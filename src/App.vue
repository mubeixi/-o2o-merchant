<template>
	<div id="app">
		<!--全局的资源管理器-->
		<wzw-finder :show="finderDialogInstance.visible"></wzw-finder>
		<router-view />
	</div>
</template>
<script lang="ts">
import {getCommonConfig} from './common/fetch'
import {Component, Vue} from 'vue-property-decorator'
import {Action, State} from 'vuex-class'
import WzwFinder from './components/editor/WzwFinder'
import {FUNFinder} from "./components/editor/FUNFinder"

@Component({
  components: {
    WzwFinder
  }
})

export default class App extends Vue {

  @State('finderDialogInstance') finderDialogInstance

  @Action setInitData
  @State initData

  created() {
    getCommonConfig().then(res => {
      this.setInitData(res.data)
    })
    window.FUNFinder = FUNFinder
  }
}

</script>

<style lang="scss">
	@import "assets/css/style.scss";
	@import "assets/css/app.scss";
</style>
