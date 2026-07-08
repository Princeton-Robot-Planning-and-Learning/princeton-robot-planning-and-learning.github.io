# Images needed for the tutorial site

Drop each file into `assets/img/` under the exact name below — pages swap
placeholders for real images automatically on reload (no HTML edits). Most
placeholders are "check" figures: they show students what their screen,
schematic, code, or board should look like at that step, so capture the
correct state, not a work-in-progress.

## Photos (phone camera is fine)

| File | Page | What to capture |
|---|---|---|
| `board-photo.jpg` | board.html | Top-down photo of the whole CY8CKIT-050 dev board, square to the camera, evenly lit. Replaces the stylized drawing; after adding it, adjust hotspot coordinates in `assets/js/board-data.js` to match the photo (viewBox is 1000×640, photo is stretched to fill). |
| `setup-usb-jacks.jpg` | index.html | Board corner showing the programming USB jack next to the DC barrel jack. Ideally annotate an arrow on the correct jack. |
| `ex1-check-lcd-hello.jpg` | ex1.html | LCD showing "Hello World". |
| `ex2-check-lcd-pressed.jpg` | ex2.html | LCD showing "Button Pressed", finger on SW2. |
| `ex3-check-led.jpg` | ex3.html | LED4 lit; ideally two shots at different compare values, side by side. |
| `ex4-check-lcd-ms.jpg` | ex4.html | LCD showing a captured interval (e.g. "ms: 3120"). |
| `ex5-xbee-wiring.jpg` | ex5.html | Red XBee carrier wired to the dev board: +5V→VDDD, GND→VSSD, IN→P6[0], OUT→P6[6], all four wires visible. |

## PSoC Creator / Windows screenshots

| File | Page | What to capture |
|---|---|---|
| `setup-check-device-manager.png` | index.html | Device Manager with the Cypress DVKProg entry visible. |
| `setup-select-debug-target.png` | index.html | The first-run "Select Debug Target" dialog, DVKProg entry expanded, CY8C5868 chip selected. |
| `ex1-new-project.png` | ex1.html | New Project dialog with PSoC 5LP family and CY8C5868AXI-LP035 selected. |
| `ex1-check-schematic.png` | ex1.html | TopDesign canvas with just the renamed LCD component. |
| `ex1-check-pins.png` | ex1.html | Pins tab with LCD:LCDPort on P2[6:0]. |
| `ex2-schematic.png` | ex2.html | Finished Exercise 2 schematic: Button → NOT → Button_Interrupt chain, LCD standing alone. Zoom so pin annotations are legible (they matter for the P6[1] gotcha). |
| `ex2-check-pins.png` | ex2.html | Pins tab with Button on P6[1]. |
| `ex3-check-pwm-config.png` | ex3.html | PWM configuration dialog, One output mode. |
| `ex3-schematic.png` | ex3.html | Exercise 3 schematic: Clock → PWM → LED plus the button chain. |
| `ex4-check-timer-config.png` | ex4.html | Timer configuration dialog: UDB, 16-bit, period 65535, capture rising edge, interrupt on capture. |
| `ex4-schematic.png` | ex4.html | Full Exercise 4 schematic: timer with clock/capture/reset wiring, both interrupt chains, junction dot visible on the reset branch. |
| `ex4-debouncer.png` | ex4.html | Debouncer wiring detail: Button2 → d, q → Timer capture, Clock_Slow (100 Hz) → Debouncer clock. |
| `ex5-check-uart-schematic.png` | ex5.html | UART component with its auto-created Rx_1/Tx_1 pins. |
| `ex5-check-pins.png` | ex5.html | Pins tab with Rx_1 = P6[0] and Tx_1 = P6[6]. |
| `ex5-check-putty.png` | ex5.html | PuTTY at 115200 showing a few "ms:" lines arriving. |

## Nice-to-have (no placeholder yet — add a `<figure class="media check">` when ready)

- The XBIB USB carrier with the "E" module seated (ex5)
- LCD and PuTTY showing the same interval in one frame (ex5)
