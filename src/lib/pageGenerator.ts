type Polygon = number[][];

function createPolygon(count: number, radius = 0.5) {
    const points = [];
    for (let i = 0; i < count; i++) {
        const angle = i * 2 * Math.PI / count;
        points.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
    }
    return points as Polygon;
}

function asSvgPath(points: Polygon) {
    return points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ") + " Z";
}

function scalePolygon(points: Polygon, scale: number) {
    return points.map(([x, y]) => [x * scale, y * scale]);
}

function translatePolygon(points: Polygon, [x, y]: [number, number]) {
    return points.map(([px, py]) => [px + x, py + y]);
}

function rotatePolygon(points: Polygon, angle: number) {
    return points.map(([x, y]) => {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return [x * cos - y * sin, x * sin + y * cos];
    });
}

function createStar(count: number, r1: number, r2: number) {
    const points = [];
    for (let i = 0; i < count; i++) {
        const angle = i * 2 * Math.PI / count;
        points.push([r1 * Math.cos(angle), r1 * Math.sin(angle)]);
        points.push([r2 * Math.cos(angle + Math.PI / count), r2 * Math.sin(angle + Math.PI / count)]);
    }
    return points as Polygon;
}

function createSvgPolygon(count: number, options: { angle?: number, radius?: number; }) {
    const r1 = options.radius || 0.5;
    const angle = (options.angle || 0) * Math.PI / 180;
    let points = createPolygon(count, r1);
    points = rotatePolygon(points, angle);
    points = translatePolygon(points, [r1, r1]);
    const path = asSvgPath(points);
    return path;
}

export { createSvgPolygon };
