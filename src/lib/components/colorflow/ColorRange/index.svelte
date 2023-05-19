<script lang="ts">
  // import { onMount } from 'svelte';
  import { setContext } from 'svelte';
  let rangeValue = 5;
  import { writable } from 'svelte/store';

  const message = writable<number>(rangeValue);

  const handleRangeInput = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    rangeValue = Number(inputElement.value);
    // setContext<number>('numberOfColors', rangeValue);
    // $message = Number(inputElement.value);
    message.set(rangeValue);
  };

  // onMount(() => {
  // setContext<number>('numberOfColors', rangeValue);
  // });
  // const messageContext = createContext();
  // setContext(messageContext, 'Hello from Context');
</script>

<span class="radial__label title title--normal">Nombre de couleurs</span>
<div class="radial__input title title--normal" />
<!-- <div class="circle circle--invert"> -->
<!-- <div class="radial__button" /> -->
<input
  type="range"
  min="2"
  max="10"
  bind:value={rangeValue}
  on:input={handleRangeInput}
/>
<p>Range value: {rangeValue}</p>
<!-- </div> -->
