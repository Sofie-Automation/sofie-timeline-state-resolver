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
- change CommandContext to be a generic instead of using fields typed as any ([d7531e5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d7531e5e16e3a7d6eebc5e07eb0225fe5be4bf99))
- connection status for websocketTcpClient ([46f333f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/46f333fc7d1a00cf7f744bbcce984ddb3be811fb))
- **EAV-468:** add `disableDefaults` option to sisyfos mappings ([d92b9c2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d92b9c2c14edfe2169868622828f7424e5a653f3))
- **EAV-493:** add basic support for vMix audio buses ([9166efc](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9166efc560998c6251e366c32227da3f2dffd645))
- **EAV-516:** reload browser input ([36682ec](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/36682ec9d907a01a50315173a7d46f9b9eb9fa7c))
- **EAV-539:** add basic vMix replay support ([4c32364](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4c32364d3a9fc71f423c59a2a28203d51988cd13))
- export additional device classes from TSR package ([d57036c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d57036c69ab03dad12fb4562fb1ef485fb62d198))
- generate some more repetitive parts of tsr-types ([#385](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/385)) ([5ff702c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5ff702c6c6ef7810932f4634bcb8d0d6f2a1268c))
- implement "still-player" ie "imageStore" ([1882633](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/188263322430c043a8d73d9322949a434257b723))
- implement udpsend device ([64fb7c2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/64fb7c2388beb9732037471fc7c498546b56b413))
- include atem chroma keyer in upstreamkeyer ([#415](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/415)) ([309a846](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/309a846a42d0e3386399269c8d6a2d75dff8cc0c))
- inital test sketch for websocketTcpClient ([e75b543](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e75b543dcf56d5c8919d9433144e8252f723c145))
- kairos temporal priority based on dependency graph ([19b1a7a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/19b1a7a6754ca246ac04164cbad8d589993341d1))
- Kairos: Allow references to layer-mappings to be used as sources ([0457ef4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0457ef453383aba7fbc5d0d503c3b1d9a0d67391))
- **kairos:** Monitor Kairos status ([9b3859f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9b3859f0ce811099dcc0fb56637ad21410db49fe))
- lookahead offset ([#413](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/413)) ([04b075e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/04b075e87c98643f08bf3edf53982794e15e8cac))
- make tsr action execution methods be strongly typed ([eada9c8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/eada9c81fc9cc309343585479fb2ce9812606a41))
- Make USKs to be their own mapping ([d4a7b59](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d4a7b596bd7a6e80e568a914ce1d8951f9f5e9e5))
- normalise DeviceStatusInput to DeviceStatus at TSR boundary ([6afe0b3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6afe0b3f96e755de8c8dd23763af8e6452553671))
- OGraf integration ([c0545d7](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c0545d7a9d708d8f49edb69f10d82391f08240b4))
- propagate usages of `DeviceTimelineState` to the conductor ([#411](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/411)) ([5752972](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/57529720d3fbceeaf656c87c9c6534ad354342eb))
- **quick-tsr:** Add ability to specify input folder ([58a3b6b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/58a3b6bda7b820d4d2d43fff542ecaede28ee125))
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
- update comment in test ([b6e62e9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b6e62e9403bb6441aaf9607cd2c973d1a48d8ce0))
- update of documentation and implementation of state and device commands ([8e65e45](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8e65e4526afcd7a876eb38e97ed0523a8aff0d7a))
- update simple integrations to use DeviceStatusInput return type ([1d4eb5a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/1d4eb5a6ecd064799e451724739457ff39d24258))
- update tsr types mock to include the websocketTcpClient ([75c6903](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/75c6903412a45dfa7f15fcc94e6cf5888596c5ae))
- use script engine for advanced media control ([08bea2e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/08bea2ef4fcb98e831277fd75ef64256f7ece567))
- use sendCommand for better checks ([e51695c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e51695c7730e56d792f6c5973c8e87442519c34e))
- vindral clip playback ([02f9aab](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/02f9aabaf2af2af74f2f072a3553d4aacfdf5260))
- vindral composer integration ([5521ffe](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5521ffe3b3382a9b7cefdec13e3c1dc971cc800a))
- vindral switcher mapping ([1d3805b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/1d3805b3ce90077d5d00509b68e1d72d0e619356))
- **vmix:** enable cuts through the ActiveInput command ([b24d78c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b24d78c9e490166e5290588c4f53049dcf6522ce))
- websocketclient move buffer encoding to options ([fc514a3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/fc514a3384309016400dd8ab48f5591ad896f3d8))
- WebsocketTcpClient ([be244ed](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/be244edff730775a39b54161dbdf4f382803ce42))
- websockettcpclient add basic functionality to connection ([6c64c86](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6c64c860129a227548a6dc05ca4a0767a5164142))
- websockettcpclient move actions to schema ([c2afeeb](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c2afeebdcad63d9cc135cf332fa0d939fce3d49a))
- websockettcpclient move options to schema ([dfb7036](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/dfb70368b498622a09df6751419e5abf416aa5ee))
- websockettcpclient test connection status ([391623d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/391623d578fbc4fa92816bc9813576416c2be1bc))
- websocketTcpClient test working basics ([251bb35](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/251bb354c1313da6cf00d2e112207abc47b2f50d))

### Bug Fixes

- add extendable DeviceOptionsMap type for tsr-plugins ([#440](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/440)) ([5904de2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5904de261db621f0d0be1fce2687641f02de2d80))
- add utils for extracting action payload and result types ([87bac1d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/87bac1dc6e7a68fb5c6d257e9327ddc80f8ac4f0))
- add version string property to tsrPlugin device details ([#446](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/446)) ([ec79db2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/ec79db288bfc1013fa738e8ce162bda9d4d9ba89))
- add websocketTcpClient to connection manager ([ca4671a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/ca4671a3d1a2191ab384aa6ff2753a07b4246faa))
- add websocketTcpClient to services in tsr ([973fa25](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/973fa25bef422e8dc26b544569096b9346412eb0))
- atem not controlling dip transition SOFIE-496 ([#455](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/455)) ([3a32778](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3a32778811d3c35563567d129e9c584f3123d712))
- avoid cyclical import ([d353e07](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d353e077a9eb4b21272862f13cd4596757c024b8))
- changing html url ([261f06e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/261f06e3fec8a556acd3a4c07446a7fe37bedfbc))
- check if mapping exists before using it ([7f40cfe](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/7f40cfe37a3875926893aafb9d832c8d6a9b5898))
- **ci:** move comparison operator inside GitHub Actions expression ([a373db2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/a373db2e9370f42f075f7919ef272a3ba930deaf))
- cleanup async that isn't, and fix `setModifiedState` ([c347227](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c34722765d6ce49bceacd5638899f6d4e70dd151))
- cut+crossfade not applying when backgroudn changes ([94bee99](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/94bee99381910344c638ad8a42765c4e3024d40a))
- don't set Sisyfos labels to empty strings (SOFIE-4196) ([#406](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/406)) ([dddc23e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/dddc23e24cb3c9cc31f05e64c91828ef7f07d5cf))
- **EAV-493:** master bus support ([f17e84e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f17e84e7be4301aacf52a69a114a7b8423797537))
- **EAV-512:** small bugs and readd tests ([f2816c8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f2816c863c1252663c1d08d3f4d3c91129c6c8f3))
- **EAV-527:** delay slow vMix commands from lookaheads ([12074fd](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/12074fd4d0263046abb57d485c6e423cd5da9d94))
- generated websocketTcpClient types updated ([9f954d1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9f954d17793a3829a44357ef3a6a0945d7c4c9f6))
- guard against missing mapping ([3d5130a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3d5130a382bc09e36b5957f56cd18b0f47cab790))
- handle weird Pharos response ([da90a01](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/da90a016940db4391a6eb77fb04a88d52f450042))
- **httpSend:** fix params-type validation condition ([47392d5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/47392d544690e632521994c1f0c47a2ee75ad671))
- improve error messages when assigning datastore values ([26102b7](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/26102b7c4bbca6ee2a49e29f7aaa0e4edb8059c2))
- improve KairosMonitor ([0b9754f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0b9754f4a63f8bf98d3326bee510401611d0c577))
- issue a Play command when restarting in case it reached the end ([#468](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/468)) ([ae4bb9b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/ae4bb9baf570934aac475c55b0ab58304cf4a0ad))
- kairos clip lookaheads are paused with correct seek ([450c7c5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/450c7c5c08156a8445ac73cb3f87804da4badb6f))
- kairos media player support ([b2d7527](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b2d752773e19ec630201f425ade990e832d938e3))
- **kairos:** force dissolve properties on Scene Layers to be applied first, before other properties ([6d4a8c8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6d4a8c8158f091a599be6a5395fc756204be6dbb))
- **kairos:** if theres an Error when using a still/ramrec, try to LOAD it and try again ([9509c49](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9509c499c469fe854b910705efd6ffbb724071dc))
- **kairos:** support fire-and-forget of SceneSnapshotRecall ([75f832d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/75f832d345edde654f37ad55e40f1de74defe2ae))
- lawo error logging ([0fb42d3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0fb42d3cfc0300276220ebec583f767cf33aa0b9))
- linting ([523ab60](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/523ab60d486dea5faba15a20fefe3f89c56d9a73))
- Listen for errors from casparcg and pass them on ([484a823](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/484a8232ba2152f9cf0db68540b404dc5fb31d87))
- load in RAM. ([f5d2f5a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f5d2f5a3bf9070c91f198f5e4efe0c7dd282c1fa))
- logDebug state is not persisted across restarts, because it's not set on initialization ([3da6173](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3da617373173003d307c1982c08a6166a739faee))
- lookahead seek handling ([d15dbf6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d15dbf6ba414ef188255a7d5e6bf0acee0b0d87f))
- media clip clearing ([bfa3e12](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/bfa3e127b16c61b698dd8acd52e41be6b0e5bc44))
- media object seek based on start time ([3b471fd](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3b471fdc22ca119f21392a49e5bfedf1d92cb004))
- missing linting ([71c8bcd](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/71c8bcd29166e6772f976c8f43d34e376cf6bc92))
- move functions related to Datastore to TSR-types. ([300c92f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/300c92f94705cff2176c1077c61a9c93e188d543))
- move functions related to TemplateString to TSR-types. ([af4b98e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/af4b98ea790de56ad06100462d6b2bd6c43e69aa))
- ograf connection status ([817ce33](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/817ce33ab7a4e804dfed1bc7e5df2b3890eb3170))
- propagate errors and connection status from tcpSend device ([faccef8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/faccef88806e914645100eef8305aebbe61a1dc5))
- quantel: reimplement reset port commands ([1da482c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/1da482c71a116d5d41b6b162255b77cb299d1402)), closes [#352](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/352)
- Regenerate yarn.lock for compatibility with hardened mode ([26789f8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/26789f8ac42ba69b09278c04e7bcca2893cb5ca4))
- remove deprecated device base class ([#389](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/389)) ([81f108d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/81f108d238adf9b3e6b872ff103bd06d7cae6a18))
- remove DeviceOptionsAnyInternal type from public api ([#386](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/386)) ([aacb0c4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/aacb0c41719295014e888631dc424f3b533a304e))
- remove encoding option as this is included in command ([990c868](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/990c86838f4723f02c71cceb378e06179143ca90))
- remove unused getDiff function ([#387](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/387)) ([9167fa0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9167fa0b1b81852fad0f6a2b96ca7ac4b5d68425))
- reorder the kairos monitor messages, so that the "fundamental ones" show up first ([59b6565](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/59b6565b1249138fc8f4c6f4a816247175eeb1f5))
- restore Actions enums ([b8480ce](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b8480ce705aa83c22ba99b7bdce4568bca986e4c))
- rework generated types to minimise variation in type union ([#430](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/430)) ([59ac9d9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/59ac9d9519723f3ac3850e4ff083ddf787ec04d5))
- rework generated types to minimise variation in type union ([#430](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/430)) ([0a476f2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0a476f2045a0f03dfc329f3ab5eb4554fcebdb5d))
- shared control undefined state ([#419](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/419)) ([a03f88d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/a03f88d9783e87701e085e269cde619332366924))
- simplify action methods signature ([db18b56](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/db18b56beb46e23e587d73f04058d697f7fe4ae2))
- **sisyfos:** Don't apply default values on set channel ([0f44040](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0f440406e8190e16db7df6581d67a804b063be1f))
- **Sisyfos:** modified the 'mixerOnline' event, which was emitted upon every ping, which in turn caused the event 'connectionChanged' to be emitted continously. ([618cf19](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/618cf19fdad85df972bbe7c624a2d755366088a2))
- **sisyfos:** Use correct typings for pgm ([7df2368](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/7df2368359c62e0e6452684ac25984dff042aeda))
- stop vMix resending commands on every poll ([#437](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/437)) ([1d2422a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/1d2422aadf8ed157f6690dcbd559f826901750eb))
- supertimeline type mismatch ([#421](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/421)) ([651ad0d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/651ad0d5af984ea1148f883a979e1fa4777e3fc7))
- tcpmessage was not renamed from tcp command in schemas ([565d9c7](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/565d9c757e01d2044f9ccd611b4a2a96f3e11a44))
- test of connection ([a9a91da](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/a9a91da4731ca6a4da987c9de832300a3993ab49))
- type name in timeline for tcp was still command ([d045fa3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d045fa36aef3fe73dbdfdd449ecd93015b2b4f6a))
- typo in type Buffer ([0ec46a7](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0ec46a751fbfa9df4a6e5df05040b806f43d68e9))
- update casparcg-connection to latest version. ([#469](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/469)) ([4659f39](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4659f3975d85591f8f222b7bb41d16b11b4a5337))
- update comment with missing details ([b5fee17](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b5fee17b95a4173b9caf7a874c424b2221cc5b3f))
- update kairos lib ([29b72c3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/29b72c3c921ffa631f017219b7dda232a616a409))
- update minimum nodejs to 22 ([#429](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/429)) ([c174540](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c1745408cdb0dcbcb14fa0410f4e46287af5aec3))
- use stringify instead of isEqual ([3633b3d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3633b3d578f76281626f8e8a3f5518bf4d964ad9))
- use undefined in initialization instead of ! ([e0d035a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e0d035a8b4ed0755390a33cfd2e91f243ba34ac4))
- **vmix:** do not error on missing mapping ([d0628b6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d0628b6fb463fa6b93e79bc860abb682df073bd0))
- websocket client test ([dd27571](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/dd275714a9fbf5eeee451483550c6b75b497334d))
- websocketClient - use sendCommand instead of sending directly to device ([d18b014](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d18b014bc878f8059ea8328b78e23ec3284ace39))
- websocketclient action type ([02711c8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/02711c88e40a520edd9008a9a41008f822a56e06))
- websocketclient bufferEnc option should be optional ([f877542](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f87754256d54c27dbbd072f1fc2fce3bce1a65c6))
- websocketClient diffstates oldState could be undefined ([bce3d1a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/bce3d1a1a9d2c1d97744eb45265772b5e26980a8))
- websocketClient test - remove unused afterEach() ([e420459](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e420459bdfdfff2c6518f14e132a1379ec38d161))
- websocketClient test should spy on function ([a6d66a6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/a6d66a66389441bd9950b93005095408378c91b2))
- websocketclient tests - reorder terminate spy ([40dfc34](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/40dfc34058fc62255da6661566ca74e7ea5f35d5))
- websocketTcpClient tests to use refactored init() ([6601ff3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6601ff3ed26e6f03c198de124315e9a926ead1db))

### [9.3.2](https://github.com/nrkno/sofie-timeline-state-resolver/compare/9.3.1...9.3.2) (2025-09-02)

### Bug Fixes

- update timeline dependency to latest ([d21240b](https://github.com/nrkno/sofie-timeline-state-resolver/commit/d21240bfbe2082a9de42c65311d7d9a114f2e51a))

### [9.3.1](https://github.com/nrkno/sofie-timeline-state-resolver/compare/9.3.0...9.3.1) (2025-08-12)

### Bug Fixes

- Bug in commandExecutor: `.preliminary` does not work (SOFIE-4069) ([#381](https://github.com/nrkno/sofie-timeline-state-resolver/issues/381)) ([5b9bb39](https://github.com/nrkno/sofie-timeline-state-resolver/commit/5b9bb391fc8e134ab2b81cc96a979d3735e79ca3))

## [9.3.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.2.2...9.3.0) (2025-06-30)

### Bug Fixes

- quantel: reimplement reset port commands ([610d5ef](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/610d5ef352ea44f9ce5b611cb3ca56aa68af7def)), closes [#352](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/352)

## [9.3.0-release52.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.3.0-release52.1...9.3.0-release52.2) (2025-04-10)

### Bug Fixes

- update timeline dependency ([de503d9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/de503d91ad37480b5fe5691032996fd072e2bc54))

## [9.3.0-release52.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.3.0-release52.0...9.3.0-release52.1) (2025-03-12)

### Bug Fixes

- disable initial timeline trace ([86035a8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/86035a828e67fc09e21d994cdc5b4bf835d4c6ab))
- update superfly-timeline library to 9.0.3, fixing a bug related to lookaheads ([a81aff9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/a81aff92c3301f1c6ba53c82650194dc8d82d318))

## [9.3.0-release52.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.2.1...9.3.0-release52.0) (2025-02-04)

### Features

- add option to resync states without resolving tl ([eb03434](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/eb03434c1d8a05c33f165d100c0799121a71e8c7))
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
- **EAV-54:** allow overriding vMix transition from a separate layer ([d6f4e81](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d6f4e81c533f7c124697ebb9cc1d74bc3efbc294))
- http url interpolation SOFIE-3310 ([#342](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/342)) ([01593a3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/01593a34898c1ecc8de3544545efba69fa69d5b8))
- SetSisyfosChannelState action implemented ([685fbf9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/685fbf9cc967f8c0fc767f32d0245f0a5527cc6f))
- Sisyfos - remove re-sync channel functionality. (triggerValue has the functionality) ([4e77eb2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4e77eb27c5123e2a01d5960d15557384b81327c3))
- Sisyfos add support for mute, gain, selector in triggerValues. Refactor SET_CHANNEL ([25c6516](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/25c6516f38c8e5f5d005fdd1fba2c264537340f6))
- Sisyfos support for set input gain and set input selector ([2f7d553](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/2f7d553693d8ec66e701dd85e1b7ba647c09193e))
- update ws dependency to v8 ([6fef9f7](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6fef9f7ca7fd92f51cda69cc3cd85559bf1dcf16))

### Bug Fixes

- actions.json payload format ([116bd76](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/116bd765e91ef6257365c11549836792f67cfc1f))
- add mute, inputgain, inputselector to Sisyfos channel option types ([5f5115e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5f5115e89d9eeff849d983c9491e80534d475a0e))
- **EAV-266:** add VISCA_OVER_IP to ConnectionManager ([4e04e0e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4e04e0ee2dabd60a2fc4741ce9a118201a85b701))
- **EAV-411:** SelectedName parameter support ([3c56693](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3c56693d39eae92f41c66f567eca3a7730cab6ac))
- fadeTime should be optional ([dcfa14f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/dcfa14f97576bcfc0a20c9e622c62163820a1b74))
- function name started with uppercase ([6823634](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/68236341d91407f95a114fafc74a060314539e55))
- quickTSR - return error info if an object does not reference to a mapped layer ([547247f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/547247f3b1174f43c9322410e5918d4f7a9eb0d2))
- setState when received update from Sisyfos ([f04970c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f04970c9237e8bfe232a6fbfdbd5e3103a1bf1d5))
- Sisyfos add mute, gain and inputselctor to diif ([67d566e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/67d566eba78ff83044863b614ae4f8d1609dbdee))
- Sisyfos add triggerValue to TimelineContentSisyfosChannel ([3cb6f70](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3cb6f70f847297157459906000e78f0e1ecfebcf))
- sisyfos receive channel number as index ([b06a79b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b06a79b46532bcc3678a9bbe9a8d31ae936e6aac))
- Sisyfos setchannel wrong index and osc format ([e36853f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e36853f6795c0d658498793552625ab0a8fd8f64))
- Sisyfos Typings and conversion for pgmOn and visibilty between TSR and Sisyfos ([9af2d5c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9af2d5c0a1fdc4377c6e1cc08d4e61edf26fbdfb))
- Sisyfos update mute, inputgain, selector in state from new state ([5bd34b3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5bd34b356e32584955b5965569e5ba2bc73c77bd))
- **sisyfos:** trigger value per channel ([54734d5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/54734d51d986f408acb8b20fb1a1e44666b3f347))
- **sisyfos:** Use nullish check rather than or on channel reset ([65a73c5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/65a73c5afd45afcb95fe4d6d34f4f96327aa3fd9))
- viz and quantel callback leak ([#344](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/344)) ([29ad13d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/29ad13d381416639edcaf1da3fbda07a7a6ad91b))

## [9.3.0-release52.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.3.0-release52.1...9.3.0-release52.2) (2025-04-10)

### Bug Fixes

- update timeline dependency ([de503d9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/de503d91ad37480b5fe5691032996fd072e2bc54))

## [9.3.0-release52.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.3.0-release52.0...9.3.0-release52.1) (2025-03-12)

### Bug Fixes

- disable initial timeline trace ([86035a8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/86035a828e67fc09e21d994cdc5b4bf835d4c6ab))
- update superfly-timeline library to 9.0.3, fixing a bug related to lookaheads ([a81aff9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/a81aff92c3301f1c6ba53c82650194dc8d82d318))

## [9.3.0-release52.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.2.1...9.3.0-release52.0) (2025-02-04)

### Features

- add option to resync states without resolving tl ([eb03434](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/eb03434c1d8a05c33f165d100c0799121a71e8c7))
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
- **EAV-54:** allow overriding vMix transition from a separate layer ([d6f4e81](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d6f4e81c533f7c124697ebb9cc1d74bc3efbc294))
- http url interpolation SOFIE-3310 ([#342](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/342)) ([01593a3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/01593a34898c1ecc8de3544545efba69fa69d5b8))
- SetSisyfosChannelState action implemented ([685fbf9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/685fbf9cc967f8c0fc767f32d0245f0a5527cc6f))
- Sisyfos - remove re-sync channel functionality. (triggerValue has the functionality) ([4e77eb2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4e77eb27c5123e2a01d5960d15557384b81327c3))
- Sisyfos add support for mute, gain, selector in triggerValues. Refactor SET_CHANNEL ([25c6516](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/25c6516f38c8e5f5d005fdd1fba2c264537340f6))
- Sisyfos support for set input gain and set input selector ([2f7d553](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/2f7d553693d8ec66e701dd85e1b7ba647c09193e))
- update ws dependency to v8 ([6fef9f7](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6fef9f7ca7fd92f51cda69cc3cd85559bf1dcf16))

### Bug Fixes

- actions.json payload format ([116bd76](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/116bd765e91ef6257365c11549836792f67cfc1f))
- add mute, inputgain, inputselector to Sisyfos channel option types ([5f5115e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5f5115e89d9eeff849d983c9491e80534d475a0e))
- **EAV-266:** add VISCA_OVER_IP to ConnectionManager ([4e04e0e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4e04e0ee2dabd60a2fc4741ce9a118201a85b701))
- **EAV-411:** SelectedName parameter support ([3c56693](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3c56693d39eae92f41c66f567eca3a7730cab6ac))
- fadeTime should be optional ([dcfa14f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/dcfa14f97576bcfc0a20c9e622c62163820a1b74))
- function name started with uppercase ([6823634](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/68236341d91407f95a114fafc74a060314539e55))
- quickTSR - return error info if an object does not reference to a mapped layer ([547247f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/547247f3b1174f43c9322410e5918d4f7a9eb0d2))
- setState when received update from Sisyfos ([f04970c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f04970c9237e8bfe232a6fbfdbd5e3103a1bf1d5))
- Sisyfos add mute, gain and inputselctor to diif ([67d566e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/67d566eba78ff83044863b614ae4f8d1609dbdee))
- Sisyfos add triggerValue to TimelineContentSisyfosChannel ([3cb6f70](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3cb6f70f847297157459906000e78f0e1ecfebcf))
- sisyfos receive channel number as index ([b06a79b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b06a79b46532bcc3678a9bbe9a8d31ae936e6aac))
- Sisyfos setchannel wrong index and osc format ([e36853f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e36853f6795c0d658498793552625ab0a8fd8f64))
- Sisyfos Typings and conversion for pgmOn and visibilty between TSR and Sisyfos ([9af2d5c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9af2d5c0a1fdc4377c6e1cc08d4e61edf26fbdfb))
- Sisyfos update mute, inputgain, selector in state from new state ([5bd34b3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5bd34b356e32584955b5965569e5ba2bc73c77bd))
- **sisyfos:** trigger value per channel ([54734d5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/54734d51d986f408acb8b20fb1a1e44666b3f347))
- **sisyfos:** Use nullish check rather than or on channel reset ([65a73c5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/65a73c5afd45afcb95fe4d6d34f4f96327aa3fd9))
- viz and quantel callback leak ([#344](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/344)) ([29ad13d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/29ad13d381416639edcaf1da3fbda07a7a6ad91b))

### [9.2.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.2.0...9.2.1) (2024-11-13)

### Bug Fixes

- trace and emit some helpful info in case the timeline resolver throws ([913ca75](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/913ca75412d9852b90fa093b55cdc7b840440099))

## [9.2.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.2.0-alpha.0...9.2.0) (2024-10-07)

### Bug Fixes

- revert quantel device to release50 version ([36817aa](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/36817aadcd0d0657bfa6175a3b333b1bf9e2c798))

## [9.2.0-alpha.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.1.0...9.2.0-alpha.0) (2024-09-09)

### Features

- allow sequential executionMode to paralelize multiple queues of Commands ([84a53cd](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/84a53cd5f1ee0978767d46ad766c01841559983d))

### Bug Fixes

- filter mappings by deviceid ([f4402dd](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f4402ddc6b9998e9cdf6d04f3c766ba94056d4bd))
- update timeline dependency (see https://github.com/SuperFlyTV/supertimeline/pull/102 ) ([81af9f7](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/81af9f7a1e3c24cfd1bbd85e5497198ff4c612bc))
- use sequential send mode for quantel ([940e68a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/940e68ab09a37df7ce53944d888757a4a6f5a9c9))

## [9.1.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.2...9.1.0) (2024-08-19)

**Note:** Version bump only for package timeline-state-resolver-packages

## [9.1.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.2...9.1.0) (2024-08-19)

### Features

- add "returnData" to action schema ([529bcb3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/529bcb3157f2e583c077dd54787d0c3ea4a25905))
- atem color generator support SOFIE-2968 ([#322](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/322)) ([b7ceb69](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b7ceb6950c875ff123dcc9bdd58a45c7922045d2))
- atem command batching SOFIE-2549 ([#308](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/308)) ([75e2cbe](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/75e2cbebd8ffe05e5de44d0f0f3797bbb07882e7))
- convert quantel to state handler ([7f6e619](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/7f6e619e1284c3ff7e3cf9ad21e578018e19edd0))
- Dereference schemas ([#286](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/286)) ([7f6a20e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/7f6a20e7656e92e337e9ddd45048fe76b08e349e))
- **EAV-243:** add OAuth (Client Credentials grant) and Bearer Token to HTTPSend ([8fef807](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8fef807e31c7b65d1017d772ba2e0a441f899226))
- **EAV-243:** add oauth token path option for a broader support ([76592f2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/76592f29d53b1ce5b64ddd1c283f7f045c155da3))
- **EAV-269:** add vMix input layers props and commands ([1bcf056](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/1bcf056a70ed7932c1c5588fdad17f1c25d32832))
- **httpSend:** Proxy support ([6dc4c59](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6dc4c59424242b1ea6681c27c0647a9afaae7c17))
- **HTTPSend:** return response data from HTTP SendCommand action ([#334](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/334)) ([d220c78](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d220c786ea3ae139a690d741dcfdf9d8f0c8511f))
- include timestamp in statediff api ([06f095a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/06f095a81ce917ec9c350c191f662f8b660123fd))
- refactor chef device ([#330](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/330)) ([3c857c6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3c857c668006dcef3bc37833987f7520fb6c9444))
- refactor pharos device SOFIE-2488 ([#333](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/333)) ([d57812c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d57812c2b2519635cadb7279803601f06918f91c))
- refactor singular-live device SOFIE-2492 ([#337](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/337)) ([2d08c7c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/2d08c7c14a53fa5c32b50e829f233c9f2a20654c))
- refactor telemtrics device SOFIE-2496 ([#335](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/335)) ([96e0f6c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/96e0f6ca66e479b2cadd61426ed5d7831da95c0b))
- refactor tricaster device SOFIE-2497 ([#336](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/336)) ([4b4d2f6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4b4d2f63fb16cc66fb348c4c276803ea430d457b))
- **sisyfos:** Send fadeTime with faderLevel if specified ([5fa0446](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5fa0446a2b35e13e0ca293628022eeed925eb79a))
- **state handler:** send commands before planned time of the state ([0a3ae5f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0a3ae5f6f764762c0761a53b4364314b945f1c9b))
- support timeline v9 ([3ccc759](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3ccc759f6d2d64cc2f3ca861634d96b427076490))
- update atem-connection and atem-state SOFIE-2504 ([#289](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/289)) ([10d1509](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/10d15093654b50364e6deb4e5fe947d6ac0b3058))
- update hyperdeck-connection ([65dc0dc](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/65dc0dc607a63d184ebb51a9c399e8631a0f835c))

### Bug Fixes

- synced synchronous getCurrentTime ([db4c3e6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/db4c3e6138396b8bd5dec85f54338e6add6af079))
- 'connectionChanged' event typings ([dcd9f02](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/dcd9f026258ddebcc5f3303a691910308f940da7))
- `TypeError: Cannot read properties of undefined (reading 'preliminary')` ([804f1ef](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/804f1ef7df42c7988cb57084d7706a4b8ff59aab))
- abstract add missing action ([172feb5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/172feb5ddbfc6d7b7371a369afdf5ce005186b56))
- abstract device to handle undefined old state ([5f656bd](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5f656bd1e28be012d8bfbf3f22f564588dee3dd8))
- add missing cleanup to osc and multi-osc ([71d1d8f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/71d1d8fb991abf5cfad691768b6acca66231b6c0))
- add missing typings for atem dve ([#305](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/305)) ([1758ffc](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/1758ffc229e8162efad5261dad8a83d69cf61747))
- bug in conductor resolve loop ([38a0a22](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/38a0a228a66a2613879642e9b4743a8eedd86505))
- CasparCG: add listMedia action (wip) ([f4277ad](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f4277ad5515d13803f9850b61b5110f7b8573706))
- conductor unit tests ([3bbf519](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3bbf519bd844ea3bb777f00e74c2f53483ab158d))
- **EAV-243:** improve oauthTokenHost UI description ([e2ee7cf](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e2ee7cfcf417d2f9aa790f7622d97c220a256828))
- **EAV-269:** default to vMix layers instead of deprecated overlays ([dc719c8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/dc719c8b105d88faf085daf059faef5b17dd03d0))
- ensure new services are added to `DevicesDict` ([0067869](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0067869a31b4d0c3a0afb8d0b647b655ed6a2fd3))
- missing httpsend enums ([920da05](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/920da0506cd9f2142d0edabfd9894ccd88d288cf))
- preliminary time is 0 for no commands ([9f1b481](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9f1b481d5792518a68265f8a32b414786302b7fa))
- reset atem upon connection ([9cbb458](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9cbb4581d7003cf9107428eb1d6dfba8d3b9c8fc))
- sisyfos add fade time during reset ([#339](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/339)) ([f6a3609](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f6a36092351d9487e02706762adba69951d5ecd7))
- suppress quantel disconnect shortly ([9b6621d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9b6621dff7d358e8d7870af304678beb3c197987))
- update casparcg-connection dependency ([e209ba8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e209ba822f9f026018a51d70498e0feb3a94473e))
- vmix: move pre-loading of media inputs into separate class ([39d3eba](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/39d3ebad6f175fc710bda7a94af6862a6452df80))
- vmix: move pre-loading of media inputs into separate class ([184fad5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/184fad55e91aef3f48ce5f8f94af1b9e869e5a71))

## [9.0.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.1...9.0.2) (2024-08-15)

### Bug Fixes

- atem supersource border properties SOFIE-3307 ([#341](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/341)) ([27213b0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/27213b0ca9fcf63ad70520e281f7e8e69bb7273d))

## [9.0.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0...9.0.1) (2024-04-02)

### Bug Fixes

- **vMix:** handling XML messages with multi-byte characters ([e811ef0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e811ef09f6118c69ea337e0b1eb969a663546bde))

## [9.0.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.8...9.0.0) (2024-02-23)

**Note:** Version bump only for package timeline-state-resolver-packages

## [9.0.0-release50.8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.1.4...9.0.0-release50.8) (2024-02-02)

### Bug Fixes

- **vMix:** fragmented message handling SOFIE-2932 ([#320](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/320)) ([c8fe3b1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c8fe3b1d5c5f625ceffd3d970efed1b525267165))
- **vMix:** handle sparse arrays in the state ([#319](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/319)) ([d7caf7d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d7caf7d30f397a9fdabafd438b4bf723f3f60bb4))

## [9.0.0-release50.7](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.1.0...9.0.0-release50.7) (2023-11-17)

### Features

- changes the implementation of how to assign a pollTime. ([88b875d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/88b875d4d6196f55379c2dadd6d4d570216a6f42))
- changes the logic for setting a pollInterval ([a482e57](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/a482e57e2a647de9421898df3fb061cf28c74408)), closes [#277](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/277)
- **quick-tsr:** add command report and debug logging ([f693569](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f693569601136d27c5fadb29b95787ef18c607ab))

### Bug Fixes

- `createDevice` race condition ([#296](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/296)) ([20abff2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/20abff2324809977e3ef1a135102791bd8b46525))
- add a future-proof "resetResolver" event ([feb709b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/feb709b5f4a80ce0ebcbe13329c86cec9904fbec))
- bad merge in casparcg device, causing issues with channel 1 ([#293](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/293)) ([e259f5c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e259f5c0d7cdde5bc9dcd7fa0120697b6810bae0))
- casparcg restart action always responds 'OK' SOFIE-2588 ([#295](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/295)) ([6488187](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/648818760a654e7e16407d6f635d59bb233870a3))
- **quick-tsr:** status logging ([634acb1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/634acb123ec9f215a398fd127e6542d5f44e92cd))
- remove unused casparcg useScheduling option ([#294](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/294)) ([06d3c96](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/06d3c967d2da012aa2f6655c34d382201a45cab8))
- update emberplus-connection ([0259fbf](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0259fbfaa45240d041052a0cb76bffe9241cf49f))
- update v-connection dependency ([2ba4ae3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/2ba4ae3cc769980a4b2b3c3c8a75a84d91d258f8))

## [9.0.0-release50.6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.5...9.0.0-release50.6) (2023-08-25)

### Bug Fixes

- another potential fix for this system not working as intended ([c75d4d8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c75d4d8ee6271be95d1fcd60f8741c3281db0521))
- **chef:** only stop windows that we know of in the Mappings ([43ab8f6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/43ab8f6b59eda4bdd1e244355a648ee2753ef2f2))
- **httpSend:** Use the same types for the sendCommand action as a timeline object ([#269](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/269)) ([3385217](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3385217afcb6e45aa37123f5400d1dea4a0c8972))
- media re-playing shortly after completing ([867f30f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/867f30f2ea3c5c4d568e471f054bfabed877d52b))
- prevent conflicts with sisyfos ([4780fcf](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4780fcfb816a58a9de44a9af320031def88214dc))
- promisify cb from threadedclass ([368ab92](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/368ab9209c5146a7e5f998dbbd69fd77b20e35f8))
- **sofie-chef:** resync state upon reconnect ([80f0ab9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/80f0ab9dc9616afdbf6e9c954163f09c18a3b8e1))
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

- add ci for quick-tsr ([9f2c3d1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9f2c3d1f6606af55228d96be5a064b585e6f8287))
- add types support for vMix stingers 3 and 4 ([44fa27d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/44fa27d164bd717b58d7f1d1255d56d132007865))
- allow multiple sisyfos devices ([3d47f82](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3d47f82f197ac58b68c21033eac6e0354fd72fa8))
- consider outputs (Auxes) when checking if something is on air ([d629ed6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d629ed6b8f022d72688765aebb48bc087fb6a963))
- consider overlays (DSKs) when checking if something is in PGM ([4863e0f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4863e0f70ef906dbe442d9cfb95e51f37a7cbc77))
- don't join response packets together with an extraneous newline ([9258d11](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9258d11ad99a2701895a91deba0779ff22d687df))
- enable and fix logic for non-List inputs ([4cd3173](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4cd3173ff6896d55a171d3ef6563163d8516452d))
- **PTZ:** clean up interval on terminate(), sort commands in a predictable order ([13b6698](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/13b6698101747c6c3ae2117b28a8bfa38c16b0eb))
- quick-tsr typing errors ([#267](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/267)) ([95b2eae](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/95b2eae93450db5f6f4d9f26c96380fa56b08a03))
- run post transition commands after overlays commands ([aa43869](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/aa43869085643cc104322ca6a3c8a65d53e1a685))
- **vmix:** account for the fact that some mixes may temporarily be undefined in the state ([50ffe80](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/50ffe805d9236bbd51924720c9927839d051c0bd))
- **vmix:** change how commands are ordered to reduce flashes of content in PGM ([b2ebaad](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b2ebaadbad0d9f1f48462f13ebe328cf14974594))
- **vmix:** inform parent about the connection status changing after initialization ([e4e380e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e4e380eae62ac1da6ec9a7881cdf461184bc497d))
- **vmix:** show a BAD status code when vMix is not initialized ([370be3a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/370be3af2f01bada232ea244c76b6c5507e9773f))
- wrap singular.live JSON commands in an array ([cc5b7ec](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/cc5b7ec61d456de993cbc0e25963c93ec8b65f38))

## [3.5.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.0.0-release49.0...3.5.1) (2023-03-31)

### ⚠ BREAKING CHANGES

- json schemas for device config and mappings (#237)

### Features

- json schemas for device config and mappings ([#237](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/237)) ([d43f3dc](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d43f3dc70f5c8843081760846e9aa38fa4c71396))
- replace makeready ([5abe41e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5abe41eaa421db4845a54837b2e3b41f2b33d062))
- SOF-1254 add me_clean support for mix ouputs ([7f3fb9c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/7f3fb9c7d9edb03022db69c6e206302c5c69a815))
- SOF-1254 add temporal priority to TriCaster ([7133774](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/7133774a49e03a038d91a9ec8fd8d0f13cbd962c))
- state handler initial commit ([a219c84](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/a219c84f899fec4ae7e53fa402be9b3911fb8a59))

### Bug Fixes

- osc animation should rely on monotonic time ([7989c9d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/7989c9de9b7e8e11e7f0ee74d62d843059a0053b))
- prevent lingering device containers ([e313198](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e31319855d67209f402a4263bac51af264678efa))
- SOF-1254 don't send layer commands when not in effect mode ([daa7d9b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/daa7d9bbd97cad87090592bb6f440f5efc0f048d))
- SOF-1254 use bin_index command for M/Es ([569bde0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/569bde0d863d3fefaed65fcda0c065a1203236a4))
- SOF-1254 wrong scale defaults ([0b66153](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0b6615351c9376d834868164b32797f2ea67de7d))
- SOF-1404 use upstreamKeyerId to address ATEM upstream keyers ([61b0061](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/61b006156849455ec4b59d92415cd820982b1706))

## [8.1.4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.1.3...8.1.4) (2024-01-18)

**Note:** Version bump only for package timeline-state-resolver-packages

## [8.1.3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.1.2...8.1.3) (2024-01-02)

### Features

- changes the implementation of how to assign a pollTime. ([88b875d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/88b875d4d6196f55379c2dadd6d4d570216a6f42))
- changes the logic for setting a pollInterval ([a482e57](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/a482e57e2a647de9421898df3fb061cf28c74408)), closes [#277](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/277)
- **quick-tsr:** add command report and debug logging ([f693569](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f693569601136d27c5fadb29b95787ef18c607ab))

### Bug Fixes

- `createDevice` race condition ([#296](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/296)) ([20abff2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/20abff2324809977e3ef1a135102791bd8b46525))
- add a future-proof "resetResolver" event ([feb709b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/feb709b5f4a80ce0ebcbe13329c86cec9904fbec))
- bad merge in casparcg device, causing issues with channel 1 ([#293](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/293)) ([e259f5c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e259f5c0d7cdde5bc9dcd7fa0120697b6810bae0))
- casparcg restart action always responds 'OK' SOFIE-2588 ([#295](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/295)) ([6488187](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/648818760a654e7e16407d6f635d59bb233870a3))
- **quick-tsr:** status logging ([634acb1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/634acb123ec9f215a398fd127e6542d5f44e92cd))
- remove unused casparcg useScheduling option ([#294](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/294)) ([06d3c96](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/06d3c967d2da012aa2f6655c34d382201a45cab8))
- update emberplus-connection ([0259fbf](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0259fbfaa45240d041052a0cb76bffe9241cf49f))

## [9.0.0-release50.6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.5...9.0.0-release50.6) (2023-08-25)

### Bug Fixes

- another potential fix for this system not working as intended ([c75d4d8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c75d4d8ee6271be95d1fcd60f8741c3281db0521))
- **chef:** only stop windows that we know of in the Mappings ([43ab8f6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/43ab8f6b59eda4bdd1e244355a648ee2753ef2f2))
- **httpSend:** Use the same types for the sendCommand action as a timeline object ([#269](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/269)) ([3385217](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3385217afcb6e45aa37123f5400d1dea4a0c8972))
- media re-playing shortly after completing ([867f30f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/867f30f2ea3c5c4d568e471f054bfabed877d52b))
- prevent conflicts with sisyfos ([4780fcf](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4780fcfb816a58a9de44a9af320031def88214dc))
- promisify cb from threadedclass ([368ab92](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/368ab9209c5146a7e5f998dbbd69fd77b20e35f8))
- **sofie-chef:** resync state upon reconnect ([80f0ab9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/80f0ab9dc9616afdbf6e9c954163f09c18a3b8e1))
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
- state handler initial commit ([a219c84](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/a219c84f899fec4ae7e53fa402be9b3911fb8a59))
- upgrade singular.live to API v2 ([2bb5c4d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/2bb5c4d2557710d55b27556cef919dc8419fa1e9))
- Use strings for DeviceType enum ([f1b95bc](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f1b95bcb972aff329bce9c67b15f58a98bbf48cf))
- **vMix:** retry sending media load commands if the file wasn't found ([4321aae](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4321aae2684ba4c7f55e3cf810dacae187fe282b))

### Bug Fixes

- add ci for quick-tsr ([9f2c3d1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9f2c3d1f6606af55228d96be5a064b585e6f8287))
- add types support for vMix stingers 3 and 4 ([44fa27d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/44fa27d164bd717b58d7f1d1255d56d132007865))
- allow multiple sisyfos devices ([3d47f82](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3d47f82f197ac58b68c21033eac6e0354fd72fa8))
- consider outputs (Auxes) when checking if something is on air ([d629ed6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d629ed6b8f022d72688765aebb48bc087fb6a963))
- consider overlays (DSKs) when checking if something is in PGM ([4863e0f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4863e0f70ef906dbe442d9cfb95e51f37a7cbc77))
- don't join response packets together with an extraneous newline ([9258d11](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9258d11ad99a2701895a91deba0779ff22d687df))
- enable and fix logic for non-List inputs ([4cd3173](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4cd3173ff6896d55a171d3ef6563163d8516452d))
- osc animation should rely on monotonic time ([7989c9d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/7989c9de9b7e8e11e7f0ee74d62d843059a0053b))
- prevent lingering device containers ([e313198](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e31319855d67209f402a4263bac51af264678efa))
- **PTZ:** clean up interval on terminate(), sort commands in a predictable order ([13b6698](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/13b6698101747c6c3ae2117b28a8bfa38c16b0eb))
- quick-tsr typing errors ([#267](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/267)) ([95b2eae](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/95b2eae93450db5f6f4d9f26c96380fa56b08a03))
- run post transition commands after overlays commands ([aa43869](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/aa43869085643cc104322ca6a3c8a65d53e1a685))
- SOF-1254 don't send layer commands when not in effect mode ([daa7d9b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/daa7d9bbd97cad87090592bb6f440f5efc0f048d))
- SOF-1254 use bin_index command for M/Es ([569bde0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/569bde0d863d3fefaed65fcda0c065a1203236a4))
- SOF-1254 wrong scale defaults ([0b66153](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0b6615351c9376d834868164b32797f2ea67de7d))
- SOF-1404 use upstreamKeyerId to address ATEM upstream keyers ([61b0061](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/61b006156849455ec4b59d92415cd820982b1706))
- **vmix:** account for the fact that some mixes may temporarily be undefined in the state ([50ffe80](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/50ffe805d9236bbd51924720c9927839d051c0bd))
- **vmix:** change how commands are ordered to reduce flashes of content in PGM ([b2ebaad](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b2ebaadbad0d9f1f48462f13ebe328cf14974594))
- **vmix:** inform parent about the connection status changing after initialization ([e4e380e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e4e380eae62ac1da6ec9a7881cdf461184bc497d))
- **vmix:** show a BAD status code when vMix is not initialized ([370be3a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/370be3af2f01bada232ea244c76b6c5507e9773f))
- wrap singular.live JSON commands in an array ([cc5b7ec](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/cc5b7ec61d456de993cbc0e25963c93ec8b65f38))

## [9.0.0-release50.6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.5...9.0.0-release50.6) (2023-08-25)

### Bug Fixes

- **chef:** only stop windows that we know of in the Mappings ([43ab8f6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/43ab8f6b59eda4bdd1e244355a648ee2753ef2f2))
- **httpSend:** Use the same types for the sendCommand action as a timeline object ([#269](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/269)) ([3385217](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3385217afcb6e45aa37123f5400d1dea4a0c8972))
- **sofie-chef:** resync state upon reconnect ([80f0ab9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/80f0ab9dc9616afdbf6e9c954163f09c18a3b8e1))

## [9.0.0-release50.5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.4...9.0.0-release50.5) (2023-07-03)

**Note:** Version bump only for package timeline-state-resolver-packages

## [9.0.0-release50.4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.3...9.0.0-release50.4) (2023-07-03)

**Note:** Version bump only for package timeline-state-resolver-packages

## [9.0.0-release50.3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.2...9.0.0-release50.3) (2023-07-03)

**Note:** Version bump only for package timeline-state-resolver-packages

## [9.0.0-release50.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.1...9.0.0-release50.2) (2023-07-03)

**Note:** Version bump only for package timeline-state-resolver-packages

## [9.0.0-release50.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/9.0.0-release50.0...9.0.0-release50.1) (2023-07-03)

**Note:** Version bump only for package timeline-state-resolver-packages

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

- add ci for quick-tsr ([9f2c3d1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9f2c3d1f6606af55228d96be5a064b585e6f8287))
- add types support for vMix stingers 3 and 4 ([44fa27d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/44fa27d164bd717b58d7f1d1255d56d132007865))
- allow multiple sisyfos devices ([3d47f82](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3d47f82f197ac58b68c21033eac6e0354fd72fa8))
- consider outputs (Auxes) when checking if something is on air ([d629ed6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d629ed6b8f022d72688765aebb48bc087fb6a963))
- consider overlays (DSKs) when checking if something is in PGM ([4863e0f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4863e0f70ef906dbe442d9cfb95e51f37a7cbc77))
- don't join response packets together with an extraneous newline ([9258d11](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9258d11ad99a2701895a91deba0779ff22d687df))
- enable and fix logic for non-List inputs ([4cd3173](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4cd3173ff6896d55a171d3ef6563163d8516452d))
- handle some additional cases in casparCG trackedState SOFIE-2359 ([#259](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/259)) ([810959f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/810959f06a13caef2e16fb9d90d8d8257ba1620e))
- **PTZ:** clean up interval on terminate(), sort commands in a predictable order ([13b6698](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/13b6698101747c6c3ae2117b28a8bfa38c16b0eb))
- quick-tsr typing errors ([#267](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/267)) ([95b2eae](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/95b2eae93450db5f6f4d9f26c96380fa56b08a03))
- run post transition commands after overlays commands ([aa43869](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/aa43869085643cc104322ca6a3c8a65d53e1a685))
- **vmix:** account for the fact that some mixes may temporarily be undefined in the state ([50ffe80](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/50ffe805d9236bbd51924720c9927839d051c0bd))
- **vmix:** change how commands are ordered to reduce flashes of content in PGM ([b2ebaad](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b2ebaadbad0d9f1f48462f13ebe328cf14974594))
- **vmix:** inform parent about the connection status changing after initialization ([e4e380e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e4e380eae62ac1da6ec9a7881cdf461184bc497d))
- **vmix:** show a BAD status code when vMix is not initialized ([370be3a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/370be3af2f01bada232ea244c76b6c5507e9773f))
- wrap singular.live JSON commands in an array ([cc5b7ec](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/cc5b7ec61d456de993cbc0e25963c93ec8b65f38))

### Reverts

- Revert "chore: enable node 20 in ci" ([2f31f95](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/2f31f95c8ef4b24d9401f27713a1bee1d5673960))

## [8.1.3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.1.2...8.1.3) (2024-01-02)

### Bug Fixes

- update failing ccg-connection ([54d031a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/54d031a9eddbaa06a2165c41a3da5a20fea610e9))

## [8.1.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.1.1...8.1.2) (2023-12-21)

### Bug Fixes

- suppress quantel disconnect shortly ([f04befb](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f04befb6464669cf8acd058cbeb541824a0bba1e))

## [8.1.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.1.0...8.1.1) (2023-11-29)

**Note:** Version bump only for package timeline-state-resolver-packages

## [8.1.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.0.0...8.1.0) (2023-10-19)

### Features

- VizMSE action to send clear-commands (configured on the device settings) to all Engines in the Profile ([38e313f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/38e313f77dfa7e61f495acf274b872768a1dbaa5))

## [8.0.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.1...8.0.0) (2023-10-05)

### Features

- atem audio routing control SOFIE-2512 ([#274](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/274)) ([de9dfd1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/de9dfd138452794bd7ad83a2fd1e82d2849abdcd))

### Bug Fixes

- export lawo parametertype ([65a73c4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/65a73c41eb31cc2a18df9f0d282255c6cf6a171b))
- handle some additional cases in casparCG trackedState SOFIE-2359 ([#259](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/259)) ([810959f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/810959f06a13caef2e16fb9d90d8d8257ba1620e))

### Reverts

- Revert "chore: enable node 20 in ci" ([2f31f95](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/2f31f95c8ef4b24d9401f27713a1bee1d5673960))

## [8.0.0-release49.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.0.0-release48.2...8.0.0-release49.0) (2023-03-21)

## [8.0.0-release48.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0...8.0.0-release48.2) (2023-03-21)

### Features

- Vmix preset actions ([8b31294](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8b3129412f3881ff9db2cd059927e5b5f3ae6caf))

### Bug Fixes

- casparcg doesnt resync state after server restart SOFIE-2156 ([#248](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/248)) ([13d51dc](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/13d51dca9d0587e20fb78405834adee106ae60b1))
- change `DeviceType.MULTI_OSC` value ([386ba6c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/386ba6c791a090553cf1d66c73ae82cb25edd03f))
- pause List inputs before emptying them ([9abc089](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9abc0895ae02a2dfd387551b9f3a7f495abf6282))
- properly parse multi-packet vMix TCP API responses ([754adeb](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/754adeb578e18851b6a6f1dd026e11ac12bed702))
- properly parse multi-packet vMix TCP API responses ([35ba046](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/35ba0464905e29d1f84c2c61327e321250a44e73))
- reduce amount of `setTimeout` when using `DoInTime` in `BURST` mode ([5123405](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/51234050e12156e08cc0e1a13e28ca17046e7a42))
- review comments ([cb21206](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/cb2120650f928e1bc7958136318403feb1d493ec))

## [7.5.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.7...7.5.0) (2023-02-28)

### Bug Fixes

- ensure that LIST_REMOVE_ALL and LIST_ADD are sent before most other commands ([13bf78a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/13bf78ad650df861dc1305998dc55e9d779d77ac))

## [7.5.0-release47.7](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.0.0-release48.1...7.5.0-release47.7) (2023-02-24)

### Features

- **vmix:** add support for ListRemoveAll and ListAdd commands ([4a7240f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4a7240f7b2819bb16f263b72d1b06b98e3c40353))
- **vmix:** add support for starting and stopping VB.NET scripts ([9f2d4ee](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9f2d4eeeccd9ba0017fc00cfe5df18e3717ea660))

### Bug Fixes

- allow resetting to baseline ([572118b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/572118b94a2855598848f1daa1575bc3ccc6186a))
- update v-connection dependency ([3163188](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/316318801a3babc54f6222621c16c4061d78aafd))

## [8.0.0-release48.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.6...8.0.0-release48.1) (2023-02-14)

### Bug Fixes

- improve data fragmentation handling, logging of unrecognized responses ([96cfe87](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/96cfe87f68d223ea6ef5566a31e2fd7caa9abe2e))

## [7.5.0-release47.6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.5...7.5.0-release47.6) (2023-02-07)

### Bug Fixes

- change mocks to be TCP, fix vmixAPI test ([def9a21](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/def9a21719815ec20c99dabd49bfa7c553136cb0))
- osc animation should rely on monotonic time ([7989c9d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/7989c9de9b7e8e11e7f0ee74d62d843059a0053b))
- prevent lingering device containers ([e313198](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e31319855d67209f402a4263bac51af264678efa))
- telemetrics device will never start, because the file path to class is wrong ([8f722c4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8f722c44fc4749dd815cb1fbd75d24f8d995a334))
- use TCP for vmix api ([3c1d1f6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3c1d1f65042772b03e9e8284dda5b4e0feca80d9))
- **vmix:** improve vmix mock, update tests to use new mock ([265dcf1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/265dcf1a0f4d05cc6fc549a2783f51a782bc0c26))

## [7.5.0-release47.5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.4...7.5.0-release47.5) (2023-01-16)

## [7.5.0-release47.4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.0.0-release48.0...7.5.0-release47.4) (2023-01-13)

### Features

- Emit debug state ([516a512](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/516a51203aa0af8c0a47552ecf9c0c99cd01d0be))
- multi osc device ([b987680](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b9876808d44543903e45ab5a1a1a2b85beed4aac))
- state handler initial commit ([a219c84](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/a219c84f899fec4ae7e53fa402be9b3911fb8a59))

### Bug Fixes

- multi osc device udp stateless ([af34aa0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/af34aa023965b2e5e18b54f66478812a2488ecb8))

## [8.0.0-release48.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/3.0.3...8.0.0-release48.0) (2022-12-12)

### ⚠ BREAKING CHANGES

- drop support for node 14 (for tsr, tsr-types support remains)
- refactor types to work better with typescript 4.7 (#227)

### Features

- add vizmse actions ([f7e585c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f7e585c97e852ab30e9fd6d20077be906038af70))
- import quick-tsr to this repository ([bd42303](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/bd42303dc68054db530d10ccc590f63017b15afe))
- refactor types to work better with typescript 4.7 ([#227](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/227)) ([abe499c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/abe499ce1da13c2d7a68333f6b1dcc8c7ea71e97))
- translations for actions ([df4cb43](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/df4cb43cf16a8e2ae34c1fe44801c5a327f9b01e))

### Bug Fixes

- add optional parameter to HTTPSend timelineObj: paramsType ([979dc61](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/979dc61748c4c371a8b17c7fd8c5929c69f747d9))
- add support for Node 18 ([6242dd6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6242dd68f54a491aa71bdfd30b066550d6f7e90e))
- bug fix: HTTPSend device didn't send GET requests ([8315531](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/83155314706497a9c630dbde14d5c5d7e57103cf))
- prevent in place reverse in setDatastore ([473ab71](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/473ab713785325c2062db983c8ece80ea5dede4d))

### Miscellaneous Chores

- drop support for node 14 (for tsr, tsr-types support remains) ([36c4859](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/36c48597226dd86270b06040c64c7d3518c32e87))

## [7.5.0-release47.3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.2...7.5.0-release47.3) (2022-11-07)

### Bug Fixes

- track ccg state internally ([fd5596f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/fd5596fcf975a7a122c6fb21946f13c2e97a4233))

## [7.5.0-release47.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.1...7.5.0-release47.2) (2022-11-02)

### Features

- action manifests ([681d4c8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/681d4c8a72fb409dba919fd13db17f3c2f168d1a))

## [7.5.0-release47.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/2.3.0...7.5.0-release47.1) (2022-11-02)

### Features

- update for casparcg-connection rewrite ([5dfdd23](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5dfdd2320caf89432d36513026c1259e2cf3d366))

### Bug Fixes

- add method to manually purge viz rundown ([49737e2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/49737e2fba1b967b1b5d6d84e5c1624ee3a9ab11))

## [7.5.0-release47.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.3.0...7.5.0-release47.0) (2022-10-28)

## [7.3.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/2.2.3...7.3.0) (2022-10-24)

### Features

- add Sofie Chef device ([4fac092](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4fac092d6f896d1f5fa77c92b7f8a69339a75c55))

### Bug Fixes

- add methods for restarting windows ([31e4289](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/31e4289cceb8b7472e7749fc33daa98b64229675))
- improve error for http-device ([40d00ab](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/40d00abb27f478b81ad11d121f7863e29047309b))
- re-add net mock connect callback ([95ebdad](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/95ebdad8881885e8078ed868700e93aa1e974106))
- re-adds a check for clearAllOnMakeReady before doing so ([4b6168f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4b6168fbfc938d60f479b18d140ced21bf4a598e))
- update SofieChef device API ([514d827](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/514d8271dd0d1fbce673154067d92f02a25e0b4b))

## [8.0.0-release49.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/8.0.0-release48.2...8.0.0-release49.0) (2023-03-21)

### ⚠ BREAKING CHANGES

- resolve MSE show names to IDs using the directory

### Features

- Emit debug state ([516a512](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/516a51203aa0af8c0a47552ecf9c0c99cd01d0be))
- multi osc device ([b987680](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b9876808d44543903e45ab5a1a1a2b85beed4aac))
- resolve MSE show names to IDs using the directory ([e094dda](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e094dda7dbd14b312ff8ffef5d45a39a1e802bcf))
- SOF-1135 make `createDevice` and `initDevice` abortable ([70bfef2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/70bfef20029b8972aeb248a7c2012b5d92fb2ecc))
- SOF-1140 handle warnings from v-connection ([a48d313](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/a48d313d20344ebd8a061c625d8ed3491df95465))
- SOF-1254 add TriCaster integration ([06b129e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/06b129ecec2d87b0caaa22fda36b2b5ef953653e))
- SOF-1254 add TriCaster matrix support ([dbb1b26](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/dbb1b26e84a41227e3eca0fae902bf5b57ca5d8e))
- Vmix preset actions ([8b31294](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8b3129412f3881ff9db2cd059927e5b5f3ae6caf))
- **vmix:** add support for ListRemoveAll and ListAdd commands ([4a7240f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4a7240f7b2819bb16f263b72d1b06b98e3c40353))
- **vmix:** add support for starting and stopping VB.NET scripts ([9f2d4ee](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9f2d4eeeccd9ba0017fc00cfe5df18e3717ea660))

### Bug Fixes

- allow resetting to baseline ([572118b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/572118b94a2855598848f1daa1575bc3ccc6186a))
- change `DeviceType.MULTI_OSC` value ([386ba6c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/386ba6c791a090553cf1d66c73ae82cb25edd03f))
- ensure that LIST_REMOVE_ALL and LIST_ADD are sent before most other commands ([13bf78a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/13bf78ad650df861dc1305998dc55e9d779d77ac))
- multi osc device udp stateless ([af34aa0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/af34aa023965b2e5e18b54f66478812a2488ecb8))
- pause List inputs before emptying them ([9abc089](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9abc0895ae02a2dfd387551b9f3a7f495abf6282))
- properly parse multi-packet vMix TCP API responses ([35ba046](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/35ba0464905e29d1f84c2c61327e321250a44e73))
- reduce amount of `setTimeout` when using `DoInTime` in `BURST` mode ([5123405](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/51234050e12156e08cc0e1a13e28ca17046e7a42))
- review comments ([cb21206](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/cb2120650f928e1bc7958136318403feb1d493ec))
- SOF-1140 wrap strings in Errors to avoid mangled logs ([bca62cb](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/bca62cb7d3abd05974e79f5eece079de98a4bacf))
- SOF-1254 control only resources that are mapped ([7892669](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/789266983a40cfc52df75fce48cb5dbce4c977f3))
- SOF-1254 improve types ([0471a7b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0471a7bf64f7340e83b5b6f47212003fd2586ca6))
- SOF-1254 log warning when websocket disconnected ([3d9964a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3d9964af7c4352c36e95824dd323cd2fe46717fd))
- SOF-1254 type guards and make some properties optional ([f8b8aab](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f8b8aab02a0ef7f0ad8814365ca3e08820c9a1af))
- unable to resolve show ids (bug from previous refactor) ([cdf2c62](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/cdf2c62227517e7a48a7c8c7ae102374167056cd))

# [8.0.0-release48.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0...8.0.0-release48.2) (2023-03-21)

### Bug Fixes

- casparcg doesnt resync state after server restart SOFIE-2156 ([#248](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/248)) ([13d51dc](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/13d51dca9d0587e20fb78405834adee106ae60b1))
- properly parse multi-packet vMix TCP API responses ([754adeb](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/754adeb578e18851b6a6f1dd026e11ac12bed702))

# [8.0.0-release48.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.6...8.0.0-release48.1) (2023-02-14)

### Bug Fixes

- change mocks to be TCP, fix vmixAPI test ([def9a21](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/def9a21719815ec20c99dabd49bfa7c553136cb0))
- improve data fragmentation handling, logging of unrecognized responses ([96cfe87](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/96cfe87f68d223ea6ef5566a31e2fd7caa9abe2e))
- use TCP for vmix api ([3c1d1f6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3c1d1f65042772b03e9e8284dda5b4e0feca80d9))
- **vmix:** improve vmix mock, update tests to use new mock ([265dcf1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/265dcf1a0f4d05cc6fc549a2783f51a782bc0c26))

# [8.0.0-release48.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.3...8.0.0-release48.0) (2022-12-12)

### Features

- action manifests ([681d4c8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/681d4c8a72fb409dba919fd13db17f3c2f168d1a))
- add vizmse actions ([f7e585c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f7e585c97e852ab30e9fd6d20077be906038af70))
- import quick-tsr to this repository ([bd42303](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/bd42303dc68054db530d10ccc590f63017b15afe))
- translations for actions ([df4cb43](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/df4cb43cf16a8e2ae34c1fe44801c5a327f9b01e))
- update for casparcg-connection rewrite ([5dfdd23](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5dfdd2320caf89432d36513026c1259e2cf3d366))

# [8.0.0-release48.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.6...8.0.0-release48.1) (2023-02-14)

### Bug Fixes

- change mocks to be TCP, fix vmixAPI test ([def9a21](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/def9a21719815ec20c99dabd49bfa7c553136cb0))
- improve data fragmentation handling, logging of unrecognized responses ([96cfe87](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/96cfe87f68d223ea6ef5566a31e2fd7caa9abe2e))
- use TCP for vmix api ([3c1d1f6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3c1d1f65042772b03e9e8284dda5b4e0feca80d9))
- **vmix:** improve vmix mock, update tests to use new mock ([265dcf1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/265dcf1a0f4d05cc6fc549a2783f51a782bc0c26))

# [8.0.0-release48.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.3...8.0.0-release48.0) (2022-12-12)

### Features

- action manifests ([681d4c8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/681d4c8a72fb409dba919fd13db17f3c2f168d1a))
- add vizmse actions ([f7e585c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f7e585c97e852ab30e9fd6d20077be906038af70))
- import quick-tsr to this repository ([bd42303](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/bd42303dc68054db530d10ccc590f63017b15afe))
- translations for actions ([df4cb43](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/df4cb43cf16a8e2ae34c1fe44801c5a327f9b01e))
- update for casparcg-connection rewrite ([5dfdd23](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5dfdd2320caf89432d36513026c1259e2cf3d366))

# [8.0.0-release48.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.3...8.0.0-release48.0) (2022-12-12)

### Bug Fixes

- add optional parameter to HTTPSend timelineObj: paramsType ([979dc61](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/979dc61748c4c371a8b17c7fd8c5929c69f747d9))
- add support for Node 18 ([6242dd6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6242dd68f54a491aa71bdfd30b066550d6f7e90e))
- bug fix: HTTPSend device didn't send GET requests ([8315531](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/83155314706497a9c630dbde14d5c5d7e57103cf))
- prevent in place reverse in setDatastore ([473ab71](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/473ab713785325c2062db983c8ece80ea5dede4d))
- track ccg state internally ([fd5596f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/fd5596fcf975a7a122c6fb21946f13c2e97a4233))

### Features

- action manifests ([681d4c8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/681d4c8a72fb409dba919fd13db17f3c2f168d1a))
- add vizmse actions ([f7e585c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f7e585c97e852ab30e9fd6d20077be906038af70))
- import quick-tsr to this repository ([bd42303](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/bd42303dc68054db530d10ccc590f63017b15afe))
- translations for actions ([df4cb43](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/df4cb43cf16a8e2ae34c1fe44801c5a327f9b01e))
- update for casparcg-connection rewrite ([5dfdd23](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5dfdd2320caf89432d36513026c1259e2cf3d366))

## [7.5.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0...7.5.1) (2023-09-04)

### Bug Fixes

- casparcg disconnect handler may not fire ([74c1f8a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/74c1f8ac6626bdc9c7ac2bb2737550306905f4b1))
- **sisyfos:** remove local port & terminate correctly ([c11801a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c11801a1f787e3fbd965416138e973c3c940d1b7))
- terminate devices fully ([028167a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/028167ae7dbc1e2cb5f70820554068d434bed75d))

# [7.5.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.7...7.5.0) (2023-02-28)

**Note:** Version bump only for package timeline-state-resolver-packages

# [7.5.0-release47.7](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.6...7.5.0-release47.7) (2023-02-24)

### Bug Fixes

- update v-connection dependency ([3163188](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/316318801a3babc54f6222621c16c4061d78aafd))

# [7.5.0-release47.6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.5...7.5.0-release47.6) (2023-02-07)

### Bug Fixes

- telemetrics device will never start, because the file path to class is wrong ([8f722c4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8f722c44fc4749dd815cb1fbd75d24f8d995a334))

# [7.5.0-release47.5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.4...7.5.0-release47.5) (2023-01-16)

**Note:** Version bump only for package timeline-state-resolver-packages

# [7.5.0-release47.4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.3...7.5.0-release47.4) (2023-01-13)

### Bug Fixes

- add optional parameter to HTTPSend timelineObj: paramsType ([979dc61](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/979dc61748c4c371a8b17c7fd8c5929c69f747d9))
- add support for Node 18 ([6242dd6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6242dd68f54a491aa71bdfd30b066550d6f7e90e))
- bug fix: HTTPSend device didn't send GET requests ([8315531](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/83155314706497a9c630dbde14d5c5d7e57103cf))
- prevent in place reverse in setDatastore ([473ab71](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/473ab713785325c2062db983c8ece80ea5dede4d))
- track ccg state internally ([fd5596f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/fd5596fcf975a7a122c6fb21946f13c2e97a4233))

# [7.5.0-release47.3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.2...7.5.0-release47.3) (2022-11-07)

**Note:** Version bump only for package timeline-state-resolver-packages

# [7.5.0-release47.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.1...7.5.0-release47.2) (2022-11-02)

**Note:** Version bump only for package timeline-state-resolver-packages

# [7.5.0-release47.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.5.0-release47.0...7.5.0-release47.1) (2022-11-02)

### Bug Fixes

- add method to manually purge viz rundown ([49737e2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/49737e2fba1b967b1b5d6d84e5c1624ee3a9ab11))

# [7.5.0-release47.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.3.0...7.5.0-release47.0) (2022-10-28)

### Bug Fixes

- add methods for restarting windows ([31e4289](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/31e4289cceb8b7472e7749fc33daa98b64229675))
- add thread event handling for AsyncResolver thread ([3a7581b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3a7581ba8a31b84deba54b46146b1811eb2868d8))
- add thread event handling for AsyncResolver thread ([68904e2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/68904e20c119b4df6bb665f725acb39b86bc54b8))
- register error handler in threadedClass ([67f42f3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/67f42f3dc8bd7c41a7737d31aea1d3480876c8c5))
- register error handler in threadedClass ([dae9db0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/dae9db0a0876a873702f27770771ec01cfc5d1e0))
- timeout a device terminate operation if it takes too long and force-terminate ([7686d8b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/7686d8b9b11027daaefbd06028b5dbe7d96c0595))
- update SofieChef device API ([514d827](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/514d8271dd0d1fbce673154067d92f02a25e0b4b))

### Features

- add Sofie Chef device ([4fac092](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4fac092d6f896d1f5fa77c92b7f8a69339a75c55))

# [7.4.0-release46.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.4.0-release46.0...7.4.0-release46.1) (2022-09-27)

### Bug Fixes

- improve error for http-device ([40d00ab](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/40d00abb27f478b81ad11d121f7863e29047309b))
- use tlTime instead of time to remove future callbacks. ([0e70a3f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0e70a3f51253ede85c233714fd0b42fd83cffae2))

# [7.4.0-release46.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.3.0-release44.1...7.4.0-release46.0) (2022-09-26)

### Bug Fixes

- don't stop playback when clipId is null ([cfc8f2e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/cfc8f2e2c5e467e783e2fcf18377078caf313ad1))
- fixed memory leak in datastore ([8e06eb6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8e06eb68c2352b59e7298c1bc2543ffa150edd7f))
- improve callBackId creation, so that it relies more on the incoming timeline objects, rather than resolved timeline objects ([349dbf3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/349dbf3d8f829fcd15b0480f1af1724d76bd1afa))
- index datastore references by path ([9b48d72](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9b48d725d79d4eee13e7347e450abaadf02b6db2))
- invert warnOnEmptySlots to suppressEmptySlotWarnings ([edcd7b0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/edcd7b0fde747ae160c93f2ca1284661153f5647))
- lowered logging level for a apparent log call via an event. ([ca06e3b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/ca06e3bbe60acf27220ab9773c1751454bea8b8f))
- move all references to the root of the tl obj ([130b6c3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/130b6c3a908b0911f94ccedc67e7004404f11010))
- put 'em back to make linter happy ([e83a5ed](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e83a5ed87f1983b16c9b5b8c134e1441fb8d324a))
- re-add programInput ([b4a644f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b4a644fd24823af8903fdfab4a5bd28743bca20d))
- Remove listeners to prevent memory leak ([d0df778](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d0df778651256c4811ec39521285f3a28521bbc0))
- Retry to initialize the rundown ([583e32e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/583e32e4cb3eb5a7b46d9b4a460c13471ef0445d))
- send only one callback per timeline object ([00b168d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/00b168dc5511881ef9471dca1a4851342d6d115b))
- SOF-1046 prevent resetting transition on startup ([e52cf60](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e52cf60c07e58062c346bf0a84e48a9106b28105))
- SOF-1091 increase threadedClass freezeLimit ([f852b99](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f852b99415000da334dffa370267e69314832956))
- test after casparcg-state update ([c93ab57](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c93ab5750344d67ae8d1ef6c34ca47ca7d60d3f9))
- **types:** remove unsupported/manual transport statuses ([b362072](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b362072424236f13f9c04bf477d6b98e41254359))
- unrelated build errors ([68791e9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/68791e9bc1602488e69c2fe3c5b49c74b6e5b538))
- update typings with datastore references ([2c0074b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/2c0074bc74d8fa0eead89b44b558e73de4057638))

### Features

- **datastore:** newer tl objs will override entry ([9f31b9f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9f31b9f614b1c54665ce4c379e912e19603abdce))
- **HyperDeck:** add "warnOnEmptySlots" option ([233a413](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/233a4132097f38723b7150b7e61635f39e08115d))
- **Hyperdeck:** add explicit support for Preview and Stopped states ([133776f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/133776f2cbc5bfc1ef9255b0f1e161357ae6e339))
- **Hyperdeck:** add support for play and goto commands ([50e9e15](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/50e9e156651ba250a4fa3d5fcc01a184ba928ade))
- include more info about the request ([f17ad70](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f17ad70fd90afc819d878e143d6130edf672be1f))
- Send custom clear commands to Viz Engines ([40eb6e9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/40eb6e9a73cae2202389912d1f475a85be3598ae))
- timeline datastore prototype ([e122e8b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e122e8bff7404b1955853131d24144c660f76753))
- **vizMSE:** add logging of request body when client error caught ([85a2894](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/85a2894c66c1a06cc0ddee2e1c72745f294f0998))

# [7.3.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.3.0-release44.2...7.3.0) (2022-10-24)

### Bug Fixes

- re-add net mock connect callback ([95ebdad](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/95ebdad8881885e8078ed868700e93aa1e974106))
- re-adds a check for clearAllOnMakeReady before doing so ([4b6168f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4b6168fbfc938d60f479b18d140ced21bf4a598e))

# [7.3.0-release44.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.3.0-release44.1...7.3.0-release44.2) (2022-09-29)

### Bug Fixes

- don't stop playback when clipId is null ([cfc8f2e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/cfc8f2e2c5e467e783e2fcf18377078caf313ad1))
- fixed memory leak in datastore ([8e06eb6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8e06eb68c2352b59e7298c1bc2543ffa150edd7f))
- improve callBackId creation, so that it relies more on the incoming timeline objects, rather than resolved timeline objects ([349dbf3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/349dbf3d8f829fcd15b0480f1af1724d76bd1afa))
- index datastore references by path ([9b48d72](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9b48d725d79d4eee13e7347e450abaadf02b6db2))
- invert warnOnEmptySlots to suppressEmptySlotWarnings ([edcd7b0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/edcd7b0fde747ae160c93f2ca1284661153f5647))
- lowered logging level for a apparent log call via an event. ([ca06e3b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/ca06e3bbe60acf27220ab9773c1751454bea8b8f))
- move all references to the root of the tl obj ([130b6c3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/130b6c3a908b0911f94ccedc67e7004404f11010))
- put 'em back to make linter happy ([e83a5ed](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e83a5ed87f1983b16c9b5b8c134e1441fb8d324a))
- re-add programInput ([b4a644f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b4a644fd24823af8903fdfab4a5bd28743bca20d))
- Remove listeners to prevent memory leak ([d0df778](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d0df778651256c4811ec39521285f3a28521bbc0))
- Retry to initialize the rundown ([583e32e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/583e32e4cb3eb5a7b46d9b4a460c13471ef0445d))
- send only one callback per timeline object ([00b168d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/00b168dc5511881ef9471dca1a4851342d6d115b))
- SOF-1046 prevent resetting transition on startup ([e52cf60](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e52cf60c07e58062c346bf0a84e48a9106b28105))
- SOF-1091 increase threadedClass freezeLimit ([f852b99](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f852b99415000da334dffa370267e69314832956))
- test after casparcg-state update ([c93ab57](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c93ab5750344d67ae8d1ef6c34ca47ca7d60d3f9))
- **types:** remove unsupported/manual transport statuses ([b362072](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b362072424236f13f9c04bf477d6b98e41254359))
- unrelated build errors ([68791e9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/68791e9bc1602488e69c2fe3c5b49c74b6e5b538))
- update typings with datastore references ([2c0074b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/2c0074bc74d8fa0eead89b44b558e73de4057638))
- use tlTime instead of time to remove future callbacks. ([0e70a3f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0e70a3f51253ede85c233714fd0b42fd83cffae2))

### Features

- **datastore:** newer tl objs will override entry ([9f31b9f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9f31b9f614b1c54665ce4c379e912e19603abdce))
- **HyperDeck:** add "warnOnEmptySlots" option ([233a413](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/233a4132097f38723b7150b7e61635f39e08115d))
- **Hyperdeck:** add explicit support for Preview and Stopped states ([133776f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/133776f2cbc5bfc1ef9255b0f1e161357ae6e339))
- **Hyperdeck:** add support for play and goto commands ([50e9e15](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/50e9e156651ba250a4fa3d5fcc01a184ba928ade))
- include more info about the request ([f17ad70](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f17ad70fd90afc819d878e143d6130edf672be1f))
- Send custom clear commands to Viz Engines ([40eb6e9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/40eb6e9a73cae2202389912d1f475a85be3598ae))
- timeline datastore prototype ([e122e8b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e122e8bff7404b1955853131d24144c660f76753))
- **vizMSE:** add logging of request body when client error caught ([85a2894](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/85a2894c66c1a06cc0ddee2e1c72745f294f0998))

# [7.4.0-release46.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.3.0-release44.1...7.4.0-release46.0) (2022-09-26)

### Bug Fixes

- don't stop playback when clipId is null ([cfc8f2e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/cfc8f2e2c5e467e783e2fcf18377078caf313ad1))
- invert warnOnEmptySlots to suppressEmptySlotWarnings ([edcd7b0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/edcd7b0fde747ae160c93f2ca1284661153f5647))
- lowered logging level for a apparent log call via an event. ([ca06e3b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/ca06e3bbe60acf27220ab9773c1751454bea8b8f))
- put 'em back to make linter happy ([e83a5ed](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e83a5ed87f1983b16c9b5b8c134e1441fb8d324a))
- re-add programInput ([b4a644f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b4a644fd24823af8903fdfab4a5bd28743bca20d))
- Remove listeners to prevent memory leak ([d0df778](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d0df778651256c4811ec39521285f3a28521bbc0))
- Retry to initialize the rundown ([583e32e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/583e32e4cb3eb5a7b46d9b4a460c13471ef0445d))
- SOF-1046 prevent resetting transition on startup ([e52cf60](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e52cf60c07e58062c346bf0a84e48a9106b28105))
- SOF-1091 increase threadedClass freezeLimit ([f852b99](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f852b99415000da334dffa370267e69314832956))
- test after casparcg-state update ([c93ab57](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c93ab5750344d67ae8d1ef6c34ca47ca7d60d3f9))
- **types:** remove unsupported/manual transport statuses ([b362072](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b362072424236f13f9c04bf477d6b98e41254359))
- unrelated build errors ([68791e9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/68791e9bc1602488e69c2fe3c5b49c74b6e5b538))

### Features

- **HyperDeck:** add "warnOnEmptySlots" option ([233a413](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/233a4132097f38723b7150b7e61635f39e08115d))
- **Hyperdeck:** add explicit support for Preview and Stopped states ([133776f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/133776f2cbc5bfc1ef9255b0f1e161357ae6e339))
- **Hyperdeck:** add support for play and goto commands ([50e9e15](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/50e9e156651ba250a4fa3d5fcc01a184ba928ade))
- include more info about the request ([f17ad70](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f17ad70fd90afc819d878e143d6130edf672be1f))
- Send custom clear commands to Viz Engines ([40eb6e9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/40eb6e9a73cae2202389912d1f475a85be3598ae))
- **vizMSE:** add logging of request body when client error caught ([85a2894](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/85a2894c66c1a06cc0ddee2e1c72745f294f0998))

# [7.3.0-release44.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.3.0-release44.1...7.3.0-release44.2) (2022-09-29)

- timeout a device terminate operation if it takes too long and force-terminate ([59ec81a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/59ec81a2947a8f48b699fd52f6e9185dd1587f2e))

# [7.3.0-release44.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.3.0-release44.0...7.3.0-release44.1) (2022-09-22)

### Bug Fixes

- update v-connection dep ([53fbc96](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/53fbc9650f905ace72563f3b4f0e44f45e951685))

# [7.3.0-release44.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.0.1...7.3.0-release44.0) (2022-07-04)

# [7.1.0-release42.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.1.0-release42.1...7.1.0-release42.2) (2022-05-19)

### Bug Fixes

- update casparcg-state ([7698a5d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/7698a5dff610fd74e79f9b6348beb872a319f018))

# [7.1.0-release42.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.0.0-release41.2...7.1.0-release42.1) (2022-04-29)

### Bug Fixes

- Build errors ([249032d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/249032d8deb9bfd8568d9fb5275f1dd58e4b4647))
- Retry if retryInterval >=0 ([3616a03](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3616a03dd0b138414845b02c5553fac26342e3d9))
- update hyperdeck dep ([db75cc6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/db75cc666bdfd8e5133b604ec56699cee50f2d0b))
- update supertimeline ([251c8b5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/251c8b5a83d84e8457cabe8badcf2e52cf10d3ba))
- yarn upgrade ([40aa2e5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/40aa2e5a21149b89735fd8e6a85c9c2366a274d3))

### Features

- SOF-752 show init and cleanup ([44264b0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/44264b08bddccbbe62c6779beb8acba18f438080))

### Reverts

- Revert "7.1.0" ([8ce054c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8ce054c6016fc0d23ef37a3ae1d233090a829fb9))
- Revert "test: Rename package on publish" ([855f772](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/855f7725d73878d10caea077aec50429e3146b41))

## [1.0.2-release37.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/1.0.2-release37...1.0.2-release37.1) (2021-09-02)

## [1.0.2-release37](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/1.0.1-release37...1.0.2-release37) (2021-08-31)

## [1.0.1-release37](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/1.0.0-release37...1.0.1-release37) (2021-08-31)

# [1.0.0-release37](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.1.0-release36.1...1.0.0-release37) (2021-08-31)

### Bug Fixes

- allow multiple mappings to reference 1 casparcg layer ([a604b08](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/a604b08d902b8d677fe9b7d296b605d3c8961504))
- bad merge ([dd6ea93](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/dd6ea93bfd0ee62a403df7abc251ede409c624b5))
- do not clear elements and engines when going rehearsal<->active ([09bf843](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/09bf84332eaab4ded856772f53ff0323df123b78))
- do not purge baseline items ([0fe088d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0fe088d02330b289de97874ed92eba7b335b12ae))
- do not purge elements when going active<->rehearsal ([587b795](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/587b7953b258245b771aa611576affc10f82e77a))
- elements to keep criteria ([3146254](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3146254dacb22031124c10da33ee6b989f28773f))
- Errors from cherry pick ([4754a67](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4754a67e8dd38c081b91f07c5749b0e268cf9180))
- exceptions and timeouts ([6cb01ad](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6cb01ad5fc738a1bc6d97fc5718c95d1ecb73e2d))
- extend templateData when allowing multiple mappings to reference 1 casparcg layer ([eb04832](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/eb0483201f7d368bcadadfa5c6837c3f1c4c2903))
- keep checking status of loaded elements ([3085502](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/30855020b5b93ea10591fea2f45810a438966ba8))
- load only elements from the active playlist when restarting ([7d21e69](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/7d21e69dbfc959fee871746d83f9cfa1dade9b2d))
- make -1 disable caspar retry ([8069aaa](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8069aaaab456dcaf9eb2533caf3670b3a32ee736))
- make makeReady execute faster ([913bcfc](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/913bcfcdd876fd85bdecf3855a6589f6d7b56fba))
- missing optional chaining ([11862a9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/11862a95d5ee9caed0ec19f5abae7769eab17863))
- prevent duplicate external elements ([6472eaf](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6472eaf267dc45fe423b7cd3d3fa0d5ba109cf5e))
- recreate removed mediaObjects after reconnecting ([1a7e65d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/1a7e65d0a3b5a0942f2f06deb7b58366d2827802))
- rehearsal<->active when gateway was restarted ([3c40715](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3c40715210230e1c864f92d9e814f05b2e2c0a42))
- reload external elements that became unloaded ([93bf3aa](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/93bf3aad6fbc53d2391e6a1eec013548cac27634))
- remove duplicates in incoming data ([e86f170](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e86f170cd6753025347a42f4685716837543b089))
- Remove ExpectedPlayoutItemContentBase from tsr-types [publish] ([cd92561](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/cd92561a02e58f02d5c97351cc67934f77ecb5fb))
- report channel name instead of engine name ([24387d5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/24387d59e9f2f329dcb4fdd2739288cb190e245e))
- Set fader label ([78a3ecd](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/78a3ecd9c423a6866d7c7218acb368d61044ecd0))
- treat all status codes below 400 as correct ([d0791b1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d0791b188b2304722e5b12d4f3d36f6c07ebd269))

### Features

- Add layerName property to mappings ([c0d81eb](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c0d81ebee21349515e8532fca9ef13250e31068d))
- indicate elements as missing when MSE disconnected ([68bf2fb](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/68bf2fb72f3871b0730751036e0a582a37d3ca2f))
- monitor viz engines over http ([ab6c76b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/ab6c76bad94f5c9e5a4407ef4d3b7c00a83cb3b8))
- rename activeRundown -> activePlaylist. ([fb2ae0b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/fb2ae0b25a3899ad4f9be1981e67def713a053f8))
- sisyfos retrigger mechanism ([26033cd](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/26033cdba23618bc03bf4dee89c1db7907b40dcc))
- Use layerName as default label for sisyfos faders ([4e18a2a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4e18a2a910d1794993bab8716af41802049c9c0a))

# [7.1.0-release42.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.1.0-release42.1...7.1.0-release42.2) (2022-05-19)

### Bug Fixes

- update casparcg-state ([7698a5d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/7698a5dff610fd74e79f9b6348beb872a319f018))

# [7.1.0-release42.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.0.0-release41.1...7.1.0-release42.1) (2022-04-29)

### Bug Fixes

- update hyperdeck dep ([db75cc6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/db75cc666bdfd8e5133b604ec56699cee50f2d0b))
- update supertimeline ([251c8b5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/251c8b5a83d84e8457cabe8badcf2e52cf10d3ba))
- yarn upgrade ([40aa2e5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/40aa2e5a21149b89735fd8e6a85c9c2366a274d3))

### Features

- SOF-752 show init and cleanup ([44264b0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/44264b08bddccbbe62c6779beb8acba18f438080))

### Reverts

- Revert "7.1.0" ([8ce054c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8ce054c6016fc0d23ef37a3ae1d233090a829fb9))

# [1.0.0-release37.6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/1.0.0-release37.5...1.0.0-release37.6) (2022-02-17)

# [1.0.0-release37.5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.4.0-release39.1...1.0.0-release37.5) (2022-02-15)

## [1.0.2-release37.4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.2.0-release37.7...1.0.2-release37.4) (2021-11-08)

## [1.0.2-release37.3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/1.0.2-release37.2...1.0.2-release37.3) (2021-10-14)

## [1.0.2-release37.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.2.0-release37.5...1.0.2-release37.2) (2021-10-14)

### Bug Fixes

- Build errors ([249032d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/249032d8deb9bfd8568d9fb5275f1dd58e4b4647))
- Retry if retryInterval >=0 ([3616a03](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3616a03dd0b138414845b02c5553fac26342e3d9))

### Reverts

- Revert "test: Rename package on publish" ([855f772](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/855f7725d73878d10caea077aec50429e3146b41))

## [1.0.2-release37.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/1.0.2-release37...1.0.2-release37.1) (2021-09-02)

## [1.0.2-release37](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/1.0.1-release37...1.0.2-release37) (2021-08-31)

## [1.0.1-release37](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/1.0.0-release37...1.0.1-release37) (2021-08-31)

## [1.0.0-release37](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.1.0-release36.1...1.0.0-release37) (2021-08-31)

### Bug Fixes

- allow multiple mappings to reference 1 casparcg layer ([a604b08](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/a604b08d902b8d677fe9b7d296b605d3c8961504))
- bad merge ([dd6ea93](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/dd6ea93bfd0ee62a403df7abc251ede409c624b5))
- do not clear elements and engines when going rehearsal<->active ([09bf843](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/09bf84332eaab4ded856772f53ff0323df123b78))
- do not purge baseline items ([0fe088d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/0fe088d02330b289de97874ed92eba7b335b12ae))
- do not purge elements when going active<->rehearsal ([587b795](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/587b7953b258245b771aa611576affc10f82e77a))
- elements to keep criteria ([3146254](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3146254dacb22031124c10da33ee6b989f28773f))
- Errors from cherry pick ([4754a67](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4754a67e8dd38c081b91f07c5749b0e268cf9180))
- exceptions and timeouts ([6cb01ad](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6cb01ad5fc738a1bc6d97fc5718c95d1ecb73e2d))
- extend templateData when allowing multiple mappings to reference 1 casparcg layer ([eb04832](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/eb0483201f7d368bcadadfa5c6837c3f1c4c2903))
- keep checking status of loaded elements ([3085502](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/30855020b5b93ea10591fea2f45810a438966ba8))
- load only elements from the active playlist when restarting ([7d21e69](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/7d21e69dbfc959fee871746d83f9cfa1dade9b2d))
- make -1 disable caspar retry ([8069aaa](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8069aaaab456dcaf9eb2533caf3670b3a32ee736))
- make makeReady execute faster ([913bcfc](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/913bcfcdd876fd85bdecf3855a6589f6d7b56fba))
- missing optional chaining ([11862a9](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/11862a95d5ee9caed0ec19f5abae7769eab17863))
- prevent duplicate external elements ([6472eaf](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6472eaf267dc45fe423b7cd3d3fa0d5ba109cf5e))
- recreate removed mediaObjects after reconnecting ([1a7e65d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/1a7e65d0a3b5a0942f2f06deb7b58366d2827802))
- rehearsal<->active when gateway was restarted ([3c40715](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3c40715210230e1c864f92d9e814f05b2e2c0a42))
- reload external elements that became unloaded ([93bf3aa](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/93bf3aad6fbc53d2391e6a1eec013548cac27634))
- remove duplicates in incoming data ([e86f170](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/e86f170cd6753025347a42f4685716837543b089))
- Remove ExpectedPlayoutItemContentBase from tsr-types [publish] ([cd92561](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/cd92561a02e58f02d5c97351cc67934f77ecb5fb))
- report channel name instead of engine name ([24387d5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/24387d59e9f2f329dcb4fdd2739288cb190e245e))
- Set fader label ([78a3ecd](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/78a3ecd9c423a6866d7c7218acb368d61044ecd0))
- treat all status codes below 400 as correct ([d0791b1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d0791b188b2304722e5b12d4f3d36f6c07ebd269))

### Features

- Add layerName property to mappings ([c0d81eb](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c0d81ebee21349515e8532fca9ef13250e31068d))
- indicate elements as missing when MSE disconnected ([68bf2fb](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/68bf2fb72f3871b0730751036e0a582a37d3ca2f))
- monitor viz engines over http ([ab6c76b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/ab6c76bad94f5c9e5a4407ef4d3b7c00a83cb3b8))
- rename activeRundown -> activePlaylist. ([fb2ae0b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/fb2ae0b25a3899ad4f9be1981e67def713a053f8))
- sisyfos retrigger mechanism ([26033cd](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/26033cdba23618bc03bf4dee89c1db7907b40dcc))
- Use layerName as default label for sisyfos faders ([4e18a2a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4e18a2a910d1794993bab8716af41802049c9c0a))

# [7.0.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.0.0...7.0.1) (2022-06-28)

### Bug Fixes

- test after casparcg-state update ([4674f37](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4674f37c393683bd74f9a4e7519a4cc4a1d42141))

# [7.0.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.0.0-release41.2...7.0.0) (2022-06-27)

**Note:** Version bump only for package timeline-state-resolver-packages

# [7.0.0-release41.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.0.0-release41.0...7.0.0-release41.2) (2022-04-28)

### Bug Fixes

- event listeners must not return anything ([cb2fe13](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/cb2fe13c965bc3f8e221c1db08e970b454e92f69))
- move the types DeviceStatus, StatusCode to timeline-state-resolver-types ([4d84179](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4d84179372ba243fe60d102ec52447ca87f0a8c9))
- **obs:** add missing mapping type to MappingOBSAny ([2ff5522](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/2ff55222a8b5fc915c8926aa2bc9ea4f1e796000))
- upgrade casparcg-state ([bbeee15](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/bbeee15e895be58100f4ddb88fb4e229a7aeb07b))

# [7.0.0-release41.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/7.0.0-release41.0...7.0.0-release41.1) (2022-04-12)

### Bug Fixes

- event listeners must not return anything ([cb2fe13](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/cb2fe13c965bc3f8e221c1db08e970b454e92f69))
- move the types DeviceStatus, StatusCode to timeline-state-resolver-types ([4d84179](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4d84179372ba243fe60d102ec52447ca87f0a8c9))
- **obs:** add missing mapping type to MappingOBSAny ([2ff5522](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/2ff55222a8b5fc915c8926aa2bc9ea4f1e796000))
- upgrade casparcg-state ([bbeee15](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/bbeee15e895be58100f4ddb88fb4e229a7aeb07b))

# [7.0.0-release41.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.4.0-release39.1...7.0.0-release41.0) (2022-03-21)

### Bug Fixes

- **casparcg:** update status on queue overflow ([c2ec5f5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c2ec5f58aa09dc357419eeb4ff06fdf9c0791b6e))
- failing tests ([d521ea4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/d521ea4c3550b8f817c2495e54f37c4c1851d37b))
- Lawo: Typings issue, getElementByPath can return undefined. ([3846f3e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3846f3ec6b3c98eb0ac7b3dec9d398b74685d7c3))
- more tests ([031bbd1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/031bbd1945ac47d3636744c4e6cd3bd302617dc4))

# [6.4.0-release39.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.3.0...6.4.0-release39.1) (2022-02-03)

### Bug Fixes

- add a multiplier to the options, to allow for adjusting estimateResolveTime ([3941a71](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3941a710ab32fe3bfab89a9bec5cfb06a04d9b4f))
- allow for changing estimateResolveTimeMultiplier at runtime ([289a619](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/289a6195268998201c23356be03c83b740cacead))
- errors caught not casted before usage threw TS compiler errors ([167be0e](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/167be0e3e484f7a4cd27adc04325a0cf94ebf323))
- increase the estimateResolveTime values, to reflect measured performance ([1cba2f6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/1cba2f664f4d622c44d56a6c6dae9fbb1849117e))
- update emberplus-connection ([f32e78a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f32e78af43e2a3b3d8bc3204c3f062299e1e0259))
- update emberplus-connection ([a1782db](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/a1782db8be17c68ede42fc9733cb6cc67791aa4a))

### Features

- disable control of unmapped atem auxes ([550e52d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/550e52d9e417ec24deff6e22773c3e1deb5bfb39))

# [6.3.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.2.1...6.3.0) (2022-01-26)

### Bug Fixes

- Homogenized the headline with the other Sofie repos ([8325f53](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8325f533f054f25acd317654f82ed345645f5b60))
- revert timeline dep, as it caused issues on air. ([71da109](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/71da1092ac99bccc9f947ce7f1c1ee445b83fcff))
- Updated links to match the changed repo name ([6fe910f](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6fe910f69a313e1f7b84e88a6550c3e40ac29afa))
- Updated URLs to reflect the changed repo name ([4436674](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4436674988ce45a66bafbb2161f9cbf6c850694d))

# [6.3.0-release38.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.2.0...6.3.0-release38.0) (2021-12-17)

### Bug Fixes

- update timeline dependency ([2c75df1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/2c75df103d82f7ef239a1d3701a8987ac67c5061))

# [6.2.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.2.0-release37.7...6.2.0) (2021-12-08)

### Bug Fixes

- bug fix: the http-watcher wouldn't check the status on startup, only after ~30 seconds ([1dd1567](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/1dd1567507bd3dddf03805ea3f5c4003cdc241ec))

# [6.2.0-release37.7](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.2.0-release37.6...6.2.0-release37.7) (2021-10-22)

### Bug Fixes

- catch some quantel releasePort errors ([#199](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/199)) ([10007c2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/10007c2bd52caed401fcf576cfc03b8a9031914f))

# [6.2.0-release37.6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.2.0-release37.5...6.2.0-release37.6) (2021-10-20)

### Bug Fixes

- disable casparcg retry for negative values ([dc0e2ae](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/dc0e2aecd5a8142c1a0bfbda80ed8988d3bb2f3c))

# [6.2.0-release37.5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.2.0-release37.4...6.2.0-release37.5) (2021-10-13)

### Bug Fixes

- don't emit resolveTimeline when not active ([f37f79b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f37f79b851164e042991a49a2f73add445075918))
- improve robustness ([6296d8c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6296d8c01195739b2f1022980de486c7448eb348))
- update atem-state ([9f250c3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9f250c3d02bfdef052f154c5c2a66de102df20c3))

### Features

- separate the init from device creation ([20cdd68](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/20cdd6802ee6ff5151e03e2b84d035db638b6d87))

# [6.2.0-release37.4](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.2.0-release37.3...6.2.0-release37.4) (2021-09-30)

### Bug Fixes

- emitting of 'debug' events should only be done if the debug property is truthy. ([5d015a1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5d015a1dfde3ffc86f9aea9366bf72f76537d9a4))

# [6.2.0-release37.3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.2.0-release37.2...6.2.0-release37.3) (2021-09-30)

### Bug Fixes

- update quantel-gateway-client dependency to latest ([6f3e904](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/6f3e90434e71d651688febc1b67dfbbac2d503b8))
- wait for releaseing quantel port before creating a new one ([da4c862](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/da4c862df1b5dacbd03862bd192092a0b78b50a9))

# [6.2.0-release37.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.2.0-release37.1...6.2.0-release37.2) (2021-09-21)

### Features

- emit more detailed slowCommands ([91bda43](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/91bda43cf499d14c43aef96e0af7b3df78591a05))

# [6.2.0-release37.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.2.0-release37.0...6.2.0-release37.1) (2021-09-21)

### Bug Fixes

- allow retry in \_getRundown ([8e37d5a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/8e37d5a13d79d0cdb8a06b84a5571e75289347eb))
- Build errors ([13dce42](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/13dce42a5eb9a75ddddf69591fdb075f030a56ee))
- don't update elements after first connect an extra time ([cc5ffc8](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/cc5ffc8d1bd6fd63892e9b023a1f1233246c25be))
- load only elements from the active playlist when restarting ([fee2962](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/fee29626071c81e9daf8848933091d5a4ef5e98e))
- rehearsal<->active when gateway was restarted ([595fbce](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/595fbceb4aaf65f9d444e70b592dbf791fe202df))
- trigger `activate` to reload elements after VizEngine restart ([40d26a0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/40d26a0ecb74acf48fc1fa8358ffcd661133aa9c))
- wait after activation ([5bace5a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/5bace5a88ea373db040dd7b5735ff1150dafe6e8))

### Features

- map sisyfos channel by its label ([afcf056](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/afcf056a568f5e18545379c2655b8c1769b98be2))
- purge unknown elements from the viz-rundown upon activation ([cff4d0c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/cff4d0cbcd46b7da97a8de31cb92381286294350))
- rename activeRundown -> activePlaylist. ([868beec](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/868beec3462035ea5f2f5a336931dbd9548b1bd2))

# [6.2.0-release37.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.1.0-release36.2...6.2.0-release37.0) (2021-09-13)

### Bug Fixes

- do not remove unknown vmix sources ([c6a262b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c6a262baff1318701c1f494175918b49ca058fa5))
- do not send unnecessary lawo commands ([91cf76a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/91cf76a4723dff5c8ae18ae3fa8a5603046bfd07))
- reduce logging amount by only emitting some logs when active ([9af530b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/9af530bb55f09359be3cf7b50b427412986c1cc6))
- remove redundant log lines ([216a3f5](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/216a3f57c808b86d7e4d5a749dc7a4a2317070f4))
- vmix overlay/multiview input selection diffing ([b915d51](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b915d517489b021480f69c3057341749c4adcd42))

### Features

- OBS video production app support ([#181](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/181)) ([3d312a6](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/3d312a69db128f2f33af6308cba7baebfd9d0155))

### Reverts

- Revert "feat: OBS video production app support (#181)" (#186) ([3831891](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/383189119c470c948c59c66460915819678ec6c2)), closes [#181](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/181) [#186](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/186)

# [6.1.0-release36.2](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.1.0-release36.1...6.1.0-release36.2) (2021-09-07)

### Bug Fixes

- only retry http commands for network failures ([dd28e4c](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/dd28e4c816e0130e5c8185b9a4780789fffc3814))

# [6.1.0-release36.1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.1.0-release36.0...6.1.0-release36.1) (2021-07-12)

### Bug Fixes

- prerelease workflow not setting version correctly ([4f4fced](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/4f4fcedebc742e2fd279f137e6e43fd6d74cd6fd))

# [6.1.0-release36.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/6.0.3...6.1.0-release36.0) (2021-07-12)

### Bug Fixes

- always send http param data if present ([af326e1](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/af326e1ce7e3ffcf9a3626210563e6fe552553e1))
- **OBS:** incompatible/outdated OBS DeviceOptions topology ([c83cd7b](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/c83cd7bde54a18f4f54dcd6ae900cd36c4f683c8))

### Features

- **OBS:** Support OBS Live Video Production Software ([#187](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/issues/187)) ([f2fe81a](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/f2fe81a3ae87ccd3c8db812e88ef9a94b74673d5))

# [5.9.0](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/compare/5.8.0...5.9.0) (2021-06-25)

### Bug Fixes

- don't create device which already exists ([b00edf3](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/b00edf3e780fc191a1752383e9eae32531c81d44))

### Features

- resend failing http commands ([cb2ee39](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/cb2ee3967f587520c8dd1e3b6d3543af6fcae687))

### Reverts

- Revert "chore: enable docs after rls" ([dcf6f0d](https://github.com/Sofie-Automation/sofie-timeline-state-resolver/commit/dcf6f0d6744fb50ac6ded9652bf215fdcefb515b))
