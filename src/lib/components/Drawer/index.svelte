<script lang="ts">
  import { portal } from 'svelte-portal';
  import { get } from 'svelte/store';
  import {
    isColorFlowDrawerOpenStore,
    toggleColorFlowDrawer,
  } from '../../../shared/context';

  export let target: string | HTMLElement | undefined = 'body';
</script>

<div
  use:portal={target || 'body'}
  class="portal-container"
  style="--translateX:{$isColorFlowDrawerOpenStore ? 0 : '-100%'};"
>
  <div on:click={() => toggleColorFlowDrawer(false)}>x</div>
  <slot>Empty drawer</slot>
</div>

<style>
  .portal-container {
    height: 100%;
    width: 260px;
    background: white;
    box-shadow: #00000078 0px 0px 6px 1px;
    display: flex;
    position: fixed;
    left: 0;
    top: 0;
    transform: translateX(var(--translateX));
    z-index: 10;
    transition: ease-in 0.23s;
  }
</style>
