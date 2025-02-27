export function makeDraggable(applet) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    applet.addEventListener('mousedown', (e) => {
        if (e.target.closest('button')) return;
        isDragging = true;
        offsetX = e.clientX - applet.offsetLeft;
        offsetY = e.clientY - applet.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        applet.style.left = `${e.clientX - offsetX}px`;
        applet.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    applet.addEventListener('touchstart', (e) => {
        if (e.target.closest('button')) return;
        e.preventDefault();
        isDragging = true;
        const touch = e.touches[0];
        offsetX = touch.clientX - applet.offsetLeft;
        offsetY = touch.clientY - applet.offsetTop;
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        applet.style.left = `${touch.clientX - offsetX}px`;
        applet.style.top = `${touch.clientY - offsetY}px`;
    }, { passive: false });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });
}