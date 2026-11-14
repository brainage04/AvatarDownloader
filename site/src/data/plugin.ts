/** Page content for this plugin. Keep it in step with the plugin's code in `revenge/`, `vencord/` and `common/`. */
export interface Card {
  title: string;
  /** Plain text; spans in backticks render as code. */
  text: string;
}

export interface Setting {
  name: string;
  defaultValue: string;
  description: string;
}

export interface Section {
  title: string;
  intro?: string;
  items: string[];
}

export interface PluginPage {
  /** GitHub repository name; also the Pages base path (`https://brainage04.github.io/<repository>/`). */
  repository: string;
  summary: string;
  /** The Vencord entry file in the repository root. */
  vencordEntry: 'index.ts' | 'index.tsx';
  /** Folder name under Vencord's `src/userplugins/`, as in DiscordPluginInstaller's catalog. */
  vencordDirectory: string;
  /** The card grid: a title naming what the cards describe (what it does, how to use it, how it works). */
  cards: { title: string; items: Card[] };
  /** The same settings exist on Revenge and Vencord unless `settingsNote` says otherwise. */
  settings: Setting[];
  settingsNote?: string;
  sections: Section[];
}

export const plugin: PluginPage = {
  repository: 'AvatarDownloader',
  summary:
    'Download anyone’s profile picture from Discord at full size. On Vesktop, right-click a user and choose Download Avatar. On Revenge, open their profile and long-press the large avatar.',
  vencordEntry: 'index.ts',
  vencordDirectory: 'avatarDownloader.vesktop',
  cards: {
    title: 'How to use it',
    items: [
      {
        title: 'Vesktop',
        text: 'Right-click a user anywhere (a message author, the member list, a DM) and choose Download Avatar. Vesktop then saves the file like any other download.',
      },
      {
        title: 'Revenge',
        text: 'Tap a user to open their profile, long-press the large avatar at the top and choose Avatar. Android saves it to your Downloads folder.',
      },
      {
        title: 'Server avatars',
        text: 'In a server where the user has set a server avatar, both clients also offer that one: Download Server Avatar on Vesktop, Server avatar on Revenge.',
      },
      {
        title: 'File format',
        text: 'Images download at 4096 px or their original size if smaller. Animated avatars save as GIF, still ones as PNG. Users without an avatar get Discord’s default avatar.',
      },
    ],
  },
  settings: [],
  sections: [],
};

export const sourceHref = `https://github.com/brainage04/${plugin.repository}`;
