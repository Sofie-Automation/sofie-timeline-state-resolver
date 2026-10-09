# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [10.0.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.3.2...10.0.0) (2026-10-05)

### ⚠ BREAKING CHANGES

- remove unused makeReady and standDown flow (#388)
- require >= node 20 (#383)
- support loading TSR devices as 'plugins' (#375)

### Features

- Add Atem Action: runMacro (based on release53) ([9652866](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9652866043214527cffb068c3e586f1860695097))
- add clip player support ([5e90e92](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5e90e92e62c018b7abf2a109fde416d9fb7df4f7))
- add code and context fields to ActionExecutionResult for structured action errors ([a0520d1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/a0520d1db31ecc3a4ad681946511208b34bdbe37))
- add DeviceStatusDetail type and DeviceStatusInput union ([1fe71c2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/1fe71c247fbd4f03fd5a32659f0491014b516e84))
- add list-actions to kairos device ([ff22ff6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/ff22ff6a2a01a665c74647053cd9c32d9e1bc2a5))
- add some tsr-actions ([ef6f712](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/ef6f71258e7c61e4bb86b3d84aadec375520b6fb))
- add structured action error codes to CasparCG device ([fa04a27](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/fa04a27bd100b62a73cec0107bafcb3c34df9cc5))
- add structured action error codes to HTTP Send device ([b45b825](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b45b825331c074f7abdfb477110875d274e494a2))
- add structured status messages for ATEM integration ([ee0c6f5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/ee0c6f5c5b3be2613f3c705a49a03e29af1382dc))
- add structured status messages for CasparCG integration ([8eb6bf3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8eb6bf314bf67106247a82a75931f058ce8a86ea))
- add structured status messages for HTTPWatcher integration ([c41cdc0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c41cdc0f2178daeca959f5dc2db02034febaeae7))
- add structured status messages for Hyperdeck integration ([856b52f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/856b52f0f5db67758c0e6c26fa1dcc449287c3a9))
- add structured status messages for Lawo integration ([fe49c2a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/fe49c2a594d26e68defe14e9b055a1242a490457))
- add structured status messages for OBS integration ([c18334a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c18334a291c7cfa0c1a2c8fb004e739f093c04d3))
- add structured status messages for OSC integration ([aa7813f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/aa7813f24c5a44b050baca4bf382783c89f762e7))
- add structured status messages for Panasonic PTZ integration ([2b06a4d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/2b06a4ddd7cac6889cb0a65d0dd0fdde46974c89))
- add structured status messages for Pharos integration ([98bd264](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/98bd2646222be90c4ae3e97484049eb428a65f7d))
- add structured status messages for Quantel integration ([91858a1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/91858a125a75d1742e427bba01c95c78d68a4c9d))
- add structured status messages for Shotoku integration ([1efec39](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/1efec3978fe88bf0a1e72a058793d9db1e26d414))
- add structured status messages for Sisyfos integration ([59d3040](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/59d304039b242a56023475ae9ac77382096d93f0))
- add structured status messages for Sofie Chef integration ([9bb6315](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9bb6315016907fd1328cc782ce45ff29aa47f756))
- add structured status messages for Telemetrics integration ([3bcb335](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3bcb3359d3e917f71a46604ff5ceb45029302f29))
- add structured status messages for TriCaster integration ([b1a1fc7](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b1a1fc786f429a715c40f894e5b1641d9c5c0269))
- add structured status messages for VizMSE integration ([79bf158](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/79bf158209909bf5d006460a3e7164be2ea9f370))
- add structured status messages for vMix integration ([8c74a04](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8c74a045ef2724541f79f0c72a6c3896eec547f6))
- add structured status messages for WebSocket Client integration ([f8a8172](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f8a81728a7f77364edc268b063e0888462f93455))
- add support for kairos layer effects ([#454](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/454)) ([5d8cbe2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5d8cbe2c016ade31da0e373608cd8264abc9834e))
- basic kairos device ([84b7bda](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/84b7bda00e1d92985729a328102a77ca7e7d377c))
- casparcg scaleMode support ([#447](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/447)) ([6e8e545](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6e8e5451607dfd30d58083aa7b2ffd4b3595294f))
- **EAV-468:** add `disableDefaults` option to sisyfos mappings ([d92b9c2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d92b9c2c14edfe2169868622828f7424e5a653f3))
- **EAV-493:** add basic support for vMix audio buses ([9166efc](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9166efc560998c6251e366c32227da3f2dffd645))
- **EAV-516:** reload browser input ([36682ec](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/36682ec9d907a01a50315173a7d46f9b9eb9fa7c))
- **EAV-539:** add basic vMix replay support ([4c32364](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4c32364d3a9fc71f423c59a2a28203d51988cd13))
- generate some more repetitive parts of tsr-types ([#385](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/385)) ([5ff702c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5ff702c6c6ef7810932f4634bcb8d0d6f2a1268c))
- implement "still-player" ie "imageStore" ([1882633](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/188263322430c043a8d73d9322949a434257b723))
- implement udpsend device ([64fb7c2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/64fb7c2388beb9732037471fc7c498546b56b413))
- include atem chroma keyer in upstreamkeyer ([#415](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/415)) ([309a846](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/309a846a42d0e3386399269c8d6a2d75dff8cc0c))
- kairos temporal priority based on dependency graph ([19b1a7a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/19b1a7a6754ca246ac04164cbad8d589993341d1))
- Kairos: Allow references to layer-mappings to be used as sources ([0457ef4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0457ef453383aba7fbc5d0d503c3b1d9a0d67391))
- **kairos:** Monitor Kairos status ([9b3859f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9b3859f0ce811099dcc0fb56637ad21410db49fe))
- lookahead offset ([#413](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/413)) ([04b075e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/04b075e87c98643f08bf3edf53982794e15e8cac))
- make tsr action execution methods be strongly typed ([eada9c8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/eada9c81fc9cc309343585479fb2ce9812606a41))
- Make USKs to be their own mapping ([d4a7b59](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d4a7b596bd7a6e80e568a914ce1d8951f9f5e9e5))
- OGraf integration ([c0545d7](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c0545d7a9d708d8f49edb69f10d82391f08240b4))
- propagate usages of `DeviceTimelineState` to the conductor ([#411](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/411)) ([5752972](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/57529720d3fbceeaf656c87c9c6534ad354342eb))
- reassert control over shared hardware ([335f2c8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/335f2c82c781811954a8578f04680abf13f4fa49))
- remove optional tcp in websocket connection ([0b61576](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0b61576e09193fa8c41221a032e06895e9a0a3dd))
- remove unused makeReady and standDown flow ([#388](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/388)) ([b1e561e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b1e561e4294bb34711072f00b9677a9602ca459c))
- require >= node 20 ([#383](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/383)) ([5a59223](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5a5922368672ebe53a30aab39b63295a312a6af1))
- simplify `convertTimelineStateToDeviceState` types ([#400](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/400)) ([982ec31](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/982ec3103e2427afb36473b7607a40bbcec2cc5e))
- support custom types from tsr plugins ([#412](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/412)) ([6b68c91](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6b68c9145f8a5222390b515cc08d2104d4fdcb44))
- support loading TSR devices as 'plugins' ([#375](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/375)) ([ce6dce9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/ce6dce9c168dc760c77aaa66a5f6eba1363f8c68))
- switcher overlay control ([0a44638](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0a44638685315d7cb4f45d44b5f7a2e46aa8c30d))
- Track conflicts between old and new USK support ([aa6ccb6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/aa6ccb613f97b76b5a36f60bee301d87549ba4f2))
- TSR Device Feedback ([#456](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/456)) ([59ce433](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/59ce43391f80866cb8e5c50f3aa2b3675a7b8344))
- update of documentation and implementation of state and device commands ([8e65e45](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8e65e4526afcd7a876eb38e97ed0523a8aff0d7a))
- update tsr types mock to include the websocketTcpClient ([75c6903](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/75c6903412a45dfa7f15fcc94e6cf5888596c5ae))
- use script engine for advanced media control ([08bea2e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/08bea2ef4fcb98e831277fd75ef64256f7ece567))
- vindral clip playback ([02f9aab](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/02f9aabaf2af2af74f2f072a3553d4aacfdf5260))
- vindral composer integration ([5521ffe](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5521ffe3b3382a9b7cefdec13e3c1dc971cc800a))
- vindral switcher mapping ([1d3805b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/1d3805b3ce90077d5d00509b68e1d72d0e619356))
- **vmix:** enable cuts through the ActiveInput command ([b24d78c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b24d78c9e490166e5290588c4f53049dcf6522ce))
- websocketclient move buffer encoding to options ([fc514a3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/fc514a3384309016400dd8ab48f5591ad896f3d8))
- WebsocketTcpClient ([be244ed](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/be244edff730775a39b54161dbdf4f382803ce42))
- websockettcpclient move actions to schema ([c2afeeb](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c2afeebdcad63d9cc135cf332fa0d939fce3d49a))
- websockettcpclient move options to schema ([dfb7036](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/dfb70368b498622a09df6751419e5abf416aa5ee))

### Bug Fixes

- add extendable DeviceOptionsMap type for tsr-plugins ([#440](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/440)) ([5904de2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5904de261db621f0d0be1fce2687641f02de2d80))
- add utils for extracting action payload and result types ([87bac1d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/87bac1dc6e7a68fb5c6d257e9327ddc80f8ac4f0))
- cut+crossfade not applying when backgroudn changes ([94bee99](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/94bee99381910344c638ad8a42765c4e3024d40a))
- **EAV-527:** delay slow vMix commands from lookaheads ([12074fd](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/12074fd4d0263046abb57d485c6e423cd5da9d94))
- generated websocketTcpClient types updated ([9f954d1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9f954d17793a3829a44357ef3a6a0945d7c4c9f6))
- improve KairosMonitor ([0b9754f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0b9754f4a63f8bf98d3326bee510401611d0c577))
- **kairos:** if theres an Error when using a still/ramrec, try to LOAD it and try again ([9509c49](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9509c499c469fe854b910705efd6ffbb724071dc))
- linting ([523ab60](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/523ab60d486dea5faba15a20fefe3f89c56d9a73))
- move functions related to Datastore to TSR-types. ([300c92f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/300c92f94705cff2176c1077c61a9c93e188d543))
- move functions related to TemplateString to TSR-types. ([af4b98e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/af4b98ea790de56ad06100462d6b2bd6c43e69aa))
- remove encoding option as this is included in command ([990c868](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/990c86838f4723f02c71cceb378e06179143ca90))
- restore Actions enums ([b8480ce](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b8480ce705aa83c22ba99b7bdce4568bca986e4c))
- rework generated types to minimise variation in type union ([#430](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/430)) ([59ac9d9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/59ac9d9519723f3ac3850e4ff083ddf787ec04d5))
- rework generated types to minimise variation in type union ([#430](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/430)) ([0a476f2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0a476f2045a0f03dfc329f3ab5eb4554fcebdb5d))
- shared control undefined state ([#419](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/419)) ([a03f88d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/a03f88d9783e87701e085e269cde619332366924))
- simplify action methods signature ([db18b56](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/db18b56beb46e23e587d73f04058d697f7fe4ae2))
- supertimeline type mismatch ([#421](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/421)) ([651ad0d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/651ad0d5af984ea1148f883a979e1fa4777e3fc7))
- type name in timeline for tcp was still command ([d045fa3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d045fa36aef3fe73dbdfdd449ecd93015b2b4f6a))
- update minimum nodejs to 22 ([#429](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/429)) ([c174540](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c1745408cdb0dcbcb14fa0410f4e46287af5aec3))
- websocketclient bufferEnc option should be optional ([f877542](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f87754256d54c27dbbd072f1fc2fce3bce1a65c6))

### [9.3.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.3.1...9.3.2) (2025-09-02)

**Note:** Version bump only for package timeline-state-resolver-types

### [9.3.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.3.0...9.3.1) (2025-08-12)

**Note:** Version bump only for package timeline-state-resolver-types

## [9.3.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.2.2...9.3.0) (2025-06-30)

## [9.3.0-release52.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.3.0-release52.1...9.3.0-release52.2) (2025-04-10)

## [9.3.0-release52.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.3.0-release52.0...9.3.0-release52.1) (2025-03-12)

## [9.3.0-release52.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.2.1...9.3.0-release52.0) (2025-02-04)

### Features

- **atem:** add stinger support ([d4378e1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d4378e1ee99462c5abbdb84c999647d6420365bb))
- **EAV-266:** add more PTZ actions for obtaining values ([bd336f2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/bd336f24eae8cdbaef1c8f77d1e3ec5029839675))
- **EAV-266:** add return types to PTZ actions ([5299a2b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5299a2b67ba09402a804efff1fd59e4aa544a039))
- **EAV-266:** implement Panasonic PTZ actions ([b7cccbf](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b7cccbfe19c093afa03ea14d663dd545c404f81b))
- **EAV-321:** support browser source url in vMix ([db67a61](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/db67a618b7649d039a123d80e9c109e00ce3e94b))
- **EAV-343:** support index (list, photo, virtual set) in vMix ([02db182](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/02db182ec8d60a444e8c667fc6ff36ee2f4de0ad))
- **EAV-410:** add sisyfos action to load mixer preset ([8895f87](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8895f8710458139fa60c2ab1cb09a94daad5a862))
- **EAV-411:** support setting text in vMix titles ([41c1f93](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/41c1f9312d74403a65cfcc2b04ba12a6392d6511))
- **EAV-423:** add actions to start and stop External in vMix ([e002d0f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e002d0fbcabd3ea7102abc3a40524b884b6d64ff))
- **EAV-464:** add images support for GT titles in vMix ([8905200](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/89052002c322d6515b3a91d32d4ba062e7ebf0db))
- http url interpolation SOFIE-3310 ([#342](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/342)) ([01593a3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/01593a34898c1ecc8de3544545efba69fa69d5b8))
- SetSisyfosChannelState action implemented ([685fbf9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/685fbf9cc967f8c0fc767f32d0245f0a5527cc6f))
- Sisyfos - remove re-sync channel functionality. (triggerValue has the functionality) ([4e77eb2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4e77eb27c5123e2a01d5960d15557384b81327c3))
- Sisyfos add support for mute, gain, selector in triggerValues. Refactor SET_CHANNEL ([25c6516](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/25c6516f38c8e5f5d005fdd1fba2c264537340f6))

### Bug Fixes

- actions.json payload format ([116bd76](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/116bd765e91ef6257365c11549836792f67cfc1f))
- add mute, inputgain, inputselector to Sisyfos channel option types ([5f5115e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5f5115e89d9eeff849d983c9491e80534d475a0e))
- Sisyfos add triggerValue to TimelineContentSisyfosChannel ([3cb6f70](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3cb6f70f847297157459906000e78f0e1ecfebcf))
- **sisyfos:** trigger value per channel ([54734d5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/54734d51d986f408acb8b20fb1a1e44666b3f347))

## [9.3.0-release52.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.3.0-release52.1...9.3.0-release52.2) (2025-04-10)

**Note:** Version bump only for package timeline-state-resolver-types

## [9.3.0-release52.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.3.0-release52.0...9.3.0-release52.1) (2025-03-12)

**Note:** Version bump only for package timeline-state-resolver-types

## [9.3.0-release52.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.2.1...9.3.0-release52.0) (2025-02-04)

### Features

- **atem:** add stinger support ([d4378e1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d4378e1ee99462c5abbdb84c999647d6420365bb))
- **EAV-266:** add more PTZ actions for obtaining values ([bd336f2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/bd336f24eae8cdbaef1c8f77d1e3ec5029839675))
- **EAV-266:** add return types to PTZ actions ([5299a2b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5299a2b67ba09402a804efff1fd59e4aa544a039))
- **EAV-266:** implement Panasonic PTZ actions ([b7cccbf](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b7cccbfe19c093afa03ea14d663dd545c404f81b))
- **EAV-321:** support browser source url in vMix ([db67a61](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/db67a618b7649d039a123d80e9c109e00ce3e94b))
- **EAV-343:** support index (list, photo, virtual set) in vMix ([02db182](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/02db182ec8d60a444e8c667fc6ff36ee2f4de0ad))
- **EAV-410:** add sisyfos action to load mixer preset ([8895f87](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8895f8710458139fa60c2ab1cb09a94daad5a862))
- **EAV-411:** support setting text in vMix titles ([41c1f93](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/41c1f9312d74403a65cfcc2b04ba12a6392d6511))
- **EAV-423:** add actions to start and stop External in vMix ([e002d0f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e002d0fbcabd3ea7102abc3a40524b884b6d64ff))
- **EAV-464:** add images support for GT titles in vMix ([8905200](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/89052002c322d6515b3a91d32d4ba062e7ebf0db))
- http url interpolation SOFIE-3310 ([#342](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/342)) ([01593a3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/01593a34898c1ecc8de3544545efba69fa69d5b8))
- SetSisyfosChannelState action implemented ([685fbf9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/685fbf9cc967f8c0fc767f32d0245f0a5527cc6f))
- Sisyfos - remove re-sync channel functionality. (triggerValue has the functionality) ([4e77eb2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4e77eb27c5123e2a01d5960d15557384b81327c3))
- Sisyfos add support for mute, gain, selector in triggerValues. Refactor SET_CHANNEL ([25c6516](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/25c6516f38c8e5f5d005fdd1fba2c264537340f6))

### Bug Fixes

- actions.json payload format ([116bd76](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/116bd765e91ef6257365c11549836792f67cfc1f))
- add mute, inputgain, inputselector to Sisyfos channel option types ([5f5115e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5f5115e89d9eeff849d983c9491e80534d475a0e))
- Sisyfos add triggerValue to TimelineContentSisyfosChannel ([3cb6f70](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3cb6f70f847297157459906000e78f0e1ecfebcf))
- **sisyfos:** trigger value per channel ([54734d5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/54734d51d986f408acb8b20fb1a1e44666b3f347))

### [9.2.0-release52](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.1.0...9.2.0-release52) (2024-08-19)

## [9.2.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.2.0-alpha.0...9.2.0) (2024-10-07)

**Note:** Version bump only for package timeline-state-resolver-types

## [9.2.0-alpha.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.1.0...9.2.0-alpha.0) (2024-09-09)

### Features

- allow sequential executionMode to paralelize multiple queues of Commands ([84a53cd](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/84a53cd5f1ee0978767d46ad766c01841559983d))

## [9.1.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.2...9.1.0) (2024-08-19)

### Features

- add "returnData" to action schema ([529bcb3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/529bcb3157f2e583c077dd54787d0c3ea4a25905))
- atem color generator support SOFIE-2968 ([#322](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/322)) ([b7ceb69](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b7ceb6950c875ff123dcc9bdd58a45c7922045d2))
- **EAV-243:** add OAuth (Client Credentials grant) and Bearer Token to HTTPSend ([8fef807](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8fef807e31c7b65d1017d772ba2e0a441f899226))
- **EAV-243:** add oauth token path option for a broader support ([76592f2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/76592f29d53b1ce5b64ddd1c283f7f045c155da3))
- **EAV-269:** add vMix input layers props and commands ([1bcf056](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/1bcf056a70ed7932c1c5588fdad17f1c25d32832))
- **httpSend:** Proxy support ([6dc4c59](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6dc4c59424242b1ea6681c27c0647a9afaae7c17))
- **HTTPSend:** return response data from HTTP SendCommand action ([#334](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/334)) ([d220c78](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d220c786ea3ae139a690d741dcfdf9d8f0c8511f))
- refactor pharos device SOFIE-2488 ([#333](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/333)) ([d57812c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d57812c2b2519635cadb7279803601f06918f91c))
- support timeline v9 ([3ccc759](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3ccc759f6d2d64cc2f3ca861634d96b427076490))

### Bug Fixes

- add missing typings for atem dve ([#305](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/305)) ([1758ffc](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/1758ffc229e8162efad5261dad8a83d69cf61747))
- CasparCG: add listMedia action (wip) ([f4277ad](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f4277ad5515d13803f9850b61b5110f7b8573706))
- **EAV-269:** default to vMix layers instead of deprecated overlays ([dc719c8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/dc719c8b105d88faf085daf059faef5b17dd03d0))
- missing httpsend enums ([920da05](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/920da0506cd9f2142d0edabfd9894ccd88d288cf))
- suppress quantel disconnect shortly ([9b6621d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9b6621dff7d358e8d7870af304678beb3c197987))
- update casparcg-connection dependency ([e209ba8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e209ba822f9f026018a51d70498e0feb3a94473e))

## [9.0.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.1...9.0.2) (2024-08-15)

**Note:** Version bump only for package timeline-state-resolver-types

## [9.0.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0...9.0.1) (2024-04-02)

**Note:** Version bump only for package timeline-state-resolver-types

## [9.0.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.8...9.0.0) (2024-02-23)

**Note:** Version bump only for package timeline-state-resolver-types

## [9.0.0-release50.8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.1.4...9.0.0-release50.8) (2024-02-02)

## [9.0.0-release50.7](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.1.0...9.0.0-release50.7) (2023-11-17)

### Features

- changes the logic for setting a pollInterval ([a482e57](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/a482e57e2a647de9421898df3fb061cf28c74408)), closes [#277](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/277)

### Bug Fixes

- remove unused casparcg useScheduling option ([#294](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/294)) ([06d3c96](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/06d3c967d2da012aa2f6655c34d382201a45cab8))

## [9.0.0-release50.6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.5...9.0.0-release50.6) (2023-08-25)

### Bug Fixes

- **httpSend:** Use the same types for the sendCommand action as a timeline object ([#269](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/269)) ([3385217](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3385217afcb6e45aa37123f5400d1dea4a0c8972))
- **vmix:** fix scenario where the media load retry system would load clips into playlists twice ([8ceddb2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8ceddb291ac3e25cc77f8cb77fa58f67d9167f4c))

## [9.0.0-release50.5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.4...9.0.0-release50.5) (2023-07-03)

## [9.0.0-release50.4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.3...9.0.0-release50.4) (2023-07-03)

## [9.0.0-release50.3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.2...9.0.0-release50.3) (2023-07-03)

## [9.0.0-release50.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.1...9.0.0-release50.2) (2023-07-03)

## [9.0.0-release50.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.0...9.0.0-release50.1) (2023-07-03)

## [9.0.0-release50.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/3.5.1...9.0.0-release50.0) (2023-07-03)

### ⚠ BREAKING CHANGES

- DeviceType enum has been changed from a number-based to a string-based one

### Features

- add restart command to vMix inputs ([e16e8c1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e16e8c14d263fffc8e004bf9f06cdde6073e16b2))
- DeviceType enum has been changed from a number-based to a string-based one ([dd03bcc](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/dd03bcc7a0f246ff62ccd09091003195c97e4dc1))
- upgrade singular.live to API v2 ([2bb5c4d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/2bb5c4d2557710d55b27556cef919dc8419fa1e9))
- Use strings for DeviceType enum ([f1b95bc](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f1b95bcb972aff329bce9c67b15f58a98bbf48cf))
- **vMix:** retry sending media load commands if the file wasn't found ([4321aae](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4321aae2684ba4c7f55e3cf810dacae187fe282b))

### Bug Fixes

- add types support for vMix stingers 3 and 4 ([44fa27d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/44fa27d164bd717b58d7f1d1255d56d132007865))

## [3.5.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.0.0-release49.0...3.5.1) (2023-03-31)

### ⚠ BREAKING CHANGES

- json schemas for device config and mappings (#237)

### Features

- json schemas for device config and mappings ([#237](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/237)) ([d43f3dc](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d43f3dc70f5c8843081760846e9aa38fa4c71396))
- replace makeready ([5abe41e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5abe41eaa421db4845a54837b2e3b41f2b33d062))
- SOF-1254 add me_clean support for mix ouputs ([7f3fb9c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/7f3fb9c7d9edb03022db69c6e206302c5c69a815))
- SOF-1254 add temporal priority to TriCaster ([7133774](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/7133774a49e03a038d91a9ec8fd8d0f13cbd962c))

## [9.0.0-release50.7](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.1.0...9.0.0-release50.7) (2023-11-17)

### Features

- changes the logic for setting a pollInterval ([a482e57](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/a482e57e2a647de9421898df3fb061cf28c74408)), closes [#277](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/277)

### Bug Fixes

- remove unused casparcg useScheduling option ([#294](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/294)) ([06d3c96](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/06d3c967d2da012aa2f6655c34d382201a45cab8))

## [9.0.0-release50.6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.5...9.0.0-release50.6) (2023-08-25)

### Bug Fixes

- **httpSend:** Use the same types for the sendCommand action as a timeline object ([#269](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/269)) ([3385217](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3385217afcb6e45aa37123f5400d1dea4a0c8972))
- **vmix:** fix scenario where the media load retry system would load clips into playlists twice ([8ceddb2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8ceddb291ac3e25cc77f8cb77fa58f67d9167f4c))

## [9.0.0-release50.5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.4...9.0.0-release50.5) (2023-07-03)

## [9.0.0-release50.4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.3...9.0.0-release50.4) (2023-07-03)

## [9.0.0-release50.3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.2...9.0.0-release50.3) (2023-07-03)

## [9.0.0-release50.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.1...9.0.0-release50.2) (2023-07-03)

## [9.0.0-release50.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.0...9.0.0-release50.1) (2023-07-03)

## [9.0.0-release50.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.0.0-release49.0...9.0.0-release50.0) (2023-07-03)

### ⚠ BREAKING CHANGES

- DeviceType enum has been changed from a number-based to a string-based one
- json schemas for device config and mappings (#237)

### Features

- add restart command to vMix inputs ([e16e8c1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e16e8c14d263fffc8e004bf9f06cdde6073e16b2))
- DeviceType enum has been changed from a number-based to a string-based one ([dd03bcc](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/dd03bcc7a0f246ff62ccd09091003195c97e4dc1))
- json schemas for device config and mappings ([#237](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/237)) ([d43f3dc](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d43f3dc70f5c8843081760846e9aa38fa4c71396))
- replace makeready ([5abe41e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5abe41eaa421db4845a54837b2e3b41f2b33d062))
- SOF-1254 add me_clean support for mix ouputs ([7f3fb9c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/7f3fb9c7d9edb03022db69c6e206302c5c69a815))
- SOF-1254 add temporal priority to TriCaster ([7133774](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/7133774a49e03a038d91a9ec8fd8d0f13cbd962c))
- upgrade singular.live to API v2 ([2bb5c4d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/2bb5c4d2557710d55b27556cef919dc8419fa1e9))
- Use strings for DeviceType enum ([f1b95bc](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f1b95bcb972aff329bce9c67b15f58a98bbf48cf))
- **vMix:** retry sending media load commands if the file wasn't found ([4321aae](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4321aae2684ba4c7f55e3cf810dacae187fe282b))

### Bug Fixes

- add types support for vMix stingers 3 and 4 ([44fa27d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/44fa27d164bd717b58d7f1d1255d56d132007865))

## [9.0.0-release50.6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.5...9.0.0-release50.6) (2023-08-25)

### Bug Fixes

- **httpSend:** Use the same types for the sendCommand action as a timeline object ([#269](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/269)) ([3385217](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3385217afcb6e45aa37123f5400d1dea4a0c8972))

## [9.0.0-release50.5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.4...9.0.0-release50.5) (2023-07-03)

**Note:** Version bump only for package timeline-state-resolver-types

## [9.0.0-release50.4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.3...9.0.0-release50.4) (2023-07-03)

**Note:** Version bump only for package timeline-state-resolver-types

## [9.0.0-release50.3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.2...9.0.0-release50.3) (2023-07-03)

**Note:** Version bump only for package timeline-state-resolver-types

## [9.0.0-release50.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.1...9.0.0-release50.2) (2023-07-03)

**Note:** Version bump only for package timeline-state-resolver-types

## [9.0.0-release50.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.0...9.0.0-release50.1) (2023-07-03)

**Note:** Version bump only for package timeline-state-resolver-types

## [9.0.0-release50.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/3.5.1...9.0.0-release50.0) (2023-07-03)

### ⚠ BREAKING CHANGES

- DeviceType enum has been changed from a number-based to a string-based one
- json schemas for device config and mappings (#237)

### Features

- add restart command to vMix inputs ([e16e8c1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e16e8c14d263fffc8e004bf9f06cdde6073e16b2))
- DeviceType enum has been changed from a number-based to a string-based one ([dd03bcc](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/dd03bcc7a0f246ff62ccd09091003195c97e4dc1))
- json schemas for device config and mappings ([#237](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/237)) ([d43f3dc](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d43f3dc70f5c8843081760846e9aa38fa4c71396))
- replace makeready ([5abe41e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5abe41eaa421db4845a54837b2e3b41f2b33d062))
- upgrade singular.live to API v2 ([2bb5c4d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/2bb5c4d2557710d55b27556cef919dc8419fa1e9))
- Use strings for DeviceType enum ([f1b95bc](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f1b95bcb972aff329bce9c67b15f58a98bbf48cf))
- **vMix:** retry sending media load commands if the file wasn't found ([4321aae](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4321aae2684ba4c7f55e3cf810dacae187fe282b))

### Bug Fixes

- add types support for vMix stingers 3 and 4 ([44fa27d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/44fa27d164bd717b58d7f1d1255d56d132007865))

## [8.1.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.1.1...8.1.2) (2023-12-21)

### Bug Fixes

- suppress quantel disconnect shortly ([f04befb](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f04befb6464669cf8acd058cbeb541824a0bba1e))

## [8.1.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.0.0...8.1.0) (2023-10-19)

### Features

- VizMSE action to send clear-commands (configured on the device settings) to all Engines in the Profile ([38e313f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/38e313f77dfa7e61f495acf274b872768a1dbaa5))

## [8.0.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.1...8.0.0) (2023-10-05)

### Features

- atem audio routing control SOFIE-2512 ([#274](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/274)) ([de9dfd1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/de9dfd138452794bd7ad83a2fd1e82d2849abdcd))

### Bug Fixes

- export lawo parametertype ([65a73c4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/65a73c41eb31cc2a18df9f0d282255c6cf6a171b))

## [8.0.0-release49.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.0.0-release48.2...8.0.0-release49.0) (2023-03-21)

## [8.0.0-release48.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0...8.0.0-release48.2) (2023-03-21)

### Features

- Vmix preset actions ([8b31294](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8b3129412f3881ff9db2cd059927e5b5f3ae6caf))

### Bug Fixes

- change `DeviceType.MULTI_OSC` value ([386ba6c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/386ba6c791a090553cf1d66c73ae82cb25edd03f))

## [7.5.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.7...7.5.0) (2023-02-28)

## [7.5.0-release47.7](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.0.0-release48.1...7.5.0-release47.7) (2023-02-24)

### Features

- **vmix:** add support for ListRemoveAll and ListAdd commands ([4a7240f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4a7240f7b2819bb16f263b72d1b06b98e3c40353))
- **vmix:** add support for starting and stopping VB.NET scripts ([9f2d4ee](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9f2d4eeeccd9ba0017fc00cfe5df18e3717ea660))

## [8.0.0-release48.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.6...8.0.0-release48.1) (2023-02-14)

## [7.5.0-release47.6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.5...7.5.0-release47.6) (2023-02-07)

## [7.5.0-release47.5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.4...7.5.0-release47.5) (2023-01-16)

## [7.5.0-release47.4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.0.0-release48.0...7.5.0-release47.4) (2023-01-13)

### Features

- Emit debug state ([516a512](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/516a51203aa0af8c0a47552ecf9c0c99cd01d0be))
- multi osc device ([b987680](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b9876808d44543903e45ab5a1a1a2b85beed4aac))

## [8.0.0-release48.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/3.0.3...8.0.0-release48.0) (2022-12-12)

### ⚠ BREAKING CHANGES

- refactor types to work better with typescript 4.7 (#227)

### Features

- import quick-tsr to this repository ([bd42303](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/bd42303dc68054db530d10ccc590f63017b15afe))
- refactor types to work better with typescript 4.7 ([#227](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/227)) ([abe499c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/abe499ce1da13c2d7a68333f6b1dcc8c7ea71e97))
- translations for actions ([df4cb43](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/df4cb43cf16a8e2ae34c1fe44801c5a327f9b01e))

### Bug Fixes

- add optional parameter to HTTPSend timelineObj: paramsType ([979dc61](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/979dc61748c4c371a8b17c7fd8c5929c69f747d9))
- add support for Node 18 ([6242dd6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6242dd68f54a491aa71bdfd30b066550d6f7e90e))

## [7.5.0-release47.3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.2...7.5.0-release47.3) (2022-11-07)

## [7.5.0-release47.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.1...7.5.0-release47.2) (2022-11-02)

## [7.5.0-release47.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/2.3.0...7.5.0-release47.1) (2022-11-02)

### Features

- update for casparcg-connection rewrite ([5dfdd23](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5dfdd2320caf89432d36513026c1259e2cf3d366))

## [7.5.0-release47.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.3.0...7.5.0-release47.0) (2022-10-28)

## [7.3.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/2.2.3...7.3.0) (2022-10-24)

### Features

- add Sofie Chef device ([4fac092](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4fac092d6f896d1f5fa77c92b7f8a69339a75c55))

### Bug Fixes

- update SofieChef device API ([514d827](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/514d8271dd0d1fbce673154067d92f02a25e0b4b))

## [8.0.0-release49.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.0.0-release48.2...8.0.0-release49.0) (2023-03-21)

### ⚠ BREAKING CHANGES

- resolve MSE show names to IDs using the directory

### Features

- Emit debug state ([516a512](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/516a51203aa0af8c0a47552ecf9c0c99cd01d0be))
- multi osc device ([b987680](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b9876808d44543903e45ab5a1a1a2b85beed4aac))
- resolve MSE show names to IDs using the directory ([e094dda](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e094dda7dbd14b312ff8ffef5d45a39a1e802bcf))
- SOF-1254 add TriCaster integration ([06b129e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/06b129ecec2d87b0caaa22fda36b2b5ef953653e))
- SOF-1254 add TriCaster matrix support ([dbb1b26](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/dbb1b26e84a41227e3eca0fae902bf5b57ca5d8e))
- Vmix preset actions ([8b31294](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8b3129412f3881ff9db2cd059927e5b5f3ae6caf))
- **vmix:** add support for ListRemoveAll and ListAdd commands ([4a7240f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4a7240f7b2819bb16f263b72d1b06b98e3c40353))
- **vmix:** add support for starting and stopping VB.NET scripts ([9f2d4ee](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9f2d4eeeccd9ba0017fc00cfe5df18e3717ea660))

### Bug Fixes

- change `DeviceType.MULTI_OSC` value ([386ba6c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/386ba6c791a090553cf1d66c73ae82cb25edd03f))
- SOF-1254 improve types ([0471a7b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0471a7bf64f7340e83b5b6f47212003fd2586ca6))
- SOF-1254 type guards and make some properties optional ([f8b8aab](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f8b8aab02a0ef7f0ad8814365ca3e08820c9a1af))

# [8.0.0-release48.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0...8.0.0-release48.2) (2023-03-21)

# [8.0.0-release48.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.6...8.0.0-release48.1) (2023-02-14)

# [8.0.0-release48.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.3...8.0.0-release48.0) (2022-12-12)

### Features

- import quick-tsr to this repository ([bd42303](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/bd42303dc68054db530d10ccc590f63017b15afe))
- translations for actions ([df4cb43](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/df4cb43cf16a8e2ae34c1fe44801c5a327f9b01e))
- update for casparcg-connection rewrite ([5dfdd23](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5dfdd2320caf89432d36513026c1259e2cf3d366))

# [8.0.0-release48.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.6...8.0.0-release48.1) (2023-02-14)

# [8.0.0-release48.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.3...8.0.0-release48.0) (2022-12-12)

### Features

- import quick-tsr to this repository ([bd42303](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/bd42303dc68054db530d10ccc590f63017b15afe))
- translations for actions ([df4cb43](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/df4cb43cf16a8e2ae34c1fe44801c5a327f9b01e))
- update for casparcg-connection rewrite ([5dfdd23](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5dfdd2320caf89432d36513026c1259e2cf3d366))

# [8.0.0-release48.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.3...8.0.0-release48.0) (2022-12-12)

### Bug Fixes

- add optional parameter to HTTPSend timelineObj: paramsType ([979dc61](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/979dc61748c4c371a8b17c7fd8c5929c69f747d9))
- add support for Node 18 ([6242dd6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6242dd68f54a491aa71bdfd30b066550d6f7e90e))

### Features

- import quick-tsr to this repository ([bd42303](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/bd42303dc68054db530d10ccc590f63017b15afe))
- translations for actions ([df4cb43](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/df4cb43cf16a8e2ae34c1fe44801c5a327f9b01e))
- update for casparcg-connection rewrite ([5dfdd23](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5dfdd2320caf89432d36513026c1259e2cf3d366))

# [7.5.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.7...7.5.0) (2023-02-28)

**Note:** Version bump only for package timeline-state-resolver-types

# [7.5.0-release47.7](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.6...7.5.0-release47.7) (2023-02-24)

**Note:** Version bump only for package timeline-state-resolver-types

# [7.5.0-release47.6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.5...7.5.0-release47.6) (2023-02-07)

**Note:** Version bump only for package timeline-state-resolver-types

# [7.5.0-release47.5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.4...7.5.0-release47.5) (2023-01-16)

**Note:** Version bump only for package timeline-state-resolver-types

# [7.5.0-release47.4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.3...7.5.0-release47.4) (2023-01-13)

### Bug Fixes

- add optional parameter to HTTPSend timelineObj: paramsType ([979dc61](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/979dc61748c4c371a8b17c7fd8c5929c69f747d9))
- add support for Node 18 ([6242dd6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6242dd68f54a491aa71bdfd30b066550d6f7e90e))

# [7.5.0-release47.3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.2...7.5.0-release47.3) (2022-11-07)

**Note:** Version bump only for package timeline-state-resolver-types

# [7.5.0-release47.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.1...7.5.0-release47.2) (2022-11-02)

**Note:** Version bump only for package timeline-state-resolver-types

# [7.5.0-release47.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.0...7.5.0-release47.1) (2022-11-02)

**Note:** Version bump only for package timeline-state-resolver-types

# [7.5.0-release47.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.3.0...7.5.0-release47.0) (2022-10-28)

### Bug Fixes

- update SofieChef device API ([514d827](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/514d8271dd0d1fbce673154067d92f02a25e0b4b))

### Features

- add Sofie Chef device ([4fac092](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4fac092d6f896d1f5fa77c92b7f8a69339a75c55))

# [7.4.0-release46.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.4.0-release46.0...7.4.0-release46.1) (2022-09-27)

# [7.4.0-release46.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.3.0-release44.1...7.4.0-release46.0) (2022-09-26)

### Bug Fixes

- index datastore references by path ([9b48d72](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9b48d725d79d4eee13e7347e450abaadf02b6db2))
- invert warnOnEmptySlots to suppressEmptySlotWarnings ([edcd7b0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/edcd7b0fde747ae160c93f2ca1284661153f5647))
- move all references to the root of the tl obj ([130b6c3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/130b6c3a908b0911f94ccedc67e7004404f11010))
- put 'em back to make linter happy ([e83a5ed](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e83a5ed87f1983b16c9b5b8c134e1441fb8d324a))
- **types:** remove unsupported/manual transport statuses ([b362072](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b362072424236f13f9c04bf477d6b98e41254359))
- update typings with datastore references ([2c0074b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/2c0074bc74d8fa0eead89b44b558e73de4057638))

### Features

- **HyperDeck:** add "warnOnEmptySlots" option ([233a413](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/233a4132097f38723b7150b7e61635f39e08115d))
- **Hyperdeck:** add support for play and goto commands ([50e9e15](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/50e9e156651ba250a4fa3d5fcc01a184ba928ade))
- timeline datastore prototype ([e122e8b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e122e8bff7404b1955853131d24144c660f76753))

# [7.3.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.3.0-release44.2...7.3.0) (2022-10-24)

**Note:** Version bump only for package timeline-state-resolver-types

# [7.3.0-release44.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.3.0-release44.1...7.3.0-release44.2) (2022-09-29)

**Note:** Version bump only for package timeline-state-resolver-types

# [7.3.0-release44.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.3.0-release44.0...7.3.0-release44.1) (2022-09-22)

**Note:** Version bump only for package timeline-state-resolver-types

# [7.3.0-release44.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.0.1...7.3.0-release44.0) (2022-07-04)

# [7.1.0-release42.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.0.0-release41.2...7.1.0-release42.1) (2022-04-29)

### Features

- SOF-752 show init and cleanup ([44264b0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/44264b08bddccbbe62c6779beb8acba18f438080))

### Reverts

- Revert "7.1.0" ([8ce054c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8ce054c6016fc0d23ef37a3ae1d233090a829fb9))
- Revert "test: Rename package on publish" ([855f772](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/855f7725d73878d10caea077aec50429e3146b41))

## [1.0.2-release37.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/1.0.2-release37...1.0.2-release37.1) (2021-09-02)

# [7.1.0-release42.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.0.0-release41.1...7.1.0-release42.1) (2022-04-29)

### Features

- SOF-752 show init and cleanup ([44264b0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/44264b08bddccbbe62c6779beb8acba18f438080))

### Reverts

- Revert "7.1.0" ([8ce054c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8ce054c6016fc0d23ef37a3ae1d233090a829fb9))

## [1.0.2-release37.4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.2.0-release37.7...1.0.2-release37.4) (2021-11-08)

## [1.0.2-release37.3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/1.0.2-release37.2...1.0.2-release37.3) (2021-10-14)

### Reverts

- Revert "test: Rename package on publish" ([855f772](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/855f7725d73878d10caea077aec50429e3146b41))

## [1.0.2-release37.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/1.0.2-release37...1.0.2-release37.1) (2021-09-02)

# [7.0.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.0.0-release41.2...7.0.0) (2022-06-27)

**Note:** Version bump only for package timeline-state-resolver-types

# [7.0.0-release41.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.0.0-release41.0...7.0.0-release41.2) (2022-04-28)

### Bug Fixes

- move the types DeviceStatus, StatusCode to timeline-state-resolver-types ([4d84179](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4d84179372ba243fe60d102ec52447ca87f0a8c9))
- **obs:** add missing mapping type to MappingOBSAny ([2ff5522](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/2ff55222a8b5fc915c8926aa2bc9ea4f1e796000))

# [7.0.0-release41.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.0.0-release41.0...7.0.0-release41.1) (2022-04-12)

### Bug Fixes

- move the types DeviceStatus, StatusCode to timeline-state-resolver-types ([4d84179](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4d84179372ba243fe60d102ec52447ca87f0a8c9))
- **obs:** add missing mapping type to MappingOBSAny ([2ff5522](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/2ff55222a8b5fc915c8926aa2bc9ea4f1e796000))

# [7.0.0-release41.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.4.0-release39.1...7.0.0-release41.0) (2022-03-21)

**Note:** Version bump only for package timeline-state-resolver-types

# [6.4.0-release39.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.3.0...6.4.0-release39.1) (2022-02-03)

**Note:** Version bump only for package timeline-state-resolver-types

# [6.3.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.2.1...6.3.0) (2022-01-26)

### Bug Fixes

- Updated links to match the changed repo name ([6fe910f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6fe910f69a313e1f7b84e88a6550c3e40ac29afa))

# [6.3.0-release38.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.2.0...6.3.0-release38.0) (2021-12-17)

**Note:** Version bump only for package timeline-state-resolver-types

# [6.2.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.2.0-release37.7...6.2.0) (2021-12-08)

**Note:** Version bump only for package timeline-state-resolver-types

# [6.2.0-release37.4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.2.0-release37.3...6.2.0-release37.4) (2021-09-30)

### Bug Fixes

- emitting of 'debug' events should only be done if the debug property is truthy. ([5d015a1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5d015a1dfde3ffc86f9aea9366bf72f76537d9a4))

# [6.2.0-release37.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.2.0-release37.0...6.2.0-release37.1) (2021-09-21)

### Features

- map sisyfos channel by its label ([afcf056](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/afcf056a568f5e18545379c2655b8c1769b98be2))
- purge unknown elements from the viz-rundown upon activation ([cff4d0c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/cff4d0cbcd46b7da97a8de31cb92381286294350))

# [6.2.0-release37.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.1.0-release36.2...6.2.0-release37.0) (2021-09-13)

**Note:** Version bump only for package timeline-state-resolver-types

# [6.1.0-release36.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.0.3...6.1.0-release36.0) (2021-07-12)

### Features

- **OBS:** Support OBS Live Video Production Software ([#187](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/187)) ([f2fe81a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f2fe81a3ae87ccd3c8db812e88ef9a94b74673d5))
- resend failing http commands ([cb2ee39](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/cb2ee3967f587520c8dd1e3b6d3543af6fcae687))
