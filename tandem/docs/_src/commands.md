# Command reference

`tandem <command> --help` lists every flag. `[profile]` defaults to the active profile. Global options go
first: `tandem --debug collect` shows full tracebacks, and `--no-color` (or `NO_COLOR`) turns off color.

`--json` works with `doctor`, `plan`, `profile list|show`, `rig show`, `traj list|show`,
`planners list|info|use|default`, `executors list|use`, `runtime status` and `config list`.

## Setup
| command | what it does |
|---|---|
| `tandem init` | Checks, data directory, planner runtime and its [servers](#servers), [Gemini key](https://aistudio.google.com/apikey), [the rig](CONFIGURATION.md#the-rig), [the paper's five](CONFIGURATION.md#the-papers-five) and teleop. Moves [older profiles](CONFIGURATION.md#older-profiles). Skips steps already done. |
| `tandem doctor` | Runs every check and says how to fix what fails. Changes nothing. |

| flag | what it does |
|---|---|
| `init --viz-only` | Set up a laptop for reviewing only: no runtime or robot. |
| `init -y`, `--yes` | Accept every prompt. |
| `init --repair` | Redo the runtime, key, rig and teleop. Never touches a profile. |
| `init --robot-host`, `--robot-type`, `--camera ROLE=SERIAL` | The robot and cameras. `--camera` is repeatable. |
| `init --planner NAME`, `--profile NAME` | The planner, and the profile to make active. |
| `doctor -p`, `--profile` | Check another profile. |
| `doctor --no-hardware` | Skip the robot, camera and perception-server probes. |

Sessions: [`collect`](#collecting), [`plan`](#planning-from-a-photo) and [`ui`](#the-web-ui) have their flags in
their sections. So do [`traj`](#reviewing-and-exporting) and [`export`](#exporting).

## Profiles
`tandem profile list|show|use|edit|path|delete|create|migrate` manages [profiles](CONFIGURATION.md#profiles),
one YAML file each.

| flag | what it does |
|---|---|
| `create NAME --prompt "..."` | A new profile: the paper's settings with your task. |
| `create NAME --from PROFILE` | A copy of another profile. |
| `create --use`, `--force` | Make it active; replace a profile of that name (its trajectories are kept). |
| `show --planner` | Show only what the planner receives. |
| `delete --purge`, `-y` | Also delete its trajectories; skip the confirmation. |

`edit` opens the file in `$EDITOR` and validates it on save. `migrate` moves
[older profiles](CONFIGURATION.md#older-profiles).

## Rig
`tandem rig show|set|edit|path` manages [the robot, camera and calibration settings](CONFIGURATION.md#the-rig).
`set KEY VALUE` takes one dotted key, such as `robot.host`, and `null` removes it. `path --calibration` prints
where the extrinsics file is.

## Planners and executors
| command | what it does and its flags |
|---|---|
| `planners list`, `info NAME` | Every planner and its state; one planner's needs, pinned vs installed commits, goal language and settings. `-p/--profile`. |
| `planners install NAME` | Build or update its [runtime](CONFIGURATION.md#the-planner-runtime). `--sources DIR` ([offline](CONFIGURATION.md#offline-install)), `--force` (refetch and rebuild), `-y/--yes`. |
| `planners remove NAME` | Delete its runtime only. |
| `planners use NAME` | Make a profile plan with it ([settings](CONFIGURATION.md#planner-settings)). `-p/--profile`, `-o/--option KEY=VALUE` (repeatable), `--default` (new profiles too). |
| `planners default NAME` | Set only the planner new profiles get. |
| `planners bundle NAME --out DIR` | Save its pinned sources for an [offline install](CONFIGURATION.md#offline-install). `--only SOURCE` and `--from SOURCE=PATH` (a local checkout), both repeatable; `--archive` (also `DIR.tar.gz`). |
| `planners new NAME` | Scaffold [your own planner](ADDING_A_PLANNER.md#quick-start). `--sidecar`, `--dir DIR`. |
| `executors list`, `use NAME` | Human executors and readiness; set a profile's ([choosing one](ADDING_A_HUMAN_EXECUTOR.md#choosing-one)). `-p/--profile`. |
| `executors install teleop`, `remove teleop` | Build (or delete) the teleop driver's runtime; install also turns teleop on. `install --force` (refetch, rebuild), `--sources DIR`, `-y/--yes`; `remove -y`. |

Planner states are `installed`, `not installed`, `outdated` (built at commits other than the pinned ones),
`no runtime needed` and `broken`. Executor states are `ready`, `needs setup` and `broken`. Each says why when
it isn't ready, and `●` marks the profile's choice.

## Settings and runtime
`tandem config list|get|set|edit|path|set-gemini-key|set-hf-token` manages
[TANDEM's settings](CONFIGURATION.md#tandem-settings-and-credentials). `set KEY VALUE` takes one dotted key,
such as `ui.port`. The `set-*` commands store a credential typed at a prompt, or read it with `--stdin`.
`set-gemini-key --key KEY` also works, but leaves the key in your shell history.

`tandem runtime status|build|shell|python|run|clean|path` works on the active profile's planner runtime.
`--planner NAME` or `-p/--profile` picks another.

```bash
tandem runtime run viz-calibration --camera external   # a planner script, run with your rig settings
```

- `run` and `shell` run the planner's own scripts with your [rig](CONFIGURATION.md#the-rig) settings. `--raw`
  uses the planner's stock config instead.
- TANDEM's options (`--planner`, `-p`, `--raw`) go before the script's name, and the script's own after it.
  `--` still works.
- `build` builds or repairs the runtime (`--force` refetches, plus `--env-only` and `--sources DIR`).
  `python` prints the interpreter, and `clean` deletes the runtime (`-y` skips the confirmation).

## Servers
`tandem servers install|status|start|stop` manages the helper servers the planner calls: [TiPToP](https://github.com/SamratSahoo/tiptop/tree/TANDEM)'s [M2T2](https://github.com/SamratSahoo/M2T2/tree/TANDEM) (grasps)
and [FoundationStereo](https://github.com/SamratSahoo/FoundationStereo/tree/TANDEM) (depth), at the URLs in [the rig](CONFIGURATION.md#tiptop-options). `tandem init` builds
them, and `tandem collect` starts any that are down and stops the ones it started when it ends.

| command | what it does |
|---|---|
| `servers install` | Build their runtimes. `--force` (refetch, rebuild), `--sources DIR`, `-y/--yes`. |
| `servers status` | Whether each is installed and answering, and whether TANDEM started it. `--json`. |
| `servers start [NAME]` | Start those that are down, wait for each to load, and leave them running. |
| `servers stop [NAME]` | Stop the ones TANDEM started, such as after a crashed session. |

`NAME` is `m2t2` or `foundation_stereo`. TANDEM never starts a server whose URL points at another machine.
Each server's log is `server-<name>.log` ([logs](DATA.md#logs-and-session-files)).
