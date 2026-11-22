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

## Scroll-guided component tour

Ten chapters follow native dialog scrolling: overview, presence, keypad/OLED,
servo door, stepper curtain, environmental sensors, fan/relay, MQTT nodes,
assembly and free inspection. A sticky model follows camera targets, highlights,
actuator states and enclosure visibility for the currently read chapter. The
scene remains draggable, and chapter indicators support direct navigation.

Desktop keeps the model beside the text; narrow screens keep a compact model
above the scrolling explanation. The tour does not capture the wheel or replace
touch scrolling. Camera transitions respect reduced-motion preferences.

Details such as GPIO assignments, 20/10 cm presence thresholds, temperature and
light hysteresis, MQTT topics and mode behaviour follow `docs/setup.md` and
`docs/mqtt.md` in the public LUMA repository.

## Physical-placement clarification and presentation update

Emanuel clarified that the DHT sensor was outside the house for temperature
response testing with a nearby heat source, and that the fan was attached under
the ceiling. The reconstruction now places the DHT externally and attaches the
fan to the roof group, with a stationary frame and independently rotating blades.
Exact exterior position and remaining wiring are schematic.

The tour now uses a full-width sticky scene and short descriptive overlay cards.
The previous long side narrative and the lower project gallery are not displayed.
A concise project account follows the model.
