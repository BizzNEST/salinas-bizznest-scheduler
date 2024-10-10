export function displayEditModal() {
  const table = document.getElementById("interns-week-table");
  const addIntern = document.getElementById("add-intern-1");
  console.log(table);
  addIntern.addEventListener("click", function () {
    var modal = document.getElementById("edit-pair-modal");

    modal.style.display = "block";

    // Get the button that opens the modal
    var btn = document.getElementById("add");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("edit-close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  });
  // Get the modal
}
