# Cameras and calibration

You can configure camera settings through TANDEM:

```bash
tandem rig show                                   # the robot, the cameras, and which have extrinsics
tandem rig set robot.type panda_robotiq           # a Panda
tandem rig set cameras.external_2.serial SERIAL   # roles: hand, external, external_2
```

**Extrinsics.** Every configured camera needs extrinsics before a session can start. `tandem rig show` and
`tandem doctor` list the missing ones. They go in `calibration.json` (`tandem rig path --calibration` prints where it is),
one entry per camera, keyed by serial:

```json
{
  "14846828": {"pose": [0.0266, 0.0705, -0.1392, -0.4509, -0.0045, -1.5620]},
  "32439448": {"pose": [0.1532, -0.5827, 0.4410, -2.0843, 0.0126, 0.1964]}
}
```

`pose` is `[x, y, z, roll, pitch, yaw]` in meters and radians (`xyz` Euler). For the wrist camera it is
relative to the end effector; for an external camera it is relative to the robot's base. The full format is in
[Configuration](docs/CONFIGURATION.md#the-rig).

To fill it in:

- **External cameras:** calibrate each from [DROID's GUI](https://droid-dataset.github.io/droid/example-workflows/data-collection.html) with the [ChArUco board](https://github.com/SamratSahoo/droid/blob/TANDEM/docs/hardware-setup/assembly.md#mounting-calibration-board), as [DROID](https://github.com/SamratSahoo/droid/tree/TANDEM)'s
  [calibration guide](https://droid-dataset.github.io/droid/example-workflows/calibrating-cameras.html)
  describes. DROID writes [`droid/calibration/calibration_info.json`](https://github.com/SamratSahoo/droid/blob/TANDEM/droid/calibration/calibration_info.json) in the same format. Copy each
  `"<serial>_left"` entry into the rig's file under the bare serial (`"32439448_left"` becomes `"32439448"`).
- **Wrist camera:** run `tandem runtime run calibrate-wrist-cam`, following [TiPToP](https://github.com/SamratSahoo/tiptop/tree/TANDEM)'s
  [guide](https://github.com/SamratSahoo/tiptop/blob/682047493b88e5301c6b2b49da914ea4f173e5d9/docs/getting-started.md)
  but skipping its Bamboo controller step (the shim replaces it). It writes the entry for you.
- **Any other tool:** write the entry yourself. A 4×4 transform `T` becomes `T[:3, 3]` followed by
  `Rotation.from_matrix(T[:3, :3]).as_euler("xyz")`.

Check the result with `tandem runtime run viz-calibration` (the wrist camera) or
`tandem runtime run viz-calibration --camera external`. `tandem runtime run` runs TiPToP's scripts with your
NUC address, cameras and calibration file. Recalibrate a camera whenever it moves.
