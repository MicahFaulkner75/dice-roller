/*
* DRAGGABLE FUNCTIONALITY
*
* This file provides functionality to make DOM elements draggable by the user.
* It is responsible for handling mouse and touch events to enable moving the
* dice roller applet around the screen.
*
* This file:
* 1. Adds mouse and touch event listeners (makeDraggable)
* 2. Tracks dragging state and offset values
* 3. Updates element position based on mouse/touch movement
* 4. Prevents dragging when interacting with buttons or input areas
* 5. Handles both desktop and mobile touch interactions
*/

export function makeDraggable(applet) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    applet.addEventListener('mousedown', (e) => {
        if (e.target.closest('button') || e.target.closest('.input-row')) return;
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
        if (e.target.closest('button') || e.target.closest('.input-row')) return;
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