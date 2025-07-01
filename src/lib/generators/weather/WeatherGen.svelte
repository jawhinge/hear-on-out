<script lang="ts">
  import * as Tone from 'tone';
  import { onMount, onDestroy } from 'svelte';

  // Component props with default values
  let {temperature2m = 20, relativeHumidity2m = 50, cloudCover = 30, volume = -10, windSpeed10m = 0, isDay} = $props();

  // Component state using runes
  let isPlaying = $state(false);
  let currentChordIndex = $state(0);
  let isInitialized = $state(false);

  // Audio components
  let synth: Tone.PolySynth | null = null;
  let reverb: Tone.Reverb | null = null;
  let delay: Tone.FeedbackDelay | null = null;
  let phaser: Tone.Phaser | null = null;
  let sequence: Tone.Sequence | null = null;
  let gain: Tone.Gain | null = null;


  //TODO - ADD DIFFERENT PROGRESSIONS
  const chordProgressions = [
    [
      { time: "0:0:0", notes: ['C4', 'E4', 'G4', 'B4'] },
      { time: "0:1:0", notes: ['A3', 'C4', 'E4', 'G4'] }, 
      { time: "0:2:0", notes: ['F3', 'A3', 'C4', 'E4'] }, 
      { time: "0:3:0", notes: ['G3', 'B3', 'D4', 'F4'] } 
    ],
    [
      { time: "0:0:0", notes: ['D4', 'F4', 'A4', 'C5'] },
      { time: "0:1:0", notes: ['G3', 'B3', 'D4', 'F4'] }, 
      { time: "0:2:0", notes: ['C4', 'E4', 'G4', 'B4'] }, 
      { time: "0:3:0", notes: ['A3', 'C4', 'E4', 'G4'] } 
    ],
    [
      { time: "0:0:0", notes: ['E4', 'G4', 'B4', 'D5'] },
      { time: "0:1:0", notes: ['A3', 'C4', 'E4', 'G4'] }, 
      { time: "0:2:0", notes: ['D4', 'F4', 'A4', 'C5'] }, 
      { time: "0:3:0", notes: ['G3', 'B3', 'D4', 'F4'] } 
    ],
    [
      { time: "0:0:0", notes: ['F3', 'A3', 'C4', 'E4'] },
      { time: "0:1:0", notes: ['E4', 'G4', 'B4', 'D5'] }, 
      { time: "0:2:0", notes: ['D4', 'F4', 'A4', 'C5'] }, 
      { time: "0:3:0", notes: ['C4', 'E4', 'G4', 'B4'] } 
    ],
  ];

  let currentProgression = $state(chordProgressions[0]);

  // Derived reactive values using runes
  const bpm = $derived((isDay? temperature2m * 2 : temperature2m));
  const reverbWet = $derived(relativeHumidity2m/100);
  const delayWet = $derived(Math.round(windSpeed10m)/10);
  const phaserBase = $derived((1 / cloudCover) * 100);

  // Initialize audio components
  const initializeAudio = async (): Promise<void> => {
    try {
      // Create dreamy synth
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
          type: isDay? 'triangle' : 'sine',
        },
        envelope: {
          attack: 1.5,
          decay: 1,
          sustain: 0.7,
          release: 1.0,
        },
        volume: -20,
      });

      // Create reverb with long, dreamy tail
      reverb = new Tone.Reverb({
        decay: 16,
        wet: reverbWet,
        preDelay: 0.5,
      });


      delay = new Tone.FeedbackDelay({
        delayTime: '0.5',
        feedback: delayWet
      })

      // Create a phaser
      phaser = new Tone.Phaser({
        	frequency : phaserBase,
          octaves : 5,
          baseFrequency : 350
      })
     
      // Create gain node
      gain = new Tone.Gain(Tone.dbToGain(volume));

      // Connect audio chain
      synth.connect(phaser).connect(delay).connect(reverb).connect(gain).toDestination();

      // Generate reverb impulse
      await reverb.generate();

      isInitialized = true;
      console.log('Audio initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  };

  // Start the chord sequence
  const startSequence = async (): Promise<void> => {
    try {
      if (!isInitialized) {
        await initializeAudio();
      }

      await Tone.start();

      if (sequence) {
        sequence.dispose();
        sequence = null;
      }

      // Set transport BPM
      Tone.getTransport().bpm.value = bpm;

      let progressionChangeCounter = 0;

      sequence = new Tone.Sequence((time: number, chord) => {        
        if (synth && chord) {          
          synth!.triggerAttackRelease(chord.notes, '4n', time);
        }

        progressionChangeCounter++;
        
        //Change progression every full cycle (4 chords) for variation
        if (progressionChangeCounter >= currentProgression.length) {
          currentChordIndex = (currentChordIndex + 1) % chordProgressions.length;
          currentProgression = chordProgressions[currentChordIndex];
          sequence!.events = currentProgression;
          progressionChangeCounter = 0;
        }
      }, currentProgression, "4n");

      sequence.start(0);
      Tone.getTransport().start();
      isPlaying = true;
    } catch (error) {
      console.error('Error starting sequence:', error);
    }
  };

  // Stop the sequence
  const stopSequence = (): void => {
    if (sequence) {
      sequence.stop();
      sequence.dispose();
      sequence = null;
    }
    Tone.getTransport().stop();
    Tone.getTransport().cancel();
    isPlaying = false;
  };

  // Toggle playback
  const togglePlayback = async (): Promise<void> => {
    if (isPlaying) {
      stopSequence();
    } else {
      await startSequence();
    }
  };

  // Reactive updates for environmental parameters using effects
  $effect(() => {
    if (reverb && isInitialized) {
      reverb.wet.rampTo(reverbWet, 0.5);
    }
  });

  $effect(() => {
    if (phaser && isInitialized) {
      phaser.frequency.rampTo(phaserBase, 0.5);
    }
  });

  $effect(() => {
    if (gain && isInitialized) {
      gain.gain.rampTo(Tone.dbToGain(volume), 0.1);
    }
  });

  $effect(() => {
    if (isPlaying && isInitialized) {
      Tone.getTransport().bpm.rampTo(bpm, 1.0);
    }
  });

  // Lifecycle
  onMount(() => {
    initializeAudio();
  });

  onDestroy(() => {
    if (sequence) {
      sequence.dispose();
    }
    if (synth) {
      synth.dispose();
    }
    if (reverb) {
      reverb.dispose();
    }
    if (phaser) {
      phaser.dispose();
    }
    if (gain) {
      gain.dispose();
    }
  });
</script>


<!-- TODO: ADD VIZUALZ https://www.npmjs.com/package/p5-svelte -->
<div class="controls-container">
    <!-- Playback Control -->
    <div class="playback-section">
      <button 
        class="play-button {isPlaying ? 'playing' : ''}"
        onclick = {togglePlayback}
        disabled={!isInitialized}
      >
        {isPlaying ? 'Stop' : 'Play'} ✨
      </button>
    </div>
</div>
