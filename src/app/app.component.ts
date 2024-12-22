import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AgoraService } from './services/agora.service';

@Component({
  selector: 'app-root',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule], // Add CommonModule to imports
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private appId = '8f7f0213abf5480691e557d3430d2709';
  private token =
    '007eJxTYGhK+3zV+KDirUmHZm3cfd9vzWOr2kNhZxTrVk+9XShwrO6cAoNFmnmagZGhcWJSmqmJhYGZpWGqqal5irGJsUGKkbmBpXhERnpDICPDvt3BDIxQCOLzMJSkFpfoJmck5uWl5jAwAAA6QyRn';
  private channel = 'test-channel';
  public generatedId: boolean = false; // Define and initialize the generatedId variable

  constructor(private agoraService: AgoraService) {}

  // Start the call

  async startCall() {
    await this.agoraService.initialize(this.appId); // Initialize the Agora service
    await this.agoraService.join(this.channel, this.token); // Join the channel

    const localPlayer = document.getElementById('local-player');
    const localTracks = this.agoraService.getLocalTracks();

    // Play local video
    if (localTracks) {
      localTracks[1].play(localPlayer!); // Assuming localTracks[1] is the video track
    }

    this.generatedId = true; // Set generatedId to true after starting the call

    console.log('Call created with ID:', this.channel); // Log the channel name (acting as callId) after creating the call
  }

  // Join the call
  async joinCall(callId: string) {
    await this.agoraService.initialize(this.appId); // Initialize the Agora service
    await this.agoraService.join(callId, this.token); // Join the channel with dynamic callId

    const localTracks = this.agoraService.getLocalTracks();

    // Play local video in the local player container
    const localPlayer = document.getElementById('local-player');
    if (localPlayer && localTracks) {
      setTimeout(() => {
        localTracks[1].play(localPlayer); // This assumes you want to display your own local track
      }, 1500);
    }

    // Handle remote user subscription
    this.agoraService.handleRemoteUserVideo(); // This will subscribe to any remote user's video/audio
  }
}
