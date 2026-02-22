import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";

actor {
  include MixinStorage();

  type Workspace = {
    #travel;
    #aiLearning;
  };

  type Platform = {
    #facebook;
    #instagram;
    #tiktok;
  };

  type Caption = {
    facebook : Text;
    instagram : Text;
    tiktok : Text;
  };

  type Video = {
    id : Text;
    workspace : Workspace;
    file : Storage.ExternalBlob;
    caption : Text;
    thumbnail : ?Storage.ExternalBlob;
  };

  type ScheduledPost = {
    videoId : Text;
    workspace : Workspace;
    platforms : [Platform];
    captions : Caption;
    scheduledTime : Time.Time;
  };

  let videos = Map.empty<Text, Video>();
  let scheduledPosts = Map.empty<Text, ScheduledPost>();

  // Upload a new video
  public shared ({ caller }) func uploadVideo(workspace : Workspace, id : Text, file : Storage.ExternalBlob, caption : Text, thumbnail : ?Storage.ExternalBlob) : async () {
    let video : Video = {
      id;
      workspace;
      file;
      caption;
      thumbnail;
    };
    videos.add(id, video);
  };

  // Get videos by workspace
  public query ({ caller }) func getVideosByWorkspace(workspace : Workspace) : async [Video] {
    let filteredVideos = videos.values().toList<Video>().filter(
      func(video) {
        video.workspace == workspace;
      }
    );
    filteredVideos.reverse().toArray();
  };

  // Schedule a post
  public shared ({ caller }) func schedulePost(videoId : Text, workspace : Workspace, platforms : [Platform], captions : Caption, scheduledTime : Time.Time) : async () {
    let post : ScheduledPost = {
      videoId;
      workspace;
      platforms;
      captions;
      scheduledTime;
    };
    scheduledPosts.add(videoId, post);
  };

  // Get all scheduled posts for a workspace
  public query ({ caller }) func getScheduledPosts(workspace : Workspace) : async [ScheduledPost] {
    let filteredPosts = scheduledPosts.values().toArray().filter(
      func(post) {
        post.workspace == workspace;
      }
    );
    filteredPosts;
  };

  // Get all videos
  public query ({ caller }) func getAllVideos() : async [Video] {
    videos.values().toArray();
  };

  // Get all scheduled posts
  public query ({ caller }) func getAllScheduledPosts() : async [ScheduledPost] {
    scheduledPosts.values().toArray();
  };

  // Get workspace entry for video id
  public query ({ caller }) func getVideoWorkspace(id : Text) : async Workspace {
    switch (videos.get(id)) {
      case (null) { #travel };
      case (?video) { video.workspace };
    };
  };
};
