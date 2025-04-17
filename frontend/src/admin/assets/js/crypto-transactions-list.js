<<<<<<< HEAD
/* For Delete transactions */
let removebtn = document.querySelectorAll(".transactions-delete");
removebtn.forEach((eleBtn) => {
  eleBtn.onclick = () => {
    let remove = eleBtn.closest(".transaction-list");
    remove.remove();
  };
=======
/* For Delete transactions */
let removebtn = document.querySelectorAll(".transactions-delete");
removebtn.forEach((eleBtn) => {
  eleBtn.onclick = () => {
    let remove = eleBtn.closest(".transaction-list");
    remove.remove();
  };
>>>>>>> 60d50bc (first commit)
});