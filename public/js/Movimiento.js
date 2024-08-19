const container = document.getElementById('container');
const overlayBtn = document.getElementById('overlayBtn');

overlayBtn.addEventListener('click', ()=>{
    container.classList.toggle('right-panel-active');
    overlayBtn.classList.remove('btnScaled');
    window.requestAnimationFrame(()=>{
        overlayBtn.classList.add('btnScaled');
    })
});