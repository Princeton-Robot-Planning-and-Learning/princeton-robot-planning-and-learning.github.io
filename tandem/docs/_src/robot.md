# Robot setup

The NUC runs two programs: [DROID](https://github.com/SamratSahoo/droid/tree/TANDEM)'s server, which drives the arm and gripper through [polymetis](https://facebookresearch.github.io/fairo/polymetis/)
(teleop uses it), and [TiPToP](https://github.com/SamratSahoo/tiptop/tree/TANDEM)'s [shim](https://github.com/SamratSahoo/tiptop/blob/682047493b88e5301c6b2b49da914ea4f173e5d9/bamboo_polymetis_shim.py), which the planner uses to control the arm. Do steps 1–4 on the NUC.

1. **Install DROID.** Follow DROID's NUC guide
   ([Docker](https://github.com/SamratSahoo/droid/blob/TANDEM/docs/software-setup/docker.md) or
   [host](https://github.com/SamratSahoo/droid/blob/TANDEM/docs/software-setup/host-installation.md)), using the
   `TANDEM` branch of the fork:

   ```bash
   git clone -b TANDEM --recurse-submodules https://github.com/SamratSahoo/droid.git
   ```

   Its ["Configure Parameters"](https://github.com/SamratSahoo/droid/blob/TANDEM/docs/software-setup/docker.md#configure-parameters) step sets `robot_ip` (the arm's control box) and `sudo_password` in
   [`droid/misc/parameters.py`](https://github.com/SamratSahoo/droid/blob/TANDEM/droid/misc/parameters.py). The server needs both.

2. **Add TiPToP's shim.** In the DROID checkout, with DROID's polymetis environment active:

   ```bash
   curl -LO https://raw.githubusercontent.com/SamratSahoo/tiptop/682047493b88e5301c6b2b49da914ea4f173e5d9/bamboo_polymetis_shim.py
   pip install pyzmq msgpack
   ```

3. **Start DROID's server** in one terminal:

   ```bash
   python scripts/server/run_server.py
   ```

   It starts polymetis's robot server (port 50051) and gripper server (port 50052), replacing any already
   running.

4. **Start the shim** in a second terminal:

   ```bash
   python bamboo_polymetis_shim.py
   ```

   Its log should show `PolymetisGripper connected to localhost:50052`. It listens on ports 5555 (control),
   5557 (state) and 5559 (gripper).

5. **Check from the workstation:**

   ```bash
   tandem doctor
   ```

   The robot rows should pass. If the NUC's address is wrong, run `tandem rig set robot.host NUC_ADDRESS`, with your NUC's IP address or hostname.

Leave both terminals running while you collect. Steps 3 and 4 are needed again after the NUC restarts.
