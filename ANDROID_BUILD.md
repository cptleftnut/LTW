# Line Tower Wars - Android Build Guide

This guide explains how to build and deploy the Line Tower Wars Android game.

## Prerequisites

- Node.js 22+
- pnpm package manager
- Java 17+
- Android SDK (API level 24+)
- Expo CLI and EAS CLI

## Local Development

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

This starts the Metro bundler and development server. You can then:
- Open in Expo Go on your Android device by scanning the QR code
- Run on Android emulator: `pnpm android`
- Run on iOS simulator: `pnpm ios`

## Building Android APK

### Option 1: Using Expo EAS (Recommended)

EAS (Expo Application Services) provides cloud-based builds.

#### Setup EAS

```bash
npm install -g eas-cli
eas login
```

#### Build APK

```bash
eas build --platform android
```

This will:
1. Build the APK in the cloud
2. Provide a download link when complete
3. Store builds in your EAS account

#### Build APK (Non-Interactive)

For CI/CD pipelines:

```bash
eas build --platform android --non-interactive --wait
```

### Option 2: Local Build with Android SDK

Requires Android SDK and Java installed locally.

```bash
# Build APK
./gradlew assembleRelease

# Build AAB (Android App Bundle)
./gradlew bundleRelease
```

## GitHub Actions Workflow

The project includes an automated GitHub Actions workflow (`.github/workflows/build-apk.yml`) that:

1. Triggers on push to `main` branch
2. Sets up Node.js and dependencies
3. Builds the Android APK using EAS
4. Uploads artifacts
5. Creates a GitHub Release with the APK

### Manual Workflow Trigger

```bash
# Go to Actions tab on GitHub
# Select "Build Android APK"
# Click "Run workflow"
```

### Environment Variables

For the workflow to work, you may need to set:

- `EAS_TOKEN`: Your Expo EAS token (for authentication)

Add this in GitHub repository settings → Secrets and variables → Actions

## APK Output

After building, the APK file will be located at:

```
build/outputs/apk/release/app-release.apk
```

Or for AAB:

```
build/outputs/bundle/release/app-release.aab
```

## Installing on Android Device

### Via USB

```bash
adb install build/outputs/apk/release/app-release.apk
```

### Via File Transfer

1. Download the APK file
2. Transfer to Android device
3. Open file manager and tap the APK
4. Follow installation prompts

### Via Google Play Store

To publish to Google Play Store:

1. Create a Google Play Developer account
2. Generate signing key
3. Upload AAB to Google Play Console
4. Follow submission process

## Troubleshooting

### Build Fails with "Cannot find module"

```bash
pnpm install
pnpm dedupe
```

### Android SDK Not Found

Ensure `ANDROID_HOME` environment variable is set:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### EAS Build Timeout

Increase timeout or check build logs:

```bash
eas build --platform android --wait --verbose
```

## Version Management

Update version in `app.config.ts`:

```typescript
const config: ExpoConfig = {
  version: "1.0.1", // Update this
  // ...
};
```

## Release Checklist

- [ ] Update version number in `app.config.ts`
- [ ] Update `CHANGELOG.md` with new features
- [ ] Test on Android emulator and real device
- [ ] Run `pnpm lint` and `pnpm check`
- [ ] Commit changes: `git commit -m "Release v1.0.1"`
- [ ] Tag release: `git tag v1.0.1`
- [ ] Push: `git push origin main --tags`
- [ ] GitHub Actions will automatically build and create release

## Support

For issues or questions:
1. Check GitHub Issues
2. Review Expo documentation: https://docs.expo.dev
3. Check EAS documentation: https://docs.expo.dev/eas
