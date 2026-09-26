# TANDEM documentation

<p class="lead">TANDEM collects demonstrations for fine-tuning vision-language-action (VLA) models. A vision-language model splits each task into a sequence of phases, robot and human, in whatever order and number the task needs. The robot does its phases with task and motion planning (TAMP), and a person teleoperates the rest, only where the planner can't.</p>

<div class="home-buttons">
  <a class="btn primary" href="/tandem/docs/installation/">Install TANDEM</a>
  <a class="btn" href="/tandem/docs/getting-started/">Your first collection</a>
  <a class="btn" href="/tandem/">Read the paper</a>
</div>

## Quick start

On the robot workstation:

```bash
pipx install git+https://github.com/SamratSahoo/TANDEM.git
tandem init          # builds the planner and perception servers, asks for the robot and cameras
tandem doctor        # every check, with what to do about it
tandem collect       # collect trials of the active task
```

[Installation](installation.md) covers what the workstation and robot need first.

## Documentation

<div class="cards">
  <a class="card" href="/tandem/docs/installation/"><span class="step">Getting started</span><div class="card-title">Installation</div><p>What you need, installing TANDEM and running <code>tandem init</code> on the robot workstation.</p></a>
  <a class="card" href="/tandem/docs/robot/"><span class="step">Getting started</span><div class="card-title">Robot setup</div><p>DROID's server and TiPToP's shim on the NUC, step by step.</p></a>
  <a class="card" href="/tandem/docs/perception-servers/"><span class="step">Getting started</span><div class="card-title">Perception servers</div><p>M2T2 and FoundationStereo, built by <code>tandem init</code> and started by each session.</p></a>
  <a class="card" href="/tandem/docs/cameras/"><span class="step">Getting started</span><div class="card-title">Cameras and calibration</div><p>Camera serials, and the extrinsics each camera needs before collecting.</p></a>
  <a class="card" href="/tandem/docs/teleop/"><span class="step">Getting started</span><div class="card-title">Teleoperation</div><p>The VR teleop driver's environment, which TANDEM builds for you.</p></a>
  <a class="card" href="/tandem/docs/getting-started/"><span class="step">Getting started</span><div class="card-title">Your first collection</div><p>Choose a task, check the plan, collect, review and export.</p></a>
  <a class="card" href="/tandem/docs/collecting/"><span class="step">User guide</span><div class="card-title">Collecting</div><p>The keys at each step, human phases, hand-offs and labels.</p></a>
  <a class="card" href="/tandem/docs/configuration/"><span class="step">User guide</span><div class="card-title">Configuration</div><p>Profiles, phase planning, the rig, TiPToP's options and TANDEM's own settings.</p></a>
  <a class="card" href="/tandem/docs/commands/"><span class="step">Reference</span><div class="card-title">Command reference</div><p>Every <code>tandem</code> command and flag.</p></a>
  <a class="card" href="/tandem/docs/data/"><span class="step">Reference</span><div class="card-title">Data format</div><p>What a trial leaves on disk: videos, robot state, the phase record and logs.</p></a>
  <a class="card" href="/tandem/docs/troubleshooting/"><span class="step">Reference</span><div class="card-title">Troubleshooting</div><p>Common problems, each with the fix first.</p></a>
  <a class="card" href="/tandem/docs/adding-a-planner/"><span class="step">Extending TANDEM</span><div class="card-title">Adding a planner</div><p>Bring your own task and motion planner, in process or as a sidecar.</p></a>
</div>

## Citation

```bibtex
@misc{sahoo2026tandem,
  title  = {{TANDEM}: Task and Motion Planning with As-Needed Demonstrations for Efficient
            Vision-Language-Action Model Fine-tuning},
  author = {Sahoo, Samrat and Ji, Liang and Silver, Tom and Huang, Yixuan},
  year   = {2026}
}
```
