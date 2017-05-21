var iframe = document.getElementById('player');
var player = new Vimeo.Player(iframe);

var cueInputField = document.getElementById('cue-input');
var timestampSelectorBegin = document.getElementById('timestamp-selector-begin');
var timeStampSelectorEnd = document.getElementById('timestamp-selector-end');
var cueSubmitButton = document.getElementById('add-cue-button');
var cueList = document.getElementById('cue-list');
var cueOverlay = document.getElementById('overlay');

var cues = {};
var cueCount = 0;
var cueId = 0;

var timeoutId;

function Cue (begin, end, message) {
  this.begin = begin;
  this.end = end;
  this.message = message;
  this.id = ++cueId;
}

function buildSelect (selector, n) {
  for (var i = 0 ; i <= n ; i++) {
    var newOption = document.createElement('option');
    newOption.innerHTML = i;
    selector.appendChild(newOption);
  }
}
buildSelect(timestampSelectorBegin, 120);
buildSelect(timeStampSelectorEnd, 120);

//EVENTS
player.on('play', function () {
  console.log('played the video!');
});

player.getVideoTitle()
.then(function (title) {
  console.log('title: ', title);
});

player.on('timeupdate', function (e) {
  // console.log(e);
  if (cues[String(Math.floor(e.seconds))]) {
    cueOverlay.innerHTML = cues[String(Math.floor(e.seconds))].message;
    cueVisible();
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(cueHidden, 5000);
    } else {
      timeoutId = setTimeout(cueHidden, 5000);
      console.log("Cue Fired");
    }
  }

  if (Math.floor(e.seconds) === 25) {
    console.log("timeoutId: " + timeoutId);
  }
});
//////////////////////



function onCueSubmit () {
  console.log(cueInputField.value);
  // cues[++cueCount] = cueInputField.value;
  // if (Number(timestampSelectorBegin.value) > Number(timeStampSelectorEnd.value)) {
  //   alert("Invalid Range");
  // } else {
  addToCues(cueInputField.value);
  cueInputField.value = '';
  //}
  // var list = '';
  // for (var key in cues) {
  //   list += '<li class="cue-list-element">' + cues[key] + '</li>';
  // }
  // cueList.innerHTML = list;

}

// function addToCues (message) {
//   cues[timestampSelectorBegin.value] = new Cue(timestampSelectorBegin.value, timeStampSelectorEnd.value, message);
//   var list = '';
//   for (var key in cues) {
//     list += '<div class="cue-list-element-container is-floated">' + '<div class="cue-list-message">' + cues[key].message + '</div>' + '<div>' + key + '</div>' + '</div>';
//   }
//   cueList.innerHTML = list;
// }

function addToCues (message) {
  var newCue = new Cue(timestampSelectorBegin.value, timeStampSelectorEnd.value, message);
  cues[timestampSelectorBegin.value] = newCue;
  var newCueDiv = document.createElement('div');
  newCueDiv.className = 'is-floated';
  var newMessage = document.createElement('div');
  newMessage.innerHTML = newCue.message;
  var newTimestamp = document.createElement('div');
  newTimestamp.innerHTML = newCue.begin;
  newCueDiv.appendChild(newMessage);
  newCueDiv.appendChild(newTimestamp);
  document.getElementById('cue-container').appendChild(newCueDiv);
}

function addToCuesTimestamp (message) {
  return player.getCurrentTime()
  .then(function (seconds) {
    cues[seconds] = new Cue(seconds, message);
  })
  .then(function () {
    var list = '';
    for (var key in cues) {
      list += '<div class="cue-list-element">' + cues[key].message + '</li>';
    }

    // cueList.innerHTML = list;
  })
  .catch(console.error('error'));
}

function logCues () {
  console.log(cues);
  console.log(typeof timestampSelectorBegin.value);
}

function toggleCueVisibility () {
  var cues = document.getElementById('overlay');
  if (cues.className === 'hidden') {
    cues.className = 'visible';
  } else {
    cues.className = 'hidden';
  }
}

function cueVisible () {
  cueOverlay.className = 'visible';
}

function cueHidden () {
  cueOverlay.className = 'hidden';
}
