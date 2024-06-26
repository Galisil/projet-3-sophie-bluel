function openModal(event) {
    event.preventDefault();
    const target = document.querySelector(".jsModal");
    const modal = document.querySelector(target.getAttribute("href"));
    if (modal) {
        modal.style.display = "flex";
        modal.removeAttribute("aria-hidden");
        target.setAttribute("aria-modal", "true");
    }
}

function closeModal(event) {
    event.preventDefault();
    const modal = event.currentTarget.closest(".modal");
    const target = document.querySelector(".btnQuit");
    if (modal) {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        target.removeAttribute("aria-modal");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const open = document.querySelector(".jsModal");
    if (open) {
        open.addEventListener("click", openModal);
    }
    const close = document.querySelector(".btnQuit");
    if (close) {
        close.addEventListener("click", closeModal);
    }
});
