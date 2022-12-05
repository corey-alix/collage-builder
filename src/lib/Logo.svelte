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

    await sleep(500)
    while (doit()) await sleep(250)
  })()
</script>

<div class="applogo">
  <div class="bold center-text main-title rotate-text">just.be.collage</div>
  <div class="logo-panel logo-grid play_2" class:play={play >= 5}>
    <div
      class="col1 logo-panel no-right-border play_1 img1"
      class:play={play >= 1}
    >
      <div class="selector">1</div>
    </div>
    <div class="col2 logo-panel no-border translucent">
      <div class="logo-panel no-right-border">
        <div class="selector">2</div>
      </div>
      <div class="logo-panel with-border play_1 img3" class:play={play >= 2}>
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
        class="logo-panel no-right-border no-top-border play_1 img8"
        class:play={play >= 3}
      >
        <div class="selector">8</div>
      </div>
      <div class="logo-panel no-top-border no-right-border no-top-border">
        <div class="selector">9</div>
      </div>
    </div>
    <div class="logo-panel no-top-border play_1 img10" class:play={play >= 4}>
      <div class="selector">10</div>
    </div>
  </div>
  <div class="sub-title rotate-text-u play_2" class:play={play >= 6}>
    for use with
    <google>Google Photos</google>
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
    font-size: 8vw;
    text-align: center;
    transform: translateY(0vw);
  }

  .applogo > .sub-title {
    opacity: 0;
    font-size: 3vw;
    text-align: center;
    transform: translateY(0vw);
  }

  google {
    font-size: 2vw;
    font-display: swap;
  }

  .applogo > .sub-title.play {
    opacity: 1;
  }

  .applogo > .logo-grid {
    width: 35vw;
    height: 25vw;
    margin-left: calc(50% - 35vw / 2);
    transform: scale(0.75);
  }

  .applogo > .logo-grid.play {
    transform: skewX(-12deg) scale(0.75);
    box-shadow: 0 0 24pt 24pt var(--shadow-color);
  }

  .applogo .logo-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .applogo .logo-panel:has(.selector) {
    background-color: #3c4043;
    padding: 0.5vw;
  }

  .applogo .logo-panel {
    outline: 0.5vw solid var(--google-blue);
  }

  .applogo .logo-panel:has(.logo-panel) {
    outline: none;
  }

  .applogo .logo-panel .selector {
    font-size: 3pt;
    color: black;
    border-radius: 50%;
    background-color: white;
    width: 6pt;
    height: 6pt;
    margin: 1pt;
    text-align: center;
  }

  .applogo .play_1,
  .applogo .play_2 {
    transition-delay: 0ms, 100ms, 200ms, 0ms;
    transition-property: border, transform, box-shadow, opacity;
    transition-duration: 50ms, 50ms, 50ms, 2000ms;
  }

  .logo-panel.img1.play {
    transform: rotate(-5deg) scale(1.1);
    outline: 1vw solid var(--google-red) !important;
    background-color: var(--google-blue);
    z-index: 1;
  }

  .logo-panel > .img10.play {
    background-position: 8px 0px;
    background-image: url(/google_photos_icon.png);
    background-color: white !important;
    background-repeat: no-repeat;
    background-size: contain;
    outline: 1vw solid var(--google-green) !important;
    transform: rotate(5deg) scale(1.1);
    z-index: 1;
  }

  .logo-panel > .img3.play {
    background: linear-gradient(
      to top right,
      var(--white),
      var(--google-yellow)
    ) !important;
  }

  .logo-panel > .img8.play {
    background: linear-gradient(
      to bottom left,
      var(--white),
      var(--google-yellow)
    ) !important;
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
