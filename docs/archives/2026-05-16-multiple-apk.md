改成按 ABI 拆分多个 APK（每个更小，适合渠道分发）

Optimized tool selection我将把 Android release 改为 ABI 拆分输出（armv7 和 arm64 分包），并保留你现有的 `build:android` 使用方式；接下来先改 build.gradle 的 `splits` 配置，再实际构建验证输出文件。

Generating patch (30 lines) in [](file:///Users/await/apros/doux/android/app/build.gradle)


```

```


Generating patch (12 lines) in [](file:///Users/await/apros/doux/android/gradle.properties)


```

```
我现在执行一次 release 构建并检查输出目录，确认是否已经从单一 APK 变成按 ABI 分包的多个 APK。

Ran terminal command: ./gradlew assembleRelease -PreactNativeArchitectures=armeabi-v7a,arm64-v8a

Ran terminal command: ./gradlew assembleRelease -PreactNativeArchitectures=armeabi-v7a,arm64-v8a

Ran terminal command: ls -lh android/app/build/outputs/apk/release && cat android/app/build/outputs/apk/release/output-metadata.json

ABI 分包已经生效并生成双产物，我再快速做一次静态错误检查，确保这次 Gradle 改动没有引入语法问题。

Checked [](file:///Users/await/apros/doux/android/app/build.gradle), [](file:///Users/await/apros/doux/android/gradle.properties), [](file:///Users/await/apros/doux/package.json), no problems found

已改为按 ABI 拆分多个 APK，且已验证构建成功。

本次改动：
- 在 build.gradle 增加 ABI split 配置，启用按架构分包并关闭 universal APK。
- 在 gradle.properties 增加开关项 `android.enableSeparateBuildPerCPUArchitecture=true`，便于后续按需开关。
- 你原有的 package.json 构建命令仍可直接使用（已保留只打 armv7 + arm64 的参数）。

验证结果（release 输出）：
- app-armeabi-v7a-release.apk 约 14MB
- app-arm64-v8a-release.apk 约 14MB
- 元数据已显示为 ONE_OF_MANY（ABI 分包）：output-metadata.json

后续分发建议：
1. 新设备优先下发 arm64-v8a 包。
2. 兼容老设备时下发 armeabi-v7a 包。
3. 若你需要，我可以再加一个一键命令：自动把两种 ABI 包拷贝到独立 release 目录并按版本重命名。

Updated todo list

Made changes.