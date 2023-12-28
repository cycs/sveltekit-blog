<script lang="ts">
  import defaultImage from '../../../assets/img/img_init.jpg';

  import { onMount } from 'svelte';
  import { getAllColors } from '../../../lib/components/colorflow/helpers/getAllColors';
  import ColorRange from '$components/colorflow/ColorRange/index.svelte';
  import Drawer from '$components/Drawer/index.svelte';
  import { browser } from '$app/environment';

  import {
    numberOfColorsStore,
    toggleColorFlowDrawer,
  } from '../../../shared/context';

  let firstVisit = true;
  let img = browser ? new Image() : null;
  let fileinput: HTMLInputElement;
  let sourceBuffer8: Uint8ClampedArray = new Uint8ClampedArray();
  let sourceBuffer32: Int32Array = new Int32Array();

  const onFileSelected = (e: Event) => {
    const inputElement = e.target as HTMLInputElement;

    let files = inputElement.files || [];
    const file = files[0];

    const reader = new FileReader();

    if (!file) return;
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      if (e.target?.readyState == FileReader.DONE) {
        firstVisit = false;

        if (img) {
          img.src = typeof e.target.result === 'string' ? e.target.result : '';
        }
      }
    };
  };

  const drawImage = (numberOfColorsStore: number) => {
    let canvas: HTMLCanvasElement | undefined = undefined;
    let canvas2: HTMLCanvasElement | undefined = undefined;
    let canvas3: HTMLCanvasElement | undefined = undefined;

    if (browser) {
      canvas = document.getElementById('canvas') as HTMLCanvasElement;
      canvas2 = document.getElementById('canvas2') as HTMLCanvasElement;
      canvas3 = document.getElementById('canvas3') as HTMLCanvasElement;
    }

    let data: ImageData;

    if (!canvas || !canvas3) {
      return null;
    }
    const ctx = canvas.getContext('2d');
    const ctx3 = canvas3.getContext('2d');
    if (img) {
      if (!img.src) {
        img.src = defaultImage;
      }
      img.onload = () => {
        let largest = 600;

        let largestSmall = 100,
          highest = 400;

        if (img && canvas && canvas2 && canvas3) {
          if (img.width > img.height) {
            if (img.height > highest && img.width < largest) {
              const widthCanvas = img.width / (img.height / highest);
              canvas.width = canvas2.width = widthCanvas;
              canvas.height = canvas2.height = highest;
            } else {
              const heightCanvas = img.height / (img.width / largest);
              canvas.width = canvas2.width = largest;
              canvas.height = canvas2.height = heightCanvas;

              if (heightCanvas > 400) {
                const widthCanvas = img.width / (img.height / 300);
                canvas.width = canvas2.width = widthCanvas;
                canvas.height = canvas2.height = 300;
              }
            }

            const heightCanvas3 = img.height / (img.width / largestSmall);
            canvas3.width = largestSmall;
            canvas3.height = heightCanvas3;
          } else {
            const widthCanvas = img.width / (img.height / highest);
            canvas.width = canvas2.width = widthCanvas;
            canvas.height = canvas2.height = highest;

            const widthCanvas3 = img.width / (img.height / largestSmall);
            canvas3.width = widthCanvas3;
            canvas3.height = largestSmall;

            // When the image is narrow and very high, resize to a normal ratio
            let ratioSuperH = img.height / (img.width / 600);
            let incH = 20;
            while (ratioSuperH > highest) {
              ratioSuperH = img.height / (img.width / (600 - incH));
              incH += 100;
            }
            canvas.width = canvas2.width =
              img.width / (img.height / ratioSuperH);
            canvas.height = canvas2.height = ratioSuperH;
          }

          if (ctx) {
            ctx.drawImage(
              img,
              0,
              0,
              img.width,
              img.height,
              0,
              0,
              canvas.width,
              canvas.height,
            );

            data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          }

          /* smaller size canvas */
          if (ctx3) {
            ctx3.drawImage(
              img,
              0,
              0,
              img.width,
              img.height,
              0,
              0,
              canvas3.width,
              canvas3.height,
            );
            data = ctx3.getImageData(0, 0, canvas3.width, canvas3.height);
          }
        }

        /* using a new typed object is faster */
        // const sourceBuffer8 = new Uint8ClampedArray(data.data.buffer);
        // const sourceBuffer32 = new Int32Array(data.data.buffer);

        sourceBuffer8 = new Uint8ClampedArray(data.data.buffer);
        sourceBuffer32 = new Int32Array(data.data.buffer);

        getAllColors({
          splits: numberOfColorsStore,
          sourceBuffer8,
          sourceBuffer32,
        });
      };
    }
  };

  // getAllColors({
  //   splits: numberOfColorsStore,
  //   sourceBuffer8,
  //   sourceBuffer32,
  // });

  $: drawImage($numberOfColorsStore);
  $: getAllColors({
    splits: $numberOfColorsStore,
    sourceBuffer8,
    sourceBuffer32,
  });

  onMount(() => {
    drawImage($numberOfColorsStore);
  });
</script>

