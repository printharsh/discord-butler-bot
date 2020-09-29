# Discord Butler Bot

## Quick Start

```
npm install
```
```
npm start
```

## Features

### Random Chance Events
- 1% Chance when someone enters a voice channel of Rick Rolling.

- 1% Chance of writing a death message in the #death text channel when someone enters a voice channel.

### Random Team Generation
```
!customs {total number of players}
```
If total number of players not specified, defaults to 10.
Simply upvote the message from the bot to join as a player and the bot will auto randomize 2 teams.

### Music
```
!play {song name to search on youtube or link}
```
Plays a song in the voice channel the user is in.
```
!volume {0-100}
```
Sets the volume of the bot playing music.
```
!skip
```
Skips the current song and moves onto the next in queue.
```
!stop
```
Clears the queue, disconnects and stops playing music.
```
!queue
```
Shows the current music queue and whether looping is enabled.
```
!loop
```
Toggles whether to loop or not, by default looping is set to false.
