uniform float uScale;

varying vec2 vUv;

void main() {
  // 白色异形环 plus
  vec2 waveUv = vec2(
    vUv.x + sin(vUv.y * uScale) * .1,
    vUv.y + sin(vUv.x * uScale) * .1
  );
  float strength = 1. - step(.015, abs(distance(waveUv, vec2(.5)) - .25));

  gl_FragColor = vec4(strength, strength, strength, 1.);
}