<script lang="ts">
  import { numberOfColorsStore } from '../../../../shared/context';

  // import { onMount } from 'svelte';
  // import { onMount, setContext } from 'svelte';

  let rangeValue = 5;
  // const message = writable<number>(rangeValue);

  const handleRangeInput = (event: Event) => {
    console.log(event);

    const inputElement = event.target as HTMLInputElement;
    rangeValue = Number(inputElement.value);
    // setContext<number>('numberOfColors', rangeValue);
    // $message = Number(inputElement.value);
    numberOfColorsStore.set(rangeValue);
  };
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
<!-- <p>Range value: {rangeValue}</p> -->
<!-- </div> -->
