<script lang="ts">
  import type { IconType } from '../../assets/icons';
  import { icons } from '../../assets/icons';

  export let type: IconType;
  export let width = 16;
  export let height = 16;

  const getImagePath = (type: IconType) => icons[type];
</script>

<img {width} {height} src={getImagePath(type)} alt={type} />
