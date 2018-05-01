function australia() {
  const mapState = document.querySelectorAll('.js-mapState');
  const dataItem = document.querySelectorAll('.js-dataItem');

  for (let i = 0; i < mapState.length; i++) {
    mapState[i].onclick = () => {
      for (let i = 0; i < mapState.length; i++) {
        mapState[i].classList.remove('is-active');
        dataItem[i].classList.remove('is-visible');
      }

      mapState[i].classList.add('is-active');
      dataItem[i].classList.add('is-visible');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => australia());
