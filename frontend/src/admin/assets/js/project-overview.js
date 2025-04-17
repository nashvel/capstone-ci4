<<<<<<< HEAD
(function () {
    "use strict";

    /* draggable js */
    dragula([document.getElementById('todo-drag')],{
        moves: function (el, container, handle) {
            return handle.classList.contains('todo-handle');
          }
    });

=======
(function () {
    "use strict";

    /* draggable js */
    dragula([document.getElementById('todo-drag')],{
        moves: function (el, container, handle) {
            return handle.classList.contains('todo-handle');
          }
    });

>>>>>>> 60d50bc (first commit)
})();