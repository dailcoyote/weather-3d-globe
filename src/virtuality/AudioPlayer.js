let audio;

class AudioPlayer {
    constructor() {
        audio = new Audio("./audio/space.mp3");
        audio.loop = true;
    }
    play() {
        audio.play();
    }
}
export default new AudioPlayer();