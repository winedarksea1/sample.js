var iframe = document.getElementById('player');
var player = new Vimeo.Player(iframe);

var cueInputField = document.getElementById('cue-input');
var timestampSelectorBegin = document.getElementById('timestamp-selector-begin');
var timeStampSelectorEnd = document.getElementById('timestamp-selector-end');
var cueSubmitButton = document.getElementById('add-cue-button');
var cueList = document.getElementById('cue-list');
var cueOverlay = document.getElementById('overlay');

var cues = {};

var timeoutId;

function Cue (begin, message) {
  this.begin = begin;
  this.message = message;
}

function buildSelect (selector, n) {
  for (var i = 0 ; i <= n ; i++) {
    var newOption = document.createElement('option');
    newOption.innerHTML = i;
    selector.appendChild(newOption);
  }
}
buildSelect(timestampSelectorBegin, 120);

//EVENTS
player.on('play', function () {
  console.log('played the video!');
});

player.getVideoTitle()
.then(function (title) {
  console.log('title: ', title);
});

player.on('timeupdate', function (e) {
  if (cues[String(Math.floor(e.seconds))]) {
    cueOverlay.innerHTML = cues[String(Math.floor(e.seconds))].message;
    cueVisible();
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(cueHidden, 5000);
    } else {
      timeoutId = setTimeout(cueHidden, 5000);
    }
  }

});
//////////////////////

function onCueSubmit () {
  addToCues(cueInputField.value);
  cueInputField.value = '';

}

function addToCues (message) {
  var newCue = new Cue(timestampSelectorBegin.value, message);
  var newCueDiv = document.createElement('div');
  var newMessage = document.createElement('div');
  var newTimestamp = document.createElement('div');
  var newCueButton = document.createElement('button');
  if (cues[timestampSelectorBegin.value]) overrideCue(timestampSelectorBegin.value);
  cues[timestampSelectorBegin.value] = newCue;
  newCueDiv.className = 'is-floated';
  newCueDiv.id = newCue.begin;
  newMessage.innerHTML = newCue.message;
  newMessage.className = 'cue-message';
  newTimestamp.innerHTML = newCue.begin;
  newTimestamp.className = 'cue-timestamp';
  newCueButton.innerHTML = 'X';
  newCueButton.className = 'cue-button';
  newCueButton.onclick = removeCue;
  newCueButton.id = 'cue-button-' + newCue.begin;
  newCueDiv.appendChild(newMessage);
  newCueDiv.appendChild(newCueButton);
  newCueDiv.appendChild(newTimestamp);
  document.getElementById('cue-container').appendChild(newCueDiv);
}

function overrideCue (beginStamp) {
  delete cues[beginStamp];
  document.getElementById(beginStamp).remove();
}

function removeCue (e) {
  var cueId = e.target.id.slice(11);
  var parentDiv = document.getElementById(cueId);
  delete cues[cueId];
  parentDiv.remove();
}

function cueVisible () {
  cueOverlay.className = 'visible';
}

function cueHidden () {
  cueOverlay.className = 'hidden';
}
