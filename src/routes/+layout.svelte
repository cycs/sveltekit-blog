<script>
  import Footer from '$components/footer.svelte';
  import Navbar from '$components/navbar.svelte';
  import { onMount } from 'svelte';
  import { themeChange } from 'theme-change';
  import '../app.css';

  onMount(async () => {
    themeChange(false);
  });
</script>

<Navbar />
<main class="container relative">
  <slot />
</main>
<Footer />
