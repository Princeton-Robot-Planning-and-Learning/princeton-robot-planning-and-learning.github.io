# Your first collection

After setup ([Installation](installation.md) through [Teleoperation](teleop.md)), collecting data takes four steps: choose a task, check the plan, collect, then review and export.

## Choose a task

```bash
tandem profile use store-bread-in-closed-box
```

A profile is one task in one YAML file, `~/tandem-data/profiles/<name>.yml`. `tandem init` added the paper's
five, each with the settings the paper used: `store-bread-in-closed-box`, `cover-bread-rolls`,
`solve-constrained-puzzle`, `sort-and-cover-snacks` and `open-obstructed-book`.

To make your own with the paper's settings:

```bash
tandem profile create my-task --prompt "put the cup on the plate" --use
tandem profile edit my-task      # optional; validated on save
```

`--from PROFILE` copies an existing profile instead. See [every setting](docs/CONFIGURATION.md#profiles).

> **Keep a hand on the E-stop.** The paper's settings run planned motions at their own pace. The rig's
> `time_dilation_factor` does not slow them down.

## Check the plan

```bash
tandem plan "place the bread inside the box" --image workspace.png
```

This needs only the photo and the [Gemini key](https://aistudio.google.com/apikey). It prints the phases, who does each, each human phase's magic
operator and the invented predicates. `-o LABEL` (repeatable) pins object labels.

If part of the task can't be planned, it says so. Usually an object wasn't detected; put it on the table or
reword the task.

## Collect

```bash
tandem collect   # in the terminal
tandem ui        # or in the browser, at http://127.0.0.1:8787
```

`tandem collect` also takes `--episodes N`, `--task "..."`, `--no-execute` (plan only) and `--no-record`. The
session warms the planner once, then waits for you. The footer shows the keys each state accepts:

| state | keys |
|---|---|
| task prompt | `Enter` runs the task, `n` types a new one |
| planning or executing | `p` preempts, `t` lends you the arm at the next plan-step boundary |
| human phase | `t` takes the arm to teleoperate, `a` gives up, `d` marks it done by hand (refused while recording, by default) |
| you have the arm | `r` gives it back |
| label prompt | `s` success, `f` failure |
| any | `q` ends the session and parks the arm |

> **`p` does not stop the arm.** The current motion segment still finishes. Only the E-stop stops it at once.

When you give the arm back after a `t` hand-off, the planner replans from where you left it. At a human phase,
the screen tells you what to do. When you give the arm back, tandem takes a new camera image to check the step
is done. If it isn't, you get one more try; a trial that still fails is saved as excluded and never exported.

A robot phase the planner can't plan ends the trial. More in [Collecting](collecting.md).

## Review and export

```bash
tandem traj list                                        # newest first; --status eval|success|failure
tandem traj relabel <id> failure                        # move one between success, failure and eval
tandem export lerobot --repo <hf-user>/my-task          # LeRobot v3.0 from success/, in ~/tandem-data/exports/
tandem export lerobot --repo <hf-user>/my-task --push   # and upload it
```

Each trial becomes one episode, with its robot and human legs merged ([on-disk format](docs/DATA.md)).
`--push` needs a [Hugging Face token](https://huggingface.co/settings/tokens): `tandem config set-hf-token`, or `HF_TOKEN`.
