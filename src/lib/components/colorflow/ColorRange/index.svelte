<script lang="ts">
  import { numberOfColorsStore } from '../../../../shared/context';

  let rangeValue = 5;

  const handleRangeInput = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    rangeValue = Number(inputElement.value);
    numberOfColorsStore.set(rangeValue);
  };
</script>

<span class="radial__label title title--normal">Nombre de couleurs</span>
<div class="radial__input title title--normal" />
<input
  type="range"
  min="2"
  max="10"
  bind:value={rangeValue}
  on:input={handleRangeInput}
/>
