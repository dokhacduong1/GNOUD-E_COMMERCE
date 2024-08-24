const tabClicks = document.querySelectorAll(".menu-tab ul li");
const tabChildren = document.querySelectorAll(".menu-content-tab .tab-child");

tabClicks.forEach((tabClick) => {
    tabClick.addEventListener("click", function () {
        const id = this.getAttribute("id");
        const activeTab = document.querySelector(`.menu-content-tab [id-tab="${id}"]`);
        if (!activeTab) return;

        tabClicks.forEach((tab) => {
            tab.classList.remove("active-tab");
        });

        this.classList.add("active-tab");

        tabChildren.forEach((tab) => {
            tab.classList.add("hidden");
        });

        activeTab.classList.toggle("hidden");
    })
})