import { Injectable } from '@angular/core';
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';

@Injectable({
  providedIn: 'root',
})
export class AgoraService {
  private client: IAgoraRTCClient;
  private localTracks: [IMicrophoneAudioTrack, ICameraVideoTrack] | null = null;
  private remoteUsers: any = {};
  private appId: string | undefined;

  constructor() {
    this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  }

  // Initialize Agora client and create local tracks
  async initialize(appId: string) {
    this.appId = appId; // Store appId in the service
    this.localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    return this.client;
  }

  // Join the channel and publish the local tracks
  async join(channel: string, token: string) {
    if (!this.localTracks) {
      throw new Error('Local tracks are not initialized');
    }
    if (!this.appId) {
      throw new Error('App ID is not initialized');
    }

    // Use the stored appId to join the channel
    const userId = await this.client.join(this.appId, channel, token, null);
    await this.client.publish(this.localTracks);
    return userId;
  }

  // Get the local tracks
  getLocalTracks() {
    return this.localTracks;
  }

  // Subscribe to a remote user and play their video
  async subscribeRemoteUser(user: any) {
    try {
      await this.client.subscribe(user, 'video');

      const remotePlayer = document.createElement('div');
      remotePlayer.id = `remote-player-${user.uid}`;
      remotePlayer.style.width = '300px';
      remotePlayer.style.height = '200px';

      const container = document.getElementById('remote-player-container');
      console.log(
        '🚀 ~ AgoraService ~ subscribeRemoteUser ~ container:',
        container
      );
      if (container) {
        container.appendChild(remotePlayer);
      }

      if (user.videoTrack) {
        user.videoTrack.play(remotePlayer.id); // Play the remote video track
      } else {
        console.log('No video track available for user:', user.uid);
      }
    } catch (error) {
      console.error('Error subscribing to remote user:', error);
    }
  }

  // In AgoraService
  handleRemoteUserVideo() {
    this.client.on('user-published', async (user: any, mediaType: string) => {
      console.log('User Published:', user); // Debugging line
      if (mediaType === 'video') {
        if (user.videoTrack) {
          this.subscribeRemoteUser(user);
        } else {
          console.log('No video track found for remote user:', user.uid);
        }
      }
      if (mediaType === 'audio') {
        user.audioTrack.play();
      }
    });
  }
}
