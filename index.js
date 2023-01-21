// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import { timeline } from 'wix-animations'
import { formFactor } from 'wix-window'
// ID: 8EC01DD7AD9195AB0E792EB326B12E08

const isMobile = formFactor === 'Mobile'

$w.onReady(function () {

    // The balls:
    const left = $w('#leftBall')
    const mid = $w('#midBall')
    const right = $w('#rightBall')

    // The maze:
    const maze = $w('#maze')

    // Get the array of all of the children in the maze group 
    const wheels = maze.children

    /* IMPORTANT: 
    We manually order all the 'wheels' with the "Arrange" tool in the Toolbar using the "Send to Back" settings.
    The ordered array of the 12 elements should look like this:
    
    0 1 2 3 
    4 5 6 7 
    8 9 10 11

    Note that in order to keep the order of elements from changing, we need to turn off an accessibility feature in the Editor 
    by going to Settings -> Accessibility -> Advanced Settings -> and unchecking the “Automatic DOM order” checkbox.
    For production sites where order really matters, we suggest you build this array manually.
    */

    // Define the 3 timelines we are going to use:
    const maze_tl = timeline()
    const left_ball_tl = timeline()
    const mid_ball_tl = timeline()
    const right_ball_tl = timeline()

    /* 
    Each 'wheel' can have 1 of 4 positions. We number them with each number representing a 90deg turn clockwise:
     ⌞ 0
     ⌜ 1
     ⌝ 2
     ⌟ 3
    */

    // Now we can use the ordered array and the position map to preset our desired end position for each wheel. For example:
    const turns = [
        0, 2, 1, 3,
        1, 3, 0, 2,
        0, 2, 1, 3,
    ]

    // We use a loop to build the timeline programmatically:
    wheels.forEach((wheel, index) => {
        maze_tl.add(wheel, { duration: 1200, rotate: 90 * turns[index], easing: 'easeOutCubic' }, 1000) // Offset by a second so we don't start immediately on page load
    })

    // We want to time the balls animations to start when the maze animation ends:
    maze_tl
        .onComplete(() => {
            left_ball_tl.play()
            mid_ball_tl.play()
            right_ball_tl.play()
        })
        // And play immediately
        .play()

    // Perform the calculations for animating the balls
    // We adjust the measurements for mobile devices
    const ball_size = isMobile ? 12 : 16
    const wheel_radius = 35
    const distance_to_maze = isMobile ?
        191 - 96 - ball_size // maze top - balls top - ball size
        :
        351 - 303 - ball_size // maze top - balls top - ball size
    const distance_from_maze = isMobile ?
        492 - (211 + 191 - ball_size) // end ball position - maze top + maze height - ball -size
        :
        775 - (351 + 365 - ball_size) // end ball position - maze top + maze height - ball -size

    left_ball_tl
        .add(left, { duration: 500, y: distance_to_maze + 7, easing: 'easeInSine' })
        // Pseudo physics - 'jump' the ball into the maze	
        .add(left, { duration: 200, y: '-=23', easing: 'easeOutQuad' }) // Go up and slow down
        .add(left, { duration: 200, y: '+=22', easing: 'easeInQuad' }) // Go down
        .add(left, { duration: 400, x: isMobile ? '-=28' : '-=180', easing: 'easeLinear' }, '-=400') // Slide right at the same time 
        // Let's traverse the maze
        // To make it feel like we are actually descending, we will gradually increase speed as we go:
        .add(left, { duration: 150, y: `+=${wheel_radius}`, easing: 'easeLinear' })
        .add(left, { duration: 300, x: `+=${wheel_radius * 2}`, easing: 'easeLinear' })
        .add(left, { duration: 240, y: `+=${wheel_radius * 2 + 1}`, easing: 'easeLinear' }) // There is a 1px gap between the wheels
        .add(left, { duration: 240, x: `-=${wheel_radius * 2}`, easing: 'easeLinear' })
        .add(left, { duration: 180, y: `+=${wheel_radius * 2 + 2}`, easing: 'easeLinear' }) // Compensating for the gap again
        .add(left, { duration: 180, x: `+=${wheel_radius * 2}`, easing: 'easeLinear' })
        // We got out of the maze!
        .add(left, { duration: 150, y: `+=${wheel_radius + distance_from_maze + 10}`, easing: 'easeInSine' })
        // Now we bump the ball into place using the same technique before the maze
        .add(left, { duration: 120, y: '-=20', easing: 'easeOutQuad' }) // Go up and slow down
        .add(left, { duration: 120, y: '+=20', easing: 'easeInQuad' }) // Go down 
        .add(left, { duration: 240, x: '-=60', easing: 'easeLinear' }, '-=240') // Slide right at the same time 
        .add(left, { duration: 120, y: '-=15', easing: 'easeOutQuad' }) // Go up and slow down
        .add(left, { duration: 120, y: '+=15', easing: 'easeInQuad' }) // Go down
        .add(left, { duration: 240, x: isMobile ? '+=15' : '-=75', easing: 'easeLinear' }, '-=240') // Slide right at the same time 
        .add(left, { duration: 100, y: '-=7', easing: 'easeOutSine' }) // Slide into the final position

    // Let's build the right ball path
    right_ball_tl
        .add(right, { duration: 500, y: distance_to_maze + 7, easing: 'easeInSine' })
        // Pseudo physics - 'jump' the ball into the maze	
        .add(right, { duration: 200, y: '-=21', easing: 'easeOutQuad' }) // Go up and slow down
        .add(right, { duration: 200, y: '+=21', easing: 'easeInQuad' }) // Go down 
        .add(right, { duration: 400, x: isMobile ? '+=61' : '-=125', easing: 'easeLinear' }, '-=400') // Slide right at the same time 
        .add(right, { duration: 150, y: '-=15', easing: 'easeOutQuad' }) // Jump again
        .add(right, { duration: 150, y: '+=13', easing: 'easeInQuad' })
        .add(right, { duration: 300, x: '-=100', easing: 'easeLinear' }, '-=300') // Boom! we got to the entrance of the maze
        // Let's traverse the maze
        // To make it feel like we are actually descending, we will gradually increase speed as we go:
        .add(right, { duration: 150, y: `+=${wheel_radius}`, easing: 'easeLinear' })
        .add(right, { duration: 300, x: `+=${wheel_radius * 2}`, easing: 'easeLinear' })
        .add(right, { duration: 240, y: `+=${wheel_radius * 2 + 1}`, easing: 'easeLinear' }) // There is a 1px gap between the wheels
        .add(right, { duration: 240, x: `-=${wheel_radius * 2}`, easing: 'easeLinear' })
        .add(right, { duration: 180, y: `+=${wheel_radius * 2 + 2}`, easing: 'easeLinear' }) // Compensating for the gap again
        .add(right, { duration: 180, x: `+=${wheel_radius * 2}`, easing: 'easeLinear' })
        // We got out of the maze!
        .add(right, { duration: 150, y: `+=${wheel_radius + distance_from_maze + 10}`, easing: 'easeInSine' })
        // Now we bump the ball into place using the same technique before the maze
        .add(right, { duration: 120, y: '-=20', easing: 'easeOutQuad' }) // Go up and slow down
        .add(right, { duration: 120, y: '+=20', easing: 'easeInQuad' }) // Go down 
        .add(right, { duration: 240, x: '-=60', easing: 'easeLinear' }, '-=240') // Slide right at the same time 
        .add(right, { duration: 120, y: '-=15', easing: 'easeOutQuad' }) // Go up and slow down
        .add(right, { duration: 120, y: '+=15', easing: 'easeInQuad' }) // Go down
        .add(right, { duration: 240, x: isMobile ? '+=15' : '-=30', easing: 'easeLinear' }, '-=240') // Slide right at the same time 
        .add(right, { duration: 100, y: '-=6', easing: 'easeOutSine' }) // Slide into the final position

    // Let's build the mid ball path:
    mid_ball_tl
        .add(mid, { duration: 500, y: distance_to_maze + 7, easing: 'easeInSine' })
        // Pseudo physics - 'jump' the ball into the maze	
        .add(mid, { duration: 200, y: '-=21', easing: 'easeOutQuad' }) // Go up and slow down
        .add(mid, { duration: 200, y: '+=21', easing: 'easeInQuad' }) // Go down 
        .add(mid, { duration: 400, x: isMobile ? '+=61' : '+=10', easing: 'easeLinear' }, '-=400') // Slide right at the same time 
        // Let's traverse the maze
        // The right path is a mirror of the left ball path, so all we need to do is just invert the X values:
        .add(mid, { duration: 150, y: `+=${wheel_radius}`, easing: 'easeLinear' })
        .add(mid, { duration: 300, x: `-=${wheel_radius * 2}`, easing: 'easeLinear' })
        .add(mid, { duration: 240, y: `+=${wheel_radius * 2 + 1}`, easing: 'easeLinear' }) // There is a 1px gap between the wheels
        .add(mid, { duration: 240, x: `+=${wheel_radius * 2}`, easing: 'easeLinear' })
        .add(mid, { duration: 180, y: `+=${wheel_radius * 2 + 2}`, easing: 'easeLinear' })
        .add(mid, { duration: 180, x: `-=${wheel_radius * 2}`, easing: 'easeLinear' })
        // We got out of the maze!
        .add(mid, { duration: 150, y: `+=${wheel_radius + distance_from_maze + 10}`, easing: 'easeInSine' })
        // Now we bump the ball into place using the same technique before the maze
        // With this right ball we need to jump a little higher and further. Let's jump twice:
        .add(mid, { duration: 180, y: '-=40', easing: 'easeOutQuad' }) // Go up and slow down
        .add(mid, { duration: 180, y: '+=40', easing: 'easeInQuad' }) // Go down 
        .add(mid, { duration: 360, x: `-=100`, easing: 'easeLinear' }, '-=360') // Slide right at the same time 
        .add(mid, { duration: 100, y: '-=20', easing: 'easeOutQuad' }) // Jump again
        .add(mid, { duration: 100, y: '+=20', easing: 'easeInQuad' })
        .add(mid, { duration: 200, x: isMobile ? '-=13' : '-=85', easing: 'easeLinear' }, '-=200')
        .add(mid, { duration: 100, y: '-=8', easing: 'easeOutSine' }) // Slide into place

});
