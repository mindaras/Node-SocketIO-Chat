var socket = io();

// creates a socket
socket.on('connect', function() {
  var params = getUrlParams(window.location.search);

  socket.emit('join', params, function(err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    }
  });
});

socket.on('updateUserList', function(users) {
  var userList = document.getElementById('userList');

  userList.innerHTML = '';

  users.forEach(function(user) {
    var template = document.getElementById('userTemplate').innerHTML,
        html = Mustache.render(template, {
          displayName: user
        });

    userList.insertAdjacentHTML('beforeend', html);
  });
});

// listens for event
socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

var messages = document.getElementById('messages');

// listens for custom event
socket.on('newMessage', function(message) {
  var template = document.getElementById('messageTemplate').innerHTML;
      html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
      });

  messages.insertAdjacentHTML('beforeend', html);
  scrollUser();
});

socket.on('newLocationMessage', function(message) {
  var template = document.getElementById('locationMessageTemplate').innerHTML,
      html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
      });

  messages.insertAdjacentHTML('beforeend', html);
  scrollUser();
});

function scrollUser() {
  var lastMessageHeight = messages.lastElementChild.clientHeight,
      secondToLastMessageHeight = messages.lastElementChild.previousElementSibling ? messages.lastElementChild.previousElementSibling.clientHeight : 0;

  if (messages.scrollHeight - lastMessageHeight - secondToLastMessageHeight - 56  <= messages.scrollTop + messages.clientHeight) {
    messages.scrollTo(0, messages.scrollHeight);
  }
};

var form = document.getElementById('messageForm'),
    locationButton = document.getElementById('location');

form.onsubmit = function(e) {
  var messageInput = form.querySelector('input[name="message"]');

  e.preventDefault();

  // emits an event
  socket.emit('createMessage', messageInput.value, function() {
      form.reset();
  });
};

locationButton.addEventListener('click', function(e) {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.setAttribute('disabled', true);

  navigator.geolocation.getCurrentPosition(function(position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
    locationButton.removeAttribute('disabled');
  }, function() {
    locationButton.removeAttribute('disabled');
    alert('Unable to fetch location.');
  });
});

var usersButton = document.getElementById('usersButton'),
    usersBackButton = document.getElementById('usersBack');

usersButton.onclick = toggleUsers.bind(this);
usersBackButton.onclick = toggleUsers.bind(this);

function toggleUsers() {
  var users = document.getElementById('users'),
      overlay = document.getElementById('overlay');

  overlay.classList.toggle('active');
  users.classList.toggle('active');
};

function getUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    if ((queryString.match(/\+/g) || []).length) {
      queryString = queryString.replace(/\+/g, ' ');
    }

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();

      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}
