
const soundUrls = {
  placeMark: 'https://actions.google.com/sounds/v1/impacts/sharp_metal_impact.ogg',
  win: 'https://actions.google.com/sounds/v1/positive/success_bell_chime.ogg',
  lose: 'https://actions.google.com/sounds/v1/negative/negative_beeps.ogg',
  draw: 'https://actions.google.com/sounds/v1/ui/ui_pop_up_off.ogg',
  reset: 'https://actions.google.com/sounds/v1/ui/button_press.ogg',
};

// Preload audio elements for faster playback
const audioPlayers: { [key: string]: HTMLAudioElement } = {};

Object.entries(soundUrls).forEach(([key, url]) => {
  if (typeof window !== 'undefined') {
    const audio = new Audio(url);
    audio.preload = 'auto';
    audioPlayers[key] = audio;
  }
});

const playSound = (player: HTMLAudioElement) => {
  if (player) {
    // Allows sound to be replayed before it finishes
    player.currentTime = 0;
    player.play().catch(error => {
      // Autoplay can be prevented by the browser. We can safely ignore this specific error.
      if (error.name !== 'NotAllowedError') {
        console.error("Error playing sound:", error);
      }
    });
  }
};

export const playPlaceMarkSound = () => playSound(audioPlayers.placeMark);
export const playWinSound = () => playSound(audioPlayers.win);
export const playLoseSound = () => playSound(audioPlayers.lose);
export const playDrawSound = () => playSound(audioPlayers.draw);
export const playResetSound = () => playSound(audioPlayers.reset);
