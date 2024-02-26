document.addEventListener('DOMContentLoaded', function () {
	let audioPlayer = document.getElementById('audioPlayer');
	let toggleSoundButton = document.getElementById('toggleSoundButton');
	let soundImage = document.getElementById('soundImage');

	// Play/Pause Sound Button
	toggleSoundButton.addEventListener('click', function () {
		if (audioPlayer.paused) {
			audioPlayer.play();
			soundImage.src = './assets/unmuteIcon.png';
		} else {
			audioPlayer.pause();
			soundImage.src = './assets/muteIcon.png';
		}
	});
});
