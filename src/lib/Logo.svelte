<script lang="ts">
  let play = 0
  ;(async function () {
    function sleep(duration: number) {
      return new Promise<void>((good, bad) => {
        setTimeout(() => good(), duration)
      })
    }

    function doit() {
      play++
      return play <= 10
    }

    await sleep(100)
    while (doit()) await sleep(200)
  })()
</script>

<div class="applogo">
  <div class="bold center-text main-title rotate-text">just.be.collage</div>
  <div class="sub-title">
    <div class:scale-0={true} class:effect-scale-1={play >= 5}>
      for use with
      <google>Google Photos</google>
    </div>
  </div>
  <div class:effect-zoom-out={play >= 5}>
    <div class:effect-skew={play >= 10}>
      <div class="logo-panel logo-grid" class:effect-shadow={play >= 7}>
        <div
          class="col1 logo-panel no-right-border"
          class:effect-paint-1={play >= 1}
        >
          <div class="selector">1</div>
        </div>
        <div class="col2 logo-panel no-border translucent">
          <div class="logo-panel no-right-border">
            <div class="selector">2</div>
          </div>
          <div class="logo-panel with-border" class:effect-paint-2={play >= 2}>
            <div class="selector">3</div>
          </div>
          <div class="logo-panel no-right-border no-top-border">
            <div class="selector">4</div>
          </div>
          <div class="logo-panel no-top-border">
            <div class="selector">5</div>
          </div>
        </div>
        <div class="logo-panel no-border translucent">
          <div class="logo-panel no-right-border no-top-border">
            <div class="selector">6</div>
          </div>
          <div class="logo-panel no-right-border no-top-border">
            <div class="selector">7</div>
          </div>
          <div
            class="logo-panel no-right-border no-top-border"
            class:effect-paint-2={play >= 3}
          >
            <div class="selector">8</div>
          </div>
          <div class="logo-panel no-top-border no-right-border no-top-border">
            <div class="selector">9</div>
          </div>
        </div>
        <div class="logo-panel no-top-border" class:effect-paint-4={play >= 4}>
          <div class="selector">10</div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @media (prefers-color-scheme: dark) {
    :root {
      --color-background: rgb(60, 64, 67);
      --color-text: rgb(220, 220, 220);
    }
  }

  @media (prefers-color-scheme: light) {
    :root {
      --color-background: rgb(220, 220, 220);
      --color-text: rgb(60, 64, 67);
    }
  }

  @media (prefers-contrast: more) {
    :root {
      --color-text: rgb(0, 255, 0);
    }
  }

  @media (min-width: 50rem) {
  }

  .applogo {
    --blue: rgb(30, 10, 180);
    --lite-smoke: rgb(220, 220, 220);
    --smoke: rgba(200, 200, 200, 1);
    --dark-smoke: rgb(60, 64, 67);
    --dark: rgb(60, 64, 67);
    --white: white;
    --google-red: #ea4335;
    --google-blue: #4285f4;
    --google-green: #34a853;
    --google-yellow: #fbbc05;
    --black: black;
  }

  .applogo {
    display: grid;
    align-items: center;
    padding: 2rem;
    border-radius: 2em;
    width: min(80vw, 25em);
    container-type: inline-size;
  }

  @media (prefers-color-scheme: dark) {
    .applogo {
      --shadow-color: rgba(200, 200, 200, 0.5);
      background-color: var(--dark);
    }

    .applogo > .sub-title {
      color: var(--white);
    }

    .applogo > .main-title {
      color: var(--white);
      text-shadow: 0px 0px 3px var(--black);
    }
  }

  @media (prefers-color-scheme: light) {
    .applogo {
      --shadow-color: var(--dark-smoke);
      background-color: var(--lite-smoke);
    }

    .applogo > .sub-title {
      color: var(--dark-smoke);
    }

    .applogo > .main-title {
      color: var(--dark-smoke);
      text-shadow: 0px 0px 3px var(--white);
    }
  }

  .applogo > .main-title {
    font-family: system-ui;
    font-size: 16cqw;
    text-align: center;
  }

  .applogo > .sub-title {
    font-size: 8cqw;
    text-align: center;
  }

  google {
    font-size: 6cqw;
    font-display: swap;
  }

  .logo-grid {
    width: 70cqw;
    height: 50cqw;
    margin-left: calc(50% - 70cqw / 2);
  }

  .applogo .logo-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .applogo .logo-panel:has(.selector) {
    background-color: #3c4043;
    padding: 0.5cqw;
  }

  .applogo .logo-panel {
    outline: 1cqw solid var(--google-blue);
  }

  .applogo .logo-panel:has(.logo-panel) {
    outline: none;
  }

  .applogo .logo-panel .selector {
    font-size: 3cqw;
    color: black;
    text-align: left;
  }

  .scale-0 {
    transform: scale(0);
  }

  .effect-scale-1 {
    animation-name: scale-1;
    animation-fill-mode: forwards;
    animation-duration: 1000ms;
  }
  @keyframes scale-1 {
    to {
      transform: scale(1);
    }
  }

  .effect-zoom-out {
    animation-name: zoomOut;
    animation-fill-mode: forwards;
    animation-duration: 1000ms;
  }
  @keyframes zoomOut {
    to {
      transform: scale(0.5) translateY(-12cqw);
    }
  }

  .effect-skew {
    animation-name: skew;
    animation-fill-mode: forwards;
    animation-duration: 1000ms;
  }
  @keyframes skew {
    to {
      transform: skewX(-12deg);
    }
  }

  .effect-shadow {
    animation-name: shadow;
    animation-fill-mode: forwards;
    animation-duration: 1000ms;
  }
  @keyframes shadow {
    to {
      box-shadow: 0 4cqw 8cqw 8cqw var(--shadow-color);
    }
  }

  .effect-paint-1 {
    transform: rotate(-5deg) scale(1.1);
    outline: 1cqw solid var(--google-red) !important;
    background-color: var(--google-blue) !important;
    z-index: 1;
    transition-duration: 1000ms;
  }

  .effect-paint-4 {
    background-position: 2cqw 0px;
    background-image: url(/google_photos_icon.png);
    background-color: white !important;
    background-repeat: no-repeat;
    background-size: contain;
    outline: 2cqw solid var(--google-green) !important;
    transform: rotate(5deg) scale(1.1);
    z-index: 1;
    transition-duration: 1000ms;
  }

  .effect-paint-2 {
    animation-name: paint-2;
    animation-fill-mode: forwards;
    animation-duration: 1000ms;
  }
  @keyframes paint-2 {
    to {
      background-color: var(--google-yellow);
    }
  }

  .no-right-border {
    border-right: none !important;
  }

  .no-top-border {
    border-top: none !important;
  }

  .col2 {
    grid-column: 2;
  }
</style>
