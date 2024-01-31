var displayed = false;

function dropdown() {
    var dropdown = document.getElementById("dropdown")

    if (displayed == false) {
        dropdown.style.display = "block";
        displayed = true;
    }
    else {
        dropdown.style.display = "none"
        displayed = false;
    }
}