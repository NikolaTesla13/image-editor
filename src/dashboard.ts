const dashboard_main = async () => {
    const create_new_btn = document.getElementById("new-proj");
    create_new_btn.style.height = "min-content";
    create_new_btn.onclick = () => {
        document.location.href = "../public/editor.html";
        create_new_btn.style.cursor = "pointer";
    };
    create_new_btn.onmouseover = () => {
        create_new_btn.style.backgroundColor = "gray";
        create_new_btn.style.cursor = "pointer";
    }
    create_new_btn.onmouseleave = () => {
        create_new_btn.style.backgroundColor = "#202020";
        create_new_btn.style.cursor = "auto";
    }
}

dashboard_main();