import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Video {
    id: string;
    thumbnail?: ExternalBlob;
    file: ExternalBlob;
    caption: string;
    workspace: Workspace;
}
export interface Caption {
    tiktok: string;
    instagram: string;
    facebook: string;
}
export type Time = bigint;
export interface ScheduledPost {
    scheduledTime: Time;
    platforms: Array<Platform>;
    workspace: Workspace;
    captions: Caption;
    videoId: string;
}
export enum Platform {
    tiktok = "tiktok",
    instagram = "instagram",
    facebook = "facebook"
}
export enum Workspace {
    travel = "travel",
    aiLearning = "aiLearning"
}
export interface backendInterface {
    getAllScheduledPosts(): Promise<Array<ScheduledPost>>;
    getAllVideos(): Promise<Array<Video>>;
    getScheduledPosts(workspace: Workspace): Promise<Array<ScheduledPost>>;
    getVideoWorkspace(id: string): Promise<Workspace>;
    getVideosByWorkspace(workspace: Workspace): Promise<Array<Video>>;
    schedulePost(videoId: string, workspace: Workspace, platforms: Array<Platform>, captions: Caption, scheduledTime: Time): Promise<void>;
    uploadVideo(workspace: Workspace, id: string, file: ExternalBlob, caption: string, thumbnail: ExternalBlob | null): Promise<void>;
}
