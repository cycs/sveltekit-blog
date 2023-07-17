import { writable } from 'svelte/store';

let rangeValue = 5;
export const numberOfColorsContext = writable<number>(rangeValue);
