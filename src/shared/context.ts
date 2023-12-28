import { onDestroy, setContext } from 'svelte';
import { writable } from 'svelte/store';

let rangeValue = 5;

export const numberOfColorsStore = writable<number>(rangeValue);

export let isColorFlowDrawerOpenStore = writable(false);

// setContext('isColorFlowDrawerOpen', isColorFlowDrawerOpen);

// export const openColorFlowDrawer = () => {
//   $isColorFlowDrawerOpen = true;
// };

isColorFlowDrawerOpenStore.subscribe((v) => {
  console.log({ v });
  return v;
});

numberOfColorsStore.subscribe((v) => v);

// onDestroy(unsubscribe);

export function toggleColorFlowDrawer(isOpen: boolean) {
  isColorFlowDrawerOpenStore.set(isOpen);
}
