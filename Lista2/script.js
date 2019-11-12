window.addEventListener("load", function () {
    const img = document.getElementById("img");
    const images = [];
    var i;
    for (i = 0; i < 8; i += 1) {
        images.push(`ja_${i}.jpg`);
    }
    var counter = 1;

    function changeImage() {
        img.src = images[counter];
        counter = (counter + 1) % 7;
        setTimeout(changeImage, 3000);
    }
    changeImage();

});