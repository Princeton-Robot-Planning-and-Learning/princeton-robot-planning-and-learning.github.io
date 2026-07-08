/* Hotspot definitions for the interactive board diagram (board.html).
 *
 * Coordinates are in the SVG viewBox (1000 x 640) used by the stylized
 * drawing. When a real photo is dropped in as assets/img/board-photo.jpg,
 * the same coordinate space is stretched over the photo, so updating a
 * hotspot means changing numbers here only — no HTML edits.
 *
 * Each entry:
 *   id      unique slug
 *   label   short name drawn next to the hotspot
 *   shape   {type:'rect', x,y,w,h} or {type:'circle', cx,cy,r}
 *   body    HTML shown in the info panel; <details class="faq"> blocks
 *           render as expandable questions.
 */

var BOARD_PHOTO = 'board-photo.jpg'; // drop this file in assets/img/ to replace the stylized drawing

var BOARD_HOTSPOTS = [
    {
        id: 'psoc-chip',
        label: 'PSoC 5LP',
        shape: { type: 'rect', x: 420, y: 250, w: 160, h: 160 },
        body: `
<p>A <strong>CY8C5868AXI-LP035</strong>. When you create a project you must
select this part number; it is printed on top of the chip.</p>
<p>Alongside its ARM Cortex-M3 CPU, the PSoC has a fabric of <em>universal
digital blocks</em> (UDBs) and analog blocks that you configure by drawing
schematics in PSoC Creator. The PWM, timer, and UART you place in the
tutorial are synthesized into this fabric as real hardware.</p>
<details class="faq"><summary>How is this different from an Arduino?</summary>
<div class="body"><p>An Arduino's peripherals are fixed at manufacture: you get
the timers and serial ports the datasheet lists, on the pins it lists. On a
PSoC you instantiate peripherals like schematic components and route them to
(almost) any pin. It is closer to a small FPGA with a CPU attached.</p></div></details>
<details class="faq"><summary>What happens to my schematic when I hit Build?</summary>
<div class="body"><p>PSoC Creator synthesizes the schematic into configuration
data for the UDB fabric and generates a C API for each component (named after
the component: <code>LCD_Start()</code>, <code>PWM_WriteCompare()</code>).
The configuration is flashed together with your compiled C code.</p></div></details>
<details class="faq"><summary>Why does ECE 302 use this chip?</summary>
<div class="body"><p>The car needs several hardware functions running at
once: PWM for the drive motor and steering servo, timers capturing
Hall-sensor and video-sync edges, and a UART for radio telemetry. On the
PSoC each runs in hardware while your C code does control math in
interrupts.</p></div></details>`
    },
    {
        id: 'lcd',
        label: 'Character LCD',
        shape: { type: 'rect', x: 60, y: 40, w: 380, h: 110 },
        body: `
<p>A 2×16 character LCD, your primary debugging display in Exercise 1 onward.
It connects to <span class="pin">P2[6:0]</span> — Port 2 is printed on the
silkscreen next to the connector.</p>
<p>On the car this stays useful long after the tutorial: printing sensor
values and PID terms on the LCD is often faster than setting up telemetry.</p>
<details class="faq"><summary>The LCD is blank but my program says it downloaded fine.</summary>
<div class="body"><p>Check the <strong>contrast trimpot</strong> next to the
LCD before you suspect your code. Turn it with a small screwdriver until
characters appear.</p></div></details>
<details class="faq"><summary>Why 7 pins for a whole display?</summary>
<div class="body"><p>The module has its own controller chip (industry-standard
HD44780 protocol). The PSoC sends it commands and characters over a 4-bit data
bus plus control lines; the module handles the pixels. The Character LCD
component generates all of that protocol for you.</p></div></details>
<details class="faq"><summary>Old text is still visible behind my new text.</summary>
<div class="body"><p>Printing a shorter string over a longer one leaves the old
tail characters on screen. Call <code>LCD_ClearDisplay()</code> before
printing, or pad with spaces.</p></div></details>`
    },
    {
        id: 'trimpot',
        label: 'Contrast trimpot',
        shape: { type: 'circle', cx: 480, cy: 95, r: 16 },
        body: `
<p>A small potentiometer that sets the LCD contrast. If the display is blank
or shows only solid blocks after a successful program, adjust this first —
it is the most common "my code is broken" false alarm in Exercise 1.</p>
<details class="faq"><summary>What is it electrically?</summary>
<div class="body"><p>A voltage divider feeding the LCD's V<sub>O</sub> bias
pin. LCD segments are driven by an AC waveform whose effective RMS voltage
against this bias sets how dark the segments appear.</p></div></details>`
    },
    {
        id: 'sw2',
        label: 'SW2',
        shape: { type: 'circle', cx: 700, cy: 430, r: 20 },
        body: `
<p>Push button <strong>SW2</strong>, wired to <span class="pin">P6[1]</span>.
It shorts the pin to ground when pressed, which is why the tutorial configures
the pin as <em>Resistive Pull Up</em>: 5&nbsp;V when idle, 0&nbsp;V when
pressed.</p>
<p>Used in Exercise 2 (interrupt on press) and Exercise 4 (resets the timer
count).</p>
<details class="faq"><summary>Why do I need a pull-up at all?</summary>
<div class="body"><p>With the button open, a bare input pin is connected to
nothing — it floats, picking up whatever charge and interference is nearby,
and reads as random 0s and 1s. The pull-up resistor gives the pin a defined
idle state (high) that the button can override (low). Floating inputs cause
real bugs in Exercise 4.</p></div></details>
<details class="faq"><summary>Pressing gives 0 V — so why is the interrupt "rising edge"?</summary>
<div class="body"><p>It isn't, directly: the press produces a <em>falling</em>
edge, so the tutorial puts a NOT gate between the pin and the Interrupt
component. After the inversion, a press is a rising edge. You could instead
configure a falling-edge interrupt and skip the gate; the tutorial's way
makes the inversion visible in the schematic.</p></div></details>
<details class="faq"><summary>Careful: P6[1], not P1[6]</summary>
<div class="body"><p>The pin dropdown makes it easy to transpose the
digits. Assigning <span class="pin">P1[6]</span> builds and programs without
complaint, and the button silently does nothing. Check the little annotation
next to the pin symbol in the schematic.</p></div></details>`
    },
    {
        id: 'sw3',
        label: 'SW3',
        shape: { type: 'circle', cx: 775, cy: 430, r: 20 },
        body: `
<p>Push button <strong>SW3</strong>, wired to <span class="pin">P15[5]</span>.
In Exercise 4 it drives the timer's <em>capture</em> input: pressing it
snapshots the running count.</p>
<details class="faq"><summary>Why does the capture happen when I let go, not when I press?</summary>
<div class="body"><p>With a pull-up, pressing pulls the pin low and releasing
lets it rise. Capture is configured for rising edges, so it fires on the
<em>release</em>. Watch for this when your measured intervals seem shifted.</p></div></details>
<details class="faq"><summary>Why does this button need a Debouncer and SW2 doesn't?</summary>
<div class="body"><p>Both buttons bounce. On SW2 a bounce just re-runs a
harmless ISR; on SW3 each bounce queues a junk capture value into the timer's
capture FIFO, so every reading you display is stale. That is why SW3 gets
the Debouncer and SW2 does not need it. See Exercise 4's debugging story.</p></div></details>`
    },
    {
        id: 'reset',
        label: 'RESET',
        shape: { type: 'circle', cx: 850, cy: 430, r: 20 },
        body: `
<p>The chip <strong>reset</strong> button. Pressing it reboots your program
from the top.</p>
<details class="faq"><summary>I press the button and "nothing happens."</summary>
<div class="body"><p>Make sure you are pressing a button whose silkscreen says
<strong>SW2</strong> or <strong>SW3</strong>. Pressing RESET restarts the
program, which redraws "Hello World" and looks like nothing happening.
This confusion cost real debugging time in Exercise 2.</p></div></details>`
    },
    {
        id: 'led4',
        label: 'LED4',
        shape: { type: 'circle', cx: 700, cy: 510, r: 14 },
        body: `
<p>An onboard LED wired to <span class="pin">P6[3]</span>. In Exercise 3 the
PWM component drives it, and the button toggles between two brightness
levels.</p>
<details class="faq"><summary>Why does PWM look like dimming instead of blinking?</summary>
<div class="body"><p>The LED is switching fully on and off at about
40&nbsp;Hz (10&nbsp;kHz clock / 255 counts), faster than your eye can follow.
Your visual system averages it, so duty cycle reads as brightness. The car's
drive motor responds the same way: its mechanical inertia averages the PWM
into smooth torque.</p></div></details>`
    },
    {
        id: 'usb-prog',
        label: 'Programming USB',
        shape: { type: 'rect', x: 45, y: 555, w: 95, h: 55 },
        body: `
<p>The mini-USB jack for <strong>programming and powering</strong> the board —
it belongs to the onboard programmer, and it is the one at the board corner
<em>next to the round DC barrel jack</em>.</p>
<p>The entire tutorial runs from this cable: <strong>no batteries needed</strong>.</p>
<details class="faq"><summary>There are two identical USB jacks. Which one?</summary>
<div class="body"><p>This one — corner position, beside the barrel jack. The
other mini-USB is the PSoC's own USB peripheral port (for projects where the
PSoC itself acts as a USB device). Plugging into the wrong one is harmless;
just move the cable. Confirm with Device Manager: the right jack enumerates
as a Cypress <strong>DVKProg</strong> device.</p></div></details>`
    },
    {
        id: 'usb-periph',
        label: 'PSoC USB',
        shape: { type: 'rect', x: 875, y: 45, w: 95, h: 55 },
        body: `
<p>The PSoC's own USB <strong>peripheral</strong> port — used when a project
makes the PSoC act as a USB device. Not used anywhere in this tutorial.</p>
<details class="faq"><summary>I plugged in here by mistake. Did I break anything?</summary>
<div class="body"><p>No. Nothing enumerates as DVKProg and programming fails,
but it's electrically harmless. Move the cable to the jack next to the barrel
jack.</p></div></details>`
    },
    {
        id: 'barrel',
        label: 'DC barrel jack',
        shape: { type: 'rect', x: 155, y: 555, w: 70, h: 55 },
        body: `
<p>External DC power input. Not used in the tutorial (USB powers everything)
— but it is your landmark for finding the correct programming USB jack, which
sits right beside it.</p>
<details class="faq"><summary>How is the board powered on the car?</summary>
<div class="body"><p>The car does not use this jack. Its 9.6&nbsp;V
electronics pack feeds a regulator board (two 7805s and a 7806) that supplies the PSoC,
camera, and Hall sensor. A separate 7.2&nbsp;V pack drives the motor through
the MOSFET board. Never swap the packs: 9.6&nbsp;V overdrives the motor.</p></div></details>`
    },
    {
        id: 'programmer',
        label: 'Onboard programmer',
        shape: { type: 'rect', x: 45, y: 470, w: 245, h: 65 },
        body: `
<p>A second chip on the board whose only job is programming and debugging the
PSoC over USB. Windows sees it as a Cypress <strong>DVKProg</strong> device.</p>
<details class="faq"><summary>What is the "Select Debug Target" dialog about?</summary>
<div class="body"><p>The first time you hit Debug → Program, PSoC Creator asks
which programmer and which chip to use: expand the DVKProg entry, select the
CY8C5868 chip, click Port Acquire / Connect, then OK. After that it
remembers.</p></div></details>
<details class="faq"><summary>Can I read my program back off a chip?</summary>
<div class="body"><p>No. You can reprogram flash but you cannot read source
back, which is the reason for the standing rule: programming the bench-306
test car's PSoC
<strong>erases Radd's firmware permanently</strong>. Do tutorial work on a
spare board, or clear it with Radd first.</p></div></details>`
    },
    {
        id: 'gpio',
        label: 'GPIO port headers',
        shape: { type: 'rect', x: 480, y: 490, w: 180, h: 110 },
        body: `
<p>Headers exposing the PSoC's I/O ports. Because PSoC routing is flexible,
"which pin does what" is your choice in the Pins tab of Design Wide
Resources; these headers carry whichever signals you assign.</p>
<p>In Exercise 5 the XBee radio carrier wires to <span class="pin">P6[0]</span>
and <span class="pin">P6[6]</span> here, plus VDDD/VSSD for power.</p>
<details class="faq"><summary>What are VDDD and VSSD?</summary>
<div class="body"><p>Digital supply (V<sub>DDD</sub>, 5&nbsp;V here) and
digital ground (V<sub>SSD</sub>). The D suffix distinguishes them from the
analog supply pins (VDDA/VSSA), kept separate so digital switching noise
does not pollute analog measurements. The same concern returns on the car,
where the camera's analog video shares a board with motor PWM.</p></div></details>`
    }
];
