import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import { Router } from 'vue-router';
import { watch } from 'vue';
import packageInfo from '../../package.json'

/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
 */
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  const pinia = createPinia()

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)
  const name = `${packageInfo.name}.${packageInfo.version}`
  const piniaState = localStorage.getItem(name)

  for (let i = 0, len = localStorage.length; i < len; i++) {
    if (localStorage.key(i) != name) {
      localStorage.removeItem(localStorage.key(i) as string)
    }
  }
  if (piniaState) {
    pinia.state.value = JSON.parse(piniaState)
  }
  watch(
    pinia.state,
    (state) => {
      localStorage.setItem(name, JSON.stringify(state))
    },
    { deep: true }
  )

  return pinia

})
