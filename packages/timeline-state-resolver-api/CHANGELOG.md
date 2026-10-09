# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.3.2...10.0.0) (2026-10-05)

### ⚠ BREAKING CHANGES

- remove unused makeReady and standDown flow (#388)
- require >= node 20 (#383)
- support loading TSR devices as 'plugins' (#375)

### Features

- add DeviceStatusDetail type and DeviceStatusInput union ([1fe71c2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/1fe71c247fbd4f03fd5a32659f0491014b516e84))
- basic kairos device ([84b7bda](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/84b7bda00e1d92985729a328102a77ca7e7d377c))
- propagate usages of `DeviceTimelineState` to the conductor ([#411](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/411)) ([5752972](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/57529720d3fbceeaf656c87c9c6534ad354342eb))
- remove unused makeReady and standDown flow ([#388](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/388)) ([b1e561e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b1e561e4294bb34711072f00b9677a9602ca459c))
- require >= node 20 ([#383](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/383)) ([5a59223](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5a5922368672ebe53a30aab39b63295a312a6af1))
- simplify `convertTimelineStateToDeviceState` types ([#400](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/400)) ([982ec31](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/982ec3103e2427afb36473b7607a40bbcec2cc5e))
- support loading TSR devices as 'plugins' ([#375](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/375)) ([ce6dce9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/ce6dce9c168dc760c77aaa66a5f6eba1363f8c68))
- TSR Device Feedback ([#456](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/456)) ([59ce433](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/59ce43391f80866cb8e5c50f3aa2b3675a7b8344))

### Bug Fixes

- cleanup async that isn't, and fix `setModifiedState` ([c347227](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c34722765d6ce49bceacd5638899f6d4e70dd151))
- **kairos:** if theres an Error when using a still/ramrec, try to LOAD it and try again ([9509c49](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9509c499c469fe854b910705efd6ffbb724071dc))
- shared control undefined state ([#419](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/419)) ([a03f88d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/a03f88d9783e87701e085e269cde619332366924))
- update minimum nodejs to 22 ([#429](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/429)) ([c174540](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c1745408cdb0dcbcb14fa0410f4e46287af5aec3))
