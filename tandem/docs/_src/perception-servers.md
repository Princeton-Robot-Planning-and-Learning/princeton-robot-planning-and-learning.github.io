# Perception servers

[TiPToP](https://github.com/SamratSahoo/tiptop/tree/TANDEM) asks two servers on every rollout: [M2T2](https://github.com/SamratSahoo/M2T2/tree/TANDEM) for grasps
and [FoundationStereo](https://github.com/SamratSahoo/FoundationStereo/tree/TANDEM) for depth. `tandem init`
builds both, with torch compiled for your GPU and their model weights. You don't need to start them yourself:
`tandem collect` starts any server that isn't running before the session warms up, and stops the ones it
started when the session ends.

```bash
tandem servers status   # installed? answering?
tandem servers start    # start them ahead of time; they keep running until `tandem servers stop`
```

If the perception servers are on another machine, point tandem at it:

```bash
tandem rig set planners.tiptop.perception.m2t2.url http://HOST:8123
tandem rig set planners.tiptop.perception.foundation_stereo.url http://HOST:1234
```
