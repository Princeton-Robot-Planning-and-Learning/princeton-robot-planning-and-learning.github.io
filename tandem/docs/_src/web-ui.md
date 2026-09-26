# Web UI

The web UI does everything the terminal does, plus video review of every trajectory.

```bash
tandem ui                    # http://127.0.0.1:8787, or the next free port
tandem ui --port 9000 --no-open
```

The UI needs no Node, CDN, GPU or robot. `ui.host`, `ui.port` and `ui.open_browser` set its defaults. Ctrl-C
lets running sessions park the arm and finish merging. A second Ctrl-C quits at once and leaves the arm where
it is.

- **Trajectories:** click a plot to seek every video. A merged trajectory's ribbon shows who drove each
  stretch. Shaded bands mark the frames π₀.₅-DROID's training drops as idle.
- **Collect:** the same controls as the terminal. Anything the plan leaves out is shown before the arm moves,
  and you can review the trial right at the label prompt.
- **Profiles:** the paper's five and your own. You can create one from a task or as a copy, edit it, and see
  what its planner receives.
- **Settings:** the rig (robot, cameras, calibration, each planner's machine settings), credentials, paths,
  catalogs, runtime status and `tandem doctor`.

Flags: `-p/--port`, `--host`, `--no-open`, and `--profile` (open on a profile and make it active).

## HTTP API
```bash
curl http://127.0.0.1:8787/api/rig
curl -X PATCH http://127.0.0.1:8787/api/rig -H 'Content-Type: application/json' \
     -d '{"robot.host": "NUC_ADDRESS", "cameras.external_2": null}'
```

| route | returns or does |
|---|---|
| `GET /api/planners[/{name}]`, `GET /api/executors` | Same as `planners list\|info --json` and `executors list --json`. Add `?profile=P` for another profile. |
| `POST /api/planners/{name}/use\|default`, `POST /api/executors/{name}/use` | Same as `planners use` (optional body: `profile`, `options`), `planners default` and `executors use` (optional body: `profile`). |
| `GET /api/profiles/{name}` | The profile, plus `planner_view.receives` (as `profile show --planner`). Each card in `GET /api/profiles` has a `planner_summary` line. |
| `POST /api/profiles` | Same as `profile create`. Body `{name, prompt}` uses the paper's settings; `{name, from}` copies a profile (`prompt` optional). `POST /api/profiles/builtin` adds the paper's five, as `init` does. |
| `GET /api/rig`, `PATCH /api/rig` | Same as `rig show --json`, and `rig set` for several keys at once. |
| `GET /api/sessions/{id}` | The [session summary](DATA.md#session-summary) and its last 500 log lines. |
| `GET /api/media/{profile}/{id}/{file}` | A trajectory video, served with HTTP Range. A proxy in front must pass `Range` headers. |

The API can't install a planner. Each catalog row includes the `install_command` to run instead.
