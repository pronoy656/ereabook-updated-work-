const fs = require('fs');
const path = require('path');

// Helper to write a valid PCM 16-bit WAV file
function createWavFile(filename, sampleRate, samples) {
  const numChannels = 1;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bytesPerSample * 8, 34); // Bits per sample

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write samples
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    const intSample = s < 0 ? s * 0x8000 : s * 0x7FFF;
    buffer.writeInt16LE(Math.floor(intSample), 44 + i * 2);
  }

  fs.writeFileSync(filename, buffer);
  console.log(`Generated ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

const sampleRate = 44100;

// 1. Generate pleasant notification chime (C6 - G6 sweet chime, ~0.6s)
function generateChime() {
  const duration = 0.8;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    // Note 1: E6 (1318.5 Hz) at t = 0 -> 0.4s
    if (t >= 0 && t < 0.5) {
      const noteT = t;
      const env = Math.exp(-noteT * 9);
      sample += Math.sin(2 * Math.PI * 1318.5 * noteT) * env * 0.4;
      sample += Math.sin(2 * Math.PI * 2637.0 * noteT) * env * 0.1; // 2nd harmonic
    }

    // Note 2: B6 (1975.5 Hz) at t = 0.12s
    if (t >= 0.12) {
      const noteT = t - 0.12;
      const env = Math.exp(-noteT * 7);
      sample += Math.sin(2 * Math.PI * 1975.5 * noteT) * env * 0.5;
      sample += Math.sin(2 * Math.PI * 3951.0 * noteT) * env * 0.12; // 2nd harmonic
    }

    samples[i] = sample;
  }
  return samples;
}

// 2. Generate smooth rhythmic incoming ringtone (loopable ~3.2s)
function generateRingtone() {
  const duration = 3.2;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  // Melodic notes sequence: A5 (880), C#6 (1108.7), E6 (1318.5), A6 (1760)
  const notes = [
    { freq: 880, start: 0.0, dur: 0.22 },
    { freq: 1108.73, start: 0.22, dur: 0.22 },
    { freq: 1318.51, start: 0.44, dur: 0.22 },
    { freq: 1760, start: 0.66, dur: 0.55 },
    
    // Repeat phrase 2
    { freq: 880, start: 1.4, dur: 0.22 },
    { freq: 1108.73, start: 1.62, dur: 0.22 },
    { freq: 1318.51, start: 1.84, dur: 0.22 },
    { freq: 1760, start: 2.06, dur: 0.65 }
  ];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    for (const note of notes) {
      if (t >= note.start && t < note.start + note.dur + 0.3) {
        const noteT = t - note.start;
        const env = Math.sin(Math.min(1, noteT / 0.02) * Math.PI / 2) * Math.exp(-noteT * 4.5);
        sample += Math.sin(2 * Math.PI * note.freq * noteT) * env * 0.35;
        // Soft harmonic
        sample += Math.sin(2 * Math.PI * (note.freq * 2) * noteT) * env * 0.1;
      }
    }

    samples[i] = sample;
  }
  return samples;
}

const soundsDir = path.join(__dirname, '..', 'public', 'sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// Write both WAV and standard filenames (browsers support wav via Audio/AudioContext seamlessly)
createWavFile(path.join(soundsDir, 'notification-chime.wav'), sampleRate, generateChime());
createWavFile(path.join(soundsDir, 'notification-chime.mp3'), sampleRate, generateChime());
createWavFile(path.join(soundsDir, 'incoming-call.wav'), sampleRate, generateRingtone());
createWavFile(path.join(soundsDir, 'incoming-call.mp3'), sampleRate, generateRingtone());

console.log('Audio generation completed successfully!');
