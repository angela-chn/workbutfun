import { timeline } from 'wix-animations';
import { formFactor } from 'wix-window';

$w.onReady(function () {
    // Declare all elements in the animation

    // Stars
    const stars1 = $w('#stars1');
    const stars2 = $w('#stars2');
    const stars3 = $w('#stars3');

    // Sun
    const sun = $w('#sun');

    // System that includes the earth and both moons 
    const earth = $w('#earth');
    const planet1 = $w('#planet1');
    const moon = $w('#moon');
    const moon_copy = $w('#mooncopy');
    const system = $w('#system');

    // Planet measurements
    let earthDiameter = 102;
    let moonDiameter = 36;
    let orbitWidth = 683;
    let orbitHeight = 301;

    // Adjust planet measurements for mobile devices
    if (formFactor === 'Mobile') {
        earthDiameter = 43;
        moonDiameter = 14;
        orbitWidth = 242;
        orbitHeight = 107;
    }

    // Orbit durations
    const moonDuration = 1500;
    const systemDuration = 5000;

    // Rotate the moon around the earth
    timeline({ repeat: -1 })
        // Some presets
        .add(moon_copy, { duration: 0, opacity: 0 })
        .add([moon, moon_copy], { duration: 0, scale: 0.8 })
        // Move the moon along the Y axis, perform calculations to create a skewed ellipse
        .add([moon, moon_copy], { duration: moonDuration * (1 / 3), y: -moonDiameter * 2 * (1 / 4), scale: 0.6, easing: 'easeOutQuad' })
        .add([moon, moon_copy], { duration: moonDuration * (2 / 3), y: moonDiameter * 2 * (3 / 4), scale: 0.8, easing: 'easeInSine' })
        .add([moon, moon_copy], { duration: moonDuration * (1 / 3), y: moonDiameter * 2, scale: 1, easing: 'easeOutQuad' })
        .add([moon, moon_copy], { duration: moonDuration * (2 / 3), y: 0, scale: 0.8, easing: 'easeInSine' })
        // Move the moon along the X axis
        .add([moon, moon_copy], { duration: moonDuration, x: earthDiameter + moonDiameter, easing: 'easeInOutSine' }, 0)
        .add([moon, moon_copy], { duration: moonDuration, x: 0, easing: 'easeInOutSine' }, moonDuration)
        // Show the moon in front of the earth
        .add(moon_copy, { duration: 0, opacity: 1 }, moonDuration)
        .play();

    // Rotate the System around the sun
    const systemTimeline = timeline({ repeat: -1 })
        // Movement on the Y axis 
        .add(system, { duration: systemDuration * (1 / 3), y: -(orbitHeight - earthDiameter / 2) * .25, easing: 'easeOutQuad' })
        .add(system, { duration: systemDuration * (2 / 3), y: (orbitHeight - earthDiameter / 2) * .75, easing: 'easeInSine' })
        .add(system, { duration: systemDuration * (1 / 3), y: orbitHeight - earthDiameter / 2, easing: 'easeOutQuad' })
        .add(system, { duration: systemDuration * (2 / 3), y: 0, easing: 'easeInSine' })
        // Movement on the X axis
        .add(system, { duration: systemDuration, x: orbitWidth, easing: 'easeInOutSine' }, 0)
        .add(system, { duration: systemDuration, x: 0, easing: 'easeInOutSine' }, systemDuration)
        .play();

    const planet = timeline({ repeat: -1 })
        // Movement on the Y axis 
        .add(planet1, { duration: systemDuration * (1 / 3), y: (orbitHeight - earthDiameter / 2) * .25, easing: 'easeOutQuad' })
        .add(planet1, { duration: systemDuration * (2 / 3), y: -(orbitHeight - earthDiameter / 2) * .75, easing: 'easeInSine' })
        .add(planet1, { duration: systemDuration * (1 / 3), y: -orbitHeight - earthDiameter / 2, easing: 'easeOutQuad' })
        .add(planet1, { duration: systemDuration * (2 / 3), y: 0, easing: 'easeInSine' })
        // Movement on the X axis
        .add(planet1, { duration: systemDuration, x: orbitWidth, easing: 'easeInOutSine' }, 0)
        .add(planet1, { duration: systemDuration, x: 0, easing: 'easeInOutSine' }, systemDuration)
        .play();

    // We create a separate timeline for scaling the System
    const systemScaleTimeline = timeline({ repeat: -1 })
        .add(system, { duration: 0, scale: 0.8 })
        .add(system, { duration: systemDuration / 2, scale: 0.6, easing: 'easeOutSine' })
        .add(system, { duration: systemDuration / 2, scale: 0.8, easing: 'easeInSine' })
        .add(system, { duration: systemDuration / 2, scale: 1, easing: 'easeOutSine' })
        .add(system, { duration: systemDuration / 2, scale: 0.8, easing: 'easeInSine' })
        .play();

    // Rotate both the System and the sun
    const rotationTimeline = timeline({ repeat: -1 })
        // Add a slow rotation to the earth
        .add(earth, { duration: systemDuration * 8, rotate: 360 * 4, easing: 'easeLinear' }, 0)
        // Add a slow rotation to the earth
        .add(planet1, { duration: systemDuration * 8, rotate: 360 * 4, easing: 'easeLinear' }, 0)
        // Add an even slower rotation to the sun
        .add(sun, { duration: systemDuration * 8, rotate: 360, easing: 'easeLinear' }, 0)
        .play();

    // Blink the stars 
    const starsTimeline = [stars1, stars2, stars3].map((stars, index) =>
        timeline({ repeat: -1, yoyo: true })
        .add(stars, { duration: 1500 + index * 1300, opacity: index * 0.1, easing: 'easeOutBounce' })
        .play()
    )
});
