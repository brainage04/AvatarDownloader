# AvatarDownloader

A Discord plugin for Revenge (Android) and Vencord (Vesktop) that downloads a user's profile picture at full size.

Page with the details: <https://brainage04.github.io/AvatarDownloader/>

## Use

- **Vesktop:** right-click a user (a message author, the member list, a DM) and choose **Download Avatar**.
- **Revenge:** tap a user to open their profile, long-press the large avatar and choose **Avatar**. Android saves it to Downloads.

Where the user has a server avatar in the current server, both clients also offer it (**Download Server Avatar** on Vesktop, **Server avatar** on Revenge). Images download at up to 4096 px. Animated avatars save as GIF and still ones as PNG.

## Install

- **Revenge:** in Discord, open Settings, go to Revenge's **Plugins** page, tap **+** and paste `https://brainage04.github.io/AvatarDownloader/`.
- **Vesktop (Vencord):** use [DiscordPluginInstaller](https://github.com/brainage04/DiscordPluginInstaller):

  ```bash
  git clone https://github.com/brainage04/DiscordPluginInstaller.git
  cd DiscordPluginInstaller
  node src/cli.mjs vencord install --plugins AvatarDownloader --enable --restart
  ```

  Or copy `index.ts`, `common/` and `vencord/` into Vencord's `src/userplugins/avatarDownloader.vesktop/` and build Vencord yourself. The page has the steps.

## Build and test

```bash
npm ci
npm test        # tests for the shared avatar URLs in common/
npm run build   # Revenge build: dist/manifest.json and dist/index.js
```

`common/` builds the avatar URLs and file names both clients use, `revenge/` holds the Revenge plugin and its manifest, and `index.ts` with `vencord/` is the Vencord userplugin. `site/` is the GitHub Pages site, which also serves the Revenge build (details in [site/README.md](site/README.md)).

## Licence

GPL-3.0-or-later. See [LICENSE](LICENSE).
