# Main app (web & mobile app)

![screenshot of app](/docs/screenshot.png)

## Use `mise` to manage node and pnpm

<https://mise.jdx.dev/getting-started.html>

## Run web

Start the web version, notice that the Backend API should also be running.

```sh
pnpm web
```

## Run mobile

You need to compile the mobile app and install it on your device or emulator/simulator.

- Setup Android Studio or Xcode: <https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build&buildEnv=local>.

- Run command to compile and install:

```sh
pnpm android
# or
pnpm ios
```

After install, start the Backend API to use the app.
