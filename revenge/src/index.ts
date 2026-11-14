/*
 * AvatarDownloader
 * Copyright (c) 2026 brainage04
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findByProps, findByStoreName } from "@vendetta/metro";
import { React } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";
import { showConfirmationAlert } from "@vendetta/ui/alerts";
import { showToast } from "@vendetta/ui/toasts";

import { type AvatarDownload, type AvatarUser, serverAvatar, userAvatar } from "../../common/avatar";

interface ProfileAvatarProps {
    user?: AvatarUser;
    guildId?: string;
}

interface MediaManager {
    // The second argument is 1 for a GIF and 0 for a still image. On Discord 346.13 a 404 URL saves nothing, yet
    // the promise resolves to undefined and Discord shows its "Image Saved" toast just as after a real save, so
    // download() checks the URL itself first.
    downloadMediaAsset(url: string, kind: 0 | 1): Promise<unknown>;
}

let unpatch: (() => void) | undefined;

async function download({ url, filename }: AvatarDownload, mediaManager: MediaManager) {
    try {
        const response = await fetch(url, { method: "HEAD" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        await mediaManager.downloadMediaAsset(url, filename.endsWith(".gif") ? 1 : 0);
    } catch (error) {
        showToast(`Could not save the avatar: ${error instanceof Error ? error.message : String(error)}`);
    }
}

function onLoad() {
    // The large avatar on a user's profile sheet. Tapping it already opens Discord's viewer.
    const profileAvatar = findByProps("OpenableUserProfileAvatar");
    const mediaManager = findByProps("downloadMediaAsset") as MediaManager | undefined;
    const guildMemberStore = findByStoreName("GuildMemberStore");
    if (!profileAvatar || !mediaManager) {
        showToast("AvatarDownloader could not find Discord's profile avatar or media saver");
        return;
    }

    unpatch = after("OpenableUserProfileAvatar", profileAvatar, ([{ user, guildId }]: [ProfileAvatarProps], rendered) => {
        if (!user?.id || !rendered) return rendered;

        const openDialog = () => {
            const memberAvatar: string | undefined = guildId
                ? guildMemberStore?.getMember(guildId, user.id)?.avatar ?? undefined
                : undefined;
            showConfirmationAlert({
                title: "Download avatar",
                content: `Save ${user.username}'s profile picture to your Downloads folder.`,
                confirmText: "Avatar",
                onConfirm: () => void download(userAvatar(user), mediaManager),
                secondaryConfirmText: guildId && memberAvatar ? "Server avatar" : undefined,
                onConfirmSecondary: guildId && memberAvatar
                    ? () => void download(serverAvatar(user, guildId, memberAvatar), mediaManager)
                    : undefined,
                cancelText: "Cancel"
            });
        };

        return React.cloneElement(rendered, { onLongPress: openDialog });
    });
}

function onUnload() {
    unpatch?.();
    unpatch = undefined;
}

export default { onLoad, onUnload };
