# Collecting

A collection session runs trials of one task, one after another: the robot plans and executes its phases, you teleoperate the human ones, and each trial is labeled and filed. This page covers what you can do at each step.

```bash
tandem collect                            # the active profile, in the terminal
tandem collect my-task -n 20              # another profile; stop after 20 trials
tandem collect --task "stack the cups"    # a different task for this session
tandem collect --no-execute               # plan only; the arm never moves
tandem collect --web                      # drive the session from the browser
```

The session starts the planner once, then repeats: task prompt, trial, label prompt. The footer shows which
keys work at each step.

| state | keys |
|---|---|
| task prompt | `↵` repeat the task, `n` type a new one |
| planning or executing | `p` preempt, `t` take the arm (if teleop is ready) |
| you have the arm | `r` return control |
| human phase | `t` take the arm or run the executor (if ready), `d` I did it (if allowed), `a` give up (aborts) |
| label prompt | `s` or `y` success, `f` or `n` failure |
| any | `q` or Ctrl-C finish |

> **Preempt does not stop motion.** `p` stops further plan steps, but the motion segment already sent still
> finishes ([TiPToP](https://github.com/SamratSahoo/tiptop/tree/TANDEM) has no cooperative stop). Only the E-stop stops the arm at once.

**Preempt** (`p`) files the attempt's legs as aborted. The session stays warm for the next trial.

**Hand-off** (`t` outside a human phase) gives you the arm through teleop at the next plan-step boundary. When
you press `r`, tandem perceives again and replans the phase from where you left the arm, without homing. The
legs merge into one episode.

**Human phase.** The screen says what to do and what a fresh camera image will then check.

- If the check fails, the screen lists what is missing and you get `hitl.verify_retries` more tries.
- `d` is refused while recording, unless
  [`hitl.allow_unrecorded_human_phase`](CONFIGURATION.md#phase-planning-hitl) is true.
- If you don't return control within an hour, tandem ends the leg and takes the arm back.

**Label.** You are asked for one only if the plan ran to the end, or if a check failed under
`hitl.on_verification_failure: label`. [Settled](README.md#terms) trials are filed without a label, with the
reason. `--episodes N` counts labeled trials and part-way failures, but not excluded or aborted ones.

**Finish** (`q`) stops at the next step boundary and parks the arm without opening the gripper.

- A trial still running is filed as aborted.
- A trial waiting at the label prompt stays unmerged in `eval/`. The session prints how to file it:
  `tandem traj merge <trajectory id> --status success`, or `tandem traj relabel` for a one-leg trial.
