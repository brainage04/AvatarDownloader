/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 brainage04
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// URL rules from Discord's image formatting reference:
// https://discord.com/developers/docs/reference#image-formatting

const CDN = "https://cdn.discordapp.com";
const MAX_SIZE = 4096;

export interface AvatarUser {
    id: string;
    username: string;
    avatar?: string | null;
    discriminator?: string;
}

export interface AvatarDownload {
    url: string;
    filename: string;
}

function extension(hash: string) {
    return hash.startsWith("a_") ? "gif" : "png";
}

function safeName(name: string) {
    return name.replace(/[^\w.-]+/g, "_").replace(/^\.+/, "") || "user";
}

function defaultAvatarIndex(user: AvatarUser) {
    const legacy = user.discriminator && user.discriminator !== "0";
    return legacy
        ? Number(user.discriminator) % 5
        : Number((BigInt(user.id) >> BigInt(22)) % BigInt(6));
}

export function userAvatar(user: AvatarUser): AvatarDownload {
    const name = safeName(user.username);
    if (!user.avatar) {
        return {
            url: `${CDN}/embed/avatars/${defaultAvatarIndex(user)}.png`,
            filename: `${name}-avatar.png`
        };
    }

    const ext = extension(user.avatar);
    return {
        url: `${CDN}/avatars/${user.id}/${user.avatar}.${ext}?size=${MAX_SIZE}`,
        filename: `${name}-avatar.${ext}`
    };
}

export function serverAvatar(user: AvatarUser, guildId: string, memberAvatar: string): AvatarDownload {
    const ext = extension(memberAvatar);
    return {
        url: `${CDN}/guilds/${guildId}/users/${user.id}/avatars/${memberAvatar}.${ext}?size=${MAX_SIZE}`,
        filename: `${safeName(user.username)}-server-avatar.${ext}`
    };
}
