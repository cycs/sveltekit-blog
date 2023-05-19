<script lang="ts">
  import defaultImage from '../../../assets/img/img_init.jpg';

  // import { siteMetadataStore } from '$stores/site-metadata.ts'
  import { getContext, onMount } from 'svelte';
  import { getAllColors } from '../../../lib/components/colorflow/helpers/getAllColors';
  import ColorRange from '$components/colorflow/ColorRange/index.svelte';
  import { get } from 'svelte/store';

  // const message = getContext<number>('numberOfColors');

  let currentMessage;

  const splits = getContext<number>('numberOfColors');
  let message = getContext<number>('numberOfColors');

  message.subscribe((value) => {
    currentValue = value;
    console.log('Current Value:', currentValue);
  });
  console.log(message);
  $: {
    // const splitxs = getContext<number>('numberOfColors');
    // currentMessage = get(message);

    console.log('Current Message:', message);
  }

  onMount(() => {
    // currentMessage = get(message);
    // const fileInput = document.querySelector(
    //   '.upload__image',
    // ) as HTMLInputElement;
    const uploadButton = document.querySelector('.upload') as HTMLDivElement;

    const upload = document.querySelector('.upload__image') as HTMLInputElement;

    console.log(upload);
    // upload?.addEventListener('change', (e) => {
    //   console.log('CLICK');
    // });
    if (!upload) {
      return;
    }
    uploadButton.addEventListener('click', () => upload.click());
    console.log('CHANGE');
    upload.addEventListener('change', (e) => {
      const uploadOverlay = document.querySelector('.upload');
      const inputElement = e.target as HTMLInputElement;

      let files = inputElement.files || [];
      const file = files[0];

      const reader = new FileReader();
      console.log('CLICK', reader);

      if (!file) return;
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        if (e.target?.readyState == FileReader.DONE) {
          firstVisit = false;
          uploadOverlay?.classList.add('upload--hidden');
          uploadButton?.classList.add('upload__icon--topcorner');

          img.src = typeof e.target.result === 'string' ? e.target.result : '';
        }
      };
    });

    let canvas = document.getElementById('canvas') as HTMLCanvasElement,
      canvas2 = document.getElementById('canvas2') as HTMLCanvasElement,
      canvas3 = document.getElementById('canvas3') as HTMLCanvasElement;
    let data: ImageData;

    if (!canvas) {
      return null;
    }
    // upload = document.querySelector('.upload__image'),
    // getColorsButton = document.querySelector('.getcolors'),
    const ctx = canvas.getContext('2d');
    // const ctx2 = canvas2.getContext('2d');
    const ctx3 = canvas3.getContext('2d');

    let img = new Image();
    let firstVisit = true;

    img.onload = () => {
      if (!firstVisit) {
        document?.querySelector('.description')?.classList.add('hide');
      }

      let largest = 600;

      let checked =
        document.querySelector('.tgl[type="checkbox"]:checked') === null
          ? false
          : true;
      let largestSmall = 100,
        highest = 400;

      if (checked) largestSmall = 800;

      if (img.width > img.height) {
        if (img.height > highest && img.width < largest) {
          var widthCanvas = img.width / (img.height / highest);
          canvas.width = canvas2.width = widthCanvas;
          canvas.height = canvas2.height = highest;
        } else {
          var heightCanvas = img.height / (img.width / largest);
          canvas.width = canvas2.width = largest;
          canvas.height = canvas2.height = heightCanvas;

          if (heightCanvas > 400) {
            var widthCanvas = img.width / (img.height / 300);
            canvas.width = canvas2.width = widthCanvas;
            canvas.height = canvas2.height = 300;
          }
        }

        var heightCanvas3 = img.height / (img.width / largestSmall);
        canvas3.width = largestSmall;
        canvas3.height = heightCanvas3;
      } else {
        var widthCanvas = img.width / (img.height / highest);
        canvas.width = canvas2.width = widthCanvas;
        canvas.height = canvas2.height = highest;

        var widthCanvas3 = img.width / (img.height / largestSmall);
        canvas3.width = widthCanvas3;
        canvas3.height = largestSmall;

        // When the image is narrow and very high, resize to a normal ratio
        let ratioSuperH = img.height / (img.width / 600);
        let incH = 20;
        while (ratioSuperH > highest) {
          ratioSuperH = img.height / (img.width / (600 - incH));
          incH += 100;
        }
        canvas.width = canvas2.width = img.width / (img.height / ratioSuperH);
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

      /* using a new typed object is faster */
      const sourceBuffer8 = new Uint8ClampedArray(data.data.buffer);
      const sourceBuffer32 = new Int32Array(data.data.buffer);

      getAllColors(splits, sourceBuffer8, sourceBuffer32);

      // if (init) {
      //   init = !init;
      // }

      /* change the numbers of colors */
      // let radial = document.querySelector('.radial__colors .radial__input');
      // let radialCircle = document.querySelector('.radial__colors .circle');
      // radialKey = radial?.dataset?.key,
      // let isDragging = false;

      // if (radialCircle) {
      //   radialCircle.addEventListener('mousedown', () => (isDragging = true));
      //   radialCircle.addEventListener('touchstart', () => (isDragging = true), {
      //     passive: true,
      //   });
      // }

      // document.addEventListener('touchend', () => {
      //   /* recalculate on change (numbers of colors) */
      //   if (isDragging) {
      //     let dataBuffer = ctx3?.getImageData(
      //       0,
      //       0,
      //       canvas3.width,
      //       canvas3.height,
      //     );
      //     let sourceBuffer8 = new Uint8ClampedArray(
      //       dataBuffer?.data.buffer as ArrayBuffer,
      //     );
      //     let sourceBuffer32 = new Int32Array(
      //       dataBuffer?.data.buffer as ArrayBuffer,
      //     );

      //     getAllColors(sourceBuffer8, sourceBuffer32);
      //   }
      //   isDragging = false;
      // });
      // document.addEventListener('mouseup', function () {
      //   // recalculate on change (numbers of colors)
      //   if (isDragging) {
      //     let data = ctx3?.getImageData(0, 0, canvas3.width, canvas3.height);
      //     let sourceBuffer8 = new Uint8ClampedArray(
      //       data?.data.buffer as ArrayBuffer,
      //     );
      //     let sourceBuffer32 = new Int32Array(data?.data.buffer as ArrayBuffer);

      //     getAllColors(sourceBuffer8, sourceBuffer32);
      //   }
      //   isDragging = false;

      //   /* recalculate on draw */
      //   if (d.isDrawing) return;
      //   var clippedRect = d.getClipRect();

      //   if (Object.keys(clippedRect).length < 4 || !clippedRect) return;

      //   if (clippedRect.w) {
      //     let data = ctx.getImageData(
      //       clippedRect.startXRatio,
      //       clippedRect.startYRatio,
      //       clippedRect.widthRatio,
      //       clippedRect.heightRatio,
      //     );

      //     let sourceBuffer8 = new Uint8ClampedArray(data.data.buffer);
      //     let sourceBuffer32 = new Int32Array(data.data.buffer);

      //     getAllColors(sourceBuffer8, sourceBuffer32);

      //     Object.keys(d.rect).forEach((k) => delete d.rect[k]); // Reset rectangle to avoid multiple draws on click
      //   }
      // });
    };

    var initialize = function () {
      // init = true;
      img.src = defaultImage;
    };

    // const overlay = document.querySelector('.codes__close');
    // var hideOverlay = function () {
    //   document.body.classList.remove('codes--active');
    // };
    // overlay.addEventListener('touch', hideOverlay);
    // overlay.addEventListener('click', hideOverlay);

    initialize();

    console.log({ canvas, canvas2, canvas3 });
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
<section class="settings clearfix">
  <h2 class="hide">Paramètres</h2>
  <div class="canvas__container">
    <div class="canvas">
      <div class="description">
        <p class="title title--up title--bold">
          Crée une palette de couleurs à partir de tes photos.
        </p>
      </div>
      <canvas id="canvas" class="canvas__main" />
      <canvas id="canvas2" class="canvas__drawon" />
      <canvas id="canvas3" class="canvas__quality" />
      <div class="upload__icon">Upload file icon</div>
      <div class="upload">
        <span>Drag &amp; drop ton image ici</span>
        <input
          class="upload__image"
          type="file"
          name="pic"
          accept="image/*"
          style="display:none;"
        />
      </div>
    </div>
    <p class="canvas__advice">
      Sélectionne une zone de l’image pour en récupérer sa palette.
    </p>
  </div>
  <ul class="controls">
    <li class="tg-list-item">
      <input class="tgl tgl-light" id="cb1" type="checkbox" />
      <label class="tgl-btn" for="cb1" />
      <p class="controls__label--desktop">
        Améliorer la précision des couleurs.
      </p>
    </li>
    <li class="radial radial__colors">
      <ColorRange />
    </li>
  </ul>
</section>
<section class="palette">
  <h2 class="hide">Palette</h2>
  <ul class="colors title title--normal" />
</section>
<section class="codes">
  <button class="codes__close">fermer</button>
  <h2 class="codes__title title title--normal">Couleur</h2>
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
