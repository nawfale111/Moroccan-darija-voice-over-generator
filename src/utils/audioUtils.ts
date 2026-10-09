import { Mp3Encoder } from '@breezystack/lamejs';

/**
 * Parses a standard RIFF WAV buffer and extracts PCM samples and metadata.
 */
export function parseWav(wavBuffer: ArrayBuffer): {
  channels: number;
  sampleRate: number;
  bitsPerSample: number;
  samples: Int16Array;
} {
  const dataView = new DataView(wavBuffer);

  // Check 'RIFF'
  const riff = String.fromCharCode(
    dataView.getUint8(0),
    dataView.getUint8(1),
    dataView.getUint8(2),
    dataView.getUint8(3)
  );
  if (riff !== 'RIFF') {
    throw new Error('Not a valid RIFF WAV file');
  }

  // Read format chunk
  let pos = 12;
  let channels = 1;
  let sampleRate = 24000;
  let bitsPerSample = 16;
  let dataOffset = 44;
  let dataLength = wavBuffer.byteLength - 44;

  while (pos < dataView.byteLength - 8) {
    const chunkId = String.fromCharCode(
      dataView.getUint8(pos),
      dataView.getUint8(pos + 1),
      dataView.getUint8(pos + 2),
      dataView.getUint8(pos + 3)
    );
    const chunkSize = dataView.getUint32(pos + 4, true);

    if (chunkId === 'fmt ') {
      channels = dataView.getUint16(pos + 10, true);
      sampleRate = dataView.getUint32(pos + 12, true);
      bitsPerSample = dataView.getUint16(pos + 22, true);
    } else if (chunkId === 'data') {
      dataOffset = pos + 8;
      dataLength = chunkSize;
      break;
    }

    pos += 8 + chunkSize;
  }

  const sampleCount = Math.floor(dataLength / (bitsPerSample / 8));
  const samples = new Int16Array(sampleCount);

  if (bitsPerSample === 16) {
    for (let i = 0; i < sampleCount; i++) {
      const byteIndex = dataOffset + i * 2;
      if (byteIndex + 1 < dataView.byteLength) {
        samples[i] = dataView.getInt16(byteIndex, true);
      }
    }
  } else {
    // 8-bit fallback
    for (let i = 0; i < sampleCount; i++) {
      const byteIndex = dataOffset + i;
      if (byteIndex < dataView.byteLength) {
        const u8 = dataView.getUint8(byteIndex);
        samples[i] = (u8 - 128) * 256;
      }
    }
  }

  return {
    channels,
    sampleRate,
    bitsPerSample,
    samples,
  };
}

/**
 * Converts a WAV ArrayBuffer to an MP3 Blob using modern @breezystack/lamejs.
 */
export function convertWavToMp3Blob(wavBuffer: ArrayBuffer, kbps: number = 192): Blob {
  const { channels, sampleRate, samples } = parseWav(wavBuffer);
  const mp3encoder = new Mp3Encoder(channels, sampleRate, kbps);

  const mp3Data: Uint8Array[] = [];
  const sampleBlockSize = 1152;

  if (channels === 1) {
    for (let i = 0; i < samples.length; i += sampleBlockSize) {
      const sampleChunk = samples.subarray(i, i + sampleBlockSize);
      const mp3buf = mp3encoder.encodeBuffer(sampleChunk);
      if (mp3buf.length > 0) {
        mp3Data.push(new Uint8Array(mp3buf));
      }
    }
  } else {
    // Stereo: de-interleave
    const left = new Int16Array(samples.length / 2);
    const right = new Int16Array(samples.length / 2);
    for (let i = 0; i < samples.length; i += 2) {
      left[i / 2] = samples[i];
      right[i / 2] = samples[i + 1];
    }
    for (let i = 0; i < left.length; i += sampleBlockSize) {
      const leftChunk = left.subarray(i, i + sampleBlockSize);
      const rightChunk = right.subarray(i, i + sampleBlockSize);
      const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
      if (mp3buf.length > 0) {
        mp3Data.push(new Uint8Array(mp3buf));
      }
    }
  }

  const mp3buf = mp3encoder.flush();
  if (mp3buf.length > 0) {
    mp3Data.push(new Uint8Array(mp3buf));
  }

  return new Blob(mp3Data as unknown as BlobPart[], { type: 'audio/mp3' });
}

/**
 * Resilient async MP3 converter with client-side execution and server-side fallback.
 */
export async function convertWavToMp3BlobAsync(
  wavBuffer: ArrayBuffer,
  kbps: number = 192
): Promise<Blob> {
  try {
    return convertWavToMp3Blob(wavBuffer, kbps);
  } catch (err) {
    console.warn('Browser MP3 encoding encountered an issue, trying server-side encoding fallback:', err);
    // Convert ArrayBuffer to base64
    const bytes = new Uint8Array(wavBuffer);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64Audio = btoa(binary);

    const response = await fetch('/api/voiceover/convert-to-mp3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioBase64: base64Audio, kbps }),
    });

    if (!response.ok) {
      throw new Error('Server-side MP3 conversion failed');
    }

    const blob = await response.blob();
    return blob;
  }
}

/**
 * Converts AudioBuffer to WAV ArrayBuffer, optionally applying a playback rate / time stretch.
 */
export function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const numSamples = buffer.length * numChannels;
  const bufferLength = 44 + numSamples * 2;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
  view.setUint16(32, numChannels * (bitDepth / 8), true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // Write interleaved PCM
  let offset = 44;
  const channelData: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channelData.push(buffer.getChannelData(ch));
  }

  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = channelData[ch][i];
      sample = Math.max(-1, Math.min(1, sample));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return arrayBuffer;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Renders an AudioBuffer at a specified playback rate using an OfflineAudioContext.
 */
export async function renderWithRate(
  originalBuffer: AudioBuffer,
  playbackRate: number
): Promise<AudioBuffer> {
  if (Math.abs(playbackRate - 1.0) < 0.01) {
    return originalBuffer;
  }

  const newLength = Math.round(originalBuffer.length / playbackRate);
  const offlineCtx = new OfflineAudioContext(
    originalBuffer.numberOfChannels,
    newLength,
    originalBuffer.sampleRate
  );

  const source = offlineCtx.createBufferSource();
  source.buffer = originalBuffer;
  source.playbackRate.value = playbackRate;
  source.connect(offlineCtx.destination);
  source.start(0);

  return await offlineCtx.startRendering();
}
