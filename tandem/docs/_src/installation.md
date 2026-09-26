# Installation

You need:

- a Linux x86-64 workstation with an NVIDIA GPU, CUDA 12, [ffmpeg](https://ffmpeg.org) and about 25 GB of free disk;
- a [Franka FR3](https://franka.de/products/franka-research-3) or Panda with a [Robotiq 2F-85](https://robotiq.com/products/adaptive-grippers) gripper, and its [polymetis](https://facebookresearch.github.io/fairo/polymetis/) NUC;
- a wrist ZED camera, 1 third-person ZED camera and the [ZED SDK](https://www.stereolabs.com/developers/release);
- [pipx](https://pipx.pypa.io) or [uv](https://docs.astral.sh/uv/), and a [Gemini API key](https://aistudio.google.com/apikey);
- for human phases, a VR headset ([Meta Quest](https://www.meta.com/quest/)). TANDEM builds the teleop driver's environment itself ([Teleoperation](teleop.md));
  the NUC runs [DROID's server](https://github.com/SamratSahoo/droid) ([Robot setup](robot.md)).

Every command below runs on the workstation unless it says otherwise.

## Install

```bash
pipx install git+https://github.com/SamratSahoo/TANDEM.git
# or, with uv:
uv tool install git+https://github.com/SamratSahoo/TANDEM.git
```

## Initialize

Before you start, install the [ZED SDK](https://www.stereolabs.com/developers/release) and plug in the cameras.
Then run:

```bash
tandem init
```

It walks through the setup, in this order:

1. The robot: the NUC's address and the arm type.
2. [TiPToP](https://github.com/SamratSahoo/tiptop/tree/TANDEM)'s runtime, which it builds (5–20 minutes).
3. The perception servers TiPToP calls, [M2T2](https://github.com/SamratSahoo/M2T2/tree/TANDEM) and [FoundationStereo](https://github.com/SamratSahoo/FoundationStereo/tree/TANDEM), which it builds too ([Perception servers](perception-servers.md)).
4. The cameras. It lists the ZED cameras it finds and suggests a serial for each role (wrist, external, second
   external). Press Enter to accept a suggestion or type another serial. Then it asks which camera perception
   reads.
5. Your Gemini key.
6. The paper's five tasks, added as profiles.
7. [Teleoperation](teleop.md), if you want it.

You can run it again at any time; it skips steps that are already done. `tandem init --repair` asks every
question again.

## Check the setup

```bash
tandem doctor   # every check, and what to do about each; --no-hardware skips the robot, camera and server probes
```

Common problems are in [Troubleshooting](troubleshooting.md).
