
  let globe;

  const getMovies = async () => {
    const jsonFile = "assets/data/movies.json";
    const response = await fetch(jsonFile);
    const data = await response.json();
    console.log(data);
    loadWebGl(data);
  };

  const loadWebGl = async (data) => {

    if(!Detector.webgl) {
      Detector.addGetWebGLMessage();
    } else {

      const container = document.getElementById('container');
      globe = new DAT.Globe(container);

      if (data) {
        globe.addData(data);
        globe.animate();
        //document.body.style.backgroundImage = 'none'; // remove loading
        console.log(globe);
      }
    }
  }
  const init = () => {

    getMovies();
  }

  init();
