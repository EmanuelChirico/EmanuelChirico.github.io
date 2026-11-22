# LUMA interactive reconstruction

The procedural model in `luma-hero.js` was reconstructed from the project photos
(`prototype.webp`, `build.webp`, `sensors.webp`) and the public team repository:
https://github.com/fra343/Luma-IoT-Project (reviewed 22 November 2026).

Visible references: plywood enclosure, raised roof/lid, front keypad and OLED,
vertically mounted ultrasonic sensor, servo-operated door, side roller curtain
and motor, turf platform and potted plant. Proportions are approximate.

Hidden walls, the two ESP32 assemblies, DHT22/light sensor, relay/fan and wiring
are schematic illustrations of the documented subsystems. Internal placement
and wire routes are not a measured wiring diagram. Door and curtain controls
animate the website model; they do not send MQTT commands or represent live data.

The same Three.js geometry is rendered using WebGL where available, with a
software renderer for browsers without WebGL. The scene loads only for LUMA,
pauses when hidden/offscreen, and disposes observers and drawing resources when
leaving the project. Reduced-motion preferences disable automatic movement;
explicit model controls remain available.

Three.js 0.169.0 is vendored in `assets/vendor/three.module.min.js` under its MIT
license, included as `assets/vendor/three-LICENSE.txt`. Textures are generated
locally from code; no external 3D assets or image-generation service are used.
