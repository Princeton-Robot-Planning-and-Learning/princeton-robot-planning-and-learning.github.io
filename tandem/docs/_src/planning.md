# Planning from a photo

`tandem plan` shows how a task will be split into robot and human phases, from one photo of the workspace, before you collect. It needs no robot, GPU or planner runtime.

```bash
tandem plan "place the bread inside the box" --image workspace.png -o bread -o box -o plate
```

This previews a task's phases before you collect. It prints who does each phase, each phase's goal or magic
operator, and the invented predicates. It needs only tandem (Python 3.10+) and a
[Gemini key](CONFIGURATION.md#tandem-settings-and-credentials): no runtime, GPU or robot. Answers vary between
runs.

**It tells you if part of the instruction can't be planned.** Usually an object wasn't detected; put it on
the table or reword the task.

| flag | what it does |
|---|---|
| `-i`, `--image PHOTO` | The workspace photo. Required. |
| `-o`, `--object LABEL` | Pin an object label. Repeatable. Without it, a vision model names the objects. A session's labels reproduce its plan. |
| `-p`, `--profile P` | Take the planning settings and planner from this profile. |
| `-b`, `--planner NAME` | Plan in this planner's goal language. The default is the profile's planner, else the machine's. `--backend` is an older alias. |
| `--table NAME` | What the planner calls the table. The default is `table`. |
| `--json` | Print the record that `hitl.json` is written from. |
| `--save-vlm-io DIR` | Keep every image sent to the model, and its reply, in `DIR`. |

## From Python
```python
import tandem

plan = tandem.plan_task("place the bread inside the box", "workspace.png", objects=["bread", "box", "plate"])
for phase in plan.phases:
    print(phase.executor, phase.description, phase.atoms)
```

- `plan_task` returns a `PhasePlan` with `.phases`, `.spec` and `.to_json()`. Each phase has `.executor`,
  `.description` and `.atoms`.
- The image can be a path, a PIL image or an RGB `uint8` array.
- The keywords match the flags (`planner`, `profile`, `table`, `save_vlm_io`), plus `config` (a
  `PlanningConfig`).
- Inside a running event loop, use `await tandem.plan_task_async(...)`.

`import tandem` also exports `Planner`, `SidecarPlanner`, `Capabilities`, `PlannerInfo`, `Predicate`,
`Parameter`, `RuntimeRecipe`, `register_backend` (alias `register_planner`), `register_human_executor` and
`TandemError`.
