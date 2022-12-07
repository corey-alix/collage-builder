<script lang="ts">
  import { createSvgPolygon } from "./pageGenerator"
  export let radius = 30
  export let count = 4
  export let angle = 0
  export let stroke = 1
  export let fillColor = "#333"
  export let strokeColor = "#999"

  let size = 2 * (radius + stroke)
</script>

<svg viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}>
  <path
    id="path1"
    d={createSvgPolygon(count, { angle, radius })}
    fill={fillColor}
    stroke={strokeColor}
    stroke-width={stroke}
  />
</svg>
