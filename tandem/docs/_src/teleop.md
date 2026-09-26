# Teleoperation

A person carries out human phases by driving the arm with a [Meta Quest](https://www.meta.com/quest/) VR controller. TANDEM builds the teleop driver's environment for you.

```bash
tandem executors install teleop   # builds the teleop driver's environment and turns teleop on
tandem executors list             # teleop should say `ready`
```

`tandem init` offers to do this for you. The install fetches the workstation side of
[DROID](https://github.com/SamratSahoo/droid/tree/TANDEM) and builds a small environment for it, with the ZED
Python API when the [ZED SDK](https://www.stereolabs.com/developers/release) is installed. Human phases then drive the arm through the DROID server from [Robot setup](robot.md).
TANDEM passes the driver your NUC address and camera serials, so you don't need to edit anything in DROID.

Teleop uses a Meta Quest headset, driven with the right controller by default
(`tandem config set teleop.controller left` switches). The workstation also needs [`adb`](https://developer.android.com/tools/adb)
(`sudo apt install adb`), and the headset must be in [developer mode](https://github.com/SamratSahoo/droid/blob/TANDEM/docs/software-setup/docker.md#configuring-the-oculus-quest) and
connected by USB. A headset that has never run DROID teleop needs the [oculus_reader](https://github.com/rail-berkeley/oculus_reader) app installed once:

```bash
curl -L -o teleop.apk https://media.githubusercontent.com/media/rail-berkeley/oculus_reader/de73f3d259b3c41c4564f70a64682e24aa3ac31c/oculus_reader/APK/teleop-debug.apk
adb install teleop.apk
```
