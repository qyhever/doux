
## 打包

### EAS 云打包（推荐）
生成测试用 APK：
```bash
eas build -p android --profile preview
```

### EAS 本地打包
在本机执行构建（不走云端构建机）：
```bash
eas build -p android --profile preview --local
```

### 原生 Gradle 本地打包
```bash
npx expo prebuild # 执行一次就行
npm run build:android
```

如果出现 `SDK location not found`，先创建 `android/local.properties`：
```properties
sdk.dir=/Users/<你的用户名>/Library/Android/sdk
```

或在 shell 中设置：
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
```