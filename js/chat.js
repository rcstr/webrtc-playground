// TODO: remove jquery
$(function() {
    // init variables
    var $roomNameForm = $('.create-room'),
        $roomTitle = $('[data-chat-title]');
    // Grab the room name from the url

    // create webrtc connection

    // when it's ready and we have the url join the call

    // set the room name
    function setRoomName(name) {
        $roomNameForm.remove();
        $roomTitle.tex('Welcome to room: ' + name);
    }
        // if there's  a room, show it in the UI
        // it not, create when the user submits the form
        // video chat stuff
});
