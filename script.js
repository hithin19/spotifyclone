// Function to fetch and return songs
let songs;
let currentsong=new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function returnssongs(folder) {
    try {
        let response = await fetch("http://127.0.0.1:5500/songs/");
        let html = await response.text();
        console.log("Fetched HTML response:", html);
        
        let div = document.createElement("div");
        div.innerHTML = html;

        let as = div.getElementsByTagName("a");
        console.log("All anchor tags:", as);

         songs = [];
        for (let i = 0; i < as.length; i++) {
            const ele = as[i];
            if (ele.href.includes(".mp3")) {
                const songName = new URL(ele.href).pathname.split('/').pop(); 
                songs.push(songName); // Keep with %20 intact
            }
        }

        console.log("MP3 songs:", songs);
        return songs;
    } catch (error) {
        console.error("An error occurred:", error);
        return [];
    }
}

// Main function to load and display songs
async function main() {
   
    try {
        let songs = await returnssongs();
        console.log("MP3 songs:", songs);
        
        if (songs.length === 0) {
            console.warn("No MP3 songs found.");
            return;
        }

        let songul = document.querySelector(".songlist ul");

        for (const song of songs) {
            let listItem = document.createElement("li");
            listItem.innerHTML = `
                <img class="invert" src="img/music.svg" alt="music">
                <div class="info">
                    <div>${song}</div>
                    <div>hithin</div>
                </div>
                <div class="playnow">
                    <span>playnow</span>
                    <img class="invert" src="img/play.svg" alt="">
                </div>
            `;

            // Add click event listener to play the song
            listItem.addEventListener("click", () => {
                playmusic(song);
            });

            songul.appendChild(listItem);
        }

        //attach an event listener to plat next revious
        play.addEventListener("click",()=>{
            if(currentsong.paused){
                currentsong.play()
                play.src="img/pause.svg"
            }else{
                currentsong.pause()
                 play.src="img/play.svg"

            }
        })

    } catch (error) {
        console.error("Error in main function:", error);
    }

}

const playmusic = (track) => {
   // let audio = new Audio("http://127.0.0.1:5500/songs/" + track);
   currentsong.src="/songs/" + track;
   currentsong.play();
   play.src="img/pause.svg"
   document.querySelector(".songinfo").innerHTML = track;
   document.querySelector(".songtime").innerHTML ="00:00/ 00::00"
};

currentsong.addEventListener("timeupdate",()=>{
     console.log(currentsong.currentTime,currentsong.duration);
     document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`;
     document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
})
 //add an event listener to seekbar
 document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
     document.querySelector(".circle").style.left =percent+"%";
     currentsong.currentTime = (currentsong.duration*percent)/100;
 })

 document.querySelector(".ham").addEventListener("click", () => {
    const leftPanel = document.querySelector(".left");
    leftPanel.style.left = "0"; // Open the panel
    leftPanel.style.zIndex = "1"; // Bring the panel to the front
});

// Close the panel when the close icon is clicked
document.querySelector(".close").addEventListener("click", () => {
    const leftPanel = document.querySelector(".left");
    leftPanel.style.left = "-100%"; // Close the panel
    leftPanel.style.zIndex = "0"; // Send the panel behind other content
});

// add an event listener to prev and next
previous.addEventListener("click",()=>{
    let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if((index-1)>=0){
        playmusic(songs[index-1])
    }else {
        console.log("No previous song available."); // Optional: Handle edge case
    }

})
next.addEventListener("click",()=>{
    let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if((index+1)<songs.length){
        playmusic(songs[index+1])
    }else {
        playmusic(songs[index]) // Optional: Handle edge case
    }
})

//add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
           currentsong.volume=parseInt(e.target.value)/100;
            
 })



// Run the main function after DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    main();
});
