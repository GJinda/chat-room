var chats = [{
  userId: 1,
  name: '我是1',
  side: 'left',
  messages: [{
    text: '你住的巷子里'
  }]
}, {
  userId: 2,
  name: '我是2',
  side: 'left',
  messages: [{
    text: '我租了一间公寓'
  }]
}];

function setObject(obj, id) {
  obj.userId = parseInt(id);
  obj.name += id;
  obj.messages[0].text += id;
}

function getUserNameById(id) {
  for (var i = 0; i < chats.length; i++) {
    if (chats[i].userId == id) {
      return chats[i].name;
    }
  }
  return null;
}

function hasChat(id) {
  for (var i = 0; i < chats.length; i++) {
    if (chats[i].userId == id) {
      console.log("has user", id);
      return true;
    }
  }
  console.log("no user", id);
  return false;
}

function addChat(id) {
  console.log("addChat", id);
  var chat = new Object({
    userId: id,
    name: '我是',
    side: 'left',
    messages: [{
      text: '你好我是'
    }]
  })
  setObject(chat, id);
  console.log(chats);
  chats.push(chat);
}

function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}

function addId(ele, id) {
  ele.id = id;
}

function addClass(ele, className) {
  ele.classList.add(className);
}

function removeClass(ele, className) {
  ele.classList.remove(className);
}

function hasClass(ele, className) {
  return ele.classList.contains(className);
}

var finalRecordId = 0;
var userId = '';

function getUserId() {
  return 1;
}

function getUserName(id) {
  return chats[id].name;
}

function setUserName(name) {
  var thatName = $(".user-bar h2.thatName");
  thatName.innerHTML = name;
}

function getDomByStr(str) {
  const div = document.createElement('div');
  div.innerHTML = str;
  return div.children[0];
}

//append message bubble item
function getMessageDom(side, userId, str) {
  const template = `
    <div class="message-item message-item-${side}">
      <div class="avaWrapper">
        <img class="avatar" src="./avatar/${side === 'left' ? userId % 11 + 1 : 0}.jpg" alt="头像">
      </div>
      <div class="message-bubble">${str}</div>
    </div>
  `
  return getDomByStr(template);
}

function appendMessage(side, userId, str) {
  // const curMessage = chats[finalRecordId];
  const messageDom = getMessageDom(side, userId, str);
  $('.active').append(messageDom);
  messageDom.scrollIntoView();
}

//append chat list
function getMessageListDom(userId) {
  const template = `
    <div class="message-list hidden" id="list${userId}">
    </div>
  `
  return getDomByStr(template);
}

function appendMessageList(userId) {
  const messageListDom = getMessageListDom(userId);
  $('.user-bar').after(messageListDom);
}

//append chat item
function getChatDom(userId, name) {
  const template = `
    <li class="user-item">
      <div class="avaWrapper">
        <img class="thatAvatar" src="avatar/${userId % 11 + 1}.jpg" alt="">
      </div>
      <div class="text">${name}</div>
    </li>
  `
  return getDomByStr(template);
}

function appendChat(id, name) {
  const userDom = getChatDom(id, name);
  $('.user-list').append(userDom);
}

function sendMessage() {
  text = $('#edit-text').value;
  if (text != "") {
    appendMessage('right', 0, text);
  }

  //new chat
  if (text.indexOf('@') != -1) {
    id = text.slice(1);
    if (id != "" && !isNaN(id) && id.indexOf(' ') == -1 && !hasChat(id)) {
      //add messages.userId
      addChat(id);
      //add msg list
      appendMessageList(id);
      //add chat item
      appendChat(id, getUserNameById(id));
    }
    bindFocusChatEvent();
  }

  //Ajax send message
  // $.post("ServletSay", { "message": message });

  $('#edit-text').value = null;
}

//remove user item focus shadow
function removeAllFocusUser(chats) {
  for (var i = 0; i < chats.length; i++) {
    removeClass(chats[i], "focus");
  }
}

//hide message list
// function hideAllMessageList(msgLists) {
//   for (var i = 0; i < msgLists.length; i++) {
//     addClass(msgLists[i], "hidden");
//     removeClass(msgLists[i], "active");
//   }
// }

function activeList(id) {
  actlist = document.getElementById("list" + id);
  addClass(actlist, "active");
  removeClass(actlist, "hidden");
}

function hideList(msgLists) {
  for (var i = 0; i < msgLists.length; i++) {
    removeClass(msgLists[i], "active");
    addClass(msgLists[i], "hidden");
  }
}

function bindFocusChatEvent() {
  const chatItem = $$(".user-item");
  const msgLists = $$(".message-list");

  //user item click event
  for (var i = 0; i < chatItem.length; i++) {
    (function (i) {
      chatItem[i].onclick = function () {
        const name = chatItem[i].querySelector(".text").innerHTML;

        //which chat list to show
        hideList(msgLists);
        console.log(msgLists[i]);

        if (!isNaN(name.slice(2))) {
          //active this id list
          activeList(name.slice(2));
        } else {
          activeList(0);
        }

        //which chat to focus
        removeAllFocusUser(chatItem);
        addClass(chatItem[i], "focus");
        console.log(chatItem[i]);

        //update chat list
        setUserName(name);
      }
    })(i);
  }
}

function bindEvent() {
  //my info event
  // var thisName = $(".top-bar h1.thisName");
  // thisName.innerHTML = ???;

  //title event
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      document.title = "Come back !";
    } else {
      document.title = "I'm fine.";
    }
  });

  //add chat event
  $('.user-groups').onclick = function () {
    addClass($('.chat-box'), "hidden");
    removeClass($('.add-chat'), "hidden");
  }

  //send event
  $('.send-btn').onclick = function () {
    sendMessage();
  }

  //enter key event
  $("#edit-text").onkeydown = function (event) {
    if (event.ctrlKey && event.keyCode == 13) {
      sendMessage();
    }
  }

  bindFocusChatEvent();

  //exit event
  $(".icon-logout").onclick = function () {
    window.location.reload();
  }
}

//bind all event
window.onload = bindEvent;