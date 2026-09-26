# Reviewing and exporting

Every trial is filed under `success/`, `failure/` or `eval/`. These commands list, replay and refile them, and export the successes as a LeRobot dataset.

```bash
tandem traj list -s success -n 0        # every success, newest first
tandem traj open <id>                   # replay one in its planner's viewer (TiPToP: Rerun)
tandem traj relabel <id> failure        # move it to success, failure or eval
```

`<id>` is a trajectory's directory name (a timestamp) or a unique prefix of it. Every `traj` command except
`list` takes `-p/--profile`.

| command | what it does |
|---|---|
| `traj list [profile]` | Newest first. `-s/--status eval\|success\|failure`; `-n N` shows N (default 30, `0` for all). |
| `traj show <id>` | One trajectory in detail. |
| `traj open <id>` | Replay in its planner's viewer. |
| `traj relabel <id> <status>` | Move it to `success`, `failure` or `eval`. |
| `traj merge [<trajectory id>]` | Re-join a trial's legs after a failed merge. `--status STATUS` files the result. |
| `traj copy <id> <profile>` | Copy it into another profile. |
| `traj rm <id>` | Delete it. `-y` skips the confirmation. |
| `traj path <id>` | Print its directory. |

**Relabeling a settled trial.** `relabel ... success` refuses a trial tandem settled. `--force` overrules it
(the web UI asks you to confirm), and `hitl.json` records it as `overruled`. This is the only way to export an
excluded trial.

**Merging** takes the trial's `trajectory_id` from `_meta.json`, not the timestamp. With no id, it merges every
trial that has unmerged legs.

## Exporting
```bash
tandem export lerobot --repo <owner>/<name>          # writes ~/tandem-data/exports/<owner>/<name>
tandem export lerobot --repo <owner>/<name> --push   # and uploads it
tandem export manifest --out index.json              # a JSON index of the trajectories (default: stdout)
```

`export lerobot` writes a [LeRobot](https://github.com/huggingface/lerobot) v3.0 dataset in [`lerobot/droid_1.0.1`](https://huggingface.co/datasets/lerobot/droid_1.0.1)'s schema, for [π₀.₅-DROID](https://github.com/Physical-Intelligence/openpi) fine-tuning.
Each run is logged to `export.log` ([logs](DATA.md#logs-and-session-files)).

**Only `success/` is exported.** These are skipped, each with its reason:

- settled trials, unless a forced relabel overruled them;
- episodes whose `cmd_gripper` isn't binary;
- episodes missing an exterior or wrist video;
- episodes whose state arrays don't fit [DROID](https://droid-dataset.github.io/)'s schema.

What goes into each episode:

- **Action:** `cmd_joint_velocity`, clipped to [-1, 1] and never rescaled, plus `cmd_gripper`.
  `action_joint_velocity` (in `robot_state.npz`) isn't exported.
- **Task:** the episode's `instruction` from `_meta.json`, else the profile's `task.prompt`.
- **Cameras:** without `external_2`, the first exterior video fills both exterior slots.

| flag | what it does |
|---|---|
| `--repo OWNER/NAME` | The dataset. The default is the profile's `export.hf_repo`. `hf_org` fills in a missing owner. |
| `--out DIR` | Write to `DIR/<owner>/<name>` instead. |
| `-n`, `--max-episodes N` | Export only the first N. |
| `--push` | Upload after building. Needs a Hugging Face token ([where tandem looks](CONFIGURATION.md#tandem-settings-and-credentials)). |
| `--private`, `--public` | Visibility when pushing. The default is the profile's `export.private`. |
| `--force` | Replace whatever is at the destination. Without it, a rebuild replaces only a dataset tandem built, and only once the new one is complete. |
