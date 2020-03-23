// precision highp float;
precision mediump float;

// Uniforms
uniform float u_time;
uniform vec2 u_viewport; // change type

const int NUM_COLOURS = 10;
uniform vec3 colours[NUM_COLOURS];

//From Book of Shaders
float random (vec2 _st) {
    return fract(sin(dot(_st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5

float fbm (vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

vec3 getColour(int id) {
    for (int i=0; i<NUM_COLOURS; i++) {
        if (i == id) return colours[i];
    }
}

void main() {

    // vec2 uv = (gl_FragCoord.xy -0.5*u_viewport.xy) / min(u_viewport.x, u_viewport.y)  ;
    vec2 uv = (gl_FragCoord.xy / u_viewport.xy);
    // uv.x *= u_viewport.x / u_viewport.y;

    //Book of Shaders fbm biz
    float zoom = 2.;
    vec2 st = uv*zoom;
    vec2 q = vec2(0.);
    q.x = fbm(st + 0.20*u_time);
    q.y = fbm(st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*u_time );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time);

    float f = fbm(st+r);

    float c = clamp((f*f)*4.0,0.0,1.0);
    c = mix(c, 1.0, clamp(length(q),0.0,1.0));
    c = mix(c, 1.0, clamp(length(r.x),0.0,1.0));
    c *= f*f*f+.6*f*f+.5*f;
    c *= 9.0;


    int idx1 = int(c);
    int idx2 = idx1 + 1;
    vec3 colour = mix(getColour(idx1), getColour(idx2), fract(c));

    gl_FragColor = vec4(colour, 1.0);
}