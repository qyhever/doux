加一个一键命令：自动把两种 ABI 包拷贝到独立 release 目录并按版本重命名


我会新增一个可复用脚本来读取构建产物里的版本号，然后把两个 ABI 的 APK 复制到独立目录并重命名；同时在 package.json 增加一键命令（可选含“构建+导出”）。先落地脚本和 npm scripts。

Created [](file:///Users/await/apros/doux/scripts/export-android-release.sh)

Generating patch (11 lines) in [](file:///Users/await/apros/doux/package.json)


```

```
我先直接执行导出脚本验证命名和目录结构是否符合预期，再把结果给你。

Ran terminal command: sh ./scripts/export-android-release.sh && ls -lh release/android

Created 4 todos

导出脚本在当前终端因 `node` 不可用失败了，我会改成纯 shell 解析 `output-metadata.json`（不依赖 Node），这样任何环境下都能直接运行。

Generating patch (15 lines) in [](file:///Users/await/apros/doux/scripts/export-android-release.sh)


```

```


Ran terminal command: sh ./scripts/export-android-release.sh && ls -lh release/android

Checked [](file:///Users/await/apros/doux/package.json), [](file:///Users/await/apros/doux/scripts/export-android-release.sh), no problems found

已加好一键命令，并且我已经实测通过。

新增内容：
- 新脚本：export-android-release.sh
- 新命令写入：package.json
  - `npm run export:android:release`：把现有 ABI 包复制到独立目录并按版本重命名
  - `npm run build:android:release`：先构建再导出（真正一键）

导出规则：
- 来源目录：release
- 目标目录：android
- 重命名格式：`doux-v版本号-ABI.apk`
- 示例结果：
  - doux-v1.0.0-arm64-v8a.apk
  - doux-v1.0.0-armeabi-v7a.apk

我在本地执行脚本后，已成功导出 2 个包并完成重命名。若你希望，我可以再加上“自动清理旧版本文件”的选项，避免 release 目录累积历史包。

Completed: *Add one-click command for APK export* (4/4)

Made changes.