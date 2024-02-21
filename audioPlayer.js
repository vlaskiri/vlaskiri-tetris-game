document.addEventListener('DOMContentLoaded', function () {
	let audioPlayer = document.getElementById('audioPlayer');
	let toggleSoundButton = document.getElementById('toggleSoundButton');
	let soundImage = document.getElementById('soundImage');

	// Change onClick Sound Button
	toggleSoundButton.addEventListener('click', function () {
		if (audioPlayer.paused) {
			audioPlayer.play();
			soundImage.src = './assets/Speaker_Icon.svg.png';
		} else {
			audioPlayer.pause();
			soundImage.src = './assets/Mute_Icon.svg';
		}
	});
});
