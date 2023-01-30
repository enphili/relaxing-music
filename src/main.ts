import './style.sass'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div class="video-container">
      <video loop>
        <source src="../video/rain.mp4" type="video/mp4">
      </video>
    </div>
  
    <div class="time-select">
      <button data-time="120">2 минуты</button>
      <button data-time="300">5 минут</button>
      <button data-time="600">10 минут</button>
    </div>
  
    <div class="player-container">
      <audio class="song">
        <source src="../sounds/rain.mp3">
      </audio>
      <img src="../svg/play.svg" alt="play" class="play">
      <svg class="track-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="226.5" cy="226.5" r="216.5" stroke="white" stroke-width="20"/>
      </svg>
      <svg class="moving-outline" width="453" height="453" viewBox="0 0 453 453" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <circle cx="226.5" cy="226.5" r="216.5" stroke="#018EBA" stroke-width="20"/>
      </svg>
      <h3 class="time-display">0:00</h3>
    </div>
  
    <div class="sound-picker">
      <button data-sound="./sounds/rain.mp3" data-video="./video/rain.mp4"><img src="../svg/rain.svg" alt="rain"></button>
      <button data-sound="./sounds/beach.mp3" data-video="./video/beach.mp4"><img src="../svg/beach.svg" alt="beach"></button>
    </div>
`

const init = () => {
  // DOM elements start
  const $song = document.querySelector<HTMLMediaElement>('.song')
  if (!$song) throw new Error('the element ".song" was not found')
  const $play = document.querySelector<HTMLImageElement>('.play')
  if (!$play) throw new Error('the element ".play" was not found')
  const $outline = document.querySelector<SVGGeometryElement>('.moving-outline circle')
  if (!$outline) throw new Error('the element ".moving-outline circle" was not found')
  const $video = document.querySelector<HTMLMediaElement>('.video-container video')
  if (!$video) throw new Error('the element ".video-container video" was not found')
  const $sounds = document.querySelectorAll('.sound-picker button')
  const $timeSelect = document.querySelectorAll('.time-select button')
  const $timeDisplay = document.querySelector('.time-display')
  if (!$timeDisplay) throw new Error('the element ".time-display" was not found')
  // DOM elements end
  
  const playVideoAndSound = async (): Promise<void> => {
    try {
      await $song.play()
      await $video.play()
    }
    catch (error) {
      $song.pause()
      $video.pause()
      $play.src = './svg/play.svg'
    }
  }
  
  const handlePlay = (): void => {
    if ($song.paused) {
      playVideoAndSound().then()
      $play.src = './svg/pause.svg'
    } else {
      $song.pause()
      $video.pause()
      $play.src = './svg/play.svg'
    }
  }
  
  const animateCircle = (): void => {
    const currentTime: number = $song.currentTime
    const elapsedTime: number = fakeDuration - currentTime
    const seconds: number = Math.floor(elapsedTime % 60)
    const minutes: number = Math.floor(elapsedTime / 60)
    let progress: number = outlineLength - (currentTime / fakeDuration) * outlineLength
    $outline.style.strokeDashoffset = String(progress)
    $timeDisplay.textContent = `${String(minutes)}:${String(seconds).padStart(2, '0')}`
    if (currentTime >= fakeDuration) {
      $song.pause()
      $song.currentTime = 0
      $play.src = './svg/play.svg'
      $video.pause()
    }
  }
  
  const outlineLength: number =  $outline.getTotalLength()
  let fakeDuration = 600
  
  $outline.style.strokeDasharray = String(outlineLength)
  $outline.style.strokeDashoffset = String(outlineLength)
  
  $sounds.forEach((button) => {
    button.addEventListener('click', function(this: HTMLButtonElement) {
      if (this.dataset.sound) $song.src = this.dataset.sound
      if (this.dataset.video) $video.src = this.dataset.video
      handlePlay()
    })
  })
  
  $timeSelect.forEach((button) => {
    button.addEventListener('click', function(this: HTMLButtonElement) {
      if (this.dataset.time) {
        $song.currentTime = 0
        fakeDuration = parseInt(this.dataset.time)
        $timeDisplay.textContent = `${String(Math.floor(fakeDuration / 60))}:${String(Math.floor(fakeDuration % 60)).padStart(2, '0')}`
      }
    })
  })
  
  $song.addEventListener('timeupdate', animateCircle, false)
  $play.addEventListener('click', handlePlay, false)
}

init()
