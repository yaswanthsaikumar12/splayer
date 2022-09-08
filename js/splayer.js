const playPausebtn = document.querySelector(".play-pause-btn")
const theaterbtn = document.querySelector(".theater-btn")
const fullscreenbtn = document.querySelector(".fullscreen-btn")
const miniplayerbtn = document.querySelector(".mini-player-btn")
const video = document.querySelector("video")
const videoContainer = document.querySelector(".video-container")
const muteBtn = document.querySelector(".mute-btn")
const volumeSlider = document.querySelector(".volume-slider")
const currentTimeEl = document.querySelector(".current-time")
const totalTimeEl = document.querySelector(".total-time")
const captionsBtn = document.querySelector(".captions-btn")
const speedBtn = document.querySelector(".speed-btn")
const timelineContainer = document.querySelector(".timeline-container")
const thumbnailImg = document.querySelector(".thumbnail-img")
const previewImg = document.querySelector(".preview-img")





document.addEventListener("keydown", e => {
 const tagName = document.activeElement.tagName.toLowerCase()
    if (tagName === "input") return



    switch (e.key.toLowerCase()){
        case " ":
            if (tagName === "button") return
        case "k":
            togglePlay()
            break
            case "f":
                tooglefullscreenmode()
                break
                case "t":
                    toogletheatermode()
                    break
                    case "i":
                        toogleminiplayermode()
                        break
                        case "m":
                            toogleMute()
                            break
                            case "j":
                                skip(-5)
                                break
                                case "l":
                                    skip(5)
                                    break
                                    case "c":
                                        toogleCaptions()
                                        break

        
    }
})


// Timeline
timelineContainer.addEventListener("mousemove", handleTimelineUpdate)
timelineContainer.addEventListener("mousedown", toggleScrubbing)
document.addEventListener("mouseup", e => {
  if (isScrubbing) toggleScrubbing(e)
})
document.addEventListener("mousemove", e => {
  if (isScrubbing) handleTimelineUpdate(e)
})

let isScrubbing = false
let wasPaused
function toggleScrubbing(e) {
  const rect = timelineContainer.getBoundingClientRect()
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
  isScrubbing = (e.buttons & 1) === 1
  videoContainer.classList.toggle("scrubbing", isScrubbing)
  if (isScrubbing) {
    wasPaused = video.paused
    video.pause()
  } else {
    video.currentTime = percent * video.duration
    if (!wasPaused) video.play()
  }

  handleTimelineUpdate(e)
}

function handleTimelineUpdate(e) {
  const rect = timelineContainer.getBoundingClientRect()
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
  const previewImgNumber = Math.max(
    1,
    Math.floor((percent * video.duration) / 10)
  )
  const previewImgSrc = `assets/previewImgs/preview${previewImgNumber}.jpg`
  previewImg.src = previewImgSrc
  timelineContainer.style.setProperty("--preview-position", percent)

  if (isScrubbing) {
    e.preventDefault()
    thumbnailImg.src = previewImgSrc
    timelineContainer.style.setProperty("--progress-position", percent)
  }
}








//speed playback

speedBtn.addEventListener("click", changePlaybackSpeed)
    function changePlaybackSpeed(){
        let newPlaybackRate = video.playbackRate +.25
        if (newPlaybackRate > 2) newPlaybackRate = .25
        video.playbackRate = newPlaybackRate
        speedBtn.textContent = `${newPlaybackRate}x`
    }

//captions
const captions = video.textTracks[0]
captions.mode = "hidden"

captionsBtn.addEventListener("click", toogleCaptions)

function toogleCaptions(){
    const isHidden = captions.mode === "hidden"
    captions.mode = isHidden ? "showing" : "hidden"
    videoContainer.classList.toggle("captions", isHidden)
}


// time duration 

video.addEventListener("loadeddata", () => {
    totalTimeEl.textContent = formatDuration(video.duration)
})

video.addEventListener("timeupdate",() => {
    currentTimeEl.textContent = formatDuration(video.currentTime)
})

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2
})
function formatDuration(time){
  const seconds = Math.floor(time % 60)
  const minutes = Math.floor(time /60) %60
  const hours = Math.floor(time / 3600)
if (hours === 0) {
    return `${minutes}:${leadingZeroFormatter.format(seconds)}`
}else {
    return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`
}

}

function skip(duration){
video.currentTime+= duration
}




// volume control

muteBtn.addEventListener("click", toogleMute)
volumeSlider.addEventListener("input", e => {
   video.volume = e.target.value
   video.muted = e.target.value === 0
})

function toogleMute(){
    video.muted = !video.muted
}

video.addEventListener("volumechange",() => {
    volumeSlider.value = video.volume
    let volumeLevel
    if (video.muted || video.volume === 0){
        volumeSlider.value = 0
        volumeLevel = "muted"
    }else if (video.volume >= .5){
        volumeLevel = "high"
    }else {
        volumeLevel = "low"
    }
    videoContainer.dataset.volumeLevel = volumeLevel
})

// view modes

theaterbtn.addEventListener('click', toogletheatermode)
fullscreenbtn.addEventListener('click', tooglefullscreenmode)
miniplayerbtn.addEventListener('click', toogleminiplayermode)


function toogletheatermode(){
    videoContainer.classList.toggle("theater")
}

function tooglefullscreenmode(){
    if (document.fullscreenElement == null){
       videoContainer.requestFullscreen()    
    }else{
            document.exitFullscreen()
        }
}

function toogleminiplayermode(){
    if (videoContainer.classList.contains("mini-player")){
        document.exitPictureInPicture()    
     }else{
             video.requestPictureInPicture()
         }
}

document.addEventListener('fullscreenchange',() => {
    videoContainer.classList.toggle("fullscreen", document.fullscreenElement)
})

video.addEventListener('enterpictureinpicture', () => {
    videoContainer.classList.add("mini-player")
})

video.addEventListener('leavepictureinpicture', () => {
    videoContainer.classList.remove("mini-player")
})


//  play paus functions 

playPausebtn.addEventListener('click', togglePlay) 
video.addEventListener('click', togglePlay)


function togglePlay(){
    video.paused ? video.play() : video.pause()
}


video.addEventListener("play",() => {
    videoContainer.classList.remove("paused")
})

video.addEventListener("pause",() => {
    videoContainer.classList.add("paused")
})