<!-- <header class="header">
  <h1 class="header__logo title title--main">
    <a href="index.html"
      >Colorflow
      <Icon type="colorflowXS" />
    </a>
  </h1>
  <nav class="header__nav">
    <ul>
      <li class="title title--normal title--bold">
        <a href="./a-propos/">&Agrave; propos</a>
      </li>
      <li class="title title--normal title--bold">
        <a href="./case-study/index.html">Case study</a>
      </li>
      <li class="egg title title--tiny title--bold">
        <p class="egg__title">Kolodex &nbsp;: &nbsp;</p>
        <span class="egg__count" data-count="0">0</span>
      </li>
    </ul>
  </nav>
  <ul class="header__social">
    <li class="icon">
      <a class="icon__el icon--github" href="">Github</a>
    </li>
    <li class="icon">
      <a class="icon__el icon--help" href="#">help</a>
    </li>
  </ul>
</header> -->
<Drawer>
  <section class="codes">
    <button class="codes__close">fermer</button>
    <ul class="codes__list title title--normal">
      <li class="code code__hex">
        <span class="code__name">HEX</span>
        <span class="code__color" />
      </li>
      <li class="code code__rgb">
        <span class="code__name">RGB</span>
        <span class="code__color" />
      </li>
      <li class="code code__lab">
        <span class="code__name">LAB</span>
        <span class="code__color" />
      </li>
      <li class="code code__cmjn">
        <span class="code__name">CMJN</span>
        <span class="code__color" />
      </li>
      <li class="code code__hsv">
        <span class="code__name">HSV</span>
        <span class="code__color" />
      </li>
      <li class="code code__hsl">
        <span class="code__name">HSL</span>
        <span class="code__color" />
      </li>
    </ul>
  </section>
</Drawer>
<section class="settings">
  <h2 class="hide">Paramètres</h2>
  <div class="canvas__container">
    <div class="canvas">
      <!-- <div class="description"> -->
      <!-- <p class="title title--up title--bold">
          Crée une palette de couleurs à partir de tes photos.
        </p> -->
      <!-- </div> -->
      <canvas id="canvas" class="canvas__main" />
      <canvas id="canvas2" class="canvas__drawon" />
      <canvas id="canvas3" class="canvas__quality" />

      <div
        class="upload"
        on:click={() => {
          fileinput.click();
        }}
      >
        <input
          class="upload__image"
          type="file"
          name="pic"
          style="display:none"
          accept=".jpg, .jpeg, .png"
          on:change={(e) => onFileSelected(e)}
          bind:this={fileinput}
        />
      </div>
    </div>
  </div>
  <ul class="controls">
    <li class="tg-list-item" />
    <li class="radial radial__colors">
      <ColorRange />
    </li>
  </ul>
</section>
<section class="palette">
  <h2 class="hide">Palette</h2>
  <button on:click={() => toggleColorFlowDrawer(true)}>codes</button>
  <ul class="colors title title--normal" />
</section>

<section class="help">
  <h2 class="help__title">F.A.Q</h2>
  <div class="help__question col col--center">
    <h3 class="question__title title title--small">
      &Agrave; quoi sert le bouton de précision ?
    </h3>
    <p class="answer">
      L'image originale est redessinée sur un élément de type canvas. le calcul
      est effectué sur un petit canvas afin de diminuer le nombre de pixels,
      mais la qualité du rendu sera moindre. En activant la haute précision, le
      canvas a une taille limitant la perte de rendu.
    </p>
  </div>
  <div class="help__question col col--center">
    <h3 class="question__title title title--small">
      &Agrave; quoi correspondent les pourcentages ?
    </h3>
    <p class="answer">
      Lors du calcul de la palette, tous les pixels sont mélangés et divisés en
      paquets. Si vous avez choisi d'afficher 10 couleurs, alors il y aura 10
      paquets. Chaque paquet est ensuite réduit à une seule valeur qui sera la
      couleur affichée, mais garde sa proportion par rapport à l'ensemble des
      pixels.
    </p>
  </div>
  <div class="help__question col col--center">
    <h3 class="question__title title title--small">
      D'où viennent les noms de couleurs ?
    </h3>
    <p class="answer">
      La liste vient de <a
        class="link"
        href="https://en.wikipedia.org/wiki/Lists_of_colors">Wikipedia</a
      >. Il y a 1&nbsp;703 couleurs.
    </p>
  </div>
  <div class="help__question col col--center">
    <h3 class="question__title title title--small">
      Pourquoi certains noms de couleur reviennent plusieurs fois ?
    </h3>
    <p class="answer">
      Il existe 16 &nbsp;581 &nbsp;375 couleurs possibles, mais seuls 1703 noms
      sont disponibles. Il y a donc en moyenne un nom pour mille couleurs.
    </p>
  </div>
  <div class="help__question col col--center">
    <h3 class="question__title title title--small">
      Peut-on se fier au nom de couleur affiché ?
    </h3>
    <p class="answer">
      Les couleurs sont comparées par rapport à leur valeur HSL grâce au calcul
      du <a
        class="link"
        href="https://en.wikipedia.org/wiki/Color_difference#CIE94">delta E94</a
      >, qui se rapproche le plus de la perception humaine. Le delta E2000 est
      plus précis, mais beaucoup plus complexe, il n'a dès lors pas été utilisé.
    </p>
  </div>
  <div class="help__question col col--center">
    <h3 class="question__title title title--small">
      Qu'est-ce que le Kolodex ?
    </h3>
    <p class="answer">Il y a 1&nbsp;703 couleurs, attrapez-les toutes&nbsp;!</p>
  </div>
  <button class="help__close">fermer</button>
</section>
<div class="overlay" />
<div class="cookies">
  <p class="cookies__text">
    En parcourant ce site, vous acceptez l’utilisation des cookies.
  </p>
  <button class="cookies__button">OK</button>
</div>
<div class="containerColor" />
