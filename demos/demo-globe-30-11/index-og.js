import DAT from './js/globe.js'

{
  let globe;

    if(!Detector.webgl) {
      Detector.addGetWebGLMessage();
    } else {
      const container = document.getElementById('container');
        globe = new DAT.Globe(container);
        
        let xhr;
        TWEEN.start();

        xhr = new XMLHttpRequest();
        xhr.open('GET', 'assets/data/movies.json', true);
        xhr.onreadystatechange = function(e) {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              const data = JSON.parse(xhr.responseText);
              window.data = data;
              //console.log(data); // ARRAY
              globe.addData(data);
              globe.animate();
            }
          }
        };
        xhr.send(null);


  }
}