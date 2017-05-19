var iframe = document.getElementById('player');
var player = new Vimeo.Player(iframe);

var cueInputField = document.getElementById('cue-input');
var timestampSelectorBegin = document.getElementById('timestamp-selector-begin');
var timeStampSelectorEnd = document.getElementById('timestamp-selector-end');
var cueSubmitButton = document.getElementById('add-cue-button');
var cueList = document.getElementById('cue-list');

var cues = {};
var cueCount = 0;
var cueId = 0;

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

player.on('play', function () {
  console.log('played the video!');
});

player.getVideoTitle()
.then(function (title) {
  console.log('title: ', title);
});


function onCueSubmit () {
  console.log(cueInputField.value);
  // cues[++cueCount] = cueInputField.value;
  if (Number(timestampSelectorBegin.value) > Number(timeStampSelectorEnd.value)) {
    alert("Invalid Range");
  } else {
    addToCues(cueInputField.value);
    cueInputField.value = '';
  }
  // var list = '';
  // for (var key in cues) {
  //   list += '<li class="cue-list-element">' + cues[key] + '</li>';
  // }
  // cueList.innerHTML = list;

}

function addToCues (message) {
  cues[timestampSelectorBegin.value] = new Cue(timestampSelectorBegin.value, timeStampSelectorEnd.value, message);
  var list = '';
  for (var key in cues) {
    list += '<li class="cue-list-element">' + cues[key].message + '</li>';
  }
  cueList.innerHTML = list;
}

function addToCuesTimestamp (message) {
  return player.getCurrentTime()
  .then(function (seconds) {
    cues[seconds] = new Cue(seconds, message);
  })
  .then(function () {
    var list = '';
    for (var key in cues) {
      list += '<li class="cue-list-element">' + cues[key].message + '</li>';
    }
    cueList.innerHTML = list;
  })
  .catch(console.error('error'));
}

function logCues () {
  console.log(cues);
  console.log(typeof timestampSelectorBegin.value);
